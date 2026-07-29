import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const replacements = [
  [
    '孔子說：「是不如他；我同意你所說的，你不如他。」',
    '孔子說：「確實不如他；我和你都不如他。」另一常見句讀則解作：「我同意你，你不如他。」',
  ],
  [
    '「與」可解作贊同，末句即孔子認可子貢有自知之明；也有將「吾與女」讀為「我和你」的舊解。',
    '《論語注疏》把「吾與女」讀作「我和你」，認為孔子自謙與子貢同稱不如顏回，以安慰子貢；朱熹一系則把「與」解作贊同，即孔子認可子貢的自知。主譯依古注，並列後說。',
  ],
  [
    '孔子說：「晏平仲善於和人交往，相處越久，別人仍然敬重他。」',
    '孔子說：「晏平仲善於和人交往，相處越久，他仍然敬重對方。」',
  ],
  [
    '「久而敬之」的主語有歧義：可解別人長久敬重晏子，也可解晏子長久敬重友人；此譯採前者。',
    '「久而敬之」的主語有歧義：《論語注疏》與朱熹一系都側重晏子和朋友相交日久仍能敬重對方；也可理解為別人長久敬重晏子。主譯依前說。',
  ],
  [
    '孔子不是否定方向，而是提醒持續做到極難。《論語集注》認為這已近於仁者境界，所以不可輕易自許。',
    '何晏、邢昺另指出，子貢還希望別人不以不義加己，但這並非自己能完全控制；朱熹一系則認為不把不欲之事施人已近仁者境界，所以不可輕易自許。孔子不是否定方向，而是指出願望中有超出能力與尚待實踐之處。',
  ],
];

for (const [before, after] of replacements) {
  if (!readingAid.includes(before)) throw new Error(`Expected text not found: ${before.slice(0, 30)}`);
  readingAid = readingAid.replace(before, after);
}
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 27 }, (_, index) => `lun-yu_ch-5_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/gong-ye-chang/zh',
  'https://ctext.org/lunyu-zhushu/gong-ye-chang',
  'https://zh.wikisource.org/wiki/論語註疏/卷05',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷05',
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
console.log('Reviewed 27 passages in Lunyu Gongye Chang.');
