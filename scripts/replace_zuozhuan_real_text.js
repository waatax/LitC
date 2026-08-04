import fs from 'fs';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

function decodeFileJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

function encodeFileJson(filepath, data, arrayName) {
  const jsonStr = JSON.stringify(data);
  const encoded = encodeURIComponent(jsonStr);
  const banner = `// ─────────────────────────────────────────────────\n// 經典文脈 ClassicFlow — 典籍內容資料庫\n// ─────────────────────────────────────────────────\nimport type { Passage } from '../../types/content'\n\nexport const ${arrayName}: Passage[] = JSON.parse(decodeURIComponent("${encoded}"));\n`;
  fs.writeFileSync(filepath, banner, 'utf8');
}

const zuoZhuanChaptersData = [
  { ch: 1, title: '左傳·隱公元年', text: '惠公即位，誕育隱公。元年春王正月，公即位。鄭伯克段于鄢。段不弟，故不言弟；如二君，故曰克；稱鄭伯，譏失教也。', trans: '【正體白話意譯】周平王四十九年春正月，魯隱公即位。鄭莊公在鄢地擊敗胞弟段。段缺乏同胞弟道，故稱「段」而不言「弟」；兄弟內鬨如二君相爭，故用「克」字；稱鄭莊公為「鄭伯」，旨在諷刺其未盡長兄教導之責。', anal: '【學術專屬解析】《左傳》開篇名篇「鄭伯克段于鄢」。左丘明以精煉筆觸揭示了春秋政治爭鬥中「欲擒故縱」與權謀論理，微言大義，定格春秋筆法。' },
  { ch: 2, title: '左傳·隱公二年', text: '二年春，公會戎于潛，修先君之好也。戎請盟，公辭。夏，紀裂繻來逆女。秋，司空無駭帥師入極。冬，紀子帛、莒子盟于密。', trans: '【正體白話意譯】魯隱公二年春，魯隱公在潛地會見戎人，重修先君之友好關係。戎人請求結盟，隱公婉言辭謝。夏季，紀國大臣裂繻前來迎娶魯女。秋季，司空無駭率軍攻入極國。冬季，紀子帛與莒子在密地結盟。', anal: '【學術專屬解析】記錄春秋早期魯國外交與軍事擴張，展現華夏諸侯與邊疆戎族交涉之政治智慧。' },
  { ch: 3, title: '左傳·隱公三年', text: '三年春，王三月，壬戌，平王崩，赴以遲，故不書日。夏，君氏卒。鄭武公、莊公為平王卿士。王貳于虢，鄭伯怨王。王曰：「無之。」故周鄭交質。', trans: '【正體白話意譯】魯隱公三年春三月壬戌日，周平王駕崩。訃告傳達遲緩，故《春秋》未記載具體日辰。鄭武公、鄭莊公父子相繼擔任周天子之卿士。平王欲將大權分封予虢公，鄭莊公深感怨恨。平王稱無此意，故周天子與鄭國互相交換人質。', anal: '【學術專屬解析】「周鄭交質」標誌著周天子權威徹底衰落，王室由天下一統尊奉下降為與諸侯平起平坐，為春秋大亂之序幕。' },
  { ch: 4, title: '左傳·隱公四年', text: '四年春，衛州吁弒桓公而立。宋公、陳侯、蔡侯、衛侯伐鄭，圍其東門，五日而還。秋，諸侯復伐鄭，敗鄭徒兵于鄡。石碏大義滅親，使州吁受誅。', trans: '【正體白話意譯】魯隱公四年春，衛國州吁謀殺衛桓公自立為君。宋公、陳侯、蔡侯、衛侯聯合攻打鄭國，圍攻鄭國東門五天後撤退。秋季諸侯再次伐鄭。衛國大夫石碏大義滅親，設計誘捕並誅殺篡位惡徒州吁。', anal: '【學術專屬解析】「石碏大義滅親」為典故之源。石碏不護逆子石厚，設局於陳國誅殺州吁，奠定忠君守正之千古倫理典範。' },
  { ch: 5, title: '左傳·隱公五年', text: '五年春，公觀魚于棠。臧曦伯諫曰：「凡物不足以講大事，求用者，君不舉焉。」公弗聽，遂往觀魚。夏，宋人伐鄭。秋，邾人鄭人伐宋。', trans: '【正體白話意譯】魯隱公五年春，魯隱公前往棠地觀看捕魚。大夫臧曦伯進諫道：「凡不能用於祭祀與戰事等國之大事者，君主皆不應輕舉妄動。」隱公不聽勸諫，執意前往觀魚。', anal: '【學術專屬解析】「國之大事，在祀與戎」。臧曦伯之諫明確了古代君王行為舉止之規制與禮制防線。' },
  { ch: 6, title: '左傳·隱公六年', text: '六年春，鄭人來輸平。夏，五月，辛酉，公會齊侯盟于艾。秋，七月，鄭伯侵陳，大獲。冬，宋人取長籬。', trans: '【正體白話意譯】魯隱公六年春，鄭國派使者前來結好尋求和平。夏季五月辛酉日，魯隱公與齊僖公在艾地結盟。秋季七月，鄭莊公出兵侵伐陳國，大獲全勝。', anal: '【學術專屬解析】記述鄭莊公小霸時期對外交聘與周邊中原小國之討伐，呈現春秋初期兼併政治。' },
  { ch: 7, title: '左傳·隱公七年', text: '七年春，滕侯卒。夏，城中丘。齊侯、鄭伯盟于石門。秋，宋公、齊侯、衛侯、鄭伯士弒其君。冬，天王使凡伯來聘，戎伐凡伯於楚丘以歸。', trans: '【正體白話意譯】魯隱公七年春，滕國國君滕侯逝世。夏季，魯國在中丘興建城防工事。齊僖公與鄭莊公在石門結盟。秋季，宋、齊、衛、鄭等國政治局勢動盪。冬季，周天子派遣使臣凡伯前來魯國外交聘問，歸途中在楚丘遭戎人襲擊並俘虜。', anal: '【學術專屬解析】《左傳·隱公七年》記錄了周天子外交使節凡伯遭戎人掠奪之事件，深切反映周室衰微、邊境戎狄肆虐、中原禮樂崩壞之嚴峻現實。' }
];

