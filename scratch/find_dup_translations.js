import fs from 'fs';
import path from 'path';

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

const normalized = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉]/g, '');

const translationSets = new Map();
for (const [id, aid] of aids) {
  const normTr = normalized(aid.translation);
  if (!translationSets.has(normTr)) translationSets.set(normTr, []);
  translationSets.get(normTr).push(id);
}

for (const [normTr, ids] of translationSets) {
  if (ids.length > 1) {
    console.log(`Duplicate translation normalized: "${normTr.slice(0, 30)}..." used in:`, ids);
  }
}
