import fs from 'fs';

const corrections = {
  'wenzi_ch-2_p-17': {
    translation: '老子說：勇士一聲呼喊，三軍都退避，是因那聲音出於真誠勇氣。若有人領唱卻無人應和，心意發出卻不能承載於行動，內心必有不相契合之處。不離席位便能匡正天下的人，是向自己身上尋求根本。因此言語不能傳達的，容貌神色可以傳達；容貌神色仍不能到達的，心靈感應可以到達。感受由內心發動而形成外在表現；精誠到了極處，可以由形貌彼此感通，卻不能按預定時刻勉強求得。',
    analysis: '【主旨】本段延續〈精誠〉之論：有力的號令並不只靠聲量，而在內心、神色、言行是否一致；感化首先是自我修治的結果。\n【關鍵詞義】「辟」是退避；「唱而不和」指有人倡導卻無人響應；「求諸己」是從自身找原因；「照期」依文意指按期、預定而強求。\n【章法與思想】先以勇士一呼作正面例，再用無人應和說內外不合，接著依「言語—容貌—感忽」排列感通層次。末句提醒精誠可感而不可偽造或用行政期限催成。'
  },
  'wenzi_ch-2_p-20': {
    translation: '老子說：人能不妄加作為，事情便得到治理；刻意強為，反會有所損傷。所謂以無為而治，是實踐不妄為；一味造作的人不能真正無為，而不能無為的人，也不能成就合宜的作為。人不靠多言而能呈現神妙作用；一旦執著言說，反會損傷它。傳本文句「無言乏神者，載無言」語義不穩，大意仍在說：若只把「無言」當成外在姿態，反而會損傷原本由內在精神產生的不言之化。',
    analysis: '【主旨】本段辨析「無為」與「有為」、「無言」與「神化」：無為不是消極不做，無言也不是刻意閉口；一旦把它們模仿成外在姿態，就又落入造作。\n【版本提示】末句「無言乏神者，載無言」在現有資料中句讀與字義不穩，白話只交代可由上下文確定的思想方向，保留後續版本校勘。\n【章法與思想】前半以看似悖論的反覆語法釐清無為能成事，後半用同一結構談無言之教。核心在自然真實，不在機械遵守「什麼都不做、什麼都不說」。'
  },
  'wenzi_ch-3_p-3': {
    translation: '老子說：所謂聖人，是隨順時勢而安於自己的位置，面對當世而樂於所從事的工作。過度哀樂會使德偏斜，好惡會成為心的牽累，喜怒會使人偏離道。因此他的生如同天道運行，死如同萬物變化；靜時與陰同德，動時與陽同波。心是形體的主宰，精神是心的珍寶；形體勞作不休便會困頓，精氣使用不止便會枯竭，所以聖人遵守分寸，不敢逾越。以空無應接萬有，必能推究事理；以虛心接受實情，必能窮盡條理。恬淡愉悅、虛靜自守，直到生命終結；不偏向一方，也不私親一物，懷抱德、涵養和氣，以順應自然。與道相接，與德相鄰，不主動成為福的開端，也不搶先成為禍的起因；死生都不能改變自身的持守，所以稱為「至神」。精神達到這種境界，有所求不必依待外物，有所作為也沒有不能成就的。',
    analysis: '【主旨】本段把養神、節制形體耗用與不被哀樂好惡牽引，視為應物而不失本心的條件。\n【關鍵詞義】「物化」指隨萬物規律而變化；「蹶」是困頓、衰敗；「以虛受實」是保持不預設的心來接納實情。原文「無所鉕」含罕見或訛誤字，白話依其與「無所親」對舉，暫譯為不偏向一方。\n【章法與思想】先說聖人安時處世，再分析形、心、神的主從和耗竭，繼而提出虛靜應物，最後落到死生不改。所謂「神」不是超自然能力，而是精神不被外境奪走後的高度應變能力。'
  },
  'wenzi_ch-3_p-4': {
    translation: '老子說：把天下看輕，精神便沒有牽累；把萬物看作細小，內心便不迷惑；把生死等同看待，意志便不恐懼；與變化同其流行，明智便不眩亂。至人倚靠不會彎曲的支柱，行走沒有阻關的道路，取用不會枯竭的府庫，師法不會死亡的老師；無論前往何處都能如願，無論到達哪裡都能通行。屈伸俯仰之間，守住生命本分而隨勢轉化，禍福與利害不足以擾亂內心。奉行義的人，可以用仁來勸勉，不能用武力脅迫；可以用義來匡正，不能用利益引誘。君子可以為義而死，不能用富貴挽留；行義的人連死亡都不能使他恐懼，何況體會無為的人呢？無為便沒有牽累；無所牽累的人，不把天下當作束縛。向上考察至人的倫類，深入推求道德的意旨；向下考察世俗行為，才知道什麼值得羞恥。至於不把天下當作私有目的的人，足以成為學道者的明顯標誌。',
    analysis: '【主旨】本段從輕外物、齊死生推到守義與無為：真正不受利害控制的人，才能保持原則並自由應變。\n【關鍵詞義】「迫以仁」指以仁道勸進，不是強迫；「懸以利」是拿利益作誘餌；傳文「影柱」「建鼓」語義可疑，白話依上下文分別作束縛與顯著標誌理解，仍待異本核定。\n【章法與思想】開頭四句排比解除天下、萬物、生死、變化的心理壓力；中段由至人轉入行義者不受兵利威誘；末段再提高到無為者不以天下為目的。它把自由理解為不被外在賞罰挾持，而非任意而行。'
  },
  'wenzi_ch-3_p-7': {
    translation: '老子說：人從天接受氣。耳目對聲色，鼻口對香臭，肌膚對寒溫，基本感受本來相同；然而有人因此死亡，有人因此生存，有人成為君子，有人成為小人，是因節制和處理感受的方式不同。精神是智慧的深淵，精神清明，智慧才明澈；智慧是心的府庫，智慧公正，內心才平正。人不會用流動混濁的積水照自己，卻會用澄清的水作鏡子，因為它清而且靜。因此精神清明、意念平正，才能顯現事物的真實情狀；要善於運用心智，必須借助暫時不用、保持虛靜的工夫。鏡子明亮，塵垢便不能污染其照見；精神清明，嗜欲便不能使它判斷錯誤。心念集中到哪裡，精神便完整地在那裡；使它返回虛靜，躁動便消散、欲念便止息，這就是聖人的精神活動。所以治理天下的人，必須先通達生命與本性的實情。',
    analysis: '【主旨】本段說感官條件相近，人格與生死結果卻因是否節制、能否保持精神清靜而異；清靜是準確認識事物的認知條件。\n【關鍵詞義】「流潦」是流動或淺積的濁水；「形物之情」是使事物實情清楚呈現；「假於不用」意謂有效使用心智以前，須有停止耗用、回復虛靜的時刻。\n【章法與思想】由共同感官談個體差異，再建立神、智、心的層次，以濁水和澄水作鏡子的譬喻，最後由治心推到治天下。這段不是否定感官，而是要求觀察者先減少欲望造成的偏差。'
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
      passageId.startsWith('wenzi_ch-2') ? 'https://ctext.org/wenzi/jing-cheng/zh' : 'https://ctext.org/wenzi/jiu-shou/zh',
      'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf',
      'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'
    ],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
