import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passage = passages.find((item) => item.id === 'gu-wen-guan-zhi_ch-199_p-323');
const sentence = sentences.find((item) => item.id === 'gu-wen-guan-zhi_ch-199_p-323_s-5819');
if (!passage || !sentence) throw new Error('Target text not found');

const canonicalText = '猶之用人，非畜道德者，惡能辨之不惑，議之不徇？';
if (sentence.canonicalText === canonicalText) {
  console.log('〈寄歐陽舍人書〉誤字已校正，略過重複執行。');
  process.exit(0);
}
const before = sentence.canonicalText.length;
sentence.canonicalText = canonicalText;
sentence.translationHint = '這就像選用人才一樣，不是長期涵養道德的人，怎能辨別而不受迷惑、議論而不徇私情呢？';
sentence.chunks = [{ id: `${sentence.id}_c-1`, sentenceId: sentence.id, order: 1, text: canonicalText }];
passage.canonicalText = passage.sentenceIds
  .map((id) => sentences.find((item) => item.id === id)?.canonicalText ?? '')
  .join('');
const delta = sentence.canonicalText.length - before;
const work = works.find((item) => item.id === 'gu-wen-guan-zhi');
if (work) work.totalChars += delta;
for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log(`校正「惡作辨」為「惡能辨」，古文淨字數變動 ${delta}。`);
