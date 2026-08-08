import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-4_p-11': {
    translation: '關尹子說：魂配屬於木。樹木在冬季歸根，得水滋養；到夏季開花，又與火相應。因此，人的魂在夜間藏於精，在白晝顯於神。魂與精相合時，所見偏於個人的獨特經驗，因為精的作用本來不以他人為對象；魂與神相合時，眾人可以共同見到相同的事物，因為神的作用本來不固守一己。',
    analysis: '本段延續魂木、精水、神火的配屬，以樹木冬藏夏榮比擬人的夜藏晝顯。「所見我獨」指夢或內在經驗具有私人性；「所見人同」指清醒時的公共知覺可由眾人共同確認。無人、無我不是否認他人或自己存在，而是分別說精不以外在對象為必要、神不封閉於私我。',
  },
  'wenshi-zhenjing_ch-4_p-12': {
    translation: '關尹子說：若知道此身如夢中之身，會隨情識而呈現，便可使神超越形體拘束，以此為我而遊於清虛之境；若知道外物如夢中之物，也隨情識而呈現，便可凝聚精氣形成所用之物，周行四方。這套方法，守住精與神，可以求得長久生存；連精與神也能忘卻，才是超越對生命的執著。吸納氣息以養精，取金生水之象；吸納風氣以養神，取木生火之象，這是借外在條件延養精神。漱津養精，使精不易枯竭；摩擦溫養以養神，使神不易衰竭，這是運用身內條件延養精神。至於忘卻精神而超越生死，我在前文已說過了。',
    analysis: '本段區分兩個層次：養精養神以「久生」，以及連精神也不執著而「超生」。前半以夢喻身物依情識顯現，「飛神」「凝精」是道教修煉語彙；後半列呼吸、漱津、摩火等養生法。「漱水」在注本中多從口中津液理解，「摩火」則指身內溫養一類工夫。這些是歷史性的內養術語，不應替代現代醫療或被解讀為已證實的延壽方法。',
  },
  'wenshi-zhenjing_ch-4_p-13': {
    translation: '關尹子說：蜣螂推轉糞丸，丸做成後又專一用心於它；其中便出現白色而蠕動的幼蟲，不久破殼變化。蜣螂本身若毫不用心，那白色幼蟲又從哪裡來呢？',
    analysis: '本段以蜣螂護持糞丸、幼蟲在其中生長，說明專一精神似能參與生命生成，重點仍是「精思感化」的感應論。「而蟬」在古注中被解為變化飛去，但蜣螂幼體實際會發育為蜣螂，不會變成蟬；經文反映古人的動物觀察與物類認知，不能當作現代昆蟲學。譯文保留原旨，同時不把錯誤生物分類合理化。',
  },
  'wenshi-zhenjing_ch-4_p-14': {
    translation: '關尹子說：廚師煮蟹羹時，有一隻蟹腳遺落在桌案上；螃蟹已經下鍋煮了，那隻遺腳卻還在動。由此看來，所謂生死，只是一氣的聚合與離散罷了；本體並沒有固定的生與死，人卻憑主觀計度，硬把它分別為生死。',
    analysis: '蟹足離體仍動，被用來反駁把生命等同於完整形體的直覺，並引出生死為氣之聚散。古人由現象所得的生理說明未必準確，但哲學論證的落點很清楚：生死是對變化過程所加的名稱，不是永恆自立的兩個實體。「橫計」即妄自計度、強作分別。',
  },
  'wenshi-zhenjing_ch-4_p-15': {
    translation: '關尹子說：勤於實踐禮的人，精神不會向外奔馳，因此能收聚神；勤於運用智慧的人，精氣不會向外散移，因此能攝持精。仁屬陽而光明，可以使魂輕清上達；義屬陰而幽沉，可以約束、駕馭魄。',
    analysis: '本段把儒家禮、智、仁、義納入精、神、魂、魄與陰陽五行的架構：禮收神，智攝精，仁輕魂，義御魄。它不是泛稱「清靜無為」，而是在說倫理實踐同時也是身心整合工夫。「輕魂」指使魂趨於輕清，「御魄」指節制形質欲望。',
  },
  'wenshi-zhenjing_ch-4_p-16': {
    translation: '關尹子說：有人站著死，有人坐著死，有人躺著死；有人死於疾病，也有人死於藥物。既然同樣都是死，就沒有哪一種高、哪一種低的差別。真正明白道的人，不把「生」看成固定自立的實體，所以也不把「死」看成固定自立的實體。',
    analysis: '「無甲乙之殊」是說死亡姿態或原因沒有等級先後，不能據坐化、立亡等奇特形式判定修為高低。「不見生，故不見死」不是否認現實中的死亡事件，而是否定生死各有固定自性的執著。此段也間接反對以死亡異相神化人物。',
  },
  'wenshi-zhenjing_ch-4_p-17': {
    translation: '關尹子說：人若厭惡生死，或一心想要超越生死，這些念頭本身都是大患。譬如已臻變化之境的人，若仍存著厭棄生死、追求超脫的心，那只能叫作怪異邪術，不能叫作道。',
    analysis: '此段的鋒芒在於：連「超脫生死」也可能成為執著。厭生死與求超生死表面相反，實際都預設生死是必須排斥的對象，因而仍被分別心支配。「化人」可指通曉變化、具有異能者；若以異能追逐超生，文本判為「妖」而非「道」。',
  },
  'wenshi-zhenjing_ch-4_p-18': {
    translation: '關尹子說：談論生死的人，有的說死後仍然有，有的說死後全然無；有的說亦有亦無，有的說非有非無；有的認為死亡值得慶幸，有的認為應當恐懼，有的主張順其自然，有的主張設法超越。這些說法愈加變換人的知識與情感，使心念奔逐不止。他們不知道，對真我來說，所謂生死就像馬長著人手、牛生出翅膀，本來不是實有，卻也不必另外執著一個「絕對沒有」。譬如不受水火拘限者，即使接觸水火，也不能被燒毀或淹沒。',
    analysis: '本段列舉死後有、無、亦有亦無、非有非無四句，以及幸、懼、任、超四種態度，指出概念愈繁，識情反而奔馳。「如馬之手，如牛之翼」意謂把生死加在真我上，正如把不相干的肢體加在馬牛上；「本無有，復無無」又防止把空理解成另一種斷滅。末句的水火不侵是宗教哲學中的超越性譬喻，不宜宣稱為現實肉身能力。',
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
  'https://ctext.org/wenshi-zhenjing/si-fu/zh',
  'https://ctext.org/wiki.pl?chapter=507367&if=zh',
  'https://zh.wikisource.org/wiki/文始真經註/4',
  'https://zh.wikisource.org/zh-hant/文始真經言外經旨/文始真經言外經旨卷之四',
  'https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1316445.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 4 passages 11-18.');
