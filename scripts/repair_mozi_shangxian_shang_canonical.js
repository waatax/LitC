import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
if (matches.length !== 4) throw new Error(`Expected four encoded datasets, found ${matches.length}`)
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [works, chapters, passages, sentences] = datasets
const corrections = {
  'mo-zi_ch-8_p-4': '子墨子言曰：「譬若欲眾其國之善射御之士者，必將富之，貴之，敬之，譽之，然後國之善射御之士，將可得而眾也。況又有賢良之士，厚乎德行，辯乎言談，博乎道術者乎？此固國家之珍，而社稷之佐也，亦必且富之，貴之，敬之，譽之，然後國之良士，亦將可得而眾也。」',
  'mo-zi_ch-8_p-5': '是故古者聖王之為政也，言曰：「不義不富，不義不貴，不義不親，不義不近。」是以國之富貴人聞之，皆退而謀曰：「始我所恃者，富貴也。今上舉義不辟貧賤，然則我不可不為義。」親者聞之，亦退而謀曰：「始我所恃者親也。今上舉義不辟親疏，然則我不可不為義。」近者聞之，亦退而謀曰：「始我所恃者近也。今上舉義不辟遠近，然則我不可不為義。」遠者聞之，亦退而謀曰：「我始以遠為無恃。今上舉義不辟遠，然則我不可不為義。」逮至遠鄙郊外之臣、闕庭庶子、國中之眾、四鄙之萌人，聞之皆競為義。是其故何也？曰：上之所以使下者，一物也；下之所以事上者，一術也。譬之富者，有高牆深宮，牆立既謹，上為鑿一門。有盜人入，闔其自入而求之，盜其無自出。是其故何也？則上得要也。',
  'mo-zi_ch-8_p-7': '是故子墨子言曰：「得意，賢士不可不舉；不得意，賢士不可不舉。尚欲祖述堯、舜、禹、湯之道，將不可以不尚賢。夫尚賢者，政之本也。」'
}
const split = (text) => text.match(/[^。！？]+[。！？]/g) ?? [text]
for (const [passageId, canonicalText] of Object.entries(corrections)) {
  const passage = passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  for (let index = sentences.length - 1; index >= 0; index -= 1) if (sentences[index].passageId === passageId) sentences.splice(index, 1)
  const rebuilt = split(canonicalText).map((text, index) => {
    const order = index + 1
    const id = `${passageId}_s-${order}`
    const cue = [...text][0] ?? ''
    return { id, passageId, order, canonicalText: text, cue, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text, cue }] }
  })
  sentences.push(...rebuilt)
  passage.canonicalText = canonicalText
  passage.sentenceIds = rebuilt.map((item) => item.id)
}
sentences.sort((a, b) => a.passageId.localeCompare(b.passageId, 'en', { numeric: true }) || a.order - b.order)
const mozi = works.find((item) => item.id === 'mo-zi')
const chapterIds = new Set(chapters.filter((item) => item.workId === 'mo-zi').map((item) => item.id))
mozi.totalChars = passages.filter((item) => chapterIds.has(item.chapterId)).reduce((sum, item) => sum + item.canonicalText.length, 0)
for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  const encoded = encodeURIComponent(JSON.stringify(datasets[index]))
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`
}
fs.writeFileSync(file, source, 'utf8')
console.log('Repaired canonical text and sentence indexes for 墨子·尚賢上 passages 4, 5, and 7.')
