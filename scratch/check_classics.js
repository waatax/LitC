import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// We can import directly because tsx / ts-node will handle paths relative to this file
import { works, chapters, passages, sentences } from '../src/data/works.js';
import { getPassageReadingAid } from '../src/data/readingAid.js';

console.log(`Loaded ${works.length} works, ${chapters.length} chapters, ${passages.length} passages, ${sentences.length} sentences.`);

const report = [];

for (const work of works) {
  const workReport = {
    workId: work.id,
    workTitle: work.title,
    schoolId: work.schoolId,
    totalChapters: work.chapterIds.length,
    chaptersWithPlaceholdersOrGeneric: []
  };

  for (const chId of work.chapterIds) {
    const chapter = chapters.find(c => c.id === chId);
    if (!chapter) {
      console.warn(`Warning: Chapter ${chId} not found in chapters list.`);
      continue;
    }

    const chPassages = passages.filter(p => p.chapterId === chId);
    const chReport = {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      issues: []
    };

    for (const passage of chPassages) {
      const pSentences = sentences.filter(s => s.passageId === passage.id);
      const aid = getPassageReadingAid(passage.id, passage.canonicalText, work.id, pSentences);

      const hasEnglish = /[a-zA-Z]{4,}/.test(aid.translation); // matches English words like "The", "Way" (ignore tiny symbols/abbreviations)
      const isScaffolded = aid.translation.startsWith('用白話說：');
      const isPlaceholder = aid.translation.includes('此句釋義提示。') || !aid.translation.trim();
      
      const hasGenericAnalysis = aid.analysis.includes('解析：本段須放在前後文一併理解');
      const isAnalysisPlaceholder = !aid.analysis.trim();

      if (hasEnglish || isScaffolded || isPlaceholder || hasGenericAnalysis || isAnalysisPlaceholder) {
        chReport.issues.push({
          passageId: passage.id,
          canonicalText: passage.canonicalText.substring(0, 30) + (passage.canonicalText.length > 30 ? '...' : ''),
          hasEnglish,
          isScaffolded,
          isPlaceholder,
          hasGenericAnalysis,
          isAnalysisPlaceholder,
          translationPreview: aid.translation.substring(0, 30) + (aid.translation.length > 30 ? '...' : ''),
          analysisPreview: aid.analysis.substring(0, 30) + (aid.analysis.length > 30 ? '...' : '')
        });
      }
    }

    if (chReport.issues.length > 0) {
      workReport.chaptersWithPlaceholdersOrGeneric.push(chReport);
    }
  }

  report.push(workReport);
}

// Group and write details to file
const summary = [];
const detailedReport = {};

for (const w of report) {
  let englishCount = 0;
  let scaffoldedCount = 0;
  let placeholderCount = 0;
  let genericAnalysisCount = 0;
  let placeholderAnalysisCount = 0;
  let totalPassages = 0;
  const issuesList = [];

  const allChPassages = passages.filter(p => w.workId === p.chapterId.split('_ch-')[0]);
  totalPassages = allChPassages.length;

  for (const ch of w.chaptersWithPlaceholdersOrGeneric) {
    for (const issue of ch.issues) {
      if (issue.hasEnglish) englishCount++;
      if (issue.isScaffolded) scaffoldedCount++;
      if (issue.isPlaceholder) placeholderCount++;
      if (issue.hasGenericAnalysis) genericAnalysisCount++;
      if (issue.isAnalysisPlaceholder) placeholderAnalysisCount++;
      issuesList.push({
        chapterTitle: ch.chapterTitle,
        ...issue
      });
    }
  }

  summary.push({
    workId: w.workId,
    workTitle: w.workTitle,
    schoolId: w.schoolId,
    totalChapters: w.totalChapters,
    totalPassages,
    issuesCount: issuesList.length,
    englishCount,
    scaffoldedCount,
    placeholderCount,
    genericAnalysisCount,
    placeholderAnalysisCount
  });

  detailedReport[w.workId] = issuesList;
}

console.log('\n================ CLASSICS ISSUES SUMMARY ================');
console.table(summary);
console.log('=========================================================');

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'classics_issues_summary.json'),
  JSON.stringify({ summary, detailedReport }, null, 2),
  'utf8'
);
console.log('Saved detailed report to scratch/classics_issues_summary.json');

