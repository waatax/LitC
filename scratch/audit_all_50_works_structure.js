import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');

const matchWorks = worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchChapters = worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

const works = JSON.parse(decodeURIComponent(matchWorks[1]));
const chapters = JSON.parse(decodeURIComponent(matchChapters[1]));
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

console.log('====================================================');
console.log(' LIT C FULL CORPUS (50 WORKS) CHAPTER AUDIT ');
console.log('====================================================\n');

works.forEach((w, idx) => {
  const wChs = chapters.filter(c => c.workId === w.id);
  const wPass = passages.filter(p => wChs.some(c => c.id === p.chapterId));
  const wSents = sentences.filter(s => wPass.some(p => p.id === s.passageId));

  console.log(`[${idx + 1}] ${w.title} (${w.id}) - School: ${w.schoolId}`);
  console.log(`    - 章節數: ${wChs.length} (${wChs.map(c => c.title).slice(0, 5).join(', ')}${wChs.length > 5 ? '...' : ''})`);
  console.log(`    - 段落數: ${wPass.length}`);
  console.log(`    - 句子數: ${wSents.length}`);
  console.log(`    - 總字數: ${w.totalChars || 'N/A'}`);
});
