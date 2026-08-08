import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = full.chapters.filter(item => item.volume === '虎韜');
if (additions.length !== 12) throw new Error(`Expected 12 虎韜 chapters, got ${additions.length}`);
const worksPath = './src/data/works.ts';
let source = fs.readFileSync(worksPath, 'utf8');
function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = source.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return { re, value: JSON.parse(decodeURIComponent(match[1])) };
}
const wd = readArray('works', 'Work');
const cd = readArray('chapters', 'Chapter');
const pd = readArray('passages', 'Passage');
const sd = readArray('sentences', 'Sentence');
const work = wd.value.find(item => item.id === 'liu-tao');
const refs = [
  { label: '經文底本', edition: '《四部叢刊初編》本《六韜、吳子、司馬法》' },
  { label: '數位對校', edition: '維基文庫《六韜》標點本；中國哲學書電子化計劃《六韜》；《六韜直解》' },
];
const splitSentences = text => text.match(/[^。！？；]+[。！？；]?/g)?.map(item => item.trim()).filter(Boolean) ?? [text];
for (const item of additions) {
  const chId = `liu-tao_ch-${item.order}`;
  const pId = `${chId}_p-1`;
  cd.value = cd.value.filter(ch => ch.id !== chId);
  pd.value = pd.value.filter(p => p.id !== pId);
  sd.value = sd.value.filter(s => s.passageId !== pId);
  const parts = splitSentences(item.text);
  const sentenceIds = parts.map((_, index) => `${pId}_s-${index + 1}`);
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `虎韜・${item.title}`, difficulty: 4, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 160)), passageIds: [pId], tags: ['六韜', '虎韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '虎韜', item.title] });
  });
}
work.chapterIds = Array.from({ length: 42 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》校補進行中：文、武、龍、虎四韜共四十二篇已齊；豹、犬二韜待依六卷六十篇次續補。經文以《四部叢刊初編》本為底本，參校《續古逸叢書》本、《六韜直解》及公開標點本。';
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  31: ['武王問萬名甲士所需攻守器械。太公逐類列出衝車、扶胥、大中小櫓、連弩、飛鳧與電影箭、輕車、鐵棓、斧鉞、鐵鎚、飛鉤、拒馬、木鐵蒺藜、地羅、鋋矛、鎖具、虎落，以及飛橋、飛江、天浮、天潢等渡水設備；又列營柵繩索、雨具、伐木掘土工具的尺寸和數量。萬人編制配強弩六千、戟盾二千、矛盾二千及巧匠三百，平時須修攻具、磨兵器。', '【主旨】〈軍用〉是一份萬人部隊的兵器、工事、渡水與工程器材配置表。\n【詞義】「扶胥」為大型戰車或器械架；「行馬」是拒馬；「虎落」為營柵障礙；「天潢」為組合浮渡設備。\n【校讀】器名多屬古代專門術語且版本異文繁多；翻譯保留名稱與數量，不擅自套成現代武器。'],
  32: ['武王問天陣、地陣、人陣。太公說，日月星辰與斗柄有左右、向背，兵家取其象，稱天陣；丘陵水泉具有前後左右的地利，兵家利用它，稱地陣；車馬的使用以及文武手段的配合，稱人陣。', '【主旨】〈三陳〉把布陣因素分為天象方位、地形條件與人力裝備三類。\n【詞義】「陳」通「陣」；「斗柄」為北斗柄部，可指示時令方位；「取此象／利」是依象與地利運用。\n【結構】篇幅雖短，實際建立環境、地理、組織三層作戰框架。'],
  33: ['武王問軍隊被包圍、前後隔斷且糧道斷絕時怎麼辦。太公說這是極困危的軍隊，必須突然迅速行動才勝，遲緩便敗；應布成四面武衝陣，以戰車驍騎驚亂敵軍，立即猛擊突圍。出圍後若要乘勢取勝，左軍向左、右軍向右疾進，不與敵爭同一道路；中軍前後交替進擊，即使敵眾，也能迫使敵將敗走。', '【主旨】〈疾戰〉處理斷糧受圍的緊急狀態，核心是多向快速突擊與中軍輪替。\n【詞義】「困兵」指陷入絕境的部隊；「暴用」為突然迅猛使用；「迭前迭後」為梯次輪換。\n【戰術】速度只在已無持久條件時成立，篇中有明確危急前提，不是一般性的冒進主張。'],
  34: ['武王問深入敵境、四面受圍、歸路和糧食都斷時如何必定突圍。太公要求先找敵軍空虛無守之處，夜間銜枚潛行：勇士在前平壘開道，強弩伏後，弱卒車騎居中，衝車大櫓護住前後左右；敵追時伏兵反擊並多設火鼓。若前有大水深塹，則以飛江、轉關、天潢渡軍，必要時焚毀己方輜重糧食，明示不戰即死；出圍部隊按火標集結成四武衝陣，並利用草木丘墓阻遏敵騎追擊。', '【主旨】〈必出〉詳述絕境突圍的偵察、夜行、編隊、伏擊、渡障與集結程序。\n【詞義】「銜枚」為口銜枚具以禁聲；「冒將」為敢於冒險衝鋒者；「踵軍」為後續接應部隊；「雲火」為遠方火標。\n【辨析】焚輜重是極端死地手段，只適用退路已絕的篇內情境。'],
  35: ['武王問暴雨使溪谷水漲、部隊尚未全渡而前後隔絕，又無舟橋水草時怎樣避免滯留。太公先批評事前不籌畫、器械不備、教令不素信與士卒不熟練，這樣不配稱王者之兵；軍隊平時就須練用攻城的轒轀臨衝、瞭望的雲梯飛樓、行止防護的武衝大櫓、營壘障礙、晝夜旗火金鼓，以及越溝的飛橋轆轤、渡水的天潢飛江和逆流設備。器用齊備，主將纔不臨事憂懼。', '【主旨】〈軍略〉以暴雨斷渡為例，強調器材、訓練與預案必須在危機前完成。\n【詞義】「稽留」為耽擱滯留；「轒轀、臨衝」為攻城車；「鉏鋙」為橋具咬合構件；「鳴笳」為吹笳警號。\n【思想】答案沒有提供臨時奇術，而把失敗根源追到平時戰備，呈現後勤工程優先。'],
  36: ['兩軍在邊境堅陣相持時，太公主張把軍隊分三處：前軍深溝高壘、列旗擊鼓作堅守狀；後軍多積糧；另派精銳潛襲敵軍中部與無備處。若敵已知我情並伏銳兵於隘路，則前軍每日挑戰疲其心志，老弱拖柴揚塵、鼓呼左右往來製造大軍假象，使敵驚疑不敢出；己方主力持續行動，內外夾擊。', '【主旨】〈臨境〉論對峙時以守備假象掩護潛襲，以及暴露後用佯動疲敵。\n【詞義】「臨境」為兩軍近境相拒；「挑戰」是出陣邀戰；「曳柴揚塵」用煙塵誇大兵勢。\n【結構】先給祕密突襲方案，再處理計謀洩露後的替代方案，重點在多層欺敵。'],
  37: ['勢均力敵而彼此不先動時，太公建議在距敵十里兩側伏兵，車騎繞至百里外越過敵前後，增設旗鼓；交戰時伏兵一齊鼓譟，使敵軍前後不能相救。若地形不能設伏、車騎不能迂迴且敵已預備，則提前五日派遠哨察敵，在死地設伏；正面部隊疏陣遠旗，交戰後佯退三里，以金聲止退返擊，伏兵再攻兩旁前後。', '【主旨】〈動靜〉以伏兵、旗鼓、迂迴與佯退製造敵方心理和隊形失衡。\n【詞義】「相當」為勢力相等；「數顧」指頻頻回頭；「遠候」為遠距斥候；「擊金」為鳴金節制退軍。\n【戰術】兩個方案都先以偵察和地形為條件，並非固定套用伏擊。'],
  38: ['極寒酷暑、連日霖雨使營壘毀壞而敵夜襲時，太公說軍隊以警戒為堅固、懈怠為敗亡。壘上盤問口令不可中斷，內外旗號相望、聲音相接，人員每三千為一屯，各守位置。敵見戒備嚴整必退，待其力疲再以精銳追擊。若敵佯敗誘入伏兵，追軍應分三隊且不可越過伏擊區；三隊齊到後再攻前後兩翼，以明確號令保持秩序。', '【主旨】〈金鼓〉處理惡劣天候下的夜襲警戒與反伏擊追擊。\n【詞義】「誰何」是守軍盤問口令；「乏音」指號令聲中斷；「佯北」為假裝敗逃；「薄我壘」為迫近營壘。\n【制度】警戒、通訊、分屯和追擊界線共同防止混亂，金鼓的作用是維持可控節奏。'],
  39: ['深入敵境時，太公要求先察地形，依山林險阻、水泉林木建立據點，守住關梁並掌握城邑丘墓之利，才能保住糧道和前後聯絡。若部隊經大林廣澤平地，因斥候觀望失誤而突然遇敵，應先派遠哨至二百里外；不利地形則以武衝車為活動壁壘，後方另設兩支接應軍，遠百里、近五十里，使警急時前後相救。', '【主旨】〈絕道〉以地形據點、遠哨與梯次接應防止糧道和前後被切斷。\n【詞義】「關梁」為關口橋梁；「相薄」為突然迫近接戰；「踵軍」為後續軍。\n【校勘】底本作「吾盟誤失」，語義難通；此處依《六韜直解》改作「吾候望誤失」，即斥候觀察失誤，並保留底本異文說明。'],
  40: ['攻取土地而遇大城和外圍守險別軍時，太公主張車騎遠布、嚴密警戒，隔絕城內外糧運。若守軍暗約夜出死戰，攻方分三軍據地，查明別軍與堡壘，故意留下出口誘使其逃出，同時嚴備；車騎在遠處截擊別軍，但不急於決戰，而斷糧久圍。對城邑不可焚毀積聚宮室或砍伐墓木社樹，投降者不得殺戮，告知百姓罪只在一人，以仁義厚德爭取天下歸服。', '【主旨】〈略地〉把圍城隔絕、圍師遺闕與戰後保民結合。\n【詞義】「別軍」為城外策應部隊；「遺缺之道」為故留逃路；「冢樹社叢」指墓地與社壇樹木；「辜在一人」把罪責限於主政者。\n【思想】篇末限制破壞與殺降，說明取得土地不等於摧毀人口資源，政治安撫是戰果的一部分。'],
  41: ['軍隊在乾燥強風、深草包圍處疲憊休息，敵從上風縱火並伏兵後方時，太公要求先以高架瞭望；見火便主動焚燒己方前後草地，軍隊退守已燒黑的安全地帶，以強弩材士守兩翼。敵若同時焚燒四面、煙覆全軍並從黑地進攻，則結四武衝陣，強弩護翼，目標轉為保持不勝不敗、避免崩潰。', '【主旨】〈火戰〉說明草原火攻下以預燒隔離帶、黑地固守和四面陣防護。\n【詞義】「蓊穢」為草木茂密；「上風」為風來方向；「黑地」是已焚盡、無可再燃之地。\n【戰術】第二種情境只求無勝無負，顯示陷入火煙包圍時保存軍隊優先於反攻。'],
  42: ['武王問如何判斷敵營虛實和進退。太公說將領須通天時、地利、人事，登高觀敵。若鼓鐸無聲、營上鳥多而不驚、上方無人氣，表示敵人可能放置假人欺騙，主力突然撤走但不遠。敵軍撤離未定又返回，說明調動過急，前後不能銜接、陣列必亂；此時應迅速出兵攻擊，但原文也警告以少擊眾仍會敗，不能只因敵亂便忽視兵力。', '【主旨】〈壘虛〉用聲音、鳥羣、氣象與行軍銜接判斷空營和回軍弱點。\n【詞義】「偶人」為假人；「相次」為前後依次銜接；「自來自去」指判斷敵軍將進或退。\n【校讀】末句「以少擊眾，則必敗矣」承接上文略有歧義；宜理解為告誡兵少不可貿然，而非宣稱少數必勝。']
};
let aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
for (const item of additions) {
  const id = `liu-tao_ch-${item.order}_p-1`;
  const [translation, analysis] = aids[item.order];
  const entry = `  '${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(analysis)}\n  },\n`;
  const marker = '\n}\n\nexport function getPassageReadingAid';
  if (!aidSource.includes(marker)) throw new Error('Cannot find PASSAGE_AIDS closing marker');
  aidSource = aidSource.replace(marker, `\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync('./src/data/readingAid.ts', aidSource, 'utf8');
console.log('Added and annotated all 12 虎韜 chapters.');
