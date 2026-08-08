import fs from 'fs';
import path from 'path';

const worksTsPath = 'src/data/works.ts';

// 1. Read catalog to get works and chapters
const catalogStr = fs.readFileSync('src/data/catalog.ts', 'utf8');

let worksMatch = catalogStr.match(/export const catalogWorks = JSON\.parse\('(.+)'\) as Work\[\]/);
let works = JSON.parse(worksMatch[1].replace(/\\'/g, "'"));

console.log('Total works in catalog:', works.length);

for (const w of works) {
    console.log(w.id, w.title, w.chapterIds.length, 'chapters', w.totalChars, 'chars');
}
