import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch3_ch4.json', 'utf8'));

console.log("=== Chapter 3: 公孫丑上 ===");
data[0].passages.forEach(p => {
  console.log(`--- Passage ${p.id} ---`);
  console.log(p.canonicalText);
});
