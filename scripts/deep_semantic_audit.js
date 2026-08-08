// ─────────────────────────────────────────────────────────────────────
// LitC — Semantic Audit & Correction Script
// Processes passages of a target work and regenerates deeply researched
// translations and analyses via Gemini, overriding the existing readingAid.ts.
//
// Usage:
//   node --env-file=.env scripts/deep_semantic_audit.js --work <id> [options]
//
// Options:
//   --limit <n>     Cap the number of passages to process
//   --dry-run       Preview which passages would be processed, no API calls
//   --apply-only    Skip API calls, just apply existing progress to readingAid.ts
//   --batch <n>     Number of passages per write batch (default: 5)
// ─────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ── Parse CLI args ──
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}
const hasFlag = (name) => args.includes(`--${name}`);

const targetWork = getArg('work');
const limit = getArg('limit') ? parseInt(getArg('limit'), 10) : Infinity;
const dryRun = hasFlag('dry-run');
const applyOnly = hasFlag('apply-only');
const batchSize = getArg('batch') ? parseInt(getArg('batch'), 10) : 5;

if (!targetWork && !applyOnly) {
  console.error("Please specify a target work using --work <id>");
  process.exit(1);
}

// ── File paths ──
const scratchDir = path.join(rootDir, 'scratch');
const progressPath = path.join(scratchDir, 'semantic_audit_progress.json');
const readingAidPath = path.join(rootDir, 'src', 'data', 'readingAid.ts');
const dataDir = path.join(rootDir, 'src', 'data');

if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

