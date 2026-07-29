import fs from 'fs';

const corrections = {
  'wenzi_ch-12_p-3': {
    translation: '老子說：從前聖王仰觀天象，俯察地理，中間取法於人情；調和陰陽之氣，協調四時節令，考察丘陵、平地、水澤以及肥薄、高下各自適宜的用途，藉此興辦生產、創造財用，消除飢寒禍患，避開疾病災害。在人事方面，制定禮樂，推行仁義之道，治理人倫。排列金、木、水、火、土的性質，用來比擬並確立父子親情，組成家庭；聽辨五音清濁與六律相生的規律，用來確立君臣之義，組成國家；考察四季孟、仲、季的次序，用來建立長幼節序，形成官府秩序。劃分土地設州，分立國家治理，設立大學教導，這些是治理的綱紀。符合道便推行，失去道便廢止；事物從來沒有張而不弛、盛而不衰的，只有聖人能在盛大時避免敗壞。聖人最初創作音樂，是為使精神歸正、杜絕淫亂，返回天賦本心；到它衰敗時，音樂流蕩不能返回正道，沉溺聲色、不顧正法，禍害流傳後世，甚至導致亡國。聖人創作書典，是為統領整理百事，使愚者有所記憶、智者可以記事；到它衰敗時，人們反用文書製造奸偽，替有罪者辯解，殺害無辜。聖人設置苑囿，是為備辦宗廟祭祀用品，並簡閱士卒以防不測；到它衰敗時，君主馳騁射獵，侵奪人民農時，耗盡民力。聖人尊崇賢才，是為平正教化、審理獄訟，使賢者居位、能者任職，恩澤施於下，萬民感念其德；到它衰敗時，朋黨互相勾結，各自推舉私交，廢公趨私，內外互相援引，奸人居位，賢者退隱。天地的規律是到極點便返回，增加到一定程度便減損。所以聖人修治積弊而改革制度，一件制度走到盡頭便重新建立；制度之美在於調和，失敗則常出在權宜運用失去準則。聖人之道說：不修明禮義，廉恥便不能建立；人民沒有廉恥，便無法治理。不懂禮義，法律也不能使人歸正；不崇尚善行、廢退醜惡，人便不會趨向禮義。沒有法律不能治理，但不懂禮義，也不能正確施行法律。法律能處死不孝者，卻不能因此使人產生孝心；能懲罰盜賊，卻不能因此使人變得廉潔。聖王在上，明白顯示好惡給人民，整理是非毀譽來引導；親近並進用善者，鄙棄並退黜不肖者。如此刑法擱置不用，禮義修明，賢德者得到任用。天下最高明的人任三公，一州最高明的人任九卿，一國高明者任二十七大夫，一鄉高明者任八十一元士。智慧超過萬人的叫英，超過千人的叫俊，超過百人的叫傑，超過十人的叫豪。明白天地之道、通達人情之理，器量大得足以容眾，恩惠足以懷遠，智慧足以懂得權變，是人中之英。德足以教化，行為足以彰顯義理，信用足以得到眾人，明察足以照臨下屬，是人中之俊。行為可作表率，智慧足以決斷疑難，信用足以守約，廉潔到可以託付分財，辦事可供取法，言論可成準則，是人中之傑。守職不廢，面對義不結黨，見到危難不苟且逃免，見到利益不苟且取得，是人中之豪。英、俊、傑、豪各按才具大小居於適合職位，由根本流向末端，以重者控制輕者，上倡下和，四海之內同心歸向，背棄貪鄙、趨向仁義；教化人民，就像風吹草偃。若使不肖者居於賢者之上，即使嚴刑也不能禁止奸邪。小不能控制大，弱不能役使強，這是天地事物的本性。所以聖人推舉賢者建立功業，不肖君主則推舉與自己相同、親近的人。觀察他推舉誰，治亂便可分辨；考察他的朋黨交與，賢與不肖便可判斷。',
    analysis: '【主旨】本段不是單純歌頌禮制，而是完整討論制度生命週期：禮樂、書典、苑囿與尚賢本為治具，盛極失道後都可能反轉成淫樂、文書奸偽、遊獵擾民與朋黨私舉。\n【制度與法律】文本同時主張「無法不可治」與「法不能使人孝廉」。法律可制裁底線行為，禮義與公開好惡才塑造內在規範；兩者不是互相排斥。\n【人才分類】英、俊、傑、豪依容眾、教化、決疑、守職等能力分層配置，核心是才位相稱。末段以舉誰、與誰結黨作為判斷君主治亂的可觀察證據。\n【版本與史境】五行配父子、五音配君臣、四時配長幼，以及三公九卿等數目，反映古代類比宇宙論與官制理想；「辟疾疢之讃」「行足以隱義」等字句疑有訛異，白話按避疾、彰義的文脈保守處理。'
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
if (replaced !== 1) throw new Error(`Expected 1 replacement, replaced ${replaced}.`);
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
    sources: ['https://ctext.org/wenzi/shang-li/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf', 'https://chinese.nchu.edu.tw/files/users/189/44-1.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Corrected 1 Wenzi long-form translation and analysis.');
