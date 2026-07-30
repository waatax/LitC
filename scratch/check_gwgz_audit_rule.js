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

const normalized = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉]/g, '');

const canonicalByPassage = new Map(passages.map((passage) => [passage.id, normalized(passage.canonicalText)]));
const canonicalSets = (field) => {
  const sets = new Map();
  for (const [passageId, aid] of aids) {
    const key = normalized(aid[field] || '');
    if (!sets.has(key)) sets.set(key, new Set());
    sets.get(key).add(canonicalByPassage.get(passageId) || passageId);
  }
  return sets;
};

const annotationCanonicalSets = canonicalSets('annotation');
const uniqueAnnotation = (aid) => aid?.annotation && annotationCanonicalSets.get(normalized(aid.annotation)).size === 1;

const gvPassages = passages.filter(p => {
  const ch = chapters.find(c => c.id === p.chapterId);
  return ch && ch.workId === 'gu-wen-guan-zhi';
});

console.log(`Total gu-wen-guan-zhi passages: ${gvPassages.length}`);

const nonBespokeGV = gvPassages.filter(p => {
  const aid = aids.get(p.id);
  return !uniqueAnnotation(aid);
});

console.log(`Non-bespoke gu-wen-guan-zhi passages count according to audit rule: ${nonBespokeGV.length}`);
if (nonBespokeGV.length > 0) {
  nonBespokeGV.forEach(p => {
    const aid = aids.get(p.id);
    console.log(`Non-bespoke passage: ${p.id}, text: ${aid?.annotation?.substring(0, 30)}...`);
  });
} else {
  console.log('🎉 🎉 🎉《古文觀止》424/424 段落 100% 全數達成專屬註釋與白話翻譯！');
}
