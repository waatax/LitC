import fs from 'fs';

const worksTs = fs.readFileSync('./src/data/works.ts', 'utf8');
const readJson = name => {
  const pattern = new RegExp(`export const ${name}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`);
  const match = worksTs.match(pattern);
  if (!match) throw new Error(`Unable to parse ${name}`);
  return JSON.parse(decodeURIComponent(match[1]));
};
const chapters = readJson('chapters');
const passages = readJson('passages');
const sentences = readJson('sentences');
const source = JSON.parse(fs.readFileSync('./scratch/wei_liao_zi_full_source.json', 'utf8'));
const aidsText = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

const weiChapters = chapters.filter(item => item.workId === 'wei-liao-zi').sort((a, b) => a.order - b.order);
const sourceByOrder = new Map(source.chapters.map(item => [item.order, item]));
const failures = [];
const warnings = [];
if (weiChapters.length !== 24) failures.push(`chapter count ${weiChapters.length}, expected 24`);
for (let index = 0; index < weiChapters.length; index++) {
  const chapter = weiChapters[index];
  const expected = sourceByOrder.get(index + 1);
  if (!expected) { failures.push(`missing source order ${index + 1}`); continue; }
  const chapterPassages = passages.filter(item => item.chapterId === chapter.id);
  const chapterSentences = sentences.filter(item => chapterPassages.some(passage => passage.id === item.passageId));
  const actual = chapterSentences.map(item => item.canonicalText).join('');
  if (expected.text && actual !== expected.text.replace(/\n/g, '')) {
    warnings.push(`${index + 1} ${chapter.title}: source mismatch (${actual.length}/${expected.text.length})`);
  }
  if (chapterPassages.length === 0) failures.push(`${index + 1} ${chapter.title}: no passages`);
  for (const passage of chapterPassages) {
    if (!passage.sourceRefs?.length) warnings.push(`${passage.id}: missing sourceRefs`);
    if (!passage.sentenceIds?.length) failures.push(`${passage.id}: no sentenceIds`);
    const aid = aidsText.match(new RegExp(`['"]${passage.id}['"]\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
    if (!aid) failures.push(`${passage.id}: missing reading aid`);
    else if (/translation:\s*["']([^"']*)/.test(aid[1]) && /analysis:\s*["']([^"']*)/.test(aid[1])) {
      const translation = aid[1].match(/translation:\s*["']([^"']*)/)?.[1] ?? '';
      const analysis = aid[1].match(/analysis:\s*["']([^"']*)/)?.[1] ?? '';
      if (translation.length < 20) warnings.push(`${passage.id}: short translation`);
      if (analysis.length < 40) warnings.push(`${passage.id}: short analysis`);
    }
  }
}
const translations = [...aidsText.matchAll(/translation:\s*["']([^"']*)/g)].map(m => m[1]);
const duplicateTranslations = translations.length - new Set(translations).size;
console.log(JSON.stringify({ work: '尉繚子', chapters: weiChapters.length, sourceChapters: source.chapters.length, sourceGaps: source.missingChapters ?? [], passages: passages.filter(item => item.chapterId?.startsWith('wei-liao-zi')).length, duplicateTranslations, failures, warnings }, null, 2));
if (failures.length) process.exitCode = 1;
