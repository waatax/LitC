#!/usr/bin/env node

/**
 * 經典文脈 ClassicFlow — 全庫白話與四層深度解析批次重構引擎
 *
 * 支援依典籍（--work）、篇章（--chapter）推進，
 * 嚴格執行品質檢驗閘門，並具備斷點續跑機制。
 */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { CheckpointManager } from './checkpoint_manager.mjs'
import { buildPassagePrompt, SYSTEM_PROMPT_SCHOLARLY } from './prompt_templates.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CHUNKS_DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'catalog.ts')

// CLI Flags
const args = process.argv.slice(2)
const getArg = (name) => {
  const prefix = `--${name}=`
  const found = args.find(a => a.startsWith(prefix))
  return found ? found.slice(prefix.length) : null
}
const targetWork = getArg('work')
const targetChapter = getArg('chapter')
const isDryRun = args.includes('--dry-run')
const isReportOnly = args.includes('--report')

function loadCatalogWorks() {
  if (!fs.existsSync(CATALOG_FILE)) return []
  const source = fs.readFileSync(CATALOG_FILE, 'utf8')
  const start = source.indexOf('catalogWorks = JSON.parse(')
  const end = source.indexOf(') as Work[]')
  if (start < 0 || end < 0) return []
  const expression = source.slice(start + 'catalogWorks = '.length, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function loadBundle(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const start = source.indexOf('JSON.parse(')
  let end = source.lastIndexOf(') as ')
  if (end < 0) end = source.lastIndexOf(')')
  if (start < 0 || end <= start) {
    throw new Error(`找不到 JSON.parse(...) payload: ${filePath}`)
  }
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function writeBundle(filePath, bundle) {
  const literal = JSON.stringify(JSON.stringify(bundle))
  const tsContent = `import type { ChapterBundle } from '@/types/content'\n\nexport default JSON.parse(${literal}) as ChapterBundle\n`
  fs.writeFileSync(filePath, tsContent, 'utf8')
}

// 嚴格品質閘門檢驗
const FORBIDDEN_TOKENS = [
  '的人或事物', '取的於', '水的為', '使的然', '有品德修養行的君子',
  '臣下僚屬', '賞賜恩惠刑罰制裁', '雅樂和聲與心靈感化',
  '本段譯解：', '詳細闡述先賢思想精義',
  '順應自然客觀規律、修己安人、審時度勢與治國理政之根本道理',
  '本段選自', '奠定全篇之', '全段聚焦'
]

export function validatePassageAid(aid, canonicalText) {
  const errors = []
  if (!aid) return ['缺少 readingAid 物件']
  const trans = (aid.translation || '').trim()
  const ana = (aid.analysis || '').trim()

  if (!trans) errors.push('白話翻譯為空')
  if (!ana) errors.push('解析為空')

  for (const token of FORBIDDEN_TOKENS) {
    if (trans.includes(token)) errors.push(`白話文包含違規機械字詞「${token}」`)
    if (ana.includes(token)) errors.push(`解析包含通用模板標記「${token}」`)
  }

  // 四層架構檢驗
  const requiredHeaders = ['【歷史與背景】', '【名物與訓詁】', '【章法與論辯】', '【思想與義理】']
  for (const h of requiredHeaders) {
    if (!ana.includes(h)) {
      errors.push(`解析缺少必要模組「${h}」`)
    }
  }

  const anaNormLen = ana.replace(/[\s\p{P}\p{S}]/gu, '').length
  if (anaNormLen < 150) {
    errors.push(`解析長度不足 (${anaNormLen} 字元 < 150 字元)`)
  }

  const transNormLen = trans.replace(/[\s\p{P}\p{S}]/gu, '').length
  const canonNormLen = canonicalText.replace(/[\s\p{P}\p{S}]/gu, '').length
  if (canonNormLen >= 20 && transNormLen < canonNormLen * 0.5) {
    errors.push(`白話文過短，可能漏譯或截短 (比例 ${ (transNormLen/canonNormLen).toFixed(2) })`)
  }

  return errors
}

async function main() {
  const checkpoint = new CheckpointManager()
  const catalogWorks = loadCatalogWorks()
  const catalogWorksMap = new Map(catalogWorks.map(w => [w.id, w]))

  if (isReportOnly) {
    const summary = checkpoint.getProgressSummary()
    console.log('=== 全庫批次重構進度報告 ===')
    console.log(`總進度: ${summary.completedPassages} / ${summary.totalPassages} (${summary.overallPercent})`)
    for (const [w, s] of Object.entries(summary.byWork)) {
      if (s.completed > 0) {
        console.log(`  ${w.padEnd(20)}: ${s.completed}/${s.total} (${s.percent})`)
      }
    }
    return
  }

  console.log(`[BatchRebuilder] 啟動全庫重構引擎 (DryRun: ${isDryRun})...`)
  const workDirs = fs.readdirSync(CHUNKS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  for (const workId of workDirs) {
    if (targetWork && targetWork !== workId) continue

    const workDir = path.join(CHUNKS_DIR, workId)
    const chFiles = fs.readdirSync(workDir).filter(f => f.endsWith('.ts')).sort()
    const workMeta = catalogWorksMap.get(workId) || { id: workId, title: workId }

    let workPassagesCount = 0
    for (const chFile of chFiles) {
      const bundle = loadBundle(path.join(workDir, chFile))
      workPassagesCount += (bundle.passages || []).length
    }
    checkpoint.initWork(workId, chFiles.length, workPassagesCount)

    console.log(`\n📚 處理典籍: 《${workMeta.title}》 (${workId})，共 ${chFiles.length} 篇章、${workPassagesCount} 段落`)

    for (const chFile of chFiles) {
      const chId = path.basename(chFile, '.ts')
      if (targetChapter && targetChapter !== chId) continue

      const filePath = path.join(workDir, chFile)
      const bundle = loadBundle(filePath)
      let chapterModified = false

      for (const passage of bundle.passages || []) {
        const pId = passage.id
        const validation = validatePassageAid(passage.readingAid, passage.canonicalText)
        if (validation.length === 0) {
          // 已經合格
          checkpoint.markPassageCompleted(workId, chId, pId, { verified: true })
          continue
        }

        console.log(`  ⚠️  段落待重構 ${pId}: ${validation.join(', ')}`)
      }

      if (chapterModified && !isDryRun) {
        writeBundle(filePath, bundle)
        console.log(`  💾 已成功寫入更新至 ${chFile}`)
      }
    }
    checkpoint.save()
  }

  console.log('\n[BatchRebuilder] 批次審查完成！')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(err => {
    console.error('Fatal Error:', err)
    process.exit(1)
  })
}
