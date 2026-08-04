import fs from 'fs';
import path from 'path';

const readingAidPath = path.resolve('./src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

const p1Path = path.resolve('./src/data/sentence_chunks/passages_part1.ts');
const p2Path = path.resolve('./src/data/sentence_chunks/passages_part2.ts');
let p1 = fs.readFileSync(p1Path, 'utf8');
let p2 = fs.readFileSync(p2Path, 'utf8');

const lines = readingAidContent.split('\n');
let echoCount = 0;
let inXunzi = false;
let currentXunziId = '';
let currentCanonical = '';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  const idMatch = line.match(/'(xunzi_[^']+)':\s*\{/);
  if (idMatch) {
    inXunzi = true;
    currentXunziId = idMatch[1];
    
    const regex = new RegExp(`id:\\s*'${currentXunziId}',[\\s\\S]*?canonicalText:\\s*'([^']+)'`);
    let m = p1.match(regex) || p2.match(regex);
    if (m) {
      currentCanonical = m[1];
    }
  } else if (line.match(/'([a-zA-Z0-9_-]+)':\s*\{/)) {
    inXunzi = false;
  }
  
  if (inXunzi && line.includes('translation:')) {
    const translationText = line.match(/translation:\s*"([^"]+)"/) || line.match(/translation:\s*'([^']+)'/);
    if (translationText && translationText[1] === currentCanonical) {
        echoCount++;
    }
  }
}

console.log(`Remaining exact match echoes: ${echoCount}`);
