import fs from 'fs';

const worksSource = fs.readFileSync('./src/data/works.ts', 'utf8');
const source = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return JSON.parse(decodeURIComponent(match[1]));
}
const works = readArray('works', 'Work');
const chapters = readArray('chapters', 'Chapter');
const passages = readArray('passages', 'Passage');
const sentences = readArray('sentences', 'Sentence');
const work = works.find(item => item.id === 'liu-tao');
const liuChapters = chapters.filter(item => item.workId === 'liu-tao').sort((a, b) => a.order - b.order);
const failures = [];
const warnings = [];
const norm = text => text.replace(/\s+/g, '').replace(/[，。；：！？、「」『』]/g, '');

if (work.chapterIds.length !== 60) failures.push(`work.chapterIds=${work.chapterIds.length}, expected 60`);
if (liuChapters.length !== 60) failures.push(`chapters=${liuChapters.length}, expected 60`);
for (let index = 0; index < 60; index++) {
  const expected = source.chapters[index];
  const chapter = liuChapters[index];
  const id = `liu-tao_ch-${index + 1}`;
  if (!chapter || chapter.id !== id) {
    failures.push(`chapter ${index + 1}: missing or id/order mismatch`);
    continue;
  }
  if (!chapter.title.endsWith(`・${expected.title}`)) failures.push(`${id}: title mismatch (${chapter.title} / ${expected.title})`);
  const chapterPassages = chapter.passageIds.map(pid => passages.find(item => item.id === pid));
  if (chapterPassages.some(item => !item)) failures.push(`${id}: missing passage link`);
  const canonical = chapterPassages.filter(Boolean).map(item => item.canonicalText).join('');
  if (norm(canonical) !== norm(expected.text)) {
    const delta = Math.abs(norm(canonical).length - norm(expected.text).length);
    failures.push(`${id}: canonical differs from staged source (normalized length delta ${delta})`);
  }
  for (const passage of chapterPassages.filter(Boolean)) {
    if (!passage.sourceRefs || passage.sourceRefs.length < 2) failures.push(`${passage.id}: sourceRefs missing/incomplete`);
    const linkedSentences = passage.sentenceIds.map(sid => sentences.find(item => item.id === sid));
    if (linkedSentences.some(item => !item)) failures.push(`${passage.id}: missing sentence link`);
    if (norm(linkedSentences.filter(Boolean).map(item => item.canonicalText).join('')) !== norm(passage.canonicalText)) failures.push(`${passage.id}: sentence text does not reconstruct passage`);
    const aidPattern = new RegExp(`'${passage.id}': \\{\\s*translation: \"([^\"]*)\",\\s*analysis: \"([^\"]*)\"`);
    const aid = aidSource.match(aidPattern);
    if (!aid) failures.push(`${passage.id}: reading aid missing`);
    else {
      if (aid[1].length < 25) failures.push(`${passage.id}: translation too short`);
      if (aid[2].length < 40) failures.push(`${passage.id}: analysis too short`);
    }
  }
}

const ids = [...aidSource.matchAll(/'(liu-tao_ch-\d+_p-\d+)': \{/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) failures.push('duplicate liu-tao reading-aid ids');
for (const phrase of ['此作品在全世界', 'Public domain', '属于公有领域']) {
  if (liuChapters.some(ch => ch.passageIds.some(pid => passages.find(p => p.id === pid)?.canonicalText.includes(phrase)))) failures.push(`non-canonical footer remains: ${phrase}`);
}
const translations = [...aidSource.matchAll(/'(liu-tao_ch-\d+_p-\d+)': \{\s*translation: "([^"]*)"/g)];
const seenTranslations = new Map();
for (const [, id, text] of translations) {
  if (seenTranslations.has(text)) failures.push(`duplicate translation: ${seenTranslations.get(text)} and ${id}`);
  seenTranslations.set(text, id);
}
if (work.totalChars !== sentences.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0)) failures.push('work.totalChars mismatch');

const report = {
  ok: failures.length === 0,
  work: work.title,
  chapters: liuChapters.length,
  passages: liuChapters.reduce((sum, chapter) => sum + chapter.passageIds.length, 0),
  sentences: sentences.filter(item => item.id.startsWith('liu-tao_')).length,
  characters: work.totalChars,
  readingAids: ids.length,
  failures,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
