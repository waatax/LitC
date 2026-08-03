import fs from 'fs';
const path = './src/data/readingAid.ts';
let text = fs.readFileSync(path, 'utf8');
text = text.replace(/\n\s*\},\n,\nexport function getPassageReadingAid/, '\n  },\n};\n\nexport function getPassageReadingAid');
text = text.replace(/\n\s*\},\nexport function getPassageReadingAid/, '\n  },\n};\n\nexport function getPassageReadingAid');
fs.writeFileSync(path, text, 'utf8');
console.log('Removed stray comma before reading-aid function.');
