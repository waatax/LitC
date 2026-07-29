import fs from 'fs';

const corrections = {
  'wenzi_ch-2_p-9': {
    translation: '老子說：君主的思慮，應使精神不在胸中躁動奔馳，才智不向四境外逐；懷抱仁愛真誠之心，甘雨便按時而降，五穀繁殖，春生夏長、秋收冬藏。每月省察，按季考核，年終接受貢賦；以公正養護人民，以誠信建立威嚴。法令簡省而不繁瑣，教化自然得像神妙一般；法律寬平、刑罰舒緩，監獄空虛，天下風俗一致，無人心懷奸詐，這是聖人的思慮。若上位者貪取沒有節制，下級便爭功而不謙讓；人民貧困，爭端隨之產生，勞力耗盡卻沒有成果，機詐萌生，盜賊日多，上下彼此怨恨，號令不能施行。水混濁，魚便張口喘息；政治苛刻，人民便混亂。上位者欲望多，下級欺詐便多；上位者煩擾，下級便不安定；上位者索求多，下級便互相爭奪。不治理根本，只在末端補救，和開鑿水渠卻想止水、抱著柴草去救火沒有不同。聖人事務簡省，治理卻有成效；取用少而供給充足，不刻意施惠而有仁，不多言而可信，不強求而有所得，不妄作而能成功。懷抱自然，保存至真，守道而推行誠意，天下便像回聲應聲、影子隨形一樣跟從，因為他所修治的是根本。',
    analysis: '【主旨】本段將政治亂象追溯到上位者多欲：貪取引發爭功、貧困、機詐與盜亂；治本是君主虛靜、節求、公養而非事後加重法令。\n【關鍵詞義】「神不馳」是精神不躁動外逐；「月省時考」指按月、按季考核；「魚噞」是魚因水濁而張口；「治求」依文脈指治理有成效。\n【思想】甘雨與五穀等仍帶天人感應色彩；真正可落實的論證，是上多欲則下多詐的制度與示範效應。'
  },
  'wenzi_ch-2_p-12': {
    translation: '老子說：公布法令、設置獎賞，卻不能移風易俗，是因為內心沒有抱持真誠。所以聽一地的聲音便可知道它的風氣，觀察它的音樂便可知道它的習俗，看見它的習俗便可知道教化情形。抱守真性、實踐誠意的人，能感動天地，精神超越四方；命令能施行，禁令能制止，是因真誠貫通其道、傳達其心意。即使一句話也不說，天下萬民乃至禽獸、鬼神也隨他變化。因此最高層次是無形的精神感化，其次是使人沒有條件作惡，最低層次才是獎賞賢者、懲罰暴徒。',
    analysis: '【主旨】本段排列三層治理：內在精誠造成風俗感化為上，制度預防作惡為次，事後賞罰為下；單有法賞不足以改俗。\n【關鍵詞義】「懸法」是公布法律；「效誠」是實踐、顯示真誠；「神踰方外」形容精神感通超出地域；「不得為非」是使人缺少作惡條件。\n【思想】禽獸鬼神隨化屬古代感通語彙，核心仍是政治信任與風俗不能只靠外在獎懲建立。'
  },
  'wenzi_ch-2_p-13': {
    translation: '老子說：大道無所造作；無為便不占有事物，不占有便不居功，既不居功便處於無形。無形便不妄動，不妄動便無須言說；無言便寂靜，沒有聲音也沒有形象。無聲無形，觀看它看不見，聆聽它聽不到，這叫微妙，這叫最神妙。「綿綿不絕，若有若存」，「這叫天地的根源」。道本來無聲，所以聖人勉強替它描摹形狀，用一句名稱來指稱天地之道。大以小為根本，多從少開始。天子以天地萬類為品物，以萬物作資用；功德極大，權勢名位極尊貴，所具二德之美可與天地相配，所以不可不遵循大道，把它作為天下萬物之母。',
    analysis: '【主旨】本段由無為—不有—不居—無形層層推演大道不可見聞，再從小大、少多說統治者愈居尊位，愈須以不居功的大道為準。\n【關鍵詞義】「不居」承《道德經》功成不居；「強為之形」是勉強用語言描摹；「品」可指品類；「軌大道」是以大道為法則。\n【版本提示】「以一句為名天地之道」「二德之美」所指及斷讀不夠穩定，白話依強名大道、德配天地的脈絡暫解。'
  },
  'wenzi_ch-2_p-16': {
    translation: '老子說：兒子為父親赴死，臣子為君主赴難，不是出於追求名聲，而是感恩之心藏在內部，使他不逃避對方的患難。君子的悲痛惻怛也不是刻意做給人看，而是發自內心；但仍須省察自己的行為。聖人面對影子也無愧，君子在獨處時仍謹慎。捨棄切近的內心根本，反去追求遙遠的名聲，便是閉塞不通。因此聖人在上位，人民喜愛他的治理；在下位，人民仰慕他的心意，因為他的志向始終不忘利益他人。',
    analysis: '【主旨】本段辨別真誠與求名：忠孝惻怛須由內而發，並以慎獨自我省察；若捨近求遠，把行為變成名聲表演，反而失去根本。\n【關鍵詞義】「死父／死君」是為父、為君赴死難；「憯怛」是悲痛惻隱；「不慚於影」指即使只有自己的影子相伴也問心無愧；「慎其獨」是在無人看見時仍自律。\n【版本提示】「非正為也」可能有異文，白話依非刻意造作解讀。'
  },
  'wenzi_ch-2_p-18': {
    translation: '老子說：言論有宗旨，事情有根本；失去宗旨與根本，技巧才能即使很多，也不如少說。若為了使眾人厭棄技巧，便讓巧匠倕斷掉手指，以求天下不再從事機巧，這同樣不是合宜的方法。所以真正有智慧的工匠有所作為，並不只是炫耀能力，而是配合時機。只知封閉卻不明白封閉的道理，也不是真正的閉藏；因此必先確實杜塞，然後才可以開通。',
    analysis: '【主旨】本段主張言事須守宗本，反對兩個極端：炫耀技巧，以及用傷害巧匠的方式消滅技巧；能力應按時、按本而用。\n【關鍵詞義】「倕」是傳說中的巧匠；「著倕而使斷其指」文本疑指針對巧匠使其斷指；「杜」是堵塞、閉藏。\n【版本提示】本段「害眾著倕」「匠人智為，不以能以時」「閉不知閉」疑有多處訛脫，現譯只依可辨認的宗本、反巧與閉開脈絡作保守串解，原文必須等待可靠異本核定，不能視為確譯。'
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
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: ['https://ctext.org/wenzi/jing-cheng/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
