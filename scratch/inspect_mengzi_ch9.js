import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch9_ch10.json', 'utf8'));

console.log("=== Chapter 9: 萬章上 ===");
data[0].passages.forEach(p => {
  console.log(`--- Passage ${p.id} ---`);
  console.log(p.canonicalText);
});
