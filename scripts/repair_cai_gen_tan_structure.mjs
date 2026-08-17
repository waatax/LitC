#!/usr/bin/env node

/** Rebuild the stale passage/sentence indexes in the active 《菜根譚》 bundle. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FILE = path.join(ROOT, 'src', 'data', 'work_chunks', 'cai-gen-tan.ts')
const APPLY = process.argv.includes('--apply')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function splitSentences(text) {
  const result = []
  let buffer = ''
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    buffer += char
    if (!'。！？；!?;'.includes(char)) continue
    while (index + 1 < text.length && '」』”》〉'.includes(text[index + 1])) {
      index += 1
      buffer += text[index]
    }
    if (buffer) result.push(buffer)
    buffer = ''
  }
  if (buffer) result.push(buffer)
  return result.filter((sentence) => sentence.length > 0)
}

const bundle = loadBundle(FILE)
if (bundle.work.id !== 'cai-gen-tan' || bundle.passages.length !== 366) {
  throw new Error('前置條件不符：預期《菜根譚》且為 366 段')
}

const passageByChapter = new Map()
const sentences = []
for (const passage of bundle.passages) {
  const group = passageByChapter.get(passage.chapterId) ?? []
  group.push(passage)
  passageByChapter.set(passage.chapterId, group)

  const parts = splitSentences(String(passage.canonicalText ?? ''))
  if (!parts.length || parts.join('') !== passage.canonicalText) {
    throw new Error(`無法無損切分 ${passage.id}`)
  }
  passage.sentenceIds = parts.map((_, index) => `${passage.id}_s-${index + 1}`)
  parts.forEach((canonicalText, index) => {
    sentences.push({
      id: passage.sentenceIds[index],
      passageId: passage.id,
      order: index + 1,
      canonicalText,
      chunks: [[canonicalText, 'zh-Hant']],
    })
  })
}

for (const chapter of bundle.chapters) {
  const passages = (passageByChapter.get(chapter.id) ?? []).sort((a, b) => a.order - b.order)
  chapter.passageIds = passages.map((passage) => passage.id)
}
bundle.sentences = sentences
bundle.work.totalChars = bundle.passages.reduce((total, passage) => total + passage.canonicalText.length, 0)

if (APPLY) {
  const json = JSON.stringify(bundle)
  const source = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(json)}) as WorkBundle\n`
  fs.writeFileSync(FILE, source, 'utf8')
}

console.log(`${APPLY ? 'Applied' : 'Dry run'}: 366 passages, ${sentences.length} rebuilt sentences`)
