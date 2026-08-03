import fs from 'fs';
const p='./src/data/works.ts'; let t=fs.readFileSync(p,'utf8');
const names=['works','chapters','passages']; const datasets=[...t.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)].map(m=>JSON.parse(decodeURIComponent(m[1])));
if(datasets.length<3) throw new Error('datasets not found');
const [works,chapters,passages]=datasets; const workMap=new Map(works.map(w=>[w.id,w])); const chapterMap=new Map(chapters.map(c=>[c.id,c])); let changed=0;
for(const passage of passages){ if(passage.sourceRefs?.length) continue; const ch=chapterMap.get(passage.chapterId); const work=ch&&workMap.get(ch.workId); if(!ch||!work) continue; passage.sourceRefs=[{label:'通行本',edition:work.sourceNote||'中哲會／維基文庫'},{label:'篇章定位',edition:`${work.title}・${ch.title}・第${passage.order}段`}]; changed++; }
let i=0; t=t.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g,()=>`JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(datasets[i++]))}"))`); fs.writeFileSync(p,t,'utf8'); console.log(JSON.stringify({changed},null,2));
