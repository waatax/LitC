import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const readingAidTs = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

const matchWorks = worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchChapters = worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

const works = JSON.parse(decodeURIComponent(matchWorks[1]));
const chapters = JSON.parse(decodeURIComponent(matchChapters[1]));
const passages = JSON.parse(decodeURIComponent(matchPassages[1]));
const sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

const simaPassages = passages.filter(p => p.chapterId === 'si-ma-fa_ch-1');

console.log(`Auditing ${simaPassages.length} passages for Sima Fa...`);

simaPassages.forEach((p, idx) => {
  const pKey = `'${p.id}'`;
  const pos = readingAidTs.indexOf(pKey);
  if (pos === -1) {
    console.log(`P${idx+1} (${p.id}): MISSING in readingAid.ts!`);
  } else {
    const chunk = readingAidTs.substring(pos, pos + 400);
    const transMatch = chunk.match(/translation:\s*"([^"]+)"/);
    const trans = transMatch ? transMatch[1] : 'NONE';
    const hasGenericAnalysis = chunk.includes('探討國防戰略、軍隊紀律與正義戰爭之道');
    const isSimplifiedOrOdd = trans.includes('所以：') || trans.includes('哪裡人') || trans.includes('夫其民') || trans.includes('【白話翻譯】');
    console.log(`P${idx+1} (${p.id}): ${trans.substring(0, 45)}... ${hasGenericAnalysis ? '[GENERIC_ANALYSIS]' : ''} ${isSimplifiedOrOdd ? '[POOR_TRANSLATION]' : ''}`);
  }
});
