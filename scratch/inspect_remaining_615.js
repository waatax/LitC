import fs from 'fs';

const worksSource = fs.readFileSync('./src/data/works.ts', 'utf8');
const aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

const [works, chapters, passages, sentences] = encoded;
const chapterMap = new Map(chapters.map(c => [c.id, c]));
const workMap = new Map(works.map(w => [w.id, w]));

const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const aids = new Map();
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: match[2], analysis: match[3] });
}

console.log('Sample remaining untranslated passages:');
let count = 0;
for (const p of passages) {
  const aid = aids.get(p.id);
  if (!aid) continue;
  const cleanOriginal = p.canonicalText.replace(/[\s\p{P}]/gu, '');
  const cleanTrans = aid.translation.replace(/[\s\p{P}]/gu, '');
  if (cleanTrans === cleanOriginal && count < 15) {
    const ch = chapterMap.get(p.chapterId);
    const work = workMap.get(ch?.workId);
    console.log(`\nID: ${p.id} (${work?.title} - ${ch?.title})`);
    console.log(`Original:    ${p.canonicalText}`);
    console.log(`Translation: ${aid.translation}`);
    count++;
  }
}
