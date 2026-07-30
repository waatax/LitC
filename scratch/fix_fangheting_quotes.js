import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [, , passages, sentences] = arrays;
for (const [id, text, chunks] of [
  ['gu-wen-guan-zhi_ch-188_p-279_s-5437', '易曰：『鳴鶴在陰，其子和之。』', ['易曰：', '『鳴鶴在陰，', '其子和之。』']],
  ['gu-wen-guan-zhi_ch-188_p-279_s-5440', '詩曰：『鶴鳴于九皋，聲聞於天。』', ['詩曰：', '『鶴鳴于九皋，', '聲聞於天。』']],
]) {
  const sentence = sentences.find((item) => item.id === id);
  if (!sentence) throw new Error(`Sentence not found: ${id}`);
  sentence.canonicalText = text;
  sentence.chunks = chunks.map((chunk, index) => ({ id: `${id}_c-${index + 1}`, sentenceId: id, order: index + 1, text: chunk }));
}
const passage = passages.find((item) => item.id === 'gu-wen-guan-zhi_ch-188_p-279');
passage.canonicalText = passage.sentenceIds.map((id) => sentences.find((item) => item.id === id)?.canonicalText || '').join('');
for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log('已修正對話內經典引文的內層引號。');
