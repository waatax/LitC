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
  const wPass = passages.filter(p => p.chapterId.startsWith(wId));
  const wSents = sentences.filter(s => s.id.startsWith(wId + '_'));

  console.log(`Fixing ${wId}: ${wPass.length} passages, ${wSents.length} sentences.`);

  // Group sentences by their order index or old prefix
  wPass.forEach((p, pIdx) => {
    // If passage sentenceIds is defined, use that
    if (p.sentenceIds && p.sentenceIds.length > 0) {
      p.sentenceIds.forEach(sId => {
        const s = sentences.find(item => item.id === sId);
        if (s) {
          s.passageId = p.id;
          s.canonicalText = cleanText(s.canonicalText);
        }
      });
    }
  });

  // Also calculate totalChars
  const targetWork = works.find(w => w.id === wId);
  if (targetWork) {
    let chars = 0;
    wSents.forEach(s => chars += cleanText(s.canonicalText).length);
    targetWork.totalChars = chars;
  }
});

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
console.log('Sentence passageId mapping fix complete.');
