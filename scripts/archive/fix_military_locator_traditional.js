import fs from 'fs';
const p='./src/data/readingAid.ts';
let t=fs.readFileSync(p,'utf8');
for (const [a,b] of [['于','於'],['挂','掛'],['占其將','佔其將'],['靈台','靈臺'],['群吏','羣吏'],['群下','羣下'],['勢秘','勢祕'],['舍己','捨己']]) t=t.replaceAll(a,b);
fs.writeFileSync(p,t,'utf8');
console.log('fixed military locator traditional forms');
