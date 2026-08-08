import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const passMatch = worksSource.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

if (passMatch) {
  const jsonStr = decodeURIComponent(passMatch[1]);
  const passages = JSON.parse(jsonStr);

  const targets = ['dao-de-jing', 'liezi', 'art-of-war', 'shiji', 'zhan-guo-ce', 'xijing-zaji'];
  const batch2Passages = passages.filter(p => targets.some(t => p.chapterId.startsWith(t)));

  console.log(`Extracted ${batch2Passages.length} passages for Batch 2.`);

  const summary = {};
  batch2Passages.forEach(p => {
    const prefix = p.id.split('_ch-')[0];
    summary[prefix] = (summary[prefix] || 0) + 1;
  });
  console.log('Breakdown by work:', summary);

  fs.writeFileSync('scratch/batch2_passages_dump.json', JSON.stringify(batch2Passages, null, 2), 'utf8');
}
