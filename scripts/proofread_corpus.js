import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}
const hasFlag = (name) => args.includes(`--${name}`);

const limit = getArg('limit') ? parseInt(getArg('limit'), 10) : Infinity;
const dryRun = hasFlag('dry-run');

const markdownPath = path.join(rootDir, 'Literature Classic.md');
const reportPath = path.join(rootDir, 'corpus_audit_report.md');
const progressPath = path.join(rootDir, 'scratch', 'proofread_progress.json');

if (!fs.existsSync(path.join(rootDir, 'scratch'))) {
  fs.mkdirSync(path.join(rootDir, 'scratch'), { recursive: true });
}

const markdownText = fs.readFileSync(markdownPath, 'utf-8');

// Parse all chapters
const queue = [];
let currentWork = '';

const lines = markdownText.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const wMatch = line.match(/^##\s*(.+)/);
  if (wMatch && wMatch[1].match(/^[一二三四五六七八九十]+、/)) {
    currentWork = wMatch[1].replace(/^[一二三四五六七八九十]+、/, '').replace('全本', '').replace('選篇', '').trim();
    continue;
  }
  
  const cMatch = line.match(/^###\s*(.+)/);
  if (cMatch && currentWork) {
    const chapterTitle = cMatch[1].trim();
    // Look ahead for 【原文】
    let j = i + 1;
    let originalText = '';
    while (j < lines.length && !lines[j].startsWith('### ') && !lines[j].startsWith('## ')) {
      if (lines[j].startsWith('【原文】') || lines[j].startsWith('【經文】')) {
        let k = j;
        let textLines = [];
        // The text might be on the same line or next line
        let firstLine = lines[k].replace(/【(?:原文|經文)】\s*/, '').trim();
        if (firstLine) textLines.push(firstLine);
        k++;
        while (k < lines.length && !lines[k].startsWith('【') && !lines[k].startsWith('#')) {
          if (lines[k].trim()) textLines.push(lines[k].trim());
          k++;
        }
        originalText = textLines.join('');
        break;
      }
      j++;
    }
    
    if (originalText) {
      queue.push({
        work: currentWork,
        chapter: chapterTitle,
        text: originalText
      });
    }
  }
}

console.log(`Found ${queue.length} chapters to audit.`);

let progress = {};
if (fs.existsSync(progressPath)) {
  progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  console.log(`Loaded existing progress: ${Object.keys(progress).length} chapters already done.`);
}

function saveProgress() {
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

let ai = null;
if (!dryRun) {
  import('@google/genai').then(({ GoogleGenAI }) => {
    ai = new GoogleGenAI({});
    run();
  }).catch(e => {
    console.error("Failed to load genai:", e);
    process.exit(1);
  });
} else {
  run();
}

function buildPrompt(work, chapter, text) {
  return `你是頂尖的中國古典文獻學家與校勘學家。我們正在對《${work}》的文本進行權威校對。
請針對以下來自《${work}》〈${chapter}〉的原文進行深度校勘（Cross-check against standard authoritative editions like 中華書局 or 四部叢刊）。

## 原文：
「${text}」

## 任務：
請指出原文中是否有：
1. OCR 辨識錯誤（如 己/已/巳，日/曰 等形近字誤植）
2. 缺漏字、衍文（多出的字）
3. 明顯的標點錯誤或錯簡

## JSON 輸出格式
若原文完全正確無誤，請回傳：
{
  "isCorrect": true,
  "corrections": []
}

若發現疑似錯誤，請回傳：
{
  "isCorrect": false,
  "corrections": [
    {
      "original": "錯誤的字詞或片段",
      "proposed": "建議修正的字詞",
      "reason": "修正理由，請引述權威版本或訓詁學依據"
    }
  ]
}

請務必只輸出純 JSON 格式，不要包含 \`\`\`json 標記。`;
}

async function run() {
  const limitQueue = queue.slice(0, limit);
  console.log(`Processing ${limitQueue.length} chapters...`);
  
  let processedCount = 0;
  for (let i = 0; i < limitQueue.length; i++) {
    const item = limitQueue[i];
    const key = `${item.work}-${item.chapter}`;
    
    if (progress[key]) {
      console.log(`[${i+1}/${limitQueue.length}] ${key} already processed.`);
      continue;
    }
    
    console.log(`[${i+1}/${limitQueue.length}] Auditing ${key}...`);
    
    if (dryRun) {
      console.log(`Dry run: skipping API for ${key}`);
      continue;
    }
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: buildPrompt(item.work, item.chapter, item.text),
        config: { temperature: 0.1 }
      });
      
      let text = response.text;
      if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
      text = text.trim();
      const result = JSON.parse(text);
      
      progress[key] = {
        work: item.work,
        chapter: item.chapter,
        isCorrect: result.isCorrect,
        corrections: result.corrections || []
      };
      
      processedCount++;
      saveProgress();
      
      // Delay to respect rate limits
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (e) {
      console.error(`Failed to process ${key}:`, e.message);
      saveProgress();
    }
  }
  
  // Generate Report
  let report = `# 古文全庫校勘報告\n\n`;
  let errorCount = 0;
  for (const [key, data] of Object.entries(progress)) {
    if (!data.isCorrect && data.corrections.length > 0) {
      errorCount++;
      report += `## 《${data.work}》〈${data.chapter}〉\n\n`;
      data.corrections.forEach(c => {
        report += `- **原文**：\`${c.original}\` ➔ **建議**：\`${c.proposed}\`\n`;
        report += `  - **理由**：${c.reason}\n\n`;
      });
    }
  }
  
  if (errorCount === 0) {
    report += `🎉 太棒了！目前掃描的章節皆與權威版本一致，無發現明顯錯誤。\n`;
  }
  
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\nAudit finished! Found issues in ${errorCount} chapters. Report saved to ${reportPath}`);
}
