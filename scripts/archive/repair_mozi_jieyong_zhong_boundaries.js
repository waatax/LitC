import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const chapterPassages = passages.filter(item => item.chapterId === 'mo-zi_ch-21')
const corrections = {
  'mo-zi_ch-21_p-1': [['古者明王聖人，其所以王天下正諸侯者，此也。', '古者明王聖人，其所以王天下正諸侯者，此也。」']],
  'mo-zi_ch-21_p-2': [['不加于民利者', '不加於民利者']],
  'mo-zi_ch-21_p-6': [
    ['于是作為宮室而利。」然則', '於是作為宮室而利。然則'],
  ],
}
let correctionCount = 0
for (const passage of chapterPassages) {
  for (const [before, after] of corrections[passage.id] ?? []) {
    if (!passage.canonicalText.includes(before)) continue
    passage.canonicalText = passage.canonicalText.replace(before, after)
    correctionCount += 1
  }
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
for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(data[index]))}"))${source.slice(match.index + match[0].length)}`
}
fs.writeFileSync(file, source, 'utf8')
console.log(`校正《墨子·節用中》${correctionCount} 組確定標點／字形問題，重建 ${chapterPassages.length} 段句界。`)
