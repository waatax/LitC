import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-5_p-8': {
    translation: '關尹子說：夜裡的一場夢，在夢中感到的時間有時比整個夜晚還長，可見心不受固定時間限制。生在齊國的人，起初內心所見所存多是齊國的事物；後來到了宋國、魏國、晉國以及其他地方，心中所存便各不相同，可見心也不受固定方域限制。',
    analysis: '夢中時長可超過實際睡眠感受，用來說「心無時」；閱歷不同地域而內容隨之改變，用來說「心無方」。原文「之宋、之魏、之晉、之」末一「之」缺少明確賓語，各通行電子本亦如此，疑為傳本脫文。譯文只作「以及其他地方」的最低限度理解，不臆補楚、秦等具體國名，原文校勘狀態仍保持待考。',
  },
  'wenshi-zhenjing_ch-5_p-9': {
    translation: '關尹子說：真正善於射箭的人，以弓本身的性能和用法為師，不只模仿后羿；真正善於行船的人，以船與水勢為師，不只模仿善於操舟的奡；真正善於用心的人，以自己的心為師，不只是模仿聖人的外在行跡。',
    analysis: '羿是傳說中的神射手，奡相傳善於操舟。三句以弓、舟、心逐層推進，反對捨棄事物本身的規律而盲目崇拜名家。末句尤其重要：師聖人的固定行跡容易流於摹仿，師心則是直接觀察心如何感物、起識與復歸本性；這不等於任性，而是要求親證。',
  },
  'wenshi-zhenjing_ch-5_p-10': {
    translation: '關尹子說：是非、美醜、成敗、盈虛，本來都在造化運行中轉變，只因個人的分別意識執著，才被固定成那些對立。若想用「無」把這些分別排遣掉，那個要排遣的念頭仍然存在；再用「非有非無」排遣它，仍舊有痕跡存在。即使說一切寂寂無物，或說一切混沌不分，這些觀念仍然存留。譬如重遊舊地，往日記憶清楚浮現；由此可知，分別意識不能靠強迫遺忘或概念排除而真正消失。',
    analysis: '本段與下一段原是一章：此處先說「不可忘、不可遣」，下段再提出「變識為智」。關鍵是避免以概念壓概念：用無遣有、用非有非無遣無，甚至執著「莫莫」「渾渾」，都只是新增一層意識。舊遊記憶之喻說明識痕遇緣即現，故解決方法不是抹除記憶，而是改變對識的執取方式。',
  },
  'wenshi-zhenjing_ch-5_p-11': {
    translation: '善於超越分別意識的人，是把識轉化成智慧。你知道怎樣轉識成智嗎？所謂「想」，譬如想到鬼便心中戰慄，想到盜賊便感到恐怖；所謂「識」，又像把黍認成稷、把玉認成石，心象漂浮不定，沒有落腳處。看見奇異事物，便生起奇異的想像與認識；這些想與識並沒有一個永遠固定在我之中的根。今天只是在今天，到了明天會生起什麼想與識，現在根本不能預料；明天來到時，紛紛的想與識也都依當時條件而生。想與識好比古人所說犀牛望月，月影彷彿進入角中；角中的月形只是由識而生，真正的月亮從未進入角中。胸中呈現的天地萬物也是如此。明白這個道理，便不把外物或內情看成獨立固定的實體。',
    analysis: '本段完成上段的論證：識不能硬刪，卻可轉成照見緣起的智。「想」偏於伴隨恐懼等情緒的心象，「識」偏於辨認、命名，且可能誤認。犀角含月是古代傳說性譬喻，論點不在動物學，而在影像不等於真月：心中世界是條件形成的表象。外不見物、內不見情，意為不執物情自性，並非失去現實感知。',
  },
  'wenshi-zhenjing_ch-5_p-12': {
    translation: '關尹子說：萬物從土中生出，最後又在土中變化；事情從意念中生起，最後也隨意念而改變。若明白事情只繫於意念，便會看到人一下認為它對，一下又認為它錯；一下以為好，一下又以為壞。意念有變化，心的本體卻不隨之變；意念有所覺察，心的本體卻不落在特定覺相上。若守住這一心，意念不過像塵埃往來，事情不過瞬間生滅，而我心中自有一個超越變化的常則存在。',
    analysis: '土承載萬物，意承載事情，兩者構成形與心的平行譬喻。是非善惡的快速翻轉顯示「意」屬變動層；「心無變、心無覺」不是麻木，而是說心體不等同任何一次變化或覺相。「大常」指在念與事起滅中不隨境遷的根本，不是固守某個具體觀念。',
  },
  'wenshi-zhenjing_ch-5_p-13': {
    translation: '關尹子說：情感從心生起，心又根源於本性。情好比水波，心好比水流，本性好比水本身。外物來到我面前，只像擊石迸火那樣短暫；若直接以本性承接它，便不再由分別心製造出一個可執著的對象，心境因而輕浮自在而不滯著。',
    analysis: '水、流、波依次對應性、心、情：三者不是截然不同的物，而是同一水體從根本到活動、再到受觸波動的層次。「石火頃」極言境來迅速短暫；若以性應物，心便不把短暫刺激凝固成對象。「浮浮然」在此是無所滯著、從容流行，不是輕佻。',
  },
  'wenshi-zhenjing_ch-5_p-14': {
    translation: '關尹子說：賢與愚、真與偽，有人能辨識，有人不能辨識。對方固然可能確有賢愚、真偽的差別，但把他判定為賢、愚、真、偽的，終究是觸動於我的分別意識。明白這些名稱都是識所形成的，所以即使面對所謂「真」，也不把它執成不可改變的真相。',
    analysis: '本段沒有簡單否認賢愚真偽，而是區分「對方的表現」與「我對它的命名」。判斷一旦進入我的識，就受立場、能力與習慣影響。「雖真者亦偽之」不是顛倒真偽，而是連真這個名稱也不實體化；否則對真的執著仍會成為另一層偽。',
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
if (changed !== 7) throw new Error(`Expected 7 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/wu-jian/zh',
  'https://ctext.org/wiki.pl?chapter=720548&if=zh',
  'https://www.shidianguji.com/zh/book/DZ0727/chapter/1k85je3l43ztx',
  'https://www.kanripo.org/ed/KR5c0116/HFL/005',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 5 passages 8-14.');
