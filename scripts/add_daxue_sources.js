import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const encodedMatches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
if (encodedMatches.length < 3) throw new Error('Passage dataset not found.');

const passages = JSON.parse(decodeURIComponent(encodedMatches[2][1]));
const references = [
  {
    label: '《禮記・大學》—中國哲學書電子化計劃',
    edition: '《禮記》通行本',
    location: 'https://ctext.org/liji/da-xue/zh',
    accessedAt: '2026-07-29',
  },
  {
    label: '朱熹《四書章句集註・大學章句》',
    edition: '朱熹章句本（維基文庫校錄）',
    location: 'https://zh.wikisource.org/zh-hant/四書章句集註/大學章句',
    accessedAt: '2026-07-29',
  },
];

let updated = 0;
for (const passage of passages) {
  if (!passage.id.startsWith('da-xue_')) continue;
  passage.sourceRefs = references;
  updated += 1;
}
if (updated !== 12) throw new Error(`Expected 12 Daxue passages, found ${updated}.`);

const oldExpression = encodedMatches[2][0];
const newExpression = `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(passages))}"))`;
source = source.replace(oldExpression, newExpression);
fs.writeFileSync(file, source, 'utf8');
console.log(`Added two traceable sources to ${updated} Daxue passages.`);

