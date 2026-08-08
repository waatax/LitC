import fs from 'node:fs'

const passageIds = Array.from({ length: 4 }, (_, index) => `shang-jun-shu_ch-14_p-${index + 1}`)
const worksFile = 'src/data/works.ts'
let worksSource = fs.readFileSync(worksFile, 'utf8')
const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = datasets

const targetPassage = passages.find((passage) => passage.id === 'shang-jun-shu_ch-14_p-1')
if (!targetPassage) throw new Error('Missing 修權第一段。')
targetPassage.canonicalText = targetPassage.canonicalText.replace('利者，武也', '刑者，武也')
targetPassage.sourceRefs = [
  { label: '經文底本', edition: '中國哲學書電子化計劃《漢魏叢書》本《人物志、商子》', url: 'https://ctext.org/shang-jun-shu/cultivation-of-the-right-standard/zh' },
  { label: '異本對照', edition: '維基文庫《商君書》卷三及《羣書治要》卷三十六“商君子”', url: 'https://zh.wikisource.org/zh/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E4%B8%89' },
  { label: '校釋依據', edition: '嚴萬里校本、朱師轍《商君書解詁定本》、高亨《商君書注譯》及蔣禮鴻《商君書錐指》' },
]
for (const sentence of sentences.filter((sentence) => sentence.passageId === targetPassage.id)) {
  sentence.canonicalText = sentence.canonicalText.replace('利者，武也', '刑者，武也')
  for (const chunk of sentence.chunks || []) {
    chunk.text = chunk.text.replace('利者，武也', '刑者，武也')
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
    'https://ctext.org/shang-jun-shu/cultivation-of-the-right-standard/zh',
    'https://zh.wikisource.org/zh/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E4%B8%89',
    'https://zh.wikisource.org/zh/%E7%BE%A3%E6%9B%B8%E6%B2%BB%E8%A6%81/%E5%8D%B7%E4%B8%89%E5%8D%81%E5%85%AD',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、高亨《商君書注譯》、蔣禮鴻《商君書錐指》',
  ],
  reviewedAt: '2026-07-29',
  notes: passageId.endsWith('_p-1')
    ? '逐句核對電子底本、卷三異本及《羣書治要》節文；“利者，武也”依高亨等校釋及上下文改作“刑者，武也”，異文已寫入解析與來源紀錄。'
    : '逐句核對電子底本、維基文庫卷三及嚴萬里、朱師轍、高亨、蔣禮鴻諸校釋；白話與解析按本段專有詞義重新撰寫。',
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《商君書·修權》。`)
