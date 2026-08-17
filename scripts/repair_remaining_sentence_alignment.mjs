#!/usr/bin/env node

/** Rebuild only passages whose sentence text does not match their canonical text. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const APPLY = process.argv.includes('--apply')
const PUNCTUATION = /[\s\p{P}\p{S}]/gu

const normalize = (text) => String(text ?? '').normalize('NFKC').replace(PUNCTUATION, '')

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
    buffer += text[index]
    if (!'。！？；!?;'.includes(text[index])) continue
    while (index + 1 < text.length && '」』”》〉'.includes(text[index + 1])) buffer += text[index += 1]
    result.push(buffer)
    buffer = ''
  }
  if (buffer) result.push(buffer)
  return result.filter(Boolean)
}

let repaired = 0
const results = []
for (const filename of fs.readdirSync(DIR).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(DIR, filename)
  const bundle = loadBundle(file)
  const sentenceMap = new Map(bundle.sentences.map((sentence) => [sentence.id, sentence]))
  const mismatched = bundle.passages.filter((passage) => {
    const linked = (passage.sentenceIds ?? []).map((id) => sentenceMap.get(id)).filter(Boolean)
    return linked.length === passage.sentenceIds.length
      && normalize(linked.map((sentence) => sentence.canonicalText).join('')) !== normalize(passage.canonicalText)
  })
  if (!mismatched.length) continue

  const mismatchIds = new Set(mismatched.map((passage) => passage.id))
  const replacements = []
  for (const passage of mismatched) {
    const parts = splitSentences(passage.canonicalText)
    if (!parts.length || parts.join('') !== passage.canonicalText) throw new Error(`無法無損切分 ${passage.id}`)
    passage.sentenceIds = parts.map((_, index) => `${passage.id}_s-${index + 1}`)
    parts.forEach((canonicalText, index) => replacements.push({
      id: passage.sentenceIds[index],
      passageId: passage.id,
      order: index + 1,
      canonicalText,
      chunks: [[canonicalText, 'zh-Hant']],
    }))
  }
  bundle.sentences = bundle.sentences.filter((sentence) => !mismatchIds.has(sentence.passageId)).concat(replacements)
  repaired += mismatched.length
  results.push({ workId: bundle.work.id, passages: mismatched.length, sentences: replacements.length })

  if (APPLY) {
    const json = JSON.stringify(bundle)
    fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(json)}) as WorkBundle\n`, 'utf8')
  }
}

if (!repaired) console.log('No mismatched passages found')
console.log(`${APPLY ? 'Applied' : 'Dry run'}: rebuilt ${repaired} mismatched passages`)
for (const result of results) console.log(`  ${result.workId}: ${result.passages} passages, ${result.sentences} sentences`)
