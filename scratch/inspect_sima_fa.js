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

const simaChapters = chapters.filter(c => c.workId === 'si-ma-fa');
const simaPassages = passages.filter(p => simaChapters.some(c => c.id === p.chapterId));
const simaSentences = sentences.filter(s => simaPassages.some(p => p.id === s.passageId));

console.log('Sample passage object:', simaPassages[0]);
console.log('Sample sentence object:', simaSentences[0]);

console.log('\nAll 68 passages first 60 chars:');
simaPassages.forEach((p, idx) => {
  const text = (p.text || p.content || p.canonicalText || '').substring(0, 60);
  console.log(`P${idx+1} [${p.id}]: ${text}`);
});
