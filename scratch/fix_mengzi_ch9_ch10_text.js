import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksFile = path.join(root, 'src/data/works.ts');
let worksSource = fs.readFileSync(worksFile, 'utf8');

const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;

// Fix meng-zi_ch-9_p-9 double comma
const p9_9 = passages.find(p => p.id === 'meng-zi_ch-9_p-9');
if (p9_9 && p9_9.canonicalText.includes('年已七十矣，，曾不知')) {
  p9_9.canonicalText = p9_9.canonicalText.replace('年已七十矣，，曾不知', '年已七十矣，曾不知');
  console.log('Fixed meng-zi_ch-9_p-9: removed double comma!');
}

// Re-encode works.ts
const newEncoded = arrays.map(arr => encodeURIComponent(JSON.stringify(arr)));
let newWorksSource = worksSource;
matches.forEach((m, idx) => {
  newWorksSource = newWorksSource.replace(m[1], newEncoded[idx]);
});

let written = false;
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    fs.writeFileSync(worksFile, newWorksSource, 'utf8');
    written = true;
    console.log(`Successfully cleaned works.ts text for Mengzi Ch9 & Ch10 on attempt ${attempt}!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
