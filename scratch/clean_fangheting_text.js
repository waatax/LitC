import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passageIds = ['gu-wen-guan-zhi_ch-188_p-279', 'gu-wen-guan-zhi_ch-188_p-280'];
const targets = passages.filter((item) => passageIds.includes(item.id));
if (targets.length !== 2) throw new Error('Target passages not found');
const getSentence = (id) => {
  const value = sentences.find((item) => item.id === id);
  if (!value) throw new Error(`Sentence not found: ${id}`);
  return value;
};
if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-188_p-279_s-5438')) {
  console.log('〈放鶴亭記〉夾注與偽句已清理，無需重複執行。');
  process.exit(0);
}

const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

const s5437 = getSentence('gu-wen-guan-zhi_ch-188_p-279_s-5437');
s5437.canonicalText = '易曰：「鳴鶴在陰，其子和之。」';
s5437.translationHint = '《周易》說：「鶴在幽暗處鳴叫，牠的同類便應聲和鳴。」';
s5437.chunks = [
  { id: `${s5437.id}_c-1`, sentenceId: s5437.id, order: 1, text: '易曰：' },
  { id: `${s5437.id}_c-2`, sentenceId: s5437.id, order: 2, text: '「鳴鶴在陰，' },
  { id: `${s5437.id}_c-3`, sentenceId: s5437.id, order: 3, text: '其子和之。」' },
];

const s5440 = getSentence('gu-wen-guan-zhi_ch-188_p-279_s-5440');
s5440.canonicalText = '詩曰：「鶴鳴于九皋，聲聞於天。」';
s5440.translationHint = '《詩經》說：「鶴在深遠的水澤鳴叫，聲音傳到天上。」';
s5440.chunks = [
  { id: `${s5440.id}_c-1`, sentenceId: s5440.id, order: 1, text: '詩曰：' },
  { id: `${s5440.id}_c-2`, sentenceId: s5440.id, order: 2, text: '「鶴鳴于九皋，' },
  { id: `${s5440.id}_c-3`, sentenceId: s5440.id, order: 3, text: '聲聞於天。」' },
];

const s5447 = getSentence('gu-wen-guan-zhi_ch-188_p-279_s-5447');
s5447.canonicalText = '周公作酒誥，衛武公作抑戒，以爲荒惑敗亂，無若酒者，而劉伶、阮籍之徒，以此全其真而名後世。';
s5447.translationHint = '周公作《酒誥》，衛武公作《抑戒》，都認為使人迷亂敗德沒有比酒更嚴重的；劉伶、阮籍等人卻藉酒保全真性，名傳後世。';
s5447.chunks = [
  { id: `${s5447.id}_c-1`, sentenceId: s5447.id, order: 1, text: '周公作酒誥，' },
  { id: `${s5447.id}_c-2`, sentenceId: s5447.id, order: 2, text: '衛武公作抑戒，' },
  { id: `${s5447.id}_c-3`, sentenceId: s5447.id, order: 3, text: '以爲荒惑敗亂，無若酒者，' },
  { id: `${s5447.id}_c-4`, sentenceId: s5447.id, order: 4, text: '而劉伶、阮籍之徒，' },
  { id: `${s5447.id}_c-5`, sentenceId: s5447.id, order: 5, text: '以此全其真而名後世。' },
];

const s5457 = getSentence('gu-wen-guan-zhi_ch-188_p-279_s-5457');
s5457.canonicalText = '由此觀之，其爲樂未可以同日而語也。」';
s5457.translationHint = '由此看來，兩者的快樂根本不能相提並論。」';
s5457.chunks = [
  { id: `${s5457.id}_c-1`, sentenceId: s5457.id, order: 1, text: '由此觀之，' },
  { id: `${s5457.id}_c-2`, sentenceId: s5457.id, order: 2, text: '其爲樂未可以同日而語也。」' },
];

const s5466 = getSentence('gu-wen-guan-zhi_ch-188_p-280_s-5466');
s5466.canonicalText = '歸來歸來兮，西山不可以久留。」';
s5466.translationHint = '回來吧，回來吧！西山不可以長久停留。」';
s5466.chunks = [
  { id: `${s5466.id}_c-1`, sentenceId: s5466.id, order: 1, text: '歸來歸來兮，' },
  { id: `${s5466.id}_c-2`, sentenceId: s5466.id, order: 2, text: '西山不可以久留。」' },
];

const removeIds = new Set([
  'gu-wen-guan-zhi_ch-188_p-279_s-5438',
  'gu-wen-guan-zhi_ch-188_p-279_s-5439',
  'gu-wen-guan-zhi_ch-188_p-279_s-5441',
  'gu-wen-guan-zhi_ch-188_p-279_s-5442',
  'gu-wen-guan-zhi_ch-188_p-279_s-5443',
  'gu-wen-guan-zhi_ch-188_p-279_s-5444',
  'gu-wen-guan-zhi_ch-188_p-279_s-5448',
  'gu-wen-guan-zhi_ch-188_p-279_s-5449',
  'gu-wen-guan-zhi_ch-188_p-279_s-5450',
  'gu-wen-guan-zhi_ch-188_p-279_s-5451',
  'gu-wen-guan-zhi_ch-188_p-279_s-5452',
  'gu-wen-guan-zhi_ch-188_p-279_s-5453',
  'gu-wen-guan-zhi_ch-188_p-279_s-5458',
  'gu-wen-guan-zhi_ch-188_p-280_s-5467',
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
