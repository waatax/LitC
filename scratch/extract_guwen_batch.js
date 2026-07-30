import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

const gvChapters = chapters.filter((c) => c.workId === 'gu-wen-guan-zhi');
const targetChapters = gvChapters.slice(207); // index 207 is chapter 208

const result = [];
targetChapters.forEach((ch, idx) => {
  const chPassages = passages.filter((p) => p.chapterId === ch.id);
  result.push({
    chapterIndex: idx + 208,
    chapterId: ch.id,
    chapterTitle: ch.title,
    passages: chPassages.map(p => ({
      id: p.id,
      canonicalText: p.canonicalText
    }))
  });
});

fs.writeFileSync(path.join(root, 'scratch/guwen_208_222.json'), JSON.stringify(result, null, 2), 'utf8');
console.log(`Extracted ${result.length} chapters, total ${result.reduce((sum, c) => sum + c.passages.length, 0)} passages.`);
