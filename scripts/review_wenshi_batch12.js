import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-6_p-11': {
    translation: '關尹子說：眼睛若反過來觀看自身，眼本身並沒有可見的顏色；耳朵若反過來聽自身，耳本身沒有可聞的聲音；舌頭若品嘗自身，舌本身沒有可嘗的味道；心若衡量自身，心本身也不是一件可被量度的物。一般人追逐外在對象，賢者又可能執著內在心境；聖人知道內外兩種執著都是識心造作，不把任何一邊當成真實本體。',
    analysis: '眼不自成色、耳不自成聲等，是說感官功能須在與對象的關係中顯現，不能把能見能聞者本身再當成同類對象。眾人逐外、賢人執內看似高下不同，仍各守一邊；「皆偽之」意為聖人連內在境界也不實體化。',
  },
  'wenshi-zhenjing_ch-6_p-12': {
    translation: '關尹子說：我的身體由五行之氣構成，而五行之氣在根本性質上原是一體。譬如同一處所，依條件不同，可以取得水、引出火、生長木、凝成金、轉化土；那根本之性含攝各種可能，原來沒有絕對差別。因此，某一類飛禽過度繁盛時，另一類走獸可能難以繁育；走獸過盛，水族也可能受抑。明白五行彼此制約、互相為用，就不會把某一種形態固執為我。',
    analysis: '本段由五行差別追溯「其性一物」，再由生態盛衰說各類互制。羽蟲、毛蟲、鱗蟲是古代動物分類，盛衰敘述屬五行生克框架，不能直接當成現代生態定律。哲學落點是身體亦為同一氣化的暫時組合，理解互用即可鬆動自我邊界。',
  },
  'wenshi-zhenjing_ch-6_p-13': {
    translation: '關尹子說：乾枯的龜甲沒有自我，古人卻借它顯示占卜之智；磁石沒有自我，卻顯出強大的吸引力；鐘鼓沒有自我，卻能發出洪大的聲音；舟車沒有自我，卻能使人遠行。因此，我這一身雖能表現智慧、力量、行動與聲音，其中也不必另有一個獨立主宰的固定自我。',
    analysis: '四例都區分功能與主宰：龜甲被用來占卜、磁石能吸鐵、鐘鼓因擊而響、舟車因人力畜力而行，都有效用卻無自我意志。由此類推，人的智力行音也不能單憑功能證明內有恆常實體我。枯龜「大知」是古代占卜文化說法，不表示龜甲真能預知未來。',
  },
  'wenshi-zhenjing_ch-6_p-14': {
    translation: '關尹子說：傳說名叫「蜮」的怪物只要向人的影子射沙，就能使人死亡。若明白那些沒有知覺的事物也和我同在一個整體之中，那麼普天之下，便沒有完全與我隔絕的地方。',
    analysis: '蜮射影致病或致死是古代傳說，後來也成為「含沙射影」典故，並非真實動物能力。經文借此極端例子說形體之外的影與無知物也能被納入因緣關係，進而推到「我無不在」。這裡的我不是個人身體無限擴張，而是物我界線被解除後的整體性。',
  },
  'wenshi-zhenjing_ch-6_p-15': {
    translation: '關尹子說：人專心思念某事時，甚至會暫時忘記飢餓；憤怒時會暫時忘記寒冷；專心調養時會暫時忘記疾病；情緒激昂時會暫時忘記疼痛。若以呼吸調養和氣，本篇認為飢餓便難以侵擾；存養精神以增益暖意，寒冷便難以侵擾；依五行調養五臟，使它們不受損傷，疾病便難以侵擾；再把五臟的分別歸回五行氣化，不執著身體感受，疼痛也就難以支配自己。',
    analysis: '前四句確實觀察到注意與強烈情緒可暫時改變飢寒病痛的主觀感受，後四句則把這點提升為呼吸、存神與五行養生法。感受減弱不等於身體需求或疾病消失；呼吸不能取代食物、保暖、止痛及醫療。為避免危險誤讀，譯文保留「本篇認為」並把「忘」限定為暫時感受與不受支配。',
  },
  'wenshi-zhenjing_ch-6_p-16': {
    translation: '關尹子說：不要以為只有毫無知覺、毫無作為才叫無我；即使有所知、有所作為，也不妨礙無我。譬如火不停跳動變化，作用十分活躍，其中卻從來沒有一個固定自我。',
    analysis: '全章最後防止把無我誤解為木石般無知無為。知與行可以充分展開，只要不假設背後有不變主宰；火的躁動正好證明活動與無我並不矛盾。這使道家工夫回到日用：無我不是停止思考行動，而是在思行中不固著我相。',
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
console.log('Completed Wenshi Zhenjing chapter 6 passages 11-16.');
