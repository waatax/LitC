import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-59': {
    translation: '老子說：高層次的原則可以落實於下位日用，低層次的說法也可供上位者權宜採用；高層次原則適合常道，低層次方法適合權變。只有聖人能真正明白權變。說出的話一定兌現，約定的日期一定符合，固然被視為天下高尚行為；但若為了正直而出證父親，為了守信而使女兒赴死，誰還能珍視這種行為？所以聖人判斷事情曲直，會隨實際情勢屈伸，沒有固定不變的外在形式。父親祝禱時可以直稱君主名號，父親溺水時可以揪住他的頭髮救他，都是情勢使然。所謂權，是聖人能獨自看見的適宜變通：表面先有違逆，結果卻符合正道，才叫權；開始似乎合宜，最後反而背離正道，就是不知權。不懂權變，善行也可能轉成醜惡。',
    analysis: '【主旨】本段用證父、死女、救溺三例批評把誠信禮節絕對化；權變的判準不是眼前合規，而是最後是否合乎更高義理。\n【關鍵詞義】「常用／權用」是常道與權變；「證父」指作證揭發父親；「信而死女」疑涉守約致女於死的典故；「祝則名君」指祝禱可直稱君名；「捽父」是揪父頭髮救溺。\n【版本提示】首四句與「信而死女」語義、典故均有異解，現譯依常權之辨串聯，不標為唯一解。'
  },
  'wenzi_ch-3_p-61': {
    translation: '老子說：法律繁瑣、刑罰嚴峻，人民便滋生欺詐；上位者多事，下民便多方作態應付。索求愈多，實際所得反而愈少；禁令愈多，真正能生效的反而愈少。用事端製造更多事端，又想用新增事端來制止它，就像把火揚得更旺，卻要求不要燃燒；用機巧智慧造成禍患，再用機巧智慧防備它，就像攪動水面卻想得到澄清。',
    analysis: '【主旨】本段揭示過度治理的反饋迴圈：繁法峻刑誘發規避，上多事造成下多態，再用更多規則補救，只會繼續放大問題。\n【關鍵詞義】「態」是因應上意而生的虛態、花樣；「禁多即勝少」指禁令繁多而真正被遵行者少；「揚火」是助長火勢；「撓水」是攪水。\n【思想】反對的是規則無限疊加與智巧補丁，不是主張完全無法；它要求先停止製造問題的制度誘因。'
  },
  'wenzi_ch-3_p-62': {
    translation: '老子說：君主若偏好仁慈，便可能獎賞無功者、釋放有罪者；若偏好刑罰，便可能廢棄有功者，甚至傷及無罪者。只有沒有私人好惡，施刑而不招怨，施惠而不自居恩德；依照水準、墨繩等公正尺度辦事，自身不以私意參與，像天地一樣普遍覆載，才是合宜。統合人民、使之和諧，是君主的職責；分別曲直、依法懲治，是法律的職責。人民受罰而沒有怨恨，才可稱為合乎道德的治理。',
    analysis: '【主旨】本段同時限制「好仁」與「好刑」：私人偏好會扭曲功罪，仁慈也可能成為濫賞縱罪；應由公開尺度區分賞罰。\n【關鍵詞義】「放準循繩」是依水準墨繩般的客觀標準；「身無與事」是君主私意不介入案件；「合而和之」指政治統合；「別而誅之」指法律辨別曲直。\n【版本提示】「無罪者」後疑有脫字，依好刑與好仁對舉譯作刑及無罪，但原文必須保留待校。'
  },
  'wenzi_ch-6_p-2': {
    translation: '老子曾向常樅學習；看見舌頭柔軟長存，便懂得守柔。仰頭觀看屋旁高樹，退後又俯察川流；觀察影子，懂得持守在後。所以聖人說，不要盲目搶先，常居人後而不居先。這好比堆積柴薪焚燒，後放上去的柴反而處在上面。',
    analysis: '【主旨】本段以舌柔、觀樹須退、影隨形後、積薪後者居上四種經驗，說明退後不一定是失去位置，反可保全並取得更完整視野。\n【關鍵詞義】常樅是傳說中老子之師；「見舌」常與齒剛先亡、舌柔長存的故事相聯；「持後」是守住後位；「積薪」後放者在上。\n【版本提示】「仰視屋樹，退而目川」「聖人曰無因循」文句疑有訛脫，現譯按觀物守後的共同主題保守處理。'
  },
  'wenzi_ch-6_p-3': {
    translation: '老子說：鳴響的大鈴因不斷發聲而自受毀損，油脂製成的燭因發光而自行煎熬；虎豹因皮毛有美麗花紋招來射殺，猿猴因動作敏捷招來捕捉。因此勇武者可能因強橫而死，善辯者可能因炫耀智能而困。能用智慧知道事情，卻不能用智慧承認有所不知，就像只在一項技能上勇敢、只對一句言辭明察；可以和他談局部曲折，卻不能讓他廣泛應對變化。',
    analysis: '【主旨】本段列舉聲、光、文、捷四種長處反招傷害，指出真正智慧包含「知道自己不知」；單項專長若自滿，無法應付廣泛變化。\n【關鍵詞義】「鐸」是大鈴；「膏燭」是油脂燭；「文」是皮毛紋采；「格」依語境指受擊捕；「曲說」是局部、單一層面的議論。\n【思想】問題不在勇武、辯才或專業本身，而在把局部能力擴張為無所不知，因炫能而暴露並誤判風險。'
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
  const sourcePath = passageId.includes('ch-3') ? 'jiu-shou' : 'zi-ran';
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
