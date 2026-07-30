import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch11_ch12.json', 'utf8'));

data.forEach(ch => {
  ch.passages.forEach(p => {
    if (p.canonicalText.includes('反') || p.canonicalText.includes('音') || p.canonicalText.includes('去聲') || p.canonicalText.includes('【') || p.canonicalText.includes('，，')) {
      console.log(`[SUSPICIOUS PATTERN] Passage ${p.id} (${ch.chapterTitle}):`);
      console.log(p.canonicalText);
    }
  });
});
