import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passageIds = [
  'gu-wen-guan-zhi_ch-187_p-275',
  'gu-wen-guan-zhi_ch-187_p-276',
  'gu-wen-guan-zhi_ch-187_p-277',
];
const targets = passages.filter((item) => passageIds.includes(item.id));
if (targets.length !== 3) throw new Error('Target passages not found');
const sentence = (id) => {
  const value = sentences.find((item) => item.id === id);
  if (!value) throw new Error(`Sentence not found: ${id}`);
  return value;
};
if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-187_p-276_s-5418')) {
  console.log('〈超然臺記〉夾注與斷句已清理，無需重複執行。');
  process.exit(0);
}

const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

const s5403 = sentence('gu-wen-guan-zhi_ch-187_p-275_s-5403');
s5403.canonicalText = '彼挾其高大以臨我，則我常眩亂反覆。';
s5403.translationHint = '外物挾其高大之勢壓到我面前，我便常常目眩心亂、顛倒反覆。';
s5403.chunks = [
  { id: `${s5403.id}_c-1`, sentenceId: s5403.id, order: 1, text: '彼挾其高大以臨我，' },
  { id: `${s5403.id}_c-2`, sentenceId: s5403.id, order: 2, text: '則我常眩亂反覆。' },
];

const s5417 = sentence('gu-wen-guan-zhi_ch-187_p-276_s-5417');
s5417.canonicalText = '西望穆陵，';
s5417.translationHint = '向西望去是穆陵。';
s5417.chunks = [{ id: `${s5417.id}_c-1`, sentenceId: s5417.id, order: 1, text: '西望穆陵，' }];

const s5422 = sentence('gu-wen-guan-zhi_ch-187_p-276_s-5422');
s5422.canonicalText = '擷園蔬，取池魚，釀秫酒，瀹脫粟而食之，曰：「樂哉遊乎！」';
s5422.translationHint = '摘取園中的蔬菜，捕取池裡的魚，釀黏高粱酒，煮粗糙的糙米來吃，說：「遊賞真快樂啊！」';
s5422.chunks = [
  { id: `${s5422.id}_c-1`, sentenceId: s5422.id, order: 1, text: '擷園蔬，' },
  { id: `${s5422.id}_c-2`, sentenceId: s5422.id, order: 2, text: '取池魚，' },
  { id: `${s5422.id}_c-3`, sentenceId: s5422.id, order: 3, text: '釀秫酒，' },
  { id: `${s5422.id}_c-4`, sentenceId: s5422.id, order: 4, text: '瀹脫粟而食之，' },
  { id: `${s5422.id}_c-5`, sentenceId: s5422.id, order: 5, text: '曰：「樂哉遊乎！」' },
];

const s5425 = sentence('gu-wen-guan-zhi_ch-187_p-277_s-5425');
s5425.canonicalText = `方是時，${s5425.canonicalText}`;
s5425.translationHint = '正當這時，我的弟弟子由恰好在濟南，聽說此事便作了一篇賦，並把這座臺命名為「超然」。';
s5425.chunks = [
  { id: `${s5425.id}_c-1`, sentenceId: s5425.id, order: 1, text: '方是時，' },
  ...s5425.chunks.map((chunk, index) => ({ ...chunk, id: `${s5425.id}_c-${index + 2}`, order: index + 2 })),
];

const removeIds = new Set([
  'gu-wen-guan-zhi_ch-187_p-276_s-5418',
  'gu-wen-guan-zhi_ch-187_p-276_s-5423',
  'gu-wen-guan-zhi_ch-187_p-276_s-5424',
]);
sentences.splice(0, sentences.length, ...sentences.filter((item) => !removeIds.has(item.id)));
for (const passage of targets) {
  passage.sentenceIds = passage.sentenceIds.filter((id) => !removeIds.has(id));
  passage.canonicalText = passage.sentenceIds.map((id) => sentence(id).canonicalText).join('');
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
console.log(`已移除 ${removeIds.size} 個錯誤拆句，正文淨字數調整 ${after - before}。`);
