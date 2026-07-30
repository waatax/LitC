import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passageIds = ['gu-wen-guan-zhi_ch-189_p-281', 'gu-wen-guan-zhi_ch-189_p-282'];
const targets = passages.filter((item) => passageIds.includes(item.id));
if (targets.length !== 2) throw new Error('Target passages not found');
const getSentence = (id) => {
  const value = sentences.find((item) => item.id === id);
  if (!value) throw new Error(`Sentence not found: ${id}`);
  return value;
};
if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-189_p-281_s-5469')) {
  console.log('〈石鐘山記〉夾注與偽句已清理，無需重複執行。');
  process.exit(0);
}
const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

const s5468 = getSentence('gu-wen-guan-zhi_ch-189_p-281_s-5468');
s5468.canonicalText = '水經云：「彭蠡之口有石鐘山焉。」';
s5468.translationHint = '《水經》說：「彭蠡湖口有石鐘山。」';
s5468.chunks = [
  { id: `${s5468.id}_c-1`, sentenceId: s5468.id, order: 1, text: '水經云：' },
  { id: `${s5468.id}_c-2`, sentenceId: s5468.id, order: 2, text: '「彭蠡之口有石鐘山焉。」' },
];

const s5471 = getSentence('gu-wen-guan-zhi_ch-189_p-281_s-5471');
s5471.canonicalText = `酈元${s5471.canonicalText}`;
s5471.translationHint = '酈道元認為山下臨深潭，微風吹動水浪，水與岩石互相撞擊，聲音像大鐘。';
s5471.chunks = [
  { id: `${s5471.id}_c-1`, sentenceId: s5471.id, order: 1, text: '酈元以爲下臨深潭，' },
  ...s5471.chunks.slice(1).map((chunk, index) => ({ ...chunk, id: `${s5471.id}_c-${index + 2}`, order: index + 2 })),
];

const s5492 = getSentence('gu-wen-guan-zhi_ch-189_p-282_s-5492');
s5492.canonicalText = '古之人不余欺也！」';
s5492.translationHint = '古人沒有欺騙我啊！」';
s5492.chunks = [{ id: `${s5492.id}_c-1`, sentenceId: s5492.id, order: 1, text: '古之人不余欺也！」' }];

const removeIds = new Set([
  'gu-wen-guan-zhi_ch-189_p-281_s-5469',
  'gu-wen-guan-zhi_ch-189_p-281_s-5470',
  'gu-wen-guan-zhi_ch-189_p-282_s-5493',
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
console.log(`已移除 ${removeIds.size} 個夾注／偽句，正文淨字數調整 ${after - before}。`);
