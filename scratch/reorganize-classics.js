import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worksPath = path.join(__dirname, '../src/data/works.ts');

import { works, chapters, passages, sentences } from '../src/data/works.ts';

// 1. Reconstruct gu-wen-guan-zhi and cai-gen-tan works
const gwgzOriginalChapterIds = [
  'gu-wen-guan-zhi_ch-1',
  'gu-wen-guan-zhi_ch-2',
  'gu-wen-guan-zhi_ch-3',
  'gu-wen-guan-zhi_ch-4',
  'gu-wen-guan-zhi_ch-5'
];

// Find original gu-wen-guan-zhi and calculate its chars
const gwgzChapters = chapters.filter(c => gwgzOriginalChapterIds.includes(c.id));
const gwgzPassageIds = [];
gwgzChapters.forEach(c => gwgzPassageIds.push(...c.passageIds));
const gwgzPassages = passages.filter(p => gwgzPassageIds.includes(p.id));
let gwgzChars = 0;
gwgzPassages.forEach(p => {
  gwgzChars += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
});

const gwgzWork = {
  id: 'gu-wen-guan-zhi',
  schoolId: 'literature',
  title: '古文觀止',
  genreStrategy: 'parallel',
  sourceNote: '清代編選之歷代名篇散文精華，文學殿堂之階梯。',
  chapterIds: gwgzOriginalChapterIds,
  totalChars: gwgzChars
};

// Reconstruct cai-gen-tan as standalone work under literature school
// Use c.order >= 6 since Cai Gen Tan chapters were added as chapters 6 to 10 in gu-wen-guan-zhi
const cgtChapters = chapters.filter(c => c.workId === 'gu-wen-guan-zhi' && c.order >= 6);

const migratedChapters = cgtChapters.map((ch, idx) => {
  const originalId = ch.id;
  const newIdx = idx + 1;
  const newId = `cai-gen-tan_ch-${newIdx}`;
  const newPassageIds = ch.passageIds.map(pid => pid.replace(originalId, newId));
  
  return {
    ...ch,
    id: newId,
    workId: 'cai-gen-tan',
    order: newIdx,
    title: ch.title.replace('菜根譚·', ''),
    passageIds: newPassageIds
  };
});

const cgtPassageIds = [];
cgtChapters.forEach(c => cgtPassageIds.push(...c.passageIds));
const cgtPassages = passages.filter(p => cgtPassageIds.includes(p.id));

const migratedPassages = cgtPassages.map(p => {
  const originalId = p.id;
  
  // Find which chapter this passage belongs to, and map to new ID
  const oldChId = p.chapterId;
  const chOrder = chapters.find(c => c.id === oldChId)?.order || 6;
  const newChIdx = chOrder - 5;
  const newChapterId = `cai-gen-tan_ch-${newChIdx}`;
  const newId = originalId.replace(oldChId, newChapterId);
  
  const newSentenceIds = p.sentenceIds.map(sid => sid.replace(oldChId, newChapterId));
  
  return {
    ...p,
    id: newId,
    chapterId: newChapterId,
    sentenceIds: newSentenceIds
  };
});

const cgtSentenceIds = [];
cgtPassages.forEach(p => cgtSentenceIds.push(...p.sentenceIds));
const cgtSentences = sentences.filter(s => cgtSentenceIds.includes(s.id));

const migratedSentences = cgtSentences.map(s => {
  const originalId = s.id;
  
  // Find corresponding old chapter and map
  const oldPassageId = s.passageId;
  // Format is gu-wen-guan-zhi_ch-X_p-Y
  const match = oldPassageId.match(/gu-wen-guan-zhi_ch-([0-9]+)/);
  const chOrder = match ? parseInt(match[1]) : 6;
  const newChIdx = chOrder - 5;
  
  const oldPrefix = `gu-wen-guan-zhi_ch-${chOrder}`;
  const newPrefix = `cai-gen-tan_ch-${newChIdx}`;
  
  const newId = originalId.replace(oldPrefix, newPrefix);
  const newPassageId = s.passageId.replace(oldPrefix, newPrefix);
  
  const newChunks = s.chunks.map(c => {
    return {
      ...c,
      id: c.id.replace(oldPrefix, newPrefix),
      sentenceId: newId
    };
  });
  
  return {
    ...s,
    id: newId,
    passageId: newPassageId,
    chunks: newChunks
  };
});

let cgtChars = 0;
migratedPassages.forEach(p => {
  cgtChars += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
});

const cgtWork = {
  id: 'cai-gen-tan',
  schoolId: 'literature',
  title: '菜根譚',
  genreStrategy: 'rhythmic',
  sourceNote: '乾隆五十九年遂初堂刻本，洪應明著。',
  chapterIds: migratedChapters.map(c => c.id),
  totalChars: cgtChars
};

// Filter out old gu-wen-guan-zhi elements
const restWorks = works.filter(w => w.id !== 'gu-wen-guan-zhi' && w.id !== 'cai-gen-tan');
const restChapters = chapters.filter(c => c.workId !== 'gu-wen-guan-zhi');

// Clean passages and sentences
// Keep ones that don't start with gu-wen-guan-zhi_ch- (or if they do, only if they are chapters 1 to 5)
const restPassages = passages.filter(p => {
  if (!p.chapterId.startsWith('gu-wen-guan-zhi_ch-')) return true;
  const match = p.chapterId.match(/gu-wen-guan-zhi_ch-([0-9]+)/);
  const chOrder = match ? parseInt(match[1]) : 1;
  return chOrder <= 5;
});

const restSentences = sentences.filter(s => {
  if (!s.passageId.startsWith('gu-wen-guan-zhi_ch-')) return true;
  const match = s.passageId.match(/gu-wen-guan-zhi_ch-([0-9]+)/);
  const chOrder = match ? parseInt(match[1]) : 1;
  return chOrder <= 5;
});

// Merge arrays
const finalWorks = [...restWorks, gwgzWork, cgtWork];
const finalChapters = [...restChapters, ...gwgzChapters, ...migratedChapters];
const finalPassages = [...restPassages, ...migratedPassages];
const finalSentences = [...restSentences, ...migratedSentences];

// Write updated works.ts
const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(finalWorks, null, 2)};

export const chapters: Chapter[] = ${JSON.stringify(finalChapters, null, 2)};

export const passages: Passage[] = ${JSON.stringify(finalPassages, null, 2)};

export const sentences: Sentence[] = ${JSON.stringify(finalSentences, null, 2)};
`;

fs.writeFileSync(worksPath, worksTsContent, 'utf8');
console.log("Successfully reorganized Cai Gen Tan under literature school and cleaned up Guwen Guanzhi!");
