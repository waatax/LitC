import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-29': {
    translation: '老子說：聖人不讓自己的本心受到壓制，眾人卻不能克服欲望；君子運行正氣，小人運行邪氣。內在使本性安適，外在符合義理，循著道理而行動，不受外物束縛，這就是正氣；一味追逐美味，沉溺聲色，隨喜怒發作而不顧後患，這就是邪氣。邪與正互相傷害，欲望與本性互相妨害，兩者不能同時成立：一方興起，另一方便衰廢，所以聖人捨棄過度欲望而順從本性。眼睛喜愛美色，耳朵喜愛聲音，鼻子喜愛香氣，嘴巴喜愛滋味；把這些合在一起而產生快感，又總牽涉利害，便形成嗜欲。其實耳目鼻口本身不知道要追求什麼，都是心在支配它們；若心使各種感官各得適當位置，由此也就可以明白，欲望並非不可克服。',
    analysis: '【主旨】本段把欲望問題的主導權放在心：感官只是接受聲色香味，是否沉溺以及能否節制，取決於心如何組織、評價這些感受。\n【關鍵詞義】「不勝其心」依正邪、性欲的對舉，指不使本心受壓倒；「推於滋味」是向滋味追逐擴張；「各得其所」是各種感官活動各有適當限度。\n【章法與思想】先列聖人、眾人和正邪之別，再界定正氣、邪氣，最後拆解嗜欲的形成。結句「欲不可勝」按上下文應理解為「說欲望不能克服」的觀點不成立，而非主張欲望必然無敵。'
  },
  'wenzi_ch-3_p-34': {
    translation: '老子說：古代善於保存自身的人，以德為樂，因而忘記地位卑賤，所以名聲不能動搖志向；以道為樂，因而忘記生活貧困，所以利益不能動搖內心。因此他們謙下而能喜樂，安靜而能恬淡。用只有短短可數年限的人生去憂愁天下的混亂，就像擔心河水乾涸，想靠自己的眼淚替它增水一樣。所以不徒然憂愁天下之亂，轉而以修治自身為樂的人，才可以和他談論道。',
    analysis: '【主旨】本段不是鼓勵對亂世冷漠，而是批評個人把無限天下之憂全壓在有限生命上；實際起點應是先使自身不受名利擾亂。\n【關鍵詞義】「存己」是保全、安頓自身；「數筭之壽」指年數有限、可以計算的生命；「泣而益之」以眼淚補河水，比喻力量與目標極不相稱。\n【章法與思想】先以樂德、樂道對治賤與貧，再用補河的誇張譬喻說明空憂無益，最後落到「身治」。重點是把憂世轉化為可實踐的修身，不是取消公共責任。'
  },
  'wenzi_ch-3_p-36': {
    translation: '老子說：言語是用來使自己與別人相通的，聽聞是用來了解他人的。傳文本段開頭「通人於所」「既聞其聾」等字句不穩，但下文大意是：人的溝通若閉塞，便會患上如同聽覺失靈的毛病，不能明白事理如何通達。難道只有形體才會昏暗耳聾嗎？心也同樣可能如此。內心閉塞，不知道通達的方向，就是精神上的昏聾。道作為萬物的根宗，一切有形之物都由它而生，它作為親本可說極其親近；凡食穀物、受氣而生者都靠它保全壽命，它作為君主可說極有恩惠；各種有智慧的人都向它學習，它作為老師可說極其明達。人常拿無用之事妨害真正有用之事，所以知識不能廣博，時間也一天比一天不足。如果能把用來博弈消遣的日子拿來問道，見聞便能加深。肯問與不肯問的差別，就像耳聰目明的人與昏聾者的差別。',
    analysis: '【主旨】本段把不肯學問、內心閉塞比作精神上的昏聾，並批評以博弈消遣侵占求知時間。\n【版本提示】首數句「聞者所以通人於所」「既聞其聾」疑有訛脫或句讀問題；白話明示疑點，只依後文「心亦有闇聾」的主線翻譯，不把不穩文字硬解成定論。\n【章法與思想】由言、聞的溝通功能轉入形骸與心靈的聾暗，再依親、君、師三種關係說道的生養教化作用，最後以博弈和問道作時間選擇的對比。'
  },
  'wenzi_ch-3_p-37': {
    translation: '老子說：依人的常情，內心會服從德行，而不會真正服從強力；能否得到人心，在於自身有沒有德。因此聖人想被別人看重，先看重別人；想受別人尊敬，先尊敬別人；想勝過別人，先戰勝自己；想使自己居於人下，便先謙卑自處。所以貴賤尊卑，都應由道來節制。古代聖王言辭謙下於人，身分位置退居人後，天下人便樂意推戴而不厭倦，擁戴他也不覺得負擔沉重；這是因為他的德厚有餘、氣順不逆。因此懂得給予就是取得、居後反能在先，便接近於道了。',
    analysis: '【主旨】本段主張尊貴與領導力不能靠強迫取得，而要由先尊重他人、先克服自己、先居下退後而形成。\n【版本提示】「德在與不在來」語序與用字不穩，白話依前後「服德不服力」及「先貴於人」解作人心來不來取決於德在不在，仍保留原文校勘工作。\n【章法與思想】先立服德不服力的原則，再用四組「欲……先……」說反求諸己，最後以聖王謙下而獲推戴作證，收束於《道德經》式的「後之為先」。'
  },
  'wenzi_ch-3_p-39': {
    translation: '老子說：小人做事只說「只要能得到就好」，君子則說「只要合乎義就好」。行善的人，本來不是為求名聲，名聲卻隨之而來；名聲原本沒有和利益約定，利益也可能歸向他。表面上同樣有所追求，最後達到的境地卻不同。因此一項行動看似有益時，損害也可能隨在後面。說話沒有永遠固定的「是」、行動也不考慮隨時制宜，這是小人的層次；能明察一件事、精通一項能力，是中等之人；能普遍包容各方，又能依人的技能才具加以任用，才是聖人的層次。',
    analysis: '【主旨】本段以「苟得／苟義」區分行動動機，並由單項能力推到能包容、任用眾才的治理智慧。\n【關鍵詞義】「苟得」是只求取得而不問方式；「苟義」是首先要求合義；「言無常是，行無常宜」不是反對彈性，而是批評既沒有穩定原則，又不能因時合宜；「兼覆」是普遍覆育包容。\n【章法與思想】先比較小人、君子的目的，再說名利可能是行善的非預期結果，接著提醒利中有害，最後排列小人、中人、聖人三個認知與用人層次。'
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
    sources: [
      'https://ctext.org/wenzi/jiu-shou/zh',
      'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf',
      'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'
    ],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
