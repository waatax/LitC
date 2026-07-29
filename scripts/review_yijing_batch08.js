import fs from 'fs';

const corrections = {
  'yi-jing_ch-57_p-1': {
    translation: '巽卦：柔順深入，只能小有亨通；適宜有所前往，也適宜求見有德有位的大人。\n《大象傳》說：風接續著風，反覆吹行而深入，是巽卦的形象；君子由此反覆申明政令，然後付諸實行。',
    analysis: '巽有順從、進入之義，象風無孔不入。柔順本身力量有限，故只「小亨」，還須有正當方向與可靠引導。「隨風」不是一陣風盲目改向，而是風風相繼；《大象》因此說「申命行事」：命令須說明、重申，使人理解後才執行。現代可取政策溝通與落實的一致性，不是鼓勵以重複宣傳取代理由與討論。',
  },
  'yi-jing_ch-58_p-1': {
    translation: '兌卦：和悅，可以亨通，適宜守正。\n《大象傳》說：兩片湖澤相連，彼此滋益，是兌卦的形象；君子由此與朋友共同講論、反覆實習學問。',
    analysis: '兌象澤，也有喜悅、言說義。喜悅能使人相通，但必須「利貞」，不以討好、欺騙換取表面和氣。「麗澤」的麗有附麗、相連義，兩澤互相潤益；朋友講習同樣由對話校正理解，由實習鞏固知識。「講」與「習」不可偏廢：只有講論容易空泛，只有重複又可能盲目，友伴的作用在彼此質疑與支持。',
  },
  'yi-jing_ch-59_p-1': {
    translation: '渙卦：渙散之時仍可亨通；君王到達宗廟凝聚人心，適宜渡過大河般的艱險，也適宜守正。\n《大象傳》說：風吹行於水面，使水氣散布，是渙卦的形象；先王由此祭享上帝，建立宗廟。',
    analysis: '渙是離散，也包含化解凝滯。群體既散，卦辭以王至宗廟、共同祭祀重新建立中心；這反映古代宗教政治，不是現代組織唯一的凝聚方式。風行水上既能吹散，也能使水氣遍布，所以渙不只崩解，也有疏通後再聯結。利涉大川、利貞說重建不能停在儀式，還須共同承擔難事並守住正當原則。',
  },
  'yi-jing_ch-60_p-1': {
    translation: '節卦：建立合宜節制，可以亨通；但以痛苦苛刻為節制，不能長久守持。\n《大象傳》說：澤上有水，容量有限而須有節度，是節卦的形象；君子由此制定數量與制度標準，評議人的德行是否合宜。',
    analysis: '節既是竹節，也指界限、制度與節制。水在澤上若無堤限便溢，所以需要「制數度」；數度是數量、尺度和制度。「苦節不可貞」是重要限制：使人長期受苦的禁制不能作常道，節制必須可承受。議德行則要求制度也接受倫理評價，不能因規則已立便自稱正當。此義適用於個人習慣與公共規範。',
  },
  'yi-jing_ch-61_p-1': {
    translation: '中孚卦：內心誠信，連豚魚這類微小生物或薄祭也能感通而吉；適宜渡過大河般的艱險，也適宜守正。\n《大象傳》說：澤上有風，風能深入水面，是中孚卦的形象；君子由此審議刑獄，延緩並慎重覆核死刑。',
    analysis: '中孚是誠信發自內心。「豚魚」有解作豬與魚這些難以感通的動物，也有解為祭品；共同義是誠信能達於微物、薄物，不靠華飾。誠並非輕信，所以仍須利貞。《大象》「議獄緩死」把中孚落在最嚴重的司法決定：反覆審議、延緩死刑，以免不可逆誤判。現代可與慎刑及救濟程序對話，並不等於占卜可裁決案件。',
  },
  'yi-jing_ch-62_p-1': {
    translation: '小過卦：小有超越，可以亨通，適宜守正；只可處理小事，不可承辦大事。空中傳來飛鳥留下的鳴聲，告誡不宜向上高飛，應當向下安處，這樣便大吉。\n《大象傳》說：雷聲越過山頂，是小過卦的形象；君子由此在行止上稍過於恭敬，喪禮稍過於哀戚，日用稍過於儉約。',
    analysis: '小過是小事可以稍越常度，不是任何過失都可原諒。飛鳥宜下不宜上象徵處勢宜謙下、不宜追高；「可小事不可大事」限制清楚。《大象》列恭、哀、儉三種寧可略過的方向，皆為補救浮薄奢慢，並非主張無限卑屈、沉溺悲傷或傷害健康的極端節儉。過須小、須正、須針對情境，否則便失去卦義。',
  },
  'yi-jing_ch-63_p-1': {
    translation: '既濟卦：事情已經完成，小事可以亨通，適宜守正；起初吉祥，若以為完成後即可鬆懈，終究會陷入混亂。\n《大象傳》說：水在火上，彼此調濟而能烹煮，是既濟卦的形象；君子由此在安定時預想禍患，事先加以防備。',
    analysis: '既濟是已渡河、已完成。水上火下位置各當，六爻也皆得正應，卻緊接「初吉終亂」：完成不是歷史終點，秩序最整齊時反而容易鬆懈。「亨小」可讀小者亨或小亨，均提示成局後宜處理細節，不宜自滿擴張。《大象》的預防不是焦慮想像一切災難，而是對已知脆弱點建立備援、監測與修正機制。',
  },
  'yi-jing_ch-64_p-1': {
    translation: '未濟卦：事情尚未完成，仍有亨通的可能；小狐狸幾乎渡過河去，卻在最後弄濕尾巴，此時沒有什麼行動是有利的。\n《大象傳》說：火在水上，彼此不能相交成用，是未濟卦的形象；君子由此謹慎辨別事物，使各自安置在合宜的位置。',
    analysis: '未濟是尚未渡成，並非注定失敗，所以先言亨；危險在「汔濟」——幾乎完成時鬆懈，小狐濡尾而失利。它與既濟相反相成：完成中有再亂，未完成中有可成。《大象》「辨物居方」是辨清性質、安排位置，使水火等不同事物各得其所後才能協作。全經終於未濟，表明變化沒有封閉終局，而非留下悲觀結論。',
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
console.log('Completed Yijing hexagrams 57-64.');
