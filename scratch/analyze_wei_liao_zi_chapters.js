import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

const passages = JSON.parse(decodeURIComponent(matchPassages[1]));
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

const weiPassages = passages.filter(p => p.id.startsWith('wei-liao-zi_'));

console.log(`Analyzing ${weiPassages.length} passages for Wei Liao Zi:\n`);

weiPassages.forEach((p, idx) => {
  const pSents = sentences.filter(s => s.passageId === p.id);
  const text = pSents.map(s => s.canonicalText).join(' ');
  console.log(`[P${idx + 1}] (${p.id}): ${text.substring(0, 60)}...`);
});
