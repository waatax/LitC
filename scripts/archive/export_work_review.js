import fs from 'fs';

const workId = process.argv[2];
if (!workId) throw new Error('Usage: node scripts/export_work_review.js <work-id>');

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const aidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');
const datasets = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages] = datasets;
const work = works.find((item) => item.id === workId);
if (!work) throw new Error(`Unknown work: ${workId}`);

const aids = new Map();
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], {
    translation: JSON.parse(`"${match[2]}"`),
    analysis: JSON.parse(`"${match[3]}"`),
  });
}

const chapterIds = new Set(chapters.filter((chapter) => chapter.workId === workId).map((chapter) => chapter.id));
const rows = passages.filter((passage) => chapterIds.has(passage.chapterId)).map((passage) => ({
  passageId: passage.id,
  canonicalText: passage.canonicalText,
  translation: aids.get(passage.id)?.translation || '',
  analysis: aids.get(passage.id)?.analysis || '',
  sourceRefs: passage.sourceRefs || [],
}));

const output = `scratch/review_${workId}.json`;
fs.writeFileSync(output, JSON.stringify({ work, passages: rows }, null, 2), 'utf8');
console.log(`${work.title}: ${rows.length} passages exported to ${output}`);
