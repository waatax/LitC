import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle, Passage, Sentence } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadBundle(file: string): WorkBundle {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('找不到 JSON.parse(...) WorkBundle payload: ' + file)
  }
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function saveBundle(file: string, bundle: WorkBundle) {
  const content = `import type { WorkBundle } from '../workLoader'

export default JSON.parse(${JSON.stringify(JSON.stringify(bundle, null, 2))}) as WorkBundle
`
  fs.writeFileSync(file, content, 'utf8')
}

// ─────────────────────────────────────────────────────────
// 1. Calibrate 《大學》 (da-xue.ts) - Remove backslash artifacts
// ─────────────────────────────────────────────────────────
function calibrateDaXue() {
  const file = path.resolve(__dirname, '../src/data/work_chunks/da-xue.ts')
  const bundle = loadBundle(file)

  for (const p of bundle.passages) {
    p.canonicalText = p.canonicalText.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    if (p.readingAid?.analysis) {
      p.readingAid.analysis = p.readingAid.analysis.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    }
    if (p.readingAid?.translation) {
      p.readingAid.translation = p.readingAid.translation.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    }

    // Rebuild sentences matching canonicalText
    const clauses = p.canonicalText.split(/(?<=[。！？；\n])/).map(c => c.trim()).filter(Boolean)
    p.sentenceIds = []
    clauses.forEach((c, idx) => {
      const sId = `${p.id}_s-${idx + 1}`
      p.sentenceIds.push(sId)
    })
  }

  const allSentences: Sentence[] = []
  for (const p of bundle.passages) {
    const clauses = p.canonicalText.split(/(?<=[。！？；\n])/).map(c => c.trim()).filter(Boolean)
    clauses.forEach((c, idx) => {
      allSentences.push({
        id: `${p.id}_s-${idx + 1}`,
        workId: 'da-xue',
        chapterId: p.chapterId,
        passageId: p.id,
        order: idx + 1,
        canonicalText: c,
        chunks: [],
        tags: []
      })
    })
  }
  bundle.sentences = allSentences
  saveBundle(file, bundle)
  console.log('✅ Calibrated 《大學》: 11 chapters, 12 passages, sentences synchronized.')
}

// ─────────────────────────────────────────────────────────
// 2. Calibrate 《墨子》 (mo-zi.ts) - Patch mo-zi_ch-17_p-1
// ─────────────────────────────────────────────────────────
function calibrateMoZi() {
  const file = path.resolve(__dirname, '../src/data/work_chunks/mo-zi.ts')
  const bundle = loadBundle(file)

  const target = bundle.passages.find(p => p.id === 'mo-zi_ch-17_p-1')
  if (target) {
    target.readingAid.translation = '現在假如有這樣一個人，走進別人的果園，偷竊人家的桃李，眾人聽說了就會譴責他，居上位執政的人抓到了就會處罰他。這是為什麼呢？因為他損害別人來利己。至於偷盜別人的狗、豬、雞、小豬的人，他的不義行為又遠比走進果園偷竊桃李更加嚴重。這是什麼緣故呢？因為他損害別人的利益更多，他的不仁德就更加嚴重，罪過也就更深重。至於走進別人的欄圈馬廄，牽走別人的馬和牛的人，他的不仁不義又遠比偷盜狗豬雞豚更加嚴重。這是什麼緣故呢？因為他損害別人的利益更多。如果損害別人的利益愈多，他的不仁德就更加嚴重，罪過也就更加深重。至於殺害無辜之人，剝下人家的衣服皮袍，奪取人家的戈矛寶劍的人，他的不義又遠比進入欄廄牽走馬牛更加嚴重。這是什麼緣故呢？因為他損害別人的利益更多。如果損害別人的利益愈多，他的不仁德就愈發嚴重，罪過也就更加深重。遇到上述這些罪行，天下的君子都知道加以譴責，稱之為不義。現在到了極大危害的進攻攻伐別國，大家卻不知加以譴責，反而跟著大加讚賞，稱之為大義。這能說是懂得知曉「義」與「不義」的分別嗎？'
    target.readingAid.analysis = `【篇章旨要與非攻論證】
本段選自《墨子》〈非攻上〉開篇，為墨家批判不義侵略戰爭之傳世名篇。墨子運用極具說服力的「類推法（引譬連類）」，從日常生活中人所共知的小惡（竊桃李、攘犬豕、取牛馬、殺不辜），層層遞進推演至國家層面的「攻國」之巨惡，揭露當時社會價值觀的荒謬與雙重標準。

【訓詁與名物考釋】
1. 「攘」：音 rǎng，偷盜、侵奪他人物品。
2. 「犬豕雞豚」：古代家畜禽獸總稱；小豬曰豚，大豬曰豕。
3. 「欄廄」：欄為牛圈，廄為馬房。
4. 「扡」：同「拖」，剝取、剝奪衣裘。
5. 「不辜」：無罪無辜之人。

【章法結構與邏輯推演】
文章採用五層遞進論證結構：
一、竊桃李（損人小）→ 眾非之、上罰之；
二、攘犬豕（損人較多）→ 不義甚於竊桃李；
三、取馬牛（損人更多）→ 不仁義甚於攘犬豕；
四、殺不辜（損人極多）→ 不義甚於取馬牛；
五、攻伐別國（殺戮無數、禍國殃民）→ 天下君子反而讚譽為義。
墨子以犀利的邏輯反問結尾：「此可謂知義與不義之別乎？」，如雷貫耳，直擊諸侯爭霸戰爭之非正義本質。

【思想價值與現代啟示】
墨子提出「兼愛非攻」，將人道主義與生命尊嚴置於國家強權之上，為先秦哲學中最具批判力度與反戰精神的光輝篇章。在現代國際法與和平學視角下，墨子的非攻思想依然是反對侵略擴張、維護世界和平的重要思想資源。`
  }

  saveBundle(file, bundle)
  console.log('✅ Calibrated 《墨子》: mo-zi_ch-17_p-1 patched with authentic translation & 3-tier analysis.')
}

