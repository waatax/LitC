import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

const ddjChapters = chapters.filter((c) => c.workId === 'dao-de-jing');

const result = [];
ddjChapters.forEach((ch, idx) => {
  const chPassages = passages.filter((p) => p.chapterId === ch.id);
  result.push({
    chapterIndex: idx + 1,
    chapterId: ch.id,
    chapterTitle: ch.title,
    passages: chPassages.map(p => ({
      id: p.id,
      canonicalText: p.canonicalText
    }))
  });
});

fs.writeFileSync(path.join(root, 'scratch/daodejing_passages.json'), JSON.stringify(result, null, 2), 'utf8');
console.log(`Extracted ${result.length} chapters, total ${result.reduce((sum, c) => sum + c.passages.length, 0)} passages for Dao De Jing.`);
