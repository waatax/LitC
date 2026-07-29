import fs from 'node:fs'

const passageIds = Array.from({ length: 12 }, (_, index) => `shang-jun-shu_ch-4_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/elimination-of-strength/zh',
    'https://zh.wikisource.org/wiki/商君書/去強',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '逐段核对底本、通行文本与校注；清除“以强去强”后的网页脚注码，并对强／弱、三官六虱、以法去法、十三数等传文歧义保留说明。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・去強.`)
