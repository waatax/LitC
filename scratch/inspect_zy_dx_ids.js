import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m => JSON.parse(decodeURIComponent(m[1])));
const [works, chapters, passages] = encoded;

const targets = passages.filter(p => p.chapterId.startsWith('zhong-yong') || p.chapterId.startsWith('da-xue'));
console.log(targets.map(p => ({ id: p.id, chapterId: p.chapterId })));
