#!/usr/bin/env node

/** Recover exact-canonical editorial records from the original Markdown master. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MASTER = path.join(ROOT, 'Literature Classic.md')
const CHUNKS = path.join(ROOT, 'src', 'data', 'work_chunks')
const AUDIT = path.join(ROOT, 'scratch', 'editorial_quality_audit.json')
const APPLY = process.argv.includes('--apply')
const PUNCTUATION = /[\s\p{P}\p{S}]/gu

const normalize = (text) => String(text ?? '').normalize('NFKC').replace(PUNCTUATION, '')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`, 'utf8')
}

function dice(left, right) {
  const grams = (value) => {
    const text = normalize(value)
    const set = new Set()
    for (let index = 0; index < text.length - 1; index += 1) set.add(text.slice(index, index + 2))
    return set
  }
  const a = grams(left)
  const b = grams(right)
  let overlap = 0
  for (const gram of a) if (b.has(gram)) overlap += 1
  return a.size || b.size ? (2 * overlap) / (a.size + b.size) : 1
}

const markdown = fs.readFileSync(MASTER, 'utf8')
const records = []
const pattern = /【(?:經文|原文)】\s*\n([\s\S]*?)\n\s*【白話文】\s*\n([\s\S]*?)\n\s*【解析】\s*\n([\s\S]*?)(?=\n\s*### |\n\s*---|$)/gu
for (const match of markdown.matchAll(pattern)) {
  const canonicalText = match[1].trim()
  const translation = match[2].trim()
  const analysis = match[3].trim()
  if (canonicalText && translation && analysis) records.push({ canonicalText, translation, analysis })
}

const candidates = new Map()
for (const record of records) {
  const key = normalize(record.canonicalText)
  if (!candidates.has(key)) candidates.set(key, record)
}

const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'))
const analysisTargets = new Set(audit.issues.filter((item) => item.code === 'generic_analysis_template').map((item) => item.passageId))
const translationTargets = new Set(audit.issues.filter((item) => ['echo_translation', 'near_echo_translation', 'likely_truncated_translation'].includes(item.code)).map((item) => item.passageId))
const totals = { exactMatches: 0, translation: 0, analysis: 0 }
const recovered = []

for (const filename of fs.readdirSync(CHUNKS).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(CHUNKS, filename)
  const bundle = loadBundle(file)
  let modified = false
  for (const passage of bundle.passages ?? []) {
    const candidate = candidates.get(normalize(passage.canonicalText))
    if (!candidate) continue
    totals.exactMatches += 1
    const aid = passage.readingAid ?? (passage.readingAid = {})
    let passageModified = false
    const sourceLength = normalize(passage.canonicalText).length
    const translationLength = normalize(candidate.translation).length
    const ratio = translationLength / Math.max(1, sourceLength)
    const translationQualified = translationLength >= 8
      && (sourceLength < 40 || ratio >= 0.35)
      && !(sourceLength >= 20 && ratio >= 0.72 && ratio <= 1.45 && dice(passage.canonicalText, candidate.translation) >= 0.86)
    if (translationTargets.has(passage.id) && translationQualified) {
      aid.translation = candidate.translation
      totals.translation += 1
      modified = true
      passageModified = true
    }
    if (analysisTargets.has(passage.id) && normalize(candidate.analysis).length >= 60) {
      aid.analysis = candidate.analysis
      totals.analysis += 1
      modified = true
      passageModified = true
    }
    if (passageModified) recovered.push(passage.id)
  }
  if (modified && APPLY) writeBundle(file, bundle)
}

const report = { mode: APPLY ? 'apply' : 'dry-run', masterRecords: records.length, ...totals, recovered: [...new Set(recovered)] }
fs.writeFileSync(path.join(ROOT, 'scratch', 'literature_classic_recovery.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(report)
