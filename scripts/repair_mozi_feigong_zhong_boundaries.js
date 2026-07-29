import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const chapterPassages = passages.filter(item => item.chapterId === 'mo-zi_ch-18')

const finalPassage = chapterPassages.find(item => item.id === 'mo-zi_ch-18_p-5')
if (!finalPassage) throw new Error('找不到《墨子·非攻中》第五段')
const beforeCorrection = finalPassage.canonicalText
finalPassage.canonicalText = finalPassage.canonicalText.replace('趙氏夕；亡，我朝從之', '趙氏夕亡，我朝從之')
const correctionCount = Number(finalPassage.canonicalText !== beforeCorrection)

for (const passage of chapterPassages) {
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
console.log(`校正《墨子·非攻中》${correctionCount} 處確定誤斷，重建 ${chapterPassages.length} 段句界。`)
