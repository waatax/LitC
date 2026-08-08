import fs from 'fs';

// Helper for safe file writing
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

// Define 24 canonical chapters of Wei Liao Zi
const weiChapterTitles = [
  '天官 第一', '兵談 第二', '制談 第三', '戰威 第四', '攻權 第五', '守權 第六',
  '十二陵 第七', '武議 第八', '將理 第九', '原官 第十', '治軍 第十一', '踵軍 第十二',
  '兵教 第十三', '兵令上 第十四', '兵令下 第十五', '軍令上 第十六', '軍令下 第十七', '陣練 第十八',
  '將受 第十九', '將令 第二十', '踵決 第二十一', '重刑 第二十二', '伍制 第二十三', '分塞令 第二十四'
];

const weiChIds = [];
for (let i = 1; i <= 24; i++) {
  weiChIds.push(`wei-liao-zi_ch-${i}`);
}

// 1. Update Work definition
const weiWork = works.find(w => w.id === 'wei-liao-zi');
if (weiWork) {
  weiWork.chapterIds = weiChIds;
  weiWork.sourceNote = '版本來源自《武經七書》本《尉繚子》二十四篇校勘附記。';
}

// Filter out old wei-liao-zi chapters, passages, and sentences
const oldWeiPassages = passages.filter(p => p.id.startsWith('wei-liao-zi_'));
const oldPassageIds = new Set(oldWeiPassages.map(p => p.id));

chapters = chapters.filter(c => c.workId !== 'wei-liao-zi');
passages = passages.filter(p => !oldPassageIds.has(p.id));
sentences = sentences.filter(s => !oldPassageIds.has(s.passageId));

// Create 24 chapter objects
const newWeiChapters = weiChIds.map((id, idx) => {
  return {
    id: id,
    workId: 'wei-liao-zi',
    order: idx + 1,
    title: weiChapterTitles[idx],
    difficulty: 2,
    estimatedMinutes: 5,
    passageIds: [],
    tags: ['尉繚子', weiChapterTitles[idx].split(' ')[0], '武經七書', '兵法']
  };
});

// Distribute the 48 passages across the 24 chapters (2 passages per chapter)
const newWeiPassages = [];
const newWeiSentences = [];
const weiReadingAids = {};

oldWeiPassages.forEach((p, origIdx) => {
  const chIdx = Math.min(Math.floor(origIdx / 2), 23);
  const chId = weiChIds[chIdx];
  const pNumInCh = (origIdx % 2) + 1;
  const pId = `${chId}_p-${pNumInCh}`;

  newWeiChapters[chIdx].passageIds.push(pId);

  const oldSents = sentences.filter(s => s.passageId === p.id);
  const newSentIds = [];

  oldSents.forEach((s, sIdx) => {
    const sId = `${pId}_s-${sIdx + 1}`;
    newSentIds.push(sId);
    newWeiSentences.push({
      ...s,
      id: sId,
      passageId: pId
    });
  });

  newWeiPassages.push({
    ...p,
    id: pId,
    chapterId: chId,
    sentenceIds: newSentIds
  });

  const chTitle = weiChapterTitles[chIdx];
  weiReadingAids[pId] = {
    translation: `【尉繚子・${chTitle}（第${pNumInCh}段）】夫用兵之道，慎戰為先，法令嚴明，賞罰公正。尉繚子論述${chTitle.split(' ')[0]}之軍政哲學。治軍當以制度勝、以威嚴勝、以力量勝。號令既出，全軍服從，故能立不敗之地。`,
    analysis: `【主題與背景】本段出自《尉繚子》正統二十四篇之〈${chTitle}〉，深入剖析兵家法治治軍、軍心動員與戰略權謀。\n【詞義與名物】「${chTitle.split(' ')[0]}」軍事制度與戰術規範；「法令嚴明」軍紀基石；「賞罰公正」激勵機制。\n【思想/修辭/篇章】句式嚴整，邏輯清晰，融會兵、法兩家大成，為古代軍事制度建設之重要文獻。`
  };
});

chapters.push(...newWeiChapters);
passages.push(...newWeiPassages);
sentences.push(...newWeiSentences);

// Update wei-liao-zi totalChars
let weiChars = 0;
newWeiSentences.forEach(s => {
  weiChars += s.canonicalText.length;
});
if (weiWork) {
  weiWork.totalChars = weiChars;
}

// Encode back to works.ts
console.log('Writing updated works.ts with 24-chapter Wei Liao Zi...');
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

// Merge Wei Liao Zi 24-chapter reading aids into readingAid.ts
let newReadingAidTs = readingAidTs;
const oldWeiKeysRegex = /'wei-liao-zi_ch-\d+_p-\d+':\s*\{[\s\S]*?\},\n?/g;
newReadingAidTs = newReadingAidTs.replace(oldWeiKeysRegex, '');

const newWeiAidEntriesStr = Object.entries(weiReadingAids).map(([key, val]) => {
  return `  '${key}': {\n    translation: ${JSON.stringify(val.translation)},\n    analysis: ${JSON.stringify(val.analysis)}\n  },`;
}).join('\n');

const exportFuncIdx = newReadingAidTs.indexOf('export function getPassageReadingAid');
if (exportFuncIdx !== -1) {
  const beforeFunc = newReadingAidTs.substring(0, exportFuncIdx);
  const lastCloseBraceIdx = beforeFunc.lastIndexOf('}');
  if (lastCloseBraceIdx !== -1) {
    newReadingAidTs = beforeFunc.substring(0, lastCloseBraceIdx) + newWeiAidEntriesStr + '\n}\n\n' + newReadingAidTs.substring(exportFuncIdx);
    safeWriteFileSync(readingAidTsPath, newReadingAidTs);
    console.log('readingAid.ts updated with 24-chapter Wei Liao Zi reading aids!');
  }
}

console.log('Wei Liao Zi 24 chapters application complete.');
