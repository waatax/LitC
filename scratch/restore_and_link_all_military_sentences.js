import fs from 'fs';

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
let worksTs = fs.readFileSync(worksTsPath, 'utf8');

const matchWorks = worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchChapters = worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchPassages = worksTs.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const matchSentences = worksTs.match(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

let works = JSON.parse(decodeURIComponent(matchWorks[1]));
let chapters = JSON.parse(decodeURIComponent(matchChapters[1]));
let passages = JSON.parse(decodeURIComponent(matchPassages[1]));
let sentences = JSON.parse(decodeURIComponent(matchSentences[1]));

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

const milIds = ['si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'];

milIds.forEach(wId => {
  const wPassages = passages.filter(p => p.chapterId.startsWith(wId));
  const newSents = [];

  wPassages.forEach((p, pIdx) => {
    const rawText = cleanText(p.canonicalText || p.text || p.originalText || p.content || '');
    if (!rawText) return;

    // Split text by punctuation marks (。！？；)
    const rawSentences = rawText.split(/(?<=[。！？；])/).map(s => s.trim()).filter(Boolean);
    const pSentIds = [];

    rawSentences.forEach((stext, sIdx) => {
      const sId = `${p.id}_s-${sIdx + 1}`;
      pSentIds.push(sId);
      newSents.push({
        id: sId,
        passageId: p.id,
        order: sIdx + 1,
        canonicalText: stext,
        difficulty: 2
      });
    });

    p.sentenceIds = pSentIds;
  });

  // Filter out existing sentences for this work and replace with newly generated ones
  sentences = sentences.filter(s => !s.id.startsWith(wId + '_'));
  sentences.push(...newSents);

  // Update totalChars for work
  const targetWork = works.find(w => w.id === wId);
  if (targetWork) {
    let chars = 0;
    newSents.forEach(s => chars += s.canonicalText.length);
    targetWork.totalChars = chars;
  }

  console.log(`Rebuilt ${wId}: ${wPassages.length} passages -> ${newSents.length} sentences.`);
});

console.log('Writing updated works.ts with restored sentences...');
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
console.log('Sentence restoration and linking complete.');
