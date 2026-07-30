import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passageIds = ['gu-wen-guan-zhi_ch-184_p-265', 'gu-wen-guan-zhi_ch-184_p-266'];
const targets = passages.filter((item) => passageIds.includes(item.id));
if (targets.length !== 2) throw new Error('Target passages not found');
if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-184_p-265_s-5297')) {
  console.log('夾注已清除，無需重複執行。');
  process.exit(0);
}

const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);
const removeIds = new Set([
  ...Array.from({ length: 10 }, (_, index) => `gu-wen-guan-zhi_ch-184_p-265_s-${5297 + index}`),
  ...Array.from({ length: 3 }, (_, index) => `gu-wen-guan-zhi_ch-184_p-266_s-${5327 + index}`),
]);
const kept = sentences.filter((item) => !removeIds.has(item.id));
sentences.splice(0, sentences.length, ...kept);

const firstRemaining = sentences.find((item) => item.id === 'gu-wen-guan-zhi_ch-184_p-265_s-5307');
firstRemaining.canonicalText = `及觀史，${firstRemaining.canonicalText}`;
firstRemaining.translationHint = '等到閱讀《史記》，看見孔子在陳、蔡之間受困，弦歌之聲仍不停止，顏淵、仲由等弟子彼此問答。';
firstRemaining.chunks = [
  { id: `${firstRemaining.id}_c-1`, sentenceId: firstRemaining.id, order: 1, text: '及觀史，' },
  ...firstRemaining.chunks.map((chunk, index) => ({ ...chunk, id: `${firstRemaining.id}_c-${index + 2}`, order: index + 2 })),
];

for (const passage of targets) {
  passage.sentenceIds = passage.sentenceIds.filter((id) => !removeIds.has(id));
  passage.canonicalText = passage.sentenceIds.map((id) => sentences.find((item) => item.id === id)?.canonicalText || '').join('');
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
console.log(`已移除 ${removeIds.size} 句夾注，正文淨字數調整 ${after - before}。`);
