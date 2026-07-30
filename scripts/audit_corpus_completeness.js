import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const aidSource = fs.readFileSync(path.join(root, 'src/data/readingAid.ts'), 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

if (encoded.length < 4) throw new Error('Unable to decode works.ts corpus arrays.');
const [works, chapters, passages, sentences] = encoded;

const unescapeTsString = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

const aids = new Map();
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: unescapeTsString(match[2]), annotation: unescapeTsString(match[3]) });
}

const normalized = (text) => text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉]/g, '');
const badText = (text) => !text?.trim() || /\uFFFD|\?函|甇文|嚗[\uE000-\uF8FF]/u.test(text);
const frequency = (field) => {
  const counts = new Map();
  for (const aid of aids.values()) {
    const key = normalized(aid[field] || '');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
};
const translationFrequency = frequency('translation');
const annotationFrequency = frequency('annotation');
const canonicalByPassage = new Map(passages.map((passage) => [passage.id, normalized(passage.canonicalText)]));
const canonicalSets = (field) => {
  const sets = new Map();
  for (const [passageId, aid] of aids) {
    const key = normalized(aid[field] || '');
    if (!sets.has(key)) sets.set(key, new Set());
    sets.get(key).add(canonicalByPassage.get(passageId) || passageId);
  }
  return sets;
};
const translationCanonicalSets = canonicalSets('translation');
const annotationCanonicalSets = canonicalSets('annotation');
const uniqueTranslation = (aid) => !badText(aid?.translation) && translationCanonicalSets.get(normalized(aid.translation)).size === 1;
const uniqueAnnotation = (aid) => !badText(aid?.annotation) && annotationCanonicalSets.get(normalized(aid.annotation)).size === 1;

const chaptersByWork = new Map(works.map((work) => [work.id, chapters.filter((chapter) => chapter.workId === work.id)]));
const passagesByWork = new Map(works.map((work) => [work.id, passages.filter((passage) => {
  const chapter = chapters.find((item) => item.id === passage.chapterId);
  return chapter?.workId === work.id;
})]));

const workRows = works.map((work) => {
  const workChapters = chaptersByWork.get(work.id);
  const workPassages = passagesByWork.get(work.id);
  const workSentences = sentences.filter((sentence) => sentence.id.startsWith(`${work.id}_`));
  const passageAids = workPassages.map((passage) => aids.get(passage.id));
  const translationsPresent = passageAids.filter((aid) => !badText(aid?.translation)).length;
  const annotationsPresent = passageAids.filter((aid) => !badText(aid?.annotation)).length;
  const bespokeTranslations = passageAids.filter(uniqueTranslation).length;
  const bespokeAnnotations = passageAids.filter(uniqueAnnotation).length;
  return {
    id: work.id, title: work.title, chapters: workChapters.length, passages: workPassages.length,
    sentences: workSentences.length, characters: workSentences.reduce((sum, item) => sum + normalized(item.canonicalText).length, 0),
    translationsPresent, annotationsPresent, bespokeTranslations, bespokeAnnotations,
  };
});

const totals = workRows.reduce((sum, row) => {
  for (const key of ['chapters','passages','sentences','characters','translationsPresent','annotationsPresent','bespokeTranslations','bespokeAnnotations']) sum[key] += row[key];
  return sum;
}, { works: works.length, chapters:0, passages:0, sentences:0, characters:0, translationsPresent:0, annotationsPresent:0, bespokeTranslations:0, bespokeAnnotations:0 });
const pct = (value, total) => total ? Number((value / total * 100).toFixed(2)) : 0;

const report = {
  generatedAt: new Date().toISOString(),
  processingStatus: {
    status: 'manual-batch-in-progress',
    backgroundWorkerConfirmed: false,
    note: 'Audits run on demand. No LitC-specific unattended background updater is configured.',
  },
  methodology: {
    canonical: 'Inventory only. External source completeness must be verified work by work.',
    translationPresent: 'A passage-level modern translation exists and is not a known broken placeholder.',
    bespoke: 'The normalized text occurs only once in the corpus; repeated templates are excluded.',
  },
  totals: {
    ...totals,
    translationPresencePct: pct(totals.translationsPresent, totals.passages),
    bespokeTranslationPct: pct(totals.bespokeTranslations, totals.passages),
    annotationPresencePct: pct(totals.annotationsPresent, totals.passages),
    bespokeAnnotationPct: pct(totals.bespokeAnnotations, totals.passages),
  },
  duplicateTemplates: {
    translationPassages: [...aids.values()].filter((aid) => translationCanonicalSets.get(normalized(aid.translation)).size > 1).length,
    annotationPassages: [...aids.values()].filter((aid) => annotationCanonicalSets.get(normalized(aid.annotation)).size > 1).length,
  },
  duplicateItems: [...aids.entries()].filter(([, aid]) =>
    translationCanonicalSets.get(normalized(aid.translation)).size > 1 || annotationCanonicalSets.get(normalized(aid.annotation)).size > 1
  ).map(([passageId, aid]) => ({
    passageId,
    canonicalText: passages.find((passage) => passage.id === passageId)?.canonicalText || '',
    translation: aid.translation,
    duplicateTranslation: translationCanonicalSets.get(normalized(aid.translation)).size > 1,
    duplicateAnnotation: annotationCanonicalSets.get(normalized(aid.annotation)).size > 1,
  })),
  works: workRows.map((row) => ({
    ...row,
    translationPresencePct: pct(row.translationsPresent, row.passages),
    bespokeTranslationPct: pct(row.bespokeTranslations, row.passages),
    annotationPresencePct: pct(row.annotationsPresent, row.passages),
    bespokeAnnotationPct: pct(row.bespokeAnnotations, row.passages),
  })),
};

fs.writeFileSync(path.join(root, 'scratch/corpus_completeness_audit.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'scratch/progress_report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.totals, null, 2));
