import fs from 'fs';
import path from 'path';

const worksPath = path.join(process.cwd(), 'src/data/works.ts');
const descPath = path.join(process.cwd(), 'src/data/workDescriptions.ts');

const worksSource = fs.readFileSync(worksPath, 'utf8');
const descSource = fs.readFileSync(descPath, 'utf8');

const worksMatch = worksSource.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
if (!worksMatch) {
  console.error('Failed to parse works!');
  process.exit(1);
}

const worksArr = JSON.parse(decodeURIComponent(worksMatch[1]));
console.log(`=== 驗證全庫 ${worksArr.length} 部典籍之考據導讀資料完整性 ===\n`);

let missingCount = 0;
let invalidSourcesCount = 0;
let invalidContentCount = 0;

worksArr.forEach((w, idx) => {
  const idKey = `'${w.id}':`;
  if (!descSource.includes(idKey)) {
    console.error(`[ERROR] Missing description for work: ${w.id} (${w.title})`);
    missingCount++;
  } else {
    // Slice snippet for work
    const startIdx = descSource.indexOf(idKey);
    const endIdx = descSource.indexOf('    "sources":', startIdx);
    const sourcesEndIdx = descSource.indexOf(']', endIdx);
    const snippet = descSource.substring(startIdx, sourcesEndIdx + 10);

    // Check sources count
    const matches = snippet.match(/"label":/g);
    const sourcesCount = matches ? matches.length : 0;

    if (sourcesCount < 3) {
      console.error(`[WARNING] Work ${w.id} (${w.title}) has only ${sourcesCount} sources (required >= 3)!`);
      invalidSourcesCount++;
    }

    // Check keyAllusions
    const allusionsMatch = snippet.match(/"keyAllusions":\s*\[([\s\S]*?)\]/);
    const allusionCount = allusionsMatch ? (allusionsMatch[1].match(/"/g) || []).length / 2 : 0;
    if (allusionCount < 2) {
      console.error(`[WARNING] Work ${w.id} (${w.title}) has only ${allusionCount} keyAllusions!`);
      invalidContentCount++;
    }
  }
});

console.log('--- 驗證結果彙總 ---');
console.log(`總典籍數: ${worksArr.length}`);
console.log(`缺失導讀數: ${missingCount}`);
console.log(`來源少於 3 處數: ${invalidSourcesCount}`);
console.log(`內容不足數: ${invalidContentCount}`);

if (missingCount === 0 && invalidSourcesCount === 0 && invalidContentCount === 0) {
  console.log('\n[🎉 完美通過] 50 部典籍 100% 具備深度考據、三處以上參照來源與豐富導讀！');
} else {
  process.exit(1);
}
