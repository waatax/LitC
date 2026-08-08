import fs from 'fs';
import path from 'path';

const report = JSON.parse(fs.readFileSync('scratch/corpus_completeness_audit.json', 'utf8'));
console.log('--- 全庫 50 部典籍專屬解析進度一覽 ---');
report.works.forEach((w) => {
  const status = w.bespokeAnnotations === w.passages ? '✓ 100%' : '  進行中';
  console.log(`[${status.padEnd(6, ' ')}] ${w.title.padEnd(10, ' ')} (${w.id.padEnd(18, ' ')}): ${String(w.bespokeAnnotations).padStart(3, ' ')} / ${String(w.passages).padStart(3, ' ')} 段 (${w.bespokeAnnotationPct}%)`);
});
