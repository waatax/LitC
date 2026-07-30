import fs from 'fs';
import path from 'path';

const worksTsPath = './src/data/works.ts';
const readingAidTsPath = './src/data/readingAid.ts';

const worksSource = fs.readFileSync(worksTsPath, 'utf8');
const aidSource = fs.readFileSync(readingAidTsPath, 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

const [works, chapters, passages, sentences] = encoded;

const unescapeTsString = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const aids = new Map();
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: unescapeTsString(match[2]), analysis: unescapeTsString(match[3]) });
}

const analysisCounts = new Map();
for (const [id, aid] of aids.entries()) {
  const norm = aid.analysis.trim().replace(/\s+/g, '');
  analysisCounts.set(norm, (analysisCounts.get(norm) || 0) + 1);
}

let templateAnalysisCount = 0;
for (const [norm, count] of analysisCounts.entries()) {
  if (count > 1) {
    templateAnalysisCount += count;
  }
}

console.log('Total Passages:', passages.length);
console.log('Unique Analysis Count:', analysisCounts.size);
console.log('Passages sharing duplicated analysis templates:', templateAnalysisCount);

// Top repeated analyses
const sortedAnalyses = [...analysisCounts.entries()].sort((a, b) => b[1] - a[1]);
console.log('\nTop 5 Repeated Analyses:');
sortedAnalyses.slice(0, 5).forEach(([norm, count]) => {
  console.log(`[Used ${count} times] ${norm.substring(0, 50)}...`);
});