// ── Helper: extract JSON.parse('...') data from .ts files ──
function extractData(content) {
  const results = {};
  const regex = /export const (\w+)\s*=\s*JSON\.parse\('([^'\\]*(?:\\.[^'\\]*)*)'\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    try {
      const jsonString = eval(`'${match[2]}'`);
      results[match[1]] = JSON.parse(jsonString);
    } catch (e) {
      console.error(`Error parsing ${match[1]}:`, e.message);
    }
  }
  return results;
}

// ── Load corpus data ──
console.log('Loading corpus data...');
const worksData = extractData(fs.readFileSync(path.join(dataDir, 'works.ts'), 'utf-8'));
const works = worksData.works || [];
const chapters = worksData.chapters || [];

let passages = [];
for (let i = 1; i <= 2; i++) {
  const file = path.join(dataDir, 'sentence_chunks', `passages_part${i}.ts`);
  if (fs.existsSync(file)) {
    const data = extractData(fs.readFileSync(file, 'utf-8'));
    if (data[`passagesPart${i}`]) passages = passages.concat(data[`passagesPart${i}`]);
  }
}

const passageMap = new Map();
passages.forEach(p => passageMap.set(p.id, p));
const chapterMap = new Map();
chapters.forEach(c => chapterMap.set(c.id, c));
const workMap = new Map();
works.forEach(w => workMap.set(w.id, w));

function getWorkForPassage(passageId) {
  const p = passageMap.get(passageId);
  if (!p) return null;
  const ch = chapterMap.get(p.chapterId);
  if (!ch) return null;
  return workMap.get(ch.workId);
}

function getChapterForPassage(passageId) {
  const p = passageMap.get(passageId);
  if (!p) return null;
  return chapterMap.get(p.chapterId);
}

// ── Build processing queue ──
let queue = [];
if (!applyOnly) {
  for (const p of passages) {
    const w = getWorkForPassage(p.id);
    if (w && w.id === targetWork) {
       queue.push({ passageId: p.id, workId: w.id });
    }
  }
  queue.sort((a, b) => a.passageId.localeCompare(b.passageId));
  if (queue.length > limit) {
    queue = queue.slice(0, limit);
  }
  console.log(`\nProcessing queue: ${queue.length} passages for work ${targetWork}`);
}

if (dryRun) {
  process.exit(0);
}

// ── Load or initialize progress ──
let progress = {};
if (fs.existsSync(progressPath)) {
  progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  console.log(`Loaded existing progress: ${Object.keys(progress).length} passages already done.`);
}

function saveProgress() {
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

// ── Gemini API setup ──
let ai = null;
if (!applyOnly) {
  // Try to load dynamically
  const { GoogleGenAI, Type } = await import('@google/genai');
  ai = new GoogleGenAI({});
}

// ── The core Gemini prompt ──
function buildPrompt(passageId, canonicalText, workTitle, chapterTitle) {
  return `你是極具學術素養的國學大師與文獻學家。我們正在針對古籍《${workTitle}》進行深度的白話文與解析校閱。
請對以下來自《${workTitle}》${chapterTitle ? '〈' + chapterTitle + '〉' : ''}的古文段落，回顧歷史學術註疏與網上權威譯本，並給出最嚴謹的白話文翻譯與結構化解析。

## 原文：
「${canonicalText}」

## 要求
### translation（白話意譯）
- 譯文必須精確無誤，不可遺漏古文原文中的任何專有名詞或虛實詞的關鍵涵義。
- 請避免過度通俗口語化，保留經典應有的哲理深度。
- 如果是古代軍事、法家或名家術語，請依照傳統訓詁學進行翻譯。

### analysis（思想解析）
- 分析這段文字的核心哲學觀、文學價值或實用意義。
- 至少寫出一段 50 字以上的深度評析。
- 若有典故，請順帶指出。

## JSON 輸出格式
請務必輸出純 JSON 格式，不要包含 \`\`\`json 標記，確保可被 JSON.parse 解析：
{
  "translation": "...",
  "analysis": "..."
}`;
}

const isMock = hasFlag('mock');

async function run() {
  if (applyOnly) {
    console.log("Skipping API calls. Applying directly.");
    applyToReadingAid();
    return;
  }

  let processedCount = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (progress[item.passageId]) {
      console.log(`[${i+1}/${queue.length}] ${item.passageId} already processed, skipping.`);
      continue;
    }

    const p = passageMap.get(item.passageId);
    const w = getWorkForPassage(item.passageId);
    const ch = getChapterForPassage(item.passageId);
    
    if (!p || !w) continue;
    
    console.log(`[${i+1}/${queue.length}] Processing ${item.passageId} ...`);
    
    try {
      let result;
      if (isMock) {
        result = {
          translation: `【深度校正版翻譯】這是一段經過虛擬國學大師重新校訂的白話文，針對《${w.title}》的語意進行了嚴謹的學術還原。原文：「${p.canonicalText.substring(0, 10)}...」`,
          analysis: `【深度校正版解析】本段文字深刻反映了${w.title}的核心思想，我們重新比對了網上多個權威註疏版本，確認此處的哲學意涵非常深遠，不可輕忽。`
        };
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: buildPrompt(item.passageId, p.canonicalText, w.title, ch?.title),
          config: {
            temperature: 0.2,
          }
        });
        
        let text = response.text;
        if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
        text = text.trim();
        result = JSON.parse(text);
      }
      
      if (!result.translation || !result.analysis) {
        throw new Error("Missing translation or analysis field.");
      }
      
      progress[item.passageId] = {
        translation: result.translation,
        analysis: result.analysis
      };
      
      processedCount++;
      if (processedCount % batchSize === 0) {
        saveProgress();
        console.log(`Saved batch of ${batchSize} passages.`);
      }
      
      // Delay to respect rate limits
      if (!isMock) await new Promise(r => setTimeout(r, 2000));
      
    } catch (e) {
      console.error(`Failed to process ${item.passageId}:`, e.message);
      saveProgress(); // save whatever we have
    }
  }
  
  saveProgress();
  console.log('Finished AI generation phase.');
  applyToReadingAid();
}

function applyToReadingAid() {
  if (Object.keys(progress).length === 0) {
    console.log("No progress to apply.");
    return;
  }
  
  console.log("Reading existing readingAid.ts...");
  const content = fs.readFileSync(readingAidPath, 'utf-8');
  const aidsData = extractData(content);
  const aids = aidsData.PASSAGE_AIDS || {};
  
  let appliedCount = 0;
  for (const [pid, data] of Object.entries(progress)) {
    if (aids[pid]) {
      aids[pid].translation = data.translation;
      aids[pid].analysis = data.analysis;
      appliedCount++;
    }
  }
  
  if (appliedCount > 0) {
    const newContent = `import type { PassageReadingAid } from '../types/content';\n\nexport const PASSAGE_AIDS: Record<string, PassageReadingAid> = JSON.parse(String.raw\`${JSON.stringify(aids).replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\`);\n`;
    fs.writeFileSync(readingAidPath, newContent, 'utf-8');
    console.log(`Successfully applied ${appliedCount} deep semantic updates to readingAid.ts.`);
  } else {
    console.log("No matching passage IDs found in readingAid.ts to apply.");
  }
}

run();
