import fs from 'fs';

const corrections = {
  'yi-jing_ch-9_p-1': {
    translation: '小畜卦：小有蓄積，可以亨通。濃雲密布卻還沒有下雨，雲氣從我所在的西郊升起。\n《大象傳》說：風行於天空之上，是小畜卦的形象；君子由此修美自己的文章與德行。',
    analysis: '「畜」兼有蓄積與畜止之義；一陰畜五陽，力量尚小，所以只能「小畜」。「密雲不雨」表示條件已有積累，但恩澤或成果尚未落實；《彖傳》說「施未行也」。西郊在傳統象數中與陰方相關，也有聯繫周地的解釋，不宜定成唯一史事。《大象》以風在天上、未能廣施於地，轉為先修飾文德；「懿」是美，不是只求外表文采。',
  },
  'yi-jing_ch-10_p-1': {
    translation: '履卦：行走時踏到老虎尾巴，老虎卻沒有咬人，事情得以亨通。\n《大象傳》說：天在上、澤在下，是履卦的形象；君子由此辨明上下名分，使人民心志安定。',
    analysis: '「履」既是踐踏，也引申為履行禮法。踏虎尾而不被咬，是身處危險卻能以謹慎合禮免禍的形象；「咥」指咬。亨通並非保證冒險無害，恰恰以戒慎為前提。《大象》由天上澤下推演秩序與名分，反映古代等級政治；現代閱讀宜取權責清楚與行為有界，不應拿「辨上下」合理化人格不平等。',
  },
  'yi-jing_ch-11_p-1': {
    translation: '泰卦：閉小陰柔者退去，開大陽剛者到來，吉祥而亨通。\n《大象傳》說：天地之氣相交，是泰卦的形象；君主由此裁節成全天地運行之道，輔助天地適宜之事，用來扶助人民。',
    analysis: '泰是通泰。坤上乾下，陰陽二氣相交；「小往大來」在卦爻結構中指陰退陽來，後世也常引申為小人退、君子進。《大象》的「後」指君主，「財成」通「裁成」，是因時裁節以成其功；「輔相」是協助，「左右」是扶助。它不是以人力征服自然，而是在理解時宜後補助天地化育，使人民得利。',
  },
  'yi-jing_ch-12_p-1': {
    translation: '否卦：閉塞而不合人道，不利於君子伸行正道；大的陽剛者退去，小的陰柔者到來。\n《大象傳》說：天地之氣不能相交，是否卦的形象；君子由此收斂德才以避開禍難，不可用俸祿榮華來顯耀自己。',
    analysis: '「否」讀作閉塞之否，與泰相反；乾上坤下，二氣背離。「否之匪人」歷來多解為不合人的常道；「不利君子貞」不是說正直有錯，而是閉塞時正道難伸，須懂得退藏。《大象》「儉德辟難」的儉是收斂不露，辟通避；「不可榮以祿」告誡不以祿位自榮。這是亂世保全正道的權宜，不是永久退出公共責任。',
  },
  'yi-jing_ch-13_p-1': {
    translation: '同人卦：與人在郊野公開會同，可以亨通；適宜渡過大河般的艱險，也適宜君子守正。\n《大象傳》說：天與火同向上升，是同人卦的形象；君子由此辨別族類、分清萬物。',
    analysis: '「同人於野」以空曠公共之地象徵結合不出於私黨，故能亨通並共同涉險。「利君子貞」又限制結盟須正，不是人多便有理。《大象》一面說同人，一面說「類族辨物」：真正合作不等於取消差異，而是在辨清性質、角色後求同。族在古義可指事物類屬；現代不可把這句移作血緣、族群歧視的依據。',
  },
  'yi-jing_ch-14_p-1': {
    translation: '大有卦：大有收穫，大為亨通。\n《大象傳》說：火高在天上，光明普照，是大有卦的形象；君子由此遏止惡行、彰揚善行，順承上天美善的使命。',
    analysis: '「大有」是所有豐盛、人才與資源會聚；離火在乾天之上，取光明普照之象。擁有越多，越須處理其公共後果，因此《大象》不談享受財富，而談「遏惡揚善」。「休命」的休是美善，不是休止命令；順天休命在傳統語境指順承美命。可取為資源伴隨責任，但不宜把財富本身當成天命或道德優越的證明。',
  },
  'yi-jing_ch-15_p-1': {
    translation: '謙卦：謙遜可以亨通，君子能把事情善始善終。\n《大象傳》說：高山藏在大地之中，是謙卦的形象；君子由此減取過多、增益不足，衡量事物，使施予公平。',
    analysis: '山本高而居地下，形成有實而不自高的謙象；所以謙不是自我貶低或假裝無能。「君子有終」說謙德能長久完成事業，不只開頭退讓。《大象》中「裒」有聚取、減取義，與「益寡」相對；「稱物」是衡量實情，「平施」是公平施予。其公平不是人人機械相同，而是調節過與不及，使分配較為平衡。',
  },
  'yi-jing_ch-16_p-1': {
    translation: '豫卦：和樂而有準備，適宜建立諸侯、出動軍隊。\n《大象傳》說：雷聲振出地面，是豫卦的形象；先王由此製作音樂、崇揚德業，隆重祭獻上帝，並以祖先配享。',
    analysis: '豫兼有喜悅、安樂與預備之義。卦辭「利建侯、行師」屬古代建國用兵語境：眾心和悅、組織有備，才可能動眾；不等於鼓勵擴張戰爭。雷出地奮象徵陽氣發動，故《大象》聯想到禮樂振作人心。「殷薦」是盛大祭獻，「祖考」是已故祖先；這段記錄先王祭祀制度，現代解析應說明其歷史文化，而非把特定祭制當普遍義務。',
  },
};

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
  'https://zh.wikisource.org/wiki/周易/大象',
  'https://moodle3.ntnu.edu.tw/pluginfile.php/1419601/mod_resource/content/1/周易正義.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Yijing hexagrams 9-16.');
