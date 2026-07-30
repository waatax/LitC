import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/mengzi_ch1_ch2.json', 'utf8'));

console.log("=== Chapter 1: 梁惠王上 ===");
data[0].passages.forEach(p => {
  console.log(`--- Passage ${p.id} ---`);
  console.log(p.canonicalText);
});
