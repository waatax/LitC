import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = Array.from({ length: 4 }, (_, index) => `gu-wen-guan-zhi_ch-192_p-${294 + index}`);
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

if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-192_p-294_s-5606')) {
  console.log('《前赤壁賦》正文已清理，略過重複執行。');
  process.exit(0);
}

setSentence(
  'gu-wen-guan-zhi_ch-192_p-294_s-5611',
  '浩浩乎如馮虛御風，而不知其所止；',
  '浩浩蕩蕩，彷彿凌空乘風而行，不知道將停在何處；',
);
setSentence(
  'gu-wen-guan-zhi_ch-192_p-295_s-5616',
  '」客有吹洞簫者，倚歌而和之。',
  '有位吹洞簫的客人，依照歌聲的曲調伴奏。',
);
setSentence(
  'gu-wen-guan-zhi_ch-192_p-295_s-5628',
  '知不可乎驟得，託遺響於悲風。」',
  '明知這種願望不可能一下實現，只能把餘音寄託在悲涼的秋風中。',
);
setSentence(
  'gu-wen-guan-zhi_ch-192_p-296_s-5636',
  '惟江上之清風，與山間之明月，耳得之而爲聲，目遇之而成色，取之無禁，用之不竭，是造物者之無盡藏也，而吾與子之所共適。」',
  '只有江上的清風與山間的明月，耳朵聽見便成為聲音，眼睛看見便成為景色；取用不受禁止，享用也不會枯竭，這是造物者無窮的寶藏，可由你我共同享受。',
);

const removeIds = new Set([
  'gu-wen-guan-zhi_ch-192_p-294_s-5606',
  'gu-wen-guan-zhi_ch-192_p-294_s-5610',
  'gu-wen-guan-zhi_ch-192_p-295_s-5620',
  'gu-wen-guan-zhi_ch-192_p-295_s-5621',
  'gu-wen-guan-zhi_ch-192_p-295_s-5622',
  'gu-wen-guan-zhi_ch-192_p-295_s-5629',
  'gu-wen-guan-zhi_ch-192_p-296_s-5637',
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
console.log(`移除 ${removeIds.size} 句夾注或孤立引號，古文淨字數變動 ${after - before}。`);
