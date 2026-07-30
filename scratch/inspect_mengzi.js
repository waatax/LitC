import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

const mengziChapters = chapters.filter((c) => c.workId === 'meng-zi');
console.log(`Total chapters in meng-zi: ${mengziChapters.length}`);

mengziChapters.forEach((ch, idx) => {
  const chPassages = passages.filter((p) => p.chapterId === ch.id);
  console.log(`Chapter ${idx + 1}: ${ch.id} (${ch.title}) - ${chPassages.length} passages`);
});
