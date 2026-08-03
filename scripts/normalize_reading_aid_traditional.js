import fs from 'fs'; import OpenCC from 'opencc-js';
const p='./src/data/readingAid.ts'; const conv=OpenCC.ConverterFactory(...OpenCC.Locale.from.cn); let t=fs.readFileSync(p,'utf8'); let out=''; for(let i=0;i<t.length;i+=400) out+=conv(t.slice(i,i+400)); fs.writeFileSync(p,out,'utf8'); console.log('normalized traditional forms');
