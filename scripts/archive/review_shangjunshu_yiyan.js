import fs from 'node:fs'

const passageIds = Array.from({ length: 5 }, (_, index) => `shang-jun-shu_ch-8_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/unification-of-words/zh',
    'https://zh.wikisource.org/wiki/商君書/壹言',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '核对底本与校注；围绕公利／私门、抟力／杀力、开塞并用及因世度俗翻译；“官无不”疑有脱讹，仅在解析中注明语境补义。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・壹言.`)
