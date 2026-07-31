import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

const weiSents = sentences.filter(s => s.id.startsWith('wei-liao-zi_'));

console.log(`Found ${weiSents.length} sentences for Wei Liao Zi.`);
weiSents.forEach((s, idx) => {
  console.log(`[S${idx + 1}] (${s.passageId}) -> ${s.canonicalText}`);
});
