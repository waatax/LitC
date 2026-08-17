#!/usr/bin/env node

/**
 * Recover passage-specific translations and analyses from historical reading-aid
 * batches, but only when each field passes conservative, independently measured
 * quality gates. Defaults to dry-run; pass --apply to update active work bundles.
 */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CHUNKS = path.join(ROOT, 'src', 'data', 'work_chunks')
const RESULTS = path.join(ROOT, 'scratch', 'reading_aid_results')
const AUDIT = path.join(ROOT, 'scratch', 'editorial_quality_audit.json')
const APPLY = process.argv.includes('--apply')
const PUNCTUATION = /[\s\p{P}\p{S}]/gu
const BAD_UNICODE = /[\uFFFD\u25A0\uE000-\uF8FF]/u

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0) throw new Error(`Cannot locate bundle payload: ${file}`)
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  const output = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`
  fs.writeFileSync(file, output, 'utf8')
}

function normalize(text) {
  return String(text ?? '').normalize('NFKC').replace(PUNCTUATION, '')
}

function bigrams(text) {
  const value = normalize(text)
  const result = new Set()
  for (let i = 0; i < value.length - 1; i += 1) result.add(value.slice(i, i + 2))
  return result
}

function dice(left, right) {
  const a = bigrams(left)
  const b = bigrams(right)
  if (!a.size && !b.size) return 1
  let overlap = 0
  for (const gram of a) if (b.has(gram)) overlap += 1
  return (2 * overlap) / (a.size + b.size)
}

function qualifiedTranslation(canonical, translation) {
  const source = normalize(canonical)
  const target = normalize(translation)
  if (!target || BAD_UNICODE.test(translation) || source === target) return false
  const ratio = target.length / Math.max(1, source.length)
  if (source.length >= 40 && ratio < 0.42) return false
  if (ratio > 4.5) return false
  if (source.length >= 20 && ratio >= 0.72 && ratio <= 1.45 && dice(canonical, translation) >= 0.84) return false
  if (/。。|，，|，。|；。|的的|且的|而的|以的|於的|謂的|矣的|焉的|乎的|兮的/u.test(translation)) return false
  if (/這告訴我們順應自然|不刻意強求|本段大意是|大致是在說/u.test(translation)) return false
  const modernSignals = translation.match(/的|了|是|把|在|這|那|他|她|它|們|沒有|可以|因此|所以|就是|應該/gu)?.length ?? 0
  if (target.length >= 30 && modernSignals === 0 && dice(canonical, translation) > 0.65) return false
  return true
}

const ANALYSIS_BOILERPLATE = [
  '在本段落',
  '透過生動的文學寓意與哲理對話',
  '展現了具體的思想境界與人生情境',
  '文中所用關鍵詞彙',
  '文中所出現的核心詞彙與名物典故',
  '具備特殊的哲學與文學意涵',
  '需結合章節語境',
  '針對具體治理問題與理論主張展開嚴密闡述',
  '針對戰國晚期的社會變局與思想衝突，展開了嚴密而深邃的理性論辯',
  '結合《荀子》語境指代特定哲學概念與名物規範',
  '本段文字體現了墨家學說',
  '墨子透過嚴密的思辨與生動的比喻',
  '春秋戰國之際社會變革劇烈',
  '文中運用當時典範之文言虛實詞與論辯句式',
  '本段在篇章結構上脈絡清晰',
  '在修辭與篇章結構上，荀子善用譬喻與層遞對比',
  '充分彰顯',
  '對後世產生深遠影響',
]

function sanitizeAnalysis(analysis) {
  const lines = String(analysis ?? '').split(/\r?\n/u)
  const cleaned = []
  for (const line of lines) {
    if (/^\s*【[^】]+】\s*$/u.test(line)) {
      cleaned.push(line.trim())
      continue
    }
    const sentences = line.match(/[^。！？]+[。！？]?/gu) ?? []
    const retained = sentences
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .filter((sentence) => !ANALYSIS_BOILERPLATE.some((phrase) => sentence.includes(phrase)))
    if (retained.length) cleaned.push(retained.join(''))
  }
  const compact = []
  for (let index = 0; index < cleaned.length; index += 1) {
    if (/^【[^】]+】$/u.test(cleaned[index])) {
      const next = cleaned[index + 1]
      if (!next || /^【[^】]+】$/u.test(next)) continue
    }
    compact.push(cleaned[index])
  }
  return compact.join('\n').trim()
}

function quotedTextOverlap(canonical, analysis) {
  const source = normalize(canonical)
  const quotes = [...analysis.matchAll(/[「『“"]([^」』”"]{2,80})[」』”"]/gu)]
    .map((match) => normalize(match[1]).split(/…|\.\.\./u)[0])
    .filter((quote) => quote.length >= 2)
  if (quotes.some((quote) => source.includes(quote.slice(0, Math.min(quote.length, 12))))) return true
  return dice(canonical, analysis) >= 0.08
}

function qualifiedAnalysis(canonical, analysis, sourceFile) {
  const permittedFiles = new Set(['cai-gen-tan.json', 'zhuangzi.json', 'mo-zi.json', 'xunzi.json'])
  if (!permittedFiles.has(sourceFile)) return false
  const value = normalize(analysis)
  if (value.length < 100 || BAD_UNICODE.test(analysis)) return false
  const headings = analysis.match(/【[^】]{2,16}】/gu) ?? []
  if (headings.length < 2) return false
  const boilerplateCount = ANALYSIS_BOILERPLATE.filter((phrase) => analysis.includes(phrase)).length
  if (boilerplateCount) return false
  const lenses = ['主題', '背景', '語境', '詞義', '名物', '篇章', '結構', '修辭', '思想', '義理', '史學', '筆法', '敘事', '評析']
  if (new Set(lenses.filter((lens) => analysis.includes(lens))).size < 3) return false
  if (!quotedTextOverlap(canonical, analysis)) return false
  if (sourceFile !== 'cai-gen-tan.json') {
    const stopTerms = new Set(['是以', '故曰', '所謂', '此謂', '然則', '何謂'])
    const terms = [...analysis.matchAll(/[「『]([^」』]{2,16})[」』]\s*[：:]/gu)]
      .map((match) => normalize(match[1]))
      .filter((term) => term.length >= 2 && !stopTerms.has(term))
    const canonicalNorm = normalize(canonical)
    if (!terms.length || terms.some((term) => !canonicalNorm.includes(term))) return false
  }
  return true
}

const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'))
const analysisTargets = new Set(audit.issues.filter((item) => item.code === 'generic_analysis_template').map((item) => item.passageId))
const translationTargets = new Set(audit.issues.filter((item) => ['echo_translation', 'near_echo_translation', 'likely_truncated_translation'].includes(item.code)).map((item) => item.passageId))

const candidates = new Map()
for (const filename of fs.readdirSync(RESULTS).filter((name) => name.endsWith('.json')).sort()) {
  let payload
  try { payload = JSON.parse(fs.readFileSync(path.join(RESULTS, filename), 'utf8')) } catch { continue }
  const records = Array.isArray(payload) ? payload : payload.results
  if (!Array.isArray(records)) continue
  for (const record of records) {
    const passageId = record.passageId ?? record.id
    if (!passageId) continue
    const group = candidates.get(passageId) ?? []
    group.push({ ...record, sourceFile: filename })
    candidates.set(passageId, group)
  }
}

const sanitizedAnalysisFrequency = new Map()
for (const options of candidates.values()) {
  for (const item of options) {
    const key = normalize(sanitizeAnalysis(item.analysis))
    if (key) sanitizedAnalysisFrequency.set(key, (sanitizedAnalysisFrequency.get(key) ?? 0) + 1)
  }
}

const totals = { translation: 0, analysis: 0 }
const byWork = new Map()
const provenance = []

for (const filename of fs.readdirSync(CHUNKS).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(CHUNKS, filename)
  const bundle = loadBundle(file)
  let modified = false
  const workStats = { translation: 0, analysis: 0 }
  for (const passage of bundle.passages ?? []) {
    const options = candidates.get(passage.id) ?? []
    if (!options.length) continue
    const aid = passage.readingAid ?? (passage.readingAid = {})

    if (translationTargets.has(passage.id)) {
      const accepted = options
        .filter((item) => qualifiedTranslation(passage.canonicalText, item.translation))
        .sort((a, b) => normalize(b.translation).length - normalize(a.translation).length)[0]
      if (accepted) {
        aid.translation = accepted.translation.trim()
        totals.translation += 1
        workStats.translation += 1
        provenance.push({ passageId: passage.id, field: 'translation', sourceFile: accepted.sourceFile })
        modified = true
      }
    }

    if (analysisTargets.has(passage.id)) {
      const accepted = options
        .map((item) => ({ ...item, analysis: sanitizeAnalysis(item.analysis) }))
        .filter((item) => sanitizedAnalysisFrequency.get(normalize(item.analysis)) === 1)
        .filter((item) => qualifiedAnalysis(passage.canonicalText, item.analysis, item.sourceFile))
        .sort((a, b) => normalize(b.analysis).length - normalize(a.analysis).length)[0]
      if (accepted) {
        aid.analysis = accepted.analysis.trim()
        totals.analysis += 1
        workStats.analysis += 1
        provenance.push({ passageId: passage.id, field: 'analysis', sourceFile: accepted.sourceFile, preview: accepted.analysis.slice(0, 600) })
        modified = true
      }
    }
  }
  if (modified && APPLY) writeBundle(file, bundle)
  if (workStats.translation || workStats.analysis) byWork.set(bundle.work?.title ?? filename, workStats)
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: APPLY ? 'apply' : 'dry-run',
  totals,
  byWork: Object.fromEntries([...byWork].sort((a, b) => (b[1].translation + b[1].analysis) - (a[1].translation + a[1].analysis))),
  provenance,
}
fs.writeFileSync(path.join(ROOT, 'scratch', 'qualified_asset_recovery.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`${APPLY ? 'Applied' : 'Qualified'} translations: ${totals.translation}`)
console.log(`${APPLY ? 'Applied' : 'Qualified'} analyses: ${totals.analysis}`)
for (const [work, stats] of byWork) console.log(`${work}\ttranslation=${stats.translation}\tanalysis=${stats.analysis}`)
