import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Find export function getPassageReadingAid
const exportIndex = content.indexOf('export function getPassageReadingAid');

// Remove any internal `};` or `};\n` before export function getPassageReadingAid
let objectBody = content.slice(0, exportIndex);
const remaining = content.slice(exportIndex);

// Remove any standalone `};` inside objectBody except trailing whitespace
objectBody = objectBody.replace(/\}\s*;\s*\n/g, '},\n');

// Ensure proper single `};` at the end of PASSAGE_AIDS object
objectBody = objectBody.trimEnd();
if (objectBody.endsWith(',')) {
  objectBody = objectBody.slice(0, -1);
}
if (!objectBody.endsWith('}')) {
  objectBody += '\n}';
}

content = objectBody + ';\n\n' + remaining;

fs.writeFileSync(filepath, content, 'utf8');
console.log("Successfully fixed PASSAGE_AIDS object boundary in readingAid.ts!");
