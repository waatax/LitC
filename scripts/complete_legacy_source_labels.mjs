#!/usr/bin/env node

/** Preserve legacy source labels while making their limited provenance explicit. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FILE = path.join(ROOT, 'src', 'data', 'work_chunks', 'gu-wen-guan-zhi.ts')
const APPLY = process.argv.includes('--apply')

const source = fs.readFileSync(FILE, 'utf8')
const start = source.indexOf('JSON.parse(')
const end = source.lastIndexOf(') as WorkBundle')
const bundle = vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
let completed = 0

for (const passage of bundle.passages ?? []) {
  for (const ref of passage.sourceRefs ?? []) {
    if (ref.label && !ref.edition && !ref.url && !ref.location) {
      ref.edition = 'LitC 原始篇題／出處標識（未綁定外部網址）'
      completed += 1
    }
  }
}

if (APPLY && completed) {
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  fs.writeFileSync(FILE, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`, 'utf8')
}
console.log(`${APPLY ? 'Completed' : 'Qualified'} legacy source labels: ${completed}`)
