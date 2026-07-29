import fs from 'fs';

const corrections = {
  'art-of-war_ch-9_p-1': {
    analysis: '【主旨】行軍駐戰要利用山、水、沼澤、平陸的高低、向背與渡河時機，避免把部隊置於仰攻、受水或難退的位置。\n【詞義】「處軍」是選擇駐軍位置，「相敵」是觀察敵情；「視生」多指向陽、有生氣與補給便利處；「戰隆無登」是不仰攻高地；「水內」指敵渡水過程；「斥澤」是鹽鹼低濕地；「前死後生」是前低後高或前向不利、後有依託。\n【章法】山、水、斥澤、平陸四類各以行、處、戰排列，末引黃帝傳說為古代權威背書。\n【評議】高燥、向陽、飲水與渡河風險有經驗基礎，但具體規則受武器、交通與水文改變；「黃帝勝四帝」屬傳說性敘事，不能當作可考戰例。'
  },
  'art-of-war_ch-9_p-2': {
    analysis: '【主旨】營地要兼顧衛生、供給、洪水、險地與伏擊風險；地利既是位置選擇，也是持續偵察。\n【詞義】「養生處實」指選擇物資充足、有利健康之地；「百疾」泛指多種疾病；「水沫至」是上游暴雨、洪水將至的徵象；絕澗、天井、天牢、天羅、天陷、天隙是六種受限或險惡地形，歷代界定略異；「覆索」是反覆嚴密搜索；「伏姦」是伏兵與奸細。\n【章法】先說高陽健康，再說洪水，繼而列六險，最後收於營旁搜索。\n【評議】向陽高燥可降低部分潮濕衛生問題，但「軍無百疾」是理想化表達，不能替代現代醫療、氣象、水文與工程評估。'
  },
  'art-of-war_ch-9_p-3': {
    translation: '敵人距離近卻保持安靜，是倚仗險要；距離遠卻來挑戰，是想誘我前進；駐在平坦易攻之地，是另有可圖之利。許多樹木搖動，可能有部隊接近；草叢設置許多遮障，是故布疑陣；鳥群驚飛，可能下有伏兵；野獸驚奔，可能有大隊掩襲。塵土高而尖，可能是戰車來；低而寬，可能是步兵來；零散成條，是樵採活動；少量來回，是正在布置營地。措辭謙卑卻增強戒備，是準備前進；措辭強硬又作前驅姿態，可能準備撤退。輕車先出兩翼，是正在列陣；未有盟約便來求和，是另有圖謀；奔走而陳列兵車，是約期交戰；半進半退，是誘敵。士卒倚著兵器站立，是飢困；取水的人自己先喝，是乾渴；見到利益卻不前進，是疲勞。營上聚鳥，表示營地空虛；夜間呼喊，表示恐慌；軍中擾動，是將領缺乏威重；旗幟亂動，是隊伍混亂；軍吏動怒，是部眾疲倦；殺馬充食，是軍中缺糧；懸起炊具、不返回營舍，是準備突圍死戰。低聲反覆對部下說話，是失去人心；頻繁獎賞，是情勢窘迫；頻繁懲罰，是部隊困頓；先對部眾凶暴，後來又害怕他們，是最不精明。派使者前來致歉，是想休整。敵軍盛怒前來，長久不交戰也不離去，必須謹慎查明真實意圖。',
    analysis: '【主旨】本段把敵軍不可直接看見的行動、補給、士氣和指揮狀態，從地表、塵土、鳥獸、言辭及士卒行為等間接徵候推斷。\n【文本校正】原資料「仗而立者」據宋本《十一家注孫子》及通行本改作「杖而立者」；「杖」是倚靠，古注解為飢困無力而倚兵器。\n【方法】每個「……者，……也」都是偵察假設，不是單一徵象的必然因果。同樣樹動、鳥起、塵形可能有多種原因，必須交叉觀察並結合風向、地形和時間。\n【評議】其中物候與行為判讀反映前現代目視偵察經驗，有些仍具常識價值，但不能宣稱為現代科學定律；感測器、空中偵察與欺敵技術都會改變其可靠度。'
  },
  'art-of-war_ch-9_p-4': {
    translation: '兵力並不是越多越可貴，關鍵是不要恃勇冒進，能集中力量、判斷敵情、取得部眾信任與任用，就足以取勝。只有不作深思而輕視敵人的人，必定會被敵人擒獲。',
    analysis: '【主旨】數量本身不能代替謹慎判敵、集中力量與有效用人；最大的危險是恃勇冒進、無謀輕敵。\n【詞義】「非貴益多」不是否定兵力價值，而是否定只求增加；「武進」多解恃勇冒進；「併力」是合力集中；「料敵」是判斷敵情；「取人」可解取得人心、任用人才或制取敵人，歷代注解有別，本譯保留前兩項並以取勝收束；「易敵」是輕敵。\n【章法】先否定唯數量論，再列足以作戰的條件，末用必擒警告反面。\n【思想】精兵並不等於少兵必勝；若任務、空間與後勤需要規模，數量仍是條件之一。重點是有效戰力而非名義人數。'
  },
  'art-of-war_ch-9_p-5': {
    analysis: '【主旨】治軍須先建立信任，再一致執行紀律；只有恩愛沒有命令，或只有刑罰沒有親附，都不能形成可用部隊。\n【詞義】「親附」是信任歸附；「文」指恩信、教化與柔性治理；「武」指威刑、法令與整齊紀律；「齊」是使步調一致；「令素行」是命令平日一向明確且貫徹；「相得」是上下互相信任配合。\n【章法】先列未附而罰、已附而罰不行兩個極端，再提出文武並用，最後以平日執行解釋服從來源。\n【思想】紀律的正當性和有效性取決於可預期、一致與平時信任，不是臨戰突然嚴酷。這也限制了任意懲罰：規則若不明、不一貫，不能把不服全歸罪部屬。'
  },
  'art-of-war_ch-10_p-1': {
    analysis: '【主旨】六種地形不是靜態名稱，而是敵我可進退性、通道寬窄、高低與距離共同形成的行動條件，各有不同對策。\n【詞義】「通」是雙方往來便利；「掛」是易入難返；「支」是雙方出擊皆不利、互相牽制；「隘」是狹窄通道；「險」是高峻險要；「遠」是相距遠。「盈」指以足夠兵力充滿扼守；「利糧道」是保持補給線便利；「挑戰」是主動求戰。\n【章法】每類依定義—我先—敵先或作戰結果說明，末以將領重任總括。\n【思想】地形的意義是關係性的：同一地點在不同部署、補給和技術條件下可能不是同一類。分類幫助提問，不能取代現地偵察。'
  },
  'art-of-war_ch-10_p-2': {
    analysis: '【主旨】走、弛、陷、崩、亂、北六種敗象，都由兵力使用、上下關係、命令組織與判敵錯誤造成，不能推給天地。\n【詞義】「走」是潰逃；「弛」是部隊鬆弛散壞；「陷」是官強卒弱、隊伍陷落；「崩」是部將不服而擅戰引起崩解；「無常」是職分編制不固定；「北」是敗走；「選鋒」是挑選的精銳前鋒。\n【章法】六者逐項命名並給出可診斷原因，首尾兩次強調將之過、將之至任。\n【思想】這是領導責任清單，不是把所有失敗簡化成個人過錯；制度、資源和上級錯誤也會約束將領。可取處在於不以天命掩蓋可預防的組織失敗。'
  },
  'art-of-war_ch-10_p-3': {
    translation: '地形是用兵的助力。判斷敵情、制定勝法，計量險隘與遠近，是高明將領的職能。懂得這些並用於作戰，才有取勝條件；不懂而用兵，就有失敗危險。依作戰條件判斷確有勝算，即使君主說不要作戰，將領也可主張作戰；依條件判斷不能取勝，即使君主命令必戰，也可主張不戰。所以，前進不是為求個人名聲，後退也不因害怕罪責；唯一所求是保全人民並符合國家與君主的根本利益，這樣的將領才是國家的珍寶。',
    analysis: '【主旨】將領須以敵情、地形和公共利益判斷戰與不戰，而非以邀名、避罪或機械服從取代專業責任。\n【詞義】「地形，兵之助」表明地形是助力而非唯一決定因素；「戰道」是依客觀作戰條件所得的判斷；「主」指君主；「唯民是保」以賓語前置強調保民；「利於主」應放在國家根本利益脈絡，不能縮成君主私利。\n【章法】先說專業判斷，繼以兩種君命衝突作正反例，最後刻畫不求名、不避罪的將德。\n【界限】古代文本賦予前線將領較大裁量；現代仍須置於合法命令、文官統制、交戰規則和問責制度內，不是自行發動戰爭的授權。'
  },
  'art-of-war_ch-10_p-4': {
    translation: '照顧士卒如照顧嬰兒，才可能使他們一同赴險；關愛士卒如關愛子女，才可能使他們一同出生入死。但如果只厚待而不能使用，只愛護而不能發布、執行命令，違紀混亂又不能治理，就像被驕縱的孩子一樣，仍不能用來作戰。',
    analysis: '【主旨】關愛士卒能建立信任與共同承擔，但必須與清楚命令、訓練和紀律並行；溺愛同樣會使軍隊不可用。\n【詞義】「視卒如嬰兒／愛子」是要求照顧其生存與利益；「赴深谿」「俱死」極言共同赴險；「使」是指揮任用；「令」是施行命令；「驕子」是受寵而不受約束者。\n【章法】前兩句把愛兵推到赴險效果，後一句連用三個「不能」迅速設下界限。\n【評議】現代軍隊對人員有照護義務，但不能把士卒幼兒化或以情感操控犧牲；合法任務、知情訓練、醫療與退避規則比家父長式比喻更重要。'
  },
  'art-of-war_ch-10_p-5': {
    translation: '只知道我軍可以出擊，卻不知道敵軍其實不可攻，取勝條件只掌握一半；只知道敵軍可以攻，卻不知道我軍不能出擊，也只掌握一半；既知道敵軍可攻，也知道我軍能打，卻不知道地形不宜交戰，仍只掌握一半。所以真正懂得用兵的人，行動時不迷惑，採取措施時不會陷入困境。因此說：了解對方也了解自己，勝利才不致危殆；再了解天時與地形，勝利才可能完整。',
    analysis: '【主旨】勝負判斷至少要同時涵蓋敵、我、地形與天時；只掌握其中一面，即使方向正確也仍有重大未知。\n【詞義】「勝之半」不是精確百分之五十，而是條件只知一半；「舉」是舉措；「不窮」是不陷入困迫、應對有方；「天」承〈始計〉的時令氣候；「地」是距離、險易與可進退條件；「勝乃可全」是勝利才可望周全，不是絕對保證。\n【章法】三種單邊認知逐層補入敵、我、地，最後用知彼己、知天地兩層總結。\n【思想】名句把資訊完整性置於勇氣之前。現代決策還應加入法律、政治目的、平民風險與不確定性，不能把四項資訊當成自動勝利公式。'
  }
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(\")([\\s\\S]*?)(\"\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const passage = items.find((item) => item.id === 'art-of-war_ch-9_p-3');
  if (!passage || !passage.canonicalText.includes('仗而立者')) throw new Error('Unexpected passage');
  passage.canonicalText = passage.canonicalText.replace('仗而立者', '杖而立者');
  passage.sourceRefs = [{ label: '宋本《十一家注孫子》', edition: '〈行軍〉' }, { label: '中國哲學書電子化計劃', edition: '〈行軍〉' }];
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((item) => item.passageId === 'art-of-war_ch-9_p-3' && item.canonicalText.includes('仗而立者'));
  if (!sentence) throw new Error('Missing sentence');
  sentence.canonicalText = sentence.canonicalText.replace('仗而立者', '杖而立者');
  const chunk = sentence.chunks.find((item) => item.text.includes('仗而立者'));
  if (!chunk) throw new Error('Missing chunk');
  chunk.text = chunk.text.replace('仗而立者', '杖而立者');
  chunk.cue = '杖';
});
fs.writeFileSync(worksFile, worksSource, 'utf8');

const aidFile = 'src/data/readingAid.ts';
let aid = fs.readFileSync(aidFile, 'utf8');
const pattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let changed = 0;
aid = aid.replace(pattern, (whole, id, oldTranslation) => {
  const item = corrections[id];
  if (!item) return whole;
  changed += 1;
  const translation = item.translation ?? JSON.parse(`"${oldTranslation}"`);
  return `'${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(item.analysis)}\n  }`;
});
if (changed !== 10) throw new Error(`Expected 10, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = ['https://ctext.org/art-of-war/zh', 'https://www.chineseclassic.com/content/1777', 'https://zh.wikisource.org/zh-hant/十一家注孫子/行軍篇', 'https://www.leeyuri.org/Daxi-8T-YinZhu.pdf'];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  const chapterSource = passageId.startsWith('art-of-war_ch-9') ? 'https://ctext.org/art-of-war/army-on-the-march/zh' : 'https://ctext.org/art-of-war/terrain/zh';
  reviewData.reviews.push({ passageId, canonicalText: passageId === 'art-of-war_ch-9_p-3' ? 'verified' : 'pending', translation: 'verified', analysis: 'verified', sources: [...sources, chapterSource], reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Reviewed Sunzi chapters 9-10 and corrected 杖而立者.');
