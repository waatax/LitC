import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const chapterPassages = passages.filter(item => item.chapterId === 'mo-zi_ch-20')
const corrections = {
  'mo-zi_ch-20_p-2': [['聖王即沒，于民次也', '聖王即沒，於民次也']],
  'mo-zi_ch-20_p-3': [
    ['此不令為政者', '此不今為政者'],
    ['聖人為政特無此，不聖人為政', '聖人為政特無此，此不聖人為政'],
    ['去無用之費，聖王之道', '去無用之費，行聖王之道'],
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
console.log(`校正《墨子·節用上》${correctionCount} 處可確證訛脫，重建 ${chapterPassages.length} 段句界。`)
