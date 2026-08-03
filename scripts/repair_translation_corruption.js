import fs from 'fs'; const p='./src/data/readingAid.ts'; let t=fs.readFileSync(p,'utf8'); let changed=0;
const re=/(translation:\s*")((?:[^"\\]|\\.)*)(")/g;
const fixes=[['人民百姓','百姓'],['世間天下','天下'],['楊孔子','楊朱'],['孫孔子','孫子'],['認為','以為'],['哪裡危','何危'],['哪裡在','何在'],['哪裡能','何能'],['哪裡可','何可'],['哪裡許','何許'],['哪裡死','何死'],['哪裡','何'],['就是','是'],['如果','若'],['攻打討伐','攻伐'],['所謂就是','所謂'],['父子也','父子'],['兄弟也','兄弟']];
t=t.replace(re,(all,pre,val,end)=>{let n=val;for(const [a,b] of fixes)n=n.replaceAll(a,b);if(n!==val)changed++;return pre+n+end}); fs.writeFileSync(p,t,'utf8'); console.log(JSON.stringify({changed},null,2));
