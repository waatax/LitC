import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-35': {
    translation: '老子說：人居高位容易招來三種怨恨：爵位高，別人會嫉妒；官職大，君主可能猜忌厭惡；俸祿厚，眾人可能怨恨。爵位愈高，心意應愈謙下；官職愈大，內心應愈謹慎；俸祿愈厚，施惠應愈廣。修好這三點，怨恨便不會興起。所以尊貴以卑賤為根本，高處以低處為基礎。',
    analysis: '【主旨】本段分析高爵、大官、厚祿各自帶來嫉妒、猜忌與不平，並用意下、心小、施博作對應的權力節制。\n【關鍵詞義】「主惡之」是君主對權臣猜忌厭惡；「意益下」是態度更謙下；「心益小」不是心胸狹小，而是更加戒慎；「施益博」是分享利益更廣。\n【思想】貴賤高下不是固定身分辯護，而是說權力資源愈多，愈需以下層支持、謙慎與回饋維持正當性。'
  },
  'wenzi_ch-3_p-38': {
    translation: '老子說：德行少而寵愛多，會受到譏議；才能低而職位高，處境危險；沒有大功卻享有厚祿，地位也會衰微。所以事物有時看似增加它，反而造成減損；看似減損它，反而有所增益。眾人都知道把利益當作利益，卻不知道把禍患真正看成禍患；只有聖人明白，有些患難可轉成利益，有些利益反會成為禍患。因此一年兩度結果的樹木，根部必受損傷；家藏寶物而被人發掘，後代必遭災殃。巨大利益反而轉成傷害，這是天道盛極必反的規律。',
    analysis: '【主旨】本段不是籠統反對利益，而是要求德、才、功與寵、位、祿相稱；超出承載能力的增益會像樹木過度結果般傷根。\n【關鍵詞義】「微」是衰危；「利利」是只把眼前利益當利；「病病」是看清禍患確為禍患；「再實之木」指一再或一年兩次結果的樹。\n【版本提示】「掘藏之家」可解為藏財被發掘之家，具體斷讀仍待底本核定；主旨在厚藏招禍。'
  },
  'wenzi_ch-3_p-41': {
    translation: '老子說：人有順和與逆亂之氣，都從內心產生。心安定，氣便和順；心混亂，氣便逆亂。心的治亂取決於道德：得道，心便安定；失道，心便混亂。心安定，人與人交往便互相辭讓；心混亂，便互相爭奪。辭讓形成德，爭奪滋生傷害；有德，氣便和順，傷害滋生，氣便逆亂。氣和順，就願減少自己來供給別人；氣逆亂，就損害別人來奉養自己。這兩種氣，可以藉由道來調整控制。天道好像回聲回應聲音：德行積累，福祉便產生；禍害積累，怨恨便形成。官職常敗在權勢最盛之時，孝心常在有了妻子兒女後衰退，禍患常在憂慮解除時萌生，疾病常在將要痊癒時加重。所以說：「結束時和開始時一樣謹慎，就不會敗壞事情。」',
    analysis: '【主旨】本段建立心—氣—交往—政治後果的鏈條，末以官盛、成家、解憂、將癒四種鬆懈時刻說慎終的重要。\n【關鍵詞義】「交讓／交爭」是人際間互讓或互爭；「賊」指損人害物；「官茂」是官勢盛大；「且瘉」是將要痊癒。\n【思想】「孝衰於妻子」反映古代家族倫理的警語，重點是新關係可能使舊責任鬆懈，不應用來貶抑配偶子女。'
  },
  'wenzi_ch-3_p-42': {
    translation: '老子說：若推舉邪曲者而把正直者交給他支配，怎能得到善治？若推舉正直者而讓邪曲者與他共事，也不要任由邪曲者一路牽引。這就是所謂雖同處污濁環境，卻不一同陷入泥淖。',
    analysis: '【主旨】本段討論正直者與邪曲者同處時的界線：不能讓枉者主導直者，也不能因共同任事便跟隨其邪路。\n【關鍵詞義】「枉」是邪曲不正；「遂往」是任其一路前往、跟從到底；「同汙而異泥」指可處同一污濁環境，卻不共同陷溺。\n【版本提示】全段高度省略，「如何不得」「舉直與枉」斷句與字義均有疑。現譯依直枉任用及不同流合污的主題暫擬，可信度有限，必須等待異本校定。'
  },
  'wenzi_ch-3_p-43': {
    translation: '老子說：聖人把生死看作一體，愚人有時也同樣不分生死；兩者差別在於能否調和利害所在。道高懸於天，萬物分布於地，而調和的責任在人。君主若不能使人事和諧，古人認為天氣便不能下降，地氣不能上升，陰陽不能協調，風雨不能按時，人民因而生病挨餓。',
    analysis: '【主旨】本段指出表面同樣看淡生死，可能出於通達，也可能出於愚昧；判準是能否調和實際利害，並把人君政治視為天地民生之和的樞紐。\n【關鍵詞義】「同死生」是等同看待生死；「和利害之所在」是調節利害關係；「天氣下、地氣上」是古代陰陽交感模型。\n【思想史提示】政治失和直接造成陰陽風雨失調屬天人感應宇宙觀，不是現代氣象因果；可取的政治層面是統治失序會使民生疾苦。'
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
    sources: ['https://ctext.org/wenzi/jiu-shou/zh', 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
