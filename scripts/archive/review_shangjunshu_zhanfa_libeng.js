import fs from 'node:fs'

const passageIds = ['shang-jun-shu_ch-10_p-1', 'shang-jun-shu_ch-10_p-2', 'shang-jun-shu_ch-11_p-1']
const sourceByChapter = {
  'shang-jun-shu_ch-10': ['https://ctext.org/shang-jun-shu/methods-of-war/zh', 'https://zh.wikisource.org/wiki/商君書/卷三'],
  'shang-jun-shu_ch-11': ['https://ctext.org/shang-jun-shu/establishment-of-fundamentals/zh', 'https://zh.wikisource.org/wiki/商君書/卷三'],
}
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    ...sourceByChapter[passageId.replace(/_p-\d+$/, '')],
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '核对《战法》《立本》底本与校注；分别处理邑斗／寇战、政食众客、庙算、偝险，以及葺巧诈与兵生于治等关键词；疑难断句在解析中明示。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・戰法／立本.`)
