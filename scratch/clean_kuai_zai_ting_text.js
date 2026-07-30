import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const targetIds = ['gu-wen-guan-zhi_ch-198_p-317', 'gu-wen-guan-zhi_ch-198_p-318', 'gu-wen-guan-zhi_ch-198_p-319'];
const targets = passages.filter((item) => targetIds.includes(item.id));
if (targets.length !== 3) throw new Error('Target passages not found');

const replacements = new Map([
  ['gu-wen-guan-zhi_ch-198_p-318_s-5787', {
    canonicalText: '至於長洲之濱，故城之墟，曹孟德、孫仲謀之所睥睨，周瑜、陸遜之所騁騖，其流風遺跡，亦足以稱快世俗。',
    translationHint: '至於長洲水邊、古城廢墟，是曹操、孫權曾經虎視爭衡，周瑜、陸遜曾經馳騁用兵的區域；那些流傳的風采與遺跡，也足以使世俗之人感到快意。',
  }],
  ['gu-wen-guan-zhi_ch-198_p-319_s-5792', {
    canonicalText: '夫風無雌雄之異，而人有遇不遇之變。',
    translationHint: '風本來沒有雌風、雄風的差別，人卻有得志與不得志的不同遭遇。',
  }],
  ['gu-wen-guan-zhi_ch-198_p-319_s-5796', {
    canonicalText: '今張君不以謫爲患，竊會計之餘功，而自放山水之間，此其中宜有以過人者。',
    translationHint: '如今張君不把貶謫視為禍患，利用辦理財計公務的餘暇，讓自己徜徉在山水之間；他的內心應當有超越常人的地方。',
  }],
  ['gu-wen-guan-zhi_ch-198_p-319_s-5798', {
    canonicalText: '不然，連山絕壑，長林古木，振之以清風，照之以明月，此皆騷人思士之所以悲傷憔悴而不能勝者，烏睹其爲快也哉！',
    translationHint: '否則，連綿山嶺、幽深溝壑、茂密森林與古老樹木，再有清風吹動、明月照耀，都可能使多愁的文人志士悲傷憔悴、承受不住，哪裡還看得出它們令人快意呢！',
  }],
]);

const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。；：！？、「」『』（）〈〉《》]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);
let changed = 0;
for (const [id, replacement] of replacements) {
  const sentence = sentences.find((item) => item.id === id);
  if (!sentence) throw new Error(`Sentence not found: ${id}`);
  if (sentence.canonicalText === replacement.canonicalText) continue;
  sentence.canonicalText = replacement.canonicalText;
  sentence.translationHint = replacement.translationHint;
  sentence.chunks = [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: replacement.canonicalText }];
  changed += 1;
}
if (!changed) {
  console.log('《黃州快哉亭記》正文已校正，略過重複執行。');
  process.exit(0);
}
for (const passage of targets) {
  passage.canonicalText = passage.sentenceIds
    .map((id) => sentences.find((item) => item.id === id)?.canonicalText ?? '')
    .join('');
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
console.log(`校正 ${changed} 句，古文淨字數變動 ${after - before}。`);
