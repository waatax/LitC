import fs from 'fs'
import path from 'path'
import OpenCC from 'opencc-js'

const root = process.cwd()
const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn)
const convertBounded = (text) => {
  const protectedTerms = [
    '羣后', '群后', '高后', '皇后', '后土', '后稷', '后羿',
    '蒙蔽', '欺蒙', '私占', '獨占', '私欲', '嚴萬里', '里社', '里有書社', '鄉里', '尸襲',
    '盜跖', '使跖可信', '定制', '群臣', '坐床', '局限', '考核', '才可', '游處',
    '田里', '命令才行', '政事才有常規', '只是', '才是', '雖跖', '萬里土地',
    '了解', '公布', '群鴨', '鴨群', '愈治愈亂', '才不會',
    '只靠', '只採納', '只照', '只積', '只燒', '只顯耀',
    '范吉射', '干辛', '段干木',
    '游者愛佼', '「凶」', '凶、餽', '凶饑', '凶歉', '凶年', '凶荒', '征討', '《群書治要》',
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
const targets = [
  'src/data/readingAid.ts',
  'src/data/workDescriptions.ts',
  'src/data/schools.ts',
  'src/data/editorialReviews.json',
  'src/App.vue',
]

for (const directory of ['src/components', 'src/views']) {
  const absoluteDirectory = path.join(root, directory)
  if (!fs.existsSync(absoluteDirectory)) continue
  for (const name of fs.readdirSync(absoluteDirectory)) {
    if (/\.(?:ts|vue)$/.test(name)) targets.push(path.join(directory, name))
  }
}

const findings = []
for (const relativePath of [...new Set(targets)]) {
  const text = fs.readFileSync(path.join(root, relativePath), 'utf8')
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    const converted = convertBounded(line)
    if (converted !== line) findings.push({ file: relativePath, line: index + 1, before: line.trim(), after: converted.trim() })
  })
}

if (findings.length) {
  console.error(`Traditional Chinese audit failed: ${findings.length} line(s) contain convertible Simplified Chinese.`)
  for (const finding of findings.slice(0, 30)) {
    console.error(`${finding.file}:${finding.line}\n  ${finding.before}\n  -> ${finding.after}`)
  }
  if (findings.length > 30) console.error(`...and ${findings.length - 30} more.`)
  process.exitCode = 1
} else {
  console.log(`Traditional Chinese audit passed: ${new Set(targets).size} public-facing files checked.`)
}
