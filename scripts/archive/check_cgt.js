import fs from 'fs';
const content = fs.readFileSync('src/data/sentence_chunks/part8.ts', 'utf8');
const match = content.match(/JSON\.parse\('([^]+)'\)/);
const data = JSON.parse(match[1].replace(/\\'/g, "'"));
const cgt = data.filter(d => d.id.startsWith('cai-gen-tan'));
console.log('Total CGT sentences:', cgt.length);
console.log(cgt.slice(0, 2));
