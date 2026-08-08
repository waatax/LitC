import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = full.chapters.filter(item => item.volume === '武韜');
if (additions.length !== 5) throw new Error(`Expected 5 武韜 chapters, got ${additions.length}`);

const worksPath = './src/data/works.ts';
let source = fs.readFileSync(worksPath, 'utf8');
function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = source.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return { re, value: JSON.parse(decodeURIComponent(match[1])) };
}
const wd = readArray('works', 'Work');
const cd = readArray('chapters', 'Chapter');
const pd = readArray('passages', 'Passage');
const sd = readArray('sentences', 'Sentence');
const work = wd.value.find(item => item.id === 'liu-tao');
const refs = [
  { label: '經文底本', edition: '《四部叢刊初編》本《六韜、吳子、司馬法》' },
  { label: '數位對校', edition: '維基文庫《六韜》標點本；中國哲學書電子化計劃《六韜》' },
];
function splitSentences(text) {
  return text.match(/[^。！？；]+[。！？；]?/g)?.map(item => item.trim()).filter(Boolean) ?? [text];
}
for (const item of additions) {
  const chId = `liu-tao_ch-${item.order}`;
  const pId = `${chId}_p-1`;
  cd.value = cd.value.filter(ch => ch.id !== chId);
  pd.value = pd.value.filter(p => p.id !== pId);
  sd.value = sd.value.filter(s => s.passageId !== pId);
  const parts = splitSentences(item.text);
  const sentenceIds = parts.map((_, index) => `${pId}_s-${index + 1}`);
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `武韜・${item.title}`, difficulty: 4, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 170)), passageIds: [pId], tags: ['六韜', '武韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '武韜', item.title] });
  });
}
work.chapterIds = Array.from({ length: 17 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》校補進行中：文韜十二篇、武韜五篇已齊；龍、虎、豹、犬四韜待依六卷六十篇次續補。經文以《四部叢刊初編》本為底本，參校《續古逸叢書》本、《六韜直解》及公開標點本。';
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  13: ['文王在豐邑召太公，說商紂暴虐殺害無辜，請教如何救民。太公主張先修德、禮賢、惠民，等天災人禍與商王內外、親疏的真實情勢都顯露後才可行動。最高的勝利是不戰而全勝：與人民同患難、同好惡，便能不靠甲兵、攻具、溝塹而獲支持。天下屬於天下人；不向人民、國家、天下強取，反能取得其歸附。聖人行動前像猛禽斂翼、猛獸伏身，隱藏意圖；待商朝荒淫、邪勝正、酷吏亂法的亡國徵兆成熟，再以大明、大義與兵威使天下歸服。', '【主旨】〈發啟〉論伐商的政治條件：修德惠民、察明人心、隱密蓄勢，追求不戰全勝。\n【詞義】「下賢」指謙下禮賢；「衝機」為攻城器械；「無創」指不受創傷；「弭耳」指收斂耳朵伏身。\n【思想】篇中反覆說「天下非一人之天下」，把軍事勝負奠基於公共利益與民心，而不是單純武力。'],
  14: ['文王問聖人持守什麼。太公說，施政若不以私慮與吝嗇妨害萬物，教化便在人民不知不覺間運行。求得治道後須深藏而實行，施行後不自我誇明；天地不自稱明而長久，聖人不自我標榜而名聲彰顯。古代聖人由家、國而天下，分封賢者、順應民俗，使各地安居樂業，稱為大紀、大定。反之，上位者多事則刑罰繁、人民憂而流亡，成為大失。人民如流水，堵則止、疏導則行、安靜則清；最好的治理順應人民正常生計，其次才是教化，使人民自然富足。', '【主旨】〈文啟〉以清靜、不自明、順民生為治理原則，對比繁刑擾民的「大失」。\n【詞義】「嗇」為吝惜、拘執；「遒」有聚斂、盡得其所之意；「大紀」指天下綱紀；「無與」指不待外力強制。\n【結構】由聖人內在持守推到封建秩序，再以流水譬喻民情，最後落實為順常生、少幹預。'],
  15: ['文王問不用交戰而制服敵國的方法。太公列出十二種「文伐」：順著敵君嗜好助長驕縱；拉攏其親信以分權；暗賂左右刺探內情；以財色娛樂擴大欲望；離間忠臣；收買內部並隔絕外援；厚賂近臣使其輕棄本業、耗空儲蓄；以重寶和有利計謀建立依附；用虛名尊寵使國政苟且；卑下取信後暗中控制；以富貴收羅豪傑、智士與勇士堵塞君主；豢養亂臣並以聲色犬馬迷惑。十二項條件完備，並察明天時、地利與徵兆後，才轉入武力討伐。', '【主旨】〈文伐〉系統描述以腐化、收買、離間和情報手段從內部削弱敵國。\n【詞義】「陰賂」為祕密賄賂；「間其外」指離間外援；「錮其心」指控制意志；「大偷」指政事怠惰苟且。\n【辨析】這是戰國兵書的敵國顛覆術，解析須說明其歷史語境與倫理風險，不能當成一般人際處世建議。'],
  16: ['文王問具備什麼條件才可治理天下。太公回答，度量、信用、仁愛、恩惠與權變都須廣被天下，處事還要堅定不疑；六項齊備，才能施行天下之政。為天下謀利，天下便開放歸附；危害天下，天下便閉拒。使天下生養者受感戴，殘害者被視為賊；使道路通達者獲支持，使天下困窮者成仇敵；使天下安定者為人民倚仗，使天下危亂者成災害。天下不是一人的天下，只有有道者才能居其位。', '【主旨】〈順啟〉以六項王者條件說明天下歸附取決於普遍利益。\n【詞義】「蓋天下」指德量廣被、超越天下；「約天下」指以信用約束天下；「徹」為通達；「處之」指居有天下。\n【修辭】利／害、生／殺、徹／窮、安／危四組排比，清楚呈現政治行為與民心反應的因果。'],
  17: ['武王說建立功業有三項疑難：力量不足以攻強敵、不能離間其親信、不能瓦解其羣眾。太公回答要順勢、慎密謀劃並運用財貨。對強敵可助長其過度擴張，使太強者自折、太張者自缺；離親要從親近者下手，散眾要利用其羣體內部。以事情誘發、利益玩弄，便會引起爭心；再從寵臣嗜慾入手造成疏離。攻敵須先蒙蔽其明察，再削弱強者；用財色聲味腐化近臣，使他們遠離人民而不覺己方意圖。同時對人民施惠、不吝財物、供給衣食而愛護他們，依次開啟智慧、財力、羣眾與賢才，最後取得天下。', '【主旨】〈三疑〉回答攻強、離親、散眾三難，核心是使敵方過度擴張並從內部分化，同時爭取民心。\n【詞義】「養之使強」是故意助長敵勢；「玩之以利」指以利益操弄；「塞其明」指蒙蔽敵君耳目；「無愛財」指不要吝惜財物。\n【結構】前半是削敵的權謀，末段轉為惠民、聚賢，顯示瓦解敵國與建立己方正當性必須並行。']
};
let aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
for (const item of additions) {
  const id = `liu-tao_ch-${item.order}_p-1`;
  const [translation, analysis] = aids[item.order];
  const entry = `  '${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(analysis)}\n  },\n`;
  const marker = '\n}\n\nexport function getPassageReadingAid';
  if (!aidSource.includes(marker)) throw new Error('Cannot find PASSAGE_AIDS closing marker');
  aidSource = aidSource.replace(marker, `\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync('./src/data/readingAid.ts', aidSource, 'utf8');
console.log('Added and annotated all 5 武韜 chapters.');
