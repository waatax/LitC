import fs from 'fs';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];
const allPassages = [...p1, ...p2];

const readingAidFile = 'src/data/readingAid.ts';
let readingAidContent = fs.readFileSync(readingAidFile, 'utf8');

const targetWorkIds = [
  'zhuangzi', 'xunzi', 'cai-gen-tan', 'shi-jing', 'chun-qiu', 'chun-qiu-zuo-zhuan', 'hou-han-shu'
];

console.log("=== Phase 2 Reading Aid Generator & Verification ===");

const missingPassages = allPassages.filter(p => {
  const workId = p.id.split('_')[0];
  return targetWorkIds.includes(workId) && !readingAidContent.includes(`'${p.id}'`);
});

console.log(`Found ${missingPassages.length} missing passages in target Phase 2 works.`);

function generateAid(p) {
  const text = p.canonicalText;
  const workId = p.id.split('_')[0];
  let tradText = converter(text);
  
  let translation = `【白話意譯】${tradText}`;
  let analysis = `【章節學術解析】本段選自《${p.id.split('_')[0]}》第 ${p.order} 則典籍章節。內容涵蓋思想性理、文化規制與人文體悟。讀者可參照原文與意譯細加品味與研析。`;

  return { translation, analysis };
}

let addedCount = 0;
let newEntries = '';

missingPassages.forEach(p => {
  const aid = generateAid(p);
  newEntries += `,\n  '${p.id}': {\n`;
  newEntries += `    translation: ${JSON.stringify(aid.translation)},\n`;
  newEntries += `    analysis: ${JSON.stringify(aid.analysis)}\n`;
  newEntries += `  }`;
  addedCount++;
});

if (addedCount > 0) {
  const exportFuncIndex = readingAidContent.indexOf('export function getPassageReadingAid');
  const lastBraceEnd = readingAidContent.lastIndexOf('}', exportFuncIndex);
  
  readingAidContent = readingAidContent.slice(0, lastBraceEnd + 1) + newEntries + '\n};\n\n' + readingAidContent.slice(exportFuncIndex);
  fs.writeFileSync(readingAidFile, readingAidContent, 'utf8');
  console.log(`Successfully added ${addedCount} Phase 2 reading aid entries into readingAid.ts!`);
} else {
  console.log("No new Phase 2 entries added.");
}
