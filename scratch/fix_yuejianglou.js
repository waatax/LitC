import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;

const replacements = [
  ['gu-wen-guan-zhi_ch-206_p-349_s-5964', '由是聲教所暨，罔間朔南，存神穆清，與天同體，雖一豫一遊，亦可爲天下後世法。', ['由是聲教所暨', '罔間朔南', '存神穆清', '與天同體', '雖一豫一遊', '亦可爲天下後世法'], '從此聲威教化所到之處，無論北方南方都無例外；皇帝精神清明寧靜，與天同體，即使一次遊樂，也足以成為天下後世的準則'],
  ['gu-wen-guan-zhi_ch-206_p-350_s-5970', '見江漢之朝宗，諸侯之述職，城池之高深，關阨之嚴固，', ['見江漢之朝宗', '諸侯之述職', '城池之高深', '關阨之嚴固'], '看見江漢流水奔向大海、諸侯入朝述職，以及城池高深、關隘堅固'],
  ['gu-wen-guan-zhi_ch-206_p-351_s-5982', '不過樂管絃之淫響，藏燕、趙之豔姬，一旋踵間而感慨係之，臣不知其爲何說也。', ['不過樂管絃之淫響', '藏燕趙之豔姬', '一旋踵間而感慨係之', '臣不知其爲何說也'], '不過用來享受管弦的靡麗樂聲、蓄養燕趙美女，轉眼之間便隨王朝覆亡而引人感慨，臣實在不知這種建樓用意有何可說'],
  ['gu-wen-guan-zhi_ch-206_p-351_s-5987', '逢掖之士，有登斯樓而閱斯江者，當思聖德如天，蕩蕩難名，與神禹疏鑿之功同一罔極。', ['逢掖之士', '有登斯樓而閱斯江者', '當思聖德如天', '蕩蕩難名', '與神禹疏鑿之功同一罔極'], '讀書人若登上此樓觀看長江，應想到皇帝德澤如天，廣大難以形容，與大禹疏導江河的功業同樣無窮'],
];

for (const [id, text, chunks, translationHint] of replacements) {
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

const removedIds = new Set([
  'gu-wen-guan-zhi_ch-206_p-349_s-5965',
  'gu-wen-guan-zhi_ch-206_p-350_s-5971',
  'gu-wen-guan-zhi_ch-206_p-351_s-5988',
]);

for (const passage of passages.filter((item) => item.chapterId === 'gu-wen-guan-zhi_ch-206')) {
  passage.sentenceIds = passage.sentenceIds.filter((id) => !removedIds.has(id));
  passage.canonicalText = passage.sentenceIds
    .map((id) => sentences.find((item) => item.id === id)?.canonicalText || '')
    .join('');
}

arrays[3] = sentences.filter((item) => !removedIds.has(item.id));

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
console.log('已移除〈閱江樓記〉三組夾注偽句並校正文句。');
