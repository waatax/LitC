const fs = require('fs');
const f = 'src/data/readingAid.ts';
let c = fs.readFileSync(f, 'utf8');
if (!c.startsWith('import')) {
  const header = [
    "import type { Sentence } from '../types/content';",
    "",
    "export interface PassageReadingAid {",
    "  translation: string;",
    "  analysis: string;",
    "}",
    "",
    ""
  ].join('\n');
  c = header + c;
  fs.writeFileSync(f, c, 'utf8');
  console.log('Added type imports successfully');
} else {
  console.log('Imports already present');
}
