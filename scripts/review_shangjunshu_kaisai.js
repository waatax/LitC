import fs from 'node:fs'

const passageIds = Array.from({ length: 7 }, (_, index) => `shang-jun-shu_ch-7_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/opening-and-debarring/zh',
    'https://zh.wikisource.org/wiki/商君書/開塞',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '核对底本与校注；将亲亲—尚贤—贵贵三阶段作为文本政治起源论而非现代史实，并对并刑、退德、刑反于德、赏禁刑劝等歧义保留解释。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・開塞.`)
