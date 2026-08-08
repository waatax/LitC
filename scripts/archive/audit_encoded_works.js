import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const readingAidTsPath = path.join(__dirname, '../src/data/readingAid.ts');

const worksTsContent = fs.readFileSync(worksTsPath, 'utf8');
const readingAidContent = fs.readFileSync(readingAidTsPath, 'utf8');

// Extract decodeURIComponent strings from works.ts
const jsonMatches = [...worksTsContent.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];

let works = [];
let chapters = [];
let passages = [];
let sentences = [];

if (jsonMatches.length >= 4) {
  works = JSON.parse(decodeURIComponent(jsonMatches[0][1]));
  chapters = JSON.parse(decodeURIComponent(jsonMatches[1][1]));
  passages = JSON.parse(decodeURIComponent(jsonMatches[2][1]));
  sentences = JSON.parse(decodeURIComponent(jsonMatches[3][1]));
}

console.log(`Loaded ${works.length} works, ${chapters.length} chapters, ${passages.length} passages, ${sentences.length} sentences.`);

// Parse reading aid dictionary
// readingAid.ts is export const readingAid: Record<string, string> = { ... }
const aidMap = new Map();
const aidMatches = [...readingAidContent.matchAll(/['`"]([^'`"]+)['`"]\s*:\s*[`'"]([^`'"]*)[`'"]/g)];
aidMatches.forEach(m => {
  aidMap.set(m[1], m[2]);
});

console.log(`Loaded ${aidMap.size} reading aid entries.`);

// Work statistics
const workReport = works.map(w => {
  const wChs = chapters.filter(c => c.workId === w.id);
  const wSents = sentences.filter(s => s.id.startsWith(w.id + '_'));
  
  let translatedSents = 0;
  wSents.forEach(s => {
    // Check if sentence canonicalText is in readingAid
    if (aidMap.has(s.canonicalText)) {
      translatedSents++;
    }
  });

  return {
    id: w.id,
    title: w.title,
    schoolId: w.schoolId,
    chaptersCount: wChs.length,
    sentencesCount: wSents.length,
    totalChars: w.totalChars || 0,
    translatedSents,
    transCoveragePct: wSents.length > 0 ? ((translatedSents / wSents.length) * 100).toFixed(1) : '0.0'
  };
});

const totalSentences = sentences.length;
const totalTranslatedSentences = workReport.reduce((acc, r) => acc + r.translatedSents, 0);

const result = {
  summary: {
    totalWorks: works.length,
    totalChapters: chapters.length,
    totalPassages: passages.length,
    totalSentences,
    totalTranslatedSentences,
    overallTranslationCoveragePct: ((totalTranslatedSentences / totalSentences) * 100).toFixed(1)
  },
  works: workReport
};

fs.mkdirSync(path.join(__dirname, '../scratch'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../scratch/audit_report.json'), JSON.stringify(result, null, 2));
console.log('Audit completed! Saved to scratch/audit_report.json');
