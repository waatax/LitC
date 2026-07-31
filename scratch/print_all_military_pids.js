import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));

const milIds = ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'];

const result = {};
milIds.forEach(id => {
  result[id] = passages.filter(p => p.chapterId.startsWith(id)).map(p => p.id);
});

fs.writeFileSync('scratch/military_pids.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Saved all military passage IDs to scratch/military_pids.json.');
