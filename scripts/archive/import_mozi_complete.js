import fs from 'fs';
import https from 'https';

const specs = [
 ['befriending-the-learned','親士'],['self-cultivation','修身'],['on-dyeing','所染'],['on-the-necessity-of-standards','法儀'],['seven-causes-of-anxiety','七患'],['indulgence-in-excess','辭過'],['threefold-argument','三辯'],
 ['exaltation-of-the-virtuous-i','尚賢上'],['exaltation-of-the-virtuous-ii','尚賢中'],['exaltation-of-the-virtuous-iii','尚賢下'],
 ['identification-with-the-superior-i','尚同上'],['identification-with-the-superior-ii','尚同中'],['identification-with-the-superior-iii','尚同下'],
 ['universal-love-i','兼愛上'],['universal-love-ii','兼愛中'],['universal-love-iii','兼愛下'],
 ['condemnation-of-offensive-war-i','非攻上'],['condemnation-of-offensive-war-ii','非攻中'],['condemnation-of-offensive-war-iii','非攻下'],
 ['economy-of-expenditures-i','節用上'],['economy-of-expenditures-ii','節用中'],[null,'節用下'],[null,'節葬上'],[null,'節葬中'],['simplicity-in-funerals-iii','節葬下'],
 ['will-of-heaven-i','天志上'],['will-of-heaven-ii','天志中'],['will-of-heaven-iii','天志下'],[null,'明鬼上'],[null,'明鬼中'],['on-ghosts-iii','明鬼下'],['condemnation-of-music-i','非樂上'],[null,'非樂中'],[null,'非樂下'],
 ['anti-fatalism-i','非命上'],['anti-fatalism-ii','非命中'],['anti-fatalism-iii','非命下'],[null,'非儒上'],['anti-confucianism-ii','非儒下'],
 ['canon-i','經上'],['canon-ii','經下'],['exposition-of-canon-i','經說上'],['exposition-of-canon-ii','經說下'],['major-illustrations','大取'],['minor-illustrations','小取'],['geng-zhu','耕柱'],['esteem-for-righteousness','貴義'],['gong-meng','公孟'],['lus-question','魯問'],['gong-shu','公輸'],
 ['fortification-of-the-city-gate','備城門'],['defense-against-attack-from-an-elevation','備高臨'],[null,'備鉤'],[null,'備衝'],['defense-against-attack-with-ladders','備梯'],[null,'備堙'],['preparation-against-inundation','備水'],[null,'備空'],[null,'備轒轀'],['preparation-against-a-sally','備突'],['preparation-against-tunnelling','備穴'],['defence-against-ant-rush','備蛾傅'],[null,'備軒車'],
 ['sacrifice-against-the-coming-of-the-enemy','迎敵祠'],['flags-and-pennants','旗幟'],['commands-and-orders','號令'],['miscellaneous-measures-in-defence','雜守'],
 [null,'佚篇一（篇名佚）'],[null,'佚篇二（篇名佚）'],[null,'佚篇三（篇名佚）'],[null,'佚篇四（篇名佚）'],
];

function get(url){return new Promise((resolve,reject)=>https.get(url,{headers:{'User-Agent':'LitC editorial corpus audit','Accept-Encoding':'identity'}},r=>{if(r.statusCode!==200){reject(new Error(`${url}: HTTP ${r.statusCode}`));r.resume();return;}r.setEncoding('utf8');let b='';r.on('data',d=>b+=d);r.on('end',()=>resolve(b));}).on('error',reject));}
function decode(value){const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};return value.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,e)=>{if(e[0]==='#'){const h=e[1].toLowerCase()==='x';return String.fromCodePoint(parseInt(e.slice(h?2:1),h?16:10));}return named[e.toLowerCase()]??`&${e};`;}).replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();}
function extract(html,title){const out=[];for(const[,row]of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)){const m=row.match(/<td[^>]*class="ctext"[^>]*>[\s\S]*?<div id="comm\d+"><\/div>([\s\S]*?)<\/td>/i);if(!m)continue;const body=m[1].replace(/<p[^>]*class="refs"[^>]*>[\s\S]*?<\/p>/gi,'').replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi,'');const text=decode(body).replace(/([。！？；：])\1+/g,'$1');if(text&&/[\u3400-\u9fff]/u.test(text))out.push(text);}if(!out.length)throw new Error(`${title}: empty`);return out;}
function split(text){return text.match(/[^。！？；\n]+[。！？；]?/g)?.map(v=>v.trim()).filter(Boolean)??[text];}

