import fs from 'fs';
import path from 'path';

const aidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;

const counts = new Map();
const aids = [];

for (const match of aidSource.matchAll(aidPattern)) {
  const passageId = match[1];
  const translation = match[2];
  const analysis = match[3];
  const key = analysis.replace(/\s+/g, '');
  counts.set(key, (counts.get(key) || 0) + 1);
  aids.push({ passageId, translation, analysis, key });
}

const templates = aids.filter(item => counts.get(item.key) > 1);
console.log(`總共有 ${templates.length} 個段落使用模板解析。現印出前 10 個範例：\n`);

templates.slice(0, 10).forEach((t, i) => {
  console.log(`[${i+1}] Passage ID: ${t.passageId}`);
  console.log(`Analysis:\n${t.analysis}\n---`);
});
