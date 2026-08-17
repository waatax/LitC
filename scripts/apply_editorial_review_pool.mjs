#!/usr/bin/env node

/**
 * Recover passage-specific translations and analyses from the curated review
 * pool.  A review is applied only when its canonical text matches the active
 * passage after whitespace/punctuation normalization.  Source references and
 * canonical text are deliberately left untouched: they require a separate
 * provenance review.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')
const REVIEW_FILES = [
  'review_art-of-war.json',
  'review_lun-yu.json',
  'review_wenshi-zhenjing.json',
  'review_wenzi.json',
  'review_yi-jing.json',
]
const PUNCTUATION = /[\s\p{P}\p{S}]/gu
const GENERIC_MARKERS = ['經典名句：摘錄', '核心訓詁：著重解讀文節中']

function normalize(text) {
  return String(text ?? '').normalize('NFKC').replace(PUNCTUATION, '')
}

function normalizeCanonicalVariants(text) {
  return normalize(text)
    .replace(/[於于]/g, '于')
    .replace(/[後后]/g, '后')
    .replace(/[雲云]/g, '云')
    .replace(/[兇凶]/g, '凶')
    .replace(/[遊游]/g, '游')
    .replace(/[祕秘]/g, '秘')
    .replace(/[幹干]/g, '干')
    .replace(/[裏裡里]/g, '里')
    .replace(/[慾欲]/g, '欲')
    .replace(/[閒閑]/g, '閑')
    .replace(/[爲為]/g, '為')
    .replace(/[臺台]/g, '台')
    .replace(/[衆眾]/g, '眾')
    .replace(/[羣群]/g, '群')
    .replace(/[纔才]/g, '才')
    .replace(/[脩修]/g, '修')
}

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0) throw new Error(`無法解析 ${file}`)
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const json = JSON.stringify(bundle)
  const source = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(json)}) as WorkBundle\n`
  fs.writeFileSync(file, source, 'utf8')
}

const report = {
  mode: APPLY ? 'apply' : 'dry-run',
  generatedAt: new Date().toISOString(),
  totals: { reviewed: 0, eligible: 0, changed: 0, skippedCanonicalMismatch: 0, skippedQuality: 0 },
  works: [],
}

for (const reviewFilename of REVIEW_FILES) {
  const reviewPath = path.join(ROOT, 'scratch', reviewFilename)
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
  const workId = review.work.id
  const chunkPath = path.join(ROOT, 'src', 'data', 'work_chunks', `${workId}.ts`)
  const bundle = loadBundle(chunkPath)
  const activeById = new Map(bundle.passages.map((passage) => [passage.id, passage]))
  const workResult = { workId, reviewed: review.passages.length, eligible: 0, changed: 0, skippedCanonicalMismatch: [], skippedQuality: [] }

  for (const candidate of review.passages) {
    report.totals.reviewed += 1
    const active = activeById.get(candidate.passageId)
    if (!active || normalizeCanonicalVariants(active.canonicalText) !== normalizeCanonicalVariants(candidate.canonicalText)) {
      report.totals.skippedCanonicalMismatch += 1
      workResult.skippedCanonicalMismatch.push(candidate.passageId)
      continue
    }

    const translation = String(candidate.translation ?? '').trim()
    const analysis = String(candidate.analysis ?? '').trim()
    const qualityFailure = !translation || !analysis || normalize(translation) === normalize(active.canonicalText)
      || normalize(analysis).length < 60 || GENERIC_MARKERS.some((marker) => analysis.includes(marker))
    if (qualityFailure) {
      report.totals.skippedQuality += 1
      workResult.skippedQuality.push(candidate.passageId)
      continue
    }

    report.totals.eligible += 1
    workResult.eligible += 1
    const differs = active.readingAid?.translation !== translation || active.readingAid?.analysis !== analysis
    if (differs) {
      active.readingAid = { ...(active.readingAid ?? {}), translation, analysis }
      report.totals.changed += 1
      workResult.changed += 1
    }
  }

  if (APPLY && workResult.changed > 0) writeBundle(chunkPath, bundle)
  report.works.push(workResult)
}

const reportPath = path.join(ROOT, 'scratch', 'editorial_review_recovery.json')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`${APPLY ? 'Applied' : 'Dry run'}: ${report.totals.changed} changes from ${report.totals.eligible} eligible reviews`)
console.log(`Skipped: ${report.totals.skippedCanonicalMismatch} canonical mismatches; ${report.totals.skippedQuality} quality failures`)
for (const work of report.works) console.log(`  ${work.workId}: ${work.changed}/${work.eligible} changed`)
console.log(`Report: ${path.relative(ROOT, reportPath)}`)
