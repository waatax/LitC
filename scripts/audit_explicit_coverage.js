import fs from 'fs';
import path from 'path';

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const works = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][0][1]));
const chapters = JSON.parse(decodeURIComponent([...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)][1][1]));

const p1 = decodeFileJson(path.join(root, 'src/data/sentence_chunks/passages_part1.ts')) || [];
const p2 = decodeFileJson(path.join(root, 'src/data/sentence_chunks/passages_part2.ts')) || [];
const passages = [...p1, ...p2];

const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');
const exportIdx = aidSource.indexOf('export function getPassageReadingAid');
const aidBody = aidSource.slice(0, exportIdx);

const aidContentMap = new Map();
const aidPattern = /'([^']+)':\s*\{\s*translation:\s*"((?:\\"|[^"])*)",\s*analysis:\s*"((?:\\"|[^"])*)"\s*\}/g;
let m;
while ((m = aidPattern.exec(aidBody)) !== null) {
  aidContentMap.set(m[1], { translation: m[2], analysis: m[3] });
}

const workByChapter = new Map();
works.forEach(w => w.chapterIds.forEach(c => workByChapter.set(c, w.id)));

console.log("=== LitC 全典籍白話文與解析「顯式覆蓋率」深度審計表 ===\n");

const workReport = works.map(w => {
  const wPassages = passages.filter(p => workByChapter.get(p.chapterId) === w.id);
  const total = wPassages.length;
  let explicitAidCount = 0;
  let sampleText = "";
  let sampleTrans = "";
  let sampleAnalysis = "";

  wPassages.forEach((p, idx) => {
    const aid = aidContentMap.get(p.id);
    if (aid) {
      explicitAidCount++;
      if (!sampleTrans && idx === 0) {
        sampleText = p.canonicalText ? p.canonicalText.substring(0, 20) + "..." : "";
        sampleTrans = aid.translation ? aid.translation.substring(0, 25) + "..." : "";
        sampleAnalysis = aid.analysis ? aid.analysis.substring(0, 25) + "..." : "";
      }
    }
  });

  const covPct = total > 0 ? (explicitAidCount / total * 100).toFixed(1) + "%" : "0%";
  return {
    ID: w.id,
    典籍名稱: w.title,
    學派: w.schoolId,
    總段落數: total,
    顯式導讀數: explicitAidCount,
    導讀覆蓋率: covPct,
    抽樣原文: sampleText,
    抽樣白話文: sampleTrans
  };
});

console.table(workReport);

const fullCovWorks = workReport.filter(r => r.導讀覆蓋率 === "100.0%");
const partialCovWorks = workReport.filter(r => r.導讀覆蓋率 !== "100.0%");

console.log(`\n統計摘要：`);
console.log(`1. 100% 顯式獨立導讀覆蓋典籍：${fullCovWorks.length} 部`);
console.log(`2. 動態生成/動態降級導讀典籍：${partialCovWorks.length} 部 (例如《史記》、《漢書》巨型大書)`);
