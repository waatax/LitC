import fs from 'fs';
const t=fs.readFileSync('./src/data/readingAid.ts','utf8'); const aids=new Map();
for(const k of [...t.matchAll(/'([^']+)'\s*:\s*\{/g)].map(m=>m[1])){const m=t.match(new RegExp(`'${k}'\\s*:\\s*\\{\\s*translation:\\s*"([^"]+)",\\s*analysis:\\s*"([^"]+)"`,'s'));if(m)aids.set(k,m[1]);}
const strip=/[嚗?嚗?嚗?嚗]/g; const seen=new Map(); for(const [id,v] of aids){const n=v.replace(/\s+/g,'').replace(strip,''); if(seen.has(n))console.log(JSON.stringify({id,originalId:seen.get(n)})); else seen.set(n,id);}
