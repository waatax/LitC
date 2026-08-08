import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Replace any `},\n},` or `}\n},` with `},\n`
content = content.replace(/\}\n\},/g, '},\n');
content = content.replace(/\},\n\},/g, '},\n');

// Also remove any `};` that occurs before `export function getPassageReadingAid`
const exportIndex = content.indexOf('export function getPassageReadingAid');
let body = content.slice(0, exportIndex);
const tail = content.slice(exportIndex);

body = body.replace(/\}\s*;\s*\n/g, '},\n');
body = body.trimEnd();
if (body.endsWith(',')) body = body.slice(0, -1);
if (!body.endsWith('}')) body += '\n}';

content = body + ';\n\n' + tail;

fs.writeFileSync(filepath, content, 'utf8');
console.log("Successfully fixed object boundary in readingAid.ts!");