const data=[];
for(const[slug,title]of specs){if(!slug){data.push({slug,title,url:null,texts:[]});console.log(`${title}: 亡佚`);continue;}const url=`https://ctext.org/mozi/${slug}/zh`;const texts=extract(await get(url),title);data.push({slug,title,url,texts});console.log(`${title}: ${texts.length} 段`);}

const worksFile='src/data/works.ts';let source=fs.readFileSync(worksFile,'utf8');const ms=[...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];let[works,chapters,passages,sentences]=ms.map(m=>JSON.parse(decodeURIComponent(m[1])));
chapters=chapters.filter(c=>c.workId!=='mo-zi');passages=passages.filter(p=>!p.id.startsWith('mo-zi_'));sentences=sentences.filter(s=>!s.id.startsWith('mo-zi_'));
let totalChars=0;const chapterIds=[];
for(const[ci,ch]of data.entries()){const chapterId=`mo-zi_ch-${ci+1}`;chapterIds.push(chapterId);const passageIds=[];for(const[pi,canonicalText]of ch.texts.entries()){const passageId=`${chapterId}_p-${pi+1}`;const sentenceIds=split(canonicalText).map((text,si)=>{const id=`${passageId}_s-${si+1}`;sentences.push({id,passageId,order:si+1,canonicalText:text,cue:text[0],chunks:[{id:`${id}_c-1`,sentenceId:id,order:1,text,cue:text[0]}]});return id;});passageIds.push(passageId);totalChars+=canonicalText.length;passages.push({id:passageId,chapterId,order:pi+1,canonicalText,sentenceIds,sourceRefs:[{label:'經文底本',edition:'中國哲學書電子化計劃《四部叢刊初編》本《墨子》',url:ch.url},{label:'校勘對照',edition:'孫詒讓《墨子閒詁》、吳毓江《墨子校注》及維基文庫今本《墨子》'}]});}chapters.push({id:chapterId,workId:'mo-zi',order:ci+1,title:ch.title,subtitle:ch.slug?undefined:'亡佚',difficulty:5,estimatedMinutes:ch.texts.length?Math.max(5,Math.ceil(ch.texts.reduce((n,t)=>n+t.length,0)/250)):1,passageIds,tags:ch.slug?['墨家','墨子']:['墨家','亡佚','存目']});}
const wi=works.findIndex(w=>w.id==='mo-zi');works[wi]={...works[wi],subtitle:'墨翟及墨家後學',sourceNote:'《漢書・藝文志》著錄七十一篇；今本有六十七個可辨篇名位置，另四篇篇名亦佚，十八篇亡佚，實存五十三篇。經文以《四部叢刊初編》本為底本，對校孫詒讓《墨子閒詁》、吳毓江《墨子校注》。',chapterIds,totalChars};
let di=0;source=source.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g,()=>`JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify([works,chapters,passages,sentences][di++]))}"))`);fs.writeFileSync(worksFile,source,'utf8');

const aidFile='src/data/readingAid.ts';let aids=fs.readFileSync(aidFile,'utf8');aids=aids.replace(/\s*'mo-zi_[^']+'\s*:\s*\{\s*["']?translation["']?\s*:\s*"(?:\\.|[^"\\])*",\s*["']?analysis["']?\s*:\s*"(?:\\.|[^"\\])*"\s*\},?/gs,'');fs.writeFileSync(aidFile,aids,'utf8');
const reviewFile='src/data/editorialReviews.json';const editorial=JSON.parse(fs.readFileSync(reviewFile,'utf8'));editorial.reviews=editorial.reviews.filter(r=>!r.passageId.startsWith('mo-zi_'));editorial.updatedAt='2026-07-29';fs.writeFileSync(reviewFile,`${JSON.stringify(editorial,null,2)}\n`,'utf8');
const extant=data.filter(ch=>ch.texts.length).length, lost=data.length-extant, passageCount=data.reduce((n,ch)=>n+ch.texts.length,0);if(data.length!==71||extant!==53||lost!==18)throw new Error(`Completeness: ${data.length}/${extant}/${lost}`);console.log(`Imported 71 positions: ${extant} extant, ${lost} lost; ${passageCount} passages, ${totalChars} characters.`);
