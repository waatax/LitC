import fs from 'fs';

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

// Replace any leftover `對曰：` in translations with `回答說：`
readingAidCode = readingAidCode.replace(/(translation:\s*"[^"]*)對曰：([^"]*")/g, '$1回答說：$2');

fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log('Replaced all 対曰 in translations with 回答說!');
