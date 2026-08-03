import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const raw = fs.readFileSync(path.join(root, 'scratch/audit_7_rounds_results.json'), 'utf8');
const report = JSON.parse(raw);

console.log('=== 全庫 50 部典籍 7 次逆序校正總覽 ===\n');

for (const round of report) {
  console.log(`\n======================================================`);
  console.log(`【第 ${round.round} 次校正／第 ${round.round} 輪】（含 ${round.worksCount} 部典籍）`);
  console.log(`======================================================`);

  let roundPassages = 0;
  let roundSentences = 0;
  let roundChars = 0;
  let roundCleanWorks = 0;

  for (const w of round.results) {
    roundPassages += w.passagesCount;
    roundSentences += w.sentencesCount;
    roundChars += w.charsCount;
    if (w.isClean) roundCleanWorks++;

    console.log(`・《${w.title}》 [${w.id}]`);
    console.log(`   - 篇章結構：${w.chaptersCount} 章 | ${w.passagesCount} 段 | ${w.sentencesCount} 句 | ${w.charsCount} 字`);
    console.log(`   - 1. 古文經典文本校正：${w.ancientIssues.length === 0 ? '【完整無誤】' : '【存在 ' + w.ancientIssues.length + ' 處問題】'}`);
    console.log(`   - 2. 白話文確認：${w.translationIssues.length === 0 ? '【完整無誤】' : '【存在 ' + w.translationIssues.length + ' 處問題】'}`);
    console.log(`   - 3. 解析確認：${w.analysisIssues.length === 0 ? '【完整無誤】' : '【存在 ' + w.analysisIssues.length + ' 處問題】'}`);
  }

  console.log(`------------------------------------------------------`);
  console.log(`第 ${round.round} 輪小結：總計 ${round.results.length} 部典籍 (${roundPassages} 段 / ${roundSentences} 句 / ${roundChars} 字)`);
  console.log(`完美通過率：${roundCleanWorks} / ${round.results.length} 部 (${(roundCleanWorks / round.results.length * 100).toFixed(1)}%)`);
}
