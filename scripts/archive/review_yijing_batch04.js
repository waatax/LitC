import fs from 'fs';

const corrections = {
  'yi-jing_ch-25_p-1': {
    translation: '無妄卦：不妄為，能大為亨通，適宜守正。若行為不正便會有災患，不適宜有所前往。\n《大象傳》說：雷在天下運行，萬物都依天時自然生長而不妄，是無妄卦的形象；先王由此勉力配合時令，養育萬物。',
    analysis: '無妄可理解為不虛妄、不妄作，也有出乎意料的語義層次；卦辭以「匪正有眚」明確說不妄仍以正為準，不是想到什麼便自然流露。「眚」是災患或過失。「天下雷行」使萬物隨時而動，「茂對時」的茂有盛、勉力義，對是應合。《大象》重依時養物，不是宣稱一切意外都有道德原因；爻辭所謂無妄之災正承認無過也可能遭災。',
  },
  'yi-jing_ch-26_p-1': {
    translation: '大畜卦：大量蓄積，適宜守正；不只在家中自食，而能出仕服務公眾，便吉祥；也適宜渡過大河般的艱險。\n《大象傳》說：天彷彿蓄藏在山中，是大畜卦的形象；君子由此廣泛記取前人的言論和既往行為，用來積蓄自己的德行。',
    analysis: '大畜兼指大有蓄積與以艮止乾、蓄養剛健。「不家食」注疏多解為賢者不在家自食，而受國家祿養、服務天下；它不是否定家庭飲食。「多識」的識讀作記識，前言往行是歷史言行。學古不是堆積名句，而要「畜其德」，把經驗化為人格與能力。蓄積到能涉大川，說明大畜不是把資源封存不用，而是為承擔大事作準備。',
  },
  'yi-jing_ch-27_p-1': {
    translation: '頤卦：頤養，守正則吉。要觀察一個人如何養人養己，也要看他自己尋求什麼來充實口腹。\n《大象傳》說：山下有雷，萬物受震而萌生，是頤卦的形象；君子由此謹慎言語，節制飲食。',
    analysis: '「頤」本指下頷，引申為飲食與養育。「觀頤」可觀其所養，「自求口實」可觀其自養與所求；卦義因此同時問來源、方式與內容是否正當。《大象》把口的兩種出入並列：言語由口出，飲食由口入，均須節制。節飲食不是提供特定醫療或減重方案，而是倫理性的適量提醒；慎言也不是沉默，而是注意言語會滋養或傷害他人。',
  },
  'yi-jing_ch-28_p-1': {
    translation: '大過卦：承重的屋梁已經彎曲；此時適宜有所前往、採取非常行動，才能亨通。\n《大象傳》說：澤水淹沒樹木，是大過卦的形象；君子由此在眾人之外獨立而不恐懼，退隱世外也不感到苦悶。',
    analysis: '「大過」指大的超常或負荷過重；「棟橈」是屋梁受壓彎曲，表示常規結構已不足支撐局勢。卦辭仍說利往而亨，重點是危局需要相稱的非常擔當，不是任性越界。「澤滅木」是水高過木，環境失常；《大象》提出進可獨立不懼、退可遯世無悶。兩者都以內在價值不被群體贊否支配為本。',
  },
  'yi-jing_ch-29_p-1': {
    translation: '習坎卦：重重險陷之中，內心仍有誠信，唯有心志亨通；實際前行便有值得崇尚之處。\n《大象傳》說：水接連不斷地流來，是重坎卦的形象；君子由此使德行保持常久，並反覆熟習教化之事。',
    analysis: '坎既象水，也象坑陷與危險；「習坎」是坎上加坎，危險重複。原譯把「尚」留成「注重／崇尚」候選詞，已改為完整句意。「有孚、維心亨」說外境未必立即脫險，但內在誠信不可失；「行有尚」仍要求在險中實行。《大象》以水洊至、流而不止，轉為德行與教事的反覆練習，不是美化苦難本身。',
  },
  'yi-jing_ch-30_p-1': {
    translation: '離卦：附麗光明，適宜守正，因而亨通；畜養母牛般柔順的品性，吉祥。\n《大象傳》說：兩重光明相繼升起，是離卦的形象；大人由此使光明延續，照耀四方。',
    analysis: '離有附著與光明兩義，卦象為火；火必有所附才能燃燒，因此光明也須依正道而存。「畜牝牛」借母牛柔順說涵養順德，不是字面畜牧建議。離為重卦，故「明兩作」指兩明相繼而起；「繼明」強調明德需要制度與世代延續。歷史文本以柔順配陰性，現代不應將此推成對女性性格的固定要求。',
  },
  'yi-jing_ch-31_p-1': {
    translation: '咸卦：彼此感應，可以亨通，適宜守正；依古代婚禮語境，娶妻吉祥。\n《大象傳》說：山上有澤，山虛而能容納澤氣，是咸卦的形象；君子由此虛心接納別人。',
    analysis: '咸是普遍感應，《彖傳》又以少男少女相感說婚姻；感應要「利貞」，不能把欲望或操控叫作相感。「取女」的取通娶，反映以男性為敘述主體的古代婚姻制度，現代宜轉取雙方自願、正當互感，不可據以支持性別不平等。《大象》由山體中虛能受澤，說「虛受人」：先留出自我空間，才可能真正聽見他人。',
  },
  'yi-jing_ch-32_p-1': {
    translation: '恆卦：持久，可以亨通而沒有災咎，適宜守正，也適宜有所前往。\n《大象傳》說：雷與風相互助勢、運行不息，是恆卦的形象；君子由此確立自己的正當方向，不輕易改變。',
    analysis: '恆是持久，但卦辭同時說「利有攸往」，所以恆不是靜止不動，而是在變動中保持正當原則。震雷與巽風相與，皆是運動之物，持續來自有規律的更新。「立不易方」的方是方向、常道；不易方並非拒絕修正方法，而是不因短期誘惑失去根本方向。若所守不正，單純堅持也不成德，故先以「利貞」限定。',
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
console.log('Completed Yijing hexagrams 25-32.');
