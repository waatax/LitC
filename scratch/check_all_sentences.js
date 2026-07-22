import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { works, chapters, passages, sentences } from '../src/data/works.js';
import { getReadingAid, getPassageReadingAid } from '../src/data/readingAid.js';

console.log('Starting deep sentence-level checks...');

const issues = [];

for (const work of works) {
  const chIds = work.chapterIds;
  for (const chId of chIds) {
    const chPassages = passages.filter(p => p.chapterId === chId);
    for (const passage of chPassages) {
      const pSentences = sentences.filter(s => s.passageId === passage.id);
      
      // Check passage level first
      const passageAid = getPassageReadingAid(passage.id, passage.canonicalText, work.id, pSentences);
      if (!passageAid || !passageAid.translation || !passageAid.translation.trim()) {
        issues.push({
          type: 'passage-missing-translation',
          workId: work.id,
          passageId: passage.id,
          text: passage.canonicalText.substring(0, 30)
        });
      }
      if (!passageAid || !passageAid.analysis || !passageAid.analysis.trim()) {
        issues.push({
          type: 'passage-missing-analysis',
          workId: work.id,
          passageId: passage.id,
          text: passage.canonicalText.substring(0, 30)
        });
      }
      
      // Check sentence level
      for (const sentence of pSentences) {
        const trans = getReadingAid(sentence, work.id);
        if (!trans || !trans.trim()) {
          issues.push({
            type: 'sentence-empty-translation',
            workId: work.id,
            sentenceId: sentence.id,
            text: sentence.canonicalText
          });
        } else if (trans === '此句釋義提示。') {
          issues.push({
            type: 'sentence-placeholder',
            workId: work.id,
            sentenceId: sentence.id,
            text: sentence.canonicalText
          });
        } else if (trans.startsWith('用白話說：')) {
          issues.push({
            type: 'sentence-scaffolded',
            workId: work.id,
            sentenceId: sentence.id,
            text: sentence.canonicalText,
            translation: trans
          });
        } else if (/[a-zA-Z]{4,}/.test(trans)) {
          issues.push({
            type: 'sentence-has-english',
            workId: work.id,
            sentenceId: sentence.id,
            text: sentence.canonicalText,
            translation: trans
          });
        }
      }
    }
  }
}

console.log(`Deep check completed. Total issues found: ${issues.length}`);

// Group by work and type
const summary = {};
for (const issue of issues) {
  if (!summary[issue.workId]) {
    summary[issue.workId] = { count: 0, types: {} };
  }
  summary[issue.workId].count++;
  if (!summary[issue.workId].types[issue.type]) {
    summary[issue.workId].types[issue.type] = 0;
  }
  summary[issue.workId].types[issue.type]++;
}

console.log('\n--- Deep Check Summary ---');
console.dir(summary, { depth: null });
console.log('--------------------------');

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'deep_check_report.json'),
  JSON.stringify({ summary, issues }, null, 2),
  'utf8'
);

console.log('Saved deep check report to scratch/deep_check_report.json');
