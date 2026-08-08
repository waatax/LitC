import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-6_p-1': {
    translation: '關尹子說：世人因為我的思想不同於別人的思想、別人的思想也不同於我的思想，便據此區分人與我；卻不知道夢中人物同樣各有看似不同的思想，那麼其中哪個是我、哪個是別人？世人又因我的疼痛不同於別人的疼痛而區分人我；夢中人物也各有自己的疼痛，又該怎樣分辨？指甲和頭髮不會痛，手腳也不會思考，卻都屬於我的身體，怎能只憑思考或疼痛來劃分我與非我？世人把一人獨見稱作夢、眾人同見稱作清醒，卻不知道依本篇的精、神理論，白天也可能有一人獨見異象，夜裡也可能有兩人自稱同夢；兩種經驗都由精神作用形成，哪個一定是夢、哪個一定是醒？世人又把短暫所見叫夢、長久所見叫醒；但兩者在本篇看來都由陰陽之氣形成，又怎能只憑久暫判定夢醒？',
    analysis: '全文用思、痛、獨見同見、暫見久見四組標準，逐層質疑人我與夢覺界線。爪髮、手足例指出「屬於我」不等於每一部分都能思能痛。獨見異象與同夢屬古代精神氣化論，不能證明共享夢境或超自然感應；哲學重點是公共性與持續時間雖是實用判準，仍不足以建立絕對不變的自我與真實本體。',
  },
  'wenshi-zhenjing_ch-6_p-2': {
    translation: '關尹子說：喜好仁的人常夢見松柏桃李等木類，喜好義的人常夢見兵器金鐵，喜好禮的人常夢見簠、簋、籩、豆等禮器，喜好智的人常夢見江湖川澤，喜好信的人常夢見山岳原野；依五行配屬，人的偏好會牽動相應夢象。然而夢中聽見或想到某事，夢境也會隨即改變，所以不能用五行把夢拘死。聖人以心駕馭外物，又以本性收攝其心，心便與造化同其變化，更不受五行分類限制。',
    analysis: '仁木、義金、禮火、智水、信土構成五常—五行—夢象配屬；簠簋籩豆都是古代祭祀宴饗禮器。文本先陳述類型規律，隨即用夢隨聞思而變修正決定論，最後說聖人也不可拘。這是傳統象數心理學，不是經現代睡眠研究證實的固定夢境預測。',
  },
  'wenshi-zhenjing_ch-6_p-3': {
    translation: '關尹子說：你若看見蛇頭人身、牛臂魚鱗，或鬼形而有鳥翼的形象，不必驚怪。這些怪形還不如夢境奇異，夢境的奇異又不如清醒世界本身更不可思議。人竟有耳有眼、有手有臂，這才是更大的奇事。最宏大的言語也說不盡，最高的智慧也想不透。',
    analysis: '本段以反轉陌生與日常製造哲學震撼：混合怪物之所以怪，只因不合習見；若追問形體何以如此生成，日常人體同樣不可思議。「夢怪不及覺」不是說清醒世界荒誕，而是提醒熟悉感遮蔽了存在本身的奧祕。末句承認語言與思辨對造化的限度。',
  },
  'wenshi-zhenjing_ch-6_p-4': {
    translation: '關尹子說：有人問我：「你是哪一族、姓什麼？名什麼、字什麼？吃什麼、穿什麼？與誰為友、誰作僕從？彈什麼琴、讀什麼書？認同古代還是現今？」我當時默然，一個字也不回答。那人追問不止，我不得已才說：「我連一個固定的自我尚且看不見，又哪裡有什麼可以固定說成『我所有』呢？」',
    analysis: '提問者用宗族、姓名、衣食、人際、雅好與古今立場層層建立身份；回答卻從「我」的根基整體撤除。末句「尚自不見我，將何為我所」區分我與我所：若主體不可執為固定實體，附屬於它的標籤與財物更不能定義真我。默然本身也是對分類盤問的回答。',
  },
  'wenshi-zhenjing_ch-6_p-5': {
    translation: '關尹子說：形體可以分化、可以合成，也可以延續、可以隱沒。一對夫婦可以生兩個孩子，是形的分化；夫婦二人的條件共同生成一個孩子，是形的合成。古人認為服食巨勝可以延年，是形的延續；沒有月光與燈火的夜裡，別人看不見我，是形的隱沒。一氣生成萬物，如同剪下的毛髮仍可由新髮替代，這叫分形；一氣會合萬物，如同破裂的嘴唇可以癒合，這叫合形。以神維持氣、以氣維持形，叫延形；使形歸於神、神歸於無，叫隱形。你只是想知道這些道理，還是真想實踐呢？',
    analysis: '分、合、延、隱先以生育、更新、癒合、黑暗不可見作日常例證，再提升為氣—神—無的修煉架構。「巨勝」通常指胡麻，服食延壽是古代本草養生觀，缺乏足以支持長壽功效的現代證據；「隱形」在前例首先只是不可見，後文則指形體執著歸於無，不宜宣稱能物理隱身。末問要求知行之別。',
  },
  'wenshi-zhenjing_ch-6_p-6': {
    translation: '關尹子說：凡物都可成為所見，所以沒有一物完全在我的見之外；凡物都可成為所聞，所以沒有一物完全在我的聞之外。各類物質可以滋養形體，因此我的形體由萬物供養而成；五味可以滋養氣，因此我的氣也由萬物供養而成。所以，我的形與氣並不隔絕於天地萬物。',
    analysis: '前半由見聞說認知場域，後半由食物與五味說身體構成，結論是形氣與天地萬物相通。「無一物非吾之形氣」不是把外物據為私有，而是消解封閉身體觀：所見、所聞、所食都參與自我形成。五物、五味屬傳統五行飲食分類，宜作古代身體觀理解。',
  },
  'wenshi-zhenjing_ch-6_p-7': {
    translation: '關尹子說：農夫長久與牛相習，性情便較強悍；獵人熟習虎的活動，便顯得勇猛；漁人熟習水性，便善於潛沉；戰士熟習騎馬，便身手矯健——可見萬物都能參與塑造我。反過來，一個人的身體裡可生蟯蟲、蛔蟲，體表可滋生蝨蚤；古人又把腹中積塊想像成龜魚，把瘻病想像成鼠蟻——可見我的身體也能成為眾多生命與形象的所在。',
    analysis: '前四例說環境與技能會塑造人的性情體能，故「萬物可為我」；後半由寄生蟲與疾病想像反說「我可為萬物」。蟯蛔、蝨蚤是真實寄生生物，但把癥瘕、瘻病直接說成龜魚鼠蟻，反映古代病因想像，並非現代病理學。此段可用來理解身體不是單一封閉實體，不能用於自行診斷。',
  },
  'wenshi-zhenjing_ch-6_p-8': {
    translation: '關尹子說：人所執著的那個「我」，好比說灰燼中藏著金，卻不像礦石或沙中確實有金。破開礦石可以取得金，淘洗金沙也可以取得金；若只是不斷揚弄灰燼，終其一生也找不到金。',
    analysis: '礦、沙中有可提煉的金，灰中卻未必有金，三者對比批判在形相與念頭殘餘中搜尋固定自我。若「我」只是概念假設，再精細分析五官、形氣與情識，也不會挖出獨立不變的實體。這不是否定人的經驗存在，而是否定把經驗背後想像成一塊可提取的永恆金核。',
  },
  'wenshi-zhenjing_ch-6_p-9': {
    translation: '關尹子說：一隻蜜蜂雖然極其微小，也能在廣大天地間飛遊觀看；一隻小蝦雖然極其微小，也能在大海中自在活動。',
    analysis: '蜂與蝦分別處於天空、海洋，個體雖小，所活動的世界卻廣。段旨在破除以形體尺度估量生命境界：有限身形不妨礙它參與廣大天地。「放肆」在此偏向舒展自在，不是現代語義中的任意妄為。',
  },
  'wenshi-zhenjing_ch-6_p-10': {
    translation: '關尹子說：泥偶塑成之後，可以分成尊貴或卑賤、男子或女子；但它外在材質是土，內裡所含也仍是土，難道那些名分真使它成了不同本質的人嗎？',
    analysis: '泥土被塑形、命名後便出現貴賤男女，然而內外材質未改。土偶喻顯示身份差別多由形制與名稱建立，不能倒推為本質差異。末句「人哉」帶反問意味：若只見標籤而忘共同根基，便把造作形相誤認成真實人我。',
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
if (changed !== 10) throw new Error(`Expected 10 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/liu-bi/zh',
  'https://www.shidianguji.com/zh/book/HY3361/chapter/1lmsgt2ctsdgz',
  'https://www.sdsdjxh.com/djxy/jwdj/823.html',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 6 passages 1-10.');
