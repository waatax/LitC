#!/usr/bin/env node

/** Add only manually opened, full-work secondary source pages to passage provenance. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const APPLY = process.argv.includes('--apply')
const VERIFIED_AT = '2026-08-14'
const SOURCES = {
  'li-ji': ['禮記', 'https://zh.wikisource.org/wiki/%E7%A6%AE%E8%A8%98'],
  zhuangzi: ['莊子', 'https://zh.wikisource.org/wiki/%E8%8E%8A%E5%AD%90'],
  'mo-zi': ['墨子', 'https://zh.wikisource.org/wiki/%E5%A2%A8%E5%AD%90'],
  xunzi: ['荀子', 'https://zh.wikisource.org/wiki/%E8%8D%80%E5%AD%90'],
  'han-fei-zi': ['韓非子', 'https://zh.wikisource.org/wiki/%E9%9F%93%E9%9D%9E%E5%AD%90'],
  'shu-jing': ['尚書', 'https://zh.wikisource.org/wiki/%E5%B0%9A%E6%9B%B8'],
  'gu-wen-guan-zhi': ['古文觀止', 'https://zh.wikisource.org/wiki/%E5%8F%A4%E6%96%87%E8%A7%80%E6%AD%A2'],
  'cai-gen-tan': ['菜根譚', 'https://zh.wikisource.org/wiki/%E8%8F%9C%E6%A0%B9%E8%AD%9A'],
  'chun-qiu-zuo-zhuan': ['春秋左氏傳', 'https://zh.wikisource.org/wiki/%E6%98%A5%E7%A7%8B%E5%B7%A6%E6%B0%8F%E5%82%B3'],
  'shi-jing': ['詩經', 'https://zh.wikisource.org/wiki/%E8%A9%A9%E7%B6%93'],
  'chun-qiu': ['春秋', 'https://zh.wikisource.org/wiki/%E6%98%A5%E7%A7%8B'],
  wenzi: ['文子', 'https://zh.wikisource.org/wiki/%E6%96%87%E5%AD%90'],
  'wenshi-zhenjing': ['關尹子', 'https://zh.wikisource.org/wiki/%E9%97%9C%E5%B0%B9%E5%AD%90'],
  'hou-han-shu': ['後漢書', 'https://zh.wikisource.org/wiki/%E5%BE%8C%E6%BC%A2%E6%9B%B8'],
  liezi: ['列子', 'https://zh.wikisource.org/wiki/%E5%88%97%E5%AD%90'],
  'han-shu': ['漢書', 'https://zh.wikisource.org/wiki/%E6%BC%A2%E6%9B%B8'],
  'dao-de-jing': ['道德經', 'https://zh.wikisource.org/wiki/%E9%81%93%E5%BE%B7%E7%B6%93'],
  'art-of-war': ['孫子兵法', 'https://zh.wikisource.org/wiki/%E5%AD%AB%E5%AD%90%E5%85%B5%E6%B3%95'],
  'si-ma-fa': ['司馬法', 'https://zh.wikisource.org/wiki/%E5%8F%B8%E9%A6%AC%E6%B3%95'],
  shenzi: ['慎子', 'https://zh.wikisource.org/wiki/%E6%85%8E%E5%AD%90'],
  'three-strategies': ['三略', 'https://zh.wikisource.org/wiki/%E4%B8%89%E7%95%A5'],
  shiji: ['史記', 'https://zh.wikisource.org/wiki/%E5%8F%B2%E8%A8%98'],
  'xijing-zaji': ['西京雜記', 'https://zh.wikisource.org/wiki/%E8%A5%BF%E4%BA%AC%E9%9B%9C%E8%A8%98'],
  'guo-yu': ['國語', 'https://zh.wikisource.org/wiki/%E5%9C%8B%E8%AA%9E'],
  guanzi: ['管子', 'https://zh.wikisource.org/wiki/%E7%AE%A1%E5%AD%90'],
  'wei-liao-zi': ['尉繚子', 'https://zh.wikisource.org/wiki/%E5%B0%89%E7%B9%9A%E5%AD%90'],
  'wu-zi': ['吳子', 'https://zh.wikisource.org/wiki/%E5%90%B3%E5%AD%90'],
  'gu-san-fen': ['古三墳', 'https://zh.wikisource.org/wiki/%E5%8F%A4%E4%B8%89%E5%A2%B3'],
  'dong-guan-han-ji': ['東觀漢記', 'https://zh.wikisource.org/wiki/%E6%9D%B1%E8%A7%80%E6%BC%A2%E8%A8%98'],
  'yan-tie-lun': ['鹽鐵論', 'https://zh.wikisource.org/wiki/%E9%B9%BD%E9%90%B5%E8%AB%96'],
  'zhan-guo-ce': ['戰國策', 'https://zh.wikisource.org/wiki/%E6%88%B0%E5%9C%8B%E7%AD%96'],
  'shen-bu-hai': ['申子', 'https://zh.wikisource.org/wiki/%E7%94%B3%E5%AD%90'],
  'wu-yue-chun-qiu': ['吳越春秋', 'https://zh.wikisource.org/wiki/%E5%90%B3%E8%B6%8A%E6%98%A5%E7%A7%8B'],
  'mutianzi-zhuan': ['穆天子傳', 'https://zh.wikisource.org/wiki/%E7%A9%86%E5%A4%A9%E5%AD%90%E5%82%B3'],
  'yue-jue-shu': ['越絕書', 'https://zh.wikisource.org/wiki/%E8%B6%8A%E7%B5%95%E6%9B%B8'],
  yandanzi: ['燕丹子', 'https://zh.wikisource.org/wiki/%E7%87%95%E4%B8%B9%E5%AD%90'],
  'zhushu-jinian': ['竹書紀年', 'https://zh.wikisource.org/wiki/%E7%AB%B9%E6%9B%B8%E7%B4%80%E5%B9%B4'],
  'liu-tao': ['六韜', 'https://zh.wikisource.org/wiki/%E5%85%AD%E9%9F%9C'],
  'gongyang-zhuan': ['春秋公羊傳', 'https://zh.wikisource.org/wiki/%E6%98%A5%E7%A7%8B%E5%85%AC%E7%BE%8A%E5%82%B3'],
  'guliang-zhuan': ['春秋穀梁傳', 'https://zh.wikisource.org/wiki/%E6%98%A5%E7%A7%8B%E7%A9%80%E6%A2%81%E5%82%B3'],
  'jian-zhu-ke-shu': ['諫逐客書', 'https://zh.wikisource.org/wiki/%E8%AB%AB%E9%80%90%E5%AE%A2%E6%9B%B8'],
  'qian-han-ji': ['前漢紀', 'https://zh.wikisource.org/wiki/%E5%89%8D%E6%BC%A2%E7%B4%80'],
  'yanzi-chun-qiu': ['晏子春秋', 'https://zh.wikisource.org/wiki/%E6%99%8F%E5%AD%90%E6%98%A5%E7%A7%8B'],
  'lie-nv-zhuan': ['列女傳', 'https://zh.wikisource.org/wiki/%E5%88%97%E5%A5%B3%E5%82%B3'],
  'lost-book-of-zhou': ['逸周書', 'https://zh.wikisource.org/wiki/%E9%80%B8%E5%91%A8%E6%9B%B8'],
}

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

let additions = 0
const byWork = {}
for (const filename of fs.readdirSync(DIR).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(DIR, filename)
  const bundle = loadBundle(file)
  const source = SOURCES[bundle.work?.id]
  if (!source) continue
  let changed = 0
  for (const passage of bundle.passages ?? []) {
    const refs = Array.isArray(passage.sourceRefs) ? passage.sourceRefs : (passage.sourceRefs = [])
    const unique = new Set(refs.map((ref) => `${ref.label ?? ''}|${ref.edition ?? ''}|${ref.url ?? ref.location ?? ''}`))
    const next = {
      label: `維基文庫《${source[0]}》全文`,
      edition: `維基文庫繁體全文頁（人工開啟核實 ${VERIFIED_AT}）`,
      url: source[1],
    }
    const key = `${next.label}|${next.edition}|${next.url}`
    if (unique.size < 2 && !unique.has(key)) {
      refs.push(next)
      additions += 1
      changed += 1
    }
  }
  if (changed) {
    byWork[bundle.work.id] = changed
    if (APPLY) writeBundle(file, bundle)
  }
}

console.log(`${APPLY ? 'Added' : 'Qualified'} verified secondary source references: ${additions}`)
console.log(byWork)
