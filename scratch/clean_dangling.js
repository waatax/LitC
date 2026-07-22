import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { works, chapters, passages, sentences } from '../src/data/works.js';

const targetPassageIds = ['dao-de-jing_ch-21_p-2', 'zhuangzi_ch-9_p-2'];

const cleanedPassages = passages.filter(p => !targetPassageIds.includes(p.id) && p.canonicalText.trim() !== '---');
const removedPassageIds = passages.filter(p => targetPassageIds.includes(p.id) || p.canonicalText.trim() === '---').map(p => p.id);

const cleanedSentences = sentences.filter(s => !removedPassageIds.includes(s.passageId));

const cleanedChapters = chapters.map(ch => ({
  ...ch,
  passageIds: ch.passageIds.filter(pid => !removedPassageIds.includes(pid))
}));

const cleanedWorks = works.map(w => {
  const workChapters = cleanedChapters.filter(c => c.workId === w.id);
  let total = 0;
  workChapters.forEach(ch => {
    const chPassages = cleanedPassages.filter(p => p.chapterId === ch.id);
    chPassages.forEach(p => {
      total += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
    });
  });
  return {
    ...w,
    totalChars: total
  };
});

const worksPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/works.ts');

const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()} (已清理 --- 占位符)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cleanedWorks))}"));

export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cleanedChapters))}"));

export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cleanedPassages))}"));

export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cleanedSentences))}"));
`;

fs.writeFileSync(worksPath, worksTsContent, 'utf8');
console.log(`Cleaned up ${removedPassageIds.length} dangling passages and their sentences. Written to ${worksPath}.`);
