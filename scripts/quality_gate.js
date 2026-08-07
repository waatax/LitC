import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');
const scratchDir = path.join(rootDir, 'scratch');

if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

function extractData(content) {
  const results = {};
  const regex = /export const (\w+)\s*=\s*JSON\.parse\('([^'\\]*(?:\\.[^'\\]*)*)'\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    const rawString = match[2];
    try {
      const jsonString = eval(`'${rawString}'`);
      results[varName] = JSON.parse(jsonString);
    } catch (e) {
      console.error(`Error parsing ${varName}`, e);
    }
  }
  return results;
}

// 1. Read works & chapters
const worksData = extractData(fs.readFileSync(path.join(dataDir, 'works.ts'), 'utf-8'));
const works = worksData.works || [];
const chapters = worksData.chapters || [];

// 2. Read passages
let passages = [];
for (let i = 1; i <= 2; i++) {
  const file = path.join(dataDir, 'sentence_chunks', `passages_part${i}.ts`);
  if (fs.existsSync(file)) {
    const data = extractData(fs.readFileSync(file, 'utf-8'));
    if (data[`passagesPart${i}`]) {
      passages = passages.concat(data[`passagesPart${i}`]);
    }
  }
}

// 3. Read sentences
let sentences = [];
for (let i = 1; i <= 8; i++) {
  const file = path.join(dataDir, 'sentence_chunks', `part${i}.ts`);
  if (fs.existsSync(file)) {
    const data = extractData(fs.readFileSync(file, 'utf-8'));
    if (data[`sentencesPart${i}`]) {
      sentences = sentences.concat(data[`sentencesPart${i}`]);
    }
  }
}

// 4. Read readingAid
const aidMap = {};
const readingAidContent = fs.readFileSync(path.join(dataDir, 'readingAid.ts'), 'utf-8');
const aidRegex = /'([^']+)':\s*\{\s*translation:\s*"((?:\\"|[^"])*)",\s*analysis:\s*"((?:\\"|[^"])*)"/g;
let match;
while ((match = aidRegex.exec(readingAidContent)) !== null) {
  try {
    const trans = JSON.parse(`"${match[2]}"`);
    const analysis = JSON.parse(`"${match[3]}"`);
    aidMap[match[1]] = { translation: trans, analysis: analysis };
  } catch (e) {
    console.error('Error parsing reading aid entry for', match[1]);
  }
}

// Data structures for cross-referencing
const passageMap = new Map();
passages.forEach(p => passageMap.set(p.id, p));

const chapterMap = new Map();
chapters.forEach(c => chapterMap.set(c.id, c));

const workMap = new Map();
works.forEach(w => workMap.set(w.id, w));

const workIssueCounts = {};
works.forEach(w => workIssueCounts[w.id] = 0);

const issues = {
  CANONICAL_TEXT_EMPTY: [],
  CANONICAL_TEXT_STUB: [],
  TRANSLATION_MISSING: [],
  TRANSLATION_ECHO: [],
  TRANSLATION_TEMPLATE: [],
  TRANSLATION_DUPLICATE: [],
  ANALYSIS_MISSING: [],
  ANALYSIS_GENERIC: [],
  SENTENCE_ORPHAN: [],
  CHAPTER_EMPTY: [],
  WORK_EMPTY_CHAPTERS: []
};

function addIssue(type, itemType, itemId, workId, details) {
  issues[type].push({ itemType, itemId, workId, details });
  if (workId && workIssueCounts[workId] !== undefined) {
    workIssueCounts[workId]++;
  }
}

const cleanPunct = (str) => str.replace(/[，。！？；：「」『』《》〈〉（）\s]/g, '');

function checkEcho(canonical, translation) {
  if (!canonical || !translation) return false;
  const cleanCan = cleanPunct(canonical);
  const cleanTrans = cleanPunct(translation);
  if (cleanCan.length === 0) return false;
  
  // Check if first 30 chars of canonical are in translation
  if (cleanCan.length >= 30) {
    const first30 = cleanCan.substring(0, 30);
    if (cleanTrans.includes(first30)) return true;
  } else {
    if (cleanTrans.includes(cleanCan)) return true;
  }
  
  // Jaccard similarity of characters
  const canSet = new Set(cleanCan.split(''));
  const transSet = new Set(cleanTrans.split(''));
  let intersection = 0;
  for (let char of canSet) {
    if (transSet.has(char)) intersection++;
  }
  if (canSet.size === 0) return false;
  if (intersection / canSet.size > 0.8) return true;
  
  return false;
}

function getWorkIdForPassage(p) {
  const chap = chapterMap.get(p.chapterId);
  return chap ? chap.workId : null;
}

const translationSeen = new Map();

