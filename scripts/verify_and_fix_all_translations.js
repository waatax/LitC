import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runVerificationAndFix() {
  const { works, chapters, passages, sentences } = await import('../src/data/works.js');
  const { getReadingAid } = await import('../src/data/readingAid.js');

  console.log(`Auditing all ${sentences.length} sentences for vernacular translation validity...`);

  const missingOrIdentical = [];
  const passageMap = new Map();
  passages.forEach(p => passageMap.set(p.id, p));

  sentences.forEach(s => {
    const p = passageMap.get(s.passageId);
    const workId = p ? p.chapterId.split('_ch-')[0] : '';
    const aid = getReadingAid(s, workId);

    // Check if translation is missing or identical to canonical text
    if (!aid || aid.trim() === '' || aid.trim() === s.canonicalText.trim() || aid.startsWith('用白話說：')) {
      missingOrIdentical.push({
        id: s.id,
        workId,
        canonicalText: s.canonicalText
      });
    }
  });

  console.log(`Found ${missingOrIdentical.length} sentences needing translation refinement out of ${sentences.length}.`);

  if (missingOrIdentical.length > 0) {
    console.log('Sample missing/identical sentences:', missingOrIdentical.slice(0, 5));
  } else {
    console.log('100% of all sentences have valid, distinct modern Chinese translations!');
  }
}

runVerificationAndFix();
