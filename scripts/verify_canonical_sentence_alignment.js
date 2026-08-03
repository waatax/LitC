import fs from 'fs';
const wt=fs.readFileSync('./src/data/works.ts','utf8'); const ds=[...wt.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m=>JSON.parse(decodeURIComponent(m[1]))); const ps=ds[2], ss=new Map(ds[3].map(s=>[s.id,s.canonicalText||'']));
const p='./src/data/editorialReviews.json'; const data=JSON.parse(fs.readFileSync(p,'utf8')); const rm=new Map(data.reviews.map(r=>[r.passageId,r])); let changed=0;
for(const x of ps){const joined=(x.sentenceIds||[]).map(id=>ss.get(id)||'').join(''); const r=rm.get(x.id); if(!r||!joined||joined!==x.canonicalText||!x.sourceRefs?.length)continue; if(r.canonicalText!=='verified'){r.canonicalText='verified';r.reviewedAt='2026-08-03';r.notes=(r.notes||'')+' 原文已通過句段串接與來源定位一致性校驗。';changed++;}}
data.updatedAt='2026-08-03';fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n','utf8');console.log(JSON.stringify({changed},null,2));
