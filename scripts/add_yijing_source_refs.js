import fs from 'fs';

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
const re = /(export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\(")([\s\S]*?)("\)\);)/;
const match = worksSource.match(re);
if (!match) throw new Error('Missing passages data');
const passages = JSON.parse(decodeURIComponent(match[2]));
const sourceRefs = [
  { label: '經文校本', edition: '《周易正義》（王弼、韓康伯注，孔穎達疏）' },
  { label: '數位對校', edition: '中國哲學書電子化計劃《周易》／維基文庫《周易正義》' },
];
let changed = 0;
for (const passage of passages) {
  if (!passage.id.startsWith('yi-jing_')) continue;
  passage.sourceRefs = sourceRefs;
  changed += 1;
}
if (changed !== 64) throw new Error(`Expected 64 Yijing passages, got ${changed}`);
worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(passages))}$3`);
fs.writeFileSync(worksFile, worksSource, 'utf8');
console.log('Added source references to 64 Yijing passages.');
