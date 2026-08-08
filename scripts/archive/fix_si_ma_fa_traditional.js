import fs from 'fs';
const p='./src/data/readingAid.ts'; let t=fs.readFileSync(p,'utf8'); t=t.replaceAll('靈台','靈臺'); fs.writeFileSync(p,t,'utf8'); console.log('fixed 靈臺');
