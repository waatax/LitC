#!/usr/bin/env node

/** Repair the single-quoted bundle serialization emitted by an earlier recovery run. */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CHUNKS = path.join(ROOT, 'src', 'data', 'work_chunks')
let repaired = 0

for (const filename of fs.readdirSync(CHUNKS).filter((name) => name.endsWith('.ts'))) {
  const file = path.join(CHUNKS, filename)
  const source = fs.readFileSync(file, 'utf8')
  const prefix = "export default JSON.parse('"
  const start = source.indexOf(prefix)
  const suffix = "') as WorkBundle"
  const end = source.lastIndexOf(suffix)
  if (start < 0 || end < 0) continue
  const rawJson = source.slice(start + prefix.length, end).replaceAll("\\'", "'")
  let bundle
  try { bundle = JSON.parse(rawJson) } catch (error) {
    throw new Error(`${filename}: raw JSON recovery failed: ${error.message}`)
  }
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  const output = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`
  fs.writeFileSync(file, output, 'utf8')
  repaired += 1
}

console.log(`Repaired bundle serialization: ${repaired}`)
