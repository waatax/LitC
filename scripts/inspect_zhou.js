import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');

// Find chapters and passages for lost-book-of-zhou
const id = 'lost-book-of-zhou';

// Let's decode JSON string in works.ts
const match = worksSource.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
if (match) {
  const jsonStr = decodeURIComponent(match[1]);
  const works = JSON.parse(jsonStr);
  const zhouWork = works.find(w => w.id === id);
  console.log('Work entry:', zhouWork);
}

// Find chapters matching lost-book-of-zhou
const chapMatch = worksSource.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
if (chapMatch) {
  const jsonStr = decodeURIComponent(chapMatch[1]);
  const chapters = JSON.parse(jsonStr);
  const zhouChaps = chapters.filter(c => c.workId === id);
  console.log('Chapters count:', zhouChaps.length);
  console.log('Chapters:', zhouChaps);
}

// Find passages matching lost-book-of-zhou
const passMatch = worksSource.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
if (passMatch) {
  const jsonStr = decodeURIComponent(passMatch[1]);
  const passages = JSON.parse(jsonStr);
  const zhouPassages = passages.filter(p => p.chapterId.startsWith(id));
  console.log('Passages count:', zhouPassages.length);
  console.log('Passages:', zhouPassages.map(p => ({ id: p.id, chapterId: p.chapterId, text: p.canonicalText.substring(0, 40) })));
}
