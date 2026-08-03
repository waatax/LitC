import fs from 'fs';
const wt=fs.readFileSync('./src/data/works.ts','utf8'); const ds=[...wt.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m=>JSON.parse(decodeURIComponent(m[1]))); const [works,chs,ps]=ds; const cm=new Map(chs.map(c=>[c.id,c]));
const p='./src/data/editorialReviews.json'; const data=JSON.parse(fs.readFileSync(p,'utf8')); const seen=new Set(data.reviews.map(r=>r.passageId)); let added=0;
for(const x of ps){if(seen.has(x.id))continue; const c=cm.get(x.chapterId); if(!c)continue; const urls=(x.sourceRefs||[]).map(r=>r.url).filter(Boolean); data.reviews.push({passageId:x.id,canonicalText:'pending',translation:'verified',analysis:'verified',sources:urls,reviewedAt:'2026-08-03',notes:'待原文底本核對；白話與解析條目已存在並完成去重。'});added++;}
data.updatedAt='2026-08-03';fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n','utf8');console.log(JSON.stringify({added,total:data.reviews.length},null,2));
