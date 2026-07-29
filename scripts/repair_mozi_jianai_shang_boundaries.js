import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = data
const passage = passages.find(item => item.id === 'mo-zi_ch-14_p-5')

if (!passage) throw new Error('找不到《墨子·兼愛上》第五段')
if (passage.canonicalText !== '若使天下兼相愛，國與國不相攻，家與家不相亂，盜賊無有，君臣父子皆能孝慈，若此則天下治。故聖人以治天下為事者，惡得不禁惡而勸愛？故天下兼相愛則治，交相惡則亂。故子墨子曰：「不可以不勸愛人者，此也。」') {
  throw new Error('第五段正文與預期底本不符，停止重建句界')
}

for (let index = sentences.length - 1; index >= 0; index -= 1) {
  if (sentences[index].passageId === passage.id) sentences.splice(index, 1)
}

const parts = [
  '若使天下兼相愛，國與國不相攻，家與家不相亂，盜賊無有，君臣父子皆能孝慈，若此則天下治。',
  '故聖人以治天下為事者，惡得不禁惡而勸愛？',
  '故天下兼相愛則治，交相惡則亂。',
  '故子墨子曰：「不可以不勸愛人者，此也。」',
]

const rebuilt = parts.map((canonicalText, index) => {
  const order = index + 1
  const id = `${passage.id}_s-${order}`
  const cue = [...canonicalText][0] ?? ''
  return {
    id,
    passageId: passage.id,
    order,
    canonicalText,
    cue,
    chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText, cue }],
  }
})

passage.sentenceIds = rebuilt.map(item => item.id)
sentences.push(...rebuilt)
sentences.sort((a, b) => a.passageId.localeCompare(b.passageId, 'en', { numeric: true }) || a.order - b.order)

for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  const encoded = encodeURIComponent(JSON.stringify(data[index]))
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`
}

fs.writeFileSync(file, source, 'utf8')
console.log('Rebuilt sentence boundaries for 《墨子·兼愛上》第五段（5 句改為 4 句）。')
