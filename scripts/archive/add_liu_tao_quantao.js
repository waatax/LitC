import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = full.chapters.filter(item => item.volume === '犬韜');
if (additions.length !== 10) throw new Error(`Expected 10 犬韜 chapters, got ${additions.length}`);
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
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `犬韜・${item.title}`, difficulty: 4, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 160)), passageIds: [pId], tags: ['六韜', '犬韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '犬韜', item.title] });
  });
}
work.chapterIds = Array.from({ length: 60 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》六卷六十篇已依正統篇次補齊。經文以《四部叢刊初編》景宋本《六韜、吳子、司馬法》為底本，參校《續古逸叢書》本《武經七書》、《明本武經七書直解》及公開標點本；異文與疑難處於各篇解析說明。';
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  51: ['武王問三軍分處後如何約期會戰、施行賞罰。太公說用兵必有分合，大將先確定戰地與戰日，再以檄書通知各將吏到指定攻城圍邑處會合，並用漏刻明定時限。大將先設營列陣，在轅門立表、清道等待，依到達先後核對；先期者賞，後期者斬。如此遠近部隊才能奔集，合力作戰。', '【主旨】〈分兵〉以書面命令、戰地戰日、漏刻和到達賞罰管理分散部隊會師。\n【詞義】「移檄書」為傳送軍事文書；「漏刻」為計時器；「表轅門」為在營門立標；「校其先後」為核驗到達次序。\n【制度】分兵的關鍵不是各自為戰，而是可驗證的時間、地點和責任。'],
  52: ['太公說選鋒出擊前須觀察敵軍十四種變化：部隊新集、人馬未食、天時不順、未得地利、正在奔走、沒有警戒、已疲勞、將領離開士卒、長途行軍、正在渡水、忙亂無暇、受阻於狹路、行列混亂或內心恐懼。這些狀態一旦明確出現，才是戰車驍騎迅速打擊的時機。', '【主旨】〈武鋒〉列出十四種敵軍尚未形成穩定戰力的可擊窗口。\n【詞義】「馳陣選鋒」指以快速精銳衝陣；「變見」為變化顯現；「不暇」為忙亂來不及整備。\n【結構】十四項涵蓋補給、天候、地形、行軍、指揮、隊形與心理，強調先審察再出擊。'],
  53: ['太公主張按能力、處境和動機把特殊士卒分組：敢死者為冒刃，強勇者為陷陣，儀表奇偉長劍齊列者為勇銳，能拔拒鉤、破金鼓旗幟者為勇力，善越高遠行者為寇兵；失勢王臣求立功者為死鬥，陣亡將領子弟求復仇者為敢死，貧困憤怒者為必死，贅婿俘虜欲掩跡揚名者為勵鈍，免罪徒役欲雪恥者為倖用，才力過人能負重致遠者為待命。', '【主旨】〈練士〉不是一般操練，而是依專長與心理動機編成十一類特種隊伍。\n【詞義】「一卒」指一個編組；「拔距伸鉤」指角力和鉤引能力；「胥靡」為服役刑徒；「材技兼人」為才力勝過常人。\n【校勘】公開標點來源有「披距、死憤、掩揭名、幸用」等誤文，本次依對校改為「拔距、敢死、掩跡揚名、倖用」。'],
  54: ['武王問如何使全軍熟習作戰。太公說先建立金鼓節奏和旗幟指揮，向官兵反覆申明三令，教兵器操作、起居與旗號變化。訓練由一人開始，完成後合成十人，再由十人合百人、百人合千人、千人合萬人，最後合成三軍；大型戰爭甚至逐級合成百萬之眾。由小單位標準化後逐層整合，才能形成大軍。', '【主旨】〈教戰〉提出由個人到十、百、千、萬及全軍的分級訓練法。\n【詞義】「金鼓之節」為進退節奏；「申之以三令」為反覆申明命令；「旌旗指麾」為視覺指揮。\n【制度】先確保小單位動作一致再擴大編組，避免大軍只在人數上集合而不能協同。'],
  55: ['太公比較車、騎、步在平地與險地的相對效能：平地一車約當八十步卒、一騎當八步卒、一車當十騎；險地則降為四十步卒、四步卒和六騎。又列戰車與騎兵的分級官制、列距、左右間隔、隊距、聚屯與往返範圍。戰車用於破堅陣、截強敵和堵敗軍；騎兵用於偵察、追敗、斷糧與乘便。若離開適合編組和地形，單騎甚至不能當一名成陣步卒。', '【主旨】〈均兵〉按地形量化車騎步效能，並規定車騎編制與隊形間距。\n【詞義】「易戰」為平易地作戰；「率」為中級統領；「聚、屯、輩」為不同規模編組；「周還」為迴轉返回。\n【辨析】數字是古代兵書的理想換算，不是跨時代固定戰力公式；其價值在顯示地形會大幅改變兵種效能。'],
  56: ['選拔戰車士，取四十歲以下、身高七尺五寸以上者；奔跑能追上疾馬並乘上行駛中的車，能在前後左右和上下週旋，能收束旗幟；力量足以張開八石強弩，又能向各方向熟練射擊。符合者稱武車之士，待遇不可不厚。', '【主旨】〈武車士〉列出戰車兵的年齡、體格、追車登乘、車上機動、旗幟操作、張弩與射擊標準。\n【詞義】「及馳而乘之」指趕上奔車並登乘；「彀」為張弓弩至滿；「便習」為熟練便利。\n【制度】選拔同時要求力量、速度、平衡與多向射擊，是明確的職能測試。'],
  57: ['選拔騎兵，取四十歲以下、身高七尺五寸以上而健壯敏捷、超越常人者；須能在奔馳中張弓射箭，向前後左右射擊並靈活進退；還要能越溝塹、登丘陵、冒險阻、穿過大澤，馳擊強敵、擾亂大軍。符合者稱武騎之士，也應給予優厚待遇。', '【主旨】〈武騎士〉以騎射、轉向、越障與長距機動作為騎兵選拔核心。\n【詞義】「超絕倫等」為超越同輩；「馳騎彀射」為騎行中張弓射擊；「絕大澤」為橫越廣大沼澤。\n【對讀】與〈武車士〉相比，騎兵更重個人越障和獨立機動，戰車兵更重車上協作與重弩。'],
  58: ['太公說步兵貴知變動，戰車貴知地形，騎兵貴知小路奇道。戰車有十種死地，包括有去無回、越險遠追、前易後險、陷阻難出、低濕黏土、仰攻山阪、深草水澤、車少而與步兵不相敵、三面溝水陡坡、久雨道路潰陷。八種勝機則是敵軍行陣未定、旗馬擾動、士卒左右失序、陣不固而相顧、進退疑怯、猝然驚起、平地暮戰未解、遠行晚宿恐懼。明將須辨十害八勝。', '【主旨】〈戰車〉以十死地和八勝機界定戰車作戰的地形與敵情邊界。\n【詞義】「黏埴」為黏重土壤；「仰阪」為上坡仰攻；「浚澤」為深泥水澤；「薄而起」為受驚迫近而起。\n【思想】戰車威力高度依賴地面與迴轉空間，明將的首要能力是避開不能運動的地形。'],
  59: ['太公說騎兵有十種勝機和九種敗地。勝機包括敵初至未整、以快速變旗服擾亂堅陣、攻擊不固之軍、截擊暮歸入營、深入斷糧、平地四面可見、追擊散兵，以及分隊配車弩包擊晚返大軍。敗地包括攻陣不破反遭車騎返擊、越險追逃遭伏斷後、有入無出、入口狹而出口遠、深谷密林、夾水高山、糧道被斷、低濕泥澤及溝阜高下迷惑。明將必須遠避。', '【主旨】〈戰騎〉從敵情、時間、平地機動和追擊列勝機，從封閉、林澗、夾水、斷糧和泥澤列敗地。\n【詞義】「翼而勿去」為分列兩翼持續牽制；「獵其左右」為快速抄擊；「天井、地穴」喻有入無出的封閉地；「漸洳」為泥濘。\n【結構】篇中實列八段勝法但稱十勝，可能有合分或傳抄問題；解析保留原稱，不虛補缺項。'],
  60: ['步兵與車騎作戰時，應依丘陵險阻，長兵強弩在前、短兵弱弩在後，輪流發射和停止，另以材士強弩防後。若沒有丘陵險阻而敵車騎眾強、包抄前後，則設拒馬與木蒺藜，把牛馬編隊，布四武衝陣；敵騎將至時均勻布蒺藜，後方環掘寬深五尺的「命籠」，士卒持拒馬推進，以車為壘，走則推移、停則成屯，強弩守兩翼，迫使全軍持續作戰。', '【主旨】〈戰步〉以長短兵分層、拒馬蒺藜、車壘和環壕抵禦車騎。\n【詞義】「更發更止」為輪番射擊；「獵我前後」為快速抄擊；「命籠」為環繞後方的深壕；「闌車」為以車阻隔成壘。\n【校勘】來源末段誤作「蒺莉」，依本篇前文與通行本校為「蒺藜」；版權頁殘文亦已從經文排除。']
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
console.log('Added and annotated all 10 犬韜 chapters.');
