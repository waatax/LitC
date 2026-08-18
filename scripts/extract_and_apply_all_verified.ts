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

// 1. Extract from all review scripts
const reviewDir = path.resolve(__dirname, 'archive')
const reviewFiles = fs.readdirSync(reviewDir).filter(f => f.startsWith('review_'))
const allVerified: Record<string, { translation: string; analysis?: string; canonicalText?: string }> = {}

for (const file of reviewFiles) {
  const content = fs.readFileSync(path.join(reviewDir, file), 'utf8')
  const code = content
    .replace(/^import\s+.*$/gm, '')
    .replace(/const\s+(?:readingAidFile|aidFile|reviewFile|editorialFile|ids|passageIds|file)\s*=[\s\S]*/m, '')

  const sandbox: any = {
    aid: (translation: string, analysis: string) => ({ translation, analysis }),
    console: { log: () => {} }
  }

  try {
    const returnExpr = '\n;({ ...(typeof aids !== "undefined" ? aids : {}), ...(typeof reviewed !== "undefined" ? reviewed : {}), ...(typeof batch !== "undefined" ? batch : {}) });'
    const data = vm.runInNewContext(code + returnExpr, sandbox)
    if (data && typeof data === 'object') {
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === 'object' && (v as any).translation) {
          allVerified[k] = v as any
        }
      }
    }
  } catch (err: any) {
    // console.warn(`Error in ${file}:`, err.message)
  }
}

console.log(`✅ Total extracted verified review entries: ${Object.keys(allVerified).length}`)

const byWork: Record<string, number> = {}
for (const k of Object.keys(allVerified)) {
  const w = k.split('_ch-')[0]
  byWork[w] = (byWork[w] || 0) + 1
}
console.log('Verified entries by work:', byWork)

// 2. Apply verified human translations directly to work chunks
const workChunksDir = path.resolve(__dirname, '../src/data/work_chunks')
const files = fs.readdirSync(workChunksDir).filter(f => f.endsWith('.ts')).sort()

let totalApplied = 0

for (const file of files) {
  const filePath = path.join(workChunksDir, file)
  const bundle = loadBundle(filePath)
  let changed = false

  for (const p of bundle.passages) {
    const verified = allVerified[p.id]
    if (verified && verified.translation && !verified.translation.includes('的人或事物範疇')) {
      p.readingAid.translation = verified.translation
      if (verified.analysis && verified.analysis.length > 50) {
        p.readingAid.analysis = verified.analysis
      }
      totalApplied++
      changed = true
    }
  }

  if (changed) {
    saveBundle(filePath, bundle)
  }
}

console.log(`✅ Successfully applied ${totalApplied} verified human translations to work chunks!`)
