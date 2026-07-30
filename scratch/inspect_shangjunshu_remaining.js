import fs from 'fs'

const source = fs.readFileSync('src/data/works.ts', 'utf8')
const [works, chapters, passages, sentences] = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])))

for (const chapter of chapters.filter((item) => item.workId === 'shang-jun-shu')) {
  const chapterPassages = passages.filter((item) => item.chapterId === chapter.id)
  console.log(chapter.id, chapter.title, chapterPassages.length)
  if (chapter.id.endsWith('ch-26')) {
    for (const passage of chapterPassages) {
      console.log(`${passage.id}\t${passage.canonicalText}\t${JSON.stringify(passage.sourceRefs)}`)
    }
  }
}

const corrected = '凡賞者，文也；刑者，武也。'
const target = passages.find((item) => item.id === 'shang-jun-shu_ch-14_p-1')
console.log('修權校字 passage:', target?.canonicalText.includes(corrected))
console.log('修權校字 sentence:', sentences.filter((item) => item.passageId === target?.id).some((item) => item.canonicalText.includes('刑者，武也')))
console.log('修權舊字殘留:', [target, ...sentences.filter((item) => item.passageId === target?.id)].some((item) => JSON.stringify(item).includes('利者，武也')))

for (const [passageId, expected, rejected] of [
  ['shang-jun-shu_ch-17_p-8', '清濁', '清瘺'],
  ['shang-jun-shu_ch-17_p-8', '婚姻', '帳婣'],
  ['shang-jun-shu_ch-17_p-9', '聖人非能通，知萬物之要也', '聖人惟能知萬物之要也'],
]) {
  const objects = [passages.find((item) => item.id === passageId), ...sentences.filter((item) => item.passageId === passageId)]
  console.log(`${passageId} ${expected}:`, objects.some((item) => JSON.stringify(item).includes(expected)), '舊文:', objects.some((item) => JSON.stringify(item).includes(rejected)))
}
