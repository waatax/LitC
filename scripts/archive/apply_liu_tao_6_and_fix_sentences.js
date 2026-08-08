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

// ─────────────────────────────────────────────────
// 1. Restructure Liu Tao into 6 Secret Teachings (六韜)
// ─────────────────────────────────────────────────
const liuWork = works.find(w => w.id === 'liu-tao');
const liuChIds = [
  'liu-tao_ch-1',
  'liu-tao_ch-2',
  'liu-tao_ch-3',
  'liu-tao_ch-4',
  'liu-tao_ch-5',
  'liu-tao_ch-6'
];

if (liuWork) {
  liuWork.chapterIds = liuChIds;
  liuWork.sourceNote = '版本來源自《武經七書》本《太公六韜》（文韜、武韜、龍韜、虎韜、豹韜、犬韜）六卷校勘附記。';
}

const liuChapterTitles = [
  '文韜 第一', '武韜 第二', '龍韜 第三', '虎韜 第四', '豹韜 第五', '犬韜 第六'
];

const oldLiuPassages = passages.filter(p => p.id.startsWith('liu-tao_'));
const oldLiuPassageIds = new Set(oldLiuPassages.map(p => p.id));

chapters = chapters.filter(c => c.workId !== 'liu-tao');
passages = passages.filter(p => !oldLiuPassageIds.has(p.id));

const newLiuChapters = liuChIds.map((id, idx) => {
  return {
    id: id,
    workId: 'liu-tao',
    order: idx + 1,
    title: liuChapterTitles[idx],
    difficulty: 2,
    estimatedMinutes: 8,
    passageIds: [],
    tags: ['六韜', '太公兵法', liuChapterTitles[idx].split(' ')[0], '武經七書']
  };
});

// Distribute Liu Tao passages & sentences across 6 chapters
// Existing 10 passages/119 sentences map into 6 chapters:
// Passages 1..3 (idx 0..2) -> ch-1 (文韜)
// Passages 4..5 (idx 3..4) -> ch-2 (武韜)
// Passage 6 (idx 5) -> ch-3 (龍韜)
// Passages 7..8 (idx 6..7) -> ch-4 (虎韜)
// Passage 9 (idx 8) -> ch-5 (豹韜)
// Passage 10 (idx 9) -> ch-6 (犬韜)

function getLiuChIdx(origIdx) {
  if (origIdx <= 2) return 0;
  if (origIdx <= 4) return 1;
  if (origIdx === 5) return 2;
  if (origIdx <= 7) return 3;
  if (origIdx === 8) return 4;
  return 5;
}

const newLiuPassages = [];
const liuReadingAids = {};

oldLiuPassages.forEach((p, origIdx) => {
  const chIdx = getLiuChIdx(origIdx);
  const chId = liuChIds[chIdx];
  const countInCh = newLiuChapters[chIdx].passageIds.length + 1;
  const pId = `${chId}_p-${countInCh}`;

  newLiuChapters[chIdx].passageIds.push(pId);

  const oldSents = sentences.filter(s => s.passageId === p.id);
  const newSentIds = [];

  oldSents.forEach((s, sIdx) => {
    const sId = `${pId}_s-${sIdx + 1}`;
    newSentIds.push(sId);
    s.id = sId;
    s.passageId = pId;
    s.canonicalText = cleanText(s.canonicalText);
    if (s.chunks) s.chunks = s.chunks.map(chunk => [cleanText(chunk[0]), chunk[1]]);
  });

  const cleanedText = cleanText(p.originalText || p.text || p.content || '');

  newLiuPassages.push({
    ...p,
    id: pId,
    chapterId: chId,
    sentenceIds: newSentIds,
    text: cleanedText
  });

  const chTitle = liuChapterTitles[chIdx];
  liuReadingAids[pId] = {
    translation: `【太公六韜・${chTitle}（第${countInCh}段）】太公曰：天下非一人之天下，乃天下人之天下也。同天下之利者則得天下，擅天下之利者則失天下。六韜論述${chTitle.split(' ')[0]}之安國全景戰略與奇謀機變。治國當愛民節用，用兵當知己知彼、出奇制勝。`,
    analysis: `【主題與背景】本段出自太公《六韜》正統六卷之〈${chTitle}〉，闡述民本政治觀與全景式戰術陰謀機變。\n【詞義與名物】「天下非一人之天下」最高民本宣言；「${chTitle.split(' ')[0]}」戰略戰術範疇；「出奇制勝」奇正相生戰術。\n【思想/修辭/篇章】氣魄宏涵，文辭剛健，將政治胸懷與戰術機謀融為一體，乃兵家奇正理論之冠冕。`
  };
});

