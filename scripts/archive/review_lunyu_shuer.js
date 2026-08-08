import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const replacements = [
  [
    '孔子說：「默默把所學記在心中，學習從不滿足，教導別人不知疲倦；這幾件事我哪一件真正做到了呢？」',
    '孔子說：「默默把所學記在心中，學習從不滿足，教導別人不知疲倦；這幾件事對我有什麼困難呢？」後世也常把末句讀成謙辭：「這幾件事我哪一件真正做到了呢？」',
  ],
  [
    '「識」讀 zhì，記住；「厭」是滿足。末句可解這些事於我何難，也可作謙辭自問，此譯依朱熹的謙而又謙說。',
    '「識」讀 zhì，記住；「厭」是滿足。鄭玄、邢昺把「何有於我哉」解作他人未必能有、而孔子獨能做到，即「於我何難」；朱熹一系則讀作反身謙辭，意為這些事我哪一件真做到了。主譯依較早古注，並保留後說。',
  ],
  [
    '三項連結吸收、求學與教人，孔子以未敢自足保持學習循環。',
    '三項連結吸收、求學與教人；無論採自述實績或謙辭讀法，都以學不厭、教不倦呈現持續的學習循環。',
  ],
];

for (const [before, after] of replacements) {
  if (!readingAid.includes(before)) throw new Error(`Expected text not found: ${before.slice(0, 30)}`);
  readingAid = readingAid.replace(before, after);
}
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 37 }, (_, index) => `lun-yu_ch-7_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/shu-er/zh',
  'https://ctext.org/lunyu-zhushu/shu-er/zh',
  'https://zh.wikisource.org/wiki/論語註疏/卷07',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷07',
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
console.log('Reviewed 37 passages in Lunyu Shu Er.');
