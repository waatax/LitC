import fs from 'fs';

const corrections = {
  'wenzi_ch-1_p-9': {
    translation: '老子說：機巧算計之心藏在內部，純白的本性便不再純粹。古代質樸之民，衣服只求溫暖而沒有彩飾，兵器樸鈍而沒有利刃；走路安緩，眼神不刻意明察，掘井飲水，耕田而食。他們不以施與邀名，也不求別人感德；高低彼此不傾軋，長短彼此不比較。風俗整齊而人人可以順從，事情周全而能力所及，便容易辦理。至於矜誇虛偽來迷惑世人、行為坎坷怪異來惑亂眾人，聖人不把這種作風當作應遵循的風俗。',
    analysis: '【主旨】本段以衣食、兵器與日常勞作描寫少機心的質樸社會，反面批評用矜誇、偽飾和怪行博取注意。\n【關鍵詞義】「機械之心」不是現代機器，而是機巧算計之心；「蹎蹎」「瞑瞑」依語境指行步安緩、目光不妄察；「不求德」是不求別人報德；「相形」是比較而顯出高下。\n【版本提示】末句「軻行」及「風齊於俗可隨也」斷讀有疑；白話依不以怪行惑眾、風俗齊一可從的文脈處理，原文保留待校。'
  },
  'wenzi_ch-2_p-2': {
    translation: '老子說：上天設置日月，排列星辰，展開四季，調和陰陽。白日使萬物曝曬，夜晚使萬物休息；風使它乾燥，雨露使它滋潤。天生養萬物時，沒有人看見它如何養育，萬物卻自然成長；天使萬物凋亡時，也沒有人看見它如何損傷，萬物卻自然消逝，這叫作神明。因此聖人效法天道：造福時，人看不見福從何起而福已興起；除禍時，人看不見禍由何去而禍已消除。追查不到明顯痕跡，仔細考察卻確有實效；按一天計算似乎不足，按一年計算卻綽有餘。寂靜無聲，一句話卻能使天下大為感動，這是以天心推動教化。所以內在精誠表現出來，古人認為其氣能感動上天，於是景星出現、黃龍下降、鳳凰來集、甘泉湧出、嘉穀生長，河流不氾濫，海水不起巨浪；若違逆天道、殘害萬物，便出現日月蝕、五星失序、四季錯亂、晝暗夜明、山崩川竭、冬雷夏霜等災異。天與人有所相通，所以國家將衰亡時，天象改變；世道將混亂時，虹霓出現。萬物彼此連結，精氣互相激盪，因此神明教化不能靠智巧做成，也不能靠強力取得。大人與天地同德、與日月同明、與鬼神同靈、與四時同信；懷抱天心地氣，持守虛沖而含養和氣，不必走下廳堂，教化便能行於四海，改變風俗，使人民遷向善行，彷彿一切都由自身生發，這就是以精神感化。',
    analysis: '【主旨】本段以天地無形而長期的生化為政治典範：真正教化不靠炫目的短期操作或強制，而靠內在精誠累積成效。\n【關鍵詞義】「暴」讀作曝曬；「稽之不得，察之不虛」是找不到直接痕跡但效果不假；「景星、黃龍、鳳凰、醴泉、嘉穀」皆為古代祥瑞；「沖」是虛靜。\n【思想與史境】祥瑞災異反映古代天人感應觀，適合按思想史理解，不應宣稱為現代科學因果。段落核心對比是日計不足、歲計有餘的漸進教化與智巧強力。'
  },
  'wenzi_ch-2_p-5': {
    translation: '老子說：從前黃帝治理天下，調理日月運行，調和陰陽之氣，節制四季尺度，校正音律曆法；辨明男女之別與上下秩序，使強者不壓迫弱者，多數不欺凌少數。人民保全天年而不夭折，年歲豐熟而沒有饑荒；百官端正無私，上下和諧無怨；法令明白不昏暗，輔臣奉公不阿諛。耕田者互讓田界，道路上遺物無人拾取，市場不預先囤積牟利。因此日月星辰不失常軌，風雨合時，五穀豐盛，鳳凰飛翔於宮庭，麒麟遊於郊野。伏羲氏統治天下時，以方正為枕，以準繩為席；秋季節制殺伐，冬季約束收藏，背負方形大地，懷抱圓形天空。凡陰陽壅塞不通之處，便加以疏理；凡逆氣乖戾、傷害人民而積聚深厚之處，便加以制止。那時人民如童蒙，不辨東西；目光樸鈍，行步安緩，渾然自得，不知道所以如此。他們自在浮游，不追問根本，涵養其中也不知道將往何方。禽獸蟲蛇都收起爪牙，藏起螫毒；伏羲的功效與天地相合。到黃帝在始祖神廟前恭敬祭享，仍不彰顯功業、不宣揚名聲；隱藏真人之道，順從天地本然。為什麼呢？因為道德向上與天相通，機巧智詐便自然消失。',
    analysis: '【主旨】本段並舉黃帝的明制度與伏羲的無跡教化，理想共同點是抑強暴、安生命而不自彰功名。\n【關鍵詞義】「田者讓畔」是耕者互讓田界；「市不預賈」可理解為不預囤居奇；「員天」即圓天；「揆天地」是功效符合天地尺度。\n【版本提示】「枕方寢繩」「殺秋約冬」「要繆乎太祖之下」均有斷讀與異文疑問；白話依守方繩、順秋冬、在祖廟恭敬的傳統注解方向暫譯，不標作已定本。\n【史境】鳳凰、麒麟等是古代祥瑞敘事；其作用是象徵政治和諧，而非可驗證的歷史紀錄。'
  },
  'wenzi_ch-2_p-7': {
    translation: '老子說：精神向外浮越的人，言語華麗；德性蕩失的人，行為虛偽。最精純的精神在內昏亂，言語行動卻只供外界觀看，這樣終究免不了役使自身去迎合外物。人的精神有憂愁耗盡之時，外在追逐卻沒有窮極；內心所守不定，便向外沉溺於世俗風氣。因此聖人在內修養道術，而不在外表粉飾仁義；明白眼耳口鼻等九竅與四肢的適當運用，遨遊於精神和諧的境界，這才是聖人的遊心。',
    analysis: '【主旨】本段批評內在精神耗散、外在言行求觀的生活方式，主張仁義必須是內在修養的結果，而非公開表演。\n【關鍵詞義】「神越」是精神浮越外馳；「德蕩」是德性散失；「芒」依文意作昏昧紛亂；「外淫」是向外過度沉溺；「九竅四支」泛指感官與四肢。\n【版本提示】「精有愁盡」的字面與斷句不穩，白話依精神因外逐而憂耗的上下文處理。'
  },
  'wenzi_ch-2_p-8': {
    translation: '老子說：至於聖人的遨遊，是活動於極度虛靜之中，使心神遊於廣大的無形境界，馳騁於常規之外，行走於沒有固定門徑之處；聽無聲之聲，見無形之形，不受世情拘束，不被習俗繫縛。因此聖人用來感動天下的作為，真人並不刻意追求；賢人用來矯正世俗的措施，聖人也不執著觀看。人若拘泥世俗，形體必被牽繫，精神必然洩散，因而不能免於分別對待。能使我被拘束牽繫的，必是我把生命的依歸寄託在外物。',
    analysis: '【主旨】本段把自由的關鍵放在生命依歸：若將價值安置於名位、評價等外物，形神便受制；聖人則由虛靜中回應世界，不把矯世事功當作自我根基。\n【關鍵詞義】「方外」是既定常規之外；「無門」不是沒有方法，而是不固守單一路徑；「真人不過」可理解為真人不以感動天下為更高追求；「命有在外」是把生命價值寄託於外。\n【版本提示】「不免於別」可能有異文或特殊義，白話依受俗拘繫而陷入分別的脈絡暫譯。'
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
  const sourcePath = passageId.includes('ch-1') ? 'dao-yuan' : 'jing-cheng';
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: [`https://ctext.org/wenzi/${sourcePath}/zh`, 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
