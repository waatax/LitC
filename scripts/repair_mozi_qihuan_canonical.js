import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
if (matches.length !== 4) throw new Error(`Expected four encoded datasets, found ${matches.length}`)

const [works, chapters, passages, sentences] = matches
  .map((match) => JSON.parse(decodeURIComponent(match[1])))

const corrections = {
  'mo-zi_ch-5_p-3': {
    canonicalText: '今有負其子而汲者，隊其子於井中，其母必從而道之。今歲凶，民饑、道饉，此疚重於隊其子，其可無察邪？故時年歲善，則民仁且良；時年歲凶，則民吝且惡。夫民何常此之有？為者寡，食者眾，則歲無豐。故曰：「財不足則反之時，食不足則反之用。」故先民以時生財，固本而用財，則財足。故雖上世之聖王，豈能使五穀常收而旱水不至哉？然而無凍餓之民者，何也？其力時急而自養儉也。故《夏書》曰：「禹七年水。」《殷書》曰：「湯五年旱。」此其離凶饑甚矣。然而民不凍餓者，何也？其生財密，其用之節也。',
    sentenceText: {
      'mo-zi_ch-5_p-3_s-2': '今歲凶，民饑、道饉，此疚重於隊其子，其可無察邪？',
      'mo-zi_ch-5_p-3_s-6': '為者寡，食者眾，則歲無豐。',
      'mo-zi_ch-5_p-3_s-14': '」此其離凶饑甚矣。'
    }
  },
  'mo-zi_ch-5_p-5': {
    canonicalText: '故曰：以其極賞，脩其城郭，則民勞而不傷；以其常正，收其租稅，則民費而不病。民所苦者，非此也。苦於厚作斂於百姓，賞以賜無功，虛其府庫，以備車馬、衣裘、奇怪，苦其役徒，以治宮室觀樂；死又厚為棺槨，多為衣裘。生時治臺榭，死又脩墳墓。故民苦於外，府庫單於內，上不厭其樂，下不堪其苦。故國離寇敵則傷，民見凶饑則亡，此皆備不具之罪也。且夫食者，聖人之所寶也。故《周書》曰：「國無三年之食者，國非其國也；家無三年之食者，子非其子也。」此之謂國備。',
    sentenceText: {
      'mo-zi_ch-5_p-5_s-1': '故曰：以其極賞，脩其城郭，則民勞而不傷；以其常正，收其租稅，則民費而不病。民所苦者，非此也。苦於厚作斂於百姓，賞以賜無功，虛其府庫，以備車馬、衣裘、奇怪，苦其役徒，以治宮室觀樂；'
    }
  }
}

for (const [passageId, correction] of Object.entries(corrections)) {
  const passage = passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  passage.canonicalText = correction.canonicalText
  for (const [sentenceId, canonicalText] of Object.entries(correction.sentenceText)) {
    const sentence = sentences.find((item) => item.id === sentenceId)
    if (!sentence) throw new Error(`Missing sentence: ${sentenceId}`)
    sentence.canonicalText = canonicalText
    if (sentence.chunks.length !== 1) throw new Error(`Expected one chunk in ${sentenceId}`)
    sentence.chunks[0].text = canonicalText
  }
}

const mozi = works.find((item) => item.id === 'mo-zi')
const moziChapterIds = new Set(chapters.filter((item) => item.workId === 'mo-zi').map((item) => item.id))
mozi.totalChars = passages
  .filter((item) => moziChapterIds.has(item.chapterId))
  .reduce((sum, item) => sum + item.canonicalText.length, 0)

const datasets = [works, chapters, passages, sentences]
for (let index = matches.length - 1; index >= 0; index -= 1) {
  const match = matches[index]
  const encoded = encodeURIComponent(JSON.stringify(datasets[index]))
  source = `${source.slice(0, match.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(match.index + match[0].length)}`
}

fs.writeFileSync(file, source, 'utf8')
console.log('Repaired 《墨子·七患》 canonical passages 3 and 5, synchronized sentences/chunks, and refreshed totalChars.')
