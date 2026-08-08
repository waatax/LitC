import fs from 'fs';
const txt = fs.readFileSync('src/data/work_chunks/cai-gen-tan.ts', 'utf8');

const regex = /"id":"(cai-gen-tan_ch-\d+_p-\d+)","chapterId":"([^"]+)","order":(\d+),"canonicalText":"([^"]*?素位[^"]*?)"/g;
let match;
while ((match = regex.exec(txt)) !== null) {
  console.log('Passage ID:', match[1]);
  console.log('Chapter ID:', match[2]);
  console.log('Order:', match[3]);
  console.log('Text:', match[4]);
}
