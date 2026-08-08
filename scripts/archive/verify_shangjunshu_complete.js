import fs from 'node:fs'

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8')
const [works, chapters, passages, sentences] = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])))
const aidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8')
const editorial = JSON.parse(fs.readFileSync('src/data/editorialReviews.json', 'utf8'))
const work = works.find((item) => item.id === 'shang-jun-shu')
const workChapters = chapters.filter((item) => item.workId === work?.id)
const chapterIds = new Set(workChapters.map((chapter) => chapter.id))
const workPassages = passages.filter((item) => chapterIds.has(item.chapterId))
const lostTitles = workChapters.filter((chapter) => !workPassages.some((passage) => passage.chapterId === chapter.id)).map((chapter) => chapter.title)
const reviews = new Map(editorial.reviews.map((review) => [review.passageId, review]))

const failures = []
if (!work) failures.push('missing work')
if (workChapters.length !== 26) failures.push(`expected 26 chapters, got ${workChapters.length}`)
if (workPassages.length !== 182) failures.push(`expected 182 passages, got ${workPassages.length}`)
if (JSON.stringify(lostTitles) !== JSON.stringify(['刑約', '御盜'])) failures.push(`unexpected lost chapters: ${lostTitles.join('、')}`)

for (const passage of workPassages) {
  if (!passage.canonicalText?.trim()) failures.push(`${passage.id}: missing canonical text`)
  if (!passage.sourceRefs?.length) failures.push(`${passage.id}: missing source refs`)
  if (!aidSource.includes(`'${passage.id}': {`)) failures.push(`${passage.id}: missing explicit reading aid`)
  const review = reviews.get(passage.id)
  if (!review || review.canonicalText !== 'verified' || review.translation !== 'verified' || review.analysis !== 'verified') {
    failures.push(`${passage.id}: incomplete editorial verification`)
  }
  if (!review?.sources?.length) failures.push(`${passage.id}: missing editorial sources`)
}

const corrected = passages.find((item) => item.id === 'shang-jun-shu_ch-26_p-4')
const correctedObjects = [corrected, ...sentences.filter((item) => item.passageId === corrected?.id)]
for (const expected of ['非以兔可分以為百，由名分未定也', '夫賣兔者滿市']) {
  if (!correctedObjects.some((item) => JSON.stringify(item).includes(expected))) failures.push(`定分校文未同步：${expected}`)
}
for (const rejected of ['一兔走，百人逐之，非以兔也', '夫賣者滿市']) {
  if (correctedObjects.some((item) => JSON.stringify(item).includes(rejected))) failures.push(`定分舊文殘留：${rejected}`)
}

if (failures.length) {
  console.error(`《商君書》完整性驗證失敗：${failures.length}項`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`《商君書》完整性驗證通過：26篇（24篇有傳文、2篇亡佚）、182段原文／白話／解析／來源均已編輯驗證。`)
}
