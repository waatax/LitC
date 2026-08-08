import fs from 'fs';

const corrections = {
  'art-of-war_ch-3_p-1': {
    translation: '孫子說：用兵的原則，使敵國完整屈服是上策，攻破敵國次一等；使敵軍完整屈服是上策，擊破敵軍次一等；使敵軍的旅、卒、伍各級建制完整屈服是上策，擊破它們次一等。因此，百戰百勝還不是最高明的；不經交戰便使敵軍屈服，才是最高明的。',
    analysis: '【主旨】「全勝」優先於以破壞換取勝利：能以較低的人命、資源與政治成本達成目的，才高於百戰百勝。\n【文本校正】原資料在「全國」後漏掉「全軍為上，破軍次之」，宋本《十一家注孫子》與通行本均有此句，今據以補回。「軍、旅、卒、伍」是由大到小的軍隊建制，古注所說人數不盡一致，不宜硬套單一數字。\n【章法】五組「全／破」由國至伍逐層排比，再以「百戰百勝／不戰而屈」反轉一般對勝利的想像。\n【界限】「不戰」並非不作為，而是以威懾、外交、謀略或優勢態勢迫使對方放棄抵抗；若手段本身造成同等或更大傷害，也不符合「全」的成本原則。'
  },
  'art-of-war_ch-3_p-2': {
    analysis: '【主旨】戰略手段依成本排序：先破壞敵方計畫，再瓦解其外援，其次才野戰，強攻城池最下且只可不得已而用。\n【詞義】「伐謀」是使敵謀不能成立；「伐交」是破壞敵方外交聯盟；「櫓」可指大型盾具，「轒轀」是蒙以皮革等防護的攻城車；「距闉」多解為築土山逼近城牆；「蟻附」比喻士卒密集攀城。\n【章法】前四句形成手段階梯，後半用兩個「三月」和「殺士卒三分之一」把攻城代價具體化。\n【思想】本段批評將領因憤怒而把士卒投入無效強攻，將情緒控制列為指揮責任；「攻城不得已」不是永不攻城，而是必須證明其他較低成本方案不可行。'
  },
  'art-of-war_ch-3_p-3': {
    analysis: '【主旨】謀攻要以保存自身與目標的完整性爭勝，並依相對兵力選擇圍、攻、分、戰、守、避，而非不問條件地硬拚。\n【詞義】「非戰、非攻、非久」指不靠正面決戰、強攻與久戰；「全爭」是以完整方式取得戰略利益；「頓」是困頓耗損。「倍則分之」古注有分我兵、分敵兵兩系解釋，本譯採較常見的設法分散敵軍；「敵」是勢均；「不若」是整體不如。\n【章法】先重申全勝，後列六級兵力對策，再以小敵固執終為大敵所擒作警告。\n【思想】數量比例是便於說明的相對優勢模型，不是現代戰場的固定公式；情報、地形、訓練與科技都會改變有效戰力。撤避和防守在此是理性選項，不等於怯懦。'
  },
  'art-of-war_ch-3_p-4': {
    analysis: '【主旨】將領是國家軍事能力的重要支柱；君主若不了解前線條件卻直接干預進退、軍政與權變，會使軍隊迷惑而把勝機讓給敵人。\n【詞義】「輔周」是輔佐完密，「輔隙」是有缺漏；「縻軍」是束縛軍隊；兩個「同」有參預、干涉之意；「權」是臨機處置；「亂軍引勝」是自亂其軍而把勝利引向敵方。\n【章法】三患依序從錯誤命令、干預行政到干預專業指揮，結果由惑、疑推至外敵乘隙。\n【界限】這不是主張軍權不受文人政府監督，而是區分戰略目標、合法監督與即時專業指揮；現代制度仍須有清楚授權、問責和文官統制。'
  },
  'art-of-war_ch-3_p-5': {
    analysis: '【主旨】能預判勝負的五項條件，是戰與不戰的判斷、眾寡運用、上下同欲、準備優勢，以及將領專業不受不當牽制。\n【詞義】「識眾寡之用」不是只看人數，而是懂得不同兵力規模如何配置；「虞」是有準備，「不虞」是無備；「御」在此是牽制、干預。\n【章法】五個「……者勝」平行列舉，最後以「知勝之道」總收，回應〈始計〉以比較條件預見勝負。\n【思想】五項互相制約：同欲不能取代專業，準備也不能補救錯誤的戰爭選擇。現代閱讀尤其應把「君不御」理解為授權邊界，而非取消政治與法律責任。'
  },
  'art-of-war_ch-3_p-6': {
    translation: '所以說：既了解對方，也了解自己，縱使多次交戰也不致陷入危殆；不了解對方而只了解自己，勝負各有可能；既不了解對方，也不了解自己，每次交戰都必然失敗。',
    analysis: '【主旨】可靠決策必須同時建立敵情與己情兩套認識；任何一邊缺失，都會降低勝算。\n【詞義】「彼」包括敵方目標、能力、部署與限制；「己」包括自身資源、士氣、制度與弱點；「百戰」是多次作戰的概稱；「不殆」是不陷於危敗，不等於保證每戰全勝。「一勝一負」表達勝負不定。\n【章法】由知彼知己、只知己、兩者皆不知三級遞降，結果由不殆降到勝負參半，再到必敗。\n【思想】名句常被抽離前文；實際上「知」來自五事七計、情報比較和是否可戰的判斷，不是主觀自信。真正知己也包括承認不可戰、應守或應避。'
  },
  'art-of-war_ch-4_p-1': {
    analysis: '【主旨】善戰者先控制自己能控制的部分，使自身不易被擊敗，再等待敵方出現可利用的敗因。\n【詞義】「為不可勝」是建立不敗條件；「可勝在敵」是敵人是否暴露破綻取決於其行動；「勝可知」指可由情勢判斷；「不可為」是不能憑主觀意願強造敵人的漏洞。\n【章法】以「不可勝／可勝」「在己／在敵」「可知／不可為」三組對偶，嚴格區分防敗與制勝。\n【思想】這不是被動等待，而是先完成組織、情報、後勤與防護，再持續觀察。它也不是說人完全不能塑造敵勢；後篇仍談示形誘敵，但不能保證敵人必然按預期犯錯。'
  },
  'art-of-war_ch-4_p-2': {
    translation: '要使自己不被戰勝，採取的是防守；敵人已有可勝之隙，採取的是進攻。採取防守，表示我方取勝條件尚不足；採取進攻，表示我方取勝條件已有餘。善守者隱蔽得彷彿藏在九地之下，善攻者發動得彷彿來自九天之上，因此既能保全自己，又能取得完整勝利。',
    analysis: '【主旨】攻守不是固定性格，而是取勝條件不足或有餘時的不同選擇；最高標準是守能自保、攻能全勝。\n【詞義】「守則不足」是可供進攻的有利條件不足，不是說防守者能力低劣；「攻則有餘」是攻勝條件充足；「九地之下／九天之上」是極言隱蔽之深、發動之高遠迅疾。\n【章法】前四個短句作定義與因果，後用上下極端意象形成鮮明攻守對照。\n【思想】本段反對為進攻而進攻，也反對把防守污名化。攻守轉換的判準是相對條件與風險，而不是將領好勇或畏縮。'
  },
  'art-of-war_ch-4_p-3': {
    analysis: '【主旨】最高明的勝利在交戰前已由條件建構完成，看來平常，甚至沒有智勇名聲；它不是在危局中僥倖逆轉。\n【詞義】「見勝」是看見勝機；秋毫、日月、雷霆都極易舉、見、聞，用來說明顯而易見不算特殊能力；「不忒」是不出差錯；「措」是措施、部署；「勝已敗者」指所勝之敵已陷敗勢；「不失敵之敗」是不錯過敵人可敗的時機。\n【章法】先否定世俗稱頌的顯赫勝利，再用三個日常比喻，最後提出「先勝而後求戰」的因果次序。\n【思想】「易勝」不是挑弱者欺凌，而是透過準備與形勢管理，把高不確定的戰鬥變成低風險行動；它要求組織重視看不見的前置工作，而非英雄式冒險。'
  },
  'art-of-war_ch-4_p-4': {
    analysis: '【主旨】善戰者先修明共同原則、保存制度，再由土地、容量、兵數和力量比較逐級判勝，最終形成壓倒性的軍形。\n【詞義】「修道」承〈始計〉的上下同意與政治基礎；「保法」是確保編制、職責、軍需等制度；「政」可解為主宰、決定。「度、量、數、稱、勝」是從空間條件推算資源與有效戰力的鏈條；鎰重而銖輕，用來比喻懸殊。\n【章法】前句說制度前提，中段以五項相生建立計算流程，末段用天平與決水兩個物理意象呈現靜態力量差和動態釋放。\n【思想】「形」是可觀察、可計量的力量配置，不只是外表陣形。數據必須建立在可靠制度與實情之上；若資料失真，再精密的計算也不能產生真正勝勢。'
  }
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncodedExport(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(\")([\\s\\S]*?)(\"\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing export ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
const oldText = '孫子曰：凡用兵之法，全國為上，破國次之；全旅為上，破旅次之；全卒為上，破卒次之；全伍為上，破伍次之。是故百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。';
const inserted = '全軍為上，破軍次之；';
const newText = oldText.replace('全旅為上', `${inserted}全旅為上`);
const delta = newText.length - oldText.length;
updateEncodedExport('works', 'Work\\[\\]', (items) => {
  const work = items.find((item) => item.id === 'art-of-war');
  if (!work) throw new Error('Missing work');
  work.totalChars += delta;
});
updateEncodedExport('passages', 'Passage\\[\\]', (items) => {
  const passage = items.find((item) => item.id === 'art-of-war_ch-3_p-1');
  if (!passage || passage.canonicalText !== oldText) throw new Error('Unexpected passage text');
  passage.canonicalText = newText;
  passage.sourceRefs = [
    { label: '宋本《十一家注孫子》', edition: '國家圖書館藏宋刊本' },
    { label: '中國哲學書電子化計劃', edition: '《孫子兵法》〈謀攻〉' }
  ];
});
updateEncodedExport('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((item) => item.id === 'art-of-war_ch-3_p-1_s-1');
  const oldSentence = '孫子曰：凡用兵之法，全國為上，破國次之；';
  if (!sentence || sentence.canonicalText !== oldSentence) throw new Error('Unexpected sentence text');
  sentence.canonicalText = `${oldSentence}${inserted}`;
  const nextOrder = sentence.chunks.length + 1;
  for (const [index, text] of ['全軍為上', '，', '破軍次之', '；'].entries()) {
    sentence.chunks.push({ id: `${sentence.id}_c-${nextOrder + index}`, sentenceId: sentence.id, order: nextOrder + index, text, cue: text[0] });
  }
});
fs.writeFileSync(worksFile, worksSource, 'utf8');

const aidFile = 'src/data/readingAid.ts';
let aid = fs.readFileSync(aidFile, 'utf8');
const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let changed = 0;
aid = aid.replace(aidPattern, (whole, id, oldTranslation) => {
  const item = corrections[id];
  if (!item) return whole;
  changed += 1;
  const translation = item.translation ?? JSON.parse(`"${oldTranslation}"`);
  return `'${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(item.analysis)}\n  }`;
});
if (changed !== 10) throw new Error(`Expected 10 aid changes, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const commonSources = [
  'https://ctext.org/art-of-war/zh',
  'https://ctext.org/wiki.pl?chapter=97660&if=en',
  'https://www.chineseclassic.com/content/1777',
  'https://tcmb.culture.tw/zh-tw/detail?id=20130813000029&indexCode=BOCH_CountryCulture_61'
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate review ${passageId}`);
  reviewData.reviews.push({
    passageId,
    canonicalText: passageId === 'art-of-war_ch-3_p-1' ? 'verified' : 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: passageId.startsWith('art-of-war_ch-4') ? [...commonSources, 'https://ctext.org/art-of-war/tactical-dispositions/zh'] : commonSources,
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Reviewed Sunzi chapters 3-4 and restored omitted 軍 clause.');
