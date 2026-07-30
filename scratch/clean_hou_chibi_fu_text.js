import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = Array.from({ length: 3 }, (_, index) => `gu-wen-guan-zhi_ch-193_p-${298 + index}`);
const targets = passages.filter((item) => targetIds.includes(item.id));
if (targets.length !== 3) throw new Error('Target passages not found');

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

if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-193_p-298_s-5650')) {
  console.log('《後赤壁賦》正文已清理，略過重複執行。');
  process.exit(0);
}

setSentence(
  'gu-wen-guan-zhi_ch-193_p-298_s-5649',
  '婦曰：「我有斗酒，藏之久矣，以待子不時之需。」',
  '妻子說：「我有一斗酒，收藏很久了，正是留著供你不時之需。」',
);
setSentence(
  'gu-wen-guan-zhi_ch-193_p-300_s-5664',
  '「嗚呼！噫嘻！我知之矣。疇昔之夜，飛鳴而過我者，非子也耶？」',
  '我說：「啊呀！我知道了。昨夜飛鳴著從我船旁經過的，不就是你嗎？」',
);
setSentence(
  'gu-wen-guan-zhi_ch-193_p-300_s-5667',
  '道士顧笑，予亦驚寤。',
  '道士回頭一笑，我也猛然驚醒。',
);

const removeIds = new Set([
  'gu-wen-guan-zhi_ch-193_p-298_s-5650',
  'gu-wen-guan-zhi_ch-193_p-300_s-5665',
  'gu-wen-guan-zhi_ch-193_p-300_s-5666',
]);
sentences.splice(0, sentences.length, ...sentences.filter((item) => !removeIds.has(item.id)));
for (const passage of targets) {
  passage.sentenceIds = passage.sentenceIds.filter((id) => !removeIds.has(id));
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
console.log(`合併夢境錯拆句並移除 ${removeIds.size} 個偽句，古文淨字數變動 ${after - before}。`);
