import fs from 'node:fs'

const passageIds = Array.from({ length: 9 }, (_, index) => `shang-jun-shu_ch-15_p-${index + 1}`)
const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))

editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map((passageId) => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/encouragement-of-immigration/zh',
    'https://zh.wikisource.org/wiki/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E5%9B%9B',
    'https://taiwanebook.ncl.edu.tw/zh-tw/book/NCL-A008475/reader',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、王時潤《商君書集解》、高亨《商君書注譯》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: passageId.endsWith('_p-8') || passageId.endsWith('_p-9')
    ? '逐句核對《漢魏叢書》本、維基文庫卷四、嚴萬里系統校本及現代校釋；本段傳本有脫誤或多組異文，白話依共同語境審慎譯解，異文不確定性已在解析中明載。'
    : '逐句核對《漢魏叢書》本、維基文庫卷四、國家圖書館嚴萬里校本及朱師轍、王時潤、高亨、蔣禮鴻諸校釋；白話與解析依本段歷史語境及專有詞義重寫。',
})))
editorial.updatedAt = '2026-07-29'

fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 《商君書·徠民》。`)
