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

const gvPassages = passages.filter(p => {
  const ch = chapters.find(c => c.id === p.chapterId);
  return ch && ch.workId === 'gu-wen-guan-zhi';
});

console.log(`Total gu-wen-guan-zhi passages: ${gvPassages.length}`);

const nonBespokeGV = gvPassages.filter(p => {
  const aid = aids.get(p.id);
  return !aid || !aid.annotation || aid.annotation.includes('• 說話者與對象：');
});

console.log(`Non-bespoke gu-wen-guan-zhi passages count: ${nonBespokeGV.length}`);
if (nonBespokeGV.length > 0) {
  nonBespokeGV.forEach(p => console.log(`Non-bespoke passage: ${p.id}, chapter: ${p.chapterId}`));
} else {
  console.log('🎉《古文觀止》424/424 段落 100% 全數達成專屬註釋與白話翻譯！');
}
