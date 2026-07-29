import fs from 'fs'
import path from 'path'
import OpenCC from 'opencc-js'

const root = process.cwd()
// Use OpenCC's Simplified-to-Traditional stage only. Regional word/variant
// rewriting (for example 干擾→幹擾 or 里→裡) is intentionally excluded.
const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn)

const sourceFiles = [
  'src/data/readingAid.ts',
  'src/data/workDescriptions.ts',
  'src/data/schools.ts',
  'src/App.vue',
]

for (const directory of ['src/components', 'src/views']) {
  const absoluteDirectory = path.join(root, directory)
  if (!fs.existsSync(absoluteDirectory)) continue
  for (const name of fs.readdirSync(absoluteDirectory)) {
    if (/\.(?:ts|vue)$/.test(name)) sourceFiles.push(path.join(directory, name))
  }
}

let changedFiles = 0
let changedCharacters = 0

function convertBounded(text) {
  const protectedTerms = [
    '羣后', '群后', '高后', '皇后', '后土', '后稷', '后羿',
    '蒙蔽', '欺蒙', '私占', '獨占', '私欲', '嚴萬里', '里社', '里有書社', '鄉里', '尸襲',
    '盜跖', '使跖可信', '定制', '群臣', '坐床', '局限', '考核', '才可', '游處',
    '田里', '命令才行', '政事才有常規', '只是', '才是', '雖跖', '萬里土地',
    '了解', '公布', '群鴨', '鴨群', '愈治愈亂', '才不會',
    '只靠', '只採納', '只照', '只積', '只燒', '只顯耀',
  ]
  const placeholders = new Map()
  protectedTerms.forEach((term, index) => {
    const placeholder = `__LITC_CLASSICAL_${index}__`
    if (text.includes(term)) {
      text = text.replaceAll(term, placeholder)
      placeholders.set(placeholder, term)
    }
  })
  let result = ''
  for (let offset = 0; offset < text.length; offset += 400) result += toTraditional(text.slice(offset, offset + 400))
  for (const [placeholder, term] of placeholders) result = result.replaceAll(placeholder, term)
  return result
}

function writeConverted(relativePath, convert = convertBounded) {
  const absolutePath = path.join(root, relativePath)
  if (!fs.existsSync(absolutePath)) return
  const before = fs.readFileSync(absolutePath, 'utf8')
  // Keep conversion units bounded: readingAid.ts contains very long generated
  // lines, and OpenCC's phrase segmenter is needlessly expensive on the whole file.
  const after = before.split(/(\r?\n)/).map((part) => /\r?\n/.test(part) ? part : convert(part)).join('')
  if (after === before) return
  changedFiles += 1
  changedCharacters += Math.abs(before.length - after.length) + (before === after ? 0 : 1)
  fs.writeFileSync(absolutePath, after, 'utf8')
  console.log(`converted ${relativePath}`)
}

for (const relativePath of [...new Set(sourceFiles)]) writeConverted(relativePath)

const editorialReviewPath = path.join(root, 'src/data/editorialReviews.json')
if (fs.existsSync(editorialReviewPath)) {
  const before = fs.readFileSync(editorialReviewPath, 'utf8')
  const data = JSON.parse(before)
  const convertValue = (value) => {
    if (typeof value === 'string') return toTraditional(value)
    if (Array.isArray(value)) return value.map(convertValue)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convertValue(item)]))
    }
    return value
  }
  const after = `${JSON.stringify(convertValue(data), null, 2)}\n`
  if (after !== before) {
    fs.writeFileSync(editorialReviewPath, after, 'utf8')
    changedFiles += 1
    console.log('converted src/data/editorialReviews.json')
  }
}

console.log(`Traditional Chinese normalization complete: ${changedFiles} file(s) changed.`)
