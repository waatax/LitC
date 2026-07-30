import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksFile = path.join(root, 'src/data/works.ts');
let worksSource = fs.readFileSync(worksFile, 'utf8');

const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;

// Fix meng-zi_ch-7_p-1 interlinear comment
const p7_1 = passages.find(p => p.id === 'meng-zi_ch-7_p-1');
if (p7_1 && p7_1.canonicalText.includes('泄泄，猶沓沓也。')) {
  p7_1.canonicalText = p7_1.canonicalText.replace('泄泄，猶沓沓也。', '').replace('  ', ' ').trim();
  console.log('Fixed meng-zi_ch-7_p-1: removed interlinear comment!');
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
    console.log(`Successfully cleaned works.ts text for Mengzi Ch7 & Ch8 on attempt ${attempt}!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
