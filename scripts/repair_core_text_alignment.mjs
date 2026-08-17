#!/usr/bin/env node

/** Repair two corpus-wide alignment defects found by the editorial audit. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')

function loadBundle(workId) {
  const file = path.join(ROOT, 'src', 'data', 'work_chunks', `${workId}.ts`)
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return { file, bundle: vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 }) }
}

function writeBundle(file, bundle) {
  const json = JSON.stringify(bundle)
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(json)}) as WorkBundle\n`, 'utf8')
}

function splitSentences(text) {
  const result = []
  let buffer = ''
  for (let index = 0; index < text.length; index += 1) {
    buffer += text[index]
    if (!'。！？；!?;'.includes(text[index])) continue
    while (index + 1 < text.length && '」』”》〉'.includes(text[index + 1])) buffer += text[index += 1]
    result.push(buffer)
    buffer = ''
  }
  if (buffer) result.push(buffer)
  return result.filter(Boolean)
}

const shiJing = loadBundle('shi-jing')
const escapedCanonical = shiJing.bundle.passages.filter((passage) => passage.canonicalText.includes('\\n'))
const escapedTranslation = shiJing.bundle.passages.filter((passage) => passage.readingAid?.translation?.includes('\\n'))
if (escapedCanonical.length !== 305 || escapedTranslation.length !== 275) {
  throw new Error(`《詩經》前置條件不符：原文 ${escapedCanonical.length}，白話 ${escapedTranslation.length}`)
}
for (const passage of shiJing.bundle.passages) {
  passage.canonicalText = passage.canonicalText.replaceAll('\\n', '\n')
  if (passage.readingAid?.translation) passage.readingAid.translation = passage.readingAid.translation.replaceAll('\\n', '\n')
}
shiJing.bundle.work.totalChars = shiJing.bundle.passages.reduce((total, passage) => total + passage.canonicalText.length, 0)

const chunQiu = loadBundle('chun-qiu')
if (chunQiu.bundle.passages.length !== 242) throw new Error('《春秋》前置條件不符：預期 242 段')
const rebuiltSentences = []
for (const passage of chunQiu.bundle.passages) {
  const parts = splitSentences(passage.canonicalText)
  if (!parts.length || parts.join('') !== passage.canonicalText) throw new Error(`《春秋》無法無損切分 ${passage.id}`)
  passage.sentenceIds = parts.map((_, index) => `${passage.id}_s-${index + 1}`)
  parts.forEach((canonicalText, index) => rebuiltSentences.push({
    id: passage.sentenceIds[index],
    passageId: passage.id,
    order: index + 1,
    canonicalText,
    chunks: [[canonicalText, 'zh-Hant']],
  }))
}
chunQiu.bundle.sentences = rebuiltSentences

if (APPLY) {
  writeBundle(shiJing.file, shiJing.bundle)
  writeBundle(chunQiu.file, chunQiu.bundle)
}
console.log(`${APPLY ? 'Applied' : 'Dry run'}: normalized 305 《詩經》 passages and rebuilt ${rebuiltSentences.length} 《春秋》 sentences`)
