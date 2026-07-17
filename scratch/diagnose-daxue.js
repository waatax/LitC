import fs from 'fs';

const html = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache/daxue.html', 'utf8');

// Find all <tr> rows
const rowRegex = /<tr id="n([0-9]+)">[\s\S]*?<td class="ctext">([\s\S]*?)<\/td><\/tr>/g;
const rows = [...html.matchAll(rowRegex)];

console.log(`Found ${rows.length} rows:`);
rows.forEach((r, idx) => {
  const rowId = r[1];
  const cell = r[2];
  // Extract all <span class="original">
  const spans = [...cell.matchAll(/<span class="original">([\s\S]*?)<\/span>/g)].map(m => m[1].trim());
  console.log(`Row ${idx + 1} (n${rowId}): ${spans.length} spans. First: "${spans[0]?.slice(0, 30)}..."`);
});
