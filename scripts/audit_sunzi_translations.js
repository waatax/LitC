import fs from 'fs';

const source = fs.readFileSync('src/data/readingAid.ts', 'utf8');
const entryPattern = /'(art-of-war_ch-(\d+)_p-(\d+))'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)"/gs;
const entries = [...source.matchAll(entryPattern)].map((match) => ({
  id: match[1],
  chapter: Number(match[2]),
  passage: Number(match[3]),
  translation: JSON.parse(`"${match[4]}"`),
}));

const expectedCounts = [7, 5, 6, 4, 5, 7, 6, 4, 5, 5, 8, 3, 5];
const problems = [];
if (entries.length !== 70) problems.push(`expected 70 entries, found ${entries.length}`);
for (let chapter = 1; chapter <= 13; chapter += 1) {
  const chapterEntries = entries.filter((entry) => entry.chapter === chapter);
  if (chapterEntries.length !== expectedCounts[chapter - 1]) {
    problems.push(`chapter ${chapter}: expected ${expectedCounts[chapter - 1]}, found ${chapterEntries.length}`);
  }
  chapterEntries.forEach((entry, index) => {
    if (entry.passage !== index + 1) problems.push(`non-contiguous id: ${entry.id}`);
  });
}

const forbidden = [
  /\u5b6b\u5b54\u5b50/u,
  /\u4eba\u6c11\u767e\u59d3/u,
  /\u3010\u767d\u8a71\u7ffb\u8b6f\u3011/u,
  /\?{2,}/u,
  /\ufffd/u,
];
for (const entry of entries) {
  if (entry.translation.trim().length < 12) problems.push(`suspiciously short: ${entry.id}`);
  if (forbidden.some((pattern) => pattern.test(entry.translation))) problems.push(`forbidden pattern: ${entry.id}`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${entries.length} passages, 13 chapters, contiguous IDs, no mechanical-translation artifacts.`);
