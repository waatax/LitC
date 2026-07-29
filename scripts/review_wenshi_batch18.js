import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-9_p-21': {
    translation: '關尹子說：人若不明白最迫切的要務，反而忙於過多的事、旁枝的事、標奇立異的事，窮困與災厄便會隨之而來。這是因為他全然不明白道無所不在，不能捨棄眼前切身之事，另到別處追求。',
    analysis: '「急務」在注本被解作切身的身心與道德工夫；「多務、他務、奇務」依次是貪多、旁求與好奇炫異。末句「道無不在」否定把道想成遠方的特殊對象：若當下應做之事尚未處理，增加更多項目並不等於精進。本段可讀作優先次序的提醒，不是反對多元知識或專業本身；問題在捨本逐奇，導致精力失焦。',
  },
  'wenshi-zhenjing_ch-9_p-22': {
    translation: '關尹子說：依天下事理，捨棄親近切要的而追逐疏遠的，捨棄根本而追逐末節，捨棄賢明而追隨愚昧，捨棄近處而追逐遠方，偶爾暫行尚可；若長久如此，便會產生禍害。',
    analysis: '親／疏、本／末、賢／愚、近／遠四組對舉，核心是不要長期顛倒優先次序。「可暫而已」承認特殊情勢下可能暫取疏末遠者，因此不是僵硬禁止；危險在權宜變成常態。注本作「久則生害」，另本作「久則害生」，現底本採後者，兩者語義相同。原資料異體「踈」依通行字形整理為「疏」。',
  },
  'wenshi-zhenjing_ch-9_p-23': {
    translation: '關尹子說：從前談論道的人，有的形容它凝定寂靜，有的說它幽邃深遠，有的說它澄明通透，有的說它空曠混同，有的說它晦暗幽冥。遇到這些說法，切勿因覺得玄奧而害怕退縮。天下最高的道理，終究不是語言與意念所能完全涵蓋；若知道它超越語言意念，也超越那些精微言辭與高妙意思，才算契合我的說法。',
    analysis: '凝寂、邃深、澄徹、空同、晦冥都是古人描寫道的術語，作者先防止學者被玄奧名相嚇退，再進一步指出至理「非言意」。所謂「在彼微言妙意之上」不是另有更華麗的玄談，而是連精妙解釋也不能等同於道。這並非否定語言的溝通價值，而是區分指引與親身理解：文字可引路，不能替代實踐與體悟。',
  },
  'wenshi-zhenjing_ch-9_p-24': {
    translation: '關尹子說：聖人宏大的言論好比珍貴的金玉，平易細小的言論好比桔梗、車前草一類普通藥草。若使用得當，普通藥草也能救人；若使用不當，即使金玉般珍貴的言論也可能害人。',
    analysis: '「大言金玉，小言桔梗芣苢」以價值昂貴與藥材平常作對比，結論不在尊大貶小，而在「用之當」。芣苢一般釋為車前草，傳統本草視桔梗、芣苢為藥材；本段只借藥效作譬喻，不構成現代醫療建議，也不保證草藥安全有效。言論是否有益取決於情境與運用，平實之言可救偏，最高明的經句若被誤用也會傷人。',
  },
  'wenshi-zhenjing_ch-9_p-25': {
    translation: '關尹子說：談論某件事時，甲說有利，乙說有害，丙說有時有利、有時有害，丁說利與害同時存在；依這套分類，判斷總會落在其中一種。至於真正通曉道的人，卻不把道限定在這類利害言說裡。',
    analysis: '甲乙丙丁排列純利、純害、或利或害、利害並存四種判斷，展示具體事件可以落入相對利害的論域。「喻道者不言」不是永遠沉默，而是不以談事的分類框架界定道。四分法是作者為說理設計的概括，不必視為現代邏輯上窮盡一切可能；篇章作用在對照「事可議」與「道不可被一種判語占有」。',
  },
  'wenshi-zhenjing_ch-9_p-26': {
    translation: '關尹子說：具體事情各有所在，談論事情也各有相應條理；道卻不固定在某一處，談道的語言也沒有可執定為唯一的條理。明白言語本身不可固定的人，每一句話都可以成為通向道的指引；不明白這一點，即使緊抓最精妙的言論，也會像異物梗住咽喉、塵翳遮住眼睛。',
    analysis: '「事有在、事言有理」承認具體命題有對象與可判斷的道理；「道無在、道言無理」則說道不被單一所在或言理窮盡，並非鼓吹說話不合邏輯。「言言皆道」的條件是知言不可執，否則「至言」也成梗、成翳。部分傳本作「為梗為醫」，注本明記「醫當作翳」；現資料取「翳」有版本與語義支持。',
  },
  'wenshi-zhenjing_ch-9_p-27': {
    translation: '關尹子說：不執著愚人的言行容易，不執著賢人的言行較難；不執著賢人的言行還容易，不執著聖人的言行更難；不執著一位聖人的言行容易，不執著千百聖人的言行尤其困難。真正能不執著眾聖言行的人，對外不把「他人」立成權威偶像，對內不把「自我」立成中心，向上不把「道」立成固定名相，向下也不把「事」立成不變規則。',
    analysis: '本段「不信」依注本不是不相信或否定，而是「不執泥染著」。凡俗意見容易放下，越尊貴的言行越可能變成權威執著；所以最後連千聖之跡也須超越。「不見人、我、道、事」不是否認它們現實存在，而是不把這些名稱固定化。此義承接第二十段「微言妙行，慎勿執之」，反對偶像化，不反對參考賢聖經驗。',
  },
  'wenshi-zhenjing_ch-9_p-28': {
    translation: '關尹子說：聖人的言語朦朧難以執著，是要使人像聽不見一般，不再追逐聲音；聖人的言語幽冥不可形見，是要使人像看不見一般，不再追逐形色；聖人的言語深沉難以言說，是要使人像不能說話一般，不再以言辭立論。所謂聽不見，便不從聲音中執著道、事與我；所謂看不見，便不從形色中執著道、事與我；所謂不能言，便不以名言談定道、事與我。',
    analysis: '蒙蒙、冥冥、沉沉分別指言外之旨不可只由聲、色、名取得。聾、盲、瘖在此是古代修辭性的感官譬喻，旨在停止對聲色名言的追逐；它不描述真實障礙者的能力或價值，更不應用來污名化聽覺、視覺或言語障礙。三組「不聞／不見／不言道事我」層層排比，最終要求連道、事、我這三個概念也不固著。',
  },
  'wenshi-zhenjing_ch-9_p-29': {
    translation: '關尹子說：人們只知道虛假的獲得之中藏著真正的喪失，卻不知道即使是真實的獲得，其中也可能有真正的喪失；只知道虛假的正確之中藏著真正的錯誤，卻不知道即使是真正的正確，其中也可能因執著而形成真正的錯誤。',
    analysis: '兩句把通常的「偽得—真失、偽是—真非」再推進到「真得—真失、真是—真非」。問題不只在認假為真；即使所得確真、所見確是，一旦據為身份或絕對尺度，也會失去開放性。注本以「金屑雖實，入眼亦為塵翳」說明真物放錯位置仍會傷害。這不是取消真假判準，而是提醒正確判斷也不能免除自我反省。',
  },
  'wenshi-zhenjing_ch-9_p-30': {
    translation: '關尹子說：談道好比敘說夢境。說夢的人可以說夢中有這樣的金玉、這樣的器皿、這樣的禽獸；他雖能描述，卻不能把夢中之物取出來交給別人。聽者雖能聽懂描述，也不能把夢中之物接過來據為己有。真正善於聽的人，既不拘泥於話語，也不為話語爭辯。',
    analysis: '夢中金玉、器皿、禽獸都可被敘述，卻不能由說者直接交付給聽者；同樣，道的語言只能指示，體悟不能像物品般轉讓。「不泥」是不黏著字面，「不辯」是不以爭勝代替理解，並非禁止提問、考證或理性辨析。全段總結本篇反覆出現的言意之辨：好讀者既認真聽取，又知道經文不是可以占有的終極物件。',
  },
  'wenshi-zhenjing_ch-9_p-31': {
    translation: '關尹子說：使你所體會的道圓融無礙，使你所實踐的德端方正直，使你的行為公平無偏，使你處理事情敏銳有效。',
    analysis: '末章以圓、方、平、銳四種形態收束全書。「圓道」重完整圓融，「方德」重正直有準，「平行」重平等無偏，「銳事」重辦事精利。四者彼此制衡：只有圓可能流於無界，只有方可能流於僵硬，只有平可能失去判別，只有銳可能過度鋒利；道、德、行、事各得其宜，才是本篇所說的雜治之「藥」。',
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
  const passage = items.find((x) => x.id === 'wenshi-zhenjing_ch-9_p-22');
  if (!passage?.canonicalText.includes('捨親就踈')) throw new Error('P22 passage anchor missing');
  passage.canonicalText = passage.canonicalText.replace('捨親就踈', '捨親就疏');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-9_p-22' && x.canonicalText.includes('捨親就踈'));
  if (!sentence) throw new Error('P22 sentence anchor missing');
  sentence.canonicalText = sentence.canonicalText.replace('捨親就踈', '捨親就疏');
  sentence.chunks.forEach((chunk) => { chunk.text = chunk.text.replace('捨親就踈', '捨親就疏'); });
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
if (changed !== 11) throw new Error(`Expected 11 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/jiu-yao/zh',
  'https://zh.wikisource.org/wiki/關尹子/9',
  'https://zh.wikisource.org/wiki/文始真經註/9',
  'https://zh.wikisource.org/wiki/文始真經言外經旨/文始真經言外經旨卷之九',
  'https://www.shidianguji.com/zh/book/SBCK440/chapter/1j6lo49ik7hgp_15',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 9 passages 21-31.');
