import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schoolsPath = path.join(__dirname, '../src/data/schools.ts');
const worksPath = path.join(__dirname, '../src/data/works.ts');
const sourcePath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/385/content.md';

const rawContent = fs.readFileSync(sourcePath, 'utf8');

// 1. Read existing schools and append 'syncretism' if not exists
let schoolsContent = fs.readFileSync(schoolsPath, 'utf8');
if (!schoolsContent.includes('cai-gen-tan')) {
  // Update schools list
  // Replace the closing array bracket with the new school entry
  const newSchool = `  {
    id: 'syncretism',
    name: '儒釋道',
    description: '融合儒家盡性、佛家明心、道家清靜之智慧，為身心性命修養與處世之道。',
    icon: '🌸',
    workIds: ['cai-gen-tan'],
  },
];`;
  schoolsContent = schoolsContent.replace(/\];\s*$/, newSchool);
  fs.writeFileSync(schoolsPath, schoolsContent, 'utf8');
  console.log("Appended syncretism school to schools.ts");
}

// 2. Parse Cai Gen Tan ctext html
const parsedRows = [];
let index = 0;
while (true) {
  index = rawContent.indexOf('<tr class="result"', index);
  if (index === -1) break;
  const endIndex = rawContent.indexOf('</tr>', index);
  if (endIndex === -1) break;
  const rowHtml = rawContent.substring(index, endIndex + 5);
  const idMatch = rowHtml.match(/id="p([0-9]+)"/i);
  const rowId = idMatch ? parseInt(idMatch[1]) : 0;
  
  const tdParts = rowHtml.split(/<td[^>]*class="ctext"[^>]*>/gi);
  if (tdParts.length >= 3) {
    const textTd = tdParts[2].split(/<\/td>/gi)[0];
    let rawChinese = textTd.split(/<br\s*\/?>/i)[0];
    rawChinese = rawChinese.replace(/<span[^>]*>.*?<\/span>/gi, '').trim();
    rawChinese = rawChinese.replace(/<[^>]+>/g, '').trim();
    
    let translation = '';
    const etextMatch = textTd.match(/<span class="etext">([\s\S]*?)<\/span>/i);
    if (etextMatch) {
      translation = etextMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    parsedRows.push({
      id: rowId,
      chinese: rawChinese,
      translation: translation
    });
  }
  index = endIndex + 5;
}

console.log(`Parsed ${parsedRows.length} raw rows from Cai Gen Tan ctext source.`);

// Helper functions for sentence and chunk splitting
function splitSentences(text) {
  const regex = /[^。；！？\r\n]+[。；！？]+/g;
  let matches = text.match(regex);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map(m => m.trim()).filter(Boolean);
}

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

// 3. Group rows into 5 chapters
const chaptersData = [
  { id: 'cai-gen-tan_ch-1', title: '序言', rows: parsedRows.filter(r => r.id === 2 || r.id === 3) },
  { id: 'cai-gen-tan_ch-2', title: '修身', rows: parsedRows.filter(r => r.id >= 5 && r.id <= 34) },
  { id: 'cai-gen-tan_ch-3', title: '應酬', rows: parsedRows.filter(r => r.id >= 36 && r.id <= 81) },
  { id: 'cai-gen-tan_ch-4', title: '評議', rows: parsedRows.filter(r => r.id >= 83 && r.id <= 128) },
  { id: 'cai-gen-tan_ch-5', title: '閑適', rows: parsedRows.filter(r => r.id >= 130 && r.id <= 370) }
];

const newChapters = [];
const newPassages = [];
const newSentences = [];
let totalChars = 0;

chaptersData.forEach((chMeta, chIdx) => {
  const chapterId = chMeta.id;
  const passageIds = [];
  
  let pIdx = 0;
  chMeta.rows.forEach((row) => {
    pIdx++;
    const passageId = `${chapterId}_p-${pIdx}`;
    passageIds.push(passageId);
    
    // Add characters to total size (excluding punctuation)
    totalChars += row.chinese.replace(/[，。；！？、：\s]/g, '').length;
    
    const sentenceTexts = splitSentences(row.chinese);
    const sentenceIds = [];
    
    sentenceTexts.forEach((sText, sIdx) => {
      const sentenceId = `${passageId}_s-${sIdx + 1}`;
      sentenceIds.push(sentenceId);
      
      const sentenceChunks = splitChunks(sText, sentenceId);
      
      newSentences.push({
        id: sentenceId,
        passageId,
        order: sIdx + 1,
        canonicalText: sText,
        chunks: sentenceChunks,
        translationHint: row.translation || `此句釋義提示。`,
        tags: []
      });
    });
    
    newPassages.push({
      id: passageId,
      chapterId,
      order: pIdx,
      canonicalText: row.chinese,
      sentenceIds,
      sourceRefs: [{ label: "遂初堂本", edition: "乾隆五十九年" }]
    });
  });
  
  newChapters.push({
    id: chapterId,
    workId: 'cai-gen-tan',
    order: chIdx + 1,
    title: chMeta.title,
    difficulty: chMeta.title === '序言' ? 1 : 2,
    estimatedMinutes: chMeta.rows.length * 2,
    passageIds,
    tags: []
  });
});

const newWork = {
  id: 'cai-gen-tan',
  schoolId: 'syncretism',
  title: '菜根譚',
  genreStrategy: 'rhythmic',
  sourceNote: '乾隆五十九年遂初堂刻本，洪應明著。',
  chapterIds: newChapters.map(c => c.id),
  totalChars
};

// 4. Load existing works.ts and merge
// Since works.ts exports: works, chapters, passages, sentences
// We can import them dynamically or read the file as text and parse using node eval or regex!
// Reading it and parsing it as a JS module is extremely easy in node!
import { works, chapters, passages, sentences } from '../src/data/works.ts';

// Merge arrays
const updatedWorks = [...works, newWork];
const updatedChapters = [...chapters, ...newChapters];
const updatedPassages = [...passages, ...newPassages];
const updatedSentences = [...sentences, ...newSentences];

// Write updated works.ts
const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(updatedWorks, null, 2)};

export const chapters: Chapter[] = ${JSON.stringify(updatedChapters, null, 2)};

export const passages: Passage[] = ${JSON.stringify(updatedPassages, null, 2)};

export const sentences: Sentence[] = ${JSON.stringify(updatedSentences, null, 2)};
`;

fs.writeFileSync(worksPath, worksTsContent, 'utf8');
console.log(`Successfully appended Cai Gen Tan! Total works: ${updatedWorks.length}, Total chapters: ${updatedChapters.length}`);
