import fs from 'fs';

const targetIds = ['wenshi-zhenjing', 'shen-bu-hai', 'jian-zhu-ke-shu'];

const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
const jsonEncodedMatch = worksTs.match(/decodeURIComponent\(["']([^"']+)["']\)/);
const litcWorks = JSON.parse(decodeURIComponent(jsonEncodedMatch[1]));

console.log("=== Inspecting 3 Target Works in LitC ===");

for (const id of targetIds) {
  const w = litcWorks.find(x => x.id === id);
  if (w) {
    console.log(`\nWork: 《${w.title}》 (ID: ${w.id})`);
    console.log(`- Chapter Count: ${w.chapterIds ? w.chapterIds.length : 0}`);
    console.log(`- Total Characters: ${w.totalChars}`);
    console.log(`- Chapter IDs:`, w.chapterIds);
    console.log(`- Source Note: ${w.sourceNote}`);
  } else {
    console.log(`\nWork ID ${id} NOT found in works.ts!`);
  }
}
