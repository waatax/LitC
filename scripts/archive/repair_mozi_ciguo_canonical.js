import fs from 'node:fs'

const file = 'src/data/works.ts'
let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
if (matches.length !== 4) throw new Error(`Expected four encoded datasets, found ${matches.length}`)
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [works, chapters, passages, sentences] = datasets

const corrections = {
  'mo-zi_ch-6_p-1': '子墨子曰：古之民，未知為宮室時，就陵阜而居，穴而處，下潤濕傷民，故聖王作為宮室。為宮室之法，曰：室高足以辟潤濕，邊足以圉風寒，上足以待雪霜雨露，宮牆之高，足以別男女之禮，謹此則止。凡費財勞力，不加利者，不為也。是故聖王作為宮室，便於生，不以為觀樂也。作為衣服帶履，便於身，不以為辟怪也。故節於身，誨於民，是以天下之民可得而治，財用可得而足。',
  'mo-zi_ch-6_p-3': '古之民，未知為衣服時，衣皮帶茭，冬則不輕而溫，夏則不輕而凊。聖王以為不中人之情，故作，誨婦人治絲麻，梱布絹，以為民衣。為衣服之法：冬則練帛之中，足以為輕且煖；夏則絺綌之中，足以為輕且凊，謹此則止。故聖人之為衣服，適身體、和肌膚而足矣，非榮耳目而觀愚民也。當是之時，堅車良馬不知貴也，刻鏤文采不知喜也。何則？其所道之然。故民衣食之財，家足以待旱水凶饑者，何也？得其所以自養之情，而不感於外也。是以其民儉而易治，其君用財節而易贍也。府庫實滿，足以待不然；兵革不頓，士民不勞，足以征不服。故霸王之業可行於天下矣。'
}

function splitSentences(text) {
  return text.match(/[^。！？]+[。！？]/g) ?? [text]
}

for (const [passageId, canonicalText] of Object.entries(corrections)) {
  const passage = passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  const parts = splitSentences(canonicalText)
  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    if (sentences[index].passageId === passageId) sentences.splice(index, 1)
  }
  const rebuilt = parts.map((text, index) => {
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
console.log('Repaired canonical text and rebuilt sentence indexes for 墨子·辭過 passages 1 and 3.')
