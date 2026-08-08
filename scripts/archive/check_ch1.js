import fs from 'fs';
const content = fs.readFileSync('src/data/work_chunks/cai-gen-tan.ts', 'utf8');
const match = content.match(/JSON\.parse\('([^]+)'\)/);
const data = JSON.parse(match[1].replace(/\\'/g, "'"));
const ch1 = data.passages.filter(p => p.chapterId === 'cai-gen-tan_ch-1');
ch1.slice(0, 10).forEach(p => console.log(p.order, p.canonicalText));
