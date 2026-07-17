import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worksPath = path.join(__dirname, '../src/data/works.ts');

import { works, chapters, passages, sentences } from '../src/data/works.ts';

const cgtWork = works.find(w => w.id === 'cai-gen-tan');
if (cgtWork) {
  // Find all chapters for cai-gen-tan
  const cgtChapters = chapters.filter(c => c.workId === 'cai-gen-tan' || c.id.startsWith('cai-gen-tan_ch-'));
  
  // Update their workId to cai-gen-tan to be safe
  cgtChapters.forEach(c => {
    c.workId = 'cai-gen-tan';
  });
  
  cgtWork.chapterIds = cgtChapters.map(c => c.id);
  cgtWork.schoolId = 'literature'; // set to literature
  
  // Calculate total characters
  let totalChars = 0;
  const pIds = cgtChapters.flatMap(c => c.passageIds);
  const cgtPassages = passages.filter(p => pIds.includes(p.id));
  
  cgtPassages.forEach(p => {
    totalChars += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
  });
  
  cgtWork.totalChars = totalChars;
  
  console.log(`Reconstructed Cai Gen Tan! Chapters: ${cgtWork.chapterIds.length}, Chars: ${cgtWork.totalChars}`);
} else {
  console.error("Could not find cai-gen-tan work object!");
}

// Write updated works.ts
const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(works, null, 2)};

export const chapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};

export const passages: Passage[] = ${JSON.stringify(passages, null, 2)};

export const sentences: Sentence[] = ${JSON.stringify(sentences, null, 2)};
`;

fs.writeFileSync(worksPath, worksTsContent, 'utf8');
console.log("Successfully wrote reconstructed works.ts!");
