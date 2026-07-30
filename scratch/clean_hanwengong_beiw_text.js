import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, , passages, sentences] = arrays;
const passageIds = Array.from({ length: 6 }, (_, index) => `gu-wen-guan-zhi_ch-190_p-${284 + index}`);
const targets = passages.filter((item) => passageIds.includes(item.id));
if (targets.length !== 6) throw new Error('Target passages not found');
const getSentence = (id) => {
  const value = sentences.find((item) => item.id === id);
  if (!value) throw new Error(`Sentence not found: ${id}`);
  return value;
};
const setSentence = (id, canonicalText, translationHint) => {
  const sentence = getSentence(id);
  sentence.canonicalText = canonicalText;
  sentence.translationHint = translationHint;
  sentence.chunks = [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText }];
};
if (!sentences.some((item) => item.id === 'gu-wen-guan-zhi_ch-190_p-284_s-5503')) {
  console.log('〈潮州韓文公廟碑〉夾注與偽句已清理，無需重複執行。');
  process.exit(0);
}
const normalizedLength = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length;
const before = targets.reduce((sum, item) => sum + normalizedLength(item.canonicalText), 0);

setSentence('gu-wen-guan-zhi_ch-190_p-284_s-5502', '故申、呂自嶽降，傅說爲列星，古今所傳，不可誣也。', '所以申伯、呂侯被說成由山嶽神靈降生，傅說死後化為列星；這些古今傳說不能一概誣為虛妄。');
setSentence('gu-wen-guan-zhi_ch-190_p-285_s-5520', '文起八代之衰，而道濟天下之溺；', '他的文章振起八代以來的衰頹文風，他所倡之道挽救天下思想的沉淪；');
setSentence('gu-wen-guan-zhi_ch-190_p-286_s-5532', '信乎孔子之言：「君子學道則愛人，小人學道則易使也。」', '孔子所說「在位者學道便能愛人，平民學道便容易接受治理」，確實如此。');
setSentence('gu-wen-guan-zhi_ch-190_p-288_s-5546', '譬如鑿井得泉，而曰水專在是，豈理也哉？」', '這像鑿井得到泉水便說水只存在此處，哪有這樣的道理？」');
setSentence('gu-wen-guan-zhi_ch-190_p-289_s-5550', '其辭曰：「公昔騎龍白雲鄉，', '歌辭說：「韓公昔日騎龍遨遊白雲之鄉，');
setSentence('gu-wen-guan-zhi_ch-190_p-289_s-5552', '手抉雲漢分天章，', '親手撥開銀河，分取天上的文采，');
setSentence('gu-wen-guan-zhi_ch-190_p-289_s-5556', '西遊咸池略扶桑，', '向西游過咸池，又掠過扶桑，');
setSentence('gu-wen-guan-zhi_ch-190_p-289_s-5560', '作書詆佛譏君王。', '寫下諫書排斥佛教、譏諫君王。');
setSentence('gu-wen-guan-zhi_ch-190_p-289_s-5569', '公不少留我涕滂，翩然被髮下大荒。」', '韓公不肯稍作停留，使我淚流滿面；他披散頭髮，輕快地降往遙遠荒外。」');

const removeIds = new Set([
  ...Array.from({ length: 8 }, (_, index) => `gu-wen-guan-zhi_ch-190_p-284_s-${5503 + index}`),
  'gu-wen-guan-zhi_ch-190_p-285_s-5524',
  'gu-wen-guan-zhi_ch-190_p-285_s-5525',
  'gu-wen-guan-zhi_ch-190_p-286_s-5533',
  'gu-wen-guan-zhi_ch-190_p-288_s-5547',
  'gu-wen-guan-zhi_ch-190_p-289_s-5551',
  'gu-wen-guan-zhi_ch-190_p-289_s-5553',
  'gu-wen-guan-zhi_ch-190_p-289_s-5557',
  'gu-wen-guan-zhi_ch-190_p-289_s-5565',
  'gu-wen-guan-zhi_ch-190_p-289_s-5566',
  'gu-wen-guan-zhi_ch-190_p-289_s-5567',
  'gu-wen-guan-zhi_ch-190_p-289_s-5568',
  'gu-wen-guan-zhi_ch-190_p-289_s-5570',
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
