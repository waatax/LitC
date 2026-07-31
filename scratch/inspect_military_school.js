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

const militaryWorks = works.filter(w => w.schoolId === 'military');

console.log('=== Military School Works Overview ===');
console.log(`Total Military Works: ${militaryWorks.length}\n`);

militaryWorks.forEach(w => {
  const wChs = chapters.filter(c => c.workId === w.id);
  const wPass = passages.filter(p => wChs.some(c => c.id === p.chapterId));
  const wSents = sentences.filter(s => wPass.some(p => p.id === s.passageId));
  console.log(`- ${w.title} (${w.id}): ${wChs.length} chapters, ${wPass.length} passages, ${wSents.length} sentences, totalChars: ${w.totalChars}`);
});
