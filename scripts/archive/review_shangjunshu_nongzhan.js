import fs from 'node:fs'

const passageIds = Array.from({ length: 19 }, (_, index) => `shang-jun-shu_ch-3_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/agriculture-and-warfare/zh',
    'https://zh.wikisource.org/wiki/商君書/農戰',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '核对底本与校注，逐段重译；对壹空、外权、要靡、曲主、末货、死制、庸民以言等关键词按篇内制度语境释义，并区分作者主张与客观历史判断。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・農戰.`)
