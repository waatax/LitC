import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worksPath = path.join(__dirname, '../src/data/works.ts');

import { works, chapters, passages, sentences } from '../src/data/works.ts';

// Find cai-gen-tan work and change its schoolId to 'literature'
const cgtWork = works.find(w => w.id === 'cai-gen-tan');
if (cgtWork) {
  cgtWork.schoolId = 'literature';
  console.log("Changed cai-gen-tan schoolId to literature!");
} else {
  console.error("Could not find cai-gen-tan!");
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
console.log("Works database successfully written!");
