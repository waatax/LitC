import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle, Sentence } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// 1. Collect all verified human translations from archive
const reviewDir = path.resolve(__dirname, 'archive')
const reviewFiles = fs.readdirSync(reviewDir).filter(f => f.startsWith('review_'))
const verifiedAids: Record<string, { translation: string; analysis?: string; canonicalText?: string }> = {}

for (const file of reviewFiles) {
  const content = fs.readFileSync(path.join(reviewDir, file), 'utf8')
  
  // Try regex extraction of passage objects
  const entryRegex = /'([a-z0-9_-]+_p-\d+)':\s*(?:aid\(\s*)?['"`]([\s\S]*?)['"`],\s*['"`]([\s\S]*?)['"`]/g
  let match: RegExpExecArray | null
  while ((match = entryRegex.exec(content)) !== null) {
    const id = match[1]
    const translation = match[2].trim()
    const analysis = match[3].trim()
    if (translation && !translation.includes('的人或事物範疇')) {
      verifiedAids[id] = { translation, analysis }
    }
  }

  // Also try object matching { translation: '...', analysis: '...' }
  const objRegex = /'([a-z0-9_-]+_p-\d+)':\s*\{\s*translation:\s*['"`]([\s\S]*?)['"`],\s*analysis:\s*['"`]([\s\S]*?)['"`]\s*\}/g
  while ((match = objRegex.exec(content)) !== null) {
    const id = match[1]
    const translation = match[2].trim()
    const analysis = match[3].trim()
    if (translation && !translation.includes('的人或事物範疇')) {
      verifiedAids[id] = { translation, analysis }
    }
  }
}
console.log(`Loaded ${Object.keys(verifiedAids).length} verified human translations from archive review scripts!`)

// 2. High-precision smoothing function for remaining passages
function smoothTranslation(trans: string): string {
  let res = trans
    .replace(/^【.*?白話通譯】在《.*?》（第 \d+ 節）中[論述|記載|描繪|闡述]+道[：:]\s*/g, '')
    .replace(/^【.*?白話詳譯】在《.*?》（第 \d+ 節）記載中[：:]\s*/g, '')
    .replace(/^【左傳白話通譯】在《春秋左氏傳・.*?》第 \d+ 節記載中[：:]\s*/g, '')
    .replace(/^【白話通譯】魯.*?年[：:]\s*/g, '')
    .replace(/：：/g, '：')
    .replace(/的人或事物範疇/g, '的人')
    .replace(/的人或天地萬物/g, '萬物')
    .replace(/的人或禮儀規程與道崇高德行與品性修養規範制規範/g, '賢者與禮制')
    .replace(/的人或禮制規範/g, '的人')
    .replace(/的人或事物/g, '的人')
    .replace(/的人或自然天道法則地萬物/g, '萬物')
    .replace(/子墨子言推理說理道[：:]/g, '墨子先生說道：')
    .replace(/墨子先生親自教導推理說理道[：:]/g, '墨子先生說道：')
    .replace(/有品德修養行的君子教導說道[：:]/g, '君子說道：')
    .replace(/推理說理道[：:]/g, '說道：')
    .replace(/推理說理/g, '論說')
    .replace(/自然天道法則地萬物/g, '天地萬物')
    .replace(/自然天道法則的/g, '自然天道')
    .replace(/禮儀規程與道崇高德行與品性修養規範/g, '禮樂規範')
    .replace(/雅樂和聲與心靈感化/g, '禮樂')
    .replace(/上下一心一統政令/g, '政令統一')
    .replace(/尊崇推戴賢能人才/g, '尊尚賢能')
    .replace(/天下兼相愛、交相利/g, '兼愛互利')
    .replace(/反對不義侵略之非攻主張/g, '非攻')
    .replace(/順應上天博愛之天志準則/g, '天志')
    .replace(/尊明鬼神賞善懲惡之明鬼信念/g, '明鬼')
    .replace(/崇尚節約克制過度浪費/g, '節用')
    .replace(/崇尚薄葬節制奢靡厚葬/g, '節葬')
    .replace(/概念名詞/g, '名')
    .replace(/客觀實體/g, '實')
    .replace(/判斷命題/g, '辭')
    .replace(/絕不是/g, '非')
    .replace(/然而且/g, '然而')
    .replace(/可而且/g, '可以')
    .replace(/得而且/g, '得以')
    .replace(/以而且/g, '以')
    .replace(/這段.*?深刻闡發了.*?實踐真理。/g, '')
    .replace(/這段.*?詳細記述了.*?。/g, '')
    .replace(/這段.*?。/g, '')
    .replace(/。+/g, '。')
    .replace(/；+/g, '；')
    .replace(/：+/g, '：')
    .trim()

  return res
}

// 3. Process all 51 work chunk files
const workChunksDir = path.resolve(__dirname, '../src/data/work_chunks')
const files = fs.readdirSync(workChunksDir).filter(f => f.endsWith('.ts')).sort()

let totalUpdatedPassages = 0
let totalArchivedApplied = 0

for (const file of files) {
  const filePath = path.join(workChunksDir, file)
  const bundle = loadBundle(filePath)

  for (const p of bundle.passages) {
    // 1. Check if verified archive aid exists
    const archived = verifiedAids[p.id]
    if (archived && archived.translation && !archived.translation.includes('的人或事物範疇')) {
      p.readingAid.translation = archived.translation
      if (archived.analysis && archived.analysis.length > 80) {
        p.readingAid.analysis = archived.analysis
      }
      totalArchivedApplied++
    } else {
      // 2. Deep clean and smooth
      const origTrans = p.readingAid?.translation || ''
      p.readingAid.translation = smoothTranslation(origTrans)
    }

    // Clean analysis
    if (p.readingAid?.analysis) {
      p.readingAid.analysis = p.readingAid.analysis
        .replace(/：：/g, '：')
        .replace(/\\\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\/g, '')
        .trim()
    }

    totalUpdatedPassages++
  }

  // Re-split sentences cleanly
  const allSentences: Sentence[] = []
  for (const p of bundle.passages) {
    const clauses = p.canonicalText.split(/(?<=[。！？；\n])/).map((c: string) => c.trim()).filter(Boolean)
    p.sentenceIds = []
    clauses.forEach((c: string, idx: number) => {
      const sId = `${p.id}_s-${idx + 1}`
      p.sentenceIds.push(sId)
      allSentences.push({
        id: sId,
        workId: bundle.work.id,
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

  saveBundle(filePath, bundle)
}

console.log(`✅ Completed full corpus recalibration across 51 classics!`)
console.log(`  - Archived human translations applied: ${totalArchivedApplied}`)
console.log(`  - Total passages processed: ${totalUpdatedPassages}`)
