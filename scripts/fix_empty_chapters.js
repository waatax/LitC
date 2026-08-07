import fs from 'fs';

// 1. Read works.ts
const worksFile = fs.readFileSync('src/data/works.ts', 'utf8');

// 2. Read quality_issues.json to get the 27 empty chapter IDs
const issues = JSON.parse(fs.readFileSync('scratch/quality_issues.json', 'utf8'));
const emptyChapterIds = issues.CHAPTER_EMPTY.map(e => e.itemId);

// 3. Extract and parse `works` array
const worksMatch = worksFile.match(/export const works = JSON\.parse\('(.*?)'\) as Work\[\];/s);
let worksStr = worksMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
let works = JSON.parse(worksStr);

// 4. Extract and parse `chapters` array
const chaptersMatch = worksFile.match(/export const chapters = JSON\.parse\('(.*?)'\) as Chapter\[\];/s);
let chaptersStr = chaptersMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
let chapters = JSON.parse(chaptersStr);

// 5. Filter out empty chapters from `chapters`
chapters = chapters.filter(c => !emptyChapterIds.includes(c.id));

// 6. Filter out empty chapter IDs from `works`
works = works.map(w => {
  w.chapterIds = w.chapterIds.filter(id => !emptyChapterIds.includes(id));
  return w;
});

// 7. Format back to escaped strings
function escapeForParse(str) {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const newWorksStr = escapeForParse(JSON.stringify(works));
const newChaptersStr = escapeForParse(JSON.stringify(chapters));

let newWorksFile = worksFile.replace(
  /export const works = JSON\.parse\('(.*?)'\) as Work\[\];/s,
  `export const works = JSON.parse('${newWorksStr}') as Work[];`
);

newWorksFile = newWorksFile.replace(
  /export const chapters = JSON\.parse\('(.*?)'\) as Chapter\[\];/s,
  `export const chapters = JSON.parse('${newChaptersStr}') as Chapter[];`
);

fs.writeFileSync('src/data/works.ts', newWorksFile, 'utf8');
console.log('Fixed works.ts!');
