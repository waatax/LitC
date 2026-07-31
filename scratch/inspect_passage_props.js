import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));

const pSample = passages.find(p => p.id.startsWith('si-ma-fa_') || p.id.startsWith('art-of-war_'));
console.log('Sample Passage keys:', Object.keys(pSample));
console.log('Sample Passage:', pSample);
