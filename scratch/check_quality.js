import fs from 'fs';
import path from 'path';

const worksTsPath = './src/data/works.ts';
const readingAidTsPath = './src/data/readingAid.ts';
const workDescPath = './src/data/workDescriptions.ts';

const worksSource = fs.readFileSync(worksTsPath, 'utf8');
const aidSource = fs.readFileSync(readingAidTsPath, 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

const [works, chapters, passages, sentences] = encoded;

console.log('Works count:', works.length);
console.log('Chapters count:', chapters.length);
console.log('Passages count:', passages.length);
console.log('Sentences count:', sentences.length);

const unescapeTsString = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const aids = new Map();
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: unescapeTsString(match[2]), analysis: unescapeTsString(match[3]) });
}

let missingAid = 0;
let shortTranslation = 0;
let translationSameAsOriginal = 0;
let garbledText = 0;
let templateAnalysis = 0;

const workStats = new Map();
works.forEach(w => workStats.set(w.id, { name: w.title, totalP: 0, missingAid: 0, sameTrans: 0, shortTrans: 0, sampleP: [] }));

const chapterMap = new Map(chapters.map(c => [c.id, c]));

passages.forEach(p => {
  const ch = chapterMap.get(p.chapterId);
  const workId = ch ? ch.workId : 'unknown';
  const st = workStats.get(workId);
  if (st) st.totalP++;

  const aid = aids.get(p.id);
  if (!aid) {
    missingAid++;
    if (st) st.missingAid++;
    return;
  }
  if (aid.translation.length < 5) {
    shortTranslation++;
    if (st) st.shortTrans++;
  }
  const cleanOriginal = p.canonicalText.replace(/[\s\p{P}]/gu, '');
  const cleanTrans = aid.translation.replace(/[\s\p{P}]/gu, '');
  if (cleanTrans === cleanOriginal) {
    translationSameAsOriginal++;
    if (st) st.sameTrans++;
  }
  if (/[\uFFFD]|\\uFFFD|\?函|甇文/.test(p.canonicalText) || /[\uFFFD]|\\uFFFD|\?函|甇文/.test(aid.translation) || /[\uFFFD]|\\uFFFD|\?函|甇文/.test(aid.analysis)) {
    garbledText++;
  }
});

console.log('\n--- OVERALL AUDIT SUMMARY ---');
console.log('Missing Aid count:', missingAid);
console.log('Short Translation (<5 chars):', shortTranslation);
console.log('Translation same as original (untranslated):', translationSameAsOriginal);
console.log('Garbled text count:', garbledText);

console.log('\n--- WORK-BY-WORK BREAKDOWN ---');
for (const [id, st] of workStats.entries()) {
  console.log(`${id.padEnd(20)} | ${st.name.padEnd(12)} | Passages: ${st.totalP} | MissingAid: ${st.missingAid} | Untranslated: ${st.sameTrans} | ShortTrans: ${st.shortTrans}`);
}
