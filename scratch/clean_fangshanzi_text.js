import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = Array.from({ length: 4 }, (_, index) => `gu-wen-guan-zhi_ch-195_p-${305 + index}`);
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

if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-195_p-305_s-5712')) {
  console.log('《方山子傳》正文已清理，略過重複執行。');
  process.exit(0);
}

setSentence(
  'gu-wen-guan-zhi_ch-195_p-306_s-5717',
  '」方山子亦矍然問余所以至此者。',
  '方山子也吃驚地問我為什麼會來到這裡。',
);
const removeIds = new Set([
  'gu-wen-guan-zhi_ch-195_p-305_s-5712',
  'gu-wen-guan-zhi_ch-195_p-305_s-5713',
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
console.log(`移除 ${removeIds.size} 句方山冠夾注並修正一處代詞，古文淨字數變動 ${after - before}。`);
