import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [works, chapters, passages, sentences] = data

const fixes = {
  'mo-zi_ch-15_p-2': [
    ['天下之人皆不相愛，強必執弱，富必侮貧', '天下之人皆不相愛，強必執弱，眾必劫寡，富必侮貧'],
  ],
  'mo-zi_ch-15_p-4': [
    ['然而今天下之士君臣相愛則惠忠，父子相愛則慈孝，兄弟相愛則和調。天下之人皆相愛，強不執弱，眾不劫寡，富不侮貧，君子曰', '然而今天下之士君子曰'],
    ['士不以為行故也。', '士不以為行故也。」'],
  ],
  'mo-zi_ch-15_p-5': [
    ['曰士聞鼓音', '士聞鼓音'],
  ],
}

for (const [passageId, replacements] of Object.entries(fixes)) {
  const passage = passages.find(item => item.id === passageId)
  if (!passage) throw new Error(`找不到 ${passageId}`)
  for (const [from, to] of replacements) {
    if (!passage.canonicalText.includes(from)) throw new Error(`${passageId} 找不到待修文字：${from}`)
    passage.canonicalText = passage.canonicalText.replace(from, to)
  }
}

const chapter = chapters.find(item => item.id === 'mo-zi_ch-15')
const chapterPassages = passages.filter(item => item.chapterId === chapter.id)
for (const passage of chapterPassages) {
  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    if (sentences[index].passageId === passage.id) sentences.splice(index, 1)
  }
  const parts = passage.canonicalText.match(/[^。！？]+[。！？]+[」』]?|[^。！？]+$/g)?.map(part => part.trim()).filter(Boolean) ?? [passage.canonicalText]
  const rebuilt = parts.map((canonicalText, index) => {
    const order = index + 1
    const id = `${passage.id}_s-${order}`
    const cue = [...canonicalText][0] ?? ''
    return { id, passageId: passage.id, order, canonicalText, cue, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText, cue }] }
  })
  passage.sentenceIds = rebuilt.map(item => item.id)
  sentences.push(...rebuilt)
}

sentences.sort((a, b) => a.passageId.localeCompare(b.passageId, 'en', { numeric: true }) || a.order - b.order)
const mozi = works.find(item => item.id === 'mo-zi')
const chapterIds = new Set(chapters.filter(item => item.workId === 'mo-zi').map(item => item.id))
mozi.totalChars = passages.filter(item => chapterIds.has(item.chapterId)).reduce((sum, item) => sum + item.canonicalText.length, 0)

for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  const encoded = encodeURIComponent(JSON.stringify(data[index]))
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`
}

fs.writeFileSync(file, source, 'utf8')
console.log('Repaired 3 canonical defects and rebuilt sentence boundaries for 《墨子·兼愛中》8 passages.')
