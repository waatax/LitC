import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = Array.from({ length: 4 }, (_, index) => `gu-wen-guan-zhi_ch-196_p-${309 + index}`);
const targets = passages.filter((item) => targetIds.includes(item.id));
if (targets.length !== 4) throw new Error('Target passages not found');

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
const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。；：！？、「」『』（）〈〉《》○:]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-196_p-309_s-5732')) {
  console.log('蘇轍《六國論》正文已清理，略過重複執行。');
  process.exit(0);
}

setSentence(
  'gu-wen-guan-zhi_ch-196_p-309_s-5731',
  '嘗讀六國世家，竊怪天下之諸侯以五倍之地，十倍之眾，發憤西向，以攻山西千里之秦，而不免於滅亡。',
  '我曾讀《史記》的六國世家，私下奇怪六國諸侯擁有秦國五倍的土地、十倍的兵民，奮力向西攻打僅據山西千里之地的秦國，最後仍不免滅亡。',
);
const removeIds = new Set(['gu-wen-guan-zhi_ch-196_p-309_s-5732']);
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
console.log(`移除六國世家夾注並合併首句，古文淨字數變動 ${after - before}。`);
