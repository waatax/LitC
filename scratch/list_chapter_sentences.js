import fs from 'fs';

const source = fs.readFileSync('src/data/works.ts', 'utf8');
const arrays = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const sentences = arrays[3];
const prefix = process.argv[2];
for (const sentence of sentences.filter((item) => item.id.startsWith(prefix))) {
  console.log(`${sentence.id}\t${sentence.canonicalText}`);
}
