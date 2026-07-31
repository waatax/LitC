import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));

['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'].forEach(id => {
  const pList = passages.filter(p => p.chapterId.startsWith(id));
  console.log(`\n=== Work ${id} === (${pList.length} passages)`);
  console.log('Sample IDs:', pList.slice(0, 5).map(p => p.id));
  console.log('Last IDs:', pList.slice(-3).map(p => p.id));
});
