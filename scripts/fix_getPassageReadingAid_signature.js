import fs from 'fs';

let code = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

const oldFuncRegex = /export function getPassageReadingAid[\s\S]*?\n\}/;
const newFunc = `export function getPassageReadingAid(
  passageId: string,
  canonicalText?: string,
  workId?: string,
  sentences?: Sentence[] | any[]
): PassageReadingAid {
  const aid = PASSAGE_AIDS[passageId];
  if (aid) return aid;
  return fallbackReadingAid({ canonicalText, passageId }, workId);
}`;

code = code.replace(oldFuncRegex, newFunc);
fs.writeFileSync('./src/data/readingAid.ts', code, 'utf8');
console.log('Fixed getPassageReadingAid signature in readingAid.ts!');
