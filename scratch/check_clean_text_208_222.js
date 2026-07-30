import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('scratch/guwen_208_222.json', 'utf8'));

data.forEach(ch => {
  ch.passages.forEach(p => {
    // Check for suspicious interlinear comments or punctuation issues
    if (p.canonicalText.includes('此引') || p.canonicalText.includes('夾寫') || p.canonicalText.includes('【') || p.canonicalText.includes('按：')) {
      console.log(`[SUSPICIOUS COMMENT FOUND] Chapter ${ch.chapterIndex} (${ch.chapterTitle}), Passage ${p.id}:`);
      console.log(p.canonicalText);
    }
  });
});
