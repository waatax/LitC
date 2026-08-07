// ─────────────────────────────────────────────────────────────────────
// LitC — Gemini AI Reading Aid Improvement Script
// Processes problematic passages identified by the quality gate,
// regenerates translations & analyses via Gemini, and applies them
// back to readingAid.ts.
//
// Usage:
//   node --env-file=.env scripts/ai_improve_reading_aids.js [options]
//
// Options:
//   --work <id>     Process only a specific work (e.g. --work zhuangzi)
//   --limit <n>     Cap the number of passages to process
//   --dry-run       Preview which passages would be processed, no API calls
//   --apply-only    Skip API calls, just apply existing progress to readingAid.ts
//   --batch <n>     Number of passages per write batch (default: 50)
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
const batchSize = getArg('batch') ? parseInt(getArg('batch'), 10) : 50;

// ── File paths ──
const scratchDir = path.join(rootDir, 'scratch');
const issuesPath = path.join(scratchDir, 'quality_issues.json');
const progressPath = path.join(scratchDir, 'ai_regen_progress.json');
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

// ── Load quality issues & deduplicate ──
console.log('Loading quality issues...');
const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf-8'));

const passageIssues = new Map(); // passageId -> Set of issue types
const aiRegenTypes = ['TRANSLATION_ECHO', 'TRANSLATION_TEMPLATE', 'TRANSLATION_DUPLICATE', 'ANALYSIS_GENERIC'];

for (const type of aiRegenTypes) {
  for (const issue of (issues[type] || [])) {
    if (!passageIssues.has(issue.itemId)) {
      passageIssues.set(issue.itemId, new Set());
    }
    passageIssues.get(issue.itemId).add(type);
  }
}

// ── Build processing queue (sorted by work priority) ──
const workIssueCounts = new Map();
for (const [pid, types] of passageIssues) {
  const w = getWorkForPassage(pid);
  if (w) {
    workIssueCounts.set(w.id, (workIssueCounts.get(w.id) || 0) + 1);
  }
}

