import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function diagnoseCannedText() {
  const { works, chapters, passages, sentences } = await import('../src/data/works.js');
  const { getReadingAid, getPassageReadingAid } = await import('../src/data/readingAid.js');
  const { getSentencesByPassage } = await import('../src/data/index.js');

  console.log(`Diagnosing ${sentences.length} sentences for canned boilerplate text...`);

  let cannedTranslationHintCount = 0;
  let cannedAnalysisCount = 0;
  let cannedStructuredCount = 0;

  const samples = [];

  sentences.forEach((s) => {
    const rawHint = s.translationHint;
    if (rawHint && (rawHint.includes('此句釋義提示') || rawHint.includes('用白話說：'))) {
      cannedTranslationHintCount++;
      if (samples.length < 5) {
        samples.push({ type: 'sentence.translationHint', id: s.id, text: s.canonicalText, hint: rawHint });
      }
    }
  });

  passages.forEach((p) => {
    const ch = chapters.find(c => c.id === p.chapterId);
    const workId = ch ? ch.workId : '';
    const pSents = getSentencesByPassage(p.id);

    pSents.forEach((s) => {
      if (s.translationHint && s.translationHint.includes('此句釋義提示')) {
        cannedStructuredCount++;
        if (samples.length < 10) {
          samples.push({ type: 'getSentencesByPassage.translationHint', id: s.id, text: s.canonicalText, hint: s.translationHint });
        }
      }
      if (s.structuredTranslation) {
        const { translation, philosophicalNote } = s.structuredTranslation;
        if (translation.includes('此句釋義提示') || (philosophicalNote && philosophicalNote.includes('本段須放在前後文一併理解'))) {
          cannedStructuredCount++;
          if (samples.length < 15) {
            samples.push({ type: 'structuredTranslation', id: s.id, text: s.canonicalText, translation, philosophicalNote });
          }
        }
      }
    });

    const aid = getPassageReadingAid(p.id, p.canonicalText, workId, pSents);
    if (aid.analysis.includes('本段須放在前後文一併理解') || aid.translation.includes('此句釋義提示')) {
      cannedAnalysisCount++;
      if (samples.length < 20) {
        samples.push({ type: 'passageAid', id: p.id, translation: aid.translation, analysis: aid.analysis });
      }
    }
  });

  console.log(`Sentences with raw translationHint containing "此句釋義提示": ${cannedTranslationHintCount}`);
  console.log(`Passages with canned analysis/translation: ${cannedAnalysisCount}`);
  console.log(`Sentences from getSentencesByPassage with canned translation/analysis: ${cannedStructuredCount}`);

  console.log('Sample canned items found:', JSON.stringify(samples, null, 2));
}

diagnoseCannedText();
