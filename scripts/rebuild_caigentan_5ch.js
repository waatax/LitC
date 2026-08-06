import fs from 'fs';
import path from 'path';

// 1. Parse the original ctext HTML
const rawContent = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/385/content.md', 'utf8');
const allPassages = [];
let index = 0;
while (true) {
  index = rawContent.indexOf('<tr', index);
  if (index === -1) break;
  const endIndex = rawContent.indexOf('</tr>', index);
  if (endIndex === -1) break;
  const rowHtml = rawContent.substring(index, endIndex + 5);
  const idMatch = rowHtml.match(/id="p([0-9]+)"/i);
  const rowId = idMatch ? parseInt(idMatch[1]) : 0;
  
  const tdParts = rowHtml.split(/<td[^>]*class="ctext"[^>]*>/gi);
  if (tdParts.length >= 2) {
    const textTd = tdParts[tdParts.length - 1].split(/<\/td>/gi)[0];
    let rawChinese = textTd.split(/<br\s*\/?>/i)[0];
    rawChinese = rawChinese.replace(/<span[^>]*>.*?<\/span>/gi, '').trim();
    rawChinese = rawChinese.replace(/<[^>]+>/g, '').trim();
    
    // Ignore chapter title rows (which are very short, e.g., "修身")
    if (rawChinese.length > 5) {
      let translation = '';
      const etextMatch = textTd.match(/<span class="etext">([\s\S]*?)<\/span>/i);
      if (etextMatch) {
        translation = etextMatch[1].replace(/<[^>]+>/g, '').trim();
      }
      allPassages.push({
        id: rowId,
        chinese: rawChinese,
        translation: translation
      });
    }
  }
  index = endIndex + 5;
}

// 2. Map to 5 Chapters
const chapterTitles = ['修身', '應酬', '評議', '閒適', '素位'];
const chaptersData = [];

for (let i = 0; i < 5; i++) {
  const startIdx = i * 73;
  const endIdx = (i === 4) ? allPassages.length : (i + 1) * 73;
  chaptersData.push({
    id: `cai-gen-tan_ch-${i + 1}`,
    title: chapterTitles[i],
    rows: allPassages.slice(startIdx, endIdx)
  });
}

function splitSentences(text) {
  const parts = text.match(/[^。！？；\n]+[。！？；]?/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  return parts.length ? parts : [text];
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
    if (tempChunks.length > 0) tempChunks[tempChunks.length - 1] += current;
    else tempChunks.push(current);
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
      sourceRefs: [{ label: "經文底本", edition: "遂初堂本" }]
    });
  });
  
  newChapters.push({
    id: chapterId,
    workId: 'cai-gen-tan',
    order: chIdx + 1,
    title: chMeta.title,
    difficulty: 3,
    estimatedMinutes: Math.ceil(chMeta.rows.length * 0.5),
    passageIds,
    tags: ['文學', '處世', chMeta.title]
  });
});

const newWork = {
  id: 'cai-gen-tan',
  schoolId: 'literature',
  title: '菜根譚',
  subtitle: '洪應明',
  genreStrategy: 'rhythmic',
  sourceNote: '乾隆五十九年遂初堂刻本，洪應明著。',
  chapterIds: newChapters.map(c => c.id),
  totalChars
};

function jsString(value) {
  return JSON.stringify(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function extractFile(filepath, varName) {
  const content = fs.readFileSync(filepath, 'utf8');
  let regex = new RegExp(`export const ${varName}(?:\\s*:\\s*[A-Za-z\\[\\]]+)?\\s*=\\s*JSON\\.parse\\('([^]+?)'\\)(?:\\s*as\\s+[A-Za-z\\[\\]]+)?`);
  let match = content.match(regex);
  if (!match) {
    regex = new RegExp(`JSON\\.parse\\('([^]+?)'\\)`);
    match = content.match(regex);
    if(!match) throw new Error(`Could not find ${varName} in ${filepath}`);
  }
  return JSON.parse(match[1].replace(/\\'/g, "'"));
}

const basePath = 'c:/Users/User/OneDrive/文件/Antigravity/LitC/src/data';

// 3. Process works.ts
let currentWorks = extractFile(path.join(basePath, 'works.ts'), 'works');
let currentChapters = extractFile(path.join(basePath, 'works.ts'), 'chapters');

currentWorks = currentWorks.filter(w => w.id !== 'cai-gen-tan');
currentWorks.push(newWork);

currentChapters = currentChapters.filter(c => c.workId !== 'cai-gen-tan');
currentChapters.push(...newChapters);

const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'
import { passagesPart1 } from './sentence_chunks/passages_part1'
import { passagesPart2 } from './sentence_chunks/passages_part2'

export const works = JSON.parse('${jsString(currentWorks)}') as Work[]
export const chapters = JSON.parse('${jsString(currentChapters)}') as Chapter[]
export const passages: Passage[] = [...passagesPart1, ...passagesPart2];
export const sentences: Sentence[] = [];
`;
fs.writeFileSync(path.join(basePath, 'works.ts'), worksTsContent, 'utf8');

// 4. Process passages_part2.ts
let currentPassages = extractFile(path.join(basePath, 'sentence_chunks/passages_part2.ts'), 'passagesPart2');
currentPassages = currentPassages.filter(p => !p.id.startsWith('cai-gen-tan_'));
currentPassages.push(...newPassages);

const passagesTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// ─────────────────────────────────────────────────
import type { Passage } from '../../types/content'

export const passagesPart2 = JSON.parse('${jsString(currentPassages)}') as Passage[]
`;
fs.writeFileSync(path.join(basePath, 'sentence_chunks/passages_part2.ts'), passagesTsContent, 'utf8');

// 5. Process part8.ts
let currentSentences = extractFile(path.join(basePath, 'sentence_chunks/part8.ts'), 'sentencesPart8');
currentSentences = currentSentences.filter(s => !s.id.startsWith('cai-gen-tan_'));
currentSentences.push(...newSentences);

const sentencesTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// ─────────────────────────────────────────────────
import type { Sentence } from '../../types/content'

export const sentencesPart8 = JSON.parse('${jsString(currentSentences)}') as Sentence[]
`;
fs.writeFileSync(path.join(basePath, 'sentence_chunks/part8.ts'), sentencesTsContent, 'utf8');

console.log('Successfully rebuilt Cai Gen Tan into 5 chapters!');
