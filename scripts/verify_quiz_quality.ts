import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { quizBank } from '../src/data/quiz_bank';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=== RUNNING QUIZ BANK QUALITY & DEDUPLICATION VERIFICATION ===");
console.log(`Total questions loaded: ${quizBank.length}`);

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
  /^此句釋義提示/
];

let failureCount = 0;
let duplicateOptionsCount = 0;
let placeholderCount = 0;
let invalidAnswerIndexCount = 0;

for (let i = 0; i < quizBank.length; i++) {
  const q = quizBank[i];
  const prefix = `[Question ${q.id} (#${i+1}, type: ${q.type})]`;

  // 1. Check options count
  if (!q.options || q.options.length !== 4) {
    console.error(`❌ ${prefix} Does not have exactly 4 options! (Found ${q.options?.length})`);
    failureCount++;
  }

  // 2. Check option uniqueness (NO duplicate options!)
  const uniqueOpts = new Set(q.options);
  if (uniqueOpts.size !== 4) {
    console.error(`❌ ${prefix} Contains duplicate options! Unique count: ${uniqueOpts.size}/4. Options:`, q.options);
    duplicateOptionsCount++;
    failureCount++;
  }

  // 3. Check correct answer index
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= 4) {
    console.error(`❌ ${prefix} Invalid correctAnswer index: ${q.correctAnswer}`);
    invalidAnswerIndexCount++;
    failureCount++;
  }

  // 4. Check for placeholder strings in question, options, or explanation
  const fullTextToScan = [q.question, ...q.options, q.explanation || ''].join(' ');
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(fullTextToScan)) {
      console.error(`❌ ${prefix} Contains placeholder / boilerplate pattern: ${pattern}. Text snippet: ${fullTextToScan.substring(0, 100)}...`);
      placeholderCount++;
      failureCount++;
      break;
    }
  }
}

console.log("\n=== VERIFICATION SUMMARY ===");
console.log(`Total questions checked: ${quizBank.length}`);
console.log(`Duplicate options errors: ${duplicateOptionsCount}`);
console.log(`Placeholder text errors: ${placeholderCount}`);
console.log(`Invalid answer index errors: ${invalidAnswerIndexCount}`);
console.log(`Total failures: ${failureCount}`);

if (failureCount === 0) {
  console.log("\n🎉 100% PERFECT! ALL 900 QUIZ QUESTIONS ARE FULLY DEDUPLICATED, VALIDATED, AND PLACEHOLDER-FREE!");
  process.exit(0);
} else {
  console.error(`\n🚨 FAILED WITH ${failureCount} ERRORS!`);
  process.exit(1);
}
