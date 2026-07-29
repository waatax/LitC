import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-9_p-11': {
    translation: '關尹子說：古今風俗不同，東西南北各地的風俗也不同，甚至各家、各人所認為合宜的善行也不完全相同。我怎能固執一種標準，預先規定後世呢？只應隨順時勢、通達習俗，在事情發生前察覺機先；消除忿怒、節制欲望，簡省物用、寬恕待人，衡量輕重後行事。如此自然能與不可測的神妙變化相合，契入不拘一法的道。',
    analysis: '本段由古今、四方、家庭到個人，逐層說明規範必須面對時地差異。「豫格後世」是預先用固定尺度限制後世；反面不是毫無原則，而是「先機後事、捐忿塞慾、簡物恕人、權其輕重」：先察情勢，再以克制、寬恕與權衡作判斷。「隨時同俗」因此不是盲從陋俗，「無方」也不是任意妄為。原資料「蕳物」為字形訛混，依四部叢刊及通行校錄整理作「簡物」。',
  },
  'wenshi-zhenjing_ch-9_p-12': {
    translation: '關尹子說：交往有因道而相交的，有因德行而相交的，也有因事情而相交的。所謂道交，以父子關係為例，它超出一時的是非與賢愚評價，所以能夠長久；德交已經涉及對是非、賢愚的判斷，所以有時相合、有時分離；事交只因一件事情而結合，事情結束便會分離。',
    analysis: '三類交往依其基礎由深到淺：道交以生命與根本關係為紐帶，德交以價值認同為紐帶，事交以共同任務為紐帶。「故久」承接「出于是非賢愚之外」，現資料誤作「故道」，已依通行本與影印本校正。父子被用作古代道交的典型，是作者的歷史性比喻，不能據此推成現代社會中親屬關係必須無條件維持，尤其不應用來合理化傷害或壓迫。',
  },
  'wenshi-zhenjing_ch-9_p-13': {
    translation: '關尹子說：不要把笨拙鄙陋說成道的質樸，應當喜愛敏捷通達；不要把愚昧昏暗說成道的幽晦，應當喜愛輕快明朗；不要把傲慢輕人說成道的高超，應當喜愛和諧合群；不要把散漫無邊說成道的廣大，應當喜愛切要緊實；不要把幽鬱憂愁說成道的寂靜，應當喜愛歡悅安適。古人的話，學習時常會產生流弊，不可不加以補救。',
    analysis: '五組辨偽針對修道者常見的自我美化：以拙陋冒充質樸、愚暗冒充幽晦、傲慢冒充高超、散漫冒充廣大、憂鬱冒充寂靜。每一項都提出正面校正。「汗漫」指漫無邊際，「急要」在此指切要、緊實；校勘記另載「要急／要怠」等次序或字形異文，現依底本。末句提醒古語若只模仿外表便會生弊，閱讀經典本身也需要批判與救偏。',
  },
  'wenshi-zhenjing_ch-9_p-14': {
    translation: '關尹子說：不可非議世人而認定只有自己正確；不可貶低別人而抬高自己；不可因自己輕率疏忽，反說自己有道；不可因自己譏刺毀謗，反說自己有德；不可因自己鄙陋猥瑣，反說自己有才。',
    analysis: '此段的關鍵是重新斷句：「非世是己、卑人尊己」是以貶他抬己；後三句「輕忽道己、訕謗德己、鄙猥才己」則是把自身缺點包裝為道、德、才。它緊承上段對「以拙陋為質」的批評，揭露用高尚名詞替自我缺陷辯護的心理。原資料標點把動賓結構拆開，白話依句法還原，但暫不把標點差異計作正文版本校定。',
  },
  'wenshi-zhenjing_ch-9_p-15': {
    translation: '關尹子說：能使天下恃智者陷入困境的，未必是更高的智巧，而是外表若愚；能使天下善辯者無言以對的，未必是更強的辯說，而是守默若訥；能使天下逞勇者歸服的，未必是更大的勇力，而是能退讓若怯。',
    analysis: '本段與第二段相應，再以愚、訥、怯反制智、辯、勇。「困、窮、伏」不是鼓勵操縱或羞辱他人，而是指出競逐智辯勇只會不斷升高對抗；不進入同一競賽，反而使對方無從爭勝。原資料漏掉「伏天下之勇者，不在勇，而在怯」，已依四部叢刊、注本及多本校勘恢復，使三項排比完整。',
  },
  'wenshi-zhenjing_ch-9_p-16': {
    translation: '關尹子說：自然不能讓蓮花在冬天開、菊花在春天開，所以聖人不違背時令；土地條件不能讓橘樹生長在洛地、貉生長在汶地，所以聖人不違逆地方習俗。聖人不能叫手代腳行走、叫腳代手抓握，所以不違背自己各部分的長處；聖人也不能叫魚飛翔、叫鳥奔馳，所以不違背別人的所長。能如此，便可以行動、可以止息、可以隱晦、可以彰明，唯獨不可被固定方式拘束，這才是道。',
    analysis: '四例由天時、地俗、自身器官到他者才能，說明行動須尊重條件與差異。「洛橘、汶貉」沿用古人的地域物產認識，重點在水土有別，不宜當成現代物種分布的精確科學命題。「手步足握、魚飛鳥馳」強調不能抹平功能差異。末句的可動可止、可晦可明不是毫無立場，而是因時地與所長調整；唯一不變的是「不可拘」。',
  },
  'wenshi-zhenjing_ch-9_p-17': {
    translation: '關尹子說：少說不必要的話，就不容易遭人忌恨；少做炫耀多餘的事，就不容易被人挑剔；少賣弄智巧，就不容易因智謀而被人勞煩；少顯露才能，就不容易因才能而被人役使。',
    analysis: '四個「少」都不是要求完全不言、不行、無智、無能，而是節制多言、多事、炫智、露能帶來的社會反作用。「短」作動詞，指揭短或非議；「勞、役」說有才智者常被無限加派任務。這是一種保全精力、避免名能反噬的處世提醒；若用來逃避必要責任，便又把「少」固化成另一種偏執。',
  },
  'wenshi-zhenjing_ch-9_p-18': {
    translation: '關尹子說：持守內心要真誠，實際行動要簡要；對待他人要寬恕，回應外界要少言而沉靜。如此，我所行的道便不會窮盡。',
    analysis: '誠、簡、恕、默分別落在操守、行動、待人、應對四個層面。「操」是持守，「簡」不是草率，而是除去繁苛；「默」也不是拒絕溝通，而是不以多言逞勝。注本把本章概括為以誠簡恕默救治不通達之病。原資料「蕳」依通行字形整理為「簡」，與上下文「行之」的簡約原則相合。',
  },
  'wenshi-zhenjing_ch-9_p-19': {
    translation: '關尹子說：謀劃要針對具體事情，裁決要依據事理；努力實行在於人，能否成功還有賴於客觀時勢。處理事情要向今人和現實經驗學習，理解道理要向古人與歷史經驗學習；做事可以與眾人協同，對道的體悟卻必須由自己親證。',
    analysis: '四句「謀—斷—作—成」區分計畫、判斷、人的努力與不可完全控制的結果。「成之於天」不是叫人消極等候，而是在「作之於人」之後承認成敗尚受條件限制。後半再平衡古今與群己：實務取法當今，義理參考古代；公共行動可合作，內在體悟不能由他人代替。這避免只談玄理而不問現實，也避免把跟隨群體當成親自明道。',
  },
  'wenshi-zhenjing_ch-9_p-20': {
    translation: '關尹子說：金玉珍貴，所以難以丟棄；土石平常，所以容易捨去。學道的人遇到精微的言論和高妙的行為，尤其要小心，不可執著；這些言行可以學著實踐，卻不可抓住其形式不放。若一味執著，就像疾病深入心腹，已沒有藥物可以治療。',
    analysis: '金玉比喻聖賢的微言妙行，土石比喻平常言行；越被視為珍貴，越容易成為難捨的執著。「可為而不可執」區分實踐精神與複製形跡：可以學其用意，不能把某句話、某種行為定為唯一道路。腹心之疾比皮膚病更深，注本據此說執著聖人行跡比捨棄凡俗成見更難治。醫病只是譬喻，不能理解成對真實疾病的醫療判斷。',
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
  const replacements = [
    ['wenshi-zhenjing_ch-9_p-11', '蕳物恕人', '簡物恕人'],
    ['wenshi-zhenjing_ch-9_p-12', '故道。德交者', '故久。德交者'],
    ['wenshi-zhenjing_ch-9_p-18', '行之以蕳', '行之以簡'],
  ];
  for (const [id, oldText, newText] of replacements) {
    const passage = items.find((x) => x.id === id);
    if (!passage?.canonicalText.includes(oldText)) throw new Error(`Passage anchor missing ${id}`);
    passage.canonicalText = passage.canonicalText.replace(oldText, newText);
  }
  const p15 = items.find((x) => x.id === 'wenshi-zhenjing_ch-9_p-15');
  if (!p15?.canonicalText.endsWith('而在訥。」')) throw new Error('P15 passage anchor missing');
  p15.canonicalText = p15.canonicalText.replace('而在訥。」', '而在訥；伏天下之勇者，不在勇，而在怯。」');
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const replacements = [
    ['wenshi-zhenjing_ch-9_p-11', '蕳物恕人', '簡物恕人'],
    ['wenshi-zhenjing_ch-9_p-12', '故道。', '故久。'],
    ['wenshi-zhenjing_ch-9_p-18', '行之以蕳', '行之以簡'],
  ];
  for (const [passageId, oldText, newText] of replacements) {
    const sentence = items.find((x) => x.passageId === passageId && x.canonicalText.includes(oldText));
    if (!sentence) throw new Error(`Sentence anchor missing ${passageId}`);
    sentence.canonicalText = sentence.canonicalText.replace(oldText, newText);
    sentence.chunks.forEach((chunk) => { chunk.text = chunk.text.replace(oldText, newText); });
  }
  const p15 = items.find((x) => x.passageId === 'wenshi-zhenjing_ch-9_p-15' && x.canonicalText.includes('窮天下之辯者'));
  if (!p15) throw new Error('P15 sentence anchor missing');
  const extra = '伏天下之勇者，不在勇，而在怯。';
  p15.canonicalText += extra;
  p15.chunks.push({ id: `${p15.id}_c-extra`, sentenceId: p15.id, order: p15.chunks.length + 1, text: extra, cue: '伏' });
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
  'https://ctext.org/wenshi-zhenjing/jiu-yao/zh',
  'https://zh.wikisource.org/wiki/關尹子/9',
  'https://zh.wikisource.org/wiki/文始真經註/9',
  'https://zh.wikisource.org/wiki/文始真經言外經旨/文始真經言外經旨卷之九',
  'https://www.shidianguji.com/zh/book/SBCK440/chapter/1j6lo49ik7hgp_15',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 9 passages 11-20 and corrected canonical defects.');
