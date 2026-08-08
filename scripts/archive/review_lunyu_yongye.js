import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const replacements = [
  [
    '孔子對仲弓說：「耕牛生的小牛若毛色赤紅、牛角端正，雖然人們因牠出身低而不想用作祭牲，山川神靈難道會捨棄牠嗎？」',
    '孔子對仲弓說：「毛色駁雜的牛所生的小牛，若毛色赤紅、牛角端正，雖然人們因牠出身低而不想用作祭牲，山川神靈難道會捨棄牠嗎？」',
  ],
  [
    '古禮祭牲重赤色與角形；「犁牛」是耕牛，地位低於祭牲。',
    '古禮祭牲重赤色與角形；何晏、邢昺以「犁牛」為毛色駁雜之牛，後世也有耕牛之解，兩者都表示不合祭牲常格。',
  ],
  [
    '孔子說：「有智慧的人喜愛水，仁厚的人喜愛山；智者靈動，仁者安定；智者生活愉悅，仁者德厚而長久。」',
    '孔子說：「有智慧的人喜愛水，仁厚的人喜愛山；智者靈動，仁者安定；智者生活愉悅，仁者往往長壽。」',
  ],
  [
    '「仁者壽」可解身心和順而享壽，也可廣義理解德澤長久；不是對個別壽命的必然預測。《論語集注》同樣以動靜特質串聯三組。',
    '何晏、邢昺以仁者少思寡欲、性情安靜，因而多享壽考解釋「仁者壽」；後世也可引申為德澤長久。這是對人格與生活狀態的一般描述，不是保證每一名仁者必然長壽。',
  ],
  [
    '南子在史籍中名聲複雜，又掌握衛國政治影響力；孔子依賓主禮見她，子路懷疑此舉不當。',
    '南子在史籍中名聲複雜，又掌握衛國政治影響力。何晏舊注說孔子或想藉她勸衛靈公行道，但同時直言此事「義可疑」；朱熹一系則以仕於其國、依禮見小君加以解釋。子路因此事容易招疑而不悅。',
  ],
  [
    '「所否」有做了不對之事、或天若否棄我等解法；《論語集注》採若有非禮則天厭之。重誓反映事件易受誤解，不能據此虛構私情。',
    '「所否」有我若做了不對之事、或天所否棄者等解法；《論語集注》採若有非禮則天厭之。重誓只能證明孔子極力自明，既不宜把會見直接定性為私情，也不應掩去古注對事件的疑問。',
  ],
];

for (const [before, after] of replacements) {
  if (!readingAid.includes(before)) throw new Error(`Expected text not found: ${before.slice(0, 30)}`);
  readingAid = readingAid.replace(before, after);
}
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 28 }, (_, index) => `lun-yu_ch-6_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/yong-ye/zh',
  'https://ctext.org/lunyu-zhushu/yong-ye/zh',
  'https://zh.wikisource.org/wiki/論語註疏/卷06',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷06',
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
console.log('Reviewed 28 passages in Lunyu Yong Ye.');
