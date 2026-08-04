import fs from 'fs';

function decodeFileJson(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts');
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts');
const allPassages = [...(p1 || []), ...(p2 || [])];

const ch17Passages = allPassages.filter(p => p.chapterId === 'xunzi_ch-17');

console.log(`=== Total Passages for xunzi_ch-17 (《荀子·天論篇第十七》): ${ch17Passages.length} ===\n`);

ch17Passages.forEach((p, idx) => {
  console.log(`Passage ${idx + 1} (ID: ${p.id}):`);
  console.log(`  [Canonical Text]: ${p.canonicalText}`);
  console.log(`--------------------------------------------------`);
});

// Check existing readingAid for these passages
const readingAidContent = fs.readFileSync('src/data/readingAid.ts', 'utf8');

console.log("\n=== Checking readingAid status for each passage ===");
ch17Passages.forEach(p => {
  const hasAid = readingAidContent.includes(`'${p.id}'`) || readingAidContent.includes(`"${p.id}"`);
  console.log(`Passage ${p.id}: ${hasAid ? 'HAS AID' : 'MISSING AID'}`);
});
