#!/usr/bin/env node

/** Restore literal \\uXXXX / \\n sequences left by legacy double serialization. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const APPLY = process.argv.includes('--apply')

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

function decodeString(value) {
  if (!/\\u[0-9a-fA-F]{4}/u.test(value)) return value
  return value
    .replace(/\\u([0-9a-fA-F]{4})/gu, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replaceAll('\\n', '\n')
    .replaceAll('\\r', '\r')
    .replaceAll('\\t', '\t')
}

function decodeValue(value, stats) {
  if (typeof value === 'string') {
    const decoded = decodeString(value)
    if (decoded !== value) stats.strings += 1
    return decoded
  }
  if (Array.isArray(value)) return value.map((item) => decodeValue(item, stats))
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) value[key] = decodeValue(item, stats)
  }
  return value
}

const byWork = {}
let total = 0
for (const filename of fs.readdirSync(DIR).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(DIR, filename)
  const bundle = loadBundle(file)
  const stats = { strings: 0 }
  decodeValue(bundle, stats)
  if (!stats.strings) continue
  byWork[bundle.work.id] = stats.strings
  total += stats.strings
  if (APPLY) writeBundle(file, bundle)
}

console.log(`${APPLY ? 'Decoded' : 'Found'} literal-escaped strings: ${total}`)
console.log(byWork)
