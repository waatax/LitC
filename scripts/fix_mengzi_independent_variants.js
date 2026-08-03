import fs from 'node:fs'

const worksPath = 'src/data/works.ts'
let text = fs.readFileSync(worksPath, 'utf8')
const replacements = [
  ['古公亶甫', '古公亶父'],
  ['至于岐下', '至於岐下'],
]
const encoded = new Map(replacements.map(([a, b]) => [encodeURIComponent(a), encodeURIComponent(b)]))
let changed = 0
for (const [from, to] of encoded) {
  const re = new RegExp(from, 'g')
  const hits = text.match(re)
  if (hits) { changed += hits.length; text = text.replace(re, to) }
}
if (changed !== 9) throw new Error(`Expected 9 targeted variant replacements, got ${changed}`)
fs.writeFileSync(worksPath, text)

const reviewPath = 'src/data/editorialReviews.json'
const data = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const review = data.reviews.find((r) => r.passageId === 'meng-zi_ch-2_p-5')
if (!review) throw new Error('Review record not found')
review.canonicalText = 'verified'
review.sources = [
  { label: '中國哲學書電子化計劃《孟子・梁惠王下》', url: 'https://ctext.org/mengzi/liang-hui-wang-ii/zh' },
  { label: '維基文庫《孟子・梁惠王下》', url: 'https://zh.wikisource.org/zh-hant/%E5%AD%9F%E5%AD%90/%E6%A2%81%E6%83%A0%E7%8E%8B%E4%B8%8B' },
]
review.reviewedAt = '2026-08-03'
review.notes = '依中國哲學書電子化計劃與維基文庫通行本逐字核對；修正「古公亶甫→古公亶父」、「至于岐下→至於岐下」。白話與解析已完成去重及專屬化。'
fs.writeFileSync(reviewPath, JSON.stringify(data, null, 2) + '\n')
console.log(`Updated independent variants and review record (${changed} encoded replacements).`)