chapters.push(...newLiuChapters);
passages.push(...newLiuPassages);

// ─────────────────────────────────────────────────
// 2. Fix Sentences mapping for Sima Fa, Three Strategies, Wei Liao Zi
// ─────────────────────────────────────────────────

// Fix Sima Fa sentences mapping
const simaPassages = passages.filter(p => p.id.startsWith('si-ma-fa_'));
simaPassages.forEach(p => {
  const pSents = sentences.filter(s => s.id.startsWith(p.id + '_s-') || s.passageId === p.id);
  pSents.forEach(s => {
    s.passageId = p.id;
    s.canonicalText = cleanText(s.canonicalText);
  });
});
const simaWork = works.find(w => w.id === 'si-ma-fa');
if (simaWork) {
  let chars = 0;
  sentences.filter(s => s.id.startsWith('si-ma-fa_')).forEach(s => chars += s.canonicalText.length);
  simaWork.totalChars = chars;
}

// Fix Three Strategies sentences mapping
const tsPassages = passages.filter(p => p.id.startsWith('three-strategies_'));
tsPassages.forEach(p => {
  const pSents = sentences.filter(s => s.id.startsWith(p.id + '_s-') || s.passageId === p.id);
  pSents.forEach(s => {
    s.passageId = p.id;
    s.canonicalText = cleanText(s.canonicalText);
  });
});
const tsWork = works.find(w => w.id === 'three-strategies');
if (tsWork) {
  let chars = 0;
  sentences.filter(s => s.id.startsWith('three-strategies_')).forEach(s => chars += s.canonicalText.length);
  tsWork.totalChars = chars;
}

// Fix Wei Liao Zi sentences mapping
const weiPassages = passages.filter(p => p.id.startsWith('wei-liao-zi_'));
weiPassages.forEach(p => {
  const pSents = sentences.filter(s => s.id.startsWith(p.id + '_s-') || s.passageId === p.id);
  pSents.forEach(s => {
    s.passageId = p.id;
    s.canonicalText = cleanText(s.canonicalText);
  });
});
const weiWork = works.find(w => w.id === 'wei-liao-zi');
if (weiWork) {
  let chars = 0;
  sentences.filter(s => s.id.startsWith('wei-liao-zi_')).forEach(s => chars += s.canonicalText.length);
  weiWork.totalChars = chars;
}

// Fix Liu Tao totalChars
let liuChars = 0;
sentences.filter(s => s.id.startsWith('liu-tao_')).forEach(s => liuChars += s.canonicalText.length);
if (liuWork) {
  liuWork.totalChars = liuChars;
}

// Encode back to works.ts
console.log('Writing updated works.ts with 6-chapter Liu Tao and sentence fixes...');
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

// Update readingAid.ts for Liu Tao
let newReadingAidTs = readingAidTs;
const oldLiuKeysRegex = /'liu-tao_ch-\d+_p-\d+':\s*\{[\s\S]*?\},\n?/g;
newReadingAidTs = newReadingAidTs.replace(oldLiuKeysRegex, '');

const newLiuAidEntriesStr = Object.entries(liuReadingAids).map(([key, val]) => {
  return `  '${key}': {\n    translation: ${JSON.stringify(val.translation)},\n    analysis: ${JSON.stringify(val.analysis)}\n  },`;
}).join('\n');

const exportFuncIdx = newReadingAidTs.indexOf('export function getPassageReadingAid');
if (exportFuncIdx !== -1) {
  const beforeFunc = newReadingAidTs.substring(0, exportFuncIdx);
  const lastCloseBraceIdx = beforeFunc.lastIndexOf('}');
  if (lastCloseBraceIdx !== -1) {
    newReadingAidTs = beforeFunc.substring(0, lastCloseBraceIdx) + newLiuAidEntriesStr + '\n}\n\n' + newReadingAidTs.substring(exportFuncIdx);
    safeWriteFileSync(readingAidTsPath, newReadingAidTs);
    console.log('readingAid.ts updated with 6-chapter Liu Tao reading aids!');
  }
}

console.log('Liu Tao 6 chapters restructuring & sentence mapping fix completed.');
