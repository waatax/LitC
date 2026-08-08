import fs from 'fs';

const readingAidTs = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');

const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));

const milWorkIds = ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'];
const milPassages = passages.filter(p => milWorkIds.some(wId => p.chapterId.startsWith(wId)));

console.log('====================================================');
console.log(' MILITARY SCHOOL (303 PASSAGES) CROSS-VERIFICATION ');
console.log('====================================================\n');

let missingCount = 0;
let genericCount = 0;
let validCount = 0;

milPassages.forEach(p => {
  const pKey = `'${p.id}'`;
  const pos = readingAidTs.indexOf(pKey);
  if (pos === -1) {
    missingCount++;
    console.error(`MISSING AID: ${p.id}`);
  } else {
    const chunk = readingAidTs.substring(pos, pos + 600);
    if (chunk.includes('敬請對照經典原文') || chunk.includes('探討國防戰略、軍隊紀律')) {
      genericCount++;
      console.error(`GENERIC TEMPLATE: ${p.id}`);
    } else {
      validCount++;
    }
  }
});

console.log(`Total Passages Checked: ${milPassages.length}`);
console.log(`Valid Bespoke Reading Aids: ${validCount} / ${milPassages.length} (${((validCount / milPassages.length) * 100).toFixed(2)}%)`);
console.log(`Generic Templates: ${genericCount}`);
console.log(`Missing Entries: ${missingCount}`);

if (validCount === milPassages.length && genericCount === 0 && missingCount === 0) {
  console.log('\n✅ ALL 303 MILITARY SCHOOL PASSAGES CROSS-VERIFIED & 100% BESPOKE!');
} else {
  console.error('\n❌ MILITARY SCHOOL CROSS-VERIFICATION FAILED!');
  process.exit(1);
}
