import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const worksTsPath = 'data_sources/works.ts';
const chunksDir = 'data_sources/sentence_chunks';

function extract(file, name) {
  const source = fs.readFileSync(file, 'utf8');
  const prefix = `export const ${name} = JSON.parse('`;
  const start = source.indexOf(prefix);
  if (start < 0) return [];
  const payloadStart = start + prefix.length;
  const end = source.indexOf("') as ", payloadStart);
  if (end < 0) {
      // maybe it doesn't have " as ", check for just "')"
      const end2 = source.indexOf("')", payloadStart);
      if (end2 < 0) return [];
      const literal = `'${source.slice(payloadStart, end2)}'`;
      return JSON.parse(new Function(`"use strict"; return ${literal}`)());
  }
  const literal = `'${source.slice(payloadStart, end)}'`;
  return JSON.parse(new Function(`"use strict"; return ${literal}`)());
}

function extractWorks() {
  const source = fs.readFileSync(worksTsPath, 'utf8');
  const worksMatch = source.match(/export const works = JSON\.parse\('(.+)'\)/);
  if (worksMatch) {
      return JSON.parse(worksMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\"));
  }
  return [];
}

function extractChapters() {
  const source = fs.readFileSync(worksTsPath, 'utf8');
  const chMatch = source.match(/export const chapters = JSON\.parse\('(.+)'\)/);
  if (chMatch) {
      return JSON.parse(chMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\"));
  }
  return [];
}

function loadAllData() {
  const works = extractWorks();
  const chapters = extractChapters();
  
  const p1 = extract('src/data/sentence_chunks/passages_part1.ts', 'passagesPart1');
  const p2 = extract('src/data/sentence_chunks/passages_part2.ts', 'passagesPart2');
  const passages = [...p1, ...p2];
  
  let sentences = [];
  for (let i = 1; i <= 8; i++) {
    const s = extract(`src/data/sentence_chunks/part${i}.ts`, `sentencesPart${i}`);
    sentences = sentences.concat(s);
  }
  
  return { works, chapters, passages, sentences };
}

function saveData(works, chapters, passages, sentences) {
  // Save passages
  const pChunkSize = Math.ceil(passages.length / 2);
  for (let i = 0; i < 2; i++) {
    const pChunk = passages.slice(i * pChunkSize, (i + 1) * pChunkSize);
    const pPath = path.join(chunksDir, `passages_part${i + 1}.ts`);
    const pContent = `// Auto-generated passages chunk part ${i + 1}
import type { Passage } from '../../types/content';
export const passagesPart${i + 1} = JSON.parse('${JSON.stringify(pChunk).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Passage[];
`;
    fs.writeFileSync(pPath, pContent, 'utf8');
  }

  // Save sentences
  const NUM_CHUNKS = 8;
  const chunkSize = Math.ceil(sentences.length / NUM_CHUNKS);
  for (let i = 0; i < NUM_CHUNKS; i++) {
    const chunkSentences = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkPath = path.join(chunksDir, `part${i + 1}.ts`);
    const chunkContent = `// Auto-generated sentence chunk part ${i + 1}
import type { Sentence } from '../../types/content';
export const sentencesPart${i + 1} = JSON.parse('${JSON.stringify(chunkSentences).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Sentence[];
`;
    fs.writeFileSync(chunkPath, chunkContent, 'utf8');
  }

  // Save works.ts
  const chunkImports = [];
  const chunkNames = [];
  for (let i = 0; i < NUM_CHUNKS; i++) {
    chunkImports.push(`import { sentencesPart${i + 1} } from './sentence_chunks/part${i + 1}'`);
    chunkNames.push(`...sentencesPart${i + 1}`);
  }

  const worksTsNew = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫 (Chunked for GitHub <50MB limit)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'
import { passagesPart1 } from './sentence_chunks/passages_part1'
import { passagesPart2 } from './sentence_chunks/passages_part2'
${chunkImports.join('\n')}

export const works = JSON.parse('${JSON.stringify(works).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Work[];

export const chapters = JSON.parse('${JSON.stringify(chapters).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Chapter[];

export const passages: Passage[] = [
  ...passagesPart1,
  ...passagesPart2,
];

export const sentences: Sentence[] = [
  ${chunkNames.join(',\n  ')}
];
`;
  fs.writeFileSync(worksTsPath, worksTsNew, 'utf8');
}

export function rebuildWorkMissingSentences(workId) {
  console.log(`Rebuilding missing sentences for ${workId}...`);
  const data = loadAllData();
  
  // Filter out OLD sentences for this work
  data.sentences = data.sentences.filter(s => !s.id.startsWith(workId));
  
  let newSentencesCount = 0;
  let totalChars = 0;
  
  // Re-segment passages
  data.passages.forEach(p => {
    if (p.id.startsWith(workId)) {
      const text = p.canonicalText || p.text;
      const parts = text.split(/([。！？；]+)/).filter(s => s.trim().length > 0);
      const sents = [];
      let currentStr = '';
      for (let i = 0; i < parts.length; i++) {
        currentStr += parts[i];
        if (/[。！？；]/.test(parts[i]) || i === parts.length - 1) {
          sents.push(currentStr);
          currentStr = '';
        }
      }
      
      p.sentenceIds = [];
      sents.forEach((sText, idx) => {
        const sId = `${p.id}_s-${idx + 1}`;
        p.sentenceIds.push(sId);
        data.sentences.push({
          id: sId,
          passageId: p.id,
          canonicalText: sText,
          chunks: [[sText, 'zh-Hant']]
        });
        totalChars += sText.length;
        newSentencesCount++;
      });
    }
  });
  
  // Update work total chars
  const work = data.works.find(w => w.id === workId);
  if (work) {
    work.totalChars = totalChars;
  }
  
  console.log(`Saving ${workId}: generated ${newSentencesCount} sentences, ${totalChars} characters.`);
  saveData(data.works, data.chapters, data.passages, data.sentences);
  
  // Run build scripts
  console.log("Running generate_work_chunks.ts...");
  execSync('npx tsx scripts/generate_work_chunks.ts', { stdio: 'inherit' });
  console.log("Running generate_catalog.cjs...");
  execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
  console.log(`Successfully rebuilt ${workId}!`);
}

// Allow running from CLI directly
if (process.argv[1].endsWith('rebuild_pipeline.js')) {
  const workId = process.argv[2];
  if (workId) {
    rebuildWorkMissingSentences(workId);
  } else {
    console.log("Usage: node scripts/rebuild_pipeline.js <workId>");
  }
}
