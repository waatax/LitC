import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini Client
// Ensure you have set GEMINI_API_KEY in your environment variables or .env file
const ai = new GoogleGenAI({});

// Data Paths
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

async function calibrateChapter(workId, chapterIndex) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Please set GEMINI_API_KEY environment variable.");
    process.exit(1);
  }

  const data = loadAllData();
  const work = data.works.find(w => w.id === workId);
  if (!work) {
    console.error(`Work ${workId} not found.`);
    return;
  }
  
  const chapterId = work.chapterIds[chapterIndex];
  const chapter = data.chapters.find(c => c.id === chapterId);
  if (!chapter) {
    console.error(`Chapter ${chapterId} not found.`);
    return;
  }
  
  console.log(`Calibrating ${work.title} - ${chapter.title}...`);
  
  const passages = data.passages.filter(p => p.chapterId === chapterId);
  let calibratedCount = 0;
  
  for (const passage of passages) {
    const sents = data.sentences.filter(s => s.passageId === passage.id);
    for (const sent of sents) {
      if (sent.structuredTranslation) {
        console.log(`Skipping already calibrated: ${sent.canonicalText}`);
        continue;
      }
      
      console.log(`Analyzing: ${sent.canonicalText}`);
      const prompt = `你是精通中國古典文獻與思想史的國學大師。請對以下來自《${work.title}》的古文進行深度解析。
      請將古文意譯為合宜流暢的現代漢語，並摘錄關鍵字詞提供釋義，同時給出思想哲理或章旨析理，以及寫作與修辭上的應用引導。
      古文：${sent.canonicalText}`;
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translation: { type: Type.STRING, description: "現代漢語意譯（務求信達雅）" },
                wordGlossary: { type: Type.STRING, description: "關鍵字詞釋義（例如：子：指孔子；曰：說。）" },
                philosophicalNote: { type: Type.STRING, description: "思想哲理與章旨解析，發掘文化洞察" },
                writingApplication: { type: Type.STRING, description: "寫作與修辭應用引導（如適用）" }
              },
              required: ["translation", "philosophicalNote"]
            }
          }
        });
        
        const resultText = response.text;
        const parsed = JSON.parse(resultText);
        
        sent.structuredTranslation = parsed;
        calibratedCount++;
        console.log(` => Success.`);
        
        // Brief delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(` => Failed to calibrate: ${err.message}`);
      }
    }
  }
  
  if (calibratedCount > 0) {
    console.log(`Saving ${calibratedCount} newly calibrated sentences...`);
    saveData(data.works, data.chapters, data.passages, data.sentences);
    execSync('node scripts/generate_work_chunks.cjs', { stdio: 'inherit' });
    execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
    console.log("Database updated successfully.");
  } else {
    console.log("No new sentences calibrated.");
  }
}

// Example usage: node scripts/ai_calibrate.js <workId> <chapterIndex>
const args = process.argv.slice(2);
if (args.length >= 2) {
  calibrateChapter(args[0], parseInt(args[1], 10));
} else {
  console.log("Usage: node --env-file=.env scripts/ai_calibrate.js <workId> <chapterIndex>");
  console.log("Example: node --env-file=.env scripts/ai_calibrate.js da-xue 0");
}
