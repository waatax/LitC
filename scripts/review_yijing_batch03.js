import fs from 'fs';

const corrections = {
  'yi-jing_ch-17_p-1': {
    translation: '隨卦：順隨，創始而亨通，適宜守正，便沒有災咎。\n《大象傳》說：雷潛藏在澤水之中，是隨卦的形象；君子由此在天色向晚時進入室內，安然休息。',
    analysis: '隨不是盲從，而是因時順勢；「利貞」明定所隨仍須正當，否則不能免咎。震雷在兌澤之下，古人取雷到秋冬潛藏、隨時休息之象。「嚮晦」是接近昏暗，「宴息」是安息。《大象》把隨時落在日作夜息的節律：該行則行、該止則止。它肯定休息是順應時宜的一部分，不把無止境活動等同進德。',
  },
  'yi-jing_ch-18_p-1': {
    translation: '蠱卦：整治積弊，可以大為亨通，適宜渡過大河般的艱險。事情開始前的三日便須推究成因，完成後的三日仍須檢查善後。\n《大象傳》說：山下有風，風受阻而擾動，是蠱卦的形象；君子由此振作人民、培育德行。',
    analysis: '蠱的古義可指器中腐敗生蟲，引申為敗壞、積弊與需要整治之事，不只後世所謂巫蠱。「先甲三日，後甲三日」以干日表示改革前後都須用心；《彖傳》釋為「終則有始」，注疏常說前察所以然、後慮將然。確切干支算法歷來有不同說法，白話取其共同的準備與善後義。「振民育德」指出治蠱不止除弊，也須重建人的能力與德性。',
  },
  'yi-jing_ch-19_p-1': {
    translation: '臨卦：接近並治理，可以大為亨通，適宜守正；但到了陰勢轉盛的八月，將有凶險。\n《大象傳》說：大地臨在澤水之上，是臨卦的形象；君子由此教導思慮永不窮盡，包容保護人民沒有界限。',
    analysis: '臨有居上接近、監臨治理之義。卦中陽氣增長而亨，但「至於八月有凶」預告盛勢會反轉；王弼、孔穎達系統多以陽長至遯、陰消陽解釋月序。它不是說每年農曆八月必凶，而是以卦氣提示治盛須防衰。《大象》的「教思」指教化之思，「容保」是包容保育；領導的臨近不只是監視，更包含長期教育與照護。',
  },
  'yi-jing_ch-20_p-1': {
    translation: '觀卦：祭祀時已洗手淨身，尚未進獻祭品，內心誠信而神情莊敬。\n《大象傳》說：風行於大地之上，遍及各處，是觀卦的形象；先王由此巡察四方，觀察民情，設立合宜的教化。',
    analysis: '「盥而不薦」截取祭禮中洗手後、獻祭前最專一肅敬的時刻；「顒若」是仰敬莊重的樣子。重點不在祭品尚未送上，而在可觀的誠敬先於外在儀式。觀兼「觀看」與「被觀看」：上位者巡方觀民，其德行也成為人民所觀。《大象》反映先王巡狩教化制度；現代可取先調查民情再施政，不宜化為單向灌輸。',
  },
  'yi-jing_ch-21_p-1': {
    translation: '噬嗑卦：咬開阻隔，使上下相合，可以亨通；適宜審理刑獄。\n《大象傳》說：雷聲震動、電光照明，是噬嗑卦的形象；先王由此彰明刑罰、整飭法令。',
    analysis: '噬是咬，嗑是合；口中有物阻隔，須咬斷後才能合，引申為清除妨礙秩序的案件。「利用獄」是古代司法語境，不是說刑罰越重越好。雷象威懾，電象明察，故「明罰敕法」同時要求規則清楚與執行有威。現代法治閱讀尤其應補上正當程序、證據與比例原則，不能用卦象替代司法判斷。',
  },
  'yi-jing_ch-22_p-1': {
    translation: '賁卦：文飾可以使事亨通，對小事有所前往略為有利。\n《大象傳》說：山下有火，照亮山中文物，是賁卦的形象；君子由此明察各項政務，卻不敢只憑表象輕率判決刑獄。',
    analysis: '「賁」是文飾、裝飾。文采能使質實顯明，所以可亨；但它只是輔助，故僅「小利有攸往」，不能以形式取代實質。山下火光能照近而不能照遠，《大象》因此一正一反：可用來明庶政，不足以斷大獄。「折獄」是判決訴訟。此段很清楚地限制視覺與修辭的證據力，反對因外表漂亮便作重大裁斷。',
  },
  'yi-jing_ch-23_p-1': {
    translation: '剝卦：剝落衰敗，不適宜有所前往。\n《大象傳》說：高山附著於地而根基正在剝落，是剝卦的形象；居上位者由此厚待下民、鞏固根基，使居處安定。',
    analysis: '剝是侵蝕剝落；五陰消陽，局勢不利進取，所以卦辭只說「不利有攸往」。《大象》見山須依地而立，提出「厚下安宅」：上位者若要自身與政權安定，必先厚實下層基礎。原白話「厚下哪裡宅」是機械替換錯誤，已完整重譯。「安宅」既可指安定居所，也可喻安定國家；核心不是固守權位，而是下層不薄，上層才不崩。',
  },
  'yi-jing_ch-24_p-1': {
    translation: '復卦：陽氣回復，可以亨通。出入往來沒有疾病阻礙，同道朋友前來也沒有災咎。陰陽依其道路反覆運行，經過七個變化階段陽氣便返回；適宜有所前往。\n《大象傳》說：雷潛藏在地下，是復卦的形象；先王由此在冬至日關閉關卡，使商旅暫停行走，君主也不巡察四方。',
    analysis: '復是返回，剝極後一陽生，象徵生機回轉。「七日來復」注疏多從姤、遯、否、觀、剝、坤到復的七次變化，或從陰陽消息周期解釋，不宜僵讀為所有事情恰好七個曆日。「朋來」可指同類陽爻或同道相助。冬至閉關、不行、不省方反映古代順養初陽的節令制度；哲學重點是新生力量初回時先保養，不急於耗用。',
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
console.log('Completed Yijing hexagrams 17-24.');
