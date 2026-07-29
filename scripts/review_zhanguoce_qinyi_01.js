import fs from 'fs';

const canonicalCorrections = {
  'zhan-guo-ce_ch-3_p-2': '蘇秦始將連橫，說秦惠王曰：「大王之國，西有巴、蜀、漢中之利，北有胡貉、代馬之用，南有巫山、黔中之限，東有殽、函之固。田肥美，民殷富，戰車萬乘，奮擊百萬，沃野千里，蓄積饒多，地勢形便，此所謂天府，天下之雄國也。以大王之賢，士民之眾，車騎之用，兵法之教，可以並諸侯，吞天下，稱帝而治，願大王少留意，臣請奏其效。」',
  'zhan-guo-ce_ch-3_p-3': '秦王曰：「寡人聞之，毛羽不豐滿者不可以高飛，文章不成者不可以誅罰，道德不厚者不可以使民，政教不順者不可以煩大臣。今先生儼然不遠千里而庭教之，願以異日。」蘇秦曰：「臣固疑大王之不能用也。昔者神農伐補遂，黃帝伐涿鹿而禽蚩尤，堯伐驩兜，舜伐三苗，禹伐共工，湯伐有夏，文王伐崇，武王伐紂，齊桓任戰而霸天下。由此觀之，惡有不戰者乎？古者使車轂擊馳，言語相結，天下為一；約從連橫，兵革不藏；文士並飭，諸侯亂惑；萬端俱起，不可勝理；科條既備，民多偽態；書策稠濁，百姓不足，上下相愁，民無所聊；明言章理，兵甲愈起；辯言偉服，戰攻不息；繁稱文辭，天下不治；舌敝耳聾，不見成功；行義約信，天下不親。於是乃廢文任武，厚養死士，綴甲厲兵，效勝於戰場。夫徒處而致利，安坐而廣地，雖古五帝、三王、五霸、明主賢君，常欲坐而致之，其勢不能，故以戰續之。寬則兩軍相攻，迫則杖戟相撞，然後可建大功。是故兵勝於外，義強於內；威立於上，民服於下。今欲並天下，凌萬乘，詘敵國，制海內，子元元，臣諸侯，非兵不可！今之嗣主，忽於至道，皆惛於教，亂於治，迷於言，惑於語，沉於辯，溺於辭。以此論之，王固不能行也。」',
  'zhan-guo-ce_ch-3_p-4': '說秦王書十上而說不行。黑貂之裘敝，黃金百斤盡，資用乏絕，去秦而歸。羸縢履蹻，負書擔囊，形容枯槁，面目黧黑，狀有愧色。歸至家，妻不下紝，嫂不為炊，父母不與言。蘇秦喟然歎曰：「妻不以我為夫，嫂不以我為叔，父母不以我為子，是皆秦之罪也。」乃夜發書，陳篋數十，得《太公陰符》之謀，伏而誦之，簡練以為揣摩。讀書欲睡，引錐自刺其股，血流至足。曰：「安有說人主不能出其金玉錦繡，取卿相之尊者乎？」期年揣摩成，曰：「此真可以說當世之君矣！」',
  'zhan-guo-ce_ch-3_p-5': '於是乃摩燕烏集闕，見說趙王於華屋之下，抵掌而談。趙王大悅，封為武安君，受相印，革車百乘，錦繡千純，白璧百雙，黃金萬鎰，以隨其後，約從散橫，以抑強秦。故蘇秦相於趙而關不通。當此之時，天下之大，萬民之眾，王侯之威，謀臣之權，皆欲決於蘇秦之策。不費斗糧，未煩一兵，未戰一士，未絕一弦，未折一矢，諸侯相親，賢於兄弟。夫賢人在而天下服，一人用而天下從。故曰：式於政，不式於勇；式於廊廟之內，不式於四境之外。當秦之隆，黃金萬鎰為用，轉轂連騎，炫熿於道，山東之國從風而服，使趙大重。且夫蘇秦特窮巷掘門、桑戶棬樞之士耳，伏軾撙銜，橫歷天下，庭說諸侯之主，杜左右之口，天下莫之伉。',
};

