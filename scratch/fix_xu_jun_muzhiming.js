import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;

const updates = [
  ['gu-wen-guan-zhi_ch-204_p-340_s-5916', '余嘗譜其世家，所謂今之泰州海陵縣主簿者也。', ['余嘗譜其世家', '所謂今之泰州海陵縣主簿者也'], '我曾為他的家族編寫譜系，他就是如今所說的泰州海陵縣主簿'],
  ['gu-wen-guan-zhi_ch-204_p-342_s-5925', '若夫智謀功名之士，窺時俯仰，以赴勢利之會，而輒不遇者，乃亦不可勝數。', ['若夫智謀功名之士', '窺時俯仰', '以赴勢利之會', '而輒不遇者', '乃亦不可勝數'], '至於追求智謀功名的人，察看時勢而隨勢進退，趕赴權勢利益交會的機會，卻總是不得志的，也多得數不完'],
  ['gu-wen-guan-zhi_ch-204_p-343_s-5930', '君年五十九，以嘉祐某年某月某甲子葬真州之揚子縣甘露鄉某所之原。', ['君年五十九', '以嘉祐某年某月某甲子', '葬真州之揚子縣甘露鄉某所之原'], '許君享年五十九，在嘉祐某年某月某甲子，安葬於真州揚子縣甘露鄉某處的原野'],
  ['gu-wen-guan-zhi_ch-204_p-344_s-5938', '嗚呼！', ['嗚呼'], '唉'],
  ['gu-wen-guan-zhi_ch-204_p-344_s-5939', '許君而已於斯！誰或使之？', ['許君而已於斯', '誰或使之'], '許君卻到這裡便止步了，是誰使他如此呢'],
];

for (const [id, text, chunks, translationHint] of updates) {
  const sentence = sentences.find((item) => item.id === id);
  if (!sentence) throw new Error(`Sentence not found: ${id}`);
  sentence.canonicalText = text;
  sentence.translationHint = translationHint;
  sentence.chunks = chunks.map((chunk, index) => ({
    id: `${id}_c-${index + 1}`,
    sentenceId: id,
    order: index + 1,
    text: chunk,
  }));
}

for (const passage of passages.filter((item) => item.chapterId === 'gu-wen-guan-zhi_ch-204')) {
  passage.canonicalText = passage.sentenceIds
    .map((id) => sentences.find((item) => item.id === id)?.canonicalText || '')
    .join('');
}

const work = works.find((item) => item.id === 'gu-wen-guan-zhi');
work.totalChars = passages
  .filter((item) => item.chapterId.startsWith('gu-wen-guan-zhi_ch-'))
  .reduce((sum, item) => sum + [...item.canonicalText].length, 0);

for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`;
}

fs.writeFileSync(file, source, 'utf8');
console.log('已校正許君墓誌正文。');
