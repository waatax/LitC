import fs from 'fs';
const worksText = fs.readFileSync('./src/data/works.ts', 'utf8');
const get = name => JSON.parse(decodeURIComponent(worksText.match(new RegExp(`export const ${name}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`))[1]));
const chapters = get('chapters'); const passages = get('passages'); const sentences = get('sentences');
const chapterThemes = {
  1: '上略重在收攬英雄、同天下之利，並以柔剛強弱的調節建立君主與軍隊的根本',
  2: '中略重在辨奸雄、任將專權、因材使人，以及以信賞和號令整合軍心',
  3: '下略重在遠求賢能、明辨善惡、平治百姓與順應天道，說明政治安危的根源',
};
const keywordMap = [
  [/主將|英雄|得人/, '將領要先取得人才與眾人的信任，按功行賞、與眾同好同惡，國家才能安定。'],
  [/柔能制剛|柔者|弱者/, '柔德可以克制剛暴，弱者容易得到援助；治理者應按形勢調節柔剛強弱，不可偏用一端。'],
  [/因敵|變動|事先/, '形勢未明時不可拘泥成法，應隨敵情和事勢變化而動，掌握先機以完成大局。'],
  [/奸雄|毀譽|儒賢/, '君主須辨別佞臣的毀譽和私黨，延聘賢者、廣聽不同意見，才能不被蒙蔽。'],
  [/智者|勇者|貪者|愚者/, '用人要因材而使：智者求功、勇者任事、貪者逐利、愚者敢死，順其性情配置職責。'],
  [/將在自專|進退/, '出兵後將領必須有臨機專斷的權限；若事事受內廷牽制，進退失據便難以成功。'],
  [/迎賢|致不肖|清白|節義/, '求賢不能貪圖近便，應遠求有德之士；清白者以禮致之，節義者以道待之，不能靠爵祿威刑。'],
  [/善|惡|賞|誅|令行/, '賞善罰惡必須分明而合乎民情；一項錯誤的賞罰會牽動百姓對全部政令的信任。'],
  [/怨治怨|讎治讎|平/, '不可用怨恨和仇敵互相報復來治理人民，應以公平清明的政治使各得其所。'],
  [/天下|國安|民安|道/, '國家安危取決於能否守道、任賢、安民；政治失序時，即使有強兵也不能長治。'],
];
const fallback = (text, chapter) => {
  const hit = keywordMap.find(([pattern]) => pattern.test(text));
  return hit ? hit[1] : `本段說明${chapterThemes[chapter]}，並提示治國用兵須依據具體情勢而定。`;
};
let aids = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
for (const chapter of chapters.filter(item => item.workId === 'three-strategies')) {
  for (const passage of passages.filter(item => item.chapterId === chapter.id)) {
    const text = sentences.filter(item => passage.sentenceIds.includes(item.id)).map(item => item.canonicalText).join('');
    const body = `【三略・${chapter.title}】${fallback(text, chapter.order)}\n本段承接全篇「${chapterThemes[chapter.order]}」的論旨，應與前後段合讀。`;
    const analysis = `【篇旨】${chapterThemes[chapter.order]}。\n【解讀】${fallback(text, chapter.order)}\n【段落定位】本篇第${passage.order}段，原文以${text.slice(0, 18)}作為論證起點，須與相鄰段落合讀。\n【閱讀提示】注意本段如何把政治用人、軍令權限與民心安定相互連結；關鍵語句須依上下文判讀，不宜割裂成單一戰術格言。`;
    const entry = `  '${passage.id}': {\n    translation: ${JSON.stringify(body)},\n    analysis: ${JSON.stringify(analysis)}\n  },`;
    const re = new RegExp(`\\s*['"]${passage.id}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`);
    if (!re.test(aids)) throw new Error(`Missing reading aid ${passage.id}`);
    aids = aids.replace(re, `\n${entry}`);
  }
}
fs.writeFileSync('./src/data/readingAid.ts', aids, 'utf8');
console.log(JSON.stringify({ rewritten: passages.filter(item => item.chapterId?.startsWith('three-strategies_ch-')).length }, null, 2));
