import fs from 'fs';
import path from 'path';
const root = process.cwd();

const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const p1Source = fs.readFileSync(path.join(root, 'src/data/sentence_chunks/passages_part1.ts'), 'utf8');
const p2Source = fs.readFileSync(path.join(root, 'src/data/sentence_chunks/passages_part2.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');

const works = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][0][1]));
const chapters = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][1][1]));
const p1 = JSON.parse(decodeURIComponent([...p1Source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][0][1]));
const p2 = JSON.parse(decodeURIComponent([...p2Source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][0][1]));
const passages = [...p1, ...p2];

// Parse PASSAGE_AIDS keys
const aids = new Set();
const aidPattern = /'([^']+)'\s*:\s*\{/g;
let aidMatch;
const exportIdx = aidSource.indexOf('export function getPassageReadingAid');
const aidBody = aidSource.slice(0, exportIdx);
while ((aidMatch = aidPattern.exec(aidBody)) !== null) {
  aids.add(aidMatch[1]);
}

// Parse aid content for quality check
const aidContentMap = new Map();
const aidContentPattern = /'([^']+)':\s*\{\s*translation:\s*"((?:\\"|[^"])*)",\s*analysis:\s*"((?:\\"|[^"])*)"\s*\}/g;
while ((aidMatch = aidContentPattern.exec(aidBody)) !== null) {
  aidContentMap.set(aidMatch[1], { translation: aidMatch[2], analysis: aidMatch[3] });
}

const workByChapter = new Map();
works.forEach(w => w.chapterIds.forEach(c => workByChapter.set(c, w.id)));

const chaptersByWork = new Map();
chapters.forEach(c => {
  if (!chaptersByWork.has(c.workId)) chaptersByWork.set(c.workId, []);
  chaptersByWork.get(c.workId).push(c);
});

const placeholderPatterns = ['典籍經文', '載上古聖賢', '資料彙編中', '章節資料'];
const genericAidPatterns = ['章節資料彙編中', '典籍經文', '載上古聖賢'];
const romanizedPatterns = ['chun-qiu', 'han-fei', 'hou-han', 'shu-jing', 'shi-jing', 'li-ji', 'guo-yu', 'yan-tie', 'lie-nv', 'yue-jue', 'wu-yue', 'yanzi', 'xijing', 'mutianzi', 'gu-san', 'yandanzi', 'guliang', 'gongyang', 'dong-guan', 'qian-han'];

const stats = {};
works.forEach(w => {
  stats[w.id] = {
    title: w.title,
    schoolId: w.schoolId || '',
    totalChapters: (chaptersByWork.get(w.id) || []).length,
    totalPassages: 0,
    shortPassages: 0,      // canonicalText < 30 chars
    placeholderPassages: 0, // contain placeholder text
    startsWithBook: 0,      // starts with 《
    totalLen: 0,
    hasExplicitAid: 0,      // has entry in PASSAGE_AIDS
    genericAid: 0,          // aid contains generic template text
    romanizedAid: 0,        // aid contains romanized work IDs
    echoesOriginal: 0       // translation just echoes canonicalText
  };
});

passages.forEach(p => {
  const wId = workByChapter.get(p.chapterId);
  if (!wId || !stats[wId]) return;
  const s = stats[wId];
  s.totalPassages++;

  const text = p.canonicalText || '';
  s.totalLen += text.length;
  if (text.length < 30) s.shortPassages++;
  if (placeholderPatterns.some(pat => text.includes(pat))) s.placeholderPassages++;
  if (text.startsWith('《')) s.startsWithBook++;

  if (aids.has(p.id)) {
    s.hasExplicitAid++;
    const aidData = aidContentMap.get(p.id);
    if (aidData) {
      const combined = (aidData.translation || '') + ' ' + (aidData.analysis || '');
      if (genericAidPatterns.some(pat => combined.includes(pat))) s.genericAid++;
      if (romanizedPatterns.some(pat => combined.includes(pat))) s.romanizedAid++;
      // Check if translation just echoes original
      if (aidData.translation && text && aidData.translation.includes(text.substring(0, 20))) s.echoesOriginal++;
    }
  }
});

// Classification
const QUALITY_LEVELS = {
  GOLD: '🥇 Gold',
  SILVER: '🥈 Silver',
  BRONZE: '🥉 Bronze',
  CRITICAL: '🔴 Critical'
};

console.log("=== LitC COMPREHENSIVE CORPUS FORENSIC AUDIT ===\n");
console.log(`Total Works: ${works.length}`);
console.log(`Total Passages: ${passages.length}`);
console.log(`Total Explicit Reading Aids: ${aids.size}\n`);

const results = works.map(w => {
  const s = stats[w.id];
  const avgLen = s.totalPassages > 0 ? Math.round(s.totalLen / s.totalPassages) : 0;
  const aidCoverage = s.totalPassages > 0 ? Math.round(s.hasExplicitAid / s.totalPassages * 100) : 0;
  const placeholderRate = s.totalPassages > 0 ? Math.round(s.placeholderPassages / s.totalPassages * 100) : 0;
  const genericRate = s.hasExplicitAid > 0 ? Math.round(s.genericAid / s.hasExplicitAid * 100) : 0;

  let quality;
  if (avgLen > 50 && placeholderRate === 0 && aidCoverage > 80 && genericRate < 20) quality = QUALITY_LEVELS.GOLD;
  else if (avgLen > 30 && placeholderRate < 30 && aidCoverage > 50) quality = QUALITY_LEVELS.SILVER;
  else if (aidCoverage > 0 || avgLen > 20) quality = QUALITY_LEVELS.BRONZE;
  else quality = QUALITY_LEVELS.CRITICAL;

  return {
    ID: w.id,
    Title: w.title,
    School: s.schoolId,
    Chs: s.totalChapters,
    Psg: s.totalPassages,
    AvgLen: avgLen,
    'Short%': s.totalPassages > 0 ? Math.round(s.shortPassages / s.totalPassages * 100) + '%' : '0%',
    'Placeholder%': placeholderRate + '%',
    'AidCov%': aidCoverage + '%',
    'GenericAid%': genericRate + '%',
    'Romanized': s.romanizedAid,
    'Echoes': s.echoesOriginal,
    Quality: quality
  };
});

console.table(results);

// Summary by quality level
const goldWorks = results.filter(r => r.Quality === QUALITY_LEVELS.GOLD);
const silverWorks = results.filter(r => r.Quality === QUALITY_LEVELS.SILVER);
const bronzeWorks = results.filter(r => r.Quality === QUALITY_LEVELS.BRONZE);
const criticalWorks = results.filter(r => r.Quality === QUALITY_LEVELS.CRITICAL);

console.log(`\n=== QUALITY DISTRIBUTION ===`);
console.log(`🥇 Gold (real text + quality aids): ${goldWorks.length} works — ${goldWorks.map(r => r.Title).join(', ')}`);
console.log(`🥈 Silver (partial real text/aids): ${silverWorks.length} works — ${silverWorks.map(r => r.Title).join(', ')}`);
console.log(`🥉 Bronze (some aids, short text): ${bronzeWorks.length} works — ${bronzeWorks.map(r => r.Title).join(', ')}`);
console.log(`🔴 Critical (placeholder/no aids): ${criticalWorks.length} works — ${criticalWorks.map(r => r.Title).join(', ')}`);

// Save JSON for plan
fs.writeFileSync('scratch/forensic_audit_results.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\nSaved audit results to scratch/forensic_audit_results.json');
