import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const worksTsPath = 'src/data/works.ts';
const chunksDir = 'src/data/sentence_chunks';
const extractedPath = 'scratch/classics_extracted.json';

// -------------------------------------------------------------
// Pipeline functions
// -------------------------------------------------------------
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

async function rebuildFromExtracted() {
  const data = loadAllData();
  const extracted = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
  
  // We want to rebuild works that are present in BOTH works.ts and extracted.json
  const targetIds = extracted.map(e => e.id);
  const validIds = data.works.filter(w => targetIds.includes(w.id)).map(w => w.id);
  
  console.log(`Found ${validIds.length} valid works to rebuild from extracted JSON.`);
  
  for (const workId of validIds) {
    const workData = extracted.find(e => e.id === workId);
    console.log(`\nRebuilding ${workId}...`);
    
    // Remove old data
    data.chapters = data.chapters.filter(c => c.workId !== workId);
    data.passages = data.passages.filter(p => !p.id.startsWith(`${workId}_`));
    data.sentences = data.sentences.filter(s => !s.id.startsWith(`${workId}_`));

    const chapterIds = [];
    let totalChars = 0;
    
    for (const [volumeIndex, volume] of workData.chapters.entries()) {
      const chapterId = `${workId}_ch-${volumeIndex + 1}`;
      chapterIds.push(chapterId);
      const passageIds = [];
      
      const paragraphs = volume.paragraphs || [];
      if (paragraphs.length === 0 && volume.text) {
          paragraphs.push(volume.text);
      }
      
      for (const [passageIndex, canonicalText] of paragraphs.entries()) {
        const passageId = `${chapterId}_p-${passageIndex + 1}`;
        passageIds.push(passageId);
        const sentenceIds = [];
        
        const parts = canonicalText.split(/([。！？；]+)/).filter(s => s.trim().length > 0);
        const sents = [];
        let currentStr = '';
        for (let i = 0; i < parts.length; i++) {
          currentStr += parts[i];
          if (/[。！？；]/.test(parts[i]) || i === parts.length - 1) {
            sents.push(currentStr);
            currentStr = '';
          }
        }
        
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
        }
        
        data.passages.push({
          id: passageId,
          chapterId,
          order: passageIndex + 1,
          canonicalText,
          sentenceIds,
          sourceRefs: [{ label: '經文底本', edition: 'dianji.fun', url: workData.sourceUrl }]
        });
      }
      
      data.chapters.push({
        id: chapterId,
        workId,
        order: volumeIndex + 1,
        title: volume.title || `第${volumeIndex + 1}卷`,
        difficulty: 4,
        estimatedMinutes: Math.max(10, Math.ceil(paragraphs.reduce((n, text) => n + text.length, 0) / 300)),
        passageIds,
        tags: []
      });
    }

    const work = data.works.find(w => w.id === workId);
    if (work) {
      work.chapterIds = chapterIds;
      work.totalChars = totalChars;
    }
    console.log(`Rebuilt ${workId}: ${totalChars} chars, ${workData.chapters.length} chapters.`);
  }

  console.log(`\nSaving all rebuilt works to database...`);
  saveData(data.works, data.chapters, data.passages, data.sentences);
  
  execSync('node scripts/generate_work_chunks.cjs', { stdio: 'inherit' });
  execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
  console.log("Successfully rebuilt all extracted works!");
}

rebuildFromExtracted().catch(console.error);
