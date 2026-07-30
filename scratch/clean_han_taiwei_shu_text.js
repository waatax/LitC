import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passage = passages.find((item) => item.id === 'gu-wen-guan-zhi_ch-197_p-315');
const sentence = sentences.find((item) => item.id === 'gu-wen-guan-zhi_ch-197_p-315_s-5772');
if (!passage || !sentence) throw new Error('Target text not found');

const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。；：！？、「」『』（）〈〉《》]/g, '').length;
const before = normalizedLength(passage.canonicalText);
const canonicalText = '轍之來也，於山見終南、嵩、華之高，於水見黃河之大且深，於人見歐陽公，而猶以爲未見太尉也。';

if (sentence.canonicalText === canonicalText) {
  console.log('《上樞密韓太尉書》字形已統一，略過重複執行。');
  process.exit(0);
}
sentence.canonicalText = canonicalText;
sentence.translationHint = '我這次出遊，在山岳方面見識了終南山、嵩山、華山的高峻，在河川方面見識了黃河的浩大深廣，在人物方面拜見了歐陽修，卻仍覺得尚未拜見太尉您。';
sentence.chunks = [{ id: `${sentence.id}_c-1`, sentenceId: sentence.id, order: 1, text: canonicalText }];
passage.canonicalText = passage.sentenceIds
  .map((id) => sentences.find((item) => item.id === id)?.canonicalText ?? '')
  .join('');

const after = normalizedLength(passage.canonicalText);
const work = works.find((item) => item.id === 'gu-wen-guan-zhi');
if (work) work.totalChars += after - before;
for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log(`統一「於山」字形，古文淨字數變動 ${after - before}。`);
