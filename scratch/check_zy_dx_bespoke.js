import fs from 'fs';
import path from 'path';

const aidFile = path.join(process.cwd(), 'src/data/readingAid.ts');
const aidSource = fs.readFileSync(aidFile, 'utf8');

const worksSource = fs.readFileSync(path.join(process.cwd(), 'src/data/works.ts'), 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m => JSON.parse(decodeURIComponent(m[1])));
const [works, chapters, passages] = encoded;

const genericPattern = /本段節選自|對應篇章的核心文意|義理深遠/;

const zy_dx_passages = passages.filter(p => p.chapterId.startsWith('zhong-yong') || p.chapterId.startsWith('da-xue'));

let bespoke = 0;
let generic = 0;

zy_dx_passages.forEach(p => {
  const match = aidSource.match(new RegExp(`'${p.id}':\\s*\\{[^\\}]+\\}`, 's'));
  if (match) {
    if (genericPattern.test(match[0])) {
      console.log(`[GENERIC] ${p.id}`);
      generic++;
    } else {
      bespoke++;
    }
  } else {
    console.log(`[MISSING] ${p.id}`);
  }
});

console.log(`Zhongyong & Daxue bespoke: ${bespoke}, generic: ${generic}, total: ${zy_dx_passages.length}`);
