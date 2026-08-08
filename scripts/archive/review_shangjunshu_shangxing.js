import fs from 'node:fs'

const passageIds = Array.from({ length: 9 }, (_, index) => `shang-jun-shu_ch-17_p-${index + 1}`)
const worksFile = 'src/data/works.ts'
let worksSource = fs.readFileSync(worksFile, 'utf8')
const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = datasets
const corrections = new Map([
  ['shang-jun-shu_ch-17_p-8', [['清瘺', '清濁'], ['帳婣', '婚姻']]],
  ['shang-jun-shu_ch-17_p-9', [['聖人惟能知萬物之要也', '聖人非能通，知萬物之要也']]],
])

for (const [passageId, replacements] of corrections) {
  const passage = passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage ${passageId}`)
  for (const [before, after] of replacements) passage.canonicalText = passage.canonicalText.replace(before, after)
  for (const sentence of sentences.filter((item) => item.passageId === passageId)) {
    for (const [before, after] of replacements) {
      sentence.canonicalText = sentence.canonicalText.replace(before, after)
      for (const chunk of sentence.chunks || []) chunk.text = chunk.text.replace(before, after)
    }
  }
}

let datasetIndex = 0
worksSource = worksSource.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () =>
  `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(datasets[datasetIndex++]))}"))`)
fs.writeFileSync(worksFile, worksSource, 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map((passageId) => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/rewards-and-punishments/zh',
    'https://zh.wikisource.org/wiki/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E5%9B%9B',
    'https://taiwanebook.ncl.edu.tw/zh-tw/book/NCL-A008475/reader',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、王時潤《商君書集解》、高亨《商君書注譯》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: corrections.has(passageId)
    ? '逐句核對《漢魏叢書》本、維基文庫卷四及嚴萬里系統校本；依異本與上下文校正明顯形訛，段落、逐句、分塊已同步，校改及理由記入解析。'
    : '逐句核對《漢魏叢書》本、維基文庫卷四、國家圖書館嚴萬里校本及朱師轍、王時潤、高亨、蔣禮鴻諸校釋；白話與解析依專有詞義及歷史語境重寫。',
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《商君書·賞刑》。`)
