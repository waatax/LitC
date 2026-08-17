#!/usr/bin/env node

/**
 * Evidence-oriented editorial audit for the active LitC corpus.
 *
 * This intentionally distinguishes "present" from "verified".  It audits the
 * generated work bundles that the application actually loads, and treats
 * source provenance, a real vernacular rendering, passage-specific analysis,
 * and structural linkage as separate requirements.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CHUNKS_DIR = path.join(ROOT, 'src', 'data', 'work_chunks')
const REVIEW_FILE = path.join(ROOT, 'src', 'data', 'editorialReviews.json')
const REPORT_JSON = path.join(ROOT, 'scratch', 'editorial_quality_audit.json')
const REPORT_MD = path.join(ROOT, 'docs', 'EDITORIAL_AUDIT_REPORT.md')

const strict = process.argv.includes('--strict')
const PUNCTUATION = /[\s\p{P}\p{S}]/gu
const BAD_UNICODE = /[\uFFFD\u25A0\uE000-\uF8FF]/u
const LITERAL_UNICODE_ESCAPE = /\\u[0-9a-fA-F]{4}/u
const TEMPLATE_MARKERS = [
  '經典名句：摘錄',
  '核心訓詁：著重解讀文節中',
  '深刻體現《',
  '為後世理解先秦兩漢學術源流與治國理政提供深遠啟示',
]

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('找不到 JSON.parse(...) WorkBundle payload')
  }
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function normalize(text) {
  return String(text ?? '').normalize('NFKC').replace(PUNCTUATION, '')
}

function bigrams(text) {
  const normalized = normalize(text)
  const grams = new Set()
  for (let i = 0; i < normalized.length - 1; i += 1) {
    grams.add(normalized.slice(i, i + 2))
  }
  return grams
}

function diceSimilarity(left, right) {
  const a = bigrams(left)
  const b = bigrams(right)
  if (!a.size && !b.size) return 1
  let overlap = 0
  for (const gram of a) if (b.has(gram)) overlap += 1
  return (2 * overlap) / (a.size + b.size)
}

function issue(issues, work, passage, field, code, severity, detail) {
  issues.push({
    workId: work?.id ?? '',
    workTitle: work?.title ?? '',
    passageId: passage?.id ?? '',
    field,
    code,
    severity,
    detail,
  })
}

function loadReviews() {
  if (!fs.existsSync(REVIEW_FILE)) return {}
  const payload = JSON.parse(fs.readFileSync(REVIEW_FILE, 'utf8'))
  const records = Array.isArray(payload) ? payload : payload.reviews
  if (Array.isArray(records)) {
    return Object.fromEntries(records.map((entry) => [entry.passageId ?? entry.id, entry]))
  }
  return records ?? payload
}

function reviewStatus(record, field) {
  const value = record?.[field]
  const status = typeof value === 'string' ? value : value?.status ?? ''
  const sources = Array.isArray(record?.sources) ? record.sources.filter(Boolean) : []
  const explicitlyPending = /待(?:原文|底本|來源|複核|校)/u.test(String(record?.notes ?? ''))
  return status === 'verified' && sources.length >= 2 && !explicitlyPending ? 'verified' : ''
}

const issues = []
const works = []
const allPassages = []
const ids = new Map()
const analysisGroups = new Map()
const canonicalGroups = new Map()
const reviews = loadReviews()

for (const filename of fs.readdirSync(CHUNKS_DIR).filter((name) => name.endsWith('.ts')).sort()) {
  const file = path.join(CHUNKS_DIR, filename)
  let bundle
  try {
    bundle = loadBundle(file)
  } catch (error) {
    issue(issues, { id: path.basename(filename, '.ts'), title: filename }, null, 'bundle', 'bundle_parse_error', 'error', error.message)
    continue
  }

  const work = bundle.work ?? {}
  const chapters = bundle.chapters ?? []
  const passages = bundle.passages ?? []
  const sentences = bundle.sentences ?? []
  works.push({ id: work.id, title: work.title, chapters: chapters.length, passages: passages.length, sentences: sentences.length })

  const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  const passageMap = new Map(passages.map((passage) => [passage.id, passage]))
  const sentenceMap = new Map(sentences.map((sentence) => [sentence.id, sentence]))

  for (const entity of [work, ...chapters, ...passages, ...sentences]) {
    if (!entity?.id) continue
    if (ids.has(entity.id)) issue(issues, work, null, 'structure', 'duplicate_id', 'error', `${entity.id} 亦見於 ${ids.get(entity.id)}`)
    else ids.set(entity.id, filename)
  }

  for (const chapterId of work.chapterIds ?? []) {
    if (!chapterMap.has(chapterId)) issue(issues, work, null, 'structure', 'missing_chapter_target', 'error', chapterId)
  }
  for (const chapter of chapters) {
    if (chapter.workId !== work.id) issue(issues, work, null, 'structure', 'chapter_work_mismatch', 'error', chapter.id)
    for (const passageId of chapter.passageIds ?? []) {
      if (!passageMap.has(passageId)) issue(issues, work, null, 'structure', 'missing_passage_target', 'error', `${chapter.id} → ${passageId}`)
    }
  }

  for (const passage of passages) {
    allPassages.push({ work, passage })
    const canonical = String(passage.canonicalText ?? '')
    const translation = String(passage.readingAid?.translation ?? '')
    const analysis = String(passage.readingAid?.analysis ?? '')
    const canonNorm = normalize(canonical)
    const transNorm = normalize(translation)
    if (canonNorm.length >= 40) {
      const canonicalGroup = canonicalGroups.get(canonNorm) ?? []
      canonicalGroup.push({ work, passage })
      canonicalGroups.set(canonNorm, canonicalGroup)
    }

    if (!chapterMap.has(passage.chapterId)) issue(issues, work, passage, 'structure', 'missing_parent_chapter', 'error', passage.chapterId)
    if (!canonical.trim()) issue(issues, work, passage, 'canonicalText', 'empty_canonical', 'error', '原文為空')
    if (BAD_UNICODE.test(canonical)) issue(issues, work, passage, 'canonicalText', 'bad_unicode', 'error', '含替代字元或私用區字元')
    if (LITERAL_UNICODE_ESCAPE.test(canonical)) issue(issues, work, passage, 'canonicalText', 'literal_unicode_escape', 'error', '原文仍含字面 \\uXXXX，表示 bundle 尚未正確解碼')

    const refs = Array.isArray(passage.sourceRefs) ? passage.sourceRefs : []
    if (!refs.length) issue(issues, work, passage, 'sourceRefs', 'missing_source', 'error', '沒有段落級來源')
    for (const ref of refs) {
      const locator = ref.url ?? ref.location
      if (!ref.label || (!ref.edition && !locator)) {
        issue(issues, work, passage, 'sourceRefs', 'incomplete_source_reference', 'warning', '來源須至少有標籤，並附版本或定位資訊')
      }
      if (locator) {
        try {
          const url = new URL(locator)
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol')
        } catch {
          issue(issues, work, passage, 'sourceRefs', 'invalid_source_url', 'error', String(locator))
        }
      }
    }
    const uniqueSources = new Set(refs.map((ref) => `${ref.label ?? ''}|${ref.edition ?? ''}|${ref.url ?? ref.location ?? ''}`))
    if (uniqueSources.size < 2) {
      issue(issues, work, passage, 'sourceRefs', 'single_source_only', 'warning', '尚未有兩個獨立來源交叉校勘')
    }

    if (!translation.trim()) issue(issues, work, passage, 'translation', 'empty_translation', 'error', '白話文為空')
    if (BAD_UNICODE.test(translation)) issue(issues, work, passage, 'translation', 'bad_unicode', 'error', '含替代字元或私用區字元')
    if (LITERAL_UNICODE_ESCAPE.test(translation)) issue(issues, work, passage, 'translation', 'literal_unicode_escape', 'error', '白話仍含字面 \\uXXXX，表示 bundle 尚未正確解碼')
    
    // Check intra-passage translation repetition
    const transSentences = translation.split(/(?<=[。！？])/).map(s => s.trim()).filter(s => s.length > 5)
    const uniqueTransSentences = new Set(transSentences)
    if (transSentences.length > 2 && uniqueTransSentences.size < transSentences.length - 1) {
      issue(issues, work, passage, 'translation', 'translation_repetition', 'error', '白話文內有重複句段')
    }
    const mid = Math.floor(translation.length / 2)
    if (translation.length > 40 && translation.slice(0, mid) === translation.slice(mid, mid * 2)) {
      issue(issues, work, passage, 'translation', 'translation_repetition', 'error', '白話文前後兩半完全相同')
    }

    if (canonNorm.length >= 8 && canonNorm === transNorm) {
      issue(issues, work, passage, 'translation', 'echo_translation', 'error', '去除標點後與原文完全相同')
    } else if (canonNorm.length >= 20 && transNorm.length >= 10) {
      const similarity = diceSimilarity(canonical, translation)
      const lengthRatio = transNorm.length / canonNorm.length
      if (similarity >= 0.86 && lengthRatio >= 0.75 && lengthRatio <= 1.35) {
        issue(issues, work, passage, 'translation', 'near_echo_translation', 'warning', `雙字組相似度 ${similarity.toFixed(3)}；長度比 ${lengthRatio.toFixed(2)}`)
      }
      if (lengthRatio < 0.5) {
        issue(issues, work, passage, 'translation', 'likely_truncated_translation', 'error', `白話／原文字數比僅 ${lengthRatio.toFixed(2)}，可能截短或文本不全`)
      }
    }

    if (!analysis.trim()) issue(issues, work, passage, 'analysis', 'empty_analysis', 'error', '解析為空')
    if (BAD_UNICODE.test(analysis)) issue(issues, work, passage, 'analysis', 'bad_unicode', 'error', '含替代字元或私用區字元')
    if (LITERAL_UNICODE_ESCAPE.test(analysis)) issue(issues, work, passage, 'analysis', 'literal_unicode_escape', 'error', '解析仍含字面 \\uXXXX，表示 bundle 尚未正確解碼')
    const analysisNormLen = normalize(analysis).length
    if (analysisNormLen > 0) {
      if (analysisNormLen < 100) {
        issue(issues, work, passage, 'analysis', 'thin_analysis', 'error', '解析少於 100 個非標點字元，資訊量不夠完整')
      } else if (analysisNormLen < 150) {
        issue(issues, work, passage, 'analysis', 'thin_analysis', 'warning', '解析少於 150 個非標點字元，可能略為單薄')
      }
    }
    const markerCount = TEMPLATE_MARKERS.filter((marker) => analysis.includes(marker)).length
    if (markerCount >= 2) {
      issue(issues, work, passage, 'analysis', 'generic_analysis_template', 'error', `命中 ${markerCount} 個跨段模板標記`)
    }
    const analysisKey = normalize(analysis)
    if (analysisKey) {
      const group = analysisGroups.get(analysisKey) ?? []
      group.push({ work, passage })
      analysisGroups.set(analysisKey, group)
    }

    const sentenceIds = passage.sentenceIds ?? []
    if (!sentenceIds.length) issue(issues, work, passage, 'structure', 'missing_sentence_links', 'error', '段落沒有句子連結')
    const linked = sentenceIds.map((id) => sentenceMap.get(id)).filter(Boolean)
    if (linked.length !== sentenceIds.length) issue(issues, work, passage, 'structure', 'missing_sentence_target', 'error', `${sentenceIds.length - linked.length} 個 sentenceId 無對應資料`)
    if (linked.some((sentence) => sentence.passageId !== passage.id)) issue(issues, work, passage, 'structure', 'sentence_parent_mismatch', 'error', '句子的 passageId 不一致')
    if (linked.length === sentenceIds.length && normalize(linked.map((sentence) => sentence.canonicalText ?? '').join('')) !== normalize(canonical)) {
      issue(issues, work, passage, 'structure', 'sentence_text_mismatch', 'error', '連結句子串接後不等於段落原文')
    }

    const review = reviews[passage.id]
    for (const field of ['canonicalText', 'translation', 'analysis']) {
      if (reviewStatus(review, field) !== 'verified') {
        issue(issues, work, passage, 'editorialReview', `unverified_${field}`, 'warning', `${field} 尚無 verified 人工紀錄`)
      }
    }
  }
}

for (const group of analysisGroups.values()) {
  if (group.length < 2) continue
  const distinctCanonicals = new Set(group.map(({ passage }) => normalize(passage.canonicalText)))
  if (distinctCanonicals.size === 1) continue
  for (const { work, passage } of group) {
    issue(issues, work, passage, 'analysis', 'duplicate_analysis', 'error', `與另外 ${group.length - 1} 段解析完全相同`)
  }
}

for (const group of canonicalGroups.values()) {
  if (group.length < 2) continue
  for (const { work, passage } of group) {
    issue(issues, work, passage, 'canonicalText', 'duplicate_canonical_text', 'warning', `與另外 ${group.length - 1} 段長篇原文完全相同；須確認是否重複收錄`)
  }
}

const byCode = Object.fromEntries(
  [...issues.reduce((map, item) => map.set(item.code, (map.get(item.code) ?? 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1]),
)
const bySeverity = Object.fromEntries(
  [...issues.reduce((map, item) => map.set(item.severity, (map.get(item.severity) ?? 0) + 1), new Map())],
)
const byWork = works.map((work) => {
  const workIssues = issues.filter((item) => item.workId === work.id)
  return {
    ...work,
    errors: workIssues.filter((item) => item.severity === 'error').length,
    warnings: workIssues.filter((item) => item.severity === 'warning').length,
  }
}).sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings))

const report = {
  generatedAt: new Date().toISOString(),
  scope: { works: works.length, passages: allPassages.length, entities: ids.size },
  summary: { totalIssues: issues.length, bySeverity, byCode },
  byWork,
  issues,
}

fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true })
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

const topCodes = Object.entries(byCode).slice(0, 20)
const topWorks = byWork.slice(0, 20)
const markdown = `# LitC 全庫編校診斷報告

> 產生時間：${report.generatedAt}  
> 範圍：${works.length} 部、${allPassages.length} 段  
> 判定原則：欄位非空不等於已校勘；原文來源、白話轉譯、段落專屬解析與人工覆核分開計數。

## 摘要

- 錯誤：${bySeverity.error ?? 0}
- 警告：${bySeverity.warning ?? 0}
- 問題總數：${issues.length}

## 問題類型（前 20）

| 類型 | 數量 |
| --- | ---: |
${topCodes.map(([code, count]) => `| ${code} | ${count} |`).join('\n')}

## 高風險作品（前 20）

| 作品 | 篇章 | 段落 | 錯誤 | 警告 |
| --- | ---: | ---: | ---: | ---: |
${topWorks.map((work) => `| ${work.title} | ${work.chapters} | ${work.passages} | ${work.errors} | ${work.warnings} |`).join('\n')}

## 使用方式

- node scripts/audit_editorial_quality.mjs：產生報告，回傳成功，適合盤點。
- node scripts/audit_editorial_quality.mjs --strict：只要仍有 error 就回傳失敗，適合品質閘門。
- 完整明細見 scratch/editorial_quality_audit.json。
`
fs.writeFileSync(REPORT_MD, markdown, 'utf8')

console.log(`Editorial audit: ${works.length} works, ${allPassages.length} passages`)
console.log(`Issues: ${bySeverity.error ?? 0} errors, ${bySeverity.warning ?? 0} warnings`)
for (const [code, count] of topCodes) console.log(`  ${code}: ${count}`)
console.log(`Reports: ${path.relative(ROOT, REPORT_MD)}, ${path.relative(ROOT, REPORT_JSON)}`)

if (strict && (bySeverity.error ?? 0) > 0) process.exitCode = 1
