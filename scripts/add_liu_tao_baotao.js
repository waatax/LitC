import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = full.chapters.filter(item => item.volume === '豹韜');
if (additions.length !== 8) throw new Error(`Expected 8 豹韜 chapters, got ${additions.length}`);
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
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `豹韜・${item.title}`, difficulty: 4, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 160)), passageIds: [pId], tags: ['六韜', '豹韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '豹韜', item.title] });
  });
}
work.chapterIds = Array.from({ length: 50 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》校補進行中：文、武、龍、虎、豹五韜共五十篇已齊；犬韜十篇待依六卷六十篇次續補。經文以《四部叢刊初編》本為底本，參校《續古逸叢書》本、《六韜直解》及公開標點本。';
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  43: ['在大林中與敵分據相持時，太公要求把三軍分成衝陣，選便利位置，以弓弩列外、戟盾居內；砍除草木擴大道路，高設旗幟並嚴守軍情。矛戟兵互相編伍，樹木稀疏處用騎兵輔助、戰車在前；有利便戰，不利便止。林中險阻多，前後都須設衝陣，部隊輪流作戰休息、各守本部。', '【主旨】〈林戰〉以開闢通道、兵種內外配置、前後衝陣與輪換解決林地視野和機動限制。\n【詞義】「弓弩為表」為遠射兵居外；「戟楯為裏」為近戰防護居內；「更戰更息」為分部輪換。\n【地形】騎兵只在林木稀疏處使用，顯示兵種配置必須服從地形。'],
  44: ['敵軍長驅侵地、掠走牛馬並逼城時，太公判斷其人畜補給必逐漸匱乏，應由遠方城邑的別軍選精銳猛擊其後，約定月末昏暗時會戰。若敵分三四路、主力未全到而先鋒逼城，守方在城外四里築壘、列旗鼓，另置伏兵；壘上布強弩，每百步設突門與拒馬，車騎在外隱蔽。先以輕兵接戰佯退，誘敵逼城，再由伏兵內外前後夾擊。', '【主旨】〈突戰〉利用深入之敵補給分散與兵力未集，以城外營壘、佯退和伏兵反突擊。\n【詞義】「突兵」為猝然深入侵掠之軍；「晦」為月末無月之夜；「突門」為便於出擊的營門；「充其內」為從內部衝擊。\n【戰術】反擊時機取決於敵軍未集與補給壓力，而非單靠守城。'],
  45: ['敵眾我寡、敵強我弱而夜襲左右時，太公稱其為震寇，主張不可困守；應選材士、強弩和車騎分置左右，疾擊敵前、急攻敵後，內外並擊使其混亂。若敵截斷前後、隔絕精銳而使全軍潰散，須先明確號令，派勇銳人員各持火炬、兩人同鼓確認敵位；接戰後以微號聯絡，統一熄火止鼓，使內外按約同時進擊。', '【主旨】〈敵強〉以主動多向反擊和夜間火鼓通信，處理強敵夜襲造成的震動與隔絕。\n【詞義】「震寇」指以聲勢震動我軍的敵兵；「冒將」為敢冒險的勇士；「微號」為隱密信號；「期約皆當」指各部依約準時。\n【制度】夜戰勝負依賴可撤除的識別信號與同步號令，避免火鼓反而暴露己方。'],
  46: ['突然遇到眾多強敵及戰車驍騎包圍，己軍震恐潰走時，太公說善於應變仍可轉敗為勝。預先把材士強弩、戰車驍騎伏在左右，距主隊前後各三里；敵追擊時伏兵車騎衝其兩翼，敵亂則逃兵自然停止。若敵我車騎對陣而敵眾強且整齊，則強弩伏左右，己方車騎固陣；待敵越過伏兵後集中射擊兩翼，精騎再攻其前後。', '【主旨】〈敵武〉以兩翼伏弩與車騎反衝，制止潰退並攻擊整齊強敵的側後。\n【詞義】「敗兵」指已呈潰勢的部隊；「相當」為相對列陣；「積弩」指集中弩力齊射。\n【戰術】第一步是使己方潰兵止步恢復秩序，之後才談包擊敵軍。'],
  47: ['軍隊在無草木的高山盤石間四面受敵時，太公說處山頂容易被敵依附攻擊，處山下容易被困，應布烏雲陣兼備陰陽兩面。駐山陽要防山陰，駐山左要防山右；敵可攀登處在外圍設兵，山間通道以武車截斷，高設旗幟並隱藏軍情，形成「山城」。行列、法令、奇正配置完成後，在山外各置衝陣，車騎分成可散可合的烏雲陣。', '【主旨】〈鳥雲山兵〉以對向戒備、封鎖山間通道、外置衝陣和車騎散合建立山地環形防禦。\n【詞義】篇名通行作「鳥雲」，正文作「烏雲」；「陰陽」指山的背陽與向陽面；「山城」是以陣勢構成的山地堡壘。\n【校讀】保留篇題與正文用字差異，不將「鳥／烏」逕自視為同一字形錯誤。'],
  48: ['臨水與富眾之敵相拒，而己方糧草不足、身處鹽鹼荒地時，太公首先主張尋找便利、欺敵後迅速撤離，並在後方設伏。若不能欺敵且已潰走，則分設衝陣於便利位置，等己軍全部通過後由伏兵擊追敵後方，強弩射兩翼，車騎組烏雲陣護前後；敵大軍渡水追來，再由伏兵與車騎夾擊。烏雲之義是像烏鳥散開、雲氣聚合，變化無窮。', '【主旨】〈鳥雲澤兵〉處理缺糧臨水困境，以有序撤離、後衛伏擊和車騎散合打擊渡水追兵。\n【詞義】「斥鹵」為鹽鹼荒地；「芻牧」為取得草料放牧；「須其畢出」為等待己軍全數通過；「烏散雲合」喻分合迅速。\n【戰術】目標先是脫離無補給地帶，反擊建立在敵渡水隊形分裂之時。'],
  49: ['武王問如何以少擊眾、以弱擊強。太公說少擊眾須利用黃昏、深草伏兵與隘路；弱擊強則須大國支持和鄰國援助。若天然條件皆無，就用假象誘敵繞遠，使其經過深草並拖到日暮，趁前隊未渡完水、後隊未宿營時，以伏兵、車騎攻其左右前後。外交上則敬事大國君主、禮下鄰國人士，以厚禮謙辭取得援助。', '【主旨】〈少眾〉說兵力劣勢不能靠意志彌補，必須創造時間、地形、隊形或外交優勢。\n【詞義】「要之隘路」為在狹路截擊；「熒惑其將」為迷惑敵將；「大國之與」為大國援助；「卑其辭」為言辭謙下。\n【思想】篇中把外交結盟與戰場設伏並列，說明強弱是可由外援和情境重新構成的。'],
  50: ['兩軍在左山右水等相反險地分據時，太公要求居山左急防山右、居山右急防山左；遇大水無舟則以天潢渡軍，渡後立刻擴大道路。武衝車護前後，強弩固陣，谷口衢道用武衝封鎖，高設旗幟構成軍城。險地作戰以武衝在前、大櫓護衛、強弩翼兩側；每三千人一屯，各置衝陣，左中右三軍並進，作戰部隊輪流返回屯所休息。', '【主旨】〈分險〉以交叉戒備、渡障開路、谷口封鎖與分屯輪戰應對山水夾峙。\n【詞義】「分險」為敵我分據險要；「軍城」為器械旗陣構成的臨時堅固陣地；「屯」為三千人戰術單位。\n【組織】左右中軍各依方位進攻，但戰後回屯輪替，兼顧持續作戰與秩序。']
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
console.log('Added and annotated all 8 豹韜 chapters.');
