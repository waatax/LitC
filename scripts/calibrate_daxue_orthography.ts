import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.resolve(__dirname, '../src/data/work_chunks/da-xue.ts')
const content = fs.readFileSync(filePath, 'utf8')
const start = content.indexOf('JSON.parse(')
const end = content.lastIndexOf(') as WorkBundle')

const bundle: WorkBundle = vm.runInNewContext(content.slice(start, end + 1), Object.create(null))

// Calibrate all passages and sentences
bundle.passages.forEach(p => {
  p.canonicalText = p.canonicalText
    .replace(/古之慾/g, '古之欲')
    .replace(/詩雲/g, '詩云')
    .replace(/脩身/g, '修身')
    .replace(/脩其身/g, '修其身')
    .replace(/所謂脩身/g, '所謂修身')
})

bundle.sentences.forEach(s => {
  s.canonicalText = s.canonicalText
    .replace(/古之慾/g, '古之欲')
    .replace(/詩雲/g, '詩云')
    .replace(/脩身/g, '修身')
    .replace(/脩其身/g, '修其身')
    .replace(/所謂脩身/g, '所謂修身')
})

const serialized = JSON.stringify(bundle)
const newCode = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(serialized)}) as WorkBundle\n`
fs.writeFileSync(filePath, newCode, 'utf8')
console.log('✅ da-xue.ts standard orthography successfully calibrated.')