// Sort works by issue count descending
const workPriority = [...workIssueCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(e => e[0]);

// Build ordered passage list
let queue = [];
for (const workId of workPriority) {
  if (targetWork && workId !== targetWork) continue;
  const workPassages = [];
  for (const [pid, types] of passageIssues) {
    const w = getWorkForPassage(pid);
    if (w && w.id === workId) {
      workPassages.push({ passageId: pid, issues: [...types], workId });
    }
  }
  // Sort by passage ID for consistency
  workPassages.sort((a, b) => a.passageId.localeCompare(b.passageId));
  queue = queue.concat(workPassages);
}

// Apply limit
if (queue.length > limit) {
  queue = queue.slice(0, limit);
}

console.log(`\nProcessing queue: ${queue.length} passages across ${new Set(queue.map(q => q.workId)).size} works`);

if (dryRun) {
  console.log('\n── DRY RUN ── Would process:');
  const byWork = {};
  queue.forEach(q => { byWork[q.workId] = (byWork[q.workId] || 0) + 1; });
  for (const [w, c] of Object.entries(byWork)) {
    const work = workMap.get(w);
    console.log(`  ${(work?.title || w).padEnd(12)} : ${c} passages`);
  }
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
  if (!process.env.GEMINI_API_KEY) {
    console.error('\n❌ GEMINI_API_KEY not set. Please create a .env file with your key:');
    console.error('   echo GEMINI_API_KEY=your-key-here > .env');
    console.error('   Then run: node --env-file=.env scripts/ai_improve_reading_aids.js');
    process.exit(1);
  }
  const { GoogleGenAI, Type } = await import('@google/genai');
  ai = new GoogleGenAI({});
}

// ── The core Gemini prompt ──
function buildPrompt(passageId, canonicalText, workTitle, chapterTitle) {
  return `你是精通中國古典文獻、思想史與訓詁學的國學大師。請對以下來自《${workTitle}》${chapterTitle ? '〈' + chapterTitle + '〉' : ''}的古文段落，生成高品質的現代漢語翻譯與結構化賞析。

## 要求

### translation（白話意譯）
- 以信達雅為準則，將文言文翻譯為流暢、準確的現代漢語
- 不可直接複製或微改原文（如僅將「曰」改為「說」）
- 翻譯須完整涵蓋原文所有語義，不可遺漏
- 用語自然、通俗易懂，避免生硬的逐字對譯

### analysis（結構化賞析）
請以下列格式輸出（每個段落用換行分隔）：

【主旨】一句話概括本段核心思想
【關鍵詞義】列出3-6個關鍵古文字詞及其釋義（格式：「詞」──釋義）
【思想脈絡】2-4句分析本段的思想內涵、論證結構或敘事手法，需結合作品整體思想體系
【延伸思考】1-2句點出本段與當代的關聯或啟示

## 原文
${canonicalText}

請確保翻譯絕不可與原文雷同，分析須具體精準，避免泛泛而談的空話套話。`;
}

// ── Call Gemini API with retry ──
async function callGemini(prompt, retries = 3) {
  const { Type } = await import('@google/genai');
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translation: { type: Type.STRING, description: '現代漢語白話翻譯' },
              analysis: { type: Type.STRING, description: '結構化賞析（含【主旨】【關鍵詞義】【思想脈絡】【延伸思考】）' }
            },
            required: ['translation', 'analysis']
          }
        }
      });
      const parsed = JSON.parse(response.text);
      if (!parsed.translation || parsed.translation.length < 10) {
        throw new Error('Translation too short or empty');
      }
      return parsed;
    } catch (err) {
      console.error(`  ⚠ Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = 2000 * Math.pow(2, attempt - 1); // exponential backoff
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// ── Process passages and call Gemini ──
if (!applyOnly) {
  let processed = 0;
  let skipped = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const { passageId, workId } = item;

    // Skip if already done
    if (progress[passageId]) {
      skipped++;
      continue;
    }

    const passage = passageMap.get(passageId);
    if (!passage || !passage.canonicalText || passage.canonicalText.length < 5) {
      console.log(`  ⏭ Skipping ${passageId}: no canonical text`);
      skipped++;
      continue;
    }

    const work = workMap.get(workId);
    const chapter = getChapterForPassage(passageId);
    const workTitle = work?.title || workId;
    const chapterTitle = chapter?.title || '';

    const pct = ((i / queue.length) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`[${pct}%] (${i + 1}/${queue.length}) ${workTitle} — ${passageId} (${elapsed}min elapsed)`);

    try {
      const prompt = buildPrompt(passageId, passage.canonicalText, workTitle, chapterTitle);
      const result = await callGemini(prompt);

      progress[passageId] = {
        translation: result.translation,
        analysis: result.analysis,
        workId,
        timestamp: new Date().toISOString()
      };
      processed++;

      // Save progress every 10 passages
      if (processed % 10 === 0) {
        saveProgress();
        console.log(`  💾 Progress saved (${processed} done, ${failed} failed, ${skipped} skipped)`);
      }

      // Rate limiting: 1s delay
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`  ❌ Failed ${passageId}: ${err.message}`);
      failed++;
      // Continue processing other passages
    }
  }

  // Final save
  saveProgress();
  console.log(`\n═══ API Phase Complete ═══`);
  console.log(`Processed: ${processed} | Skipped: ${skipped} | Failed: ${failed}`);
  console.log(`Total in progress file: ${Object.keys(progress).length}`);
}

// ── Apply progress to readingAid.ts ──
console.log('\nApplying improvements to readingAid.ts...');

const progressEntries = Object.entries(progress);
if (progressEntries.length === 0) {
  console.log('No progress entries to apply.');
  process.exit(0);
}

let readingAidContent = fs.readFileSync(readingAidPath, 'utf-8');
let applied = 0;
let applyFailed = 0;

for (const [passageId, data] of progressEntries) {
  const escapedId = passageId.replace(/[-]/g, '\\-');
  const searchRegex = new RegExp(
    `'${escapedId}'\\s*:\\s*\\{\\s*translation:\\s*"((?:\\\\.|[^"\\\\])*)",\\s*analysis:\\s*"((?:\\\\.|[^"\\\\])*)"\\s*\\}`,
    's'
  );

  if (!searchRegex.test(readingAidContent)) {
    applyFailed++;
    continue;
  }

  // Escape the replacement strings for safe insertion
  const escapedTrans = data.translation
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');

  const escapedAnalysis = data.analysis
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');

  readingAidContent = readingAidContent.replace(
    searchRegex,
    `'${passageId}': {\n    translation: "${escapedTrans}",\n    analysis: "${escapedAnalysis}"\n  }`
  );
  applied++;
}

if (applied > 0) {
  fs.writeFileSync(readingAidPath, readingAidContent, 'utf-8');
  console.log(`✅ Applied ${applied} improvements to readingAid.ts`);
  if (applyFailed > 0) {
    console.log(`⚠ ${applyFailed} entries could not be matched in readingAid.ts`);
  }
} else {
  console.log('No changes applied.');
}

console.log('\nDone! Run "npm run quality" to check the updated quality metrics.');
