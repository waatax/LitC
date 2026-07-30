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
console.log(`Total chapters in gu-wen-guan-zhi: ${gvChapters.length}`);

// Find chapters from 208 onwards (or index 207)
gvChapters.forEach((ch, idx) => {
  const chPassages = passages.filter((p) => p.chapterId === ch.id);
  const isBespoke = chPassages.every((p) => {
    const aid = aids.get(p.id);
    return aid && aid.annotation && !aid.annotation.includes('• 說話者與對象：');
  });

  if (!isBespoke || ch.title.includes('賣柑者言') || idx >= 200) {
    console.log(`\n=== Chapter ${idx + 1}: ${ch.id} - ${ch.title} (Bespoke: ${isBespoke}) ===`);
    chPassages.forEach((p) => {
      const aid = aids.get(p.id);
      console.log(`  [Passage ${p.id}] Canonical: ${p.canonicalText.substring(0, 50)}...`);
      console.log(`    Translation snippet: ${aid?.translation?.substring(0, 40)}...`);
      console.log(`    Analysis snippet: ${aid?.annotation?.substring(0, 40)}...`);
    });
  }
});
