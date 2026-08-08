import fs from 'fs';
import path from 'path';

const readingAidPath = path.resolve('./src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');
const lines = readingAidContent.split('\n');
let echoCount = 0;
let inXunzi = false;
let currentXunziId = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/'(xunzi_[^']+)':\s*\{/);
  if (idMatch) {
    inXunzi = true;
    currentXunziId = idMatch[1];
  } else if (line.match(/'([a-zA-Z0-9_-]+)':\s*\{/)) {
    inXunzi = false;
  }
  
  if (inXunzi && line.includes('translation:') && line.includes('【白話意譯】')) {
    echoCount++;
  }
}
console.log(`Total Xunzi echoes (白話意譯): ${echoCount}`);
