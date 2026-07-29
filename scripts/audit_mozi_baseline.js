import fs from 'node:fs'

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8')
const [works, chapters, passages] = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])))
const work = works.find((item) => item.id === 'mo-zi')
if (!work) throw new Error('Missing 《墨子》')
const workChapters = chapters.filter((item) => item.workId === work.id)
const chapterIds = new Set(workChapters.map((item) => item.id))
const workPassages = passages.filter((item) => chapterIds.has(item.chapterId))
const aidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8')
const editorial = JSON.parse(fs.readFileSync('src/data/editorialReviews.json', 'utf8'))
const reviews = new Map(editorial.reviews.map((item) => [item.passageId, item]))

console.log(`《墨子》：${workChapters.length}篇位，${workPassages.length}段`)
for (const chapter of workChapters) {
  const chapterPassages = workPassages.filter((item) => item.chapterId === chapter.id)
  const explicitAids = chapterPassages.filter((item) => aidSource.includes(`'${item.id}': {`)).length
  const verified = chapterPassages.filter((item) => {
    const review = reviews.get(item.id)
    return review?.canonicalText === 'verified' && review?.translation === 'verified' && review?.analysis === 'verified'
  }).length
  const sourceMissing = chapterPassages.filter((item) => !item.sourceRefs?.length).length
  console.log(`${chapter.id}\t${chapter.title}\t${chapterPassages.length}段\t白話解析${explicitAids}\t驗證${verified}\t缺來源${sourceMissing}`)
}

const requestedChapterIds = new Set(process.argv.slice(2))
if (requestedChapterIds.size) {
  for (const passage of workPassages.filter((item) => requestedChapterIds.has(item.chapterId))) {
    console.log(`\n${passage.id}\n${passage.canonicalText}\n${JSON.stringify(passage.sourceRefs)}`)
  }
}