const aids = {
  'zhan-guo-ce_ch-3_p-1': {
    translation: '衛鞅逃離魏國進入秦國，秦孝公任他為相，封在商地，稱為商君。商君治理秦國，法令貫徹，公正無私；刑罰不避權貴，獎賞不偏親近。太子犯法，他便在太子的師傅臉上刺字、割鼻。滿一年後，路不拾遺，人民不妄取財物，軍力大為增強，諸侯畏懼。但其法刻薄嚴酷、少有恩惠，只靠強力使人服從。孝公採行其法八年，病重不起，想把君位傳給商君，商君辭謝不受。孝公死後，惠王即位不久，商君請求告老回封地。有人勸惠王說：「大臣權勢太重，國家便危險；左右親信過度，也很危險。如今秦國婦女嬰兒都說商君之法，無人說大王之法；商君反成君主，大王倒像臣子。況且商君本是大王的仇人，請大王設法處置。」商君回到封地後，惠王將他車裂，秦人也不憐惜他。',
    analysis: '【商鞅之法與其敗亡】篇首先列舉法令嚴行、富國強兵之效，隨即以「刻深寡恩，特以強服」作總評，說明服從建立於刑威而非政治認同。末段又呈現權力集中與太子舊怨如何反噬商鞅。此篇史事與《史記・商君列傳》細節不盡相同，不能直接當作精確年代紀錄。',
  },
  'zhan-guo-ce_ch-3_p-2': {
    translation: '蘇秦起初主張連橫，游說秦惠王說：「大王的國家，西有巴、蜀、漢中的物產利益，北有胡貉之眾與代地良馬可用，南有巫山、黔中的險阻，東有殽山、函谷關的堅固。田地肥沃，人民富足，戰車萬乘，勇士百萬，沃野千里，積蓄豐厚，地形便利；這正是天然府庫、天下雄國。憑大王的賢明、士民的眾多、車騎的用途與軍隊的訓練，足以兼併諸侯、吞取天下、稱帝治理。請大王稍加留意，讓臣說明實行的成效。」',
    analysis: '【先陳形勢，再進帝業】蘇秦從四方資源與險阻說起，依次推到人口、軍備、積蓄與地勢，最後才提出兼併稱帝。「天府」指物產與形勢天然完備之地；「殽、函」即殽山、函谷關。這是縱橫說辭常見的資源盤點法。',
  },
  'zhan-guo-ce_ch-3_p-3': {
    translation: '秦王說：「我聽說羽毛未豐不能高飛，法令制度尚未完備不能施行誅罰，道德不厚不能役使人民，政教不順不能勞煩大臣。先生遠來，在朝廷上鄭重教導我，請改日再談。」蘇秦回答：「我本來就懷疑大王不能採用。從神農、黃帝到堯舜禹、湯文武以及齊桓公，哪一位建立大業不曾用兵？古時外交車馬奔走、言語結盟，合縱連橫而兵器仍不能收藏；辯士粉飾言辭，諸侯更加迷亂；法條愈備，人民愈多虛偽；文書繁雜，百姓困乏，上下憂愁。說理愈明，戰爭反愈多；辯辭服飾愈盛，攻戰仍不停止。徒然守義守信，也不能使天下親附。因此只能棄文任武，厚養敢死之士，整甲厲兵，在戰場決勝。想安坐而得利益、擴土地，即使古代聖王也辦不到，勢必以戰爭接續。形勢寬緩便兩軍交攻，迫近便持戟相擊，然後才能建功。所以對外以兵取勝，對內以義自強；君上建立威勢，人民才服從。如今要兼併天下、壓倒萬乘之國、制服敵國、統制海內、愛民如子、使諸侯稱臣，非用兵不可。當今繼位君主忽視根本道理，昏於教化、亂於治理，又沉溺言辭辯說。由此看來，大王果然不能實行我的主張。」',
    analysis: '【蘇秦以戰反駁緩議】秦王用「毛羽未豐」等四層比喻婉拒，蘇秦則列舉古代征伐，進而描寫制度、盟約、辯說都未能止戰，論證霸業仍須武力。這是游說者為求進用的立場性論證；文本把「兵勝於外」與「義強於內」並列，並非單純主張無限制暴力。',
  },
  'zhan-guo-ce_ch-3_p-4': {
    translation: '蘇秦十次上書游說秦王，主張都未被採用。黑貂皮衣穿破了，百斤黃金用盡，生活資用斷絕，只得離秦返鄉。他纏著綁腿、穿草鞋，背書挑袋，形體枯瘦，臉色黧黑，神情慚愧。回家後，妻子不停下織機，嫂嫂不替他做飯，父母也不跟他說話。蘇秦長歎：「妻不把我當丈夫，嫂不把我當小叔，父母不把我當兒子，都是我在秦國失敗之罪。」他連夜翻出數十箱書，找到《太公陰符》的謀略，伏案誦讀，選擇熟習其中內容，用來研究揣情摩意之術。讀到想睡，便拿錐刺自己的大腿，血一直流到腳。他說：「哪有游說君主卻不能使他拿出金玉錦繡，讓自己取得卿相尊位的道理？」一年後揣摩術成，他說：「這才真正可以游說當世君主了！」',
    analysis: '【懸梁刺股典故的原貌】「股」是大腿，不是臀部；「羸縢履蹻」寫其捆腿穿草鞋的困頓。此段突出蘇秦求取金玉卿相的功利動機，鮑彪注也批評其志向止於富貴；因此不宜只抽成單純勵志故事。',
  },
  'zhan-guo-ce_ch-3_p-5': {
    translation: '於是蘇秦靠近燕國的烏集闕，在華麗屋宇下見到並游說趙王，拍掌暢談。趙王非常高興，封他為武安君，授予相印，又給兵車百乘、錦繡千匹、白璧百雙、黃金萬鎰隨行。他締結合縱、拆散連橫，以壓制強秦；蘇秦在趙任相期間，秦國關門不能向東出兵。當時天下廣大、人民眾多，王侯威勢與謀臣權力，都要取決於蘇秦的策略。不耗一斗糧、不勞一名士兵、不使一名戰士作戰、不斷一根弓弦、不折一支箭，諸侯相親勝過兄弟。由此說，賢人在位天下便服，一人受用天下便從；要在政務、朝廷中發揮作用，不必在疆場恃勇。蘇秦盛時，運用萬鎰黃金，車轂相接、騎從不斷，沿途光彩耀目；崤山以東各國望風歸從，使趙國地位大為提高。蘇秦原只是窮巷破門、桑木門戶彎木門樞的貧士，卻能乘車按轡橫行天下，在朝廷游說諸侯君主，堵住近臣之口，天下無人能與他抗衡。',
    analysis: '【以外交代替戰場】本段以「不費斗糧」五組排比誇張合縱的非戰效果，再以貧士出身與車騎黃金形成強烈反差。「式於廊廟」指在朝廷施展政治，不靠境外武力。此為文學化頌辭，蘇秦年代與合縱事跡仍須和《史記》及出土《戰國縱橫家書》互證。',
  },
};

