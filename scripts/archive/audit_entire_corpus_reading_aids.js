import fs from 'fs';

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
const jsonEncodedMatch = worksTs.match(/decodeURIComponent\(["']([^"']+)["']\)/);
const works = JSON.parse(decodeURIComponent(jsonEncodedMatch[1]));

const p1 = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2 = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];
const allPassages = [...p1, ...p2];

// Inspect readingAid.ts
const readingAidContent = fs.readFileSync('src/data/readingAid.ts', 'utf8');

// Match all keys in PASSAGE_AIDS object
const aidKeysMatch = [...readingAidContent.matchAll(/['"]([^'"]+)['"]:\s*\{\s*translation:/g)].map(m => m[1]);
const aidKeySet = new Set(aidKeysMatch);

console.log(`=== LitC Entire Corpus Reading Aid Audit ===`);
console.log(`Total Works: ${works.length}`);
console.log(`Total Passages in Corpus: ${allPassages.length}`);
console.log(`Total Passages with explicit readingAid in readingAid.ts: ${aidKeySet.size}`);

const workStats = {};

allPassages.forEach(p => {
  const chapterId = p.chapterId;
  const workId = p.id.split('_')[0];
  
  if (!workStats[workId]) {
    workStats[workId] = { totalPassages: 0, withAid: 0, missingAid: 0, missingPassageIds: [] };
  }
  
  workStats[workId].totalPassages++;
  if (aidKeySet.has(p.id)) {
    workStats[workId].withAid++;
  } else {
    workStats[workId].missingAid++;
    workStats[workId].missingPassageIds.push(p.id);
  }
});

console.log(`\nPer-Work Reading Aid Coverage Breakdown:`);
console.table(Object.keys(workStats).map(wId => {
  const w = works.find(x => x.id === wId);
  const title = w ? w.title : wId;
  const s = workStats[wId];
  const pct = Math.round((s.withAid / s.totalPassages) * 100) || 0;
  return {
    WorkID: wId,
    Title: title,
    TotalPassages: s.totalPassages,
    WithAid: s.withAid,
    MissingAid: s.missingAid,
    Coverage: `${pct}%`
  };
}));

fs.writeFileSync('scratch/full_corpus_reading_aid_audit.json', JSON.stringify(workStats, null, 2), 'utf8');
console.log("\nSaved scratch/full_corpus_reading_aid_audit.json");
