import fs from 'fs';

const worksPath = './src/data/works.ts';
const aidsPath = './src/data/readingAid.ts';
const worksText = fs.readFileSync(worksPath, 'utf8');
const get = name => {
  const m = worksText.match(new RegExp(`export const ${name}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`));
  if (!m) throw new Error(`Cannot parse ${name}`);
  return JSON.parse(decodeURIComponent(m[1]));
};
let works = get('works');
let chapters = get('chapters');
let passages = get('passages');
let sentences = get('sentences');
const extracted = JSON.parse(fs.readFileSync('./scratch/classics_extracted.json', 'utf8')).find(item => item.title === '尉繚子');
if (!extracted || extracted.chapters.length < 5) throw new Error('First five extracted chapters unavailable');

const titles = ['天官', '兵談', '制談', '戰威', '攻權'];
const summaries = {
  天官: '本篇以黃帝與梁惠王問答說明，戰爭勝負不在迷信天時，而在人事、城防、糧秣、器械與將士協同；又以彗星、背水等事例反駁把天象當成必勝條件的說法。',
  兵談: '本篇論國家用兵的根本，指出土地、人口、糧食、城郭與政治教化相互為用；軍隊必須先在朝廷完成制度與準備，將帥則須兼具謀略、威信與法度。',
  制談: '本篇主張凡用兵先定制度，從農戰政策、爵賞刑罰到軍隊編制皆須有明確法令；使民有生產之利、戰鬥之功，國家才可持久而強。',
  戰威: '本篇分析軍威的形成：上下一心、號令必行、賞罰必信，並以將帥身先士卒和臨戰決斷建立士卒敢戰之氣。',
  攻權: '本篇討論進攻的權變，強調先制其心、先定內政，再觀敵之虛實與時機；將領須兼愛與威，集中兵力，迅速而有節制地求戰。',
};
const analyses = {
  天官: '篇章以設問破題，連用城防、天象與古戰例作反證，核心是「人事勝天官」。閱讀時宜辨別「刑」為攻伐、「德」為守成，並注意作者將軍事後勤與道德政治並列。',
  兵談: '篇章由國力談到軍政，論證順序是資源—制度—將帥—作戰。其「戰勝於外，備主於內」不是單純後勤格言，而是把軍事勝負置於國家治理之中。',
  制談: '本篇以反覆排比推進論旨，將農業、爵秩、刑賞與軍令組成一套動員制度。重點不在嚴刑本身，而在令民知利害、使賞罰可預期，形成穩定的戰爭能力。',
  戰威: '本篇重視心理與組織的交互作用：威不是恐嚇，而是由公平、守令、先登與將帥表率累積的共同信念。可與《孫子》「上下同欲」互參。',
  攻權: '本篇所說的權是依敵我形勢調整的方法，不是任意欺詐。其論愛威並用、集中兵勢、乘隙速決，呈現法家軍政與兵家權變的結合。',
};

const oldIds = new Set(passages.filter(item => item.chapterId?.match(/^wei-liao-zi_ch-[1-5]$/)).map(item => item.id));
passages = passages.filter(item => !oldIds.has(item.id));
sentences = sentences.filter(item => !oldIds.has(item.passageId));
const newPassages = [];
const newSentences = [];
for (let index = 0; index < 5; index++) {
  const chapter = chapters.find(item => item.id === `wei-liao-zi_ch-${index + 1}`);
  if (!chapter) throw new Error(`Missing chapter ${index + 1}`);
  const title = titles[index];
  const sourceChapter = extracted.chapters[index];
  const passageId = `${chapter.id}_p-1`;
  const sentenceIds = sourceChapter.paragraphs.map((_, sentenceIndex) => `${passageId}_s-${sentenceIndex + 1}`);
  chapter.title = `${title} 第${index + 1}篇`;
  chapter.passageIds = [passageId];
  sourceChapter.paragraphs.forEach((canonicalText, sentenceIndex) => newSentences.push({
    id: sentenceIds[sentenceIndex], passageId, order: sentenceIndex + 1, canonicalText,
  }));
  newPassages.push({
    id: passageId, chapterId: chapter.id, order: 1, title: `${title}（完整校訂段）`,
    sentenceIds, totalChars: sourceChapter.paragraphs.join('').length,
    sourceRefs: [{ label: '中國哲學書電子化計劃《尉繚子》', url: 'https://ctext.org/wei-liao-zi/zh', locator: title }],
  });
}
passages.push(...newPassages);
sentences.push(...newSentences);
const work = works.find(item => item.id === 'wei-liao-zi');
if (work) work.totalChars = sentences.filter(item => item.passageId.startsWith('wei-liao-zi_ch-')).reduce((sum, item) => sum + item.canonicalText.length, 0);
const encode = (name, value, type) => `export const ${name}: ${type}[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(value))}"));`;
let output = worksText
  .replace(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('works', works, 'Work'))
  .replace(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('chapters', chapters, 'Chapter'))
  .replace(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('passages', passages, 'Passage'))
  .replace(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('sentences', sentences, 'Sentence'));
fs.writeFileSync(worksPath, output, 'utf8');

let aids = fs.readFileSync(aidsPath, 'utf8');
for (let index = 0; index < 5; index++) {
  const chapterId = `wei-liao-zi_ch-${index + 1}`;
  aids = aids.replace(new RegExp(`\\s*['"]${chapterId}_p-\\d+['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'g'), '');
}
const entries = titles.map((title, index) => {
  const key = `wei-liao-zi_ch-${index + 1}_p-1`;
  return `  '${key}': {\n    translation: ${JSON.stringify(summaries[title])},\n    analysis: ${JSON.stringify(analyses[title])}\n  },`;
}).join('\n');
const marker = 'export function getPassageReadingAid';
const markerIndex = aids.indexOf(marker);
if (markerIndex < 0) throw new Error('Reading aid export marker not found');
aids = `${aids.slice(0, markerIndex)}${entries}\n\n${aids.slice(markerIndex)}`;
fs.writeFileSync(aidsPath, aids, 'utf8');
console.log(JSON.stringify({ rebuiltChapters: 5, passages: newPassages.length, sentences: newSentences.length }, null, 2));
