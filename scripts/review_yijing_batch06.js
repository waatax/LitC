import fs from 'fs';

const corrections = {
  'yi-jing_ch-41_p-1': {
    translation: '損卦：有所減損而內有誠信，便大吉、沒有災咎，可以守正，也適宜有所前往。要用什麼來表達誠意？即使只有兩簋薄祭，也足以用來祭享。\n《大象傳》說：山下有澤，澤氣減損以增益山，是損卦的形象；君子由此抑止忿怒、堵塞過度欲望。',
    analysis: '損不是一概越少越好，而是為恢復平衡而減其有餘。「有孚」先要求真誠，才有元吉、可貞與利往。「曷之用」問祭享用什麼；簋是盛黍稷的器皿，二簋屬薄禮，說誠意勝過鋪張。《大象》的「懲」是制止、警戒，「窒」是堵塞；所節制的是失控的忿欲，不是否定一切情緒與合理需要。',
  },
  'yi-jing_ch-42_p-1': {
    translation: '益卦：有所增益，適宜有所前往，也適宜渡過大河般的艱險。\n《大象傳》說：風與雷相互增益聲勢，是益卦的形象；君子由此看見善行便轉而學習，發現過錯便立即改正。',
    analysis: '益與損相反，但增加也須指向公共與正當目的。卦辭兩言「利」，表明資源與人心獲益後應付諸行動、承擔大事。《大象》把外在增益內化為人格更新：「遷善」不是只讚美別人，而是把所見之善移到自己身上；「改過」則承認增長包含刪除錯誤。風雷相助的速度感，也提醒見善改過不宜拖延。',
  },
  'yi-jing_ch-43_p-1': {
    translation: '夬卦：決斷去除阻礙。應在王庭公開宣告，以誠信呼告眾人仍有危險；先從自己的城邑發布告示，不宜立即訴諸武力，適宜依正道前進。\n《大象傳》說：澤水高上於天，蓄極必決，是夬卦的形象；君子由此把祿澤施給下民，若把德惠囤積在自己手中便是禁忌。',
    analysis: '夬是決斷、決去，一陰居五陽之上，象徵須公開排除積患。「揚於王庭、孚號有厲、告自邑」形成程序：公開說明、誠信示警、先告自身所屬；「不利即戎」明確反對立刻動武。決斷不等於暴力清算。《大象》以澤滿必下施，說「施祿及下」；「居德」是把恩德停蓄不施，越有資源越須向下分享。',
  },
  'yi-jing_ch-44_p-1': {
    translation: '姤卦：意外相遇。依古代婚姻占辭，女子勢力過強，不宜娶她為妻。\n《大象傳》說：天下有風，風行無所不遇，是姤卦的形象；君主由此發布政令，告諭四方。',
    analysis: '姤是相遇，卦中一陰初生而遇五陽，傳統以「女壯」警告微小力量迅速增長。「勿用取女」反映男性婚娶視角與陰陽性別化的古代結構，不能用來貶抑有能力的女性或評判現代婚姻；可取的抽象義是面對突然出現、發展迅速的關係須審慎。風行天下使命令遍及四方，《大象》重資訊發布與可達性。',
  },
  'yi-jing_ch-45_p-1': {
    translation: '萃卦：聚集而亨通。君王到達宗廟舉行祭祀，適宜求見有德有位的大人，因而亨通，也適宜守正；使用隆重祭牲則吉，適宜有所前往。\n《大象傳》說：澤水聚在地上，是萃卦的形象；君子由此整備防衛器具，戒備意外變故。',
    analysis: '萃是會聚。人群聚集需要共同中心，卦辭以王至宗廟、見大人與祭祀表現古代政治宗教的凝聚方式；「假」讀格、至，「有廟」即宗廟。聚眾也會放大風險，所以《大象》說「除戎器，戒不虞」；除在此多解修治、整備，不是撤除武器。現代可取為大型集會與組織須兼顧共同目的、正當領導及安全預案，不等於鼓吹軍備。',
  },
  'yi-jing_ch-46_p-1': {
    translation: '升卦：向上生長，大為亨通；宜去求見有德有位的大人，不必憂慮。向南前進吉祥。\n《大象傳》說：樹木從地中萌生，是升卦的形象；君子由此順著德性逐步修養，積累微小成果而達到高大。',
    analysis: '升是由下向上，坤地之中巽木生長，過程自然且漸進。「用見大人」是藉助正當引導，「南征」在傳統方位象徵向明而行；不宜化成任何現代地理行程必吉。《大象》「積小以高大」是本卦核心：高大不是突然躍升，而由每一步小的德行累積。順德也不是被動順從權勢，而是依事物生長次序不躁進。',
  },
  'yi-jing_ch-47_p-1': {
    translation: '困卦：身處困窮仍可使內在之道亨通；守正的德高之人吉祥，沒有災咎。但此時即使有所言說，也往往不被相信。\n《大象傳》說：澤中沒有水，是困卦的形象；君子由此在重大考驗中不惜承擔生命風險，以完成正當志向。',
    analysis: '困是窮困、受圍。外境不亨而經文仍稱亨，重點在大人能守貞、不被困境改變；「有言不信」提示處困時多辯無益，須以行動建立可信度。「致命遂志」在古義是把生命交付於義、完成志向，反映強烈的殉道倫理；現代不可把它浪漫化為自傷或要求他人犧牲，應理解為在安全可行範圍內承擔代價、守住原則。',
  },
  'yi-jing_ch-48_p-1': {
    translation: '井卦：城邑可以遷改，水井及其公共功能卻不改變；井水不因取用而真正減少，也不因不用而增加，來往的人都可汲井而用。幾乎已汲到井口，卻還沒有把井繩完全提上來，反而碰破水瓶，便是凶險。\n《大象傳》說：木器汲水而水在木上，是井卦的形象；君子由此慰勞人民，勸勉大家互相協助。',
    analysis: '井是穩定的公共資源。「改邑不改井、無喪無得」說政治聚落可變，基本供養之道長存；「往來井井」指眾人往來汲用。末句文字古奧：「汔」是幾乎，「繘」是汲井繩或以繩汲取，「羸其瓶」多解敗壞、碰破汲瓶；功敗垂成不是水井無用，而是工具與最後步驟失誤。《大象》由供水推到勞民勸相，突出公共設施須靠組織互助維持。',
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
  'https://ctext.org/book-of-changes/zh',
  'https://zh.wikisource.org/wiki/周易正義',
  'https://zh.wikisource.org/wiki/周易/大象',
  'https://moodle3.ntnu.edu.tw/pluginfile.php/1419601/mod_resource/content/1/周易正義.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Yijing hexagrams 41-48.');
