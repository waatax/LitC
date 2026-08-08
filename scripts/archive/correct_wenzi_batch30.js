import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-23': {
    translation: '老子說：探究天命，治理心術，調理好惡，使情性安適，治道便通達了。探究天命，就不被禍福迷惑；治理心術，就不任意喜怒；調理好惡，就不貪求無用之物；使情性安適，欲望便不超過節度。不被禍福迷惑，動靜便能順宜；不任意喜怒，賞罰便不偏私；不貪無用之物，就不會以欲望傷害本性；欲望不過節，便能知足養生。這四件事都不必向外尋求，也不必借助別人，只要反求自己便能得到。',
    analysis: '【主旨】本段用四組連鎖推論把修身接到治理：知命使動靜順，治心使賞罰公，理好惡使欲不害性，適情性使養生知足。\n【關鍵詞義】「原天命」是推究生命與時勢的限度；「心術」是內心運作方法；「阿」是偏袒；「假於人」是借助外人。\n【章法】首句提出四項，第二層說心理效果，第三層說行動與治理效果，末句總結皆由反己取得，結構嚴密而非泛論清靜。'
  },
  'wenzi_ch-3_p-24': {
    translation: '老子說：不要故意做足以受人非議的行為，也不要憎恨別人批評自己；只管修養足以受稱譽的德行，不必要求別人稱譽自己。不能使災禍一定不來，便承認自己的智慧有限；不能使福祉一定來臨，便確信自己不應爭奪強求。若禍患到來不是自己造成的，即使困厄也不憂懼；若福運來臨不是自己成就的，即使通達也不自誇。因此能閒居而內心自樂，不妄作而自然有治。',
    analysis: '【主旨】本段區分責任與不可控結果：修德避非屬於自己，禍福是否到來未必可控；因此困時不過度自責，通時也不把幸運據為己功。\n【關鍵詞義】「可非之行」是可受非議的行為；「信己之不智」是承認智力不能控制一切；「不讓」依文意指不爭、不強求；「通」與「窮」相對，指處境順達。\n【思想】這不是逃避責任，因首句仍要求修德；它反對的是把所有外在禍福都誤認為個人可完全控制。'
  },
  'wenzi_ch-3_p-25': {
    translation: '老子說：合道的人守住所已有的根本，不一味追求尚未擁有的東西。只追逐未得之物，原有的也可能喪失；修養已有的根本，所希望的反會到來。局勢尚未穩固到不會混亂，就急著以多事求治，必有危險；行為尚不能免於過失，就急著求名，必受挫折。所以最大的福是不遭禍，最大的利是不喪失。因此說：「事物有時想增加它，反而造成減損；想減損它，反而有所增加。」道不能用來鼓勵人趨逐利益，卻可以安定精神、避免傷害；寧可常保無禍，不必追逐奇福；寧可常保無罪，不必追逐顯功。道幽遠昏微，順從天道的威儀，與天同氣而不先存思慮，不預設積蓄；來者不刻意迎取，去者不追送挽留。人事雖向東西南北變動，自身仍獨立守住中央。因此身處眾多彎曲之中，不失自己的正直；與天下一同流行而不離自身界域。不刻意標榜善，也不刻意躲避惡名；遵循天道，不搶先發端，不專任己意；循守天理，不預先算計，也不錯失時機，與天時相約。不強求獲得，也不推辭自然來到的福，遵從天道法則。內無意外的奇福，外無突來的奇禍，禍福便不以反常方式產生，又哪會有人為傷害？所以最高的德，使言論趨於共同準則，使行事共享福祉，上下一心，不生歧路旁見；使邪惡退隱，使向善道路開通，人民便有正確方向。',
    analysis: '【主旨】本段以「守已有」反對追逐未得，以無禍無喪優先於奇福顯功；政治上則不預謀操控、不失時機，使上下共享穩定方向。\n【關鍵詞義】「剉」是受挫；「無設儲」是不預設安排、蓄謀；「獨立中央」是守住自身中正；「奇福／奇禍」指反常、意外的福禍；「人賊」是人為傷害。\n【版本提示】末段「至德言同賂」「退章於邪」疑有訛字，現譯依言同準則、邪退善開的上下文保守處理，不能據此視為定本。'
  },
  'wenzi_ch-3_p-26': {
    translation: '老子說：公開做善事，往往引來勸勉與期待；看見不善而只作旁觀，又會招致禍患。受到勸勉便產生責求，停在觀望便滋生問題。因此道不適合拿來進取求名，卻可用來退守修身。聖人不靠行為求名，不靠知見求譽；治理順隨事物自然，自己不居功參與。刻意作為有時不能成功，強求有時不能得到；人的能力有窮盡，道的運行卻無不通達。有智慧而不妄用，能與看似無智者同樣成事；有能力而不多事，能與看似無能者同樣合德。有智如同無智，有能如同無能，道理通行時，個人才名便消退。個人與道不能同時炫耀顯明：人若愛名，便不再用道；道居主導，個人名聲便止息；道若止息而個人名聲彰顯，便有危亡。',
    analysis: '【主旨】本段區分能力與能力表演：智者能者不必藉善行、知見邀名；當制度與道理真正通行，個人英雄形象反而退居幕後。\n【關鍵詞義】「勸」兼有受人推許、期待之意；「己無所與」是不把功效據為己有；「人才滅」不是消滅人才，而是個人才名不壓過公共道理；「章」通彰。\n【版本提示】開頭「為善即勸，為不善即觀」語義可有不同解釋，白話依後文生責、生患及反求名脈絡處理。'
  },
  'wenzi_ch-3_p-27': {
    translation: '老子說：讓誠信之士分配財物，不如先確定份額，再用抽籤決定；為什麼呢？即使有意保持公平，也不如沒有個人意向介入的辦法。讓廉潔之士看守財物，不如關閉門戶、完整加封；因為仍有欲望的人勉力守廉，不如從制度上使欲望沒有可乘之機。別人指出人的缺點，他會怨恨；鏡子照見他的醜貌，他卻只會自己調整而不怨鏡子。人若能像鏡子一樣接應外物，而不把私我意見加在其中，便可免除牽累。',
    analysis: '【主旨】本段以抽籤、封存和鏡子三例說明：去除裁量與誘惑的制度，往往比依賴個人誠信廉潔更公平，也更少招怨。\n【關鍵詞義】「定分而探籌」是先定份額再抽籤；「全封」是封識完整、防止接觸；「有心／無心」對比私人意向與中性程序；「接物而不與己」是如鏡映物，不摻入自我。\n【思想】本段並非否定信士廉士，而是指出好品德仍可能受偏見與誘惑影響，因而需要低裁量、可驗證的制度設計。'
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
