#!/usr/bin/env node

/** Inventory recoverable passage-specific editorial assets under scratch/. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRATCH = path.join(ROOT, 'scratch')
const CHUNKS = path.join(ROOT, 'src', 'data', 'work_chunks')
const GENERIC = ['經典名句：摘錄', '核心訓詁：著重解讀文節中', '為後世理解先秦兩漢學術源流']

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

const active = new Map()
for (const filename of fs.readdirSync(CHUNKS).filter((name) => name.endsWith('.ts'))) {
  const bundle = loadBundle(path.join(CHUNKS, filename))
  for (const passage of bundle.passages) active.set(passage.id, passage)
}

function extractCandidates(value, output, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return
  seen.add(value)
  if (Array.isArray(value)) {
    for (const child of value) extractCandidates(child, output, seen)
    return
  }
  const passageId = value.passageId ?? (/_[pP]-?\d+$/u.test(String(value.id ?? '')) ? value.id : '')
  const translation = value.translation ?? value.readingAid?.translation
  const analysis = value.analysis ?? value.readingAid?.analysis
  if (passageId && active.has(passageId) && typeof translation === 'string' && typeof analysis === 'string') {
    const specific = analysis.trim().length >= 60 && !GENERIC.some((marker) => analysis.includes(marker))
    const translated = translation.trim().length > 0 && translation.trim() !== active.get(passageId).canonicalText.trim()
    if (specific && translated) output.push({ passageId, translation, analysis, canonicalText: value.canonicalText })
  }
  for (const child of Object.values(value)) extractCandidates(child, output, seen)
}

const files = []
const uniquePassages = new Set()
for (const file of walk(SCRATCH).filter((entry) => entry.endsWith('.json'))) {
  if (path.basename(file) === 'editorial_quality_audit.json') continue
  let payload
  try { payload = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { continue }
  const candidates = []
  extractCandidates(payload, candidates)
  const ids = new Set(candidates.map((candidate) => candidate.passageId))
  if (!ids.size) continue
  for (const id of ids) uniquePassages.add(id)
  files.push({ file: path.relative(ROOT, file), candidates: candidates.length, uniquePassages: ids.size })
}

files.sort((a, b) => b.uniquePassages - a.uniquePassages)
const report = { generatedAt: new Date().toISOString(), uniquePassages: uniquePassages.size, files }
fs.writeFileSync(path.join(SCRATCH, 'editorial_asset_inventory.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Recoverable unique passages: ${uniquePassages.size}`)
for (const entry of files.slice(0, 40)) console.log(`${entry.uniquePassages}\t${entry.candidates}\t${entry.file}`)
