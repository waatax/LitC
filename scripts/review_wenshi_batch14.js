import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-7_p-7': {
    translation: '關尹子說：指甲生長、頭髮增長、營氣衛氣運行，沒有片刻停止。一般人只在變化已經顯著時才看見，不能察覺它細微發生的過程；賢者雖能察覺細微變化，卻未必能安然順任變化。聖人任由變化依理運行，所以不被變化牽制。',
    analysis: '爪髮生長是緩慢可見的變化，「榮衛」即傳統醫學所說營衛之氣。校勘依古籍影印本補回原資料漏掉的「賢人見之于微，而不能任化」，於是形成眾人、賢人、聖人三層：眾人只見結果，賢人能見細微，聖人更能順任其化。「任化所以不化」是不被變化迷惑，不是身體停止變化。',
  },
  'wenshi-zhenjing_ch-7_p-11': {
    translation: '關尹子說：人在年少時，應當銘記父兄長輩的教導；到了壯年，應當通達並接受朋友的規勸；到了老年，也應警醒地聽取年輕人的意見。只要不把自己封閉在某一人生階段，萬般變化雖不斷推移，也不能困住我。',
    analysis: '少、壯、老各有適合聽取的聲音：少年受長輩教，壯年受同儕箴，老年也須聽少壯之說。方向由上而平而下，特別打破年長即不必受教的自滿。「萬化不能厄我」來自終身可變可學，而非抗拒年齡變化。',
  },
  'wenshi-zhenjing_ch-7_p-12': {
    translation: '關尹子說：天下事理是，輕清的容易變化，凝重的較難變化。譬如風雲轉眼便變滅，金玉的質性卻經歷很久仍不改變。心性輕清明澈的人，能與造化一同變化而不留下滯礙；但能如此隨化，正因其中大概有一個不曾隨現象變化的根本存在。',
    analysis: '風雲與金玉對舉易化、難化，繼而提出看似悖論的「俱化而不留」與「未嘗化者存」：真正能隨境無礙，須不把任何一境當成本體。校勘已把誤植的「蓋嘗化」改回影印本「未嘗化」。不化者不是僵硬人格，而是不被單一形相限定的根本。',
  },
  'wenshi-zhenjing_ch-7_p-13': {
    translation: '關尹子說：兩個人在幼年相好，等到壯年形貌性情大變，相遇時甚至可能認不出；兩個人在壯年相好，到了老年再相遇，也可能彼此不識。古人又把雀、鴿、鷹、鳩等鳥類的消長說成物類互相變化；若從不停的變化看，便沒有一個固定的「從前」或「現在」可執著。',
    analysis: '前兩句以人成長衰老後相貌改變，說身份延續與形相變化的張力；末句援用古代物候中鳥類互化觀念。校勘依影印本把誤植「鴈」改為「鷹」。雀鴿鷹鳩並不會在生物學上彼此變種，這是傳統物候與氣化想像；哲學旨趣在於昔今皆是變化流程中的命名。',
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
  const p7 = items.find((x) => x.id === 'wenshi-zhenjing_ch-7_p-7');
  const p8 = items.find((x) => x.id === 'wenshi-zhenjing_ch-7_p-8');
  const p12 = items.find((x) => x.id === 'wenshi-zhenjing_ch-7_p-12');
  const p13 = items.find((x) => x.id === 'wenshi-zhenjing_ch-7_p-13');
  if (!p7?.canonicalText.includes('不能見之于微。聖人') || !p8?.canonicalText.includes('有嘗見聞') || !p12?.canonicalText.includes('蓋嘗化者') || !p13?.canonicalText.includes('鴈鳩之化')) throw new Error('Passage anchors missing');
  p7.canonicalText = p7.canonicalText.replace('不能見之于微。聖人', '不能見之于微。賢人見之于微，而不能任化。聖人');
  p8.canonicalText = p8.canonicalText.replace('有嘗見聞', '有常見聞');
  p12.canonicalText = p12.canonicalText.replace('蓋嘗化者', '未嘗化者');
  p13.canonicalText = p13.canonicalText.replace('鴈鳩之化', '鷹鳩之化');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const p7 = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-7_p-7' && x.canonicalText.includes('不能見之于微。'));
  const replacements = [
    ['wenshi-zhenjing_ch-7_p-8', '有嘗見聞', '有常見聞'],
    ['wenshi-zhenjing_ch-7_p-12', '蓋嘗化者', '未嘗化者'],
    ['wenshi-zhenjing_ch-7_p-13', '鴈鳩之化', '鷹鳩之化'],
  ];
  if (!p7) throw new Error('P7 sentence anchor missing');
  const extra = '賢人見之于微，而不能任化。';
  p7.canonicalText += extra;
  p7.chunks.push({ id: `${p7.id}_c-extra`, sentenceId: p7.id, order: p7.chunks.length + 1, text: extra, cue: '賢' });
  for (const [passageId, oldText, newText] of replacements) {
    const sentence = items.find((x) => x.passageId === passageId && x.canonicalText.includes(oldText));
    if (!sentence) throw new Error(`Sentence anchor missing ${passageId}`);
    sentence.canonicalText = sentence.canonicalText.replace(oldText, newText);
    sentence.chunks.forEach((chunk) => { chunk.text = chunk.text.replace(oldText, newText); });
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
if (changed !== 4) throw new Error(`Expected 4 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/qi-fu/zh',
  'https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1316445.pdf',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of ['wenshi-zhenjing_ch-7_p-11', 'wenshi-zhenjing_ch-7_p-12', 'wenshi-zhenjing_ch-7_p-13']) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
const p7Review = reviewData.reviews.find((review) => review.passageId === 'wenshi-zhenjing_ch-7_p-7');
if (!p7Review) throw new Error('Missing existing p7 review');
p7Review.sources = [...new Set([...p7Review.sources, ...sources])];
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 7 and corrected four canonical defects.');
