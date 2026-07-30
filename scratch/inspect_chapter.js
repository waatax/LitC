import fs from 'fs';

const source = fs.readFileSync('src/data/works.ts', 'utf8');
const encoded = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [, chapters, passages, sentences] = encoded;
const chapterId = process.argv[2];
console.log(JSON.stringify({
  chapter: chapters.find((item) => item.id === chapterId),
  passages: passages.filter((item) => item.chapterId === chapterId),
  sentences: sentences.filter((item) => item.id.startsWith(`${chapterId}_`)),
}, null, 2));
