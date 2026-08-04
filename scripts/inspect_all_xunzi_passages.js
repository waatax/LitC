import fs from 'fs';

function searchInFile(filepath, target) {
  if (!fs.existsSync(filepath)) return [];
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    if (line.includes(target)) {
      results.push({ lineNum: idx + 1, content: line.trim() });
    }
  });
  return results;
}

const files = [
  'src/data/works.ts',
  'src/data/readingAid.ts',
  'src/data/sentence_chunks/passages_part1.ts',
  'src/data/sentence_chunks/passages_part2.ts'
];

console.log("=== Searching for xunzi_ch-17 in data files ===");
files.forEach(f => {
  const matches = searchInFile(f, 'xunzi_ch-17');
  console.log(`File ${f}: ${matches.length} matches`);
  matches.slice(0, 5).forEach(m => console.log(`  Line ${m.lineNum}: ${m.content.substring(0, 80)}`));
});
