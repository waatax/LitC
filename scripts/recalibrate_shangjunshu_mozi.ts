import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { ch1_3_data } from './data_sjs_ch1_ch3.mjs'
import { ch4_8_data } from './data_sjs_ch4_ch8.mjs'
import { ch9_17_data } from './data_sjs_ch9_ch17.mjs'
import { ch18_26_data } from './data_sjs_ch18_ch26.mjs'
import type { WorkBundle, Sentence } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sjsCleanData: Record<string, any> = {
  ...ch1_3_data,
  ...ch4_8_data,
  ...ch9_17_data,
  ...ch18_26_data
}

function loadBundle(file: string): WorkBundle {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function saveBundle(file: string, bundle: WorkBundle) {
  const content = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle, null, 2))}) as WorkBundle\n`
  fs.writeFileSync(file, content, 'utf8')
}

// 1. Recalibrate Shang Jun Shu with 3-tier analyses and clean translations
function recalibrateSJS() {
  const sjsGitSrc = execSync('git show 0a61c5c:src/data/work_chunks/shang-jun-shu.ts', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8')
  const start = sjsGitSrc.indexOf('JSON.parse(')
  const end = sjsGitSrc.lastIndexOf(') as WorkBundle')
  const baseBundle = vm.runInNewContext(sjsGitSrc.slice(start, end + 1), {})

  const targetFile = path.resolve(__dirname, '../src/data/work_chunks/shang-jun-shu.ts')

  for (const p of baseBundle.passages) {
    const clean = sjsCleanData[p.id]
    if (clean) {
      if (clean.canonicalText) p.canonicalText = clean.canonicalText
      // Use clean translation if it doesn't have template markers
      if (clean.translation && !clean.translation.includes('詳細對譯為：【文言文') && !clean.translation.includes('詳細對譯')) {
        p.readingAid.translation = clean.translation
      }
    }
    // Clean any backslashes in canon or reading aid
    p.canonicalText = p.canonicalText.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    p.readingAid.translation = p.readingAid.translation.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    p.readingAid.analysis = p.readingAid.analysis.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
  }

  // Rebuild sentences
  const allSentences: Sentence[] = []
  for (const p of baseBundle.passages) {
    const clauses = p.canonicalText.split(/(?<=[。！？；\n])/).map((c: string) => c.trim()).filter(Boolean)
    p.sentenceIds = []
    clauses.forEach((c: string, idx: number) => {
      const sId = `${p.id}_s-${idx + 1}`
      p.sentenceIds.push(sId)
      allSentences.push({
        id: sId,
        workId: 'shang-jun-shu',
        chapterId: p.chapterId,
        passageId: p.id,
        order: idx + 1,
        canonicalText: c,
        chunks: [],
        tags: []
      })
    })
  }
  baseBundle.sentences = allSentences

  saveBundle(targetFile, baseBundle)
  console.log(`✅ Recalibrated 《商君書》: ${baseBundle.passages.length} passages with 3-tier scholarly analysis and clean translations.`)
}

// 2. Fix Mozi mo-zi_ch-17_p-1 translation phrasing to avoid exact identical repetitive sentences
function fixMoZiRepetition() {
  const file = path.resolve(__dirname, '../src/data/work_chunks/mo-zi.ts')
  const bundle = loadBundle(file)
  const target = bundle.passages.find(p => p.id === 'mo-zi_ch-17_p-1')
  if (target) {
    target.readingAid.translation = '現在假如有這樣一個人，走進別人的果園，偷竊人家的桃李，眾人聽說了就會譴責他，居上位執政的人抓到了就會處罰他。這是為什麼呢？因為他損害別人來使自己獲利。至於偷盜別人的狗、豬、雞、小豬的人，他的不義行為又遠比走進果園偷竊桃李更加嚴重。這是什麼緣故呢？因為他侵害他人利益更多，其不仁德愈甚，所獲罪過也相應加重。至於走進別人的欄圈馬廄，牽走別人的馬和牛的人，他的不仁不義又遠比偷盜狗豬雞豚更加惡劣。這是何緣故呢？這是由於他侵害他人的程度更加嚴重，不義之行益發加深，所犯刑律自然更為沉重。至於殺害無辜之人，剝下人家的衣服皮袍，奪取人家的戈矛寶劍的人，他的不義又遠比進入欄廄牽走馬牛更加殘暴。此是何故呢？究其根本，在於其剝奪他人生命財產的危害達到了極致，不仁之罪至深至重。遇到上述這些罪行，天下的君子都知道加以譴責，稱之為不義。現在到了危害最大的進攻攻伐別國，大家卻不知加以譴責，反而跟著大加讚賞，稱之為大義。這能說是懂得知曉「義」與「不義」的分別嗎？'
  }
  saveBundle(file, bundle)
  console.log('✅ Recalibrated 《墨子》 mo-zi_ch-17_p-1 translation repetition phrasing.')
}

recalibrateSJS()
fixMoZiRepetition()
