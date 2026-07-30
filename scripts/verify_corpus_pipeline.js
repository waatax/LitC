import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

console.log('================================================================');
console.log(' LitC 全文庫 50 部典籍白話文對照與專屬解析自動掃描與核驗程序 ');
console.log('================================================================\n');

// Generic annotation regex from audit_corpus_completeness.js
const genericPattern = /本段（對應【[^】]+】/ ;

let totalPassages = 0;
let validTranslations = 0;
let bespokeAnnotations = 0;
let genericAnnotations = 0;

const translationSet = new Set();
const duplicateTranslations = [];

const workReport = [];

works.forEach(work => {
  const workChapters = chapters.filter(c => c.workId === work.id);
  let workPassagesCount = 0;
  let workBespokeCount = 0;
  let workGenericCount = 0;

  workChapters.forEach(ch => {
    const chPassages = passages.filter(p => p.chapterId === ch.id);
    chPassages.forEach(p => {
      totalPassages++;
      workPassagesCount++;

      const match = aidSource.match(new RegExp(`'${p.id}':\\s*\\{\\s*translation:\\s*"([^"]+)",\\s*analysis:\\s*"([^"]+)"`, 's'));
      if (match) {
        const trans = match[1];
        const analysis = match[2];

        if (trans && trans.trim().length > 0) {
          validTranslations++;
          const normTrans = trans.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉]/g, '');
          if (translationSet.has(normTrans)) {
            duplicateTranslations.push(p.id);
          } else {
            translationSet.add(normTrans);
          }
        }

        if (genericPattern.test(analysis)) {
          genericAnnotations++;
          workGenericCount++;
        } else {
          bespokeAnnotations++;
          workBespokeCount++;
        }
      }
    });
  });

  const pct = ((workBespokeCount / workPassagesCount) * 100).toFixed(2);
  workReport.push({
    id: work.id,
    title: work.title,
    category: work.category,
    chapters: workChapters.length,
    passages: workPassagesCount,
    bespoke: workBespokeCount,
    generic: workGenericCount,
    pct,
    isComplete: pct === '100.00'
  });
});

console.log(` 總典籍數: ${works.length} 部`);
console.log(` 總章節數: ${chapters.length} 篇`);
console.log(` 總段落數: ${totalPassages} 段\n`);

console.log(` 1. 白話文對照翻譯覆蓋率: ${validTranslations} / ${totalPassages} (${((validTranslations / totalPassages) * 100).toFixed(2)}%)`);
console.log(` 2. 白話文翻譯 100% 專屬無重複率: ${translationSet.size} / ${totalPassages} (${((translationSet.size / totalPassages) * 100).toFixed(2)}%)`);
console.log(` 3. 專屬深度學術註釋完工數: ${bespokeAnnotations} / ${totalPassages} (${((bespokeAnnotations / totalPassages) * 100).toFixed(2)}%)`);
console.log(` 4. 通用模板待升級註釋數: ${genericAnnotations} / ${totalPassages} (${((genericAnnotations / totalPassages) * 100).toFixed(2)}%)\n`);

const completedWorks = workReport.filter(w => w.isComplete);
const pendingWorks = workReport.filter(w => !w.isComplete);

console.log(`================================================================`);
console.log(` 已 100.00% 全書完工典籍 (${completedWorks.length} 部)：`);
console.log(`================================================================`);
completedWorks.forEach(w => {
  console.log(`  ✓ [100.00%] ${w.title.padEnd(12, ' ')} (${w.id.padEnd(18, ' ')}): ${String(w.passages).padStart(4, ' ')} 段 專屬譯注完備`);
});

console.log(`\n================================================================`);
console.log(` 待補全專屬解析典籍 (${pendingWorks.length} 部)：`);
console.log(`================================================================`);
pendingWorks.forEach(w => {
  console.log(`  ⏳ [${String(w.pct).padStart(6, ' ')}%] ${w.title.padEnd(12, ' ')} (${w.id.padEnd(18, ' ')}): ${String(w.bespoke).padStart(4, ' ')} / ${String(w.passages).padStart(4, ' ')} 段 (待補全 ${w.generic} 段)`);
});

fs.writeFileSync(path.join(root, 'scratch/full_corpus_pipeline_report.json'), JSON.stringify({
  totalWorks: works.length,
  totalChapters: chapters.length,
  totalPassages,
  validTranslations,
  bespokeTranslations: translationSet.size,
  bespokeAnnotations,
  genericAnnotations,
  completedWorksCount: completedWorks.length,
  pendingWorksCount: pendingWorks.length,
  completedWorks: completedWorks.map(w => ({ id: w.id, title: w.title, passages: w.passages })),
  pendingWorks: pendingWorks.map(w => ({ id: w.id, title: w.title, passages: w.passages, bespoke: w.bespoke, generic: w.generic, pct: w.pct }))
}, null, 2), 'utf8');

console.log('\n完整自動化掃描報告已儲存至 scratch/full_corpus_pipeline_report.json');
