import fs from 'fs';
import path from 'path';

// ─── Corpus Quality Gate ───
// Single-command quality verification for all 51 works
// Usage: node scripts/corpus_quality_gate.js

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const works = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][0][1]));
const chapters = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][1][1]));

const p1 = decodeFileJson(path.join(root, 'src/data/sentence_chunks/passages_part1.ts')) || [];
const p2 = decodeFileJson(path.join(root, 'src/data/sentence_chunks/passages_part2.ts')) || [];
const passages = [...p1, ...p2];

const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');
const exportIdx = aidSource.indexOf('export function getPassageReadingAid');
const aidBody = aidSource.slice(0, exportIdx);

// Parse PASSAGE_AIDS
const aidContentMap = new Map();
const aidPattern = /'([^']+)':\s*\{\s*translation:\s*"((?:\\"|[^"])*)",\s*analysis:\s*"((?:\\"|[^"])*)"\s*\}/g;
let m;
while ((m = aidPattern.exec(aidBody)) !== null) {
  aidContentMap.set(m[1], { translation: m[2], analysis: m[3] });
}

const workByChapter = new Map();
works.forEach(w => w.chapterIds.forEach(c => workByChapter.set(c, w.id)));

// Quality checks per passage
let totalPassages = 0;
let echoCount = 0;
let genericAidCount = 0;
let noAidCount = 0;
let shortTextCount = 0;
let placeholderCount = 0;

const placeholderPatterns = ['典籍經文', '載上古聖賢', '資料彙編中', '章節資料'];
const genericPatterns = ['章節資料彙編中', '典籍經文', '載上古聖賢'];
const romanizedPatterns = ['chun-qiu', 'han-fei', 'hou-han', 'shu-jing', 'shi-jing', 'li-ji', 'guo-yu', 'yan-tie', 'lie-nv', 'yue-jue', 'wu-yue', 'yanzi', 'xijing', 'mutianzi', 'gu-san', 'yandanzi', 'guliang', 'gongyang', 'dong-guan', 'qian-han', 'lost-book'];

const workStats = {};
works.forEach(w => workStats[w.id] = { title: w.title, total: 0, echo: 0, generic: 0, noAid: 0, short: 0, placeholder: 0 });

passages.forEach(p => {
  const wId = workByChapter.get(p.chapterId);
  if (!wId || !workStats[wId]) return;
  totalPassages++;
  const s = workStats[wId];
  s.total++;

  const text = p.canonicalText || '';
  if (text.length < 30) { shortTextCount++; s.short++; }
  if (placeholderPatterns.some(pat => text.includes(pat))) { placeholderCount++; s.placeholder++; }

  const aid = aidContentMap.get(p.id);
  if (!aid) {
    noAidCount++;
    s.noAid++;
  } else {
    // Echo check: translation contains a significant portion of original text
    if (text.length > 10 && aid.translation && aid.translation.includes(text.substring(0, Math.min(20, text.length)))) {
      echoCount++;
      s.echo++;
    }
    // Generic check
    const combined = (aid.translation || '') + ' ' + (aid.analysis || '');
    if (genericPatterns.some(pat => combined.includes(pat)) || romanizedPatterns.some(pat => combined.includes(pat))) {
      genericAidCount++;
      s.generic++;
    }
  }
});

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║     LitC Corpus Quality Gate — Final Report         ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

console.log(`Total Works:     ${works.length}`);
console.log(`Total Passages:  ${totalPassages}`);
console.log(`Explicit Aids:   ${aidContentMap.size}\n`);

const echoRate = (echoCount / totalPassages * 100).toFixed(1);
const genericRate = (genericAidCount / totalPassages * 100).toFixed(1);
const noAidRate = (noAidCount / totalPassages * 100).toFixed(1);
const placeholderRate = (placeholderCount / totalPassages * 100).toFixed(1);

console.log("─── Quality Metrics ───");
console.log(`Echo Translations:    ${echoCount} (${echoRate}%)  ${echoCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Generic Aids:         ${genericAidCount} (${genericRate}%)  ${genericAidCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`No Explicit Aid:      ${noAidCount} (${noAidRate}%)  ${noAidCount === 0 ? '✅ PASS' : '⚠️ WARN'}`);
console.log(`Placeholder Text:     ${placeholderCount} (${placeholderRate}%)  ${placeholderCount === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Short Text (<30ch):   ${shortTextCount}\n`);

// Per-work breakdown for failures
const failedWorks = Object.entries(workStats)
  .filter(([_, s]) => s.echo > 0 || s.generic > 0 || s.placeholder > 0)
  .sort(([_, a], [__, b]) => (b.echo + b.generic + b.placeholder) - (a.echo + a.generic + a.placeholder));

if (failedWorks.length > 0) {
  console.log("─── Works Requiring Attention ───");
  console.table(failedWorks.map(([id, s]) => ({
    Title: s.title,
    Total: s.total,
    Echo: s.echo,
    Generic: s.generic,
    NoAid: s.noAid,
    Placeholder: s.placeholder,
    'EchoRate%': s.total > 0 ? Math.round(s.echo / s.total * 100) + '%' : '0%'
  })));
}

const overall = echoCount === 0 && genericAidCount === 0 && placeholderCount === 0;
console.log(`\n${'═'.repeat(50)}`);
console.log(`OVERALL RESULT: ${overall ? '✅ ALL QUALITY GATES PASSED' : '❌ QUALITY GATES FAILED'}`);
console.log(`${'═'.repeat(50)}`);

process.exit(overall ? 0 : 1);
