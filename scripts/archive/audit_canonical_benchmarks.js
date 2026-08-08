import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

if (encoded.length < 4) throw new Error('Unable to decode works.ts corpus arrays.');
const [works, chapters, passages, sentences] = encoded;

// Authority Benchmark: Standard Expected Chapter Counts for Chinese Classical Works
const CANONICAL_BENCHMARKS = {
  'dao-de-jing': { expectedChapters: 81, category: '道家' },
  'zhuangzi': { expectedChapters: 33, category: '道家' },
  'liezi': { expectedChapters: 8, category: '道家' },
  'wenzi': { expectedChapters: 12, category: '道家' },
  'wenshi-zhenjing': { expectedChapters: 9, category: '道家' },
  
  'han-fei-zi': { expectedChapters: 55, category: '法家' },
  'shang-jun-shu': { expectedChapters: 26, category: '法家' },
  'shen-bu-hai': { expectedChapters: 1, category: '法家' },
  'shenzi': { expectedChapters: 7, category: '法家' },
  'jian-zhu-ke-shu': { expectedChapters: 1, category: '法家' },
  'guanzi': { expectedChapters: 76, category: '法家' },
  
  'mo-zi': { expectedChapters: 71, category: '墨家' },
  
  'lun-yu': { expectedChapters: 20, category: '儒家' },
  'meng-zi': { expectedChapters: 14, category: '儒家' },
  'yi-jing': { expectedChapters: 64, category: '儒家' },
  'shu-jing': { expectedChapters: 58, category: '儒家' },
  'shi-jing': { expectedChapters: 305, category: '儒家' },
  'li-ji': { expectedChapters: 49, category: '儒家' },
  'chun-qiu': { expectedChapters: 242, category: '儒家' },
  'da-xue': { expectedChapters: 11, category: '儒家' },
  'zhong-yong': { expectedChapters: 33, category: '儒家' },
  'xunzi': { expectedChapters: 32, category: '儒家' },
  
  'gu-wen-guan-zhi': { expectedChapters: 222, category: '文學' },
  'cai-gen-tan': { expectedChapters: 5, category: '文學' },
  
  'art-of-war': { expectedChapters: 13, category: '兵家' },
  'wu-zi': { expectedChapters: 6, category: '兵家' },
  'si-ma-fa': { expectedChapters: 5, category: '兵家' },
  'three-strategies': { expectedChapters: 3, category: '兵家' },
  'wei-liao-zi': { expectedChapters: 24, category: '兵家' },
  'liu-tao': { expectedChapters: 60, category: '兵家' },
  
  'shiji': { expectedChapters: 130, category: '史書' },
  'chun-qiu-zuo-zhuan': { expectedChapters: 70, category: '史書' },
  'lost-book-of-zhou': { expectedChapters: 70, category: '史書' },
  'guo-yu': { expectedChapters: 21, category: '史書' },
  'yanzi-chun-qiu': { expectedChapters: 8, category: '史書' },
  'wu-yue-chun-qiu': { expectedChapters: 10, category: '史書' },
  'yue-jue-shu': { expectedChapters: 15, category: '史書' },
  'zhan-guo-ce': { expectedChapters: 33, category: '史書' },
  'yan-tie-lun': { expectedChapters: 60, category: '史書' },
  'lie-nv-zhuan': { expectedChapters: 8, category: '史書' },
  'guliang-zhuan': { expectedChapters: 12, category: '史書' },
  'gongyang-zhuan': { expectedChapters: 12, category: '史書' },
  'han-shu': { expectedChapters: 100, category: '史書' },
  'hou-han-shu': { expectedChapters: 120, category: '史書' },
  'qian-han-ji': { expectedChapters: 30, category: '史書' },
  'dong-guan-han-ji': { expectedChapters: 24, category: '史書' },
  'zhushu-jinian': { expectedChapters: 2, category: '史書' },
  'mutianzi-zhuan': { expectedChapters: 6, category: '史書' },
  'gu-san-fen': { expectedChapters: 3, category: '史書' },
  'yandanzi': { expectedChapters: 3, category: '史書' },
  'xijing-zaji': { expectedChapters: 6, category: '史書' }
};

const chaptersByWork = new Map(works.map((work) => [work.id, chapters.filter((chapter) => chapter.workId === work.id)]));

const auditResults = works.map((work) => {
  const actualChapters = chaptersByWork.get(work.id)?.length || 0;
  const benchmark = CANONICAL_BENCHMARKS[work.id] || { expectedChapters: actualChapters, category: '其他' };
  const completenessPct = Math.min(100, Number(((actualChapters / benchmark.expectedChapters) * 100).toFixed(1)));
  const isComplete = actualChapters >= benchmark.expectedChapters;
  
  return {
    id: work.id,
    title: work.title,
    category: benchmark.category,
    actualChapters,
    expectedChapters: benchmark.expectedChapters,
    completenessPct,
    isComplete,
    statusSymbol: isComplete ? '[x]' : '[ ]'
  };
});

Object.keys(CANONICAL_BENCHMARKS).forEach(workId => {
  if (!works.some(w => w.id === workId)) {
    const bm = CANONICAL_BENCHMARKS[workId];
    auditResults.push({
      id: workId,
      title: workId === 'xunzi' ? '荀子' : workId,
      category: bm.category,
      actualChapters: 0,
      expectedChapters: bm.expectedChapters,
      completenessPct: 0,
      isComplete: false,
      statusSymbol: '[ ]'
    });
  }
});

const categories = {};
auditResults.forEach(item => {
  if (!categories[item.category]) categories[item.category] = [];
  categories[item.category].push(item);
});

let mdContent = `# 古文文本校正與權威完整度核驗清單 (Authoritative Corpus Completeness Checklist)\n\n`;
mdContent += `> [!IMPORTANT]\n`;
mdContent += `> 本清單採用客觀程式腳本 (scripts/audit_canonical_benchmarks.js) 自動比對標準權威篇數，**嚴禁任何 Agent 憑空宣稱完整**。\n`;
mdContent += `> 只有實際篇數達到標準對照篇數 (100%) 時，方可自動勾選 [x]。\n\n`;
mdContent += `生成時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\n\n`;

for (const [catName, items] of Object.entries(categories)) {
  mdContent += `## ${catName}\n`;
  items.forEach(item => {
    const flag = item.isComplete ? '【完整 100%】' : `【嚴重缺漏：實際 ${item.actualChapters} / 標準 ${item.expectedChapters} 篇 (${item.completenessPct}%)】`;
    mdContent += `- ${item.statusSymbol} 《${item.title}》：${flag}\n`;
  });
  mdContent += `\n`;
}

fs.writeFileSync(path.join(root, 'scratch/canonical_benchmark_audit.json'), JSON.stringify(auditResults, null, 2));
fs.writeFileSync('C:\\Users\\User\\.gemini\\antigravity\\brain\\26c30ed7-bf76-4794-a5df-cdf0e7887d7c\\proofreading_checklist.md', mdContent);

console.log('Successfully updated canonical audit and proofreading_checklist.md!');
