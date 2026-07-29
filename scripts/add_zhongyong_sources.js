import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const encodedMatches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
if (encodedMatches.length < 3) throw new Error('Passage dataset not found.');

const passages = JSON.parse(decodeURIComponent(encodedMatches[2][1]));
const references = [
  {
    label: '《禮記・中庸》—中國哲學書電子化計劃',
    edition: '《禮記》通行本',
    location: 'https://ctext.org/liji/zhong-yong/zh',
    accessedAt: '2026-07-29',
  },
  {
    label: '朱熹《四書章句集註・中庸章句》',
    edition: '國家圖書館藏《四書章句集註（大學、中庸）》影像本',
    location: 'https://taiwanebook.ncl.edu.tw/zh-tw/book/NTL-9900008137/reader',
    accessedAt: '2026-07-29',
  },
];

let updated = 0;
for (const passage of passages) {
  if (!passage.id.startsWith('zhong-yong_')) continue;
  passage.sourceRefs = references;
  updated += 1;
}
if (updated !== 33) throw new Error(`Expected 33 Zhongyong passages, found ${updated}.`);

const oldExpression = encodedMatches[2][0];
const newExpression = `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(passages))}"))`;
source = source.replace(oldExpression, newExpression);
fs.writeFileSync(file, source, 'utf8');
console.log(`Added two traceable sources to ${updated} Zhongyong passages.`);
