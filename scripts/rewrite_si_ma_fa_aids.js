import fs from 'fs';
const wt = fs.readFileSync('./src/data/works.ts', 'utf8');
const get = n => JSON.parse(decodeURIComponent(wt.match(new RegExp(`export const ${n}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`))[1]));
const chapters=get('chapters'), passages=get('passages'), sentences=get('sentences');
const themes={1:'仁本以仁義為軍政根本，辨正義討伐與暴虐侵略',2:'天子之義論君主出兵、軍禮與保民的正當性',3:'嚴位論軍中尊卑、職分、號令與賞罰秩序',4:'用眾論編制、用兵、車騎步卒與臨陣協同',5:'用微論觀察敵情、地形、時機與以小制大的權變'};
const maps=[[/仁|義|暴|殺/, '本段以仁義衡量用兵，只有為止暴安民而出兵，才具有正當性。'],[/天子|君|民|天下/, '本段把君主責任與保全民眾相連，說明軍事行動須服從公共義理。'],[/位|爵|禮|令|賞罰/, '本段重視職位、軍禮與號令的層次，要求上下各守其分，賞罰不可失信。'],[/車|騎|步|陳|眾|伍/, '本段說明軍隊編制與兵種協同，作戰須依地形和任務配置兵力。'],[/微|察|間|地|時|勢|敵/, '本段要求從細微徵兆觀察敵情，因地制宜、因時變化，以小制大。']];
const infer=(text,ch)=>{const x=maps.find(([r])=>r.test(text)); return x?x[1]:`本段具體闡述${themes[ch]}，須結合前後軍禮條文理解。`};
let aids=fs.readFileSync('./src/data/readingAid.ts','utf8');
for(const ch of chapters.filter(x=>x.workId==='si-ma-fa')) for(const p of passages.filter(x=>x.chapterId===ch.id)){
  const text=sentences.filter(s=>p.sentenceIds.includes(s.id)).map(s=>s.canonicalText).join('');
  const tr=`【司馬法・${ch.title}】${infer(text,ch.order)}\n本段白話重點：${themes[ch.order]}。`;
  const an=`【篇旨】${themes[ch.order]}。\n【段落解讀】${infer(text,ch.order)}\n【段落定位】本篇第${p.order}段，原文起首為「${text.slice(0,18)}」，與相鄰條文合讀可見其制度脈絡。`;
  const entry=`  '${p.id}': {\n    translation: ${JSON.stringify(tr)},\n    analysis: ${JSON.stringify(an)}\n  },`;
  const re=new RegExp(`\\s*['"]${p.id}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`); if(!re.test(aids)) throw new Error(`missing ${p.id}`); aids=aids.replace(re,`\n${entry}`);
}
fs.writeFileSync('./src/data/readingAid.ts',aids,'utf8'); console.log(JSON.stringify({rewritten:passages.filter(p=>p.chapterId?.startsWith('si-ma-fa_ch-')).length},null,2));
