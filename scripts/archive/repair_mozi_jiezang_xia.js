import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const passage = passages.find(item => item.id === 'mo-zi_ch-25_p-3')
if (!passage) throw new Error('找不到《節葬下》第三段')
const repeated = '意亦使法其言，用其謀，厚葬久喪實不可以富貧眾寡，定危理亂乎，此非仁非義，非孝子之事也，為人謀者不可不沮也。仁者將興之天下，誰賈而使民譽之，終勿廢也。'
const first = passage.canonicalText.indexOf(repeated)
if (first < 0) throw new Error('未找到待刪的重複文字')
passage.canonicalText = passage.canonicalText.slice(0, first) + passage.canonicalText.slice(first + repeated.length)

for (let index = sentences.length - 1; index >= 0; index -= 1) {
  if (sentences[index].passageId === passage.id) sentences.splice(index, 1)
}
const parts = passage.canonicalText.match(/[^。！？]+[。！？]+|[^。！？]+$/g)?.map(item => item.trim()).filter(Boolean) ?? [passage.canonicalText]
const rebuilt = parts.map((canonicalText, index) => {
  const order = index + 1
  const id = `${passage.id}_s-${order}`
  const cue = [...canonicalText][0] ?? ''
  return { id, passageId: passage.id, order, canonicalText, cue, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText, cue }] }
})
passage.sentenceIds = rebuilt.map(item => item.id)
sentences.push(...rebuilt)
sentences.sort((a, b) => a.passageId.localeCompare(b.passageId, 'en', { numeric: true }) || a.order - b.order)

for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(data[index]))}"))${source.slice(match.index + match[0].length)}`
}
fs.writeFileSync(file, source, 'utf8')
console.log('已刪除《節葬下》第三段誤重複文字，並重建句界。')
