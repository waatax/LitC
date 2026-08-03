import fs from 'fs';
const p='./src/data/readingAid.ts'; let t=fs.readFileSync(p,'utf8');
const re=/translation: "([^"\r\n]*)\r?\n(【本段補譯】[^\r\n]*)",/g;
let count=0; t=t.replace(re,(_,original,addition)=>{count++; return `translation: "${original}\\n${addition}",`;});
fs.writeFileSync(p,t,'utf8'); console.log(JSON.stringify({repaired:count},null,2));
