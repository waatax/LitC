import fs from 'fs';

let code = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

if (!code.includes('export function getPassageReadingAid')) {
  const func = `
export function getPassageReadingAid(passageId: string): PassageReadingAid | undefined {
  return PASSAGE_AIDS[passageId];
}
`;
  code = code.replace('export function getSentenceTranslation', func + '\nexport function getSentenceTranslation');
  fs.writeFileSync('./src/data/readingAid.ts', code, 'utf8');
  console.log('Added getPassageReadingAid function to readingAid.ts!');
}
