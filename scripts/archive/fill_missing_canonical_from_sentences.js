import fs from 'fs';
const p='./src/data/works.ts'; let t=fs.readFileSync(p,'utf8');
const ds=[...t.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m=>JSON.parse(decodeURIComponent(m[1]))); const passages=ds[2], sentences=ds[3]; const sm=new Map(sentences.map(s=>[s.id,s.canonicalText||''])); let changed=0;
for(const x of passages){if(x.canonicalText?.trim()||!x.sentenceIds?.length)continue; const text=x.sentenceIds.map(id=>sm.get(id)||'').join(''); if(text){x.canonicalText=text;x.totalChars=[...text].length;changed++;}}
let i=0;t=t.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g,()=>`JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(ds[i++]))}"))`);fs.writeFileSync(p,t,'utf8');console.log(JSON.stringify({changed},null,2));
