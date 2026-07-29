import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-2_p-1': {
    translation: '關尹子說：「碗、盂、瓶、壺、甕、盎等各種器皿，都能呈現天地的結構；龜甲兆紋、蓍草數目、破瓦紋路、石頭文理，也都可以被用來占告吉凶。由此可知，天地萬物各自形成完整條理，一物之中便包含整體；每一物都各自包含，不必向別物借取。以我的精與對象的精相合，兩精交感，神便隨之感應。一雌一雄交合而有卵生，一牡一牝交合而有胎生。形體是對象之精的顯現，條理是對象之神的顯現；愛取是我的精，觀照是我的神。愛配水，觀配火；執著所愛而加以觀看，便順勢歸於水；保存觀照而涵攝所愛，便收斂歸於金。先想像一元之氣完整具於一物，以愛取契合它的形，以幽深觀照契合它的理，那一物的意象便呈現出來。」',
    analysis: '本段從器物的內虛外實推演天地陰陽，再把占卜、生殖、認知與五行納入「一物包天地」的感應模型。它反映前現代象數與身心修煉宇宙論，不能當成生物學、心理學或預測吉凶的現代實證。文末描述由專注、想像形成「象」的過程，可理解為主體與對象共同參與認知；但「愛、水、觀、火、金」的配屬須留在本書術語系統中。器名及若干句讀在刻本間有異，原文暫待影像定讞。'
  },
  'wenshi-zhenjing_ch-2_p-2': {
    translation: '「一氣運行所呈現的形象，周遍於廣大虛空。從中央上升的稱為天，從中央下降的稱為地；沒有只升而永不下降的，也沒有只降而永不上升的。上升稱為火，下降稱為水；想上升卻不能完全上升的稱為木，想下降卻不能完全下降的稱為金。」',
    analysis: '這一段以升降建立天、地、水、火、木、金的動態分類，重點是沒有單向永久的運動，升降互相轉化。木與金被界定為升降未完成的中間態，使五行不是五種靜止材料，而是氣化方向。這是本書的象數架構，不等同物理元素週期表；閱讀價值在其以過程而非固定實體理解差異。'
  },
  'wenshi-zhenjing_ch-2_p-3': {
    translation: '「木這種東西，鑽摩可以生火，絞壓可以出水；金這種東西，敲擊可以迸出火星，熔化可以成為液體。金與木，都是水火交會的中介。水配精、配天，火配神、配地，木配魂、配人，金配魄、配物。不停運行的稱為時間，包容而各有所處的稱為空間。只有土貫穿這些變化的終始；其中的道理，有人能解說，也有人能顯示。」',
    analysis: '木可取火出液、金可迸火熔流，被用來證明金木含水火兩性；接著再把五行配上精、神、魂、魄及天、地、人、物。時間被定義為持續運動，空間被定義為包容與定位，土則作為轉化的承接者。這種類比建立的是象徵同構，不是由實驗推出的因果定律；「熔金為水」也只是古代以流動性稱水的廣義用法。'
  },
  'wenshi-zhenjing_ch-2_p-4': {
    translation: '關尹子說：「天下人口多得不能用億兆計算，每個人的夢都不同，每一夜的夢也不同。夢裡有天、有地、有人、有物，全由思念形成，其數多得連塵埃也無法相比。怎能確知我們當下這個天地，不也是某種思念所形成的呢？」',
    analysis: '本段從夢境世界由心形成，反問現實天地是否也可能依思而現。它不是給出「世界只是個人幻想」的證明，而是用夢的逼真性動搖人對現實自存的絕對把握。疑問句保留認識論的開放：我們憑什麼判定一種經驗獨立、另一種虛幻？後文將把重點落在「去識」而非消滅天地。'
  },
  'wenshi-zhenjing_ch-2_p-5': {
    translation: '關尹子說：「心與棗相感應，肝與榆相感應，這表示我能通於天地；天將陰雨時夢見水，將放晴時夢見火，這表示天地也能通於我。我與天地彷彿契合，又彷彿分離，最終各自純然歸於自身。」',
    analysis: '棗、榆與心、肝的配應及陰晴夢兆，屬古代感應、夢占與醫家類比傳統，其確切來源和義例並不透明。段末「似契似離，純純各歸」比前述感應更重要：人與天地互通，卻沒有因此混成同一物，各自仍有其分際。現代整理應如實說明歷史觀念，不把夢兆包裝成可靠天氣預報或醫療診斷。'
  },
  'wenshi-zhenjing_ch-2_p-6': {
    translation: '關尹子說：「天地雖然廣大，仍有色彩、有形體、有數量、有方位；而我之中另有一個不屬色彩、不屬形體、不屬數量、不屬方位，卻能使天成其為天、使地成其為地的根本存在。」',
    analysis: '天地再大仍落在可感、可量、可定位的範圍；本段反向追問，使天地之所以成立的根據是否也屬同一範圍。「天天地地」是使天為天、使地為地，不是另造一個人格神。這個非色非形的「吾有」近於認知與存在的根本條件，但文本沒有允許我們把它直接等同某個現代哲學概念。'
  },
  'wenshi-zhenjing_ch-2_p-7': {
    translation: '關尹子說：「死在胎中的、死在卵中的，有的是人、有的是動物；天地雖然廣大，他們本來就不知道。那些計度天地的內容，都只是我心中有限範圍的識知。譬如手不去碰刀刃，刀刃便不會傷人。」',
    analysis: '胎卵中夭折者未形成對天地的認知，說明「我的天地」與識知條件相關；天地本身並不等候每個生命去認識。「區識」是局部、區限的認識，不能反過來窮盡天地。刀刃譬喻則說傷害須經接觸條件發生。原資料「卵1中」是數字混入，已據多種傳本刪除；至於本段不是否定外在世界，而是限制主體對世界的占有性判斷。'
  },
  'wenshi-zhenjing_ch-2_p-8': {
    translation: '關尹子說：「夢中、鏡中、水中，都有一個天地的影像存在。要除去夢中的天地，只須睡下而不做夢；要除去鏡中的天地，只須精神不去照映；要除去水中的天地，只須不把水汲入盆中。那些影像的有無，取決於這邊的成像條件，不在影像本身。因此聖人不是除去外在天地，而是除去對表象的執識。」',
    analysis: '夢、鏡、水三種天地都依賴成像條件，條件停止，影像便不現。「彼之有無，在此不在彼」把焦點從影像移回產生影像的睡眠、照映和汲水活動。結論不是破壞世界，而是解除把心中表象當作世界本身的固著。此句有「神不照」與「形不照」兩系傳本：前者強調照映心神，後者強調鏡前無形；本庫保留底本文字並記錄異文。'
  },
  'wenshi-zhenjing_ch-2_p-9': {
    translation: '關尹子說：「天不是自己成為天，另有使它成為天的根據；地也不是自己成為地，另有使它成為地的根據。譬如房屋、舟船、車輛，都要等待人的營造才完成，不能自行完成。由知道那些事物有所依待，進而知道這個根本無所依待；於是向上不執著一個天，向下不執著一個地，向內不執著一個我，向外不執著一個他人。」',
    analysis: '屋宇舟車的人工成形用來說明「有待」，再追溯一個不再依賴他物的「無待」。末四句不是視覺上看不見天地人我，而是不把相對名相當作自立實體。這個論證從人造物類推宇宙，哲學上具有啟發性，但並非自然科學證明；其核心是依賴關係的追問。'
  },
  'wenshi-zhenjing_ch-2_p-10': {
    translation: '關尹子說：「具有時間變化的是氣；那個不屬氣的根本，從來沒有晝夜。具有方位的是形；那個不屬形的根本，從來沒有南北。什麼叫非氣？就是氣所從生的根據。譬如搖動扇子便得到風：尚未搖動時，不能把它叫作風氣；已經搖動後，才稱為氣。什麼叫非形？就是形所從生的根據。譬如鑽木便得到火：尚未鑽木時，不能把它叫作火的形象；鑽木以後，才稱為形。」',
    analysis: '時間隨氣的運動而立，方位隨形的分布而立；氣形未顯之前，晝夜南北也無從命名。扇風、鑽火說明條件具足後現象才取得名稱，「非氣」「非形」不是另一種隱藏物質，而是現象生成的未顯條件。原文「箑」即扇。這種生成論可與現代條件思考對話，但不可直接等同現代時空物理學。'
  },
  'wenshi-zhenjing_ch-2_p-11': {
    translation: '關尹子說：「寒、暑、溫、涼的變化，就像瓦石一類東西：放進火裡便熱，放進水裡便冷；向它呵氣便溫，向它吸氣便涼。這些變化只是因外物作用而有去有來，那塊瓦石本身其實沒有主動去來。又如水中的影像有去有來，承載影像的水其實沒有去來。」',
    analysis: '瓦石溫度隨外緣變，水中影像隨對象移動，承載者並未像表象那樣往來。本段藉此區分變化的呈現與相對穩定的所依，不是否定瓦石確有溫度改變。呵溫吸涼是日常體感觀察，重點在條件不同造成感受差異。它承接前章：不要把依條件變現的影像誤認為自立本體。'
  },
  'wenshi-zhenjing_ch-2_p-12': {
    translation: '關尹子說：「衣袖在空中搖動便生風，向物體呵氣便凝成水氣，水注入水中便發聲，石頭相擊便發光。懂得這些道理的人，便會說風、雨、雷、電都可依條件形成。因為風雨雷電都緣氣而生，氣又與心的活動相連；好比在心中持續想像大火，久了便覺得熱，持續想像大水，久了便覺得冷。懂得這層道理的人，便能體會天地生成變化的德用。」',
    analysis: '段落把微小可見現象類推風雨雷電，再以想火覺熱、想水覺寒說明心念能影響身體感受。這不證明個人意念能任意製造天氣；「皆可為之」在修煉傳統中可能帶有方術意味，現代不能當作已驗證能力。「氣緣心生」較穩妥的理解是至少部分身體氣感受心理影響。原資料「大1水」為混入數字，已據刻本改為「大水」。'
  },
  'wenshi-zhenjing_ch-2_p-13': {
    translation: '關尹子說：「觀察五色雲氣的變化，古人用來推占當年的豐收或歉收；觀察八方風在歲首的來向，古人用來推占當時吉凶。由此可知，吉慶、災咎、禍福、祥異，都被理解為同一氣運的變化。若能混同人我、與天地為一，便不會像那些私意智巧，把共同的氣化認作自己所有。」',
    analysis: '五雲、八風占候屬古代氣象—政治感應術，不能視為可靠的現代災害或收成預測。作者藉此導向「一氣之運」：各種休咎不是孤立事件，而在共同變化網絡中。末句「認而已之」可解作私智把公共氣化據為己有、認成自身功效；字面略澀，故保留待校。可取的觀念是放下私有化歸因，不是接受占候結論。'
  },
  'wenshi-zhenjing_ch-2_p-14': {
    translation: '關尹子說：「天地是寄寓，萬物是寄寓，我也是寄寓，道這個名稱同樣只是寄寓。假如離開一切寄寓而另立一個道，道也無從成立。」',
    analysis: '全篇以「寓」收束：天地、萬物、自我和道都不是永恆自立物，而是暫時顯現、互相依待的稱說。最重要的是連道也不例外；若把道抽離現象，另設成一個超然實體，反而失去它的意義。這既回應「一物包天地」，也避免前文「無待」被重新物化。原資料「于1寓」為數字污染，已校為「於寓／于寓」所指的「寓」。'
  }
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(\")([\\s\\S]*?)(\"\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
const replacements = [['卵1中', '卵中'], ['大1水', '大水'], ['于1寓', '于寓']];
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  for (const [bad, good] of replacements) {
    const item = items.find((x) => x.chapterId === 'wenshi-zhenjing_ch-2' && x.canonicalText.includes(bad));
    if (!item) throw new Error(`Missing passage token ${bad}`);
    item.canonicalText = item.canonicalText.replace(bad, good);
  }
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  for (const [bad, good] of replacements) {
    const sentence = items.find((x) => x.canonicalText.includes(bad));
    if (!sentence) throw new Error(`Missing sentence token ${bad}`);
    sentence.canonicalText = sentence.canonicalText.replace(bad, good);
    const chunk = sentence.chunks.find((x) => x.text.includes(bad));
    if (!chunk) throw new Error(`Missing chunk token ${bad}`);
    chunk.text = chunk.text.replace(bad, good);
  }
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
if (changed !== 14) throw new Error(`Expected 14, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/zh',
  'https://zh.wikisource.org/zh-hant/文始真經註/2',
  'https://zh.wikisource.org/zh/文始真經言外經旨/文始真经言外经旨卷之二',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf'
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  const canonicalText = ['wenshi-zhenjing_ch-2_p-7', 'wenshi-zhenjing_ch-2_p-12', 'wenshi-zhenjing_ch-2_p-14'].includes(passageId) ? 'verified' : 'pending';
  reviewData.reviews.push({ passageId, canonicalText, translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 2 and removed three digit artifacts.');
