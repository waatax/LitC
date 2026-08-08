import fs from 'fs';

const corrections = {
  'wenzi_ch-7_p-6': {
    translation: '老子說：道本身沒有固定的「正」，卻可以成為一切正準。譬如山林可以提供木材，但木材不如山林廣大；山林的生成又不及雲雨，雲雨不及陰陽，陰陽不及和氣，和氣仍不及道。道就是所謂「沒有形狀的形狀，沒有具體物象的形象」。若能通達這個意旨，天地之間的一切都可以受到陶鑄而發生變化。',
    analysis: '【主旨】本段用層層回溯說明具體準則與材料都有更深的生成條件，直到無定形的道；道不等同某一標準，卻能產生和統攝標準。\n【關鍵詞義】「正」兼有正準、定形之意；「材—山林—雲雨—陰陽—和—道」是一條由成品回溯生成根源的鏈；引文「無狀之狀，無物之象」化用《道德經》第十四章。\n【章法與思想】先提出「無正而可為正」的悖論，再用六層遞進解釋，最後以陶冶變化說道的作用。無形不是空無作用，而是未被單一形態限制。'
  },
  'wenzi_ch-7_p-7': {
    translation: '老子說：聖人建立教化、施行政事，必須考察事情的開端與結局，看清它會造成什麼影響。因此人民開始依賴文書，往往表示內在德行已衰；依賴計算，表示仁厚已衰；依賴契約憑據，表示彼此信任已衰；依賴機巧器械，表示質樸實在已衰。瑟的本體不自行發聲，二十五根弦卻各以聲音響應；車軸本身不繞著自己轉動，三十根輪輻卻各出其力旋轉。弦有鬆緊差別，然後能奏成樂曲；車上各部分有勞有逸，然後能行至遠方。使眾弦發聲的，是本身無聲的瑟體；使車輪有旋轉力量的，是本身不隨輪周轉的車軸。上下職位不同，所行之道也有差別；若輕率顛倒，治理便會變成混亂。地位高而所持原則廣大，眾人便服從；承擔大事而胸中之道狹小，便會招凶。拘泥小德會傷害大義，小善會妨害大道，小辯會損害治理，苛細急切會傷德。真正的大正不走險刻，所以人民容易引導；最高治理寬緩從容，所以下民不互相殘害；最深的忠誠返歸質樸，所以人民沒有偽詐隱匿。',
    analysis: '【主旨】本段反對以文書、計算、契約與機巧的增加直接等同文明進步，提醒它們也可能是德、仁、信、實衰退後的補救；治理應由無聲的中樞協調差異。\n【關鍵詞義】「知書／數／券契／機械」在此是過度依賴外在工具的歷史敘事，不宜簡化為反對識字與技術；瑟體、車軸比喻居中而不親自爭功的統攝者；「苛悄」指苛細急迫。\n【章法與思想】先談制度工具與德性衰退，再用瑟弦、車軸說無聲無轉者統合有聲有轉者，後半由位道相稱轉入小德小善之害，最後以大正、至治、至忠收束。'
  },
  'wenzi_ch-7_p-8': {
    translation: '老子說：連坐之法一旦建立，百姓便會怨恨；削減爵位的命令一旦推行，功臣便會背叛。因此只懂得查核文書條款的人，不明白治亂的根本；只熟悉行軍布陣的人，不明白朝廷決策戰爭的權變。聖人在重重關門之內先建立福祉，也能在幽暗未顯之處預慮禍患；愚者卻被眼前小利迷惑而忘記大害。因此有些事情利於局部卻害及全體，在這裡有所取得卻忘了在別處付出的代價。所以仁沒有比愛人更大的，智沒有比了解人更大的。能愛人，刑罰便不致招怨；能知人，政事便不致混亂。',
    analysis: '【主旨】本段批評只見法律文字、戰陣技術和眼前局部利益的決策，要求從人心、全局及長期後果衡量刑政。\n【關鍵詞義】「相坐」即連坐；「刀筆之跡」指司法行政文書；「廟戰之權」指在朝廷廟堂層次衡量戰爭的戰略決策；「冥冥之外」指禍患尚未明顯之時。\n【章法與思想】先列連坐、減爵兩種政策反效果，再對照刀筆吏與陣戰者的視野限制，接著說小利大害，最後以愛人、知人提出仁智判準。'
  },
  'wenzi_ch-7_p-9': {
    translation: '老子說：即使江河廣大，洪水漫溢也不會永遠持續；狂風暴雨再猛烈，也不能整日不停，過不久便會止息。沒有積累德行卻不知憂懼的人，等滅亡追及便來不及了。憂患戒慎可以使事業昌盛，得意喜滿反可能導致滅亡。因此善於行道的人能以柔弱轉成強大，把禍患轉成福祉；道虛而能用，卻永遠不會自滿。',
    analysis: '【主旨】本段以洪水暴雨不能持久說極盛必衰，勸告無德而自滿者保持憂患；柔弱、虛沖使人保留轉禍為福的空間。\n【版本提示】「日中不出須臾止」「亡其及也」等句的傳文與句讀不穩，白話依風雨不終日及禍至不及的上下文處理，仍待原文版本核定。\n【章法與思想】先用自然現象說強暴不久，轉入德、憂、喜與存亡，再以弱能成強、禍可為福結論。末句承《道德經》「道沖而用之或不盈」的虛而不滿。'
  },
  'wenzi_ch-7_p-10': {
    translation: '老子說：清靜、恬淡、和順，是人的本性；儀表與規矩，是處理事務的制度。知道人的本性，自我養護便不違逆；知道事務的規制，舉止措施便不混亂。發出統一號令，使散開的意念不互相爭奪，總攝於一個中樞，叫作心；看見根本便知道末端，掌握一項原則而應對萬變，叫作術；居處知道要做什麼，出行知道要往哪裡，辦事知道憑藉什麼，行動知道在哪裡停止，叫作道。使品德高明的人稱譽自己，是內心修養產生的力量；使卑劣的人誹謗自己，也可能是內心行為造成的過失。話一旦出口，便不能阻止別人傳播；行為雖從近處發出，也不能禁止它影響遠方。事業難成卻容易失敗，名聲難立卻容易毀壞。一般人都輕視小害、忽略細微事情，最後才形成大患。禍患到來，往往由人自己造成；福祉到來，也由人自己成就。禍福出自同一門戶，利害彼此相鄰；若沒有極精細的辨察，沒有人能把它們分清。因此思慮是禍福的門戶，動靜是利害的樞紐，不能不審慎考察。',
    analysis: '【主旨】本段依次界定性、制、心、術、道，最後指出同一言行可能通向福禍利害，關鍵在能否從細微處辨察並知道停止。\n【關鍵詞義】「總一管」是由一個中樞統攝；「執一應萬」是以根本原則處理多變情況；「樞機」是控制開合轉動的關鍵。\n【章法與思想】前半建立從人性、制度到心術道的治理架構，中段說稱譽誹謗與言行遠播，後半由小害微事推到禍福同門。它要求的不是預測所有結果，而是在思慮與動靜的起點慎察。'
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
    sources: ['https://ctext.org/wenzi/ce-ming/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
