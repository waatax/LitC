import fs from 'node:fs'
const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [works, chapters, passages, sentences] = datasets
const replacements = {
  'mo-zi_ch-9_p-1': [['者以賢者眾', '是以賢者眾']],
  'mo-zi_ch-9_p-2': [['栥盛', '粢盛']],
  'mo-zi_ch-9_p-3': [['為其臣賜哉', '為賢臣賜哉']],
  'mo-zi_ch-9_p-4': [
    ['故先王言曰：『貪於政者「不能分人以事，厚於貨者不能分人以祿。」事則不與，祲則不分', '故先王言曰：「貪於政者，不能分人以事；厚於貨者，不能分人以祿。」事則不與，祿則不分'],
    ['則其所譽不當賢，而所罰不當暴', '則其所譽不當賢，而所毀不當暴']
  ],
  'mo-zi_ch-9_p-5': [
    ['王公大人未知以尚賢使能為政也', '王公大人皆知以尚賢使能為政也'],
    ['故以尚賢使能為政而治者，夫若言之謂也', '故以尚賢使能為政而治者，若吾言之謂也']
  ],
  'mo-zi_ch-9_p-8': [['所僧屢至', '所憎屢至']]
}
const split = (text) => text.match(/[^。！？]+[。！？]/g) ?? [text]
for (const [passageId, pairs] of Object.entries(replacements)) {
  const passage = passages.find((item) => item.id === passageId)
  let text = passage.canonicalText
  for (const [before, after] of pairs) {
    if (!text.includes(before)) throw new Error(`Missing target in ${passageId}: ${before}`)
    text = text.replace(before, after)
  }
  for (let i = sentences.length - 1; i >= 0; i -= 1) if (sentences[i].passageId === passageId) sentences.splice(i, 1)
  const rebuilt = split(text).map((canonicalText, index) => {
    const order = index + 1; const id = `${passageId}_s-${order}`; const cue = [...canonicalText][0] ?? ''
    return { id, passageId, order, canonicalText, cue, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text: canonicalText, cue }] }
  })
  passage.canonicalText = text; passage.sentenceIds = rebuilt.map((item) => item.id); sentences.push(...rebuilt)
}
sentences.sort((a, b) => a.passageId.localeCompare(b.passageId, 'en', { numeric: true }) || a.order - b.order)
const mozi = works.find((item) => item.id === 'mo-zi')
const ids = new Set(chapters.filter((item) => item.workId === 'mo-zi').map((item) => item.id))
mozi.totalChars = passages.filter((item) => ids.has(item.chapterId)).reduce((sum, item) => sum + item.canonicalText.length, 0)
for (let i = matches.length - 1; i >= 0; i -= 1) {
  const match = matches[i]; const encoded = encodeURIComponent(JSON.stringify(datasets[i]))
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`
}
fs.writeFileSync(file, source, 'utf8')
console.log('Repaired six canonical passages and rebuilt their sentence indexes in 墨子·尚賢中.')
