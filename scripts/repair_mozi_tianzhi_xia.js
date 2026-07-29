import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const corrections = {
  'mo-zi_ch-28_p-2': [
    ['天下疾病禍福，霜露不時', '天下疾病禍祟，霜露不時'],
    ['天之重且貴於天子', '天之貴且知於天子'],
    ['曰誰為知？天為知。', '曰誰為貴？天為貴。誰為知？天為知。'],
  ],
  'mo-zi_ch-28_p-4': [
    ['粒食之民，國殺一不辜者', '粒食之民，殺一不辜者'],
    ['孰予之不辜？曰天也', '孰予之不祥？曰天也'],
    ['毀之賁不之廢也', '毀之者不廢也'],
    ["名之曰『失王』", "名之曰『暴王』"],
  ],
  'mo-zi_ch-28_p-5': [['是謂之賊', '是謂天賊']],
  'mo-zi_ch-28_p-6': [
    ['以攻罰無罪之國', '以攻伐無罪之國'],
    ['入其溝境', '入其邊境'],
    ['以御其溝池', '以湮其溝池'],
    ['文、武之為正為正者若此矣', '文、武之為正者若此矣'],
  ],
}

let count = 0
for (const [id, replacements] of Object.entries(corrections)) {
  const passage = passages.find(item => item.id === id)
  if (!passage) throw new Error(`找不到段落 ${id}`)
  for (const [before, after] of replacements) {
    if (!passage.canonicalText.includes(before)) throw new Error(`${id} 找不到待校文字：${before}`)
    passage.canonicalText = passage.canonicalText.replace(before, after)
    count += 1
  }
  for (let index = sentences.length - 1; index >= 0; index -= 1) if (sentences[index].passageId === id) sentences.splice(index, 1)
  const parts = passage.canonicalText.match(/[^。！？]+[。！？]+[」』]?|[^。！？]+$/g)?.map(item => item.trim()).filter(Boolean) ?? [passage.canonicalText]
  const rebuilt = parts.map((canonicalText, index) => {
    const order = index + 1
    const sentenceId = `${id}_s-${order}`
    const cue = [...canonicalText][0] ?? ''
    return { id: sentenceId, passageId: id, order, canonicalText, cue, chunks: [{ id: `${sentenceId}_c-1`, sentenceId, order: 1, text: canonicalText, cue }] }
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
console.log(`已完成《天志下》${count}項原文校正。`)
