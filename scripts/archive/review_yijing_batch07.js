import fs from 'fs';

const corrections = {
  'yi-jing_ch-49_p-1': {
    translation: '革卦：變革，要到了適當時日、改革已有成效之後，才會取得信任；能大為亨通而適宜守正，悔恨便會消失。\n《大象傳》說：澤水之中有火，兩者相克而必須變革，是革卦的形象；君子由此整治曆法，明確四時節序。',
    analysis: '革本指獸皮去毛，引申為改變制度。「巳日乃孚」有己、已、巳多種傳本：可解作己日、變革已成之日，或待時而後取信；共同要點是人未能在改革之初立即信服，須時機正當且見到結果。「元亨利貞」把大變革限定於正道，不是凡推翻舊制皆善。《大象》以水火相息比變，治曆明時則說改革的正當性首先來自準確辨識時序。',
  },
  'yi-jing_ch-50_p-1': {
    translation: '鼎卦：鼎象徵更新與養賢，大吉而亨通。\n《大象傳》說：木柴上燃著火，用來烹煮鼎中之物，是鼎卦的形象；君子由此端正自己的職位，使所受使命穩固成就。',
    analysis: '鼎既是烹飪祭祀重器，也象徵政權名位；革去故，鼎取新，兩卦相承。「木上有火」呈現以巽木生離火、熟物養人的過程。正位不是只占據名位，而是使德才、責任與位置相稱；「凝命」是使使命凝定、鞏固。鼎卦所謂元吉因此不是器物神力，而是更新之後建立可持續秩序、養育人才與承擔職分。',
  },
  'yi-jing_ch-51_p-1': {
    translation: '震卦：震動可以亨通。雷震初來時令人恐懼戒慎；因戒慎而後，便能恢復從容，談笑自如。雷聲震驚百里，主祭者仍不失落祭祀用的匕匙和鬯酒。\n《大象傳》說：雷聲接連而至，是震卦的形象；君子由此心存敬畏，修正反省自己。',
    analysis: '「虩虩」是恐懼不安貌，「啞啞」在此是笑語和適的聲音；先懼後安，說適度警覺能使人不亂。「匕」是取鼎中祭品的器具，「鬯」是祭祀香酒；不喪匕鬯表示突發巨震中仍守住宗廟職責，而非毫無恐懼。《大象》「恐懼修省」不是長期焦慮，而是把外在警訊轉成檢查準備、程序與德行。',
  },
  'yi-jing_ch-52_p-1': {
    translation: '艮卦：止息。使背部安止，不再感到自我身體的躁動；走在庭院中，也不因追逐他人而分心，便沒有災咎。\n《大象傳》說：兩座山重疊，各止其所，是艮卦的形象；君子由此使思慮不越出自己當下的職分。',
    analysis: '艮是止，背是身體中不易自見、較少隨欲而動之處。「不獲其身、不見其人」歷來解釋不一，王弼注重忘身忘人、止於所當止，不宜直譯成身體或他人真的消失。兼山象徵各有止界。「思不出其位」是先盡當下職責、避免越位妄動；現代不能用它壓制跨角色思考、公共批評或舉報不義，正當職分本身也須受倫理檢驗。',
  },
  'yi-jing_ch-53_p-1': {
    translation: '漸卦：循序漸進；依古代婚禮，女子按禮出嫁則吉，適宜守正。\n《大象傳》說：樹木生長在山上，逐步高大，是漸卦的形象；君子由此安居於賢善德行，改善社會風俗。',
    analysis: '漸是逐步前進，山上木長不能一蹴而就。「女歸吉」借古代婚嫁須依納采等禮序說程序完備；它反映女性出嫁的父系敘述，現代應取關係建立須自願、循序、守正，不應據以限制女性角色。「居賢德」是使自身安住於賢德，「善俗」是逐步改善風俗；改變社會同樣靠長期示範，不靠一次口號。',
  },
  'yi-jing_ch-54_p-1': {
    translation: '歸妹卦：少女出嫁，名分與時序不正；貿然前進有凶險，沒有什麼利益。\n《大象傳》說：澤上有雷，喜悅隨震動而急進，是歸妹卦的形象；君子由此著眼關係如何長久善終，預先看見可能敗壞之處。',
    analysis: '「歸妹」在古代指嫁出少女或妹妹，傳統以長男配少女、情動而禮序未備說征凶。它呈現父系婚姻名分，不能直接用來評判現代女性、年齡差或婚姻價值；較可取的是重大關係若只憑一時情感、缺乏正當程序與長期安排，難有善終。「永終知敝」不是悲觀看衰，而是在開始時就檢查長期風險。',
  },
  'yi-jing_ch-55_p-1': {
    translation: '豐卦：盛大豐滿，可以亨通，君王能達到這種盛況；不必憂慮，但應像正午太陽那樣使光明普照。\n《大象傳》說：雷與電同時到來，威嚴與明察兼備，是豐卦的形象；君子由此審斷訴訟，恰當施行刑罰。',
    analysis: '豐是盛大。「王假之」的假讀格、至，指王者達到豐盛；「宜日中」以日居中天象徵照臨周遍，也暗含日中將昃、盛極須戒。雷有威，電能明，《大象》因而配折獄致刑：先明察裁判，再使刑罰到位。這是古代司法理想，現代必須加入證據、辯護、比例與禁止殘酷刑罰等程序保障，不能以威明取代法治。',
  },
  'yi-jing_ch-56_p-1': {
    translation: '旅卦：羈旅在外，只能小有亨通；旅途中守正則吉。\n《大象傳》說：火在山上燃燒，移動而不久留，是旅卦的形象；君子由此明察而審慎地用刑，不使案件長久滯留監獄。',
    analysis: '旅是寄居在外，缺乏穩固支持，所以只可「小亨」，更須守貞。山上之火逐草而行，不定一處，與旅人相似。《大象》從火的明與不留，提出「明慎用刑而不留獄」：查明案情、謹慎裁判並避免久押不決。這一點具有明確的程序正義價值；「不留獄」不是倉促定罪，而是反對行政拖延與無期限拘禁。',
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
  'https://ejournal.upsi.edu.my/index.php/ERUDITE/article/download/4435/2643/15820',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Yijing hexagrams 49-56.');
