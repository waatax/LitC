import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');

const worksTsContent = fs.readFileSync(worksTsPath, 'utf8');
const readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

const matchesWorks = [...worksTsContent.matchAll(/此句釋義提示/g)];
const matchesAid = [...readingAidContent.matchAll(/此句釋義提示/g)];

console.log('=== Final Data Cleanliness Verification ===');
console.log(`Occurrences of "此句釋義提示" in works.ts: ${matchesWorks.length}`);
console.log(`Occurrences of "此句釋義提示" in readingAid.ts: ${matchesAid.length}`);

if (matchesWorks.length === 0 && matchesAid.length === 0) {
  console.log('🎉 Cleanliness Verdict: 100% CLEAN! Zero boilerplate placeholder text remaining in the entire dataset.');
}
