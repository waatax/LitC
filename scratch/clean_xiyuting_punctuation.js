import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [, , passages, sentences] = arrays;
const badId = 'gu-wen-guan-zhi_ch-185_p-267_s-5339';
const passage = passages.find((item) => item.id === 'gu-wen-guan-zhi_ch-185_p-267');
if (!sentences.some((item) => item.id === badId)) {
  console.log('多餘標點句已清除。');
  process.exit(0);
}
sentences.splice(0, sentences.length, ...sentences.filter((item) => item.id !== badId));
passage.sentenceIds = passage.sentenceIds.filter((id) => id !== badId);
passage.canonicalText = passage.sentenceIds.map((id) => sentences.find((item) => item.id === id).canonicalText).join('');
for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log('已移除1個誤建成句子的孤立句號。');
