import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = ['gu-wen-guan-zhi_ch-191_p-291', 'gu-wen-guan-zhi_ch-191_p-292'];
const targets = passages.filter((item) => targetIds.includes(item.id));
if (targets.length !== 2) throw new Error('Target passages not found');

const getSentence = (id) => {
  const sentence = sentences.find((item) => item.id === id);
  if (!sentence) throw new Error(`Sentence not found: ${id}`);
  return sentence;
};
const setSentence = (id, canonicalText, translationHint) => {
  const sentence = getSentence(id);
  sentence.canonicalText = canonicalText;
  sentence.translationHint = translationHint;
  sentence.chunks = [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText }];
};
const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。；：！？、「」『』（）〈〉《》]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

const p291 = targets.find((item) => item.id.endsWith('p-291'));
const p292 = targets.find((item) => item.id.endsWith('p-292'));
if (!p291.sentenceIds.some((id) => id.endsWith('s-5585'))) {
  console.log('陸贄奏議正文已清理，略過重複執行。');
  process.exit(0);
}

setSentence(
  'gu-wen-guan-zhi_ch-191_p-291_s-5584',
  '三代已還，一人而已。',
  '自夏、商、周三代以來，像陸贄這樣的人只有一位。',
);
setSentence(
  'gu-wen-guan-zhi_ch-191_p-291_s-5589',
  '使德宗盡用其言，則貞觀可得而復。',
  '假使唐德宗完全採納他的意見，貞觀之治便可能再現。',
);
setSentence(
  'gu-wen-guan-zhi_ch-191_p-292_s-5595',
  '夫六經三史、諸子百家，非無可觀，皆足爲治。',
  '六經、三史以及諸子百家的著作，並非沒有值得閱讀之處，都可供治理國家參考。',
);

const removeIds = new Set([
  ...Array.from({ length: 4 }, (_, index) => `gu-wen-guan-zhi_ch-191_p-291_s-${5585 + index}`),
  'gu-wen-guan-zhi_ch-191_p-292_s-5596',
]);
sentences.splice(0, sentences.length, ...sentences.filter((item) => !removeIds.has(item.id)));
p291.sentenceIds = [
  ...p291.sentenceIds.slice(0, p291.sentenceIds.indexOf('gu-wen-guan-zhi_ch-191_p-291_s-5578')),
  'gu-wen-guan-zhi_ch-191_p-291_s-5584',
  ...p291.sentenceIds.slice(p291.sentenceIds.indexOf('gu-wen-guan-zhi_ch-191_p-291_s-5578')),
].filter((id, index, all) => !removeIds.has(id) && all.indexOf(id) === index);
p292.sentenceIds = p292.sentenceIds.filter((id) => !removeIds.has(id));
for (const passage of targets) {
  passage.canonicalText = passage.sentenceIds.map((id) => getSentence(id).canonicalText).join('');
}

const after = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);
const work = works.find((item) => item.id === 'gu-wen-guan-zhi');
if (work) work.totalChars += after - before;
for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log(`補回 1 句正文、移除 ${removeIds.size} 句夾注，古文淨字數變動 ${after - before}。`);
