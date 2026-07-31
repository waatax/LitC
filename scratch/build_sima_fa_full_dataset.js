import fs from 'fs';

// Read works.ts & readingAid.ts
const worksTsPath = './src/data/works.ts';
const readingAidTsPath = './src/data/readingAid.ts';

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

// Get all old sima passages in order
const oldSimaPassages = passages.filter(p => p.id.startsWith('si-ma-fa_'));
console.log(`Processing ${oldSimaPassages.length} passages...`);

// Mapping of 68 passages into 5 chapters:
// Chapter 1: 1..15 (indices 0..14) -> si-ma-fa_ch-1_p-1 .. p-15
// Chapter 2: 16..25 (indices 15..24) -> si-ma-fa_ch-2_p-1 .. p-10
// Chapter 3: 26..40 (indices 25..39) -> si-ma-fa_ch-3_p-1 .. p-15
// Chapter 4: 41..60 (indices 40..59) -> si-ma-fa_ch-4_p-1 .. p-20
// Chapter 5: 61..68 (indices 60..67) -> si-ma-fa_ch-5_p-1 .. p-8

function getNewIds(origIdx) {
  let chNum = 1;
  let pNum = origIdx + 1;
  if (origIdx >= 15 && origIdx < 25) {
    chNum = 2;
    pNum = origIdx - 15 + 1;
  } else if (origIdx >= 25 && origIdx < 40) {
    chNum = 3;
    pNum = origIdx - 25 + 1;
  } else if (origIdx >= 40 && origIdx < 60) {
    chNum = 4;
    pNum = origIdx - 40 + 1;
  } else if (origIdx >= 60) {
    chNum = 5;
    pNum = origIdx - 60 + 1;
  }
  const chId = `si-ma-fa_ch-${chNum}`;
  const pId = `${chId}_p-${pNum}`;
  return { chNum, pNum, chId, pId };
}

// Clean canonical text helper function
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

// Prepare updated chapters & passage ID maps
const newChaptersMap = {
  'si-ma-fa_ch-1': {
    id: 'si-ma-fa_ch-1',
    workId: 'si-ma-fa',
    order: 1,
    title: '仁本 第一',
    difficulty: 2,
    estimatedMinutes: 15,
    passageIds: [],
    tags: ['仁本', '以戰止戰', '正義戰爭', '慎戰']
  },
  'si-ma-fa_ch-2': {
    id: 'si-ma-fa_ch-2',
    workId: 'si-ma-fa',
    order: 2,
    title: '天子之義 第二',
    difficulty: 2,
    estimatedMinutes: 12,
    passageIds: [],
    tags: ['天子之義', '禮樂法度', '國容軍容', '討不義']
  },
  'si-ma-fa_ch-3': {
    id: 'si-ma-fa_ch-3',
    workId: 'si-ma-fa',
    order: 3,
    title: '嚴位 第三',
    difficulty: 2,
    estimatedMinutes: 15,
    passageIds: [],
    tags: ['嚴位', '軍政規律', '權勇巧陣', '七政四守']
  },
  'si-ma-fa_ch-4': {
    id: 'si-ma-fa_ch-4',
    workId: 'si-ma-fa',
    order: 4,
    title: '用眾 第四',
    difficulty: 2,
    estimatedMinutes: 18,
    passageIds: [],
    tags: ['用眾', '軍氣', '兵器配合', '賞罰分明']
  },
  'si-ma-fa_ch-5': {
    id: 'si-ma-fa_ch-5',
    workId: 'si-ma-fa',
    order: 5,
    title: '用微 第五',
    difficulty: 2,
    estimatedMinutes: 10,
    passageIds: [],
    tags: ['用微', '察變敵情', '奇正克敵', '絕顧之慮']
  }
};

const oldPassageIdToNewPassageId = {};
const newPassages = [];
const newSentences = [];

oldSimaPassages.forEach((p, idx) => {
  const { chId, pId } = getNewIds(idx);
  oldPassageIdToNewPassageId[p.id] = pId;
  newChaptersMap[chId].passageIds.push(pId);

  const oldSents = sentences.filter(s => s.passageId === p.id);
  const newSentIds = [];

  oldSents.forEach((s, sIdx) => {
    const sId = `${pId}_s-${sIdx + 1}`;
    newSentIds.push(sId);

    const cleanedCanonical = cleanText(s.canonicalText);
    const cleanedChunks = s.chunks ? s.chunks.map(chunk => [cleanText(chunk[0]), chunk[1]]) : undefined;

    newSentences.push({
      ...s,
      id: sId,
      passageId: pId,
      canonicalText: cleanedCanonical,
      chunks: cleanedChunks
    });
  });
});

console.log('Processed new passages and sentences successfully.');
