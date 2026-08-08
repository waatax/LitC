import fs from 'fs';

const worksPath = './src/data/works.ts';
const aidPath = './src/data/readingAid.ts';
let source = fs.readFileSync(worksPath, 'utf8');

function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = source.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return { re, value: JSON.parse(decodeURIComponent(match[1])) };
}

const workData = readArray('works', 'Work');
const chapterData = readArray('chapters', 'Chapter');
const passageData = readArray('passages', 'Passage');
const sentenceData = readArray('sentences', 'Sentence');
const works = workData.value;
let chapters = chapterData.value;
let passages = passageData.value;
const sentences = sentenceData.value;

const work = works.find(item => item.id === 'liu-tao');
if (!work) throw new Error('六韜 not found');

// The imported selection contains only 文韜: 文師、盈虛、國務、大禮.
// Do not misrepresent the six volumes as complete chapters.
work.chapterIds = ['liu-tao_ch-1', 'liu-tao_ch-2', 'liu-tao_ch-3', 'liu-tao_ch-4'];
work.sourceNote = '現為《六韜》卷一〈文韜〉選錄，收〈文師〉、〈盈虛〉、〈國務〉、〈大禮〉四篇；尚非六卷六十篇全本。經文以《四部叢刊初編》本《六韜、吳子、司馬法》為底本，參校《續古逸叢書》本《武經七書》及《明本武經七書直解》。';

const chapterSpecs = [
  ['liu-tao_ch-1', 1, '文韜・文師', ['liu-tao_ch-1_p-1', 'liu-tao_ch-1_p-2', 'liu-tao_ch-1_p-3']],
  ['liu-tao_ch-2', 2, '文韜・盈虛', ['liu-tao_ch-2_p-1', 'liu-tao_ch-2_p-2']],
  ['liu-tao_ch-3', 3, '文韜・國務', ['liu-tao_ch-3_p-1']],
  ['liu-tao_ch-4', 4, '文韜・大禮', ['liu-tao_ch-4_p-1', 'liu-tao_ch-4_p-2', 'liu-tao_ch-4_p-3', 'liu-tao_ch-4_p-4']],
];

const oldToNewPassage = {
  'liu-tao_ch-5_p-1': 'liu-tao_ch-4_p-3',
  'liu-tao_ch-6_p-1': 'liu-tao_ch-4_p-4',
};
for (const passage of passages) {
  if (oldToNewPassage[passage.id]) {
    const oldId = passage.id;
    const newId = oldToNewPassage[oldId];
    passage.id = newId;
    passage.chapterId = 'liu-tao_ch-4';
    passage.sentenceIds = passage.sentenceIds.map(id => id.replace(oldId, newId));
    for (const sentence of sentences.filter(item => item.passageId === oldId)) {
      sentence.id = sentence.id.replace(oldId, newId);
      sentence.passageId = newId;
    }
  }
}

chapters = chapters.filter(item => item.workId !== 'liu-tao');
for (const [id, order, title, passageIds] of chapterSpecs) {
  chapters.push({ id, workId: 'liu-tao', order, title, difficulty: 3, estimatedMinutes: Math.max(5, passageIds.length * 3), passageIds, tags: ['六韜', '文韜', title.split('・')[1], '武經七書', '選錄'] });
}

function writeArray(data, value) {
  source = source.replace(data.re, `export const ${data.re.source.match(/export const (\\w+)/)[1]}: ${data.re.source.match(/: (\\w+)\\\\\[/)[1]}[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(value))}"));`);
}

