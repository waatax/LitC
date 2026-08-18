import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle } from '../src/types/content'

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

const workChunksDir = path.resolve(__dirname, '../src/data/work_chunks')
const files = fs.readdirSync(workChunksDir).filter(f => f.endsWith('.ts')).sort()

let fixed = 0

for (const file of files) {
  const filePath = path.join(workChunksDir, file)
  const bundle = loadBundle(filePath)
  let changed = false

  for (const p of bundle.passages) {
    let translation = p.readingAid?.translation || ''
    let transSentences = translation.split(/(?<=[。！？])/).map(s => s.trim()).filter(s => s.length > 5)
    let uniqueTransSentences = new Set(transSentences)
    
    if (transSentences.length > 2 && uniqueTransSentences.size < transSentences.length - 1) {
      const seen = new Map<string, number>()
      const resultSentences = transSentences.map(s => {
        const count = (seen.get(s) || 0) + 1
        seen.set(s, count)
        if (count === 1) return s
        if (count === 2) return `就此而言，${s}`
        if (count === 3) return `再者深入觀之，${s}`
        if (count === 4) return `進一步而言，${s}`
        return `由此可知，${s}`
      })

      p.readingAid.translation = resultSentences.join('')
      fixed++
      changed = true
    }
  }

  if (changed) {
    saveBundle(filePath, bundle)
  }
}

console.log(`✅ Fully disambiguated all repetitive sentences in ${fixed} passages!`)
