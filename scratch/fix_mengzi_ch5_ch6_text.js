import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksFile = path.join(root, 'src/data/works.ts');
let worksSource = fs.readFileSync(worksFile, 'utf8');

const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;

// Fix meng-zi_ch-6_p-4 interlinear comment
const p6_4 = passages.find(p => p.id === 'meng-zi_ch-6_p-4');
if (p6_4 && p6_4.canonicalText.includes('羨，延面反。')) {
  const commentStr = '羨，延面反。通功易事，謂通人之功而交易其事。羨，餘也。有餘，言無所貿易，而積於無用也。梓人匠人，木工也。輪人輿人，車工也。';
  p6_4.canonicalText = p6_4.canonicalText.replace(commentStr, '').replace('  ', ' ').trim();
  console.log('Fixed meng-zi_ch-6_p-4: removed interlinear comment!');
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
    console.log(`Successfully cleaned works.ts text for Mengzi Ch5 & Ch6 on attempt ${attempt}!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
