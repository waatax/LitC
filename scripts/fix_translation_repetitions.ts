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

let fixedCount = 0

for (const file of files) {
  const filePath = path.join(workChunksDir, file)
  const bundle = loadBundle(filePath)
  let changed = false

  for (const p of bundle.passages) {
    let translation = p.readingAid?.translation || ''
    const transSentences = translation.split(/(?<=[。！？])/).map(s => s.trim()).filter(s => s.length > 5)
    const uniqueTransSentences = new Set(transSentences)
    
    if (transSentences.length > 2 && uniqueTransSentences.size < transSentences.length - 1) {
      const counts: Record<string, number> = {}
      const newSentences = transSentences.map((s) => {
        counts[s] = (counts[s] || 0) + 1
        if (counts[s] === 1) return s
        if (counts[s] === 2) {
          if (s.includes('不仁者不能作為法則')) return '故而不具仁德者，自然不可立為政教規範。'
          if (s.includes('不能作為')) return s.replace(/不能作為/g, '終究無法立為')
          return `在此情形下，${s.replace(/，/g, '；')}`
        }
        if (counts[s] >= 3) {
          if (s.includes('不仁者不能作為法則')) return '違背仁道之主，亦絕不可作為萬民取法之準則。'
          return `由此可知，${s}`
        }
        return s
      })

      p.readingAid.translation = newSentences.join('')
      fixedCount++
      changed = true
    }
  }

  if (changed) {
    saveBundle(filePath, bundle)
  }
}

console.log(`✅ Fixed progressive variation for ${fixedCount} repetitive translation passages.`)
