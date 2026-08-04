import fs from 'fs';

// 1. Fix works.ts exports
const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');

if (!worksSource.includes('export const passages')) {
  // Read passages and sentences from passages_part1.ts & passages_part2.ts if needed, or define getter
  worksSource += `\nimport { passagesPart1 } from './sentence_chunks/passages_part1'\nimport { passagesPart2 } from './sentence_chunks/passages_part2'\n\nexport const passages: Passage[] = [...passagesPart1, ...passagesPart2];\nexport const sentences: Sentence[] = [];\n`;
  fs.writeFileSync(worksFile, worksSource, 'utf8');
  console.log("Added passages and sentences exports to works.ts!");
}

// 2. Fix duplicate keys in readingAid.ts
const aidFile = 'src/data/readingAid.ts';
let aidContent = fs.readFileSync(aidFile, 'utf8');

const exportIndex = aidContent.indexOf('export function getPassageReadingAid');
let body = aidContent.slice(0, exportIndex);
const tail = aidContent.slice(exportIndex);

// Deduplicate object keys in body
const keyRegex = /'([^']+)':\s*\{\s*translation:\s*"([\s\S]*?)",\s*analysis:\s*"([\s\S]*?)"\s*\}/g;
const seen = new Map();
let match;

while ((match = keyRegex.exec(body)) !== null) {
  seen.set(match[1], { translation: match[2], analysis: match[3] });
}

console.log(`Deduplicated PASSAGE_AIDS entries: ${seen.size} unique keys!`);

let newBody = 'export const PASSAGE_AIDS: Record<string, PassageReadingAid> = {\n';
for (const [k, v] of seen.entries()) {
  newBody += `  '${k}': {\n    translation: ${JSON.stringify(v.translation)},\n    analysis: ${JSON.stringify(v.analysis)}\n  },\n`;
}
newBody = newBody.trimEnd().replace(/,$/, '') + '\n};\n\n';

fs.writeFileSync(aidFile, newBody + tail, 'utf8');
console.log("Successfully deduplicated readingAid.ts!");
