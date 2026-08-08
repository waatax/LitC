import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const replacements = [
  [
    '孔子說：人的過錯，往往各自符合他所屬的類型。觀察一個人犯的是哪一類過錯，就可以了解他的仁德狀況。',
    '孔子說：人的過錯，往往各自符合他所屬的類型。觀察各類人的過錯並作合宜衡量，就可以知道仁恕的判斷；另一常見解讀是可由過錯看出犯錯者的品性。',
  ],
  [
    '【觀過知仁】「黨」指類別、同類。古注舉寬厚者可能失於姑息、嚴刻者可能失於苛察，過失會透露性情與價值取向。判斷人不能只計算犯錯與否，也要分析錯誤由何種動機和品格偏向造成。據何晏《論語集解》及朱熹《論語集注》改寫。',
    '【觀過知仁】「黨」指類別、同類。何晏、邢昺把「知仁」落在觀察者：應按賢愚與能力恕其所不能，使各當其所，才是仁者用心；朱熹一系則認為人的過失會隨其性情類型，由過可知其仁厚或刻薄。兩說分別著眼於如何評人與如何識人，本文並列。',
  ],
  [
    '【朝聞道】「聞」不只耳聞消息，而有領悟並確信之意；「道」是足以安頓生命與實踐的根本道理。本章以極端時間對比表明求道價值高於生命長短，並非鼓勵輕生。據《論語注疏》及朱熹《論語集注》改寫。',
    '【朝聞道】何晏、邢昺把「聞道」解作聽聞世間恢復有道，表達孔子身處無道之世的感嘆；朱熹以後常解作個人領悟足以安頓生命的根本道理。「聞」因此兼有得聞政治正道與領悟人生之道兩層傳統解釋。朝夕的極端對比強調道之可貴，並非鼓勵輕生。',
  ],
  [
    '【無適無莫，義之與比】「適」「莫」古注解為專主、不可，意指不先存固執的親疏取捨；「比」是親近、依從。君子並非沒有立場，而是不以私心預設結論，讓具體判斷服從義。據《論語注疏》及朱熹《論語集注》改寫。',
    '【無適無莫，義之與比】何晏、邢昺以「適」為厚、「莫」為薄，解作不因富厚窮薄而預設親疏，只親近合義者；朱熹一系則以「適」「莫」為專主與不可，解作不先執著一定要做或一定不做。「比」是親近、依從。兩說共同指向：取捨不徇私情，而以義為準。',
  ],
];

for (const [before, after] of replacements) {
  if (!readingAid.includes(before)) throw new Error(`Expected text not found: ${before.slice(0, 30)}`);
  readingAid = readingAid.replace(before, after);
}
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 26 }, (_, index) => `lun-yu_ch-4_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/li-ren/zh',
  'https://ctext.org/lunyu-zhushu/li-ren',
  'https://zh.wikisource.org/wiki/論語註疏/卷04',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷04',
];

for (const passageId of ids) {
  const review = {
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources,
    reviewedAt: '2026-07-29',
  };
  const index = editorial.reviews.findIndex((item) => item.passageId === passageId);
  if (index >= 0) editorial.reviews[index] = { ...editorial.reviews[index], ...review };
  else editorial.reviews.push(review);
}

editorial.updatedAt = '2026-07-29';
fs.writeFileSync(reviewsFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8');
console.log('Reviewed 26 passages in Lunyu Li Ren.');
