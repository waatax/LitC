import fs from 'fs';

// Paths
const worksTsPath = './src/data/works.ts';
const readingAidTsPath = './src/data/readingAid.ts';

function safeWriteFileSync(filePath, content) {
  let attempts = 0;
  while (attempts < 5) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return;
    } catch (err) {
      attempts++;
      console.log(`Write failed for ${filePath}, retrying attempt ${attempts}...`);
      const end = Date.now() + 500;
      while (Date.now() < end) {}
      if (attempts >= 5) throw err;
    }
  }
}

let worksTs = fs.readFileSync(worksTsPath, 'utf8');
let readingAidTs = fs.readFileSync(readingAidTsPath, 'utf8');

const matchWorks = worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchChapters = worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

let works = JSON.parse(decodeURIComponent(matchWorks[1]));
let chapters = JSON.parse(decodeURIComponent(matchChapters[1]));
let passages = JSON.parse(decodeURIComponent(matchPassages[1]));
let sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

// Helper to clean text artifacts
function cleanText(txt) {
  if (!txt) return '';
  return txt
    .replace(/古所謂/g, '古者')
    .replace(/如果/g, '若')
    .replace(/哪裡人/g, '安人')
    .replace(/誅殺處決/g, '誅')
    .replace(/去世/g, '卒')
    .replace(/也是/g, '亦')
    .replace(/因此明其/g, '是以明其')
    .replace(/因此/g, '是以')
    .replace(/遠所謂視/g, '遠者視')
    .replace(/不息也弊/g, '不息亦弊')
    .replace(/也反其懾/g, '亦反其懾');
}

// 1. Fix Sima Fa sentence mapping in works.ts
const simaPassages = passages.filter(p => p.id.startsWith('si-ma-fa_'));
simaPassages.forEach(p => {
  const pSents = sentences.filter(s => s.passageId === p.id || s.id.startsWith(p.id + '_s-'));
  pSents.forEach(s => {
    s.passageId = p.id;
  });
});
const simaWork = works.find(w => w.id === 'si-ma-fa');
if (simaWork) {
  let simaChars = 0;
  sentences.filter(s => s.id.startsWith('si-ma-fa_')).forEach(s => {
    simaChars += s.canonicalText.length;
  });
  simaWork.totalChars = simaChars;
}

// 2. Restructure Three Strategies (三略) from 1 chapter to 3 chapters
const threeStratWork = works.find(w => w.id === 'three-strategies');
if (threeStratWork) {
  threeStratWork.chapterIds = [
    'three-strategies_ch-1',
    'three-strategies_ch-2',
    'three-strategies_ch-3'
  ];
  threeStratWork.sourceNote = '版本來源自《武經七書》本《三略》（黃石公三略）上略、中略、下略校勘附記。';
}

// Old three-strategies passages (65 passages)
const oldTsPassages = passages.filter(p => p.id.startsWith('three-strategies_'));
chapters = chapters.filter(c => c.workId !== 'three-strategies');

const tsChaptersMap = {
  'three-strategies_ch-1': {
    id: 'three-strategies_ch-1',
    workId: 'three-strategies',
    order: 1,
    title: '上略 第一',
    difficulty: 2,
    estimatedMinutes: 20,
    passageIds: [],
    tags: ['上略', '設禮賞', '別奸雄', '明成敗']
  },
  'three-strategies_ch-2': {
    id: 'three-strategies_ch-2',
    workId: 'three-strategies',
    order: 2,
    title: '中略 第二',
    difficulty: 2,
    estimatedMinutes: 15,
    passageIds: [],
    tags: ['中略', '差德行', '審權變', '將帝王']
  },
  'three-strategies_ch-3': {
    id: 'three-strategies_ch-3',
    workId: 'three-strategies',
    order: 3,
    title: '下略 第三',
    difficulty: 2,
    estimatedMinutes: 12,
    passageIds: [],
    tags: ['下略', '陳道德', '察安危', '明賊賢']
  }
};

// Re-map passages:
// 1..32 (idx 0..31) -> three-strategies_ch-1_p-1 .. p-32
// 33..51 (idx 32..50) -> three-strategies_ch-2_p-1 .. p-19
// 52..65 (idx 51..64) -> three-strategies_ch-3_p-1 .. p-14

function getTsNewIds(origIdx) {
  let chNum = 1;
  let pNum = origIdx + 1;
  if (origIdx >= 32 && origIdx < 51) {
    chNum = 2;
    pNum = origIdx - 32 + 1;
  } else if (origIdx >= 51) {
    chNum = 3;
    pNum = origIdx - 51 + 1;
  }
  const chId = `three-strategies_ch-${chNum}`;
  const pId = `${chId}_p-${pNum}`;
  return { chNum, pNum, chId, pId };
}

const oldTsPassageIds = new Set(oldTsPassages.map(p => p.id));
passages = passages.filter(p => !oldTsPassageIds.has(p.id));
sentences = sentences.filter(s => !oldTsPassageIds.has(s.passageId));

const newTsPassages = [];
const newTsSentences = [];

oldTsPassages.forEach((p, idx) => {
  const { chId, pId } = getTsNewIds(idx);
  tsChaptersMap[chId].passageIds.push(pId);

  const oldSents = sentences.filter(s => s.passageId === p.id);
  const newSentIds = [];

  oldSents.forEach((s, sIdx) => {
    const sId = `${pId}_s-${sIdx + 1}`;
    newSentIds.push(sId);

    const cleanedCanonical = cleanText(s.canonicalText);
    const cleanedChunks = s.chunks ? s.chunks.map(chunk => [cleanText(chunk[0]), chunk[1]]) : undefined;

    newTsSentences.push({
      ...s,
      id: sId,
      passageId: pId,
      canonicalText: cleanedCanonical,
      chunks: cleanedChunks
    });
  });

  const cleanedPassageText = cleanText(p.originalText || p.text || p.content || '');

  newTsPassages.push({
    ...p,
    id: pId,
    chapterId: chId,
    sentenceIds: newSentIds,
    text: cleanedPassageText
  });
});

chapters.push(...Object.values(tsChaptersMap));
passages.push(...newTsPassages);
sentences.push(...newTsSentences);

// Update three-strategies totalChars
let tsTotalChars = 0;
newTsSentences.forEach(s => {
  tsTotalChars += s.canonicalText.length;
});
if (threeStratWork) {
  threeStratWork.totalChars = tsTotalChars;
}

// Clean canonical text across all military sentences in works.ts
sentences.forEach(s => {
  if (s.id.startsWith('art-of-war_') || s.id.startsWith('wu-zi_') || s.id.startsWith('wei-liao-zi_') || s.id.startsWith('liu-tao_')) {
    s.canonicalText = cleanText(s.canonicalText);
    if (s.chunks) {
      s.chunks = s.chunks.map(chunk => [cleanText(chunk[0]), chunk[1]]);
    }
  }
});

// Encode back to works.ts
console.log('Writing updated works.ts...');
const newWorksStr = `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(works))}"));`;
const newChaptersStr = `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(chapters))}"));`;
const newPassagesStr = `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(passages))}"));`;
const newSentencesStr = `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sentences))}"));`;

worksTs = worksTs
  .replace(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/, newWorksStr)
  .replace(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/, newChaptersStr)
  .replace(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/, newPassagesStr)
  .replace(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/, newSentencesStr);

safeWriteFileSync(worksTsPath, worksTs);
console.log('works.ts updated successfully.');
