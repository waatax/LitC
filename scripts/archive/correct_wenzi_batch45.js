import fs from 'fs';

const corrections = {
  'wenzi_ch-6_p-5': {
    translation: '老子說：鼓不把聲音藏在裡面，所以受到敲擊便能發聲；鏡子不把形象埋沒，所以事物到來便能顯形。金石具有聲音，不敲動便不鳴；管簫具有音律，不吹奏便無聲。因此聖人把精神藏在內部，不搶先替外物倡導；事情來到才裁制，外物到來才回應。天道運行不止，終而復始，所以能夠長久；車輪反覆回到轉過的位置，所以能到遠方；天的運行守一不差，所以沒有過失。天氣下降，地氣上升，陰陽交通，萬物協同；君子得以任事，小人之勢消退，這是天地之道。天氣不降，地氣不上，陰陽不通，萬物不昌；小人得勢，君子退隱，五穀不能生長，道德藏而不顯。天道減損盈滿、增益不足；地道削低高處、填益低下；鬼神之道使驕溢者下降；人道也不再給予已經過多者；聖人之道則自處卑下，因而沒有人能居於他之上。天明、太陽也明，然後能照耀四方；君主明、臣下也明，國境之內才安定。上下四方都明，才能長久。所謂使施政明白，就是使教化明白。天道作為大經，地道形成條理，陰陽之氣使它和合，時令驅使它運行，從而生成萬物，這叫作道。大道平坦，離自身並不遙遠；把它修於自身，德才真實；修治萬物，德澤便不斷絕。天覆蓋萬物，施德養育，只給予而不取回，所以精神歸於天。給予而不取，是上德；正因如此，才真正有德。沒有比天更高，沒有比水澤更低；天高澤下，聖人取法於此，使尊卑有序，天下安定。地承載萬物並使它成長，給予後又收取，所以骨骸歸於地。給予而又取回，是下德；「下德緊守德的名目，所以反而無德。」大地承接天，所以安定；地安定，萬物才成形。大地廣厚，萬物才聚集；安定所以無物不載，廣厚所以無物不容。地勢深厚，水泉流入聚集；地道方廣，所以能長久。聖人效法它，使德量無所不容。陰氣難制陽氣時，萬物昌盛；陽氣完全壓服陰氣時，萬物沉滯。萬物昌盛，供給便足；供給足，萬物便安樂；安樂，秩序便容易治理。陰氣傷害萬物，陽氣退屈；陰進陽退，小人得勢，君子避害，古人認為天道如此。陽氣發動，萬物舒緩而各得其所，所以聖人順從陽道。順應事物，事物也順應他；違逆事物，事物也違逆他，因此不失去萬物情性。低窪水澤充盈，萬物按節令成長；水澤枯竭，萬物便失去按節養育的條件。所以雨澤不行，天下便荒蕪。陽氣上升又下降，因而主持萬物；不長久據有，所以能終而復始；能終而復始，便能長久；能長久，所以稱為天下之母。陽氣蓄積後才能施放，陰氣積聚後才能化育；從未有不先蓄積而能轉化的，所以聖人慎重自己所積累的事物。陽氣消解過盛陰氣，萬物肥盛；陰氣消滅陽氣，萬物衰敗。所以王公崇尚文本所說的陽道，萬物便昌；崇尚陰道，天下便亡。但陽不肯下降與陰交合，萬物也不能生成；君主不肯屈身向臣下求教，德化便不能施行。所以君主肯下問臣下便聰明，不肯下問便昏暗閉塞。太陽從地平線升起，萬物繁殖；公王居於人民之上，應用道德照明。太陽進入地平線，萬物休息；小人居於人民之上，萬物逃匿。雷發動，萬物開啟；雨潤澤，萬物舒解。大人的施行，也應像這樣。陰陽活動有固定節度，大人的行動也不把萬物逼到極端。雷震動大地，萬物舒展；狂風吹搖樹木，草木敗落。大人去惡就善，不使人民遠離遷徙；人民也有去就選擇，應使離去的傷害不過甚，使來歸的好處逐漸增加。沒有風的鼓動，火不會發出；大人不先發言，小人便無從附會傳述。火要燃起必須有柴，大人發言也必須有信用；既有信用又真實，到哪裡不能成功？河水雖深，其源土仍在山上；丘陵雖高，下部仍連接深處。陽氣盛極轉成陰，陰氣盛極轉成陽。所以欲望不可滿溢，歡樂不可走到極端。忿恨時不說惡言，憤怒時不顯惡色，這叫作計慮得當。火向上燃，水向下流；聖人的道路，也是按性質相類而各得其所。聖人依順陽和，天下便和同；若助長陰滯，天下便沉溺。',
    analysis: '【主旨】本段以鼓鏡、金石管簫開篇，說聖人不預先造勢而「物至則應」；其後借陰陽升降建構政治類比，核心包括謙下、納諫、節制、蓄積後施與及不把萬物逼至極端。\n【關鍵詞義】「不為物唱」是不搶先倡導；「四明」依上下文指君臣及上下皆明；「丈」疑通大經或有訛字；「偯」有依順、助長之意；「不極物」是不使事物走到極端。\n【思想史界線】天氣地氣、陰陽致治亂及日出日入配君子小人，屬古代氣化政治宇宙論，不是現代氣象、農學因果。可獨立成立的治理觀，是盈滿須損、君主須下問、資源須先積蓄、施政須有節。\n【版本提示】「鬼神之道，驕溢與下」「陰難陽」「去無甚，就少愈多」等句傳本語義不穩，白話依抑盈尚下、陰陽互動與減害增益的文脈保守處理。'
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
    sources: ['https://ctext.org/wenzi/zi-ran/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Corrected 1 Wenzi long-form translation and analysis.');
