import fs from 'fs';

const html = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache/lunyu_xue-er-di-yi.html', 'utf8');

console.log("HTML length:", html.length);
// Find occurrences of <tr or id="n
const trs = html.match(/<tr/g) || [];
const ids = html.match(/id="n/g) || [];
console.log(`<tr count: ${trs.length}, id="n count: ${ids.length}`);

// Print lines around the first <tr
const lines = html.split('\n');
const trIdx = lines.findIndex(l => l.includes('<tr'));
if (trIdx !== -1) {
  console.log("Lines around <tr:");
  console.log(lines.slice(trIdx, trIdx + 15).join('\n'));
} else {
  console.log("First 300 chars of HTML:");
  console.log(html.slice(0, 300));
}
