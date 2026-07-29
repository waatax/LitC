import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
const oldTranslation = '季康子問：要使人民敬重上位者、盡忠而又互相勉勵，應該怎麼做？孔子說：以莊重態度面對人民，人民就會敬重；自己孝順父母、慈愛眾人，人民就會盡忠；提拔善良能幹的人，教導能力不足的人，人民就會勤勉向上。';
const newTranslation = '季康子問：要使人民敬重上位者、忠誠並勉力向善，應該怎麼做？孔子說：以莊重態度面對人民，人民就會敬重；自己孝順父母、慈愛眾人，人民就會盡忠；提拔善良能幹的人，教導能力不足的人，人民就會勤勉向上。';
if (!readingAid.includes(oldTranslation)) throw new Error('Expected Weizheng passage 20 translation not found');
readingAid = readingAid.replace(oldTranslation, newTranslation);
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 24 }, (_, index) => `lun-yu_ch-2_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/wei-zheng/zh',
  'https://zh.wikisource.org/wiki/論語註疏/卷02',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷02',
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
console.log('Reviewed 24 passages in Lunyu Weizheng.');
