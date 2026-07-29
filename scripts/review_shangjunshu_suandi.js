import fs from 'node:fs'

const passageIds = Array.from({ length: 15 }, (_, index) => `shang-jun-shu_ch-6_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/calculation-of-land/zh',
    'https://zh.wikisource.org/wiki/商君書/算地',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '核对底本、通行文本及校注；对土地比例、亩卒估算、数与术、五民、天下一宅、资藏于地等语句按篇章脉络翻译，不把传本估数冒充现代精确统计。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・算地.`)
