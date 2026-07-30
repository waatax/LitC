import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksFile = path.join(root, 'src/data/works.ts');
let worksSource = fs.readFileSync(worksFile, 'utf8');

const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;

// Fix meng-zi_ch-3_p-2 comma anomaly if present
const p3_2 = passages.find(p => p.id === 'meng-zi_ch-3_p-2');
if (p3_2 && p3_2.canonicalText.includes('昔者子貢、問於孔子曰')) {
  p3_2.canonicalText = p3_2.canonicalText.replace('昔者子貢、問於孔子曰', '昔者子貢問於孔子曰');
  console.log('Fixed meng-zi_ch-3_p-2 comma anomaly!');
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
    console.log(`Successfully cleaned works.ts text for Mengzi Ch3 & Ch4 on attempt ${attempt}!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
