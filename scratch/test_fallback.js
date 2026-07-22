import { works, chapters, passages, sentences } from '../src/data/works.js';
import { getReadingAid, getPassageReadingAid } from '../src/data/readingAid.js';

// Let's implement the fixed logic on top of the exported functions
function getReadingAidFixed(sentence, workId) {
  const pSentences = sentences.filter(s => s.passageId === sentence.passageId);
  const passageAid = getPassageReadingAid(sentence.passageId, '', workId, pSentences);
  
  if (passageAid && passageAid.translation) {
    const translationSentences = passageAid.translation
      .split(/(?<=[。！？])\s*/)
      .filter(Boolean);
    
    const index = pSentences.findIndex(s => s.id === sentence.id);
    
    if (index !== -1 && index < translationSentences.length) {
      return translationSentences[index];
    } else if (translationSentences.length > 0) {
      // If out of bounds, return the whole passage translation
      return passageAid.translation;
    }
  }

  return sentence.translationHint || '';
}

// Run the check with fixed logic
let emptyCount = 0;
let scaffoldedCount = 0;
let englishCount = 0;

for (const work of works) {
  const chIds = work.chapterIds;
  for (const chId of chIds) {
    const chPassages = passages.filter(p => p.chapterId === chId);
    for (const passage of chPassages) {
      const pSentences = sentences.filter(s => s.passageId === passage.id);
      for (const sentence of pSentences) {
        const trans = getReadingAidFixed(sentence, work.id);
        if (!trans || !trans.trim()) {
          emptyCount++;
        } else if (trans.startsWith('用白話說：')) {
          scaffoldedCount++;
        } else if (/[a-zA-Z]{4,}/.test(trans)) {
          englishCount++;
        }
      }
    }
  }
}

console.log(`Fixed logic results:`);
console.log(`- Empty translations: ${emptyCount}`);
console.log(`- Scaffolded translations: ${scaffoldedCount}`);
console.log(`- English translation count: ${englishCount}`);
