import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-18': {
    translation: '老子說：時機運行時，行動應當隨順；不明白道的人，反會把福轉成禍。天像車蓋，地像車廂，善於運用道的人終究不會困乏；地像車廂，天像車蓋，善於運用道的人終究不受傷害。若把五行分別排列、強使它們競勝，必然會有一方壓倒另一方；但在天所覆蓋的整體中，萬物無不各得其宜。所以說：「知道自己有所不知，是高明；不知道卻自以為知道，是弊病。」',
    analysis: '【主旨】本段把順時、整體包容與自知之明相連：固執局部競勝會把福轉禍，承認知識邊界才是善用道。\n【關鍵詞義】「軫」本為車後橫木，也可代指車廂；天蓋地軫構成宇宙如車的譬喻；「五行必有勝」指把五行置於相勝競逐；末句引《道德經》七十一章。\n【版本提示】首句「時之行動以從」及天、地、蓋、軫重出，傳本斷句明顯不穩；現譯依隨時、天地包覆與知不知三層文意保守串解，不標作確定原貌。'
  },
  'wenzi_ch-3_p-19': {
    translation: '老子說：山中生金，山反因採金而被剝鑿；石中生玉，石也因取玉而受破壞。樹木生蟲，蟲回頭蛀食樹木；人生出事端，事情又反過來傷害自身。喜歡多事的人未必不一時得中，爭利的人卻終究走向困窮；善於游泳的人可能溺水，善於騎馬的人可能墜馬，各人都可能因所擅長、所愛好之事反遭禍患。獲得在於時機，不在爭奪；治理在於合道，不在迷信聖者個人。土地居下而不與人爭高，所以安穩而不危險；水向下流而不爭速度，所以前行並不遲滯。「因此聖人不執著，所以沒有失落；不妄為，所以沒有失敗。」',
    analysis: '【主旨】本段用金玉傷山、蟲食其木、善游者溺等反轉，警告人會被自己的產物、專長與爭求反噬；關鍵是順時合道而不執。\n【關鍵詞義】「反相剝」指金玉反使山石遭剝鑿；「好事」是喜歡生事、多事；「未嘗不中」承認可能偶中，卻不代表方法可靠；「治在道不在聖」是制度原則重於個人崇拜。\n【思想】善游、善騎不是錯，風險在因熟練而逞能失度；原文反對把優勢變成執著。'
  },
  'wenzi_ch-3_p-20': {
    translation: '老子說：掌握一項原則，可以使資用不窮；掌握兩項，可以成為天下宗主；掌握三項，可以在諸侯中稱雄；掌握四項，可以天下無雙。保持貞正誠信，資用便不窮；遵循道德，便可成為天下宗主；推舉賢者、尊崇有德者，便能在諸侯中稱雄；憎惡少數邪惡而愛護廣大人民，便能天下無雙。',
    analysis: '【主旨】本段用「一言、二言、三言、四言」設問式列出四項政治綱領：貞信、道德、舉賢德、愛眾，效力逐層擴大。\n【關鍵詞義】「言」在此是可奉行的一項原則；「宗」是天下所尊奉者；「舉賢德」可讀作推舉賢者、崇尚德行；「惡少愛眾」是抑制少數惡人而愛護多數人民。\n【版本提示】第二句高度省略，且「舉賢德」斷讀可異；白話依後半逐項解釋前半數目句。'
  },
  'wenzi_ch-3_p-21': {
    translation: '老子說：人有三種死亡，不是自然壽命終了。飲食沒有節制，輕忽糟蹋自己的身體，各種疾病便共同害死他；貪求獲得沒有止境，嗜好追逐不肯停止，各種刑罰便共同害死他；以少數冒犯多數，以弱小欺凌強大，各種兵禍便共同害死他。',
    analysis: '【主旨】本段把非正常死亡分成疾病、刑罰、戰爭三類，分別追溯到失養、多欲犯法與不自量力的侵凌。\n【關鍵詞義】「非命」指未盡自然天年；「簡賤其身」是輕忽、不珍惜身體；「樂得無已」是以取得為樂而不停止；「兵共殺之」指招致軍事禍害。\n【思想】它不是說疾病與受刑都必由個人造成，而是古代勸戒文用因果分類強調節制；不宜轉化為對病患或受害者的責難。'
  },
  'wenzi_ch-3_p-22': {
    translation: '老子說：給予豐厚的人，得到的回報也美好；結下的怨恨愈大，招致的禍患也愈深。施予很少卻期待厚報，積蓄怨恨卻希望沒有禍患，從來沒有這種事。考察一個人如何對待外界、送出什麼，便能知道將有什麼回到他身上。',
    analysis: '【主旨】本段以施與回報、積怨與禍患兩組因果，要求期待與投入相稱，並從既往行為預判後果。\n【關鍵詞義】「施厚」不限財物，也包括恩德與待人；「畜怨」通「蓄怨」，是長期累積怨恨；「所以往／所以來」是由己而出與反歸於己。\n【思想】這是倫理與政治上的互惠、反作用判斷，不宜理解成任何善行都必然得到等量即時報償。'
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
