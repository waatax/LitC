import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');

const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

const passages = JSON.parse(decodeURIComponent(matchPassages[1]));
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

const p68 = passages.find(p => p.id === 'si-ma-fa_ch-1_p-68');
const p68Sents = sentences.filter(s => s.passageId === 'si-ma-fa_ch-1_p-68');

console.log('P68 text:', p68 ? p68.text : 'None');
console.log('P68 sentences:', p68Sents);
