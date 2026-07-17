import fs from 'fs';

const html = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache/lunyu_xue-er-di-yi.html', 'utf8');

const query = '學而時習之';
const idx = html.indexOf(query);
console.log(`Index of "${query}": ${idx}`);

if (idx !== -1) {
  console.log("Surrounding HTML:");
  console.log(html.slice(idx - 150, idx + 150));
} else {
  console.log("Not found!");
}
