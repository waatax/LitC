import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

// LitC Pipeline Data Functions
const worksTsPath = 'src/data/works.ts';
const chunksDir = 'src/data/sentence_chunks';

function extract(file, name) {
  const source = fs.readFileSync(file, 'utf8');
  const prefix = `export const ${name} = JSON.parse('`;
  const start = source.indexOf(prefix);
  if (start < 0) return [];
  const payloadStart = start + prefix.length;
  let end = source.indexOf("') as ", payloadStart);
  if (end < 0) end = source.indexOf("')", payloadStart);
  if (end < 0) return [];
  const literal = `'${source.slice(payloadStart, end)}'`;
  return JSON.parse(new Function(`"use strict"; return ${literal}`)());
}

function loadAllData() {
  const source = fs.readFileSync(worksTsPath, 'utf8');
  const worksMatch = source.match(/export const works = JSON\.parse\('(.+)'\)/);
  const chMatch = source.match(/export const chapters = JSON\.parse\('(.+)'\)/);
  
  const works = worksMatch ? JSON.parse(worksMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\")) : [];
  const chapters = chMatch ? JSON.parse(chMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\")) : [];
  
  const p1 = extract('src/data/sentence_chunks/passages_part1.ts', 'passagesPart1');
  const p2 = extract('src/data/sentence_chunks/passages_part2.ts', 'passagesPart2');
  const passages = [...p1, ...p2];
  
  let sentences = [];
  for (let i = 1; i <= 8; i++) {
    sentences = sentences.concat(extract(`src/data/sentence_chunks/part${i}.ts`, `sentencesPart${i}`));
  }
  
  return { works, chapters, passages, sentences };
}

function saveData(works, chapters, passages, sentences) {
  const pChunkSize = Math.ceil(passages.length / 2);
  for (let i = 0; i < 2; i++) {
    const pChunk = passages.slice(i * pChunkSize, (i + 1) * pChunkSize);
    const pContent = `// Auto-generated passages chunk part ${i + 1}\nimport type { Passage } from '../../types/content';\nexport const passagesPart${i + 1} = JSON.parse('${JSON.stringify(pChunk).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Passage[];\n`;
    fs.writeFileSync(path.join(chunksDir, `passages_part${i + 1}.ts`), pContent, 'utf8');
  }

  const NUM_CHUNKS = 8;
  const chunkSize = Math.ceil(sentences.length / NUM_CHUNKS);
  const chunkImports = [];
  const chunkNames = [];
  for (let i = 0; i < NUM_CHUNKS; i++) {
    const chunkSentences = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkContent = `// Auto-generated sentence chunk part ${i + 1}\nimport type { Sentence } from '../../types/content';\nexport const sentencesPart${i + 1} = JSON.parse('${JSON.stringify(chunkSentences).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Sentence[];\n`;
    fs.writeFileSync(path.join(chunksDir, `part${i + 1}.ts`), chunkContent, 'utf8');
    chunkImports.push(`import { sentencesPart${i + 1} } from './sentence_chunks/part${i + 1}'`);
    chunkNames.push(`...sentencesPart${i + 1}`);
  }

  const worksTsNew = `// ─────────────────────────────────────────────────\n// 經典文脈 ClassicFlow — 典籍內容資料庫 (Chunked for GitHub <50MB limit)\n// ─────────────────────────────────────────────────\nimport type { Work, Chapter, Passage, Sentence } from '../types/content'\nimport { passagesPart1 } from './sentence_chunks/passages_part1'\nimport { passagesPart2 } from './sentence_chunks/passages_part2'\n${chunkImports.join('\n')}\n\nexport const works = JSON.parse('${JSON.stringify(works).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Work[];\n\nexport const chapters = JSON.parse('${JSON.stringify(chapters).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Chapter[];\n\nexport const passages: Passage[] = [\n  ...passagesPart1,\n  ...passagesPart2,\n];\n\nexport const sentences: Sentence[] = [\n  ${chunkNames.join(',\n  ')}\n];\n`;
  fs.writeFileSync(worksTsPath, worksTsNew, 'utf8');
}

async function run() {
  const data = loadAllData();
  const litcWorkId = 'shi-jing';
  
  console.log(`Rebuilding ${litcWorkId} from scratch/shijing.json...`);
  const shijingData = JSON.parse(fs.readFileSync('scratch/shijing.json', 'utf8'));
  
  // Clean up old data
  data.chapters = data.chapters.filter(c => c.workId !== litcWorkId);
  data.passages = data.passages.filter(p => !p.id.startsWith(`${litcWorkId}_`));
  data.sentences = data.sentences.filter(s => !s.id.startsWith(`${litcWorkId}_`));

  let totalChars = 0;
  
  // Group poems into chapters
  const chaptersMap = new Map();
  for (const poem of shijingData) {
     const chName = converter(poem.chapter + '·' + poem.section);
     if (!chaptersMap.has(chName)) {
        chaptersMap.set(chName, []);
     }
     chaptersMap.get(chName).push(poem);
  }

  const chapterIds = [];
  let chIndex = 1;
  
  for (const [chName, poems] of chaptersMap.entries()) {
      const chapterId = `${litcWorkId}_ch-${chIndex}`;
      chapterIds.push(chapterId);
      
      const passageIds = [];
      let pIndex = 1;
      let chapterLength = 0;
      
      for (const poem of poems) {
         // Title as first paragraph? or just as passage?
         const title = converter(poem.title);
         const passageId = `${chapterId}_p-${pIndex}`;
         passageIds.push(passageId);
         
         const lines = poem.content.map(l => converter(l));
         const canonicalText = title + '\\n' + lines.join('\\n');
         
         const sentenceIds = [];
         
         // Split sentences
         const rawSents = lines.join('').split(/([。！？；]+)/).filter(s => s.trim().length > 0);
         const sents = [];
         let currentStr = '';
         for (let j = 0; j < rawSents.length; j++) {
           currentStr += rawSents[j];
           if (/[。！？；]/.test(rawSents[j]) || j === rawSents.length - 1) {
             sents.push(currentStr);
             currentStr = '';
           }
         }
         
         // Add title as sentence 0? Or just include it in sentence order. Let's include title as first sentence.
         sents.unshift(title);
         
         for (const [sentenceIndex, sentenceText] of sents.entries()) {
           const sentenceId = `${passageId}_s-${sentenceIndex + 1}`;
           sentenceIds.push(sentenceId);
           data.sentences.push({
             id: sentenceId,
             passageId,
             order: sentenceIndex + 1,
             canonicalText: sentenceText,
             chunks: [[sentenceText, 'zh-Hant']]
           });
           totalChars += sentenceText.length;
           chapterLength += sentenceText.length;
         }
         
         data.passages.push({
           id: passageId,
           chapterId,
           order: pIndex,
           canonicalText,
           sentenceIds,
           sourceRefs: [{ label: '經文底本', edition: 'chinese-poetry' }]
         });
         
         pIndex++;
      }
      
      data.chapters.push({
        id: chapterId,
        workId: litcWorkId,
        order: chIndex,
        title: chName,
        difficulty: 4,
        estimatedMinutes: Math.max(10, Math.ceil(chapterLength / 300)),
        passageIds,
        tags: []
      });
      
      chIndex++;
  }
  
  const work = data.works.find(w => w.id === litcWorkId);
  if (work) {
    work.chapterIds = chapterIds;
    work.totalChars = totalChars;
  }
  
  console.log(`Rebuilt ${litcWorkId}: ${totalChars} chars.`);
  
  console.log(`Saving all rebuilt works to database...`);
  saveData(data.works, data.chapters, data.passages, data.sentences);
  
  execSync('node scripts/generate_work_chunks.cjs', { stdio: 'inherit' });
  execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
  console.log("Successfully rebuilt Shijing from JSON!");
}

run();
