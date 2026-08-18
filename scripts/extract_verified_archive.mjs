import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const reviewDir = path.resolve(__dirname, 'archive')
const reviewFiles = fs.readdirSync(reviewDir).filter(f => f.startsWith('review_'))

console.log('Total review files found:', reviewFiles.length)

const allVerifiedAids: Record<string, { translation: string; analysis: string; canonicalText?: string }> = {}

for (const file of reviewFiles) {
  const filePath = path.join(reviewDir, file)
  const content = fs.readFileSync(filePath, 'utf8')

  const sandbox: any = {
    aid: (translation: string, analysis: string) => ({ translation, analysis }),
    console: { log: () => {} },
    fs: { readFileSync: () => '', writeFileSync: () => {} },
    require: () => ({})
  }

  try {
    const cleanCode = content
      .replace(/import fs from 'node:fs'/g, '')
      .replace(/import fs from 'fs'/g, '')
      .replace(/const readingAidFile =[\s\S]*/, '')
      .replace(/const aidFile =[\s\S]*/, '')
      .replace(/const reviewFile =[\s\S]*/, '')
      .replace(/const editorialFile =[\s\S]*/, '')

    vm.runInNewContext(cleanCode, sandbox)
    const data = sandbox.reviewed || sandbox.aids || sandbox.batch || {}
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === 'object' && v !== null && (v as any).translation) {
        allVerifiedAids[k] = v as any
      }
    }
  } catch (err: any) {
    console.warn(`Could not run ${file}:`, err.message)
  }
}

console.log('Total extracted verified human translation entries:', Object.keys(allVerifiedAids).length)

const byWork: Record<string, number> = {}
for (const k of Object.keys(allVerifiedAids)) {
  const w = k.split('_ch-')[0]
  byWork[w] = (byWork[w] || 0) + 1
}
console.log('Verified passages by work:', byWork)
