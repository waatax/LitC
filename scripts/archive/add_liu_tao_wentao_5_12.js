import fs from 'fs';

const sourceData = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = sourceData.chapters.filter(item => item.volume === '文韜' && item.order >= 5 && item.order <= 12);
if (additions.length !== 8) throw new Error(`Expected 8 文韜 additions, got ${additions.length}`);

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
  { label: '數位對校', edition: '維基文庫《六韜》標點本；中國哲學書電子化計劃《六韜》' },
];
function splitSentences(text) {
  return text.match(/[^。！？；]+[。！？；]?/g)?.map(item => item.trim()).filter(Boolean) ?? [text];
}

for (const item of additions) {
  const chId = `liu-tao_ch-${item.order}`;
  const pId = `${chId}_p-1`;
  cd.value = cd.value.filter(ch => ch.id !== chId);
  pd.value = pd.value.filter(p => p.id !== pId);
  sd.value = sd.value.filter(s => s.passageId !== pId);
  const parts = splitSentences(item.text);
  const sentenceIds = parts.map((_, index) => `${pId}_s-${index + 1}`);
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `文韜・${item.title}`, difficulty: 3, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 180)), passageIds: [pId], tags: ['六韜', '文韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '文韜', item.title] });
  });
}

work.chapterIds = Array.from({ length: 12 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》校補進行中：卷一〈文韜〉十二篇已齊；其餘武、龍、虎、豹、犬五韜待依六卷六十篇次續補。經文以《四部叢刊初編》本為底本，參校《續古逸叢書》本、《六韜直解》及公開標點本。';

source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  5: ['文王病重時召太公，準備把周室託付太子發，並請教可以傳給子孫的至道。太公指出：見善卻懈怠、時機來到卻遲疑、知道不對仍安處其中，會使道停止；柔和沉靜、恭敬謹慎、強大而能示弱、忍耐而能剛決，則是道得以興起之處。因此義勝過欲望便昌盛，欲望勝過義便敗亡；敬慎勝過懈怠便吉，懈怠勝過敬慎便滅亡。', '【主旨】〈明傳〉以文王臨終傳道為框架，提出三種敗德與四種成德。\n【詞義】「所止」指道由此中止；「強而弱」指有力量而能謙下示弱；「忍而剛」指能忍耐又能在應斷時果決。\n【結構】末句以義／欲、敬／怠兩組對舉，將個人修養直接連到國家昌亡。'],
  6: ['文王問君主失國的原因，太公說在於不能慎選所親任的人，因而提出仁、義、忠、信、勇、謀六項操守。考察人才時，可使其富而觀其不犯法，使其貴而觀其不驕，使其任重而觀其不改節，使其辦事而觀其不隱瞞，使其處危而觀其不恐懼，使其應付事變而觀其智謀不窮。君主另須掌握農、工、商三種國家根本，使各安其業，糧、器、貨充足；六守的人才長用，君主便昌盛，三寶完備，國家便安定。', '【主旨】〈六守〉兼論選才的六項德性與農工商三項經濟根本。\n【詞義】「所與」指所交付、親任之人；「無轉」指不改操守；「三寶」不是私人珍寶，而是大農、大工、大商。\n【思想】六守用情境測試品格，三寶用職業分工保障物資，將人事與經濟視為國安的兩根支柱。'],
  7: ['文王問如何守護國土。太公說不可疏遠宗親、怠慢民眾，要安撫近臣並防禦四方，更不可把國家權柄與利器借給他人。做事不可捨本逐末或錯失時機：正午應除穢，持刀應割，執斧應伐；小水不堵會成江河，小火不救會成烈焰，嫩葉不除終須動斧。君主必須使國家富足，才能施仁、親族聚眾。所謂仁義的綱紀，就是敬重民眾、團結親族；對順道者以德任用，對悖逆者以力量制止，才能使天下和服。', '【主旨】守土之道在掌握權柄、及時防微、富民施仁與和親敬眾。\n【詞義】「國柄」「利器」均指國家權力；「日中必彗」指日中應掃除；「熒熒」為微火；「斧柯」即斧柄，代指用斧砍除。\n【修辭】涓流、微火、嫩葉三層譬喻反覆說明禍患須在微小時處置。'],
  8: ['文王齋戒七日後請教守國。太公說，天有四時、地生萬物、聖人治理人民；春生、夏長、秋收、冬藏，盈滿後收藏，收藏後再生，循環無端。聖人配合這一常道建立秩序：天下治時賢聖退藏，天下亂時賢聖興起。順應常道，人民便安定；人民一動便形成得失爭奪的關鍵，所以治理者要在事機未顯時發動，在公開層面會合，先倡導而使天下響應，最終恢復常道，使人不爭進退。如此守國，便能與天地同其光明。', '【主旨】〈守國〉以四時循環說明政治須順常道、察民機並適時倡導。\n【詞義】「牧」是治理；「經紀」是綱常秩序；「民機」指民情發動、足以造成得失的關鍵；「陰」「陽」分指未顯與已顯的層面。\n【思想】文中不是消極等待天命，而是要求治理者辨識循環、在爭端萌芽前引導民情。'],
  9: ['文王問治理人民應尊崇或貶抑、採取或去除、禁止或停止什麼。太公主張尊賢去不肖、取誠信去詐偽、禁暴亂止奢侈，並列舉危害王政的六賊與七害：包括奢建遊樂、荒廢農桑、朋黨蔽賢、結交諸侯、輕視職守、豪族侵弱，以及無謀而好戰、有名無實、假裝樸素求名、服飾言論誇奇、讒佞貪祿、技巧華飾傷農、巫蠱左道惑民等。最後要求民、士、臣、吏、相各盡其實；君主則應高居遠望、深察審聽，並在應當處置奸賊時果斷執行。', '【主旨】〈上賢〉不只倡言尊賢，更建立辨識偽才、朋黨、奢侈與傷農行為的負面清單。\n【詞義】「王人」指以王道治民；「抗志高節」在此指矯飾高名；「比周」為結黨營私；「萬乘」代指天子。\n【思想】篇末以名實衡量各種職分，重點在實際能力與公共責任，不可把篇中的戰國身分秩序直接等同現代倫理。'],
  10: ['文王問，君主努力舉薦賢才，國家反而更亂甚至危亡，原因何在。太公說，舉而不用，只有舉賢之名而沒有用賢之實；若君主依照世俗的讚譽與毀謗判斷人才，黨羽多的人便進身，黨羽少的人便退處，羣邪結黨遮蔽賢人，忠臣無罪而死，奸臣靠虛名取得爵位。正確方法是使將相分職，按各官職要求舉人，再依名責實、考核才能，使職名、能力與實際表現相符。', '【主旨】〈舉賢〉辨明「舉」與「用」的差異，反對以輿論聲勢代替實績考核。\n【詞義】「比周」為勾結營私；「按名督實」指依職名查覈實際績效；「實當其能」指職事符合能力。\n【論證】先指出有名無實，再分析朋黨形成機制，最後提出分職、舉人、考能、核實的制度解方。'],
  11: ['文王說賞賜用來勸勉、刑罰用來警戒，希望賞一人而勸百人、罰一人而懲眾人。太公回答，行賞最重要的是守信，行罰最重要的是必定執行。若在人們耳目所見聞之處做到賞信罰必，即使沒有親眼見到的人也會在無形中受到感化。誠信能暢行天地、通達神明，對人更應如此。', '【主旨】〈賞罰〉以「賞信罰必」建立制度公信力。\n【詞義】「存勸」指保持勸善作用；「陰化」指未直接見聞者也潛移默化；「暢」指通行無礙。\n【思想】賞罰的效果不只在個案本身，更在公開、可信、可預期所形成的普遍示範。'],
  12: ['武王問用兵之道。太公說核心在「一」：統一的原則接近道與神妙，運用靠時機，顯現靠形勢，成敗取決於君主。兵器是不祥之器，只能不得已使用；安存時要預慮滅亡，安樂時要預慮禍患。兩軍固守相持時，應外示混亂而內部整齊，外示飢乏而實際充足，隱藏謀略與精銳，使敵人不知準備所在；聲稱向西而突襲東方。即使敵人知道己方情況，也須密察敵方事機，迅速乘隙，疾擊其不意。', '【主旨】〈兵道〉先以慎戰定義用兵，再說統一指揮、示形欺敵與乘機速擊。\n【詞義】「一」指統一而貫通的用兵原則；「階於道，幾於神」指循道而近神妙；「鈍」為不精銳的外觀；「機」是可乘的關鍵。\n【結構】全篇由戰爭倫理進到相持戰術，最後以情報已洩時仍可靠察機與速度取勝作結。']
};

let aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
for (const item of additions) {
  const [translation, analysis] = aids[item.order];
  const id = `liu-tao_ch-${item.order}_p-1`;
  const entry = `  '${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(analysis)}\n  },\n`;
  const marker = '\n}\n\nexport function getPassageReadingAid';
  if (!aidSource.includes(marker)) throw new Error('Cannot find PASSAGE_AIDS closing marker');
  aidSource = aidSource.replace(marker, `,\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync('./src/data/readingAid.ts', aidSource, 'utf8');
console.log('Added and annotated 文韜 chapters 5–12.');
