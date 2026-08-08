import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = encoded;

console.log('====================================================');
console.log(' LitC 全文庫白話文對照與解析完整性自動核驗程序 ');
console.log('====================================================\n');

const genericPattern = /本段節選自|對應篇章的核心文意|義理深遠/;

let totalPassages = 0;
let validTranslations = 0;
let bespokeAnnotations = 0;
let genericAnnotations = 0;
let missingEntries = 0;

const translationMap = new Map();
const duplicateTranslations = [];

const workSummary = [];

works.forEach(work => {
  const workChapters = chapters.filter(c => c.workId === work.id);
  let workPassagesCount = 0;
  let workBespokeCount = 0;

  workChapters.forEach(ch => {
    const chPassages = passages.filter(p => p.chapterId === ch.id);
    chPassages.forEach(p => {
      totalPassages++;
      workPassagesCount++;

      const match = aidSource.match(new RegExp(`'${p.id}':\\s*\\{\\s*translation:\\s*"([^"]+)",\\s*analysis:\\s*"([^"]+)"\\s*\\}`, 's'));
      if (match) {
        const trans = match[1];
        const analysis = match[2];

        if (trans && trans.trim().length > 0) {
          validTranslations++;

          const normTrans = trans.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉]/g, '');
          if (translationMap.has(normTrans)) {
            duplicateTranslations.push({ id: p.id, originalId: translationMap.get(normTrans) });
          } else {
            translationMap.set(normTrans, p.id);
          }
        }

        if (genericPattern.test(analysis)) {
          genericAnnotations++;
        } else {
          bespokeAnnotations++;
          workBespokeCount++;
        }
      } else {
        missingEntries++;
      }
    });
  });

  workSummary.push({
    id: work.id,
    title: work.title,
    category: work.category,
    chapters: workChapters.length,
    passages: workPassagesCount,
    bespoke: workBespokeCount,
    pct: ((workBespokeCount / workPassagesCount) * 100).toFixed(2)
  });
});

console.log(`總典籍數: ${works.length} 部`);
console.log(`總章節數: ${chapters.length} 篇`);
console.log(`總段落數: ${totalPassages} 段\n`);

console.log(`白話文翻譯全涵蓋率: ${validTranslations} / ${totalPassages} (${((validTranslations / totalPassages) * 100).toFixed(2)}%)`);
console.log(`專屬無重複白話翻譯: ${translationMap.size} / ${totalPassages} (${((translationMap.size / totalPassages) * 100).toFixed(2)}%)`);
console.log(`專屬深度學術註釋: ${bespokeAnnotations} / ${totalPassages} (${((bespokeAnnotations / totalPassages) * 100).toFixed(2)}%)`);
console.log(`通用模板待補全註釋: ${genericAnnotations} / ${totalPassages} (${((genericAnnotations / totalPassages) * 100).toFixed(2)}%)`);
console.log(`缺失條目數: ${missingEntries}\n`);

console.log('----------------------------------------------------');
console.log(' 各典籍整理完工進度一覽（前15部）：');
console.log('----------------------------------------------------');
workSummary.slice(0, 15).forEach(w => {
  console.log(`[${w.pct === '100.00' ? 'FULL 100%' : 'PROGRESS'}] ${w.title.padEnd(10, ' ')} (${w.id}): ${w.bespoke} / ${w.passages} 段 (${w.pct}%)`);
});

fs.writeFileSync(path.join(root, 'scratch/corpus_verification_report.json'), JSON.stringify({
  totalPassages,
  validTranslations,
  bespokeTranslations: translationMap.size,
  bespokeAnnotations,
  genericAnnotations,
  missingEntries,
  duplicateTranslationsCount: duplicateTranslations.length,
  workSummary
}, null, 2), 'utf8');

console.log('\n詳細核驗報告已儲存至 scratch/corpus_verification_report.json');
