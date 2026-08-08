import fs from 'fs';

const readingAidFile = 'src/data/readingAid.ts';
let readingAid = fs.readFileSync(readingAidFile, 'utf8');
readingAid = readingAid.replace(
  '年輕人在家要孝順父母，出外要敬愛兄長，行事謹慎而言而有信，廣泛關愛眾人，並親近有仁德的人。',
  '年輕人在家要孝順父母，出外要敬愛兄長，行事謹慎而且言而有信，廣泛關愛眾人，並親近有仁德的人。',
);
readingAid = readingAid.replace(
  '所依靠的人若沒有失去應親近的原則，也就值得尊崇與依循。',
  '所親近、依靠的是值得親近的人，也就可以長久尊奉與依循。',
);
fs.writeFileSync(readingAidFile, readingAid, 'utf8');

const reviewsFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
const ids = Array.from({ length: 16 }, (_, index) => `lun-yu_ch-1_p-${index + 1}`);
const sources = [
  'https://ctext.org/analects/xue-er/zh',
  'https://zh.wikisource.org/wiki/論語註疏/卷01',
  'https://zh.wikisource.org/wiki/論語注疏_(四庫全書本)/卷01',
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
console.log('Reviewed 16 passages in Lunyu Xue Er.');
