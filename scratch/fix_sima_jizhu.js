import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;

const replacements = [
  {
    id: 'gu-wen-guan-zhi_ch-207_p-354_s-6001',
    canonicalText: '」東陵侯曰：「僕未究其奧也，願先生卒教之。」',
    translationHint: '」東陵侯說：「我還未探究其中的深意，希望先生把道理完整教給我。」',
    chunks: ['」東陵侯曰：', '「僕未究其奧也，', '願先生卒教之。」'],
  },
  {
    id: 'gu-wen-guan-zhi_ch-207_p-355_s-6015',
    canonicalText: '露蠶風蟬，昔日之鳳笙龍笛也；',
    translationHint: '露中的蠶、風中的蟬，取代了昔日悠揚的鳳笙龍笛；',
    chunks: ['露蠶風蟬，', '昔日之鳳笙龍笛也；'],
  },
  {
    id: 'gu-wen-guan-zhi_ch-207_p-355_s-6017',
    canonicalText: '秋荼春薺，昔日之象白駝峰也；',
    translationHint: '秋天的苦菜、春天的薺菜，取代了昔日的象肉、白駝峰等珍饈；',
    chunks: ['秋荼春薺，', '昔日之象白駝峰也；'],
  },
  {
    id: 'gu-wen-guan-zhi_ch-207_p-355_s-6025',
    canonicalText: '君侯亦知之矣，何以卜爲？」',
    translationHint: '君侯也已明白這番道理，又何必占卜呢？」',
    chunks: ['君侯亦知之矣，', '何以卜爲？」'],
  },
];

for (const item of replacements) {
  const sentence = sentences.find((candidate) => candidate.id === item.id);
  if (!sentence) throw new Error(`Sentence not found: ${item.id}`);
  sentence.canonicalText = item.canonicalText;
  sentence.translationHint = item.translationHint;
  sentence.chunks = item.chunks.map((text, index) => ({
    id: `${item.id}_c-${index + 1}`,
    sentenceId: item.id,
    order: index + 1,
    text,
  }));
}

const removedIds = new Set([
  'gu-wen-guan-zhi_ch-207_p-354_s-6002',
  'gu-wen-guan-zhi_ch-207_p-355_s-6026',
]);

for (const passage of passages.filter((item) => item.chapterId === 'gu-wen-guan-zhi_ch-207')) {
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
console.log('Updated ch207 and removed two standalone closing-quote pseudo-sentences.');
