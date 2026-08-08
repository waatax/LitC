import fs from 'fs';
import path from 'path';

const worksTsPath = 'src/data/works.ts';
const chunksDir = 'src/data/sentence_chunks';

function parseEncodedArrays(source) {
  const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
  return matches.map(match => JSON.parse(decodeURIComponent(match[1])));
}

const worksSource = fs.readFileSync(worksTsPath, 'utf8');
const [works, chapters] = parseEncodedArrays(worksSource);

// Load passages from existing passages.ts or passages_part1/2
let passages = [];
const passagesPath = path.join(chunksDir, 'passages.ts');
if (fs.existsSync(passagesPath)) {
  const pSource = fs.readFileSync(passagesPath, 'utf8');
  const [pArr] = parseEncodedArrays(pSource);
  passages = pArr;
  fs.unlinkSync(passagesPath);
}

// Load sentences from existing 8 parts in chunksDir
let sentences = [];
for (let i = 1; i <= 8; i++) {
  const partPath = path.join(chunksDir, `part${i}.ts`);
  if (fs.existsSync(partPath)) {
    const partSource = fs.readFileSync(partPath, 'utf8');
    const [partArr] = parseEncodedArrays(partSource);
    sentences = sentences.concat(partArr);
    fs.unlinkSync(partPath);
  }
}

console.log(`Loaded ${passages.length} passages and ${sentences.length} sentences.`);

// Split passages into 2 parts (~26MB each)
const pChunkSize = Math.ceil(passages.length / 2);
for (let i = 0; i < 2; i++) {
  const pChunk = passages.slice(i * pChunkSize, (i + 1) * pChunkSize);
  const pPath = path.join(chunksDir, `passages_part${i + 1}.ts`);
  const pContent = `// Auto-generated passages chunk part ${i + 1}
import type { Passage } from '../../types/content';
export const passagesPart${i + 1}: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pChunk))}"));
`;
  fs.writeFileSync(pPath, pContent, 'utf8');
  console.log(`Wrote passages_part${i + 1}.ts: ${pChunk.length} passages (${(fs.statSync(pPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

// Split sentences into 8 chunks (~15-26MB each)
const NUM_CHUNKS = 8;
const chunkSize = Math.ceil(sentences.length / NUM_CHUNKS);
const chunkImports = [];
const chunkNames = [];

for (let i = 0; i < NUM_CHUNKS; i++) {
  const chunkSentences = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
  const chunkFileName = `part${i + 1}.ts`;
  const chunkPath = path.join(chunksDir, chunkFileName);
  
  const chunkContent = `// Auto-generated sentence chunk part ${i + 1}
import type { Sentence } from '../../types/content';
export const sentencesPart${i + 1}: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(chunkSentences))}"));
`;
  fs.writeFileSync(chunkPath, chunkContent, 'utf8');
  chunkImports.push(`import { sentencesPart${i + 1} } from './sentence_chunks/part${i + 1}'`);
  chunkNames.push(`...sentencesPart${i + 1}`);
  console.log(`Wrote ${chunkFileName}: ${chunkSentences.length} sentences (${(fs.statSync(chunkPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

// Rewriting works.ts
const worksTsNew = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫 (Chunked for GitHub <50MB limit)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'
import { passagesPart1 } from './sentence_chunks/passages_part1'
import { passagesPart2 } from './sentence_chunks/passages_part2'
${chunkImports.join('\n')}

export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(works))}"));

export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(chapters))}"));

export const passages: Passage[] = [
  ...passagesPart1,
  ...passagesPart2,
];

export const sentences: Sentence[] = [
  ${chunkNames.join(',\n  ')}
];
`;

fs.writeFileSync(worksTsPath, worksTsNew, 'utf8');
console.log(`Rewrote works.ts: ${(fs.statSync(worksTsPath).size / 1024 / 1024).toFixed(2)} MB`);
