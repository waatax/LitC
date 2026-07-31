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

const weiWork = works.find(w => w.id === 'wei-liao-zi');
const weiChs = chapters.filter(c => c.workId === 'wei-liao-zi');
const weiPass = passages.filter(p => weiChs.some(c => c.id === p.chapterId));

console.log('=== Wei Liao Zi Current State ===');
console.log('Work:', weiWork);
console.log('Chapters:', weiChs);
console.log(`Total Passages: ${weiPass.length}`);

weiPass.forEach((p, idx) => {
  const pSents = sentences.filter(s => s.passageId === p.id);
  console.log(`\nPassage ${idx + 1} (${p.id}): [${p.chapterId}]`);
  console.log('Text preview:', (p.text || p.originalText || '').substring(0, 80));
});
