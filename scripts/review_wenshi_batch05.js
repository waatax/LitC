import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-3_p-13': {
    translation: '關尹子說：「像鐘之所以成為鐘，又像鐘與鼓相互發聲，聖人的言語也是如此；像車之所以成為車，又像車與船各依其用，聖人的行動也是如此。正因沒有名稱能完全限定它，所以能使天下所有言說退讓；正因沒有知識能完全窮盡它，所以能消解天下自恃的智巧。」',
    analysis: '「如鐘鐘然、如車車然」是以名物自成其用的重疊語法，後接鐘鼓、車舟，表示同類又因應不同。聖人言行呈現具體作用，卻沒有一個名稱或知識框架能占有其根本。「退言」「奪智」不是壓制他人發言思考，而是使自以為終極的語言與智識承認界限。句式古奧，傳本標點仍待深入校定。'
  },
  'wenshi-zhenjing_ch-3_p-14': {
    translation: '關尹子說：「蝍蛆能吃蛇，蛇能吃青蛙，青蛙又能吃蝍蛆，三者互相吞食。聖人的言說也是如此：先指出執著『有』或『無』的弊病，又指出執著『非有非無』的弊病，再指出連排除『非有非無』也會成為弊病；一句破一句，像來回拉鋸。真正善於領會聖人之道的人，不會把任何一句話永久保留下來執著。」',
    analysis: '食物循環比喻命題相互破除：有無對立被非有非無解除，後者又須被解除，連「解除」也不能成為最後教條。拉鋸不是論述自相矛盾，而是針對不同執著施藥；離開病情保存藥方，便形成新病。「哇」是「蛙」的資料轉寫錯誤，已據《言外經旨》及多種正文改正；蝍蛆的物種與整組傳說則屬古代博物知識，不必以現代食性為其哲理背書。'
  },
  'wenshi-zhenjing_ch-3_p-15': {
    translation: '關尹子說：「龍、蛟，以及蛇、龜、魚、蛤等各類水族的變化，龍都能兼具；蛟卻只成其為蛟，既不能成龍，也不能變為蛇、龜、魚或蛤。聖人像龍般能兼應萬類，賢人則像蛟般只成就一類。」',
    analysis: '龍在古代想像中能大能小、升潛變化，因此象徵不被單一能力限定；蛟雖強，仍只是蛟。聖賢差別不在神獸等級，而在通變範圍：賢人有專長和定跡，聖人能因物呈現多種作用。這種理想不應被誤讀成個人全能，更不能拿來否定專業分工。'
  },
  'wenshi-zhenjing_ch-3_p-16': {
    translation: '關尹子說：「內在不固守一個位置，外物的形態便自然顯著；行動時像水般流通，安靜時像鏡般澄明，回應時像回聲般隨感而發。廣遠得彷彿不存在，寂靜得彷彿清澈。與萬物相同相通便和諧，若想占有所得反而失去。從不搶在別人之前，總是隨著別人的實際需要回應。」',
    analysis: '水、鏡、響分別表示無固定形、無私預設、感而後應。「在己無居」使物得以按自身呈現，而非被主體成見扭曲；「得焉者失」又警告一旦占有這種境界便已偏離。「隨人」不是盲從多數，而是不先用私意替他人決定，仍須結合前文因人因事的合宜判斷。'
  },
  'wenshi-zhenjing_ch-3_p-17': {
    translation: '關尹子說：「渾然廣大啊，遨遊在元氣初萌之境！隨時可以像金一樣貴，也可以像玉一樣尊；隨時也可以像糞一樣賤、像土一樣卑。時而高翔於物外，時而追隨萬物；時而如山般高，時而如深淵般下。端正而又權變，狂放而又若愚！」',
    analysis: '連串對偶把聖人從固定形象中解放：貴賤、高下、超越與隨物都依時而現。「時金已」的「已」作語尾，「翔物、逐物、山物、淵物」是把名詞動詞化的奇特文體。端與權、狂與愚並存，不是人格反覆無常，而是外在表現不能由單一德目預測；其內在線索仍是適時利物。'
  },
  'wenshi-zhenjing_ch-3_p-18': {
    translation: '關尹子說：「善於彈琴的人，心中有悲情，琴聲便淒切；有所思念，聲音便舒緩；有所怨恨，聲音便迴旋鬱結；有所愛慕，聲音便徘徊不去。使琴聲呈現悲、思、怨、慕的，不只是手，也不只是竹、絲、桐等材料；情感得之於心，契合於手，再由手契合樂器。真正有道的人，無論所遇都能合於道。」',
    analysis: '音樂不是心、手或材料單獨造成，而是情感—技能—器物的連續配合。「苻」多本作「符」，即相符、契合；原字形暫留待校。末句「莫不中道」不是所有行為自然正確，而是有道者能使內在理解透過熟練的手與適當媒介呈現，呼應本篇體用不二。'
  },
  'wenshi-zhenjing_ch-3_p-19': {
    translation: '關尹子說：「聖人有言語、有行動、有思考，這是與一般人相同之處；但其根本不固著於言語、造作和思慮，這是與一般人不同之處。」',
    analysis: '「有」與「未嘗」同時成立：聖人並非木石般不說不做不想，而是發用之後不留下自我占有。差異在關係而不在功能，有言而不被言拘，有為而不以為功，有思而不把思當本體。這也防止用沉默、消極或反智表演冒充無為。'
  },
  'wenshi-zhenjing_ch-3_p-20': {
    translation: '關尹子說：「計較利害的心越分明，親人越難和睦；分別賢愚的心越尖銳，朋友越難交往；爭辨是非的心越執著，事情越難完成；挑剔美醜的心越強，越難與事物契合。因此聖人使這些分別渾融而不僵化。」',
    analysis: '問題不在辨識本身，而在「愈明」到只剩單一尺度：親情全按利益、友誼全按能力、合作全按立場、接物全按好惡，關係便被分類摧毀。「渾之」不是混淆是非，而是把局部判準放回更完整情境。現代應用仍需保留倫理界線，不能用和諧之名掩蓋傷害。'
  },
  'wenshi-zhenjing_ch-3_p-21': {
    translation: '關尹子說：「世間愚鈍笨拙的人，常妄自援引聖人表現得愚拙來替自己開脫；殊不知聖人有時若愚、有時明察，有時示拙、有時運巧。」',
    analysis: '本段直接阻止模仿外跡：聖人之愚拙是適時選擇，不是能力不足，更不是拒絕改善的藉口。只摘取「大智若愚」替自身怠惰辯護，正是徇跡忘道。判準在能否隨情境明愚巧拙，而不在固定扮演某一面貌。'
  },
  'wenshi-zhenjing_ch-3_p-22': {
    translation: '關尹子說：「只拿聖人的外在形跡去學聖人的，是賢人；能從賢人的有限形跡反求聖人根本的，才是聖人。因為以聖人形跡為師，只會追逐形跡而忘記道；以賢人為師而反觀形跡的來源，反而能契合道。」',
    analysis: '句面故意顛倒常識：「以聖師聖」若指複製聖跡，層次反低；「以賢師聖」則由有限表現逆推無形根本。重點不是貶低聖人或抬高賢人，而是學習方式：權威越高，越容易讓人照抄；材料越有限，反而迫使人理解生成原理。這與前章反對援引愚拙自解相連。'
  },
  'wenshi-zhenjing_ch-3_p-23': {
    translation: '關尹子說：「賢人一味趨向高處，往往看不見低處；一般人一味趨向低處，往往看不見高處。聖人能貫通上下，只按情勢選擇合宜之處。難道能說在賢人和一般人之外，另有一種隔絕的聖人嗎？」',
    analysis: '上與下可以是境界、身份或處事尺度。賢人偏上、眾人偏下，聖人之所以不同，只在能通兩端而適宜，不是另一物種。這再次拆除聖人神化，也說明通變須理解不同層次；只仰高論或只逐低俗都屬偏見。'
  },
  'wenshi-zhenjing_ch-3_p-24': {
    translation: '關尹子說：「古人觀察天下生物與人倫，認為丈夫倡導、妻子隨從，雄獸奔馳、雌獸追逐，雄鳥鳴叫、雌鳥應和。因此聖人依這些秩序制定言行規範，賢人便拘守這些規範。」',
    analysis: '本段以古代陰陽性別模式解釋禮制來源，帶有明顯父權與二元性別假設，不能當作自然科學或今日倫理的必然法則。「聖人制、賢人拘」本身也含批判：創制者因時取法，後學卻把權宜規範固定化。現代校釋應如實呈現歷史思想，同時明示平等與多元經驗不受這套古代模式限制。'
  },
  'wenshi-zhenjing_ch-3_p-25': {
    translation: '關尹子說：「聖人的道理雖像虎紋變化般燦然多變，實際做事卻像鱉行一樣沉穩緩進；道理雖像亂絲般紛繁，事務安排卻像棋子布列般井然有序。」',
    analysis: '虎變對鱉行、絲紛對棋布，分別形成華麗與遲穩、複雜與有序的反差。理解可以宏闊多變，執行仍須踏實有次序；反過來，行動緩慢也不代表思想貧乏。這一段適合校正把玄談當成實務、或把忙亂當成深刻的兩種錯誤。'
  },
  'wenshi-zhenjing_ch-3_p-26': {
    translation: '關尹子說：「所謂聖人之道，為何顯得孤立無匹？為何又通透明徹？為何又廣大堂皇？為何又深藏善美？只因它能遍與萬物相配合，卻沒有任何一物能反過來成為它唯一的配偶和限定，所以能尊重並成就萬物。」',
    analysis: '孑孑、徹徹、唐唐、臧臧從孤絕、通透、廣大到善藏，刻畫同一道的多面。「偏偶」多依「遍偶」理解，即周遍配合萬物；無物能偶之，表示不被單一對象對等限制。道之「貴萬物」因能與各物相應而不私屬一物，不是凌駕萬物的特權。字形「偏／遍」仍須底本校勘。'
  },
  'wenshi-zhenjing_ch-3_p-27': {
    translation: '關尹子說：「雲氣的舒卷、鳥類的飛翔，都以虛空為活動條件，所以變化沒有窮盡。聖人之道也是如此。」',
    analysis: '虛空不是空無作用，而是不以固定形狀阻礙雲鳥，因此能容納舒卷飛翔。聖人內在不居一形，才有前文金玉糞土、明愚巧拙的多樣變化。全篇以此收束：通變的根據不是掌握更多固定形態，而是保留不被形態占滿的空間。'
  }
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(\")([\\s\\S]*?)(\"\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const item = items.find((x) => x.id === 'wenshi-zhenjing_ch-3_p-14');
  if (!item || !item.canonicalText.includes('蛇食哇，哇食')) throw new Error('Missing 哇 passage token');
  item.canonicalText = item.canonicalText.replace('蛇食哇，哇食', '蛇食蛙，蛙食');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-3_p-14' && x.canonicalText.includes('蛇食哇，哇食'));
  if (!sentence) throw new Error('Missing 哇 sentence token');
  sentence.canonicalText = sentence.canonicalText.replace('蛇食哇，哇食', '蛇食蛙，蛙食');
  for (const chunk of sentence.chunks) chunk.text = chunk.text.replaceAll('哇', '蛙');
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
if (changed !== 15) throw new Error(`Expected 15, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/san-ji/zh',
  'https://zh.wikisource.org/wiki/文始真經註/3',
  'https://zh.wikisource.org/zh-hant/文始真經言外經旨/文始真經言外經旨卷之三',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf'
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: passageId === 'wenshi-zhenjing_ch-3_p-14' ? 'verified' : 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 3 and corrected 哇 to 蛙.');
