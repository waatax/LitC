#!/usr/bin/env node

/** Apply narrowly scoped canonical corrections backed by named sources. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const json = JSON.stringify(bundle)
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(json)}) as WorkBundle\n`, 'utf8')
}

const file = path.join(ROOT, 'src', 'data', 'work_chunks', 'art-of-war.ts')
const bundle = loadBundle(file)
const passage = bundle.passages.find((entry) => entry.id === 'art-of-war_ch-3_p-1')
const sentence = bundle.sentences.find((entry) => entry.id === 'art-of-war_ch-3_p-1_s-1')
const oldPassage = '孫子曰：凡用兵之法，全國為上，破國次之；全旅為上，破旅次之；全卒為上，破卒次之；全伍為上，破伍次之。是故百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。'
const newPassage = '孫子曰：凡用兵之法，全國為上，破國次之；全軍為上，破軍次之；全旅為上，破旅次之；全卒為上，破卒次之；全伍為上，破伍次之。是故百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。'
const oldSentence = '孫子曰：凡用兵之法，全國為上，破國次之；'
const newSentence = '孫子曰：凡用兵之法，全國為上，破國次之；全軍為上，破軍次之；'

if (!passage || !sentence) throw new Error('找不到 art-of-war_ch-3_p-1 或其首句')
if (passage.canonicalText !== oldPassage) throw new Error('原文前置條件不符；拒絕套用，請重新校勘')
if (sentence.canonicalText !== oldSentence) throw new Error('句子前置條件不符；拒絕套用，請重新校勘')

passage.canonicalText = newPassage
sentence.canonicalText = newSentence
sentence.chunks = [[newSentence, 'zh-Hant']]
passage.sourceRefs = [
  {
    label: '中國哲學書電子化計劃〈謀攻〉',
    edition: '通行本',
    location: 'https://ctext.org/text.pl?if=zh&node=20924',
    accessedAt: '2026-08-14',
  },
  {
    label: '《十一家注孫子》〈謀攻篇〉',
    edition: '維基文庫校錄本',
    location: 'https://zh.wikisource.org/wiki/十一家注孫子/謀攻篇',
    accessedAt: '2026-08-14',
  },
]
bundle.work.totalChars = bundle.passages.reduce((total, entry) => total + String(entry.canonicalText ?? '').length, 0)

if (APPLY) writeBundle(file, bundle)
console.log(`${APPLY ? 'Applied' : 'Dry run'}: restored 「全軍為上，破軍次之」 in art-of-war_ch-3_p-1`)
