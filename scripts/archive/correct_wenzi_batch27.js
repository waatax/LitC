import fs from 'fs';

const corrections = {
  'wenzi_ch-2_p-19': {
    translation: '老子說：聖人辦事，所走的道路雖然不同，歸宿卻一致；無論救亡、安定危局，都用同一顆心對待，志向始終不忘利益人民。所以秦、楚、燕、魏的歌唱，傳唱方式不同，卻同樣表達歡樂；九夷八狄的哭泣，聲音不同，卻同樣表達悲哀。歌聲是歡樂的顯露，哭聲是悲哀的表現；感情蘊藏在內心，聲音發露於外，所以關鍵在於內心受到什麼感動。聖人的心日夜不忘利益人民，他的恩澤因此能達到很遠。',
    analysis: '【主旨】本段以各地歌哭聲調雖異、哀樂之情相同，說明聖人措施可以因地異路，但利民的內在動機與歸宿一致。\n【關鍵詞義】「定傾」是扶正將傾的危局；「異傳」指歌聲傳唱方式不同；「樂之微」是內在歡樂的外在顯露；「愔於中」指情感深藏於內。\n【版本提示】「存亡定傾若一」可有不同斷讀，白話依救亡扶傾而心志如一解讀。'
  },
  'wenzi_ch-3_p-1': {
    translation: '老子說：天地尚未形成時，幽深昏冥，渾然一體，寂靜清澄。後來重濁之氣成為地，精微之氣成為天；分離而形成四季，分化而成陰陽。精純之氣成為人，粗濁之氣成為蟲類；剛柔彼此成就，萬物於是產生。精神本於天，骨骸根於地；精神進入它所來的門徑，骨骸返回它的根源，作為形體的我還有什麼可以留存？所以聖人效法天、順從地，不被世俗拘束，不受他人誘惑；把天視為父，把地視為母，以陰陽作綱領，以四時作秩序。天因靜而清，地因安定而寧；萬物違逆這些規律便死亡，順從便生存。因此寂靜淡漠是精神明澈的居所，虛無是道所居之處。精神是從天接受的，骨骸是從地稟得的。正如《道德經》所說：「道生一，一生二，二生三，三生萬物。萬物背陰而抱陽，以沖和之氣達成和諧。」',
    analysis: '【主旨】本段先敘宇宙由混一到陰陽萬物，再以精神歸天、骨骸歸地說生命有限，導出法天順地與虛靜養神。\n【關鍵詞義】「窈窈冥冥」是幽深未分；「精氣／粗氣」是古代氣化宇宙論的分類；「入其門、反其根」指死後各返來源；「沖氣」是陰陽交會的和氣。\n【思想史提示】精氣成人、粗氣成蟲是古代宇宙生成論，不是現代生物學命題；本段重點是以同源氣化建立順時、虛靜的生命觀。'
  },
  'wenzi_ch-3_p-5': {
    translation: '老子說：尊貴權勢與厚重財利，是人們所貪求的；但和生命相比，便顯得低賤。所以聖人飲食只求填補飢虛、接續氣力，衣服只求遮蔽身體、抵禦寒冷；順適性情便辭去多餘，不貪求所得，不大量積蓄。使眼睛清靜而不妄看，使耳朵安靜而不妄聽，閉口不妄言，放下心中思慮；捨棄機巧聰明，返回原初純樸，休養精神，去除智巧成見，沒有偏執的好惡，這叫大通。要除去污穢牽累，沒有比從來不離開根本更好的；根本不失，做什麼不能成功？懂得保養生命和諧的人，不能用利益引誘；通曉內外相合的人，不能用權勢誘惑。無所不包、外面再沒有外面，是最大；生命內在不可再分的根本，是最可貴。能明白這種最大、最可貴的道理，到哪裡不能順遂？',
    analysis: '【主旨】本段用生命與勢利比較價值：衣食只取足用，感官不妄逐，精神才不受利勢懸誘；真正的「大貴」是生命內在完整。\n【關鍵詞義】「適情辭餘」是情性已適便辭多餘；「委心」是放下、安頓心思；「知故」指機巧成見；「內外之符」是內在生命與外在行動相合。\n【版本提示】「莫若未始出其宗」「無內之內」語義玄遠且斷讀可異，白話採不離根本、內在至貴的保守解釋。'
  },
  'wenzi_ch-3_p-6': {
    translation: '老子說：古代修道的人，調理情性，治理心術，以和氣涵養，以適度保持；以道為樂便忘記身分卑賤，安於德性便忘記物質貧乏。天性不想要的，不會因得不到便強求；內心不以為樂的，不會為了外物勉強去做。對本性無益的事，不讓它牽累德性；對生命不便的事，不讓它擾亂和諧。不放縱身體、恣肆意欲，卻能自然合乎節度，足以成為天下表率。按照腹量進食，按照身體需要製衣，以能容身為居所，順適情性而行動；即使天下有餘也不占為己有，把萬物交還萬物而不從中牟利，怎會因貧富貴賤而喪失性命本真？長久保持如此，才可說真正體會道。',
    analysis: '【主旨】本段提出「適度」養生：食、衣、居皆以身體實需為準，不以貧富貴賤改變本性，也不把克制理解成強迫壓抑。\n【關鍵詞義】「無欲而不得」指本性無所欲，不因不得而求；「滑和」是擾亂和氣；「制度」在此偏向合乎節度；「餘天下而不有」是天下資物有餘也不據有。\n【思想】安貧不是美化匱乏，而是指出外在地位不應支配生命尺度；「量腹而食、制形而衣」仍承認基本生活需要。'
  },
  'wenzi_ch-3_p-10': {
    translation: '老子說：最高明的聖人效法天道，其次推崇賢者，最下等只把政事委任給臣下。單純任臣，是走向危亡的道路；只知崇尚賢能，也可能成為迷惑的根源；效法天道，才是治理天地萬事的方法。虛靜最為根本：虛，所以沒有不能容受的事物；靜，所以沒有不能持守的事物。明白虛靜之道，才能貫徹始終。因此聖人以安靜為治理，以妄動為混亂。所以說：不要攪擾，不要纏繫，萬物將自行澄清；不要驚動，不要恐嚇，萬物將自行調理。這就叫天道。',
    analysis: '【主旨】本段警告治理不能只依賴個別臣才或造勢尚賢，而要建立如天道般虛靜、包容、少擾的基本秩序，使萬物自清自治。\n【關鍵詞義】「任臣」在此指君主失去根本、完全委政於臣；「尚賢」之弊在迷信個人而非否定任用賢者；「撓」是攪擾；「纓」本指繫縛，引申為纏擾。\n【思想辨析】「以動為亂」針對統治者擾民妄作，不能擴張成所有行動皆錯；本章所說虛靜是治理原則，不是行政停擺。'
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
  const sourcePath = passageId.includes('ch-2') ? 'jing-cheng' : 'jiu-shou';
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: [`https://ctext.org/wenzi/${sourcePath}/zh`, 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
