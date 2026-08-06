import fs from 'fs';
import path from 'path';

// 1. Parse original ctext HTML
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
    
    totalChars += row.chinese.replace(/[，。；！？、：\s]/g, '').length;
    
    const sentenceTexts = splitSentences(row.chinese);
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
        translationHint: row.translation || `此句釋義提示。`,
        tags: []
      });
    });
    
    passagesForBundle.push({
      id: passageId,
      chapterId,
      order: pIdx,
      canonicalText: row.chinese,
      sentenceIds,
      sentences: sentencesForBundle,
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
  sourceNote: '乾隆五十九年遂初堂刻本，洪應明著。',
  chapterIds: newChapters.map(c => c.id),
  totalChars
};

// 3. Write chunk file
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

// 4. Update works.ts (just read, parse json strings, replace cai-gen-tan, stringify back)
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
  // Add chapters but without the embedded passages/sentences
  const lightChapters = newChapters.map(c => {
    const { passages, ...rest } = c;
    return rest;
  });
  chaptersArr.push(...lightChapters);
  
  worksTsContent = worksTsContent.replace(worksRegex, `export const works = JSON.parse('${jsString(worksArr)}') as Work[]`);
  worksTsContent = worksTsContent.replace(chaptersRegex, `export const chapters = JSON.parse('${jsString(chaptersArr)}') as Chapter[]`);
  
  fs.writeFileSync(worksTsPath, worksTsContent, 'utf8');
  console.log('Successfully updated chunk and works.ts!');
} else {
  console.log('Failed to match works or chapters in works.ts');
}
