import fs from 'fs';

const p1Str = fs.readFileSync('src/data/sentence_chunks/passages_part1.ts', 'utf8');
const p2Str = fs.readFileSync('src/data/sentence_chunks/passages_part2.ts', 'utf8');

const combined = p1Str + '\n' + p2Str;

// Find all passages where chapterId is 'xunzi_ch-17'
const matches = [...combined.matchAll(/id:\s*['"]([^'"]+)['"][^}]*chapterId:\s*['"]xunzi_ch-17['"][^}]*canonicalText:\s*['"]([^'"]+)['"]/g)];

console.log(`Found ${matches.length} passage regex matches for xunzi_ch-17:`);
matches.forEach((m, idx) => {
  console.log(`${idx + 1}. ID: ${m[1]} | Canonical Text: ${m[2].substring(0, 50)}...`);
});

// Also search for any id containing xunzi_ch-17
const matches2 = [...combined.matchAll(/id:\s*['"](xunzi_ch-17_p-\d+)['"]/g)];
console.log(`\nFound ${matches2.length} passage IDs starting with xunzi_ch-17_p-:`);
matches2.forEach((m, idx) => {
  console.log(`  ${idx + 1}. ID: ${m[1]}`);
});

const readingAidTs = fs.readFileSync('src/data/readingAid.ts', 'utf8');
matches2.forEach(m => {
  const pId = m[1];
  const hasAid = readingAidTs.includes(`'${pId}'`) || readingAidTs.includes(`"${pId}"`);
  console.log(`Passage ${pId} has readingAid entry: ${hasAid}`);
});
