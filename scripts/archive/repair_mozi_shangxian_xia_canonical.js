import fs from 'node:fs'
const file = 'src/data/works.ts'; let source = fs.readFileSync(file, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const data = matches.map((m) => JSON.parse(decodeURIComponent(m[1])))
const [works, chapters, passages, sentences] = data
const changes = {
  'mo-zi_ch-10_p-2': [['不若親其一危弓', '不若其親一危弓']],
  'mo-zi_ch-10_p-5': [['王公大人骨肉之親，躄、瘖、聾', '王公大人骨肉之親，蹙、躄、瘖、聾'], ['皆攸心解體', '皆放心解體'], ['亂者不得治推而上之以。', '亂者不得治。']],
  'mo-zi_ch-10_p-6': [['是故昔者堯有舜', '是故昔者，堯有舜'], ['而天下和，庶民阜', '得此推而上之，以而天下和，庶民阜'], ['粒食之所養，得此不勸譽', '粒食之民莫不勸譽'], ['求為士，上欲中聖王之道', '求為上士，上欲中聖王之道'], ['下欲中國家百姓之利，而天下和，庶民阜，是以近者安之，遠者歸之。日月之所照，舟車之所及，雨露之所漸，粒食之所養，故尚賢之為說', '下欲中國家百姓之利，故尚賢之為說']]
}
const split = (t) => t.match(/[^。！？]+[。！？]/g) ?? [t]
for (const [id, pairs] of Object.entries(changes)) {
  const p = passages.find((x) => x.id === id); let text = p.canonicalText
  for (const [a,b] of pairs) { if (!text.includes(a)) throw new Error(`Missing ${a}`); text = text.replace(a,b) }
  for (let i=sentences.length-1;i>=0;i--) if (sentences[i].passageId===id) sentences.splice(i,1)
  const rebuilt=split(text).map((canonicalText,index)=>{const order=index+1,sid=`${id}_s-${order}`,cue=[...canonicalText][0]??'';return{id:sid,passageId:id,order,canonicalText,cue,chunks:[{id:`${sid}_c-1`,sentenceId:sid,order:1,text:canonicalText,cue}]}})
  p.canonicalText=text;p.sentenceIds=rebuilt.map(x=>x.id);sentences.push(...rebuilt)
}
sentences.sort((a,b)=>a.passageId.localeCompare(b.passageId,'en',{numeric:true})||a.order-b.order)
const mozi=works.find(x=>x.id==='mo-zi'), chapterIds=new Set(chapters.filter(x=>x.workId==='mo-zi').map(x=>x.id))
mozi.totalChars=passages.filter(x=>chapterIds.has(x.chapterId)).reduce((n,x)=>n+x.canonicalText.length,0)
for(let i=matches.length-1;i>=0;i--){const m=matches[i],encoded=encodeURIComponent(JSON.stringify(data[i]));source=`${source.slice(0,m.index)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(m.index+m[0].length)}`}
fs.writeFileSync(file,source,'utf8');console.log('Repaired canonical text and sentence indexes for 墨子·尚賢下 passages 2, 5, and 6.')
