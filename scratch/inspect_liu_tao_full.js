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

const liuWork = works.find(w => w.id === 'liu-tao');
const liuChs = chapters.filter(c => c.workId === 'liu-tao');
const liuPass = passages.filter(p => liuChs.some(c => c.id === p.chapterId));

console.log('=== Liu Tao Current State ===');
console.log('Work:', liuWork);
console.log('Chapters:', liuChs);
console.log(`Total Passages: ${liuPass.length}`);

liuPass.forEach((p, idx) => {
  const pSents = sentences.filter(s => s.passageId === p.id);
  const text = pSents.map(s => s.canonicalText).join(' ');
  console.log(`\nPassage ${idx + 1} (${p.id}): [${p.chapterId}]`);
  console.log('Text:', text);
});
