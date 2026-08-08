import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-8_p-1': {
    translation: '關尹子說：古代善於揲蓍草、灼龜甲占卜的人，能從今天顯示古時，從古時顯示今天；從高處看出低處，從低處看出高處；從小事看出大事，從大事看出小節；從一看出多，從多看出一；從人看物，從物看人；從我看彼，從彼看我。然而道本身不受這些對待限制：它來時不屬於現在，去時不屬於古代；向上沒有覆蓋，向下沒有承載；大到沒有外邊，小到沒有內裡；外不固定為物，內不固定為人；近不固定為我，遠不固定為彼。它不能被分割，也不能被拼合，無法用類比完全說明，也不是思慮所能窮盡。正因渾然未分，所以勉強稱為道。',
    analysis: '揲蓍與灼龜分別是古代筮、卜方法。前六組對待展示占者如何由一端推另一端，後文則反轉：道不屬今古、高下、大小、一多、人物、彼我。部分郭子謙本在大小與人物之間另有「其本無一，其末無多」，注本明記為異本增文；本站正文暫依現行底本，未混合補入。占卜能力屬歷史信仰，沒有可靠證據可預知個人未來。',
  },
  'wenshi-zhenjing_ch-8_p-2': {
    translation: '關尹子說：水性潛藏，所以蘊積為五類生命之精；火性飛揚，所以通達為五種氣味；木性茂盛，所以開展為五色；金性堅實，所以受擊而成五聲；土性調和，所以滋養出五味。常規可歸為五類，實際變化卻不可計數；基本事物歸為五行，混合之後也不可計數。因此，天地間萬物不能固執地只說成萬、五或一，也不能固執地說它們絕不是萬、五或一。時而合觀，時而分看；若一定要把它們鎖定為形、數或氣，只是白白勞心。物不建立一個知道我的主體，我也不必以私知把物鎖死。',
    analysis: '五精、五臭、五色、五聲、五味是五行分類的展開；「其常五，其變不可計」承認模型只有五類，現象組合卻無窮。後半連萬、五、一三種尺度都不准執死，也不落入全盤否定。末句「物不知我，我不知物」不是拒絕研究，而是反對以概念分類冒充事物完整實相。',
  },
  'wenshi-zhenjing_ch-8_p-3': {
    translation: '關尹子說：就在我的心中，可以造作出萬物。心有所趨向，愛著便隨之而生；愛著一生，精氣也跟著投入。心有所凝結，先表現為水液：想到可愛或可食之物便流涎，因事悲傷便流淚，因事慚愧便出汗。沒有短暫而不可能延續的，也沒有長久而永不改變的。依五行說，水生木、木生火、火生土、土生金、金又生水，彼此生化制約，變化不可勝數。內丹家所說的嬰兒、蘂女、金樓、絳宮、青蛟、白虎、寶鼎、紅爐，都是由身心精氣建立的象徵；而在這些象徵之外，仍有不等同於它們的根本存在。',
    analysis: '流涎、流淚、出汗說明心境可引發身體反應，但經文以五行精氣解釋，與現代生理機制不同。後列嬰兒、蘂女、金樓等皆為內丹隱語，指涉精、神、臟腑、鼎爐等修煉結構，不是身內真的人物建築或龍虎。末句尤其重要：道不等同任何術語與可視化意象。',
  },
  'wenshi-zhenjing_ch-8_p-4': {
    translation: '關尹子說：鳥獸轉眼還在幼小鳴叫，轉眼經過數旬而長成，轉眼又衰亡逃逝；草木轉眼萌芽，轉眼挺立，轉眼又蕭疏凋零。天地不能把它們留住，聖人也不能把它們繫住，因為其中自有運行變化的力量。執著有與變化的一端在彼，體會無與不受拘束的一端在此；鼓若沒有鼓槌便不會響。與造化成對的一端在彼，不落對偶而獨立的一端在此；鼓槌若沒有手持，也不會自行敲擊。',
    analysis: '呦呦、旬旬、逃逃對應鳥獸的生、長、衰亡；茁茁、停停、蕭蕭對應草木萌生、長成、凋落。後半鼓—桴—手建立條件鏈：鼓聲不是鼓單獨所有，變化也須因緣相合。「有在彼、無在此」「偶在彼、奇在此」是迷情與真空的對照，不宜理解為字面方位。',
  },
  'wenshi-zhenjing_ch-8_p-5': {
    translation: '關尹子說：萬物本來同依一個根源。一般人被名稱迷惑，只看見具體事物而看不見道；賢者分析其中道理，容易只看見抽象的道而忽略具體事物；聖人契合自然，不再把「道」與「物」分成兩個可執著的對象。一切本都在道中；不加固執，當下就是道，一旦執定，便只剩一件被概念化的物。',
    analysis: '眾人見物忘道，賢人見道忘物，仍各偏一端；聖人「不見道、不見物」不是雙重失明，而是不再物化兩者。末句給出判準：道與物的差別不在另有神秘實體，而在是否執著；一把道固定成可占有的概念，道也就成了物。',
  },
  'wenshi-zhenjing_ch-8_p-6': {
    translation: '關尹子說：知道事物的名稱形象只是權宜假立，並不需要把事物全部排除。譬如看見泥塑的牛、木雕的馬，情識中仍保留「牛」「馬」的名稱，心裡卻不會把它們當成真正會行動的牛馬。',
    analysis: '土牛木馬顯示「保留名稱」與「不執為實」可以並存。真正的去執不是摧毀世界、禁止語言，而是使用名稱時知道模型與實物有別。這一段也為全章收尾：洞察物之偽，不必逃離日常事物，仍可正常辨識與行動。',
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
if (changed !== 6) throw new Error(`Expected 6 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/ba-chou/zh',
  'https://ctext.org/wiki.pl?chapter=753927&if=zh',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 8.');
