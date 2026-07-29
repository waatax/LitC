import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const replacements = [
  [
    '孔子說：這個問題意義重大！一般禮儀，與其奢華，寧可儉約；喪禮與其只求儀節熟練周備，寧可真正哀傷。',
    '孔子說：這個問題意義重大！一般禮儀，與其奢華，寧可儉約；辦理喪事，與其神情從容和易而哀情不足，寧可真正悲戚。',
  ],
  [
    '【禮之本】「易」古注多解和易、治辦熟習。孔子不是說儉陋本身就是禮，而是在本真與浮華不能兼得時，寧取儉與哀：禮的形式應表達真實敬意，喪禮尤其以哀戚為本。據《論語注疏》及朱熹《論語集注》改寫。',
    '【禮之本】何晏集解、邢昺疏以「易」為和易，朱熹則釋作治辦；兩說都指向喪禮徒具從容或周整而哀情不足。孔子不是說儉陋本身就是禮，而是在形式失當時，寧取儉約與真哀，凸顯敬戚才是禮之本。據《論語注疏》及朱熹《論語集注》改寫。',
  ],
  [
    '孔子說：四方族群尚且有君長，不像中原諸國雖名義上有君主，實際上卻如同沒有君主一般。',
    '孔子說：夷狄即使有君長，依傳統古注，仍不如諸夏即使一時沒有君主而禮義尚存。',
  ],
  [
    '【諸夏之亡】「亡」通「無」。本句也有將「不如」理解為夷狄有君仍不及諸夏無君的舊解；依上下文批評僭禮，多數今譯取中原禮崩、君權失實之意。此處保存歧解，避免把古代族群稱謂直接轉化為現代價值判斷。據《論語注疏》、朱熹《論語集注》及歷代異說改寫。',
    '【諸夏之亡】「亡」通「無」。《論語注疏》以周、召共和為例，主張諸夏即使偶然無君，禮義仍勝於夷狄有君；近現代另有反讀為「夷狄有君，勝過諸夏無君」，用以譏刺中原君權失序。主譯依古注，並保留後說；其中族群等第反映先秦至古注時代的華夷觀，不宜直接套作現代族群判斷。',
  ],
  [
    '孔子說：管仲的器量真小啊！有人問：管仲節儉嗎？孔子說：管仲有三處宅第（「三歸」另有多種解釋），每項官務都設專人而不兼職，怎能算節儉？',
    '孔子說：管仲的器量真小啊！有人問：管仲節儉嗎？孔子說：管仲有「三歸」（何晏古注解為娶三姓女子，另有采邑、藏貨之府等異說），每項家務都設專官而不兼任，怎能算節儉？',
  ],
  [
    '【管仲器小】「三歸」歧解甚多，有三處采邑、三姓女妾或藏貨之府等說，故譯文保留異說。',
    '【管仲器小】「三歸」歧解甚多，何晏集解、邢昺疏取娶三姓女子說，另有三處采邑、藏貨之府等說，故譯文以古注為主並保留異說。',
  ],
];

for (const [before, after] of replacements) {
  if (!readingAid.includes(before)) throw new Error(`Expected text not found: ${before.slice(0, 30)}`);
  readingAid = readingAid.replace(before, after);
}
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 26 }, (_, index) => `lun-yu_ch-3_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/ba-yi/zh',
  'https://ctext.org/lunyu-zhushu/ba-yi',
  'https://zh.wikisource.org/wiki/論語註疏/卷03',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷03',
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
console.log('Reviewed 26 passages in Lunyu Ba Yi.');
