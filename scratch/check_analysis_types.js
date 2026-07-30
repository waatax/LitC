import fs from 'fs';

const aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const aids = new Map();
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: match[2], analysis: match[3] });
}

let templateAnalysisCount = 0;
let genericPianzhangCount = 0;
for (const [id, aid] of aids.entries()) {
  if (aid.analysis.includes('【篇章定位】') || aid.analysis.includes('【解讀重點')) {
    genericPianzhangCount++;
  }
}

console.log('Total aids count:', aids.size);
console.log('Passages with 【篇章定位】/【解讀重點】 template:', genericPianzhangCount);
