import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAudit() {
  const { works, chapters, passages, sentences } = await import('../src/data/works.js');
  const { readingAid } = await import('../src/data/readingAid.js');

  console.log('Total works:', works.length);
}

// Alternatively read works.ts directly or parse it
const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');

console.log('Reading files...');
const worksTs = fs.readFileSync(worksTsPath, 'utf8');
const readingAidTs = fs.readFileSync(readingAidPath, 'utf8');

// Quick regex audit for works
const workMatches = [...worksTs.matchAll(/id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*schoolId:\s*'([^']+)'/g)];
console.log(`Found ${workMatches.length} works in works.ts`);

const chapterMatches = [...worksTs.matchAll(/id:\s*'([^']+)',\s*workId:\s*'([^']+)',\s*title:\s*'([^']+)'/g)];
console.log(`Found ${chapterMatches.length} chapters in works.ts`);

const sentenceMatches = [...worksTs.matchAll(/canonicalText:\s*'([^']+)'/g)];
console.log(`Found approximately ${sentenceMatches.length} sentences in works.ts`);

// Count reading aid entries
const aidKeyMatches = [...readingAidTs.matchAll(/'([^']+)':\s*['`"]/g)];
console.log(`Found approximately ${aidKeyMatches.length} reading aid entries in readingAid.ts`);

const summary = {
  worksCount: workMatches.length,
  chaptersCount: chapterMatches.length,
  approxSentencesCount: sentenceMatches.length,
  approxAidEntriesCount: aidKeyMatches.length,
  works: workMatches.map(m => ({ id: m[1], title: m[2], schoolId: m[3] }))
};

fs.mkdirSync(path.join(__dirname, '../scratch'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../scratch/audit_quick_summary.json'), JSON.stringify(summary, null, 2));
console.log('Audit completed successfully.');
