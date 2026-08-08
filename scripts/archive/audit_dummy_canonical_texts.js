import fs from 'fs';

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
const works = JSON.parse(decodeURIComponent(worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\(["']([^"']+)["']\)\)/)[1]));

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];
const allPassages = [...p1, ...p2];

console.log("=== Auditing All Passages For Dummy Original Text ('典籍經文' / '載上古聖賢') ===");

const dummyWorks = {};

allPassages.forEach(p => {
  const isDummy = p.canonicalText.includes('典籍經文') || p.canonicalText.includes('載上古聖賢') || p.canonicalText.includes('資料彙編中');
  if (isDummy) {
    const workId = p.id.split('_')[0];
    if (!dummyWorks[workId]) {
      dummyWorks[workId] = { totalDummy: 0, samplePassage: p.id, sampleText: p.canonicalText };
    }
    dummyWorks[workId].totalDummy++;
  }
});

console.log(`Found ${Object.keys(dummyWorks).length} works containing dummy placeholder original texts:`);
console.table(Object.keys(dummyWorks).map(wId => {
  const w = works.find(x => x.id === wId);
  return {
    WorkID: wId,
    Title: w ? w.title : wId,
    DummyPassagesCount: dummyWorks[wId].totalDummy,
    SampleText: dummyWorks[wId].sampleText.substring(0, 40) + '...'
  };
}));
