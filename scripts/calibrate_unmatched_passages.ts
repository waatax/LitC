import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateWorkChunk(workId: string, mutator: (bundle: WorkBundle) => void) {
  const filePath = path.resolve(__dirname, `../src/data/work_chunks/${workId}.ts`)
  const content = fs.readFileSync(filePath, 'utf8')
  const start = content.indexOf('JSON.parse(')
  const end = content.lastIndexOf(') as WorkBundle')
  if (start === -1 || end === -1) throw new Error(`Invalid chunk file structure in ${workId}.ts`)

  const expression = content.slice(start, end + 1)
  const bundle: WorkBundle = vm.runInNewContext(expression, Object.create(null), { timeout: 10_000 })

  mutator(bundle)

  const serialized = JSON.stringify(bundle)
  const newCode = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(serialized)}) as WorkBundle\n`
  fs.writeFileSync(filePath, newCode, 'utf8')
  console.log(`✅ Successfully calibrated and updated: ${workId}.ts`)
}

// 1. Calibrate Zhong Yong (修道之謂教)
updateWorkChunk('zhong-yong', (bundle) => {
  const p = bundle.passages.find(x => x.id === 'zhong-yong_ch-1_p-1')
  if (p) {
    p.canonicalText = p.canonicalText.replace(/脩道之謂教/g, '修道之謂教')
  }
  const s = bundle.sentences.find(x => x.id === 'zhong-yong_ch-1_p-1_s-1')
  if (s) {
    s.canonicalText = s.canonicalText.replace(/脩道之謂教/g, '修道之謂教')
  }
})

// 2. Calibrate Mozi Jian'ai Shang (聖人以治天下為事者)
updateWorkChunk('mo-zi', (bundle) => {
  const p = bundle.passages.find(x => x.id === 'mo-zi_ch-14_p-1')
  if (p) {
    p.canonicalText = '聖人以治天下為事者，必知亂之所自起，焉能治之；不知亂之所自起，則不能治。譬之如醫之攻人之疾者然，必知疾之所自起，焉能攻之；不知疾之所自起，則弗能攻。治亂者何獨不然？必知亂之所自起，焉能治之；不知亂之所自起，則弗能治。聖人以治天下為事者，不可不察亂之所自起。'
  }
  const s1 = bundle.sentences.find(x => x.id === 'mo-zi_ch-14_p-1_s-1')
  if (s1) {
    s1.canonicalText = '聖人以治天下為事者，必知亂之所自起，焉能治之；不知亂之所自起，則不能治。'
  }
  const s4 = bundle.sentences.find(x => x.id === 'mo-zi_ch-14_p-1_s-4')
  if (s4) {
    s4.canonicalText = '治亂者何獨不然？必知亂之所自起，焉能治之；'
  }
  const s6 = bundle.sentences.find(x => x.id === 'mo-zi_ch-14_p-1_s-6')
  if (s6) {
    s6.canonicalText = '聖人以治天下為事者，不可不察亂之所自起。'
  }
})
