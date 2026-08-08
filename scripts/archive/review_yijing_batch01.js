import fs from 'fs';

const corrections = {
  'yi-jing_ch-1_p-1': {
    translation: '乾卦：乾，象徵創始而大為亨通，適宜守持正固。\n《大象傳》說：天體運行剛健不止，君子由此效法，自我勉勵，永不懈怠。',
    analysis: '乾卦六爻皆陽，傳統取象為天與剛健。「元、亨、利、貞」在經文早期語境可讀為一組占辭：大為亨通，利於正固；《文言傳》又把它闡釋為元始、亨通、和利、貞正四德，兩層不宜混為唯一原義。《大象》從天行不息推出「自強不息」，重點是持續而有節律的進德，不是無限勞作或壓迫自己。',
  },
  'yi-jing_ch-2_p-1': {
    translation: '坤卦：坤，創始而亨通，適宜像母馬那樣柔順而守正。君子有所前往，搶先便會迷失，隨後順勢則能得到引導而有利；往西南可得同伴，往東北會失去同伴。安於正道便吉祥。\n《大象傳》說：大地的形勢柔順深厚，君子由此效法，以深厚德行承載萬物。',
    analysis: '坤卦六爻皆陰，取象為地與順承。「牝馬之貞」借母馬柔順而健行的形象說坤道之正；孔穎達《正義》也以柔順釋之。「先迷後得主」斷句歷來有異，傳統多解為居先則迷、居後順承則得所主。「西南得朋、東北喪朋」帶有方位占辭背景，後世再發揮為同類相從。《大象》的厚德載物是承擔與包容，不應被曲解為要求弱者無條件服從。',
  },
  'yi-jing_ch-3_p-1': {
    translation: '屯卦：屯，起始雖艱難，仍可大為亨通，適宜守正；此時不宜貿然前往，宜先建立領導與秩序。\n《大象傳》說：雲與雷交動，是屯卦的形象；君子由此整理頭緒、經營治理。',
    analysis: '「屯」有草木初生、艱難盤屈之意，卦象水雷相交而生機未暢，所以主題是創始之難。「勿用有攸往」不是永遠不行動，而是條件紛亂時不宜無備遠進；「利建侯」在古代政治語境指建立諸侯或領導秩序。《大象》以雲雷未成雨比擬局勢待整，「經綸」本指整理絲縷，引申為規畫治理。',
  },
  'yi-jing_ch-4_p-1': {
    translation: '蒙卦：蒙，可以亨通。不是我去求蒙昧的童子，而是童子來求教於我。第一次占問便告知；一再反覆占問就是褻慢，既已褻慢便不再告知。適宜守正。\n《大象傳》說：山下湧出泉水，是蒙卦的形象；君子由此果決實行，涵養德性。',
    analysis: '「蒙」兼有蒙昧與啟蒙之義；卦辭把學習者的主動求問置於首位。「初筮告，再三瀆」原是占筮規範，後世用來說教育須有誠意，不宜把同一問題反覆試探到得到喜愛的答案。「匪我求童蒙」不是教師拒絕學生，而是強調求學動機不能由外力代替。《大象》取山下初泉，水勢雖微卻能前行，故以果行與育德相配。',
  },
  'yi-jing_ch-5_p-1': {
    translation: '需卦：需，心有誠信，光明而亨通；守正則吉，適宜渡過大河般的險阻。\n《大象傳》說：雲氣上升到天空，是需卦的形象；君子由此安然飲食宴樂，等待時機。',
    analysis: '「需」主要是等待，不是消極拖延。「有孚」指內有誠信，「利涉大川」常作承擔重大行動的占辭；兩者合看，是有準備、有信心地待時而動。雲在天上而雨尚未降，《大象》因而說飲食宴樂：在不可強求的等待期保存身心，不焦躁妄進。這不等於享樂主義，因卦辭同時要求貞正並預備涉險。',
  },
  'yi-jing_ch-6_p-1': {
    translation: '訟卦：爭訟，雖有誠信，仍受到阻塞，必須戒懼警惕；爭到中途能停止則吉，堅持爭到底則凶。適宜求見公正有德的大人，不宜冒險渡過大河。\n《大象傳》說：天向上、水向下，運行方向相違，是訟卦的形象；君子由此懂得做事之初便先謀畫周全。',
    analysis: '「窒惕」是受阻而警惕；「中吉、終凶」把止訟置於逞訟之上，即使自認有理，也不宜把衝突推到極端。「利見大人」可理解為尋求有公信力的裁斷者，「不利涉大川」說爭端未解時不宜再冒重大風險。天水相背象徵分歧，《大象》把防訟落在「作事謀始」：契約、權責與程序應在開端釐清。原資料誤作現代詞「做事」，已校回經傳通行本「作事」。',
  },
  'yi-jing_ch-7_p-1': {
    translation: '師卦：用兵治眾必須守正，由德高望重、經驗成熟的人統率才吉祥，沒有災咎。\n《大象傳》說：地下蓄有水，是師卦的形象；君子由此包容百姓、蓄養眾人。',
    analysis: '「師」指軍隊或眾人。「貞」先限定出師與治眾須合正道；「丈人」不是一般年長男子，而是足以服眾的成熟統帥，王弼、孔穎達系統多從尊嚴、老成解釋。卦辭並非歌頌戰爭，而是為動眾設下正當性與領導條件。《大象》由地中容水推到「容民畜眾」，把軍隊的根基放在容納、養育人民。',
  },
  'yi-jing_ch-8_p-1': {
    translation: '比卦：親近聯合，吉祥。應推原審察占問，具備根本、長久而正固的條件，才沒有災咎。不安定的各方正前來歸附；遲疑而最後才來的人有凶險。\n《大象傳》說：地面上有水彼此親附，是比卦的形象；先王由此建立眾國，親近諸侯。',
    analysis: '「比」是親附、結盟。「原筮」有推原、再加審察等解釋，重點是結盟前考察其根本；「元永貞」要求初衷、長久與正固，不能只見眼前利益。「不寧方來」說不安者來求歸附，「後夫凶」警告遲疑失時者。《大象》反映封建建國、親侯的古代政治秩序；現代可理解其合作與及時建立信任的結構，不必照搬其制度。',
  },
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(")([\\s\\S]*?)("\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const passage = items.find((x) => x.id === 'yi-jing_ch-6_p-1');
  if (!passage?.canonicalText.includes('君子以做事謀始')) throw new Error('Hexagram 6 passage anchor missing');
  passage.canonicalText = passage.canonicalText.replace('君子以做事謀始', '君子以作事謀始');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((x) => x.passageId === 'yi-jing_ch-6_p-1' && x.canonicalText.includes('君子以做事謀始'));
  if (!sentence) throw new Error('Hexagram 6 sentence anchor missing');
  sentence.canonicalText = sentence.canonicalText.replace('君子以做事謀始', '君子以作事謀始');
  sentence.chunks.forEach((chunk) => { chunk.text = chunk.text.replace('君子以做事謀始', '君子以作事謀始'); });
});
fs.writeFileSync(worksFile, worksSource, 'utf8');

const aidFile = 'src/data/readingAid.ts';
let aid = fs.readFileSync(aidFile, 'utf8');
const pattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let changed = 0;
aid = aid.replace(pattern, (whole, id) => {
  const item = corrections[id];
  if (!item) return whole;
  changed += 1;
  return `'${id}': {\n    translation: ${JSON.stringify(item.translation)},\n    analysis: ${JSON.stringify(item.analysis)}\n  }`;
});
if (changed !== 8) throw new Error(`Expected 8 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/book-of-changes/zh',
  'https://zh.wikisource.org/wiki/周易正義',
  'https://moodle3.ntnu.edu.tw/pluginfile.php/1419601/mod_resource/content/1/周易正義.pdf',
  'https://upload.wikimedia.org/wikipedia/commons/e/e9/SSID-12101138_周易註疏_卷3.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Yijing hexagrams 1-8.');