function splitSentences(text) {
  return text.match(/[^。！？；]+[。！？；]?/g)?.map(value => value.trim()).filter(Boolean) ?? [text];
}

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
let [works, chapters, passages, sentences] = matches.map(match => JSON.parse(decodeURIComponent(match[1])));
const work = works.find(item => item.id === 'zhan-guo-ce');
for (const [passageId, canonicalText] of Object.entries(canonicalCorrections)) {
  const passage = passages.find(item => item.id === passageId);
  if (!passage) throw new Error(`Missing ${passageId}`);
  work.totalChars += canonicalText.length - passage.canonicalText.length;
  passage.canonicalText = canonicalText;
  sentences = sentences.filter(sentence => sentence.passageId !== passageId);
  passage.sentenceIds = splitSentences(canonicalText).map((sentenceText, index) => {
    const sentenceId = `${passageId}_s-${index + 1}`;
    sentences.push({ id: sentenceId, passageId, order: index + 1, canonicalText: sentenceText, cue: sentenceText[0], chunks: [{ id: `${sentenceId}_c-1`, sentenceId, order: 1, text: sentenceText, cue: sentenceText[0] }] });
    return sentenceId;
  });
}
let dataIndex = 0;
worksSource = worksSource.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () => `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify([works, chapters, passages, sentences][dataIndex++]))}"))`);
fs.writeFileSync(worksFile, worksSource, 'utf8');

const readingAidFile = 'src/data/readingAid.ts';
let aidSource = fs.readFileSync(readingAidFile, 'utf8');
const marker = '\n}\n\nexport function getPassageReadingAid';
for (const [id, aid] of Object.entries(aids)) {
  const entry = `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},\n`;
  const pattern = new RegExp(`  '${id}': \\{[\\s\\S]*?\\n  \\},\\n`);
  if (pattern.test(aidSource)) aidSource = aidSource.replace(pattern, entry);
  else aidSource = aidSource.replace(marker, `\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync(readingAidFile, aidSource, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = ['https://ctext.org/zhan-guo-ce/qin-yi/zh', 'https://zh.wikisource.org/zh-hant/戰國策_(鮑彪注,_四庫全書本)/全覽', '何建章《戰國策注釋》秦策一'];
for (const passageId of Object.keys(aids)) {
  const canonicalVerified = Object.hasOwn(canonicalCorrections, passageId);
  const review = { passageId, canonicalText: canonicalVerified ? 'verified' : 'pending', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29', notes: canonicalVerified ? '依鮑彪注四庫本逐字改正轉錄訛字，並同步重建逐句資料。' : '白話與解析已重審；原文史事及版本仍待進一步紙本校勘。' };
  const index = editorial.reviews.findIndex(item => item.passageId === passageId);
  if (index >= 0) editorial.reviews[index] = { ...editorial.reviews[index], ...review }; else editorial.reviews.push(review);
}
editorial.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8');
console.log('Reviewed Qin Yi passages 1-5; canonical passages 2-5 corrected and verified.');
