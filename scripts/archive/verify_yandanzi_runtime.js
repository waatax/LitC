import { PASSAGE_AIDS, getPassageReadingAid } from '../src/data/readingAid.js';

console.log('=== VERIFYING YANDANZI RUNTIME OUTPUT ===\n');

for (let i = 1; i <= 11; i++) {
  const id = `yandanzi_ch-1_p-${i}`;
  const aid = PASSAGE_AIDS[id];
  console.log(`[Passage ${id}]`);
  console.log('  白話:', aid ? aid.translation.substring(0, 50) + '...' : 'MISSING');
  console.log('  解析:', aid ? aid.analysis.replace(/\n/g, ' ') : 'MISSING');
  console.log('---');
}
