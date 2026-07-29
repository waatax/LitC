import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const chapterPassages = passages.filter(item => item.chapterId === 'mo-zi_ch-19')
const corrections = {
  'mo-zi_ch-19_p-2': [
    ['此為周生之本', '此為害生之本'],
  ],
  'mo-zi_ch-19_p-3': [
    ['率不利和', '卒不和'],
    ['糧食下繼傺', '糧食不繼傺'],
    ['廁役以此', '廝役以此'],
  ],
  'mo-zi_ch-19_p-4': [
    ['天有酷命', '天有誥命'],
    ['于夏之城閒', '於夏之城閒'],
    ['湯奉桀眾以克有，', '湯奉桀眾以克有夏，'],
    ['雨土于薄', '雨土於薄'],
    ['沈漬殷紂于酒德', '沈漬殷紂於酒德'],
    ['反商之周', '反商作周'],
  ],
  'mo-zi_ch-19_p-5': [
    ['楚熊麗始討此睢山之閒', '楚熊麗始封此雎山之閒'],
    ['越王繄虧」，出自', '越王繄虧出自'],
  ],
  'mo-zi_ch-19_p-6': [
    ['士居子', '士君子'],
  ],
}

let correctionCount = 0
for (const passage of chapterPassages) {
  for (const [before, after] of corrections[passage.id] ?? []) {
    if (!passage.canonicalText.includes(before)) continue
    passage.canonicalText = passage.canonicalText.replace(before, after)
    correctionCount += 1
  }
  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    if (sentences[index].passageId === passage.id) sentences.splice(index, 1)
  }
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
console.log(`校正《墨子·非攻下》${correctionCount} 處可確證訛脫，重建 ${chapterPassages.length} 段句界。`)
