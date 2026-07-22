import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const worksPath = path.join(__dirname, '../src/data/works.ts');
const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');

// Import current data using runtime import
import { works, chapters, passages, sentences } from '../src/data/works.js';

// Chunk splitter logic same as append-new-classics
function splitChunks(sentenceText, sentenceId) {
  const parts = sentenceText.split(/([，、：；。！？])/g).filter(Boolean);
  let tempChunks = [];
  let current = "";
  
  for (const part of parts) {
    current += part;
    if (/[，、：；。！？]/.test(part) || current.length >= 4) {
      tempChunks.push(current);
      current = "";
    }
  }
  if (current) {
    if (tempChunks.length > 0) {
      tempChunks[tempChunks.length - 1] += current;
    } else {
      tempChunks.push(current);
    }
  }

  let finalChunks = [];
  for (let chunk of tempChunks) {
    if (chunk.length > 10) {
      const mid = Math.floor(chunk.length / 2);
      finalChunks.push(chunk.substring(0, mid));
      finalChunks.push(chunk.substring(mid));
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks.map((text, idx) => ({
    id: `${sentenceId}_c-${idx + 1}`,
    sentenceId,
    order: idx + 1,
    text,
    cue: text[0],
  }));
}

function run() {
  const batch1Path = path.join(__dirname, 'translated_yijing_batch1.json');
  const batch2Path = path.join(__dirname, 'translated_yijing_batch2.json');
  
  if (!fs.existsSync(batch1Path) || !fs.existsSync(batch2Path)) {
    console.log('Waiting for translated yijing files to exist...');
    return;
  }
  
  console.log('Loading translated I Ching data...');
  const batch1 = JSON.parse(fs.readFileSync(batch1Path, 'utf8'));
  const batch2 = JSON.parse(fs.readFileSync(batch2Path, 'utf8'));
  
  const yijingData = { ...batch1, ...batch2 };
  console.log(`Loaded ${Object.keys(yijingData).length} hexagrams.`);
  
  // 1. Generate new Chapters, Passages, Sentences
  const newChapters = [];
  const newPassages = [];
  const newSentences = [];
  const readingAids = {};
  
  for (let i = 1; i <= 64; i++) {
    const chId = `yi-jing_ch-${i}`;
    const dataKey = `yi-jing_ch-${i}`;
    const hex = yijingData[dataKey];
    if (!hex) {
      console.error(`Missing hexagram data for chapter ${i}`);
      continue;
    }
    
    const pId = `${chId}_p-1`;
    const sId1 = `${pId}_s-1`;
    const sId2 = `${pId}_s-2`;
    
    const sText1 = `${hex.name}卦：${hex.scripture}`;
    const sText2 = `大象傳曰：${hex.daxiang}`;
    const canonicalText = `${sText1}\n${sText2}`;
    
    // Add Chapter
    newChapters.push({
      id: chId,
      workId: 'yi-jing',
      order: i,
      title: `${hex.name}卦`,
      difficulty: 3,
      estimatedMinutes: 2,
      passageIds: [pId],
      tags: []
    });
    
    // Add Passage
    newPassages.push({
      id: pId,
      chapterId: chId,
      order: 1,
      canonicalText: canonicalText,
      sentenceIds: [sId1, sId2]
    });
    
    // Add Sentences
    newSentences.push({
      id: sId1,
      passageId: pId,
      order: 1,
      canonicalText: sText1,
      chunks: splitChunks(sText1, sId1),
      translationHint: '' // will be resolved via readingAid
    });
    
    newSentences.push({
      id: sId2,
      passageId: pId,
      order: 2,
      canonicalText: sText2,
      chunks: splitChunks(sText2, sId2),
      translationHint: ''
    });
    
    // Add Reading Aid
    readingAids[pId] = {
      translation: hex.translation,
      analysis: hex.analysis
    };
  }
  
  // 2. Filter existing works.ts elements to remove the old placeholder Yi Jing chapter
  const filteredChapters = chapters.filter(c => c.workId !== 'yi-jing');
  const filteredPassages = passages.filter(p => !p.chapterId.startsWith('yi-jing_'));
  const filteredSentences = sentences.filter(s => !s.passageId.startsWith('yi-jing_'));
  
  // Combine
  const updatedChapters = [...filteredChapters, ...newChapters];
  const updatedPassages = [...filteredPassages, ...newPassages];
  const updatedSentences = [...filteredSentences, ...newSentences];
  
  // Update works array
  const updatedWorks = works.map(w => {
    if (w.id === 'yi-jing') {
      let chars = 0;
      newPassages.forEach(p => {
        chars += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
      });
      return {
        ...w,
        chapterIds: newChapters.map(c => c.id),
        totalChars: chars
      };
    }
    return w;
  });
  
  // Write updated works.ts
  const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()} (已包含完整的易經六十四卦)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(updatedWorks))}"));

export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(updatedChapters))}"));

export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(updatedPassages))}"));

export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(updatedSentences))}"));
`;
  
  fs.writeFileSync(worksPath, worksTsContent, 'utf8');
  console.log(`Successfully updated ${worksPath} with 64 hexagrams.`);
  
  // 3. Merge translation into readingAid.ts
  console.log('Merging I Ching translations into readingAid.ts...');
  const aidFileContent = fs.readFileSync(readingAidPath, 'utf8');
  
  const startMatch = aidFileContent.indexOf('const PASSAGE_AIDS: Record<string, PassageReadingAid> = {');
  if (startMatch === -1) throw new Error("Could not find PASSAGE_AIDS in readingAid.ts");
  
  const nextBlockStart = aidFileContent.indexOf('const EDITED_HINTS');
  const endMatch = aidFileContent.lastIndexOf('}', nextBlockStart);
  if (endMatch === -1) throw new Error("Could not find PASSAGE_AIDS end in readingAid.ts");
  
  const passageAidsBlock = aidFileContent.substring(startMatch, endMatch + 1);
  let PASSAGE_AIDS = {};
  PASSAGE_AIDS = eval('(function(){ \n' + 
    passageAidsBlock.replace(': Record<string, PassageReadingAid>', '') + 
    '; return PASSAGE_AIDS; \n})()');
  
  // Remove any old Yi Jing entries
  for (const key of Object.keys(PASSAGE_AIDS)) {
    if (key.startsWith('yi-jing_')) {
      delete PASSAGE_AIDS[key];
    }
  }
  
  // Add new ones
  for (const [key, val] of Object.entries(readingAids)) {
    PASSAGE_AIDS[key] = val;
  }
  
  // Format PASSAGE_AIDS
  let passageAidsStr = 'const PASSAGE_AIDS: Record<string, PassageReadingAid> = {\n';
  for (const [key, value] of Object.entries(PASSAGE_AIDS)) {
    const cleanTranslation = value.translation.replace(/\r/g, '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const cleanAnalysis = value.analysis.replace(/\r/g, '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    passageAidsStr += `  '${key}': {\n`;
    passageAidsStr += `    translation: "${cleanTranslation}",\n`;
    passageAidsStr += `    analysis: "${cleanAnalysis}",\n`;
    passageAidsStr += `  },\n`;
  }
  passageAidsStr += '}';
  
  let newAidContent = aidFileContent.substring(0, startMatch) + passageAidsStr + aidFileContent.substring(endMatch + 1);
  fs.writeFileSync(readingAidPath, newAidContent, 'utf8');
  console.log(`Successfully merged ${Object.keys(readingAids).length} I Ching passage aids into ${readingAidPath}.`);
}

run();
