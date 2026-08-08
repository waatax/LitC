import fs from 'fs';
const content = fs.readFileSync('src/data/work_chunks/cai-gen-tan.ts', 'utf8');
const match = content.match(/JSON\.parse\('([^]+)'\)/);
const data = JSON.parse(match[1].replace(/\\'/g, "'"));
console.log('Passages length:', data.passages.length);
console.log('First 3 passages:', data.passages.slice(0, 3).map(p=>p.canonicalText));
console.log('Sentences length:', data.sentences.length);
console.log('First 5 sentences:', data.sentences.slice(0, 5).map(s=>s.text));
console.log('Last 2 sentences:', data.sentences.slice(-2).map(s=>s.text));
