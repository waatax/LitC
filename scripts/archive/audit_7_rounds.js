import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

const unescapeTsString = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

const aids = new Map();
const aidPattern = /'([^']+)'\s*:\s*\{\s*["']?translation["']?\s*:\s*"((?:\\.|[^"\\])*)",\s*["']?analysis["']?\s*:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: unescapeTsString(match[2]), analysis: unescapeTsString(match[3]) });
}

// 50 Works list reverse order (from 50 down to 1)
const reversedWorks = [...works].reverse();

const groups = [
  { group: 1, works: reversedWorks.slice(0, 7) },   // 50..44
  { group: 2, works: reversedWorks.slice(7, 14) },  // 43..37
  { group: 3, works: reversedWorks.slice(14, 21) }, // 36..30
  { group: 4, works: reversedWorks.slice(21, 28) }, // 29..23
  { group: 5, works: reversedWorks.slice(28, 35) }, // 22..16
  { group: 6, works: reversedWorks.slice(35, 42) }, // 15..9
  { group: 7, works: reversedWorks.slice(42, 50) }  // 8..1
];

function auditWork(w) {
  const wChs = chapters.filter(c => c.workId === w.id);
  const wChIds = new Set(wChs.map(c => c.id));
  const wPassages = passages.filter(p => wChIds.has(p.chapterId));
  const wSentences = sentences.filter(s => s.id.startsWith(`${w.id}_`));

  let ancientIssues = [];
  let translationIssues = [];
  let analysisIssues = [];

  // 1. 古文經典文本校正
  for (const p of wPassages) {
    if (!p.canonicalText || !p.canonicalText.trim()) {
      ancientIssues.push({ passageId: p.id, issue: '空段落原文' });
    }
    if (/\ufffd|\?函|甇文|嚗/u.test(p.canonicalText)) {
      ancientIssues.push({ passageId: p.id, issue: '原文含亂碼或無效字符' });
    }
  }
  for (const s of wSentences) {
    if (!s.canonicalText || !s.canonicalText.trim()) {
      ancientIssues.push({ sentenceId: s.id, issue: '空句子原文' });
    }
  }

  // 2. 白話文確認
  for (const p of wPassages) {
    const aid = aids.get(p.id);
    if (!aid || !aid.translation || !aid.translation.trim()) {
      translationIssues.push({ passageId: p.id, issue: '缺少白話文翻譯' });
    } else {
      if (/\ufffd|\?函|甇文|嚗/u.test(aid.translation)) {
        translationIssues.push({ passageId: p.id, issue: '白話文含亂碼' });
      }
      if (/【白話翻譯】|所謂，|孫孔子/.test(aid.translation)) {
        translationIssues.push({ passageId: p.id, issue: '白話文含機械式錯誤替換殘留' });
      }
    }
  }

  // 3. 解析確認
  for (const p of wPassages) {
    const aid = aids.get(p.id);
    if (!aid || !aid.analysis || !aid.analysis.trim()) {
      analysisIssues.push({ passageId: p.id, issue: '缺少解析' });
    } else {
      if (/\ufffd|\?函|甇文|嚗/u.test(aid.analysis)) {
        analysisIssues.push({ passageId: p.id, issue: '解析含亂碼' });
      }
      if (/經文核心句|論述層次分明/.test(aid.analysis) && /深入論述|探索.*之道/.test(aid.analysis)) {
        analysisIssues.push({ passageId: p.id, issue: '解析使用過度通用之模板' });
      }
    }
  }

  return {
    id: w.id,
    title: w.title,
    schoolId: w.schoolId,
    chaptersCount: wChs.length,
    passagesCount: wPassages.length,
    sentencesCount: wSentences.length,
    charsCount: w.totalChars,
    ancientIssues,
    translationIssues,
    analysisIssues,
    isClean: ancientIssues.length === 0 && translationIssues.length === 0 && analysisIssues.length === 0
  };
}

const auditReport = [];

for (const g of groups) {
  const groupResults = g.works.map(w => auditWork(w));
  auditReport.push({
    round: g.group,
    worksCount: g.works.length,
    results: groupResults
  });
}

fs.writeFileSync(path.join(root, 'scratch/audit_7_rounds_results.json'), JSON.stringify(auditReport, null, 2));
console.log('Report saved to scratch/audit_7_rounds_results.json');
