import fs from 'fs';
import path from 'path';

const aidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;

const templateKeywords = [
  '深刻闡述', '觀歷史興衰', '客觀規律與處世法則', '適合作為學術引申與經典背誦卡片',
  '順應自然、清靜無為、避高趨下與超越物欲', '法術勢並重、嚴明賞罰、權力運作與制度治理',
  '修己安人、崇尚仁義與中庸之道', '觀歷史興衰、辨君臣成敗與鑑往知來', '融會思想情感、修身養性與文字聲律之美'
];

let totalPassages = 0;
let templatePassages = 0;
const workStats = {};

for (const match of aidSource.matchAll(aidPattern)) {
  const id = match[1];
  const workId = id.split('_ch-')[0];
  const analysis = match[3];
  totalPassages++;

  if (!workStats[workId]) workStats[workId] = { total: 0, template: 0, genuine: 0 };
  workStats[workId].total++;

  const isTemplate = templateKeywords.some(kw => analysis.includes(kw));
  if (isTemplate) {
    templatePassages++;
    workStats[workId].template++;
  } else {
    workStats[workId].genuine++;
  }
}

console.log('====================================================');
console.log(' 全庫 50 部典籍模板 vs 深度專屬解析重新掃描結果 ');
console.log('====================================================\n');
console.log(`總段落數: ${totalPassages}`);
console.log(`已完成深度專屬解析: ${totalPassages - templatePassages} 段 (${(((totalPassages - templatePassages)/totalPassages)*100).toFixed(2)}%)`);
console.log(`尚待升級之模板段落: ${templatePassages} 段 (${((templatePassages/totalPassages)*100).toFixed(2)}%)\n`);

console.log('--- 各典籍詳細狀態 ---');
for (const [w, stat] of Object.entries(workStats)) {
  const pct = ((stat.genuine / stat.total) * 100).toFixed(1);
  const status = stat.genuine === stat.total ? '✓ 100% 完工' : `  需升級 ${stat.template} 段`;
  console.log(`[${status.padEnd(12, ' ')}] ${w.padEnd(20, ' ')}: 真實專屬 ${String(stat.genuine).padStart(3, ' ')} / ${String(stat.total).padStart(3, ' ')} 段 (${pct}%)`);
}

fs.writeFileSync('scratch/deep_scan_result.json', JSON.stringify({
  totalPassages,
  genuinePassages: totalPassages - templatePassages,
  templatePassages,
  workStats
}, null, 2), 'utf8');
