import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch5_ch6.json', 'utf8'));

data.forEach(ch => {
  console.log(`\n========================================`);
  console.log(`Chapter ${ch.chapterIndex}: ${ch.chapterTitle} (${ch.chapterId}) [${ch.passages.length} passages]`);
  ch.passages.forEach(p => {
    console.log(`--- Passage ${p.id} ---`);
    console.log(p.canonicalText);
  });
});
