import fs from 'fs';

const readingAidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');

console.log('--- Checking Yandanzi entries in readingAid.ts ---');
for (let i = 1; i <= 11; i++) {
  const id = `yandanzi_ch-1_p-${i}`;
  const idx = readingAidSource.indexOf(`'${id}':`);
  if (idx !== -1) {
    const snippet = readingAidSource.substring(idx, idx + 400);
    console.log(`\n=== Passage ${id} ===`);
    console.log(snippet.substring(0, 300));
  } else {
    console.error(`Passage ${id} NOT FOUND!`);
  }
}
