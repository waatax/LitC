import fs from 'fs';

const pairs = {
  'wenzi_ch-4_p-9': 'wenzi_ch-3_p-23',
  'wenzi_ch-4_p-10': 'wenzi_ch-3_p-24',
  'wenzi_ch-4_p-11': 'wenzi_ch-3_p-25',
  'wenzi_ch-4_p-12': 'wenzi_ch-3_p-26',
  'wenzi_ch-4_p-13': 'wenzi_ch-3_p-27'
};

const file = 'src/data/readingAid.ts';
let source = fs.readFileSync(file, 'utf8');
const entryPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const entries = new Map();
for (const match of source.matchAll(entryPattern)) {
  entries.set(match[1], { translation: JSON.parse(`"${match[2]}"`), analysis: JSON.parse(`"${match[3]}"`) });
}

const corrections = {};
for (const [targetId, sourceId] of Object.entries(pairs)) {
  const sourceEntry = entries.get(sourceId);
  if (!sourceEntry) throw new Error(`Missing reviewed source entry: ${sourceId}`);
  corrections[targetId] = sourceEntry;
}

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
for (const [passageId, parallelPassageId] of Object.entries(pairs)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate review: ${passageId}`);
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: ['https://ctext.org/wenzi/fu-yan/zh', 'https://ctext.org/wenzi/jiu-shou/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf'],
    parallelPassageId,
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Synchronized ${replaced} parallel Wenzi passages with their reviewed counterparts.`);
