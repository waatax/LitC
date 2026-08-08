import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findFallbacks() {
  const { works, chapters, passages, sentences } = await import('../src/data/works.js');
  const { getPassageReadingAid, getReadingAid } = await import('../src/data/readingAid.js');

  console.log(`Auditing ${passages.length} passages for generic fallback analysis...`);

  let genericAnalysisCount = 0;
  let garbledTranslationCount = 0;

  const problemPassages = [];

  passages.forEach((p) => {
    const chapter = chapters.find(c => c.id === p.chapterId);
    const workId = chapter ? chapter.workId : '';
    const pSents = sentences.filter(s => s.passageId === p.id);

    const aid = getPassageReadingAid(p.id, p.canonicalText, workId, pSents);

    const isGenericAnalysis = aid.analysis.includes('本段須放在前後文一併理解');
    const isGarbled = /，，|；；|。。|此句釋義提示/.test(aid.translation) || /，，|；；|。。|此句釋義提示/.test(aid.analysis);

    if (isGenericAnalysis) genericAnalysisCount++;
    if (isGarbled) garbledTranslationCount++;

    if (isGenericAnalysis || isGarbled) {
      problemPassages.push({
        passageId: p.id,
        workId,
        text: p.canonicalText.slice(0, 40),
        translation: aid.translation.slice(0, 40),
        analysis: aid.analysis.slice(0, 40)
      });
    }
  });

  console.log(`Passages with generic analysis template: ${genericAnalysisCount} / ${passages.length}`);
  console.log(`Passages with garbled/placeholder strings: ${garbledTranslationCount} / ${passages.length}`);

  if (problemPassages.length > 0) {
    console.log('Sample problem passages:', problemPassages.slice(0, 5));
  }
}

findFallbacks();