// Run checks
passages.forEach(p => {
  const workId = getWorkIdForPassage(p);
  const text = p.canonicalText || '';
  
  if (!text || text.trim().length === 0) {
    addIssue('CANONICAL_TEXT_EMPTY', 'passage', p.id, workId, 'Canonical text is empty');
  } else {
    if (/典籍經文|章節資料|資料彙編中|載上古聖賢/.test(text)) {
      addIssue('CANONICAL_TEXT_STUB', 'passage', p.id, workId, 'Contains stub placeholder');
    }
  }

  const aid = aidMap[p.id];
  if (!aid) {
    addIssue('TRANSLATION_MISSING', 'passage', p.id, workId, 'No PASSAGE_AIDS entry');
  } else {
    const trans = aid.translation || '';
    const analysis = aid.analysis || '';
    
    if (checkEcho(text, trans)) {
      addIssue('TRANSLATION_ECHO', 'passage', p.id, workId, 'Translation echoes canonical text');
    }
    
    if (trans.includes('系統初步補全') || trans.includes('詳細白話翻譯將由專家後續精校') || (trans.startsWith('在《') && trans.includes('此段文字大意為'))) {
      addIssue('TRANSLATION_TEMPLATE', 'passage', p.id, workId, 'Translation contains template string');
    }
    
    const cleanT = cleanPunct(trans);
    if (cleanT.length > 0) {
      if (translationSeen.has(cleanT)) {
        addIssue('TRANSLATION_DUPLICATE', 'passage', p.id, workId, `Duplicate of ${translationSeen.get(cleanT)}`);
      } else {
        translationSeen.set(cleanT, p.id);
      }
    }
    
    if (!analysis || analysis.length < 20) {
      addIssue('ANALYSIS_MISSING', 'passage', p.id, workId, 'Analysis empty or < 20 chars');
    } else {
      if (analysis.includes('文中的古代名詞保留了原有的歷史語境與特殊意涵') || analysis.includes('對後世產生了重要的學術啟發') || analysis.includes('先秦名物與習慣用語，需結合章節語境加以深入體會')) {
        addIssue('ANALYSIS_GENERIC', 'passage', p.id, workId, 'Analysis contains generic template string');
      }
    }
  }
});

sentences.forEach(s => {
  if (!passageMap.has(s.passageId)) {
    addIssue('SENTENCE_ORPHAN', 'sentence', s.id, null, `Orphan sentence, passage ${s.passageId} not found`);
  }
});

chapters.forEach(c => {
  if (!c.passageIds || c.passageIds.length === 0) {
    addIssue('CHAPTER_EMPTY', 'chapter', c.id, c.workId, 'Chapter has no passages');
  }
});

works.forEach(w => {
  if (!w.chapterIds || w.chapterIds.length === 0) {
    addIssue('WORK_EMPTY_CHAPTERS', 'work', w.id, w.id, 'Work has no chapters');
  }
});

fs.writeFileSync(path.join(scratchDir, 'quality_issues.json'), JSON.stringify(issues, null, 2));

const totalItems = {
  CANONICAL_TEXT_EMPTY: passages.length,
  CANONICAL_TEXT_STUB: passages.length,
  TRANSLATION_MISSING: passages.length,
  TRANSLATION_ECHO: passages.length,
  TRANSLATION_TEMPLATE: passages.length,
  TRANSLATION_DUPLICATE: passages.length,
  ANALYSIS_MISSING: passages.length,
  ANALYSIS_GENERIC: passages.length,
  SENTENCE_ORPHAN: sentences.length,
  CHAPTER_EMPTY: chapters.length,
  WORK_EMPTY_CHAPTERS: works.length
};

let passedChecks = 0;
const reportLines = [];
reportLines.push('╔══════════════════════════════════════════════════════╗');
reportLines.push('║        LitC 統一品質閘門 — 全庫掃瞄報告            ║');
reportLines.push('╚══════════════════════════════════════════════════════╝');
reportLines.push('');
reportLines.push(`掃瞄範圍: ${works.length} 部典籍 / ${chapters.length} 篇 / ${passages.length} 段 / ${sentences.length} 句`);
reportLines.push('');
reportLines.push('─── 品質指標 ───');

for (const [check, list] of Object.entries(issues)) {
  const count = list.length;
  const total = totalItems[check];
  const percent = total > 0 ? ((count / total) * 100).toFixed(2) : '0.00';
  const status = count === 0 ? '[PASS]' : '[FAIL]';
  if (count === 0) passedChecks++;
  reportLines.push(`${status} ${check.padEnd(22)}: ${String(count).padStart(5)} / ${total} (${percent}%)`);
}

reportLines.push('');
reportLines.push('─── 各典籍問題摘要 (有問題者) ───');
const problemWorks = works.filter(w => workIssueCounts[w.id] > 0).sort((a, b) => workIssueCounts[b.id] - workIssueCounts[a.id]);

if (problemWorks.length > 0) {
  problemWorks.forEach(w => {
    reportLines.push(`${(w.title || w.id).padEnd(10)} (ID: ${w.id}): ${workIssueCounts[w.id]} 個問題`);
  });
} else {
  reportLines.push('全部典籍皆無問題！');
}

reportLines.push('');
reportLines.push('═══════════════════════════════════════════════════════');
reportLines.push(`OVERALL: ${passedChecks === 11 ? 'PASS' : 'FAIL'} (${passedChecks} / 11 checks passed)`);
reportLines.push('═══════════════════════════════════════════════════════');
reportLines.push('');
reportLines.push(`詳細問題清單已儲存至 scratch/quality_issues.json`);

console.log(reportLines.join('\n'));
