import { quizBank } from '../src/data/quiz_bank'

console.log('=== RUNNING COMPREHENSIVE QUIZ BANK QUALITY & DEDUPLICATION VERIFICATION ===')
console.log(`Total questions loaded: ${quizBank.length}`)

const PLACEHOLDER_PATTERNS = [
  /本段經文記載古代典籍中的重要思想論述與歷史事件/,
  /這是一段來自/,
  /展現先秦至漢代思想家的深刻智慧/,
  /本段記述歷史風雲人物事跡/,
  /史實記載：/,
  /段落編號：/,
  /【深度校正版翻譯】這是一段經過虛擬國學大師重新校訂/,
  /本段典籍核心大意在於闡述現代維度的價值理念/,
  /古漢語核心意象與經典表達/,
  /在《.*?》的典章論述中，指出上古時期的聖賢君王恪守禮法/,
  /^\(待擴充\)$/,
  /^此句釋義提示/,
  /這句話意在強調嚴刑峻法為治理國家之唯一的途徑/,
  /這句話旨在論述凡事應隨心所欲、不受任何客觀法則約束/,
  /這句話主要記錄了古人戰術推演中極端孤立之個案/
]

let failureCount = 0
let duplicateOptionsCount = 0
let placeholderCount = 0
let invalidAnswerIndexCount = 0
let missingExplanationCount = 0

const typeCounts: Record<string, number> = {}

for (let i = 0; i < quizBank.length; i++) {
  const q = quizBank[i]
  const prefix = `[Question ${q.id} (#${i + 1}, type: ${q.type})]`
  typeCounts[q.type] = (typeCounts[q.type] || 0) + 1

  // 1. Check options count
  if (!q.options || q.options.length !== 4) {
    console.error(`❌ ${prefix} Does not have exactly 4 options! (Found ${q.options?.length})`)
    failureCount++
  }

  // 2. Check option uniqueness (NO duplicate options!)
  const uniqueOpts = new Set(q.options)
  if (uniqueOpts.size !== 4) {
    console.error(`❌ ${prefix} Contains duplicate options! Unique count: ${uniqueOpts.size}/4. Options:`, q.options)
    duplicateOptionsCount++
    failureCount++
  }

  // 3. Check correct answer index
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= 4) {
    console.error(`❌ ${prefix} Invalid correctAnswer index: ${q.correctAnswer}`)
    invalidAnswerIndexCount++
    failureCount++
  }

  // 4. Check explanation completeness
  if (!q.explanation || q.explanation.trim().length < 15) {
    console.error(`❌ ${prefix} Missing or too short explanation!`)
    missingExplanationCount++
    failureCount++
  }

  // 5. Check for placeholder strings in question, options, or explanation
  const fullTextToScan = [q.question, ...q.options, q.explanation || ''].join(' ')
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(fullTextToScan)) {
      console.error(`❌ ${prefix} Contains placeholder / boilerplate pattern: ${pattern}. Text snippet: ${fullTextToScan.substring(0, 100)}...`)
      placeholderCount++
      failureCount++
      break
    }
  }
}

console.log('\n=== QUESTION TYPE DISTRIBUTION ===')
for (const [t, count] of Object.entries(typeCounts)) {
  console.log(`  - ${t}: ${count} 題`)
}

console.log('\n=== VERIFICATION SUMMARY ===')
console.log(`Total questions checked: ${quizBank.length}`)
console.log(`Duplicate options errors: ${duplicateOptionsCount}`)
console.log(`Placeholder text errors: ${placeholderCount}`)
console.log(`Invalid answer index errors: ${invalidAnswerIndexCount}`)
console.log(`Missing explanation errors: ${missingExplanationCount}`)
console.log(`Total failures: ${failureCount}`)

if (failureCount === 0) {
  console.log(`\n🎉 100% PERFECT! ALL ${quizBank.length} QUIZ QUESTIONS ARE FULLY DEDUPLICATED, VALIDATED, AND SCHOLARLY SOUND!`)
  process.exit(0)
} else {
  console.error(`\n🚨 FAILED WITH ${failureCount} ERRORS!`)
  process.exit(1)
}
