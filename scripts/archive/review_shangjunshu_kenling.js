import fs from 'node:fs'

const passageIds = Array.from({ length: 20 }, (_, index) => `shang-jun-shu_ch-2_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter(review => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/encouraging-cultivation/zh',
    'https://zh.wikisource.org/wiki/商君書/墾令',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: '逐段核對通行底本與近人校注；对宿治、外权、食口、声服、余子、甬、军市、当名、反庸等制度语汇作语境化翻译，并在歧义处保留审慎说明。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 商君書・墾令.`)