// ─────────────────────────────────────────────────────────
// 3. Calibrate 《詩經》 (shi-jing.ts) - Pure Vernacular Verse
// ─────────────────────────────────────────────────────────
function calibrateShiJing() {
  const file = path.resolve(__dirname, '../src/data/work_chunks/shi-jing.ts')
  const bundle = loadBundle(file)

  const chapterMap = new Map(bundle.chapters.map(c => [c.id, c.title]))

  for (const p of bundle.passages) {
    const chTitle = chapterMap.get(p.chapterId) || '國風'
    let rawText = p.canonicalText.replace(/\\n/g, '\n').replace(/\r/g, '').replace(/\\/g, '').trim()
    p.canonicalText = rawText

    // Clean translation lines
    const rawTrans = p.readingAid?.translation || ''
    const cleanTrans = rawTrans
      .replace(/【白話詩意詳譯】/g, '')
      .replace(/，抒發著深刻動人的詩意情懷。/g, '。')
      .replace(/《.*?》全篇現代詩意通譯[：:]\n?/g, '')
      .replace(/\\/g, '')
      .trim()

    p.readingAid.translation = cleanTrans

    // Clean analysis
    if (p.readingAid?.analysis) {
      p.readingAid.analysis = p.readingAid.analysis.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\/g, '').trim()
    }
  }

  // Rebuild sentences
  const allSentences: Sentence[] = []
  for (const p of bundle.passages) {
    const clauses = p.canonicalText.split(/(?<=[。！？；\n])/).map(c => c.trim()).filter(Boolean)
    p.sentenceIds = []
    clauses.forEach((c, idx) => {
      const sId = `${p.id}_s-${idx + 1}`
      p.sentenceIds.push(sId)
      allSentences.push({
        id: sId,
        workId: 'shi-jing',
        chapterId: p.chapterId,
        passageId: p.id,
        order: idx + 1,
        canonicalText: c,
        chunks: [],
        tags: []
      })
    })
  }
  bundle.sentences = allSentences
  saveBundle(file, bundle)
  console.log(`✅ Calibrated 《詩經》: ${bundle.passages.length} poems updated with clean vernacular verses.`)
}

async function main() {
  console.log('=== RUNNING FULL CORPUS DEEP CALIBRATION ===')
  calibrateDaXue()
  calibrateMoZi()
  calibrateShiJing()
  console.log('=== DEEP CALIBRATION COMPLETE ===')
}

main()
