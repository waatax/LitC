import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch7_ch8.json', 'utf8'));

data.forEach(ch => {
  ch.passages.forEach(p => {
    // Check if text has phonetic notes or commentary patterns
    if (p.canonicalText.includes('反') || p.canonicalText.includes('音') || p.canonicalText.includes('去聲') || p.canonicalText.includes('【')) {
      console.log(`[SUSPICIOUS PATTERN] Passage ${p.id} (${ch.chapterTitle}):`);
      console.log(p.canonicalText);
    }
  });
});
