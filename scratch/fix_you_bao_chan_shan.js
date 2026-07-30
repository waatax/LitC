import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;

const updates = [
  ['gu-wen-guan-zhi_ch-203_p-335_s-5890', '距其院東五里，所謂華陽洞者，以其在華山之陽名之也。', ['距其院東五里，', '所謂華陽洞者，', '以其在華山之陽名之也。'], '距離禪院東面五里，便是所謂華陽洞，因它位於華山南面而得名。'],
  ['gu-wen-guan-zhi_ch-203_p-336_s-5894', '由山以上五六里，有穴窈然，入之甚寒，問其深，則雖好遊者不能窮也，謂之「後洞」。', ['由山以上五六里，', '有穴窈然，', '入之甚寒，', '問其深，', '則雖好遊者不能窮也，', '謂之「後洞」。'], '沿山向上走五六里，有個幽深的洞穴，進去十分寒冷；問它有多深，即使喜好遊覽的人也不能走到盡頭，稱為「後洞」。'],
  ['gu-wen-guan-zhi_ch-203_p-336_s-5898', '蓋予所至，比好遊者尚不能什一，然視其左右，來而記之者已少。', ['蓋予所至，', '比好遊者尚不能什一，', '然視其左右，', '來而記之者已少。'], '我到達的地方，比起那些善遊者所到之處還不及十分之一；可是看看洞壁兩旁，前來題記的人已經很少。'],
  ['gu-wen-guan-zhi_ch-203_p-337_s-5909', '然力足以至焉而不至，於人爲可譏，而在己爲有悔。', ['然力足以至焉而不至，', '於人爲可譏，', '而在己爲有悔。'], '可是力量足以到達卻沒有到達，在別人看來值得譏笑，在自己心中也會留下悔恨。'],
  ['gu-wen-guan-zhi_ch-203_p-338_s-5912', '予於仆碑，又以悲夫古書之不存，後世之謬其傳而莫能名者，何可勝道也哉！', ['予於仆碑，', '又以悲夫古書之不存，', '後世之謬其傳而莫能名者，', '何可勝道也哉！'], '我面對那塊倒地的石碑，又因此感嘆古代文獻失傳，使後世以訛傳訛而沒有人能說出真相的事，哪裡說得完呢！'],
  ['gu-wen-guan-zhi_ch-203_p-339_s-5914', '四人者：廬陵蕭君圭君玉，長樂王回深父，予弟安國平父、安上純父。至和元年七月某日，臨川王某記。', ['四人者：', '廬陵蕭君圭君玉，', '長樂王回深父，', '予弟安國平父、', '安上純父。', '至和元年七月某日，', '臨川王某記。'], '同遊的四人是：廬陵蕭君圭，字君玉；長樂王回，字深父；我的弟弟王安國，字平父；王安上，字純父。至和元年七月某日，臨川王安石記。'],
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

for (const passage of passages.filter((item) => item.chapterId === 'gu-wen-guan-zhi_ch-203')) {
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
console.log('已校復〈遊褒禪山記〉正文缺漏、篇末題記與相關分句。');
