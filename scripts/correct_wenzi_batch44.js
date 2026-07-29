import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-2': {
    translation: '老子說：人承受天地變化而出生。古人認為：第一個月形成膏狀，第二個月形成血脈，第三個月開始搏動，第四個月成胎，第五月形成筋，第六月形成骨，第七月形體完成，第八月能動，第九月躁動，第十月出生。形骸既成，五臟隨之形成：肝主眼，腎主耳，脾主舌，肺主鼻，膽主口；外部是表，內部是裡。頭圓取法於天，腳方象徵大地。天有四時、五行、九解、三百六十日，人有四肢、五臟、九竅、三百六十骨節。天有風雨寒暑，人有取與喜怒；膽比作雲，肺比作氣，脾比作風，腎比作雨，肝比作雷。人與天地相類，而心是身體的主宰。耳目好比日月，血氣好比風雨。日月失去正常運行，便發生蝕而無光；風雨不合時，便毀物成災；五星失序，州國受到災殃。天地的運行如此廣大，尚且節制其光明、珍惜其神明；人的耳目怎能長久受刺激而不休息？精神怎能不斷向外奔馳而不疲乏？所以聖人守住內在，也不失去應對外界的能力。血氣是人體外發的榮華，五臟是人體內在的精華。血氣專注於內而不向外流散，胸腹便充實、嗜欲便減少；嗜欲少，耳目清明，聽視便敏銳通達，這叫作明。五臟都能統屬於心而不分離，意氣便強健，行為不偏邪；精神旺盛、氣不散失，聽則無所不聞，視則無所不見，做事容易成功，禍患無從侵入，哀傷之氣不能襲擊。所以求得太多的人，實際所得反少；只想看得廣大的人，真正所知反小。感官孔竅是精神出入的門窗，血氣是五臟的使者與候望。耳目若沉溺聲色，五臟便動搖不定，血氣奔蕩不止，精神向外馳騁不能自守；禍福即使大如山丘，也無法辨認。所以聖人愛護感官而不讓它越出節度。聖人若能使耳目精明深達而不受誘惑仰慕，意氣保持清靜、嗜欲減少，五臟便安寧，精神內守形骸而不外越；便能考察過往長遠的經驗、看見將來事情的內在徵兆，禍福之間沒有什麼難以察見。向外奔逐愈遠，真正知道的反而愈少，這正說精神不可沉溺外物。五色會使眼目混亂而不明，五音充耳會使聽覺不敏，五味過度會使口舌受傷，取捨欲望擾亂內心，便使行動浮躁。因此嗜欲使人的氣過度流蕩，好惡使人的精神疲勞；若不迅速去除，志氣便日漸耗損。人之所以不能享盡天年，是因為過度追求養生、厚養生命。只有不把刻意求生當作事業，反而可能得到長生。天地運行而彼此相通，萬物總合為一；能理解這個共同根本，便沒有一物不能由此理解；不能理解共同根本，便沒有一物能真正理解。我在天下也只是一物，外物同樣只是物；物與物之間，何必互相支配、物化？想求生不能靠強求辦到，憎惡死亡也不能推辭死亡；處卑不必憎恨，居貴不必歡喜。依照生命已有的條件使它安定，不敢走向極端；正因不走極端，才是最高的安樂。',
    analysis: '【主旨】本段由古代胚胎與臟腑宇宙類比，推到感官節制和養神：耳目不是要廢除，而是不能長期受刺激、使精神外馳；真正的「明」來自內守後的清楚感知。\n【思想史與醫療界線】逐月胎生、肝目腎耳及膽雲脾風等，屬古代氣化醫學與天人同構觀，不能當作現代胚胎學、解剖學或診療建議。解析保留其歷史意義，不為其科學正確性背書。\n【關鍵詞義】「九解」具體所指有異說；「燻」是長期刺激薰染；「使候」是使者與候望；「生生之厚」化用《道德經》，指過度厚養求生反傷生；「相物」可理解為彼此物化、支配。\n【版本提示】「三月而噠」「膽主口」「觀乎往世之外，來事之內」等處有異文與古義問題；白話分別按搏動、古代臟腑配屬、由往知來的文脈保守處理。'
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
if (replaced !== 1) throw new Error(`Expected 1 replacement, replaced ${replaced}.`);
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
console.log('Corrected 1 Wenzi long-form translation and analysis.');
