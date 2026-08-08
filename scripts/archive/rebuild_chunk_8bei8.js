import fs from 'fs';
import path from 'path';
import OpenCC from 'opencc-js';

const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn);

function convertBounded(text) {
  if (!text) return text;
  let result = '';
  for (let offset = 0; offset < text.length; offset += 400) {
    result += toTraditional(text.slice(offset, offset + 400));
  }
  return result;
}

const rawData = JSON.parse(fs.readFileSync('scripts/data_8bei8.json', 'utf8'));

// Total: 534. Divide into 5 chapters. 107, 107, 107, 107, 106
const chapterTitles = ['修身', '應酬', '評議', '閒適', '素位'];
const chaptersData = [];
let currentIndex = 0;

for (let i = 0; i < 5; i++) {
  const count = i === 4 ? 106 : 107;
  const chunkRows = rawData.slice(currentIndex, currentIndex + count);
  currentIndex += count;
  
  chaptersData.push({
    id: `cai-gen-tan_ch-${i + 1}`,
    title: chapterTitles[i],
    rows: chunkRows
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
let totalChars = 0;

chaptersData.forEach((chMeta, chIdx) => {
  const chapterId = chMeta.id;
  const passageIds = [];
  
  let pIdx = 0;
  const passagesForBundle = [];
  
  chMeta.rows.forEach((row) => {
    pIdx++;
    const passageId = `${chapterId}_p-${pIdx}`;
    passageIds.push(passageId);
    
    // Convert to traditional
    const tcChinese = convertBounded(row.chinese);
    const tcTranslation = convertBounded(row.translation);
    
    totalChars += tcChinese.replace(/[，。；！？、：\s]/g, '').length;
    
    const sentenceTexts = splitSentences(tcChinese);
    const sentenceIds = [];
    const sentencesForBundle = [];
    
    sentenceTexts.forEach((sText, sIdx) => {
      const sentenceId = `${passageId}_s-${sIdx + 1}`;
      sentenceIds.push(sentenceId);
      const sentenceChunks = splitChunks(sText, sentenceId);
      sentencesForBundle.push({
        id: sentenceId,
        passageId,
        order: sIdx + 1,
        canonicalText: sText,
        chunks: sentenceChunks,
        translationHint: tcTranslation || `此句釋義提示。`,
        tags: []
      });
    });
    
    passagesForBundle.push({
      id: passageId,
      chapterId,
      order: pIdx,
      canonicalText: tcChinese,
      sentenceIds,
      sentences: sentencesForBundle,
      sourceRefs: [{ label: "經文底本", edition: "清刻本(8bei8)" }]
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
    passages: passagesForBundle,
    tags: ['文學', '處世', chMeta.title]
  });
});

const newWork = {
  id: 'cai-gen-tan',
  schoolId: 'literature',
  title: '菜根譚',
  subtitle: '洪應明',
  genreStrategy: 'rhythmic',
  sourceNote: '清刻本(8bei8)，洪應明著。',
  chapterIds: newChapters.map(c => c.id),
  totalChars
};

// Write chunk file
const bundle = {
  work: newWork,
  chapters: newChapters
};

function jsString(value) {
  return JSON.stringify(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const chunkContent = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse('${jsString(bundle)}') as WorkBundle\n`;
fs.writeFileSync('src/data/work_chunks/cai-gen-tan.ts', chunkContent, 'utf8');

// Update works.ts
const worksTsPath = 'src/data/works.ts';
let worksTsContent = fs.readFileSync(worksTsPath, 'utf8');

const worksRegex = /export const works = JSON\.parse\('([^]+?)'\) as Work\[\]/;
const chaptersRegex = /export const chapters = JSON\.parse\('([^]+?)'\) as Chapter\[\]/;

const worksMatch = worksTsContent.match(worksRegex);
const chaptersMatch = worksTsContent.match(chaptersRegex);

if (worksMatch && chaptersMatch) {
  let worksArr = JSON.parse(worksMatch[1].replace(/\\'/g, "'"));
  let chaptersArr = JSON.parse(chaptersMatch[1].replace(/\\'/g, "'"));
  
  worksArr = worksArr.filter(w => w.id !== 'cai-gen-tan');
  worksArr.push(newWork);
  
  chaptersArr = chaptersArr.filter(c => c.workId !== 'cai-gen-tan');
  const lightChapters = newChapters.map(c => {
    const { passages, ...rest } = c;
    return rest;
  });
  chaptersArr.push(...lightChapters);
  
  worksTsContent = worksTsContent.replace(worksRegex, `export const works = JSON.parse('${jsString(worksArr)}') as Work[]`);
  worksTsContent = worksTsContent.replace(chaptersRegex, `export const chapters = JSON.parse('${jsString(chaptersArr)}') as Chapter[]`);
  
  fs.writeFileSync(worksTsPath, worksTsContent, 'utf8');
  console.log('Successfully updated chunk and works.ts with 534 passages!');
} else {
  console.log('Failed to match works or chapters in works.ts');
}
