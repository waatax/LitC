import fs from 'fs';
import path from 'path';

const readingAidPath = path.resolve('./src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

// The file exports PASSAGE_AIDS object.
// I will parse the file to find xunzi_ entries that contain 【正體白話意譯】
const lines = readingAidContent.split('\n');
let xunziCount = 0;
let inXunzi = false;
let currentXunziId = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/'(xunzi_ch-\d+_p-\d+)': \{/);
  if (idMatch) {
    inXunzi = true;
    currentXunziId = idMatch[1];
  } else if (line.match(/'([a-zA-Z0-9_-]+)': \{/)) {
    inXunzi = false;
  }
  
  if (inXunzi && line.includes('【正體白話意譯】')) {
    xunziCount++;
    console.log(`Found echo in ${currentXunziId}: ${line.trim()}`);
  }
}

console.log(`Total xunzi echoes: ${xunziCount}`);
