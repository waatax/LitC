import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-44': {
    translation: '老子說：得到萬人的軍隊，不如聽到一句切合事理的話；得到隨侯之珠，不如掌握事情發生的原因；得到和氏璧，不如明白事情應當走向何處。天下即使廣大，喜歡動用武力的也會滅亡；國家即使安定，好戰也會陷入危險。所以《道德經》說：「使國家小、人民少，即使有各種器械也不輕易使用。」',
    analysis: '【主旨】本段以軍隊、名珠、寶璧逐一讓位於當言、事由、所適，主張理解因果與方向比資源和武力更能保國。\n【關鍵詞義】「一言之當」是切中事理的建言；隨侯珠、和氏璧都是傳說名寶；「所由」是原因，「所適」是應往方向；「阡陌之器」疑為「什伯之器」異文。\n【版本提示】末引《道德經》通行本作「雖有什伯之器而不用」，現本文字作「阡陌」，應列異文，不能直接當作同義定本。'
  },
  'wenzi_ch-3_p-50': {
    translation: '文子請問什麼是聖、什麼是智。老子說：從傳聞與道理便能知道，是聖；親眼看見徵象而知道，是智。聖人聽聞禍福如何萌生，便選擇應走的道路；智者看見禍福已開始成形，便選擇應採取的行動。聖人明白天道的吉凶規律，所以知道禍福從何產生；智者能提早看見徵兆成形，所以知道禍福進入的門戶。能從尚未發生的訊息中預知，是聖；能在徵象剛成形時先見，是智；既不能聞理，也不能見兆，便是愚昧迷惑。',
    analysis: '【主旨】本段區分兩種預見：聖由原理與未發之聞洞察原因，智由初現徵象判斷入口；兩者都優於事成後才反應。\n【關鍵詞義】「聞而知之」不是聽信傳言，而是由所聞之理推知；「成形」是後果已有可見徵兆；「門」是禍福進入、展開的關鍵。\n【思想】此處的「天道吉凶」屬古代規律語言，可理解為由長期因果與早期訊號預判風險，不必神秘化成預言。'
  },
  'wenzi_ch-3_p-51': {
    translation: '老子說：君主若只憑自己所認定的義，便會自信時機、任用己意；手握才智而廣施恩惠。但事物廣博、個人智慧淺有限，想以淺薄智慧周遍供應廣大萬物，從來不可能。只依靠自己的智慧，失誤一定很多。愛炫智慧，會使方法走到窮盡；崇尚勇力，是危亡之道；喜歡隨意給予，會使分配沒有固定標準。上位者的分配若不確定，下民的期待便永無止息。若為了施與而大量聚斂，就與人民結仇；若收取得少、給出得多，財政數量也無法長久維持。所以好作恩賜，反是招來怨恨的道路。由此看來，財物不足以作為治理所依恃，應當依靠道與制度，這一點很明白。',
    analysis: '【主旨】本段批評以個人智慧、勇力與恩賜治國：任意給予會製造無限期待，若以聚斂支應又與民為仇，終究受財政約束。\n【關鍵詞義】「以淺贍博」是以有限個人智力供應廣大事物；「好與」是好作無準則的恩賜；「分」是分配標準；「數無有」指財用數量無法維持。\n【版本提示】首句「君好義則信時而任己」語意不穩，白話依後文獨任其智的批評解作自信己義與時機，仍待異本核定。'
  },
  'wenzi_ch-3_p-54': {
    translation: '文子問：「成就王道的方法有多少種？」老子說：「只有一個根本罷了。」',
    analysis: '【主旨】這是下一段王道論的提問與總綱。「一」不是一條孤立技巧，而是統攝多項政策的共同根本，後文將以守道、謙下、愛民說明。\n【篇章作用】問答極短，功能在轉換章節並先排除把王道拆成多種權術的理解；不可單憑本句填入具體內容。\n【翻譯提示】「有幾」問數量；「一而已矣」直答只有一個，白話保留其刻意簡潔。'
  },
  'wenzi_ch-3_p-56': {
    translation: '老子說：捨棄大道只任用個人智慧，十分危險；拋開規律只使用才幹，必陷困境。因此守住本分、遵循事理，失去時不憂，得到時不喜。事情成功並非刻意造作，所得也非強求；進來時承受而不攫取，出去時授予而不自稱給予；順著春季使萬物生長，順著秋季使萬物凋落。使之生長而不自居恩德，使之凋落也不招怨，便接近道了。文子問：「王者要怎樣才能得到人民歡心？」老子說：像江海那樣就可以。「淡泊而似乎無味，運用卻不會窮盡」，先居小處而後成其大。「想居人民之上，言辭必須對人民謙下；想走在人民之前，身體必須退居人民之後。」天下便會回應他的關愛，增進仁義，而沒有苛刻之氣。「身居上位而人民不感負重，走在前面而眾人不受傷害，天下樂於推戴而不厭棄。」即使遙遠國家、不同風俗，乃至飛蟲爬物，也無不親近；沒有到不了之處，沒有行不通之事，「所以成為天下所尊貴的人。」',
    analysis: '【主旨】本段先以依道循理限制個人智才，再回答得民之道：像江海居下、言下身後，使居上者不成負擔、居前者不造成傷害。\n【關鍵詞義】「數」是事物規律與法度；「有受而無取」是接受自然來者而不攫取；「不德」是不自居恩德；「先小而後大」指先謙下而後成大；「既」是盡。\n【思想與篇章】王道之「一」在此落實為守道不任己、謙下而愛民，不是單一行政措施。蜎飛蠕動是古代誇飾普遍感化的語句，不宜當作字面政治成效。'
  }
};

const file = 'src/data/readingAid.ts';
let source = fs.readFileSync(file, 'utf8');
const entryPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let replaced = 0;
source = source.replace(entryPattern, (whole, id) => {
  const correction = corrections[id];
  if (!correction) return whole;
  replaced += 1;
  return `'${id}': {\n    translation: ${JSON.stringify(correction.translation)},\n    analysis: ${JSON.stringify(correction.analysis)}\n  }`;
});
if (replaced !== Object.keys(corrections).length) throw new Error(`Expected ${Object.keys(corrections).length}, replaced ${replaced}.`);
fs.writeFileSync(file, source, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate review: ${passageId}`);
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: ['https://ctext.org/wenzi/jiu-shou/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
