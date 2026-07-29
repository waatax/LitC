import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-28': {
    translation: '老子說：凡侍奉別人，不是贈送寶物財幣，就是使用謙卑言辭。但財物終會用盡，欲望卻不會滿足；屈身卑辭可以暫免責難，彼此論說交往，關係仍未必牢固；即使訂立約束、誓言盟約，約定後仍可能比預定日期更早背叛。因此君子不在外表粉飾仁義，而在內部修明治道。把境內政事修好，充分運用本地條件，勉勵人民決心守衛，鞏固城郭，使上下一心，共同守護社稷。如此，即使為了名飾而出兵的人，也不會攻伐無罪之國；為利益而來的人，也不會攻打難以攻取之國。這是保全國家的道路，也是取得實利的道理。',
    analysis: '【主旨】本段認為財幣、卑辭、盟約都不足以換得可靠安全；真正的外交與國防基礎是內修政治、善用地利、民願守死與上下一心。\n【關鍵詞義】「事人」是侍奉、與強者周旋；「幣單」是財幣耗盡；「盡其地方」是充分治理、運用一地條件；「為飾者」可指為名義文飾而用兵者。\n【版本提示】「卑體免辭」「約定而反先日」疑有訛脫，現譯按卑辭暫免、盟約仍可能早背的上下文保守處理。'
  },
  'wenzi_ch-3_p-30': {
    translation: '老子說：治理身體、涵養本性的人，調節睡眠起居，使飲食適宜，調和喜怒，使動靜便利合度。內在屬於自己的部分得到安頓，邪氣便無從侵入。裝飾外表，往往傷害內部；放縱情欲，會損害精神；只看外在文采，會遮蔽真實。片刻都不忘扮演賢者，必定困苦本性；走一百步都不肯忘記維持儀容，必定拖累身體。因此羽翼過分華美，可能傷及骨骸；枝葉過度茂盛，可能損害根荄。內外兩面都追求極致華美，天下沒有能長久做到的。',
    analysis: '【主旨】本段將養生落在睡眠、飲食、情緒與動靜節律，並批評持續維持賢者形象與外表儀容造成的身心耗損。\n【關鍵詞義】「扶其情」依文脈為助長、放縱情欲；「文」是外在文飾；「為容」是維持儀態；「根荄」是植物根部。\n【思想】末句不是說內外永不能兼顧，而是反對外飾無限擴張、犧牲生命根本；羽翼與枝葉是資源失衡的譬喻。'
  },
  'wenzi_ch-3_p-31': {
    translation: '老子說：天擁有光明，卻不為人民的昏暗憂慮；地擁有財富，卻不為人民的貧乏焦慮。具有至德與道的人像山丘大山，巍然不動，行路者自然把它當作方向標準。他只端正自己而使萬物充足，不把這當成對人的賞賜；使用其成果的人，也不必承受報德壓力，所以安定而能長久。天地不以私意給予，所以也不奪取；不自居有德，所以不招怨。動輒發怒的人必多結怨，喜歡以恩惠給人的人也常會強行取回；只有隨順天地自然，才能合乎事理。因此稱譽一旦顯露，毀謗便隨之而來；善名一旦顯露，惡名便跟著出現。利益可能成為傷害的開端，福分可能成為災禍的先聲。不強求利益，便少受其害；不強求福分，便少招其禍。生命以保全為常道，富貴只是暫時寄寓。',
    analysis: '【主旨】本段以天地「不自居施德」說無條件的公共供養：若施與帶著控制和回收期待，給予就可能變成奪取並積怨。\n【關鍵詞義】「直己而足物」是端正自身，使萬物各足；「不為人賜」是不把自然供給宣稱為私人恩賜；「善與者必善奪」指好施恩者也可能好索還；「寄」是暫時依附。\n【辨析】不求利福不是拒絕正常生活改善，而是不以富貴福名取代生命保全，亦不把公共成果變成個人恩德。'
  },
  'wenzi_ch-3_p-32': {
    translation: '老子說：聖人不穿曲折奇異的服裝，不做詭怪異常的行為；衣著不雜亂，行動不刻意供人觀賞。處境通達而不浮華，處境困窮而不恐懼；榮顯而不炫耀，隱沒而不自辱；與人不同卻不故作怪異，與人相同地做事也無法用固定名目限定他。這叫作大通。',
    analysis: '【主旨】本段反對以奇服怪行或公開表演塑造身份，提出在通窮、榮隱、異同各種處境中都不被外在標籤控制。\n【關鍵詞義】「屈奇」是曲折奇特；「行不觀」是不把行為做給人看；「懾」是恐懼；「同用無以名之」指雖與眾同用，仍不被一個名目框定。\n【思想】「異而不怪」保留真實差異但拒絕故作驚世，與前文批判賢名表演相互呼應。'
  },
  'wenzi_ch-3_p-33': {
    translation: '老子說：合道的人先端正自己，等待天命時機。時機來到，不能預先迎取而迫使它折返；時機離去，也不能追趕攀援使它停留。所以聖人不向前強求，也不向後矯讓。隨順時機若久，時勢離去時我便跟著走；離開時勢若久，時勢也可能轉到我身後。無所謂刻意離開或趨就，只在自己的位置保持中正。天道沒有偏親，只幫助有德者。福分到來不是自己強求所得，所以不誇耀功勞；禍患到來若不是自己造成，也不後悔正當行為。內心恬靜，不使外物牽累德性；即使狗突然吠叫也不驚慌，因為確信自己的真情，確實沒有越出本分。所以通達道的人不迷惑，知道命限的人不憂愁。帝王死後，形骸埋藏在野外，祭祀時精神牌位卻奉於明堂，這表示精神比形體受到重視。因此精神主宰形體，形體便順從；形體欲望勝過精神，人便困窮。耳目聰明雖可使用，仍須返回由精神統攝，這叫大通。',
    analysis: '【主旨】本段由守時待命轉入形神關係：不搶時、不留時，禍福來時不矜不悔；感官與形體則由內在精神統攝。\n【關鍵詞義】「直己」是端正自身；「足而援」依文意為追趕攀援；「伐功」是誇功；「非分」是越出本分；「反諸神」是把感官能力交回精神統攝。\n【版本提示】「隨時三年」「去時三年」的數字與斷句突兀，可能有傳寫問題；現譯作長期隨時或離時，不據此宣稱確定年代含義。'
  }
};

const file = 'src/data/readingAid.ts';
let source = fs.readFileSync(file, 'utf8');
const entryPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let replaced = 0;
source = source.replace(entryPattern, (whole, id) => {
  const correction = corrections[id];
  if (!correction) return whole;
  replaced += 1;
  return `'${id}': {\n    translation: ${JSON.stringify(correction.translation)},\n    analysis: ${JSON.stringify(correction.analysis)}\n  }`;
});
if (replaced !== Object.keys(corrections).length) throw new Error(`Expected ${Object.keys(corrections).length}, replaced ${replaced}.`);
fs.writeFileSync(file, source, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate review: ${passageId}`);
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: ['https://ctext.org/wenzi/jiu-shou/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
