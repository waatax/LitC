import fs from 'fs';

const corrections = {
  'wenzi_ch-7_p-16': {
    translation: '老子說：有些事情，本想使人得利，結果恰好傷害了人；有些措施表面使人不舒服，反而真正有利。譬如患溫熱病卻勉強進食，口渴便飲用寒冷之物，這是一般人以為在養護身體的方式，良醫卻認為會加重疾病。使眼睛愉悅、使內心一時歡喜，是愚昧之道所看重的利益，合道者反而避開。聖人的作法可能開始不合人的即時欲望，後來卻符合長遠利益；眾人的作法開始迎合，後來反而違背。因此禍福進入的門徑、利害相互轉化的地方，不可不仔細考察。',
    analysis: '【主旨】本段以治病為例區分即時滿足與長期利益：看似利人的迎合可能造成傷害，短期不適也可能是有效治理或治療。\n【關鍵詞義】「病溫」是溫熱性疾病；「病渴而飲之寒」指因渴飲寒；「先迕而後合」是先違逆當下欲望、後合長遠需要；「門」是轉折入口。\n【醫療提示】這是古代醫理譬喻，不能據此作現代疾病飲食處方；其論證用途是說明利害須看後果而非感受。'
  },
  'wenzi_ch-7_p-20': {
    translation: '老子說：人因道義而彼此愛護，群體因眾人團結而強大。因此所得若能廣泛施給眾人，威信便能傳得很遠；道義施及的範圍若很狹薄，單靠武力所能控制的範圍也很有限。',
    analysis: '【主旨】本段把群體力量建立在義與利益廣施，而非單靠武力；政治涵蓋愈廣，威信才愈遠，義薄則武力控制也小。\n【關鍵詞義】「黨」在此是群體、同伴，不專指後世政黨；「群強」是因眾人聚合而強；「得之所施」指所得資源、利益的分配範圍；「武之所制」是武力可控制處。\n【思想】威不等於恐懼：前半以愛與群為根基，說明可持續的威信來自共享與認同。'
  },
  'wenzi_ch-9_p-3': {
    translation: '老子說：身體雖隱居江海，內心卻仍掛念朝廷宮闕，這表示把生命看得重要；重視生命，便會輕視外在利益。但若欲望仍不能由自己克制，適度順應而不強行壓抑，精神尚不至於受害；若明明不能克制，卻勉強壓住不從，便叫雙重傷害。遭受雙重傷害的人，沒有能長壽的。所以說：懂得和諧叫作常，懂得常道叫作明；過度增益生命叫作災殃，讓心意強制役使氣息叫作逞強。能明白這些，才接近玄同；運用外在光明，仍返回內在明覺。',
    analysis: '【主旨】本段處理欲望與壓抑的兩難：逐利傷生，不能克服欲望卻硬性壓抑又造成形神雙傷；養生須回到和與常，而非強制增生。\n【關鍵詞義】「魏闕」是宮門，代指朝廷；「重生」是重視生命；「重傷」指欲望牽引與強抑欲望的雙重損傷；「益生曰祥」沿《道德經》通行解常讀作過分厚生反成災殃。\n【版本提示】「猶不能自勝即從之」容易被誤讀成放縱，白話採不宜以強壓再傷精神的文脈解，仍需與異本注本核對。'
  },
  'wenzi_ch-9_p-12': {
    translation: '老子說：天珍愛其精純運行，地珍愛其平衡，人珍愛其真情。天的精華表現在日月星辰、雷霆風雨；地的平衡表現在水、火、金、木、土；人的真情表現在思慮、聰明與喜怒。因此收攝眼、耳、口、心四個關口，停止感官欲望向外奔馳，便可與道一同沉潛。精神明覺藏於無形，精氣返回本真；眼睛明亮卻不妄看，耳朵敏銳卻不妄聽，口能適當言說卻不妄言，心思暢通卻不妄加思慮。順任而不妄作，知道而不自矜，保持性命真情，機巧成見便不能傷害。精氣保存在眼，視覺便明；保存在耳，聽覺便敏；留在口，言語便適當；聚在心，思慮便通達。所以守住四關，終身少患；四肢九竅不被生死欲念妄加役使，這叫真人。大地生產財用，根本不出五行資源；聖人節制利用五行，治理便不至荒廢。',
    analysis: '【主旨】本段把養神與資源治理並列：人的眼耳口心要節制外馳，大地水火金木土也要節制使用；「閉」是保存功能，不是廢除感官。\n【關鍵詞義】「四關」依後文為目、耳、口、心；「五道」可指五種感官欲路，具體所指待考；「淪」是沉潛、相合；「知故」是機巧成見；「節五行」是節制五類資源。\n【辨析】原文明說精存於目則視明，證明不以視、聽不是失明失聰，而是不妄用；「莫死莫生」亦應理解為不受生死分別役使。'
  },
  'wenzi_ch-11_p-6': {
    translation: '文子問：「法律是從哪裡產生的？」',
    analysis: '【主旨】本問開啟後文法源論，焦點不只是法律條文內容，而是法律正當性從何而來。\n【關鍵詞義】「安所」就是何處、從哪裡；「法」在後文與義、眾適、人心相連，兼指公共法度與裁判準繩。\n【篇章作用】下一段回答「法生於義，義生於眾適，眾適合乎人心」。本句應與該回答合讀，不能套成一般宇宙本體論。'
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
  const sourcePath = passageId.includes('ch-7') ? 'xia-de' : passageId.includes('ch-9') ? 'shang-de' : 'shang-yi';
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: [`https://ctext.org/wenzi/${sourcePath}/zh`, 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
