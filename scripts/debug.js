import fs from 'fs';
const s = fs.readFileSync('src/data/works.ts', 'utf8');
const p = "export const works = JSON.parse('";
console.log('Index:', s.indexOf(p));
const actual = s.substring(s.indexOf('export const works'), s.indexOf('export const works') + 50);
console.log('Actual string:', actual);
