import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');
const editorialReviewPath = path.join(root, 'src/data/editorialReviews.json');
const editorialReviewData = JSON.parse(fs.readFileSync(editorialReviewPath, 'utf8'));
const editorialReviews = new Map(editorialReviewData.reviews.map((review) => [review.passageId, review]));
const datasets = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages] = datasets;

if (!works || !chapters || !passages) throw new Error('Unable to decode corpus datasets.');

const aids = new Map();
const aidPattern = /'([^']+)'\s*:\s*\{\s*["']?translation["']?\s*:\s*"((?:\\.|[^"\\])*)",\s*["']?analysis["']?\s*:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], {
    translation: JSON.parse(`"${match[2]}"`),
    analysis: JSON.parse(`"${match[3]}"`),
  });
}

const chapterToWork = new Map(chapters.map((chapter) => [chapter.id, chapter.workId]));
const workById = new Map(works.map((work) => [work.id, work]));
const passageById = new Map(passages.map((passage) => [passage.id, passage]));
const analysisOwners = new Map();
for (const passage of passages) {
  const analysis = aids.get(passage.id)?.analysis?.replace(/\s+/g, ' ').trim();
  if (!analysis) continue;
  if (!analysisOwners.has(analysis)) analysisOwners.set(analysis, []);
  analysisOwners.get(analysis).push(passage.id);
}

const badTextPatterns = [/\ufffd/u, /\?{3,}/u, /[\uE000-\uF8FF]/u];
const mechanicalTranslationPatterns = [
  /\u5b6b\u5b54\u5b50/u,
  /\u4eba\u6c11\u767e\u59d3/u,
  /\u3010\u767d\u8a71\u7ffb\u8b6f\u3011/u,
  /\u54ea\u88e1\u5371/u,
  /\u6240\u8b02\uff0c/u,
];
const genericAnalysisPatterns = [
  /\u672c\u6bb5\u51fa\u81ea.*\u6df1\u5165\u8ad6\u8ff0/u,
  /\u672c\u6bb5\u51fa\u81ea.*\u63a2\u7d22.*\u4e4b\u9053/u,
  /\u7d93\u6587\u6838\u5fc3\u53e5/u,
  /\u8ad6\u8ff0\u5c64\u6b21\u5206\u660e/u,
  /\u601d\u60f3[\uff0f/]\u4fee\u8fad[\uff0f/]\u7bc7\u7ae0/u,
];

function isDocumentedParallelDuplicate(passageId, owners) {
  const normalizedCanonical = (passageById.get(passageId)?.canonicalText || '').replace(/\s+/g, ' ').trim();
  if (!normalizedCanonical) return false;
  return owners.some((otherId) => {
    if (otherId === passageId) return false;
    const otherCanonical = (passageById.get(otherId)?.canonicalText || '').replace(/\s+/g, ' ').trim();
    if (otherCanonical !== normalizedCanonical) return false;
    return editorialReviews.get(passageId)?.parallelPassageId === otherId
      || editorialReviews.get(otherId)?.parallelPassageId === passageId;
  });
}

const rows = [];
for (const passage of passages) {
  const workId = chapterToWork.get(passage.chapterId);
  const work = workById.get(workId);
  const aid = aids.get(passage.id);
  const editorialReview = editorialReviews.get(passage.id);
  const issues = [];
  const canonicalText = passage.canonicalText || '';
  const translation = aid?.translation || '';
  const analysis = aid?.analysis || '';

  if (!passage.sourceRefs?.length) issues.push('missing_source_ref');
  if (!canonicalText.trim()) issues.push('missing_canonical_text');
  if (badTextPatterns.some((pattern) => pattern.test(canonicalText))) issues.push('canonical_encoding_risk');
  if (!translation.trim()) issues.push('missing_translation');
  if (badTextPatterns.some((pattern) => pattern.test(translation))) issues.push('translation_encoding_risk');
  if (mechanicalTranslationPatterns.some((pattern) => pattern.test(translation))) issues.push('mechanical_translation_risk');
  if (!analysis.trim()) issues.push('missing_analysis');
  if (badTextPatterns.some((pattern) => pattern.test(analysis))) issues.push('analysis_encoding_risk');
  if (genericAnalysisPatterns.filter((pattern) => pattern.test(analysis)).length >= 2) issues.push('generic_analysis_risk');
  const duplicateOwners = analysisOwners.get(analysis.replace(/\s+/g, ' ').trim()) || [];
  if (duplicateOwners.length > 1 && !isDocumentedParallelDuplicate(passage.id, duplicateOwners)) issues.push('duplicate_analysis');
  if (editorialReview?.canonicalText !== 'verified') issues.push('canonical_not_editorially_verified');
  if (editorialReview?.translation !== 'verified') issues.push('translation_not_editorially_verified');
  if (editorialReview?.analysis !== 'verified') issues.push('analysis_not_editorially_verified');
  if (editorialReview && (!editorialReview.sources || editorialReview.sources.length < 2)) issues.push('insufficient_review_sources');

  rows.push({
    passageId: passage.id,
    workId,
    workTitle: work?.title || workId,
    issues,
    riskScore: issues.reduce((score, issue) => score + ({
      missing_canonical_text: 100,
      canonical_encoding_risk: 80,
      missing_translation: 70,
      translation_encoding_risk: 60,
      mechanical_translation_risk: 55,
      missing_analysis: 50,
      analysis_encoding_risk: 40,
      missing_source_ref: 30,
      generic_analysis_risk: 25,
      duplicate_analysis: 20,
      canonical_not_editorially_verified: 15,
      translation_not_editorially_verified: 15,
      analysis_not_editorially_verified: 15,
      insufficient_review_sources: 15,
    }[issue] || 0), 0),
  });
}

const workSummary = works.map((work) => {
  const workRows = rows.filter((row) => row.workId === work.id);
  const issueCounts = {};
  for (const row of workRows) for (const issue of row.issues) issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  return {
    workId: work.id,
    title: work.title,
    passages: workRows.length,
    passagesNeedingReview: workRows.filter((row) => row.issues.length).length,
    riskScore: workRows.reduce((sum, row) => sum + row.riskScore, 0),
    issueCounts,
  };
}).sort((a, b) => b.riskScore - a.riskScore);

const issueTotals = {};
for (const row of rows) for (const issue of row.issues) issueTotals[issue] = (issueTotals[issue] || 0) + 1;
const report = {
  generatedAt: new Date().toISOString(),
  policyVersion: 2,
  totals: {
    works: works.length,
    chapters: chapters.length,
    passages: passages.length,
    passagesNeedingReview: rows.filter((row) => row.issues.length).length,
  },
  issueTotals,
  workSummary,
  reviewQueue: rows.filter((row) => row.issues.length).sort((a, b) => b.riskScore - a.riskScore),
};

const output = path.join(root, 'scratch/corpus_quality_audit.json');
fs.writeFileSync(output, JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({ totals: report.totals, issueTotals, highestRiskWorks: workSummary.slice(0, 10) }, null, 2));
console.log(`Full review queue: ${output}`);
