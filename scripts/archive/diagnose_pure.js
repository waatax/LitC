import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const text = fs.readFileSync(worksTsPath, 'utf8');

const matches = [...text.matchAll(/"translationHint"\s*:\s*"([^"]+)"/g)];
let cannedCount = 0;
matches.forEach(m => {
  if (m[1].includes('此句釋義提示') || m[1].includes('用白話說')) {
    cannedCount++;
  }
});

console.log(`Total sentence translationHints in works.ts encoded JSON: ${matches.length}`);
console.log(`Sentences with canned translationHint ("此句釋義提示"): ${cannedCount}`);
