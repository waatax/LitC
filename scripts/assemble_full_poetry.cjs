// scripts/assemble_full_poetry.cjs
const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn);

const tangPrimary = require('./corpus_data/tang_primary.cjs');
const songPrimary = require('./corpus_data/song_primary.cjs');
const yuanQu = require('./corpus_data/yuan_qu.cjs');
const existing = JSON.parse(fs.readFileSync('./scripts/corpus_data/existing_enriched.json', 'utf8'));

console.log('Tang primary count:', tangPrimary.length);
console.log('Song primary count:', songPrimary.length);
console.log('Yuan qu count:', yuanQu.length);
console.log('Existing count:', existing.length);

// 組合排列順序：
// 先按照年級與啟蒙順序排列，讓小學生一打開網站就能看到親切好學的啟蒙篇章！
// 1. 小學啟蒙（一二年級）
// 2. 小學精進（三四年級）
// 3. 小學經典（五六年級）
// 4. 初中拔尖名篇

const allPoems = [...tangPrimary, ...songPrimary, ...yuanQu, ...existing];

// 確保所有 ID 不重複
const idSet = new Set();
const deduped = [];
for (const poem of allPoems) {
  if (!idSet.has(poem.id)) {
    idSet.add(poem.id);
    deduped.push(poem);
  } else {
    console.warn('Duplicate ID detected:', poem.id);
  }
}

console.log('Total deduped poems:', deduped.length);

// 依照難度與體裁排序：
const gradeOrder = {
  'primary-low': 1,
  'primary-mid': 2,
  'primary-high': 3,
  'advanced': 4
};

deduped.sort((a, b) => {
  const gA = gradeOrder[a.gradeLevel || 'advanced'] || 4;
  const gB = gradeOrder[b.gradeLevel || 'advanced'] || 4;
  if (gA !== gB) return gA - gB;
  // 同難度下，唐詩 -> 宋詞 -> 元曲
  const typeOrder = { 'tang': 1, 'song': 2, 'yuan': 3 };
  const tA = typeOrder[a.type] || 4;
  const tB = typeOrder[b.type] || 4;
  return tA - tB;
});

// 生成 src/data/poetry.ts
const fileHeader = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 唐詩宋詞元曲兒童與青少年快樂古文典藏
// 涵蓋唐詩、宋詞、元曲三大體裁名篇，配備注音、拼音、白話精譯、童趣故事、生字詞典與趣味小百科
// ─────────────────────────────────────────────────
import type { PoemItem } from '../types/content'

export const POETRY_COLLECTION: PoemItem[] = `;

const fileFooter = `

export function getPoemById(id: string): PoemItem | undefined {
  return POETRY_COLLECTION.find((p) => p.id === id)
}

export function getPoemsByType(type: 'tang' | 'song' | 'yuan'): PoemItem[] {
  return POETRY_COLLECTION.filter((p) => p.type === type)
}

export function getPoemsByGrade(grade: 'primary-low' | 'primary-mid' | 'primary-high' | 'advanced'): PoemItem[] {
  return POETRY_COLLECTION.filter((p) => p.gradeLevel === grade)
}

export function getPoetryStats() {
  const tangCount = POETRY_COLLECTION.filter((p) => p.type === 'tang').length
  const songCount = POETRY_COLLECTION.filter((p) => p.type === 'song').length
  const yuanCount = POETRY_COLLECTION.filter((p) => p.type === 'yuan').length
  const authors = Array.from(new Set(POETRY_COLLECTION.map((p) => p.author)))
  return {
    total: POETRY_COLLECTION.length,
    tangCount,
    songCount,
    yuanCount,
    authorCount: authors.length,
  }
}
`;

const jsonString = JSON.stringify(deduped, null, 2);
const fullOutput = fileHeader + jsonString + fileFooter;

// 寫入 src/data/poetry.ts
fs.writeFileSync('src/data/poetry.ts', fullOutput, 'utf8');
console.log('Successfully written src/data/poetry.ts!');
