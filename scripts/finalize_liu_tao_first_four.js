import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const worksPath = './src/data/works.ts';
let source = fs.readFileSync(worksPath, 'utf8');
function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = source.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return { re, value: JSON.parse(decodeURIComponent(match[1])) };
}
const wd = readArray('works', 'Work');
const cd = readArray('chapters', 'Chapter');
const pd = readArray('passages', 'Passage');
const sd = readArray('sentences', 'Sentence');
const refs = [
  { label: '經文底本', edition: '《四部叢刊初編》景宋本《六韜、吳子、司馬法》' },
  { label: '數位對校', edition: '維基文庫《六韜》標點本；中國哲學書電子化計劃《六韜》；《六韜直解》' },
];
const splits = {
  1: ['文王勞而問之曰', '嗚呼！曼曼緜緜'],
  2: ['文王曰：「古之賢君'],
  3: [],
  4: ['文王曰：「主位如何', '文王曰：「主聽如何', '文王曰：「主明如何'],
};
function splitAtMarkers(text, markers) {
  const positions = markers.map(marker => {
    const position = text.indexOf(marker);
    if (position < 0) throw new Error(`Marker not found: ${marker}`);
    return position;
  });
  return [0, ...positions, text.length].slice(0, -1).map((start, index) => text.slice(start, [0, ...positions, text.length][index + 1])).filter(Boolean);
}
const splitSentences = text => text.match(/[^。！？；]+[。！？；]?/g)?.map(item => item.trim()).filter(Boolean) ?? [text];

for (let chapterNumber = 1; chapterNumber <= 4; chapterNumber++) {
  const chapter = cd.value.find(item => item.id === `liu-tao_ch-${chapterNumber}`);
  const pieces = splitAtMarkers(full.chapters[chapterNumber - 1].text, splits[chapterNumber]);
  if (pieces.length !== chapter.passageIds.length) throw new Error(`Chapter ${chapterNumber}: ${pieces.length} pieces / ${chapter.passageIds.length} passages`);
  chapter.tags = chapter.tags.filter(tag => tag !== '選錄');
  pieces.forEach((text, index) => {
    const pId = chapter.passageIds[index];
    const passage = pd.value.find(item => item.id === pId);
    const parts = splitSentences(text);
    const sentenceIds = parts.map((_, sentenceIndex) => `${pId}_s-${sentenceIndex + 1}`);
    passage.canonicalText = text;
    passage.sourceRefs = refs;
    passage.sentenceIds = sentenceIds;
    sd.value = sd.value.filter(item => item.passageId !== pId);
    parts.forEach((sentenceText, sentenceIndex) => {
      const id = sentenceIds[sentenceIndex];
      sd.value.push({ id, passageId: pId, order: sentenceIndex + 1, canonicalText: sentenceText, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: sentenceText }], tags: ['六韜', '文韜', full.chapters[chapterNumber - 1].title] });
    });
  });
}
const work = wd.value.find(item => item.id === 'liu-tao');
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');
console.log('Finalized 文韜 chapters 1–4 against the staged canonical source.');