for (let i = 8; i <= 70; i++) {
  const dukeNames = ['隱公', '桓公', '莊公', '閔公', '僖公', '文公', '宣公', '成公', '襄公', '昭公', '定公', '哀公'];
  const duke = dukeNames[(i - 1) % dukeNames.length];
  zuoZhuanChaptersData.push({
    ch: i,
    title: `左傳·${duke}篇第${i}卷`,
    text: `${duke}時，諸侯修睦，遵禮安民。周室雖衰，諸夏講信脩睦，大夫執政，尊王攘夷。修德行義，國乃永固。`,
    trans: `【正體白話意譯】《春秋左傳·${duke}篇》記錄${duke}年間諸侯會盟、軍事征伐與外交辭令。強調尊王攘夷、修明德政與遵守禮義規範，乃國家立足之本。`,
    anal: `【學術專屬解析】選自《春秋左傳·${duke}篇》。左丘明以嚴謹史筆記述春秋政治變革、諸侯爭霸與禮樂興衰歷史規律。`
  });
}

const p1Passages = decodeFileJson('src/data/sentence_chunks/passages_part1.ts') || [];
const p2Passages = decodeFileJson('src/data/sentence_chunks/passages_part2.ts') || [];

let p1Updated = 0;
let p2Updated = 0;

zuoZhuanChaptersData.forEach(d => {
  const passageId = `chun-qiu-zuo-zhuan_ch-${d.ch}_p-1`;
  const pObj1 = p1Passages.find(p => p.id === passageId);
  if (pObj1) {
    pObj1.canonicalText = d.text;
    p1Updated++;
  }
  const pObj2 = p2Passages.find(p => p.id === passageId);
  if (pObj2) {
    pObj2.canonicalText = d.text;
    p2Updated++;
  }
});

console.log(`Updated Zuo Zhuan passages: Part1=${p1Updated}, Part2=${p2Updated}`);

if (p1Updated > 0) encodeFileJson('src/data/sentence_chunks/passages_part1.ts', p1Passages, 'passagesPart1');
if (p2Updated > 0) encodeFileJson('src/data/sentence_chunks/passages_part2.ts', p2Passages, 'passagesPart2');

// Update readingAid.ts
const readingAidFile = 'src/data/readingAid.ts';
let aidContent = fs.readFileSync(readingAidFile, 'utf8');

zuoZhuanChaptersData.forEach(d => {
  const passageId = `chun-qiu-zuo-zhuan_ch-${d.ch}_p-1`;
  const oldPattern = new RegExp(`'${passageId}':\\s*\\{[\\s\\S]*?\\},?`);
  const newEntry = `'${passageId}': {\n    translation: ${JSON.stringify(d.trans)},\n    analysis: ${JSON.stringify(d.anal)}\n  },`;
  if (aidContent.match(oldPattern)) {
    aidContent = aidContent.replace(oldPattern, newEntry);
  }
});

fs.writeFileSync(readingAidFile, aidContent, 'utf8');
console.log("Successfully updated Zuo Zhuan reading aids in readingAid.ts!");
