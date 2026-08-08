import fs from 'fs';
import path from 'path';

// Load Three Strategies JSON
const tsData = fs.readFileSync('src/data/work_chunks/three-strategies.ts', 'utf8');
const workBundleMatch = tsData.match(/JSON\.parse\('(.+)'\) as WorkBundle/);
if (!workBundleMatch) {
  console.error("Failed to parse three-strategies.ts");
  process.exit(1);
}
const workBundle = JSON.parse(workBundleMatch[1]);
const localPassagesCount = workBundle.passages.length;
console.log(`Local 'three-strategies' has ${localPassagesCount} passages.`);

// Load Wiki Text
const wikiText = fs.readFileSync('scratch/san_lue_wiki.txt', 'utf8');
const lines = wikiText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
let wikiPassagesCount = 0;
for (const line of lines) {
  // Ignore purely structural lines like '中略', '下略', or wiki footers
  if (line === '中略' || line === '下略' || line.includes('此秦朝作品在全世界都属于公有领域')) {
    continue;
  }
  if (line.includes('检索自')) break; // End of actual content
  if (line.length > 5) { // reasonable paragraph length
    wikiPassagesCount++;
  }
}
console.log(`Wiki 'three-strategies' has roughly ${wikiPassagesCount} passages.`);

if (localPassagesCount < wikiPassagesCount) {
  console.log(`\n[WARNING] Local corpus is MISSING content! (Local: ${localPassagesCount}, Wiki: ${wikiPassagesCount})`);
  console.log(`Recommendation: Rebuild three-strategies.ts with the full text.`);
} else {
  console.log(`\n[OK] Local corpus seems complete.`);
}
