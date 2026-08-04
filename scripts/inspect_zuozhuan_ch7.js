import fs from 'fs';

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
const jsonEncodedMatch = worksTs.match(/decodeURIComponent\(["']([^"']+)["']\)/);
const works = JSON.parse(decodeURIComponent(jsonEncodedMatch[1]));
const chapters = JSON.parse(decodeURIComponent(worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\(["']([^"']+)["']\)\)/)[1]));

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];
const allPassages = [...p1, ...p2];

const zuoWork = works.find(w => w.id === 'chun-qiu-zuo-zhuan');
console.log("Zuo Zhuan Work Entry:", zuoWork ? { id: zuoWork.id, title: zuoWork.title, chaptersCount: zuoWork.chapterIds.length } : "Not found");

const zuoChapters = chapters.filter(c => c.workId === 'chun-qiu-zuo-zhuan');
console.log(`Zuo Zhuan Chapters Count: ${zuoChapters.length}`);

const ch7 = zuoChapters.find(c => c.id === 'chun-qiu-zuo-zhuan_ch-7');
console.log("Chapter 7 Info:", ch7);

const ch7Passages = allPassages.filter(p => p.chapterId === 'chun-qiu-zuo-zhuan_ch-7');
console.log(`Chapter 7 Passages Count: ${ch7Passages.length}`);
ch7Passages.forEach(p => {
  console.log(`Passage ID ${p.id}: Canonical Text: "${p.canonicalText}"`);
});

const readingAidContent = fs.readFileSync('src/data/readingAid.ts', 'utf8');
ch7Passages.forEach(p => {
  const match = readingAidContent.match(new RegExp(`'${p.id}':\\s*\\{[\\s\\S]*?\\}`));
  console.log(`\nReading Aid for ${p.id}:\n${match ? match[0] : 'NOT FOUND'}`);
});
