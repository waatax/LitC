import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-4_p-1': {
    translation: '關尹子說：水可以分開，也可以重新合在一起，象徵「精」沒有固定的對待者；火則須依附油膏或柴薪才顯現，象徵「神」沒有獨立不變的自我。依本篇的象數配屬，耳、智、一、奇數、冬、黑色、北方與長壽歸於精；舌、言語、禮、二、偶數、夏、紅色、南方與夭折歸於神。精不以自我為主，所以米去殼後精實仍在；神不以自我為主，所以鬼神依託事物才顯現。保全精的人忘卻是非得失，不執著此與彼；持守神的人能隨時勢或隱或顯、或強或弱，也不固守一端。',
    analysis: '本段以水、火說明精與神：水可分合，火須待燃料，藉此破除「固定他者」與「獨立自我」的執著。中間大量配屬屬於傳統五行象數系統，重點是展示萬象同構，而非現代自然科學分類。末段把修養落在不固執分別、能因時應變：全精偏於不受是非得失牽引，抱神偏於隨境顯晦強弱。',
  },
  'wenshi-zhenjing_ch-4_p-2': {
    translation: '關尹子說：精與神，好比水與火；五行彼此生化、彼此制約，循環往復，找不到絕對的起點，也沒有最後的終點。因此，我的精如水中一滴，不能孤立地說它永存或滅亡；我的神如一瞬的閃動，也不能孤立地說它發起或消滅。只有不執著自我與他人、不設定開端與終結，才可以與天地幽深地契合。',
    analysis: '篇旨由五行循環推到生命觀。所謂「一滴無存亡」「一欻無起滅」，不是宣稱個體肉身不死，而是說個別形態置於整體變化中，不能用孤立、固定的存亡起滅來理解。結句把宇宙論轉成工夫論：撤去我、人、始、終的界限，方能體會變化的整體。',
  },
  'wenshi-zhenjing_ch-4_p-3': {
    translation: '關尹子說：精配水，魄配金，神配火，魂配木。精屬水、魄屬金，依五行說金生水，所以精藏於魄；神屬火、魂屬木，木生火，所以神藏於魂。水能包藏金而使它止息，也能滋養木而使它繁茂，因此使魂魄分化；火能熔金、焚木，因此又使魂魄冥合。精在天象為寒，在地為水，在人為精；神在天為熱，在地為火，在人為神；魄在天為燥，在地為金，在人為魄；魂在天為風，在地為木，在人為魂。如果把自身的精、神、魄、魂與天地萬物相通，就像萬水可合成一水、萬火可合成一火，異金可熔成一體，異木可嫁接而同生。如此天地萬物都是我的精、神、魄、魂，又怎能把哪一個孤立地判為死、哪一個判為生？',
    analysis: '本段建立精水、魄金、神火、魂木的四重對應，再用五行生化與水火作用解釋魂魄的分合。校勘時據《文始真經註》及近代整理本補回「惟水之為物……所以析魂魄」，並將誤植的「魄主木」校為「魂主木」，使上下配屬一致。末段的萬水、萬火、熔金、接木四喻，旨在消解個體與天地的界線；這是道教宇宙生命論的象徵表述，不宜直接當作現代生理學。',
  },
  'wenshi-zhenjing_ch-4_p-4': {
    translation: '關尹子說：五行的運行，時而相生，時而相克，前後循環，沒有窮盡。人們都知道五行中土居中，卻不知道土之中還有更根本的統一；都知道事物之中有形體，卻不知道形體之中還有性；都知道人的心會思慮，卻不知道思慮之中還有更本真的神。只有聖人能使五行歸於一氣，使五種感官歸於一心，使五種性情歸於一德。外來事物雖多，都是這一氣所感通；情狀雖多，都是這一心所應接；作用雖多，都是這一德所統攝。譬如種子必須具備內在生機，再遇適當條件才會萌發；條件只能助成，不能憑空製造生命。人的男女交感、生育後代，也被本篇用來說明陰陽相合而生化的道理。',
    analysis: '此段由五行循環轉向「多歸於一」：五行、一氣，五官、一心，五性、一德，是由現象追溯統攝根源的層次。種子與生育的譬喻強調內因須與外緣相合，外在條件不能憑空創造根本。涉及男女、生殖的說法反映古代陰陽二元模型，宜作思想史材料理解，不等同今日生物學。',
  },
  'wenshi-zhenjing_ch-4_p-5': {
    translation: '關尹子說：一般人用魄牽制魂，好比金有餘而木不足；聖人則以魂運用魄，好比木有餘而金不足。魄收藏時魂也隨之，魂遊行時魄也依從。白天魂寄於眼而能見，夜裡魄舍於肝而能夢。看見本來只是魂的作用；把所見分別成天地萬物，是魂長久習慣的結果。夢本來只是魄的作用；把夢境分別成彼此與自我，也是魄長久習慣的結果。依五行說，火生土，所以神生意；土生金，所以意生魄。神一動便稱為意，意再動便稱為魄。聖人知道所謂我與物，都是思慮計度後才成立，所以萬物來時，只以尚未萌念的本性應對，不用分別造作的心迎接。沒有火便沒有土，沒有意便沒有魄；五者相依，缺一便不能成其整體。若能把天地萬物融通為自己的魂與魄，則造化的妙用與一切所有都不外於自身，也就沒有外物能役使自己。',
    analysis: '本段以魂主動、魄收攝的框架解釋醒與夢，並把天地、彼我等分別歸因於積習。校勘補回「火生土，故神生意」，使後文「無火則無土」及神—意—魄的五行鏈條完整。核心工夫是「以性應物」：在概念分判尚未萌生時直接應接，而不是任由成見支配。魂魄、肝夢等內容屬古代身心論與宗教哲學，不應當作現代神經科學結論。',
  },
  'wenshi-zhenjing_ch-4_p-6': {
    translation: '關尹子從字形與氣的升降解說魂魄：把「鬼」與「云」聯繫為魂，把「鬼」與「白」聯繫為魄；魂取其上升、流動，魄取其下降、凝聚。人死之後，魂魄如何升降、歸屬，又依其生前德行與習氣而有不同；仁、義、禮、智、信及其反面，被分別納入木、金、火、水、土的象徵秩序。',
    analysis: '這一段以字源聯想、氣化升降和五行倫理構成死後論。它把魂視為較輕清而升、魄視為較重濁而降，再以五德五常安排其歸宿。這是古代道教宗教宇宙觀及勸善架構，字形解說未必符合現代文字學，死後敘述也應視為信仰文本，而非可驗證的自然事實。',
  },
  'wenshi-zhenjing_ch-4_p-7': {
    translation: '魂魄若只修成一半，便仍留在人間。使魂升進可達尊貴，使魄升進可致富有；使魂依附可成神，使魄依附可成鬼；魂魄交合則成為人，離散則歸於變化。飛禽走獸、鱗甲水族、昆蟲等五類動物，也各由魂魄偏盛偏衰而呈現不同形態。至誠的人與天地之理相契，所以古人以龜甲、蓍草等占驗吉凶；本篇認為，感應不在器物本身，而在人的誠與天地相通。',
    analysis: '本段承接前段魂升魄降，排列貴、富、神、鬼、人及動物諸類，形成一套魂魄比例與聚散的生命階序。「五蟲」是古代對動物類群的總稱，不只指昆蟲。末尾由魂魄感通轉入占卜，主張效驗根於至誠；這反映傳統感應論，解析時須與現代經驗證據區分。',
  },
  'wenshi-zhenjing_ch-4_p-8': {
    translation: '關尹子說：眼、耳、鼻、舌、身五種感官都具有魂的靈動作用。以眼為例，愛好某物便專注於它，專注之中又含有使知覺發生、使形象成形的兩面作用；其他感官也可依此類推。若完全沒有知覺活動，便不會建立一個自以為獨立存在的生命主體。',
    analysis: '此段用五官共有「魂」來說知覺不是被動接收，而含有注意、偏好與成象作用。「父母」在此是生成兩端的象徵語，不宜只按家庭稱謂理解。結句把感知活動與自我成立連在一起：沒有識知與分別，就沒有那個自我造作的生命觀。其性別化譬喻反映古代陰陽模型。',
  },
  'wenshi-zhenjing_ch-4_p-9': {
    translation: '關尹子說：譬如敲鼓，鼓的形體好比精，發出的聲音好比神，聲音傳出與回響的作用好比魂魄。形體、聲音和回響都隨條件暫時聚合，沒有一項能被固定地執為「我」。推而廣之，五行所構成的一切也都如此。',
    analysis: '鼓喻把身心拆成載體、發用與傳播回響：鼓體如精，聲音如神，往來感應如魂魄。三者相待才有擊鼓事件，離開條件便沒有獨立實體。結論「五行孰能變我」不是建立另一個永恆小我，而是反問：既然組成要素都非固定自我，又有哪一項能單獨支配真我？',
  },
  'wenshi-zhenjing_ch-4_p-10': {
    translation: '關尹子說：種子要得到水的滋潤、火的溫養和土的承載才能生長；過度乾燥、淹水或土壤壅塞，都不能單獨生出生命。人的精如水、神如火、意如土，平常似乎各自分開，到了生命根本處才會合為一體。就像古人說符咒能使空中顯現事物，本篇藉此比喻：許多看似實有的境象，其實由精、神、意的會合與心識作用而呈現。',
    analysis: '種子之喻再次說明生命須多種條件協同，不能由單一元素造成；水、火、土對應精、神、意，最後收束到根本處的統合。符咒顯物是古代術法語境中的譬喻，重點在說境象依條件與心識而現，不應解讀成本站替超自然現象作事實背書。',
  },
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(")([\\s\\S]*?)("\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
const p3Old = '神主火，魄主木，木生火，故神者、魂藏之。惟火之為物';
const p3New = '神主火，魂主木，木生火，故神者、魂藏之。惟水之為物，能藏金而息之，能滋木而榮之；所以析魂魄。惟火之為物';
const p5Old = '土生金，故意生魄。';
const p5New = '火生土，故神生意。土生金，故意生魄。';
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const p3 = items.find((x) => x.id === 'wenshi-zhenjing_ch-4_p-3');
  const p5 = items.find((x) => x.id === 'wenshi-zhenjing_ch-4_p-5');
  if (!p3?.canonicalText.includes(p3Old) || !p5?.canonicalText.includes(p5Old)) throw new Error('Canonical anchors missing');
  p3.canonicalText = p3.canonicalText.replace(p3Old, p3New);
  p5.canonicalText = p5.canonicalText.replace(p5Old, p5New);
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const typo = items.find((x) => x.id === 'wenshi-zhenjing_ch-4_p-3_s-3');
  const water = items.find((x) => x.id === 'wenshi-zhenjing_ch-4_p-3_s-4');
  const fire = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-4_p-5' && x.canonicalText === p5Old);
  if (!typo || !water || !fire) throw new Error('Sentence anchors missing');
  typo.canonicalText = typo.canonicalText.replace('魄主木', '魂主木');
  typo.chunks.forEach((c) => { c.text = c.text.replace('魄主木', '魂主木'); });
  const waterPrefix = '惟水之為物，能藏金而息之，能滋木而榮之；所以析魂魄。';
  water.canonicalText = waterPrefix + water.canonicalText;
  water.chunks.unshift({ id: `${water.id}_c-0`, sentenceId: water.id, order: 0, text: waterPrefix, cue: '惟' });
  fire.canonicalText = p5New;
  fire.chunks.unshift({ id: `${fire.id}_c-0`, sentenceId: fire.id, order: 0, text: '火生土，故神生意。', cue: '火' });
});
fs.writeFileSync(worksFile, worksSource, 'utf8');

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
  'https://ctext.org/wenshi-zhenjing/si-fu/zh',
  'https://zh.wikisource.org/wiki/文始真經註/4',
  'https://zh.wikisource.org/wiki/文始真經言外經旨/文始真经言外经旨卷之四',
  'https://www.daoist.org/BookSearch(test)/Download_area/series_020.pdf',
  'https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1316445.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 4 passages 1-10 with two lacunae and one typo corrected.');
