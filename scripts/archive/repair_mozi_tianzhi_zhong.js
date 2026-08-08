import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const corrections = {
  'mo-zi_ch-27_p-1': [
    ['不得為政乎貴且知者，然後得為政乎愚且賤者', '不得為政乎貴且知者，貴且知者然後得為政乎愚且賤者'],
  ],
  'mo-zi_ch-27_p-3': [['天之意不可不慎也！', '天之意不可不慎也！」']],
  'mo-zi_ch-27_p-4': [['天意不可不慎也！', '天意不可不慎也！」']],
  'mo-zi_ch-27_p-9': [['辟人無以異乎輪人之有規', '辟之無以異乎輪人之有規']],
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
  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    if (sentences[index].passageId === id) sentences.splice(index, 1)
  }
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
console.log(`已完成《天志中》${count}項原文與標點校正。`)
