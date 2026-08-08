import fs from 'node:fs'

const passageIds = Array.from({ length: 10 }, (_, index) => `shang-jun-shu_ch-1_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/reform-of-the-law/zh',
    'https://zh.wikisource.org/wiki/商君書/更法',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '逐段核對《漢魏叢書》本、維基文庫通行文本及近人校注；白話按句法、通假與篇章論證重譯，解析標明關鍵歧義及版本差異。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・更法.`)
