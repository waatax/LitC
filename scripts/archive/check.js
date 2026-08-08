import fs from 'fs';
const content = fs.readFileSync('src/data/sentence_chunks/part8.ts', 'utf8');
const cgt = content.match(/"id":"cai-gen-tan[^"]+"[^}]+}/g);
if (cgt) {
    console.log(cgt.slice(0, 5).join('\n'));
} else {
    console.log('No matches');
}
