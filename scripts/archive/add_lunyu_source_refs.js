import fs from 'fs';

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
const re = /(export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\(")([\s\S]*?)("\)\);)/;
const match = worksSource.match(re);
if (!match) throw new Error('Missing passages data');

const passages = JSON.parse(decodeURIComponent(match[2]));
const sourceRefs = [
  {
    label: '經文校本',
    edition: '《論語注疏》（魏何晏集解、唐陸德明音義、宋邢昺疏；十三經注疏本）',
  },
  {
    label: '數位對校',
    edition: '中國哲學書電子化計劃《論語》；維基文庫《論語注疏》與《四庫全書》本《論語注疏》',
  },
];

let changed = 0;
for (const passage of passages) {
  if (!passage.id.startsWith('lun-yu_')) continue;
  passage.sourceRefs = sourceRefs;
  changed += 1;
}

if (changed !== 502) throw new Error(`Expected 502 Lunyu passages, got ${changed}`);
worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(passages))}$3`);
fs.writeFileSync(worksFile, worksSource, 'utf8');
console.log('Added source references to 502 Lunyu passages.');
