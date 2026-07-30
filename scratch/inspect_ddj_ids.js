import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m => JSON.parse(decodeURIComponent(m[1])));
const [works, chapters, passages] = encoded;

const ddjPassages = passages.filter(p => p.chapterId.startsWith('dao-de-jing'));
console.log(ddjPassages.map(p => ({ id: p.id, chapterId: p.chapterId })));
