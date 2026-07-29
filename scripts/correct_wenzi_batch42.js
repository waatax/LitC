import fs from 'fs';

const corrections = {
  'wenzi_ch-7_p-21': {
    translation: '老子說：以不義手段取得財物，又不肯分施，禍患必將殃及自身；既不能利益別人，也不能真正保全自己，可說是愚人，和梟鳥自以為愛子、最後卻傷害幼鳥沒有不同。所以說：「執持到滿溢再設法防備，不如適可而止；反覆揣摩使它更加尖銳，不能長久保存。」德之中有道，道之中有德，兩者轉化不可窮盡；陽中有陰，陰中有陽，萬事都是如此，說不勝說。福將到來，先有吉祥徵兆；禍將到來，也先有不祥徵兆。見到吉兆卻不行善，福不會到來；見到凶兆而改行善事，禍也可能不至。利與害出於同一門戶，禍與福彼此相鄰，非神明聖智之人很難分清。所以說：「禍啊，是福所倚靠之處；福啊，是禍所潛伏之地，誰知道它最後如何？」人將生重病，往往先覺魚肉格外甘美；國家將滅亡，往往先厭惡忠臣的話。因此病到將死，良醫也難施治；國家將亡，忠謀也難被採用。先修養自身，然後才能治理人民；居家治理有序，然後才可移用於官長。所以說：「修養於身，德才真實；修養於家，德便有餘；修養於國，德便豐厚。」人民賴以生活的是衣食；政事能周全衣食才有功，不能周全便沒有功。事情沒有功效，德澤不能長久。因此隨時而行尚未成功，不必立刻更改刑法；順時而治尚未成功，也不必立刻更改原理，因為適當時機還會再來，這叫作道的綱紀。帝王使人民富足，霸王只求領土富廣，危亡之國只使官吏富有；治國看似仍嫌不足而持續充實民生，亡國則糧倉空虛。所以說：「上位者少事，人民自然富足；上位者不妄為，人民自然化育。」出動十萬軍隊，每日耗費千金；「大軍回師之後，必有荒年。」所以「兵器是不祥之器，不是君子所珍愛的東西。」「調解重大怨仇，仍必留有餘怨」，怎能把戰爭當作善事？古人親近近者不靠空言，招來遠者也不靠空言，而是使近者喜悅、遠者自然來歸。與人民同其願望便和諧，與人民共同守護便穩固，與人民同所思慮便明智；得到民力便富，得到人民稱譽便顯。行動可能招來敵寇，言語可能招致禍患；不要搶在別人前面發言，應在別人說後再衡量。貼耳私語也可能流傳千里；言語是禍患的入口，舌頭是發動的機關，話一出口不合宜，四匹快馬也追不回。從前中黃子說：天有五方，地有五行，聲有五音，物有五味，色有五章，人有五種位階，所以天地之間分成二十五種人。最上五種是神人、真人、道人、至人、聖人；其次是德人、賢人、智人、善人、辯人；居中是公人、忠人、信人、義人、禮人；再次是士、工、虞、農、商；最下是眾人、奴人、愚人、肉人、小人。最上五類和最下五類相比，就像人與牛馬。聖人用眼觀看、用耳聆聽、用口說話、用腳行走；真人不刻意觀看卻明，不刻意聆聽卻聰，不親自行走而人從，不多言而公正。所以聖人用來感動天下的事，真人並不以為更高；賢人用來矯正世俗的事，聖人也不以為值得自炫。所謂道，沒有前後左右的固定分別，使萬物幽深地同一，沒有固執的是非。',
    analysis: '【主旨】本段是綜合性長章，以福禍互伏為軸，串聯修身齊家、民生衣食、戰爭代價、得民與慎言，最後收於真人超越固定名位與是非。\n【關鍵詞義】「梟愛其子」用古代梟食母子傳說譏諷反愛為害；「祥」兼指吉凶徵兆；「道紀」是順時而行的綱紀；「虞人」是掌山澤者；「肉人」的具體義待考，屬古代等級分類。\n【思想史提示】病前甘肉、二十五等人等說法屬古代徵兆論與人類分類，不是現代醫學或平等觀念；本段可檢驗的政治核心在民生、戰爭成本與公共信任。\n【章法】前半由不義取財推至福禍反轉，中段從修身推國政，再由軍費轉向反戰得民，末段以慎言和人物層級回扣道不可執著於外在作為。'
  },
  'wenzi_ch-12_p-7': {
    translation: '老子說：世道將使人喪失生命本性時，就像陰氣開始滋長。君主昏暗不明，大道廢棄不行，德澤泯滅不彰；辦事違逆天時，發布號令違背四季，使春秋失去和氣、天地減去生養之德。君主身居其位而不安，大夫退隱不言；群臣只揣摩上意而破壞常法，疏遠骨肉來求自身容身。邪人諂媚、暗中謀畫，急忙擁戴驕主，模仿亂臣的辦法來成就私事。因此君臣乖離不親，骨肉疏遠不附；田間沒有挺立的禾苗，道路上無人安步。金錢積聚使廉潔折損，玉璧重疊仍嫌不足；龜甲占卜不見腹甲，蓍草卜筮每日施行。天下不能合成一家，諸侯各定法律、各異習俗，拔除根柢、拋棄根本；創設五刑，愈加刻削，為錐刀般微利爭奪，斬殺百姓過半。又興兵製造禍難，攻城濫殺，把高危當安穩；製造巨大衝車，築起高重壁壘，排列戰隊，使士卒走上必死陣地，冒犯強敵。百姓一旦反叛，只為君主苟取盛名、兼併國土，便伏屍數十萬；老弱因飢寒死亡者更不可勝數。從此以後，天下未曾能安其生命、樂其習俗。後來賢聖奮然而起，以道德維持天下，以仁義輔助；近者貢獻智慧，遠者感懷其德，天下混合為一。子孫相承輔佐，黜退讒佞的開端，止息尚未辨明的邪說；廢除刻削法律，去掉繁苛政事，屏絕流言痕跡，堵塞朋黨門路；消解機巧智詐，遵循共同常道，毀去旁枝形跡，貶退炫耀聰明，使天下大通於混冥質樸，萬物各自回歸根本。聖人並不能創造時機，只是在時機到來時不錯失，所以在亂世發展到一定階段後，不得不出現中止與轉變。',
    analysis: '【主旨】本段以亂世形成與復治為雙段結構：上意政治、朋黨、苛法、微利與兼併戰爭逐步摧毀民生；復治則從黜讒、簡法、息黨、循常開始。\n【關鍵詞義】「推上意」是揣摩迎合君意；「錐刀之末」比喻極小利益；「大衝車」是攻城器械；「隳枝體」依文脈指去除旁枝文飾；「中絕」是亂勢被中途截斷。\n【版本提示】「壁襲無贏」「殼龜無腹」「遽載驕主而像其亂人」等處疑有訛脫，白話只按積財占卜、迎合亂主的主線保守串解。\n【思想史提示】陰氣、蓍龜與聖人應時是古代政治宇宙論；文本最具體的歷史判準仍是田苗、行旅、刑殺、軍役與老弱飢寒。'
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
  const sourcePath = passageId.includes('ch-7') ? 'xia-de' : 'shang-li';
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
