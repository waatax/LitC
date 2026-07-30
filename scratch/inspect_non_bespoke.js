import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

const unescapeTsString = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

const aids = new Map();
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: unescapeTsString(match[2]), annotation: unescapeTsString(match[3]) });
}

const gvChapters = chapters.filter((c) => c.workId === 'gu-wen-guan-zhi');
const nonBespoke = [];
gvChapters.forEach((ch, idx) => {
  const chPassages = passages.filter((p) => p.chapterId === ch.id);
  const isBespoke = chPassages.every((p) => {
    const aid = aids.get(p.id);
    return aid && aid.annotation && !aid.annotation.includes('• 說話者與對象：');
  });
  if (!isBespoke) {
    nonBespoke.push({ idx: idx + 1, id: ch.id, title: ch.title, passagesCount: chPassages.length, passageIds: chPassages.map(p => p.id) });
  }
});

console.log('Non-bespoke gu-wen-guan-zhi chapters count:', nonBespoke.length);
console.log('Total non-bespoke passages count:', nonBespoke.reduce((sum, c) => sum + c.passagesCount, 0));
nonBespoke.forEach(c => console.log(`Chapter ${c.idx}: ${c.title} (${c.id}) - ${c.passagesCount} passages`));
