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

const militaryIds = ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'];

console.log('=====================================================');
console.log(' DEEP AUDIT: MILITARY SCHOOL (兵家六書) ');
console.log('=====================================================\n');

militaryIds.forEach(id => {
  const w = works.find(item => item.id === id);
  if (!w) return;
  const wChs = chapters.filter(c => c.workId === id);
  const wPass = passages.filter(p => wChs.some(c => c.id === p.chapterId));
  const wSents = sentences.filter(s => wPass.some(p => p.id === s.passageId));

  let genericAnalysisCount = 0;
  let poorTranslationCount = 0;
  let missingAidCount = 0;

  wPass.forEach(p => {
    const pKey = `'${p.id}'`;
    const pos = readingAidTs.indexOf(pKey);
    if (pos === -1) {
      missingAidCount++;
    } else {
      const chunk = readingAidTs.substring(pos, pos + 450);
      if (chunk.includes('探討國防戰略') || chunk.includes('敬請對照經典原文')) {
        genericAnalysisCount++;
      }
      const transMatch = chunk.match(/translation:\s*"([^"]+)"/);
      const trans = transMatch ? transMatch[1] : '';
      if (!trans || trans.includes('【白話翻譯】') || trans.includes('如果此') || trans.includes('古所謂') || trans.includes('誅殺處決')) {
        poorTranslationCount++;
      }
    }
  });

  console.log(`【${w.title}】(${id})`);
  console.log(`  - 章節數: ${wChs.length}`);
  console.log(`  - 段落數: ${wPass.length}`);
  console.log(`  - 句子數: ${wSents.length}`);
  console.log(`  - 總字數: ${w.totalChars || 'N/A'}`);
  console.log(`  - 缺乏 Aid 條目: ${missingAidCount}`);
  console.log(`  - 通用/模板解析段落數: ${genericAnalysisCount}`);
  console.log(`  - 機械/劣質翻譯段落數: ${poorTranslationCount}`);
  console.log('-----------------------------------------------------');
});
