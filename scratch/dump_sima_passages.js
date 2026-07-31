import fs from 'fs';

// Read existing works.ts
const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');

const matchWorks = worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchChapters = worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

const works = JSON.parse(decodeURIComponent(matchWorks[1]));
const chapters = JSON.parse(decodeURIComponent(matchChapters[1]));
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

// Inspect all Sima Fa passages
const simaPassages = passages.filter(p => p.id.startsWith('si-ma-fa_'));
console.log(`Found ${simaPassages.length} passages for Sima Fa.`);

simaPassages.forEach((p, idx) => {
  const pSents = sentences.filter(s => s.passageId === p.id);
  const text = pSents.map(s => s.canonicalText).join('');
  console.log(`P${idx+1} [${p.id}]: (${pSents.length} sents) ${text.substring(0, 45)}...`);
});
