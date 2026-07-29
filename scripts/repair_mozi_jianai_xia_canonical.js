import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [works, chapters, passages, sentences] = data
const fixes = {
  'mo-zi_ch-16_p-3': [
    ['正求與天下之利', '正求興天下之利'],
    ['聰耳明目相與視聽乎', '聰耳明目相為視聽乎'],
    ['股肱畢強相為動為宰乎', '股肱畢強相為動宰乎'],
    ['毋以兼為正', '毋以兼為政'],
  ],
  'mo-zi_ch-16_p-4': [
    ['誰以為二士', '設以為二士'],
    ['不識將惡也家室', '不識將惡擇之也？家室'],
  ],
  'mo-zi_ch-16_p-5': [
    ['誰以為二君', '設以為二君'],
    ['雖非兼者，必從兼君', '雖非兼君，必從兼君'],
  ],
  'mo-zi_ch-16_p-10': [
    ['然後人報我愛利吾親乎', '然後人報我以愛利吾親乎'],
    ['意我先從事乎惡人之親', '意我先從事乎惡賊人之親'],
  ],
  'mo-zi_ch-16_p-11': [
    ['伏水火而死，有不可勝數也', '伏水火而死者，不可勝數也'],
    ['然後為之越王說之', '然後為而越王說之'],
  ],
}

for (const [passageId, replacements] of Object.entries(fixes)) {
  const passage = passages.find(item => item.id === passageId)
  if (!passage) throw new Error(`找不到 ${passageId}`)
  for (const [from, to] of replacements) {
    if (!passage.canonicalText.includes(from)) throw new Error(`${passageId} 找不到：${from}`)
    passage.canonicalText = passage.canonicalText.replace(from, to)
  }
}

for (const passage of passages.filter(item => item.chapterId === 'mo-zi_ch-16')) {
  for (let index = sentences.length - 1; index >= 0; index -= 1) if (sentences[index].passageId === passage.id) sentences.splice(index, 1)
  const parts = passage.canonicalText.match(/[^。！？]+[。！？]+[」』]?|[^。！？]+$/g)?.map(item => item.trim()).filter(Boolean) ?? [passage.canonicalText]
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
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(data[index]))}"))${source.slice(match.index + match[0].length)}`
}
fs.writeFileSync(file, source, 'utf8')
console.log('Repaired 12 canonical defects and rebuilt sentence boundaries for 《墨子·兼愛下》.')
