import fs from 'fs';

const corrections = {
  'yi-jing_ch-33_p-1': {
    translation: '遯卦：適時退避，可以亨通；在小處守正有利。\n《大象傳》說：天下有山，山勢雖高卻終與天相距，是遯卦的形象；君子由此疏遠品行不正的人，不以憎惡相加，卻保持莊重界限。',
    analysis: '遯是退避，不是怯懦逃責，而是陰勢漸長時保存正道。「小利貞」有兩種主要斷法：一是小事利於守正，一是小人漸長仍須守正；均不支持大舉進取。《大象》「遠小人，不惡而嚴」尤其細緻：遠離不等於仇恨，嚴正也不必羞辱對方。原白話「不哪裡而嚴」是機械錯譯，已改為不施憎惡而界限分明。',
  },
  'yi-jing_ch-34_p-1': {
    translation: '大壯卦：陽剛盛壯，適宜守正。\n《大象傳》說：雷震在天空之上，是大壯卦的形象；君子由此，凡不合禮義之事便不加踐行。',
    analysis: '四陽盛長形成大壯，但卦辭不直接許以亨吉，只說「利貞」，表明力量必須受正道約束。雷在天上聲勢壯大，《大象》卻落在「非禮弗履」：越有能力，越不可越界。「禮」在古代包含制度名分，現代可取尊重他人、程序與界限；不能把特定時代的一切禮制原封不動當成永恆規則。',
  },
  'yi-jing_ch-35_p-1': {
    translation: '晉卦：進升。安邦的諸侯獲賜許多馬匹，一天之內多次受到君王接見。\n《大象傳》說：太陽升出地面，是晉卦的形象；君子由此使自己本有的光明德性更加昭著。',
    analysis: '晉是前進、升進。「康侯」是能安定邦國的諸侯，「錫」通賜，「蕃庶」指眾多；「晝日三接」的三可表多次，顯示功臣頻受接見。這是西周封賞政治的語境，不宜把受賞等同道德真理。《大象》把外在升進轉回「自昭明德」：真正的晉不只職位上升，也須自己彰明德行；昭明不是宣傳包裝，而是使行為可見可驗。',
  },
  'yi-jing_ch-36_p-1': {
    translation: '明夷卦：光明受到傷害，在艱難中守正才有利。\n《大象傳》說：光明沉入地中，是明夷卦的形象；君子由此治理眾人，外表適度含晦而內心保持明察。',
    analysis: '夷有傷害義，明夷即明德受傷、光明被遮。卦辭「利艱貞」不是稱讚受苦，而是說困難時尤其要守正。《大象》「用晦而明」常被誤成故意愚民；其注疏脈絡較接近治理眾人時不以過度明察苛責細故，外寬而內明。含晦是保全與包容的策略，不能成為隱瞞公共資訊、逃避問責的藉口。',
  },
  'yi-jing_ch-37_p-1': {
    translation: '家人卦：依古代家庭分工，家中女子守正有利。\n《大象傳》說：風從火中生出、由近而遠，是家人卦的形象；君子由此說話有實在內容，行為有持久準則。',
    analysis: '家人討論家庭秩序。「利女貞」反映古代內外分工及以女性為家庭內位主體的觀念，不能直接轉成現代女性應被限定於家內；可保留的原則是所有成員各守責任、關係正當。風由火出，影響自內及外，《大象》因此不列家規細目，而要求「言有物、行有恆」：話有事實內容，行為前後一致，家庭信任才可能向外擴展。',
  },
  'yi-jing_ch-38_p-1': {
    translation: '睽卦：彼此乖離，在小事上行動仍可吉祥。\n《大象傳》說：火向上炎、澤水向下潤，方向相背，是睽卦的形象；君子由此在共同基礎中仍保有正當差異。',
    analysis: '睽是背離、意見不合。離火上炎、兌澤下潤，性向不同；此時不宜強辦大事，故只有「小事吉」。《大象》「同而異」不是各行其是：君子與人共享基本秩序，卻不因求同而取消原則與個性。它提供處理分歧的雙重要求——先承認共同點，再容納差異；若沒有共同基礎，異可能成為解體，若消滅差異，同又成為壓制。',
  },
  'yi-jing_ch-39_p-1': {
    translation: '蹇卦：行路艱難，往西南平易之地有利，往東北險阻之地不利；適宜求見有德有位的大人，守正則吉。\n《大象傳》說：山上又有水險，是蹇卦的形象；君子由此回過頭反省自身，修養德行。',
    analysis: '蹇是跛行、困難。西南在後天卦位多配坤地、平易，東北配艮山、險阻；方位也可引申為就平避險、求助於眾。「利見大人」說困局需要可靠領導或公正協助，不能只靠硬闖。山水重險，《大象》卻先「反身修德」，不是把所有災難歸咎個人，而是在外界難控時檢查自己仍可改進的判斷與能力。',
  },
  'yi-jing_ch-40_p-1': {
    translation: '解卦：解除險難，往西南平易之地有利。若已沒有必須前往處理的事，返回安定便吉祥；若仍有事情必須處理，及早前往便吉祥。\n《大象傳》說：雷雨興作，鬱結得到舒解，是解卦的形象；君子由此赦免無心的過失，寬減可以寬宥的罪責。',
    analysis: '解是解開、解除。危機解除後有兩條路：無事則「來復」，及時回歸常態；有事則「夙吉」，早辦不留後患。「利西南」延續蹇卦就平易、順眾之義。雷雨釋放積鬱，《大象》轉為「赦過宥罪」；過與罪有所區分，宥是寬減。這表達危機後恢復秩序所需的寬政，不等於取消法律、免除所有故意傷害的責任。',
  },
};

const aidFile = 'src/data/readingAid.ts';
let aid = fs.readFileSync(aidFile, 'utf8');
const pattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let changed = 0;
aid = aid.replace(pattern, (whole, id) => {
  const item = corrections[id];
  if (!item) return whole;
  changed += 1;
  return `'${id}': {\n    translation: ${JSON.stringify(item.translation)},\n    analysis: ${JSON.stringify(item.analysis)}\n  }`;
});
if (changed !== 8) throw new Error(`Expected 8 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/book-of-changes/zh',
  'https://zh.wikisource.org/wiki/周易正義',
  'https://zh.wikisource.org/wiki/周易/大象',
  'https://moodle3.ntnu.edu.tw/pluginfile.php/1419601/mod_resource/content/1/周易正義.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Yijing hexagrams 33-40.');
