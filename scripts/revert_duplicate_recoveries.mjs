#!/usr/bin/env node

/** Revert only newly recovered analyses that collapsed into exact duplicates. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const RECOVERY = JSON.parse(fs.readFileSync(path.join(ROOT, 'scratch', 'qualified_asset_recovery.json'), 'utf8'))
const AUDIT = JSON.parse(fs.readFileSync(path.join(ROOT, 'scratch', 'editorial_quality_audit.json'), 'utf8'))

function loadBundle(source) {
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`, 'utf8')
}

const recovered = new Set(RECOVERY.provenance.filter((item) => item.field === 'analysis').map((item) => item.passageId))
const duplicateIds = new Set(AUDIT.issues
  .filter((item) => item.code === 'duplicate_analysis' && recovered.has(item.passageId))
  .map((item) => item.passageId))

let reverted = 0
for (const workId of ['xunzi', 'zhuangzi']) {
  const filename = `${workId}.ts`
  const file = path.join(DIR, filename)
  const active = loadBundle(fs.readFileSync(file, 'utf8'))
  const headSource = execFileSync('git', [
    '-c', `safe.directory=${ROOT.replaceAll('\\', '/')}`,
    'show', `HEAD:src/data/work_chunks/${filename}`,
  ], { cwd: ROOT, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 })
  const baseline = loadBundle(headSource)
  const baselineMap = new Map(baseline.passages.map((passage) => [passage.id, passage]))
  let changed = false
  for (const passage of active.passages) {
    if (!duplicateIds.has(passage.id)) continue
    const original = baselineMap.get(passage.id)?.readingAid?.analysis
    if (!original) throw new Error(`Missing baseline analysis: ${passage.id}`)
    passage.readingAid.analysis = original
    reverted += 1
    changed = true
  }
  if (changed) writeBundle(file, active)
}

console.log(`Reverted duplicate recovered analyses: ${reverted}`)
