import fs from 'fs';

const corrections = {
  'wenshi-zhenjing_ch-7_p-1': {
    translation: '關尹子說：道的根本至於無形，把萬事歸回道，一息之間即可體會；事情本來呈現為具體萬有，以道運用事情，便能周遍各種作為。得道而能居尊位，可以輔助世間；得道而能獨立，可以建立真我。知道不受時間拘束，便能把一日體驗得像百年、把百年看成一日；知道不受空間障礙，便能把一里體驗得像百里、把百里看成一里。以下經文又以召風雨、變鳥獸、乘鳳鶴、駕蛟鯨、制鬼神、入金石、接星辰、卜龜筮、知人肺肝，以及內丹的龍虎、女嬰、爐冶等語，象徵有無、虛實、上下、古今、人我、物我的界線可以相通。能勝物則虎豹可伏，能同物則水火不再成為對立。只有有道之士能理解和運用這些變化；但即使能做，也可以選擇不做。',
    analysis: '本段是全篇神異語彙最密集的一章。前半「一日百年、一里百里」可從時間與空間經驗的相對性理解；後半大量召雨、變形、穿石、水火不侵及內丹術語，屬道教神通與煉養想像，不能宣稱為現代可驗證能力。「能之而不為」是收束關鍵：道不以炫示異能為目的，真正自主也包括有能力而不濫用。',
  },
  'wenshi-zhenjing_ch-7_p-2': {
    translation: '關尹子說：人的力量據說可以奪取天地造化，例如冬天發雷、夏天結冰，使死屍行走、枯木開花，在豆中收鬼、杯中釣魚，讓畫出的門開啟、泥塑的鬼說話；本篇把這些都歸於純一之氣的作用，所以說氣能變化萬物。當下情念不停變動，也是氣的作用，而氣有聚有散。至於那個使氣運行的根本，本身未曾聚合，也未曾離散。聚合者稱為生，離散者稱為死；不落聚散的根本則無所謂生死。各種形氣如旅客般有往有來，根本仍安然自若。',
    analysis: '前列冬雷夏冰、屍行木華及各種術法，既有異常自然現象，也有幻術或宗教傳說；經文以「純氣」統攝。論證核心在後半：氣聚散形成生死，但使氣運行的根本不等同某次聚散，以主客譬喻保持不動。原文末句異本字形不一，譯文依上下文只取「客來去而根本自若」，不據此證成任何法術。',
  },
  'wenshi-zhenjing_ch-7_p-3': {
    translation: '關尹子說：有人誦念咒語，有人奉事神靈，有人書寫符字，有人變換指訣；傳統術法認為這些方法可以役使神靈、駕馭氣機、變化事物。但不夠至誠的人很難相信自身內在的力量，反而容易相信外在器物，所以才借助這些形式。若知道關鍵只在至誠，也可能不必依靠那些外在儀式而自然達成內在轉化。',
    analysis: '誦咒、事神、墨字、變指分別涉及咒法、祭神、符籙與手訣。文本雖沿用「役神御氣」術語，實際把效力由器物轉回「誠」，外在形式只是為不自信者所假借。這可解為儀式對信念和專注的媒介作用，不代表咒符手訣已被證實能改變客觀物理世界。',
  },
  'wenshi-zhenjing_ch-7_p-4': {
    translation: '關尹子說：人的一次呼吸看似短促，但氣息隨天地運行，一日之中彷彿行走四十萬里，變化可說極其迅速。只有聖人不把自身固定在某一暫時形態，所以能在萬變之中不失根本。',
    analysis: '「日行四十萬里」是古代氣化宇宙觀中的巨大象數，並非可按現代呼吸氣流距離核實的生理數據。短句以呼吸不停交換說明人身每刻參與大化。「不存、不變」不是肉體停止變化，而是不把任何變化狀態存定為自我，故心之根本不隨相遷。',
  },
  'wenshi-zhenjing_ch-7_p-5': {
    translation: '關尹子說：傳說青鸞子活到千歲，千年間仍隨歲月變化；桃子五次出仕，心境也隨五次仕途而改變。聖人把世事看成來去的賓客，除去對外物的固著，難道是不想在世間有所建立嗎？只是凡有形體與數限的成就，都免不了不可預知的變化，因此不宜執著。',
    analysis: '青鸞子、桃子在此作長壽者與多次出仕者的例證，細節帶有傳說性；無論千歲或五仕，都逃不過變化。「賓事去物」不是逃避世務，而是視事情為客、不讓成就成為佔有。末問澄清聖人仍可建功，只是不把有形有數之物當成永恆保障。',
  },
  'wenshi-zhenjing_ch-7_p-6': {
    translation: '關尹子說：萬物不斷變遷，雖然彼此時隱時現，根本上卻只是同一氣化。只有聖人知道這個共同根源，不被表面形態的變化帶走。',
    analysis: '「互隱見」指一形顯現時他形退隱，萬象在轉換中此消彼長；其材料與動力仍是一氣。「知一而不化」不是拒絕改變，而是不把自我等同於任何一次顯隱，故能任萬物化而根本不迷失。',
  },
  'wenshi-zhenjing_ch-7_p-7': {
    translation: '關尹子說：指甲生長、頭髮增長、營氣衛氣運行，沒有片刻停止。一般人只在變化已經顯著時才看見，不能察覺它細微發生的過程。聖人任由變化依理運行，所以不被變化牽制。',
    analysis: '爪髮生長是緩慢可見的變化，「榮衛」即傳統醫學所說營衛之氣。眾人見著不見微，因而誤以為事物先固定、後突然改變；聖人知道變化從未停止，便不逆拒也不驚惑。「任化所以不化」仍是順應變化而不失其本，不是身體永遠不變。',
  },
  'wenshi-zhenjing_ch-7_p-8': {
    translation: '關尹子說：人在室內已有一套慣常見聞；後來走到門外、鄰里、鄉里和鄉黨，再走到郊野、山中、河川，所見所聞便各不相同。喜愛與厭惡隨之產生，和合與競爭跟著出現，所得與所失也由此形成。因此，聖人的一舉一止都保持警覺和節制。',
    analysis: '空間由室而門、鄰、里、黨，再推到郊、山、川；環境擴張帶來見聞差異，進一步生成好惡、和競、得失。因果鏈說明價值與衝突不是憑空而來，而由接觸環境逐步累積。「動止有戒」不是閉門不出，而是知道每次接觸都可能改變心與關係。',
  },
  'wenshi-zhenjing_ch-7_p-9': {
    translation: '關尹子說：譬如大海中化生億萬蛟龍魚類，根本仍只是一種水。我與萬物繁盛紛呈地處在大化之中，根本之性也只是一體。明白性本為一，就不再固執他人與自我的隔限，也不把生與死看成絕對斷裂。',
    analysis: '海水與億萬水族構成一多關係：形態極繁，所依之水不二。「蓊然蔚然」形容人與物繁茂多彩，並非要抹平具體差異；性一所消解的是差異的絕對化。無人無我、無死無生是從共同根源看界線，不是否定個體生命事件。',
  },
  'wenshi-zhenjing_ch-7_p-10': {
    translation: '關尹子說：天下事理常會轉化：原先認為正確的可能變成錯誤，原先認為錯誤的也可能變成正確；恩惠可能轉成仇怨，仇怨也可能轉成恩惠。因此，聖人身處平常安定之時，也會預想到變局。',
    analysis: '是非與恩讎兩組相反關係都可能互化，說明判斷與人情受後續條件影響。「居常慮變」不是持續焦慮或疑人，而是在常態中保留對變化的理解，不把當下正誤與親疏視為永久。它將前章形上變化論落實為處世警覺。',
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
if (changed !== 10) throw new Error(`Expected 10 aids, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = [
  'https://ctext.org/wenshi-zhenjing/qi-fu/zh',
  'https://theway.ilotus.org/taoism/dianjing-collections/文始真經/',
  'https://zh.daoinfo.org/index.php?title=無上妙道文始真經&variant=zh-hant',
  'https://upload.wikimedia.org/wikipedia/commons/5/5f/WUL-ro13_00059_文始真經.pdf',
];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  reviewData.reviews.push({ passageId, canonicalText: 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Completed Wenshi Zhenjing chapter 7 passages 1-10.');