// Avoid reconstructing declarations from regex escaping details.
source = source.replace(workData.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(works))}"));`);
source = source.replace(chapterData.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(chapters))}"));`);
source = source.replace(passageData.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(passages))}"));`);
source = source.replace(sentenceData.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sentences))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  'liu-tao_ch-1_p-1': {
    translation: '周文王將要出獵，史官編佈列蓍草占卜，說：「在渭水北岸出獵，將有大收穫。所得不是龍、螭、虎或羆；卦兆顯示將得到一位公侯之才。上天把老師賜給您，讓他輔佐昌，功業將延續到三代君王。」文王問卦兆真能如此嗎？史編以先祖史疇為禹佔得皋陶的相同卦兆作證。文王於是齋戒三日，乘獵車到渭水北岸，終於看見太公坐在茅草上垂釣。',
    analysis: '【主旨】〈文師〉開篇以卜獵遇賢鋪陳文王訪太公，將求賢提升為承受天命。\n【詞義】「田」即畋獵；「渭陽」指渭水之北；「兆得公侯」不是獵得動物，而是將遇公侯之才；「施及三王」指功效延及文王、武王、成王。\n【篇章】史疇為禹佔得皋陶的典故，與文王得太公相映，突出賢臣對王業的奠基作用。'
  },
  'liu-tao_ch-1_p-2': {
    translation: '文王慰問太公，問他是否以釣魚為樂。太公說，君子樂在實現志向，小人樂在辦成事情；自己垂釣與此很相似，未必只是喜愛釣魚。釣術有三種權衡：用祿位、死生與官職來權衡取人。水深魚生、根深果實生、情投意合而事情成，都是由本及末的自然情勢。言語應對只是情實的文飾，直陳真情才是事情的極致。細線明餌取小魚，合宜之線香餌取中魚，粗線豐餌取大魚；人受君祿也會為君所用。因此可由餌魚推知以祿取人、以家取國、以國取天下的道理。',
    analysis: '【主旨】太公借垂釣說政治上的「取人」與「取天下」，試探文王能否接受直言。\n【詞義】「三權」是三種權衡手段；「緡」為釣線；「隆」指粗大；「竭」指盡其才力；「拔」指攻取。\n【論證】全段連用水源、樹根、同情及魚餌四組譬喻，由自然之理推到君臣利祿；此處是權術分析，不宜改寫成泛泛的「知己知彼」。'
  },
  'liu-tao_ch-1_p-3': {
    translation: '太公感嘆：看似綿延聚集的，終究會離散；沉默昏暗的，其光明反會傳得久遠。聖人之德精微，在眾人未見時獨有所見；聖人的謀慮，使萬物各得其所，並建立可聚斂人心的根本。文王問怎樣才能使天下歸附。太公回答：天下不是一人的天下，而是天下人的天下。能與天下共享利益便得天下，獨占天下利益便失天下。與人共享天時地利是仁，救死扶難是德，同憂樂好惡是義，使人民生養獲利是道；仁、德、義、道所在，天下便會歸附。文王拜受其教，迎太公同車回去，立為國師。',
    analysis: '【主旨】由「樹斂」轉入全篇核心：政治正當性來自與民共享利益，而非君主私有天下。\n【詞義】「曼曼緜緜」形容綿延聚集；「嘿嘿昧昧」指沉默幽微；「樹斂」指建立聚眾歸心之本；「生利」指使民得以生養獲利。\n【思想】仁、德、義、道依次落在共享資源、救急扶危、情感共同與保障生計，最後完成從求賢到民本王道的收束。'
  },
  'liu-tao_ch-2_p-1': {
    translation: '文王問太公：天下時而盛、時而衰，時而治、時而亂，究竟是君主賢愚不同造成的，還是天時自然變化造成的？太公回答：君主不賢，國家便危險、人民便混亂；君主賢明，國家便安定、人民便得到治理。禍福取決於君主，不在天時。',
    analysis: '【主旨】〈盈虛〉先駁斥把治亂推給天命的看法，明確建立「禍福在君」的政治責任論。\n【詞義】「盈虛」喻國勢盛衰；「熙熙」指世事往來變動。\n【結構】文王提出人事與天時兩種解釋，太公斷然歸因於君德，為下段堯的節儉愛民提供正面例證。'
  },
  'liu-tao_ch-2_p-2': {
    translation: '太公以堯說明賢君之治：不用金玉裝飾，不穿錦繡，不觀奇珍，不寶玩器，不聽淫樂；宮室不粉飾，屋材不雕斲，茅草庭院也不修剪。只以鹿裘、布衣蔽體，喫粗糧野菜；不因徭役妨害農時，剋制欲望而行無為之治。他尊崇忠正守法、廉潔愛民的官吏，敬愛孝慈、勉勵農桑的百姓，表彰善德，依法禁邪；即使憎惡的人有功也賞，寵愛的人有罪也罰；又供養鰥寡孤獨、賑濟遭禍之家。因自奉薄、賦役少，人民富足安樂，擁戴君主如日月、親愛君主如父母。',
    analysis: '【主旨】以堯的儉約、公正、恤民證明國家盛治出於君主作為。\n【詞義】「堊」為塗白牆壁；「甍桷椽楹」泛指屋棟椽柱；「斲」為砍削雕飾；「耕績」指農耕與紡績；「振贍」即賑濟供養。\n【思想】「無為」並非不行政，而是少欲、少役、不奪農時，同時以賞罰與救濟維持秩序。'
  },
  'liu-tao_ch-3_p-1': {
    translation: '文王問治國最重要的事，太公回答只有愛民。所謂愛民，就是使民得利而不受害，使其成業而不敗事，使其生存而不濫殺，給予而不掠奪，使其安樂而不困苦、歡喜而不怨怒。具體而言，要不妨害民業與農時，減省刑罰、減輕賦稅，節制宮室臺榭，任用清廉而不苛擾的官吏。善治國者待民如父母愛子、兄長愛弟，見其飢寒勞苦便憂傷；施賞罰如同加在自己身上，徵賦如同拿取自己的財物，這就是愛民之道。',
    analysis: '【主旨】〈國務〉把「愛民」分解為生產、司法、財政、營建與吏治五項可檢驗的政策。\n【詞義】「務」既指國家要務，也指人民生業；「與而勿奪」主要落實為薄賦斂；「馭民」在此指治理人民。\n【修辭】先以六組正反命題立綱，再逐項解釋利害，最後用父母兄弟之愛收束，結構嚴密。'
  },
  'liu-tao_ch-4_p-1': {
    translation: '文王問君臣之禮。太公回答：居上者重在臨察，居下者重在沉靜；臨察而不疏遠，沉靜而不隱瞞。居上者要周遍，居下者要安定；周遍如天，安定如地。上者法天、下者法地，大禮才得以成立。',
    analysis: '【主旨】以天地比擬君臣各守其位又彼此相通的秩序。\n【詞義】「臨」為居上臨察；「沈」通沉，指沉靜持重；「周」是周遍無偏；「定」是安守職分。\n【思想】此段並非單說服從，而要求君主臨下不疏遠、臣下沉靜不隱情，雙方各有倫理約束。'
  },
  'liu-tao_ch-4_p-2': {
    translation: '文王問君主應如何居於君位。太公回答：要安詳從容而沉靜，先確立柔和有節的準則；善於施予而不與人爭，虛心平氣，以公正態度對待萬事萬物。',
    analysis: '【主旨】說明君主內在修養：靜、柔、讓、虛、正。\n【詞義】「安徐」為安詳從容；「柔節先定」指先確定柔和而有節度的原則；「待物」指應對人與事。\n【篇章】本段由君臣名分轉入君主自身，強調不爭與虛心，才能容納羣下之言。'
  },
  'liu-tao_ch-4_p-3': {
    translation: '文王問君主應如何聽取意見。太公回答：不要輕率答應，也不要逆意拒絕。輕率答應就會失去原則，逆意拒絕就會堵塞言路。君德應像高山仰望不到頂、深淵測量不到底；以神明般的德性，守正而沉靜到極處。',
    analysis: '【主旨】君主聽言既不可妄許，也不可遽拒，必須守正審察並保持言路暢通。\n【詞義】「失守」指失去持守的原則；「閉塞」指堵塞進言之路；「正靜其極」是以正與靜達到最高準則。\n【修辭】高山、深淵兩喻凸顯君德深厚難測，不是鼓勵故作神祕，而是要求不被一時言辭牽動。'
  },
  'liu-tao_ch-4_p-4': {
    translation: '文王問君主如何做到明察。太公回答：眼睛貴在看得明白，耳朵貴在聽得清楚，心智貴在善於思考。借天下人的眼睛觀察，就沒有看不見的；借天下人的耳朵聽取，就沒有聽不到的；借天下人的心智謀慮，就沒有不知道的。讓各方意見像車輻聚向車轂般一同進達，明察便不會受蒙蔽。',
    analysis: '【主旨】明君之「明」不靠個人全知，而靠匯集天下人的見聞與智慧。\n【詞義】「聰」本指聽覺敏銳；「輻湊」比喻各方資訊集中到核心；「蔽」指被壅塞蒙蔽。\n【思想】本段承接「主聽」，把開放進言提升為制度性的集體認知，是〈大禮〉由名分走向政治運作的結論。'
  }
};

let aidSource = fs.readFileSync(aidPath, 'utf8');
for (const [oldId, newId] of Object.entries(oldToNewPassage)) {
  aidSource = aidSource.replace(new RegExp(`'${oldId}'`, 'g'), `'${newId}'`);
}
for (const [id, value] of Object.entries(aids)) {
  const entry = `  '${id}': {\n    translation: ${JSON.stringify(value.translation)},\n    analysis: ${JSON.stringify(value.analysis)}\n  },`;
  const re = new RegExp(`  '${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}': \\{[\\s\\S]*?\\n  \\},`);
  if (!re.test(aidSource)) throw new Error(`Reading aid not found: ${id}`);
  aidSource = aidSource.replace(re, entry);
}
fs.writeFileSync(aidPath, aidSource, 'utf8');
console.log('Corrected 六韜 selection structure and 10 reading aids.');
