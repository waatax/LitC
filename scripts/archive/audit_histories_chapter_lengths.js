import fs from 'fs';

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
const works = JSON.parse(decodeURIComponent(worksTs.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\(["']([^"']+)["']\)\)/)[1]));
const chapters = JSON.parse(decodeURIComponent(worksTs.match(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\(["']([^"']+)["']\)\)/)[1]));

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];
const allPassages = [...p1, ...p2];

const historiesWorks = works.filter(w => w.schoolId === 'histories' || w.tags?.includes('史書'));

console.log("=== Auditing Chapter Lengths & Passages Count For Histories Works ===");

const stats = historiesWorks.map(w => {
  const wChapters = chapters.filter(c => c.workId === w.id);
  const avgPassagesPerCh = wChapters.length > 0 ? 
    (wChapters.reduce((acc, c) => acc + (c.passageIds ? c.passageIds.length : 0), 0) / wChapters.length).toFixed(1) : 0;
  
  return {
    WorkID: w.id,
    Title: w.title,
    ChaptersCount: wChapters.length,
    AvgPassagesPerCh: avgPassagesPerCh,
    SampleChapter: wChapters[0] ? `${wChapters[0].title} (${wChapters[0].passageIds?.length || 0} passages)` : 'None'
  };
});

console.table(stats);
