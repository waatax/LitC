import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-5_p-15': {
    translation: '關尹子說：心受到外物感動，所生的不是另一個心，而是情；外物與心相交，所生的不是另一個物，而是識。外物尚且不是固定真實的實體，何況由交接而生的識？識尚且如此，何況又由心感而生的情？迷妄的人卻在本來至無之中執著為有，在不斷變化之中執著為常。認定一種情，逐漸累積成萬種情；認定萬種情，又累積成心中的萬物。外物來得無窮，個人的心力卻有邊際，所以本具的良知受情支配，本來的情性又受外物支配，任由外境使它來去，而那來去並不由真我自主，終日受造化役使。其實天地只能役使有形，不能役使無形；陰陽只能役使有氣，不能役使無氣。心意所向，氣便隨從；氣所到處，形體便相應。譬如太虛中由一氣變成萬物，但一氣不能等同太虛；一心能顯為氣、顯為形，而心本身無氣無形。明白一心無氣無形，便不再受天地陰陽的變化拘役。',
    analysis: '本段從物—心交接說明情與識皆是關係中的產物，進而批判「於至無中執有、於至變中執常」。校勘依《無上妙道文始真經》等底本，把誤植的「子至無中」改為「於至無中」。後半區分太虛與一氣、心與氣形：顯現出的形氣不等於能顯現的心。所謂不受天地陰陽役使，是不把自我等同於變動形氣的哲學主張，不代表肉身可以免除自然規律。',
  },
  'wenshi-zhenjing_ch-5_p-16': {
    translation: '關尹子說：人在平常日子裡，眼前忽然看見異常事物，是精氣凝結而造成；人在患病時忽然看見異常事物，是內心有所虧損而造成。如果知道心能在原本沒有影像時顯示出有，也就知道心能在原本有影像時使它顯得沒有。只要不把這些影像信作神異，它自然不再具有神怪力量。有人問：人的識已經昏亂，怎可能不相信？我回答：譬如捕蛇的人心裡不怕蛇，即使夢見蛇，也不會因此恐懼。所以黃帝說：道本沒有可執著的鬼神，獨自往來而不受其牽制。',
    analysis: '本段把異常視覺經驗歸於身心狀態，而非立即判作外在鬼神，捕蛇者夢蛇而不怕則說明信念會影響情緒反應。這在思想史上具有去神秘化方向，但「精結」「心歉」仍是古代生理心理模型。幻視也可能由眼疾、神經疾病、藥物、睡眠或精神健康問題造成；真實發生時應接受專業評估，不能只靠「不信」處理。',
  },
  'wenshi-zhenjing_ch-5_p-17': {
    translation: '關尹子說：我的思慮每天都在變化，背後自有促使它變化的條件；那不完全出於一個自主不變的我，而是整體時命與境遇使然。若明白一切隨命運條件而生，向外便不執著一個固定的我，向內也不執著一個固定的心。',
    analysis: '「命」在此指人所受的整體條件與變化勢分，不只是宿命論的預定結果。思慮日變，證明念頭不能完全由一個恆常自我支配；看清其條件性，便可鬆動對外在身份和內在心念的雙重執著。這不否定責任或行動，而是否定絕對自主的小我。',
  },
  'wenshi-zhenjing_ch-5_p-18': {
    translation: '關尹子說：譬如兩隻眼睛本來能看見天地萬物，但只要暫時把目光回轉，就會有一刻看不見外界。',
    analysis: '眼能遍見外物，卻不能在同一方式下直接看見自身；「回光」使注意由外轉內，外境便暫不呈現。短句以知覺方向說明心若停止向外攀緣，原先充滿視野的萬物可以當下退隱。它是觀心譬喻，不必解作視覺功能永久消失。',
  },
  'wenshi-zhenjing_ch-5_p-19': {
    translation: '關尹子說：眼睛長久追逐精雕細琢的華麗事物，視覺反而更受損；耳朵長久追逐繁複交響的聲音，聽覺反而更受損；內心一味鑽研玄奇奧妙，心神反而更受損。',
    analysis: '雕琢、交響、玄妙依次對應目、耳、心，形成層遞。文本反對感官與思辨的過度刺激：愈追逐精巧繁複，原有的明、聰與平常心愈可能被耗傷。它不是排斥藝術或深思，而是警告以新奇玄妙作無止境的欲望對象。',
  },
  'wenshi-zhenjing_ch-5_p-20': {
    translation: '關尹子說：不要只拿自己的心思去揣度別人，應當設身處地，依對方的處境與心意來理解他。懂得這個道理，處理事情就能周全，實踐德行就能切實，體會道理就能貫通，與人交往就能相契，也能逐漸忘去自我中心。',
    analysis: '「以彼心揆彼」是一種明確的換位理解原則：不把自身欲望、恐懼與標準投射給他人，而從對方的處境推求。其效用由周事、行德、貫道、交人一路上升到忘我，顯示同理不只是交際技巧，也是破除我執的修養方法。',
  },
  'wenshi-zhenjing_ch-5_p-21': {
    translation: '關尹子說：天下事物的規律是：細小的偏差若不節制，便會發展成大的問題；大的問題若仍不節制，最後便會到無法控制的地步。所以，能節制一個情念，就可以由此成就德行；能從根本忘去對一個情念的執著，就可以由此契合大道。',
    analysis: '本章以情識如何積累為主線，末段以「小—大—不可制」收束。制一情是倫理層次：在萌芽時調節，避免擴張；忘一情是更深的道論層次：不再把情念認作固定自我。前者成德，後者契道，區分節制與超越執著兩種工夫。',
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
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const item = items.find((x) => x.id === 'wenshi-zhenjing_ch-5_p-15');
  if (!item?.canonicalText.includes('子至無中')) throw new Error('Passage typo anchor missing');
  item.canonicalText = item.canonicalText.replace('子至無中', '於至無中');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-5_p-15' && x.canonicalText.includes('子至無中'));
  if (!sentence) throw new Error('Sentence typo anchor missing');
  sentence.canonicalText = sentence.canonicalText.replace('子至無中', '於至無中');
  sentence.chunks.forEach((chunk) => { chunk.text = chunk.text.replace('子至無中', '於至無中'); });
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
console.log('Completed Wenshi Zhenjing chapter 5 passages 15-21 and corrected 子至無中.');
