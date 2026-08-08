import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-5_p-1': {
    translation: '關尹子說：心若被吉凶預兆蒙蔽，便受所謂靈鬼控制；沉迷男女情欲，便受淫鬼控制；困於幽暗憂愁，便受沉鬼控制；放縱狂逸，便受狂鬼控制；執著盟誓詛咒，便受奇鬼控制；迷信藥物餌食，便受物鬼控制。這些「鬼」有的依陰暗、幽僻、風、氣顯現，有的依土偶、彩畫、老獸或破敗器物顯現。彼此精神相感，便產生看似神異的反應。受其控制的人，有時能說奇事、怪事或祥瑞，於是傲然自負，不承認邪念附身，只說自己得道；久而久之，甚至可能死於木石、刀兵、繩索或井中。只有聖人能運用神妙而不受神異迷惑，掌握萬物變化的關鍵；能使它們聚合、消散或受到制御，日日應接萬物而內心仍寂然不亂。',
    analysis: '「五鑑」以心為鏡，本段先列六種「心蔽」，重點不是建立鬼類圖鑑，而是警告人會把欲望、憂鬱、放逸、詛咒與藥餌迷信誤認為神通。「神神而不神於神」意謂能用精神妙用，卻不被神異現象反過來支配。鬼附、預言及死法屬古代宗教心理語彙；現代讀者若遭遇幻覺、自傷意念或嚴重情緒困擾，應尋求合格醫療與緊急支援，不能以鬼神說取代診療。',
  },
  'wenshi-zhenjing_ch-5_p-2': {
    translation: '關尹子說：沒有一個可以永遠固定為專一的心，因為五種感官活動同時奔馳，心不可能停成單一狀態；沒有一個可以固定為空虛的心，因為五行作用具足其中，心不可能全然空無；也沒有一個可以固定為寂靜的心，因為萬物變化暗中推移，心不可能永遠不動。即使勉強做到一，也會有二與它相對；做到虛，也會有實來充滿；做到靜，也會有動來搖撼。只有聖人能把萬有收斂於一息，沒有一物能役使他的明徹；又能把一息散入萬有，沒有一物能阻隔他的作為。',
    analysis: '本段連「一、虛、靜」也加以破除，因為一旦把它們當成可固守的狀態，對待面便立即成立：一對二、虛對實、靜對動。真正工夫不是僵住心念，而是能收能放：斂萬有於一息而不被物役，散一息於萬有而不與物隔。「借」通「假」，有即使、假使之意。',
  },
  'wenshi-zhenjing_ch-5_p-3': {
    translation: '關尹子說：即使燃燒了千年的火，也可以在片刻間熄滅；即使積累了千年的分別意識，也可以在片刻間放下。',
    analysis: '千年之火與千年之識構成極簡對偶：存在時間很久，不等於具有不可改變的自性。火因條件而燃，條件一變即可熄；積習雖深，也不必被視為永恆本質。「去識」不是摧毀正常認知能力，而是放下固著的分別與成見。',
  },
  'wenshi-zhenjing_ch-5_p-4': {
    translation: '關尹子說：在水上流行的是船，使船流動的卻是水，不是船自身；在地上運行的是車，使車前進的卻是牛，不是車自身。進行思考的是心，使思考發動的卻是意，不是心這個名稱本身。再追究下去，便到了一個無法說明它為何如此、卻自然如此的根源。正因它不是由某個可指認原因造作出來，所以來時找不到起處，去時也找不到停留之所；無從來、無所往，便能與天地的本原相契，不受古今時間限制。',
    analysis: '船—水、車—牛、心—意三組譬喻，逐層區分承載者與發動條件，阻止把表面主體當成終極原因。最後的「不知所以然而然」不是鼓勵無知，而是指出因果追問抵達不可再物化的本原。它無可定位的來去，故不落古今；這是一種本體論論證，而非否定日常因果。',
  },
  'wenshi-zhenjing_ch-5_p-5': {
    translation: '關尹子說：明白心中沒有一個固定實體，便能明白外物也沒有固定實體；明白萬物沒有固定實體，便能明白道更不是一件可以抓取的東西。知道道不是某種實物，所以不會特別崇拜標奇立異的行為，也不會被玄妙驚人的言語震懾。',
    analysis: '「無物」不是說心、物、道一概不存在，而是否定它們具有孤立不變、可被占有的實體性。由心無物推到物無物，再推到道無物，結論具有辨偽作用：真正理解道的人，不以奇行高論製造權威。這也回應本章首段對神異與自我神化的警戒。',
  },
  'wenshi-zhenjing_ch-5_p-6': {
    translation: '關尹子說：外物與我相接，心才呈現；就像兩木相摩，火才發生。這個心不能說只在我這一邊，也不能說只在外物那一邊；不能說完全不是我，也不能說完全不是外物。若硬把它執定並劃成彼、我兩方，就是愚昧。',
    analysis: '兩木摩擦生火，是對「物我交，心生」的關係論譬喻：火不預存在某一木中，心也不能被簡化成純主觀或純客觀。它由物我相遇而顯，既不等同任一方，也不離任一方。末句批評的不是實用上的主客區分，而是把彼我界線當成絕對實體。',
  },
  'wenshi-zhenjing_ch-5_p-7': {
    translation: '關尹子說：不要倚仗你所認定的利害與是非。你所說的利、害、是、非，果真完全符合事情本身的利害是非嗎？聖人尚且不以私人的識見妄加判定，何況是你呢！',
    analysis: '本段質疑人對價值判斷的過度自信。「不識不知」不是毫無辨別力，而是不拿有限私見冒充絕對標準。利害可能因位置與時間而轉化，是非也須接受情境與更高原則檢驗；因此經文先問「果得乎」，再以聖人不妄知收束。',
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
if (changed !== 7) throw new Error(`Expected 7 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/wu-jian/zh',
  'https://www.shidianguji.com/zh/book/DZ0727/chapter/1k85je3l43ztx',
  'https://www.kanripo.org/ed/KR5c0116/HFL/005',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 5 passages 1-7.');
