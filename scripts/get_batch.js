import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const REPORT_FILE = path.join(process.cwd(), 'scratch', 'editorial_quality_audit.json')
const CHUNKS_DIR = path.join(process.cwd(), 'src', 'data', 'work_chunks')
const QUEUE_FILE = path.join(process.cwd(), 'scratch', 'repair_queue.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0 || end <= start) return null
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

if (!fs.existsSync(QUEUE_FILE) || JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')).length === 0) {
  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'))
  const badIds = new Set()
  
  for (const issue of report.issues) {
    if (['thin_analysis', 'translation_repetition', 'likely_truncated_translation'].includes(issue.code)) {
      badIds.add(issue.passageId)
    }
  }

  const queue = []
  for (const filename of fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.ts'))) {
    const filePath = path.join(CHUNKS_DIR, filename)
    const bundle = loadBundle(filePath)
    if (!bundle) continue
    
    for (const p of bundle.passages || []) {
      if (badIds.has(p.id)) {
        queue.push({
          id: p.id,
          workTitle: bundle.work?.title,
          chapterTitle: (bundle.chapters || []).find(c => c.id === p.chapterId)?.title,
          canonicalText: p.canonicalText
        })
      }
    }
  }
  
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2))
}

const lockDir = path.join(process.cwd(), 'scratch', 'queue.lock')

let locked = false
for (let i = 0; i < 50; i++) {
  try {
    fs.mkdirSync(lockDir)
    locked = true
    break
  } catch (e) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100) 
  }
}

if (!locked) {
  console.error("Could not acquire lock")
  process.exit(1)
}

try {
  const currentQueue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'))
  const batchSize = 5
  const batch = currentQueue.splice(0, batchSize)
  
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(currentQueue, null, 2))
  
  if (batch.length === 0) {
    console.log("EMPTY")
  } else {
    console.log(JSON.stringify(batch, null, 2))
  }
} finally {
  fs.rmdirSync(lockDir)
}
