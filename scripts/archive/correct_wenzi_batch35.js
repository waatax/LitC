import fs from 'fs';

const corrections = {
  'wenzi_ch-6_p-7': {
    translation: '老子說：山達到足夠高度，雲雨便從那裡興起；水達到足夠深度，蛟龍便在其中生長；君子把道修養到深厚境地，德澤便自然流布。暗中積德的人，終會有顯明的回應；行善不為人知的人，終會有昭著的名聲。種下黍子，不會收穫稷米；種下怨恨，也不會得到德惠回報。',
    analysis: '【主旨】本段以山高、水深、修道三組積累說德澤有其內在條件，再用播種譬喻強調行為與回應同類：種怨不能望德。\n【關鍵詞義】「致」是推至、累積到一定程度；「陰德」是不求知的暗中善行；「陽報」是顯明回應；黍與稷為不同穀物。\n【思想】「必有陽報、必有昭名」是古代倫理勸戒的確信語氣，不宜保證每項隱善都會得到可見、即時報償；核心是結果不會脫離所種之因。'
  },
  'wenzi_ch-7_p-1': {
    translation: '老子說：道可以表現為弱，也可以表現為強；可以柔，也可以剛；可以陰，也可以陽；可以幽暗，也可以明顯。它能包裹天地，也能以沒有固定方式回應萬事。只知道淺處，便不知道深處；只知道外部，便不知道內部；只知道粗略，便不知道精微。自以為知道，可能正是不知道；承認不知道，反而是開始知道。誰能明白「知道」可能是不知，而「不知」可能是真知呢？道不能成為固定可聞的聲音，一旦把聽到的當作道，便不是道；道不能成為固定可見的形象，一旦把看見的當作道，便不是道；道也不能被固定言辭完全說盡，一旦把說出的當作道，便不是道。誰能知道那使一切形體形成、自己卻不具固定形體的根源？所以說：「天下都知道美善之所以為美善，不善的分別便同時產生。」「真正知道的人不多言，多言自足的人並不知道。」',
    analysis: '【主旨】本段不是單純宣稱道不可知，而是批評把片面的淺、外、粗與可聞見言說當成全部；承認知識邊界，才有可能由表入裡。\n【關鍵詞義】「應待無方」是回應萬物沒有固定方式；「麤」同粗；「形之不形者」指形成有形者而自身無定形；末引《道德經》第二、五十六章。\n【思想辨析】「知者不言」不等於禁止解說，本段本身就在言道；它警告語言只是指向，不能與所指的完整實在混同。'
  },
  'wenzi_ch-7_p-2': {
    translation: '文子問：「人能夠談論幽微深奧的道理嗎？」',
    analysis: '【主旨】這句承接上段「道不可言」提出關鍵追問：既然道不能被固定言辭窮盡，人是否仍可用語言談論其幽微。\n【關鍵詞義】「微言」不是小聲說話，而是談論精微難見的義理，也可包含以簡約語言寄託深意。\n【篇章作用】本句只負責發問，答案應與後文合讀；不能自行補成「可以」或「不可以」的完整主張。'
  },
  'wenzi_ch-7_p-4': {
    translation: '文子問：「治理國家也有可以遵循的法則嗎？」',
    analysis: '【主旨】本問由前面的知言問題轉入政治實踐：道雖無固定形象，治國是否仍需可遵循的法則。\n【關鍵詞義】「為國」是治理國家；「法」在此可兼指準則、方法與制度，不宜先窄化為刑法條文。\n【篇章作用】這是引出後文治國回答的設問，本段自身沒有列出具體法則，解析須避免用通用道家套語替作者代答。'
  },
  'wenzi_ch-7_p-12': {
    translation: '老子說：行道的人敬慎細小隱微之處，行動不失禮度，經過多次檢驗仍反覆戒慎，禍患才不會滋長。計算福分不要估得太滿，考慮禍患寧可超過實際；同一天遭受相同情況，有遮蔽防護的人不受傷害，愚者若有準備，也能和智者取得同樣效果。長期積累愛護形成福祉，長期積累憎惡形成禍害。人們都知道禍患發生後要救治，卻少有人知道使它根本不發生。使禍患不生較容易，發生後再救治反而困難。如今人們不致力於使禍患不生，只忙著事後搶救，即使神人也無法替他周全謀畫。禍患的來源千變萬化，沒有固定方向。聖人深居簡出以避患，靜默等待時機；小人不知道禍福從何進入，妄動而陷入刑罰，即使曲折地多方防備，也不足以保全自身。因此上士先避禍而後求利，先遠離恥辱而後求名。聖人總在事情尚未顯形時著手，不把心力只留給已經形成的後果；所以禍患無從到來，毀譽也不能像塵垢般污染他。',
    analysis: '【主旨】本段完整提出預防原則：敬小微、低估福、高估禍、先備、事前介入；預防比事後救援容易，避患優先於逐利求名。\n【關鍵詞義】「百射重戒」疑指多次檢驗仍重加戒備；「蔽」是遮蔽防護；「禍福之門」是風險進入點；「無形之外」指事情尚未成形階段。\n【版本提示】「同日被相」「不足以金身」疑有訛字，後者依語意作保全身體；白話不據此擅改原文。\n【思想】深居靜默是避免無謂暴露的一種方法，段落更普遍的核心是風險前置管理，而非要求所有人退隱。'
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
  const sourcePath = passageId.includes('ch-6') ? 'zi-ran' : 'xia-de';
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
