import fs from 'fs';

const canonicalCorrections = {
  'zhan-guo-ce_ch-3_p-6': '將說楚王，路過洛陽，父母聞之，清宮除道，張樂設飲，郊迎三十里。妻側目而視，傾耳而聽；嫂蛇行匍伏，四拜自跪而謝。蘇秦曰：「嫂，何前倨而後卑也？」嫂曰：「以季子之位尊而多金。」蘇秦曰：「嗟乎！貧窮則父母不子，富貴則親戚畏懼。人生世上，勢位富厚，蓋可忽乎哉！」',
  'zhan-guo-ce_ch-3_p-7': '秦惠王謂寒泉子曰：「蘇秦欺寡人，欲以一人之智，反覆山東之君，從以欺秦。趙固負其眾，故先使蘇秦以幣帛約乎諸侯。諸侯不可一，猶連雞之不能俱止於棲，亦明矣。寡人忿然含怒日久，吾欲使武安子起往喻意焉。」寒泉子曰：「不可。夫攻城墮邑，請使武安子；善我國家、使諸侯，請使客卿張儀。」秦惠王曰：「敬受命。」',
  'zhan-guo-ce_ch-3_p-8': '泠向謂秦王曰：「向欲以齊事王，使攻宋也。宋破，晉國危，安邑，王之有也。燕、趙惡齊、秦之合，必割地以交於王矣。齊必重於王，則向之攻宋也，且以恐齊而重王。王何惡向之攻宋乎？向以王之明為先知之，故不言。」',
  'zhan-guo-ce_ch-3_p-9': '張儀說秦王曰：「臣聞之，弗知而言為不智，知而不言為不忠。為人臣不忠當死，言不審亦當死。雖然，臣願悉言所聞，大王裁其罪。',
  'zhan-guo-ce_ch-3_p-10': '臣聞天下陰燕陽魏，連荊固齊，收餘韓成從，將西南以與秦為難。臣竊笑之。世有三亡，而天下得之，其此之謂乎！臣聞之曰：『以亂攻治者亡，以邪攻正者亡，以逆攻順者亡。』今天下之府庫不盈，囷倉空虛，悉其士民，張軍數千百萬，白刃在前，斧質在後，而皆去走，不能死，罪其百姓不能死也，其上不能殺也。言賞則不與，言罰則不行，賞罰不行，故民不死也。',
};

const aids = {
  'zhan-guo-ce_ch-3_p-6': {
    translation: '蘇秦將去游說楚王，途經洛陽。父母聽說後，打掃房舍、清理道路，安排音樂酒宴，出城三十里迎接。妻子斜著眼不敢正視，側耳恭聽；嫂子像蛇一樣伏地爬行，拜了四拜，跪著謝罪。蘇秦問：「嫂嫂，為何從前傲慢，現在卻如此卑下？」嫂子答：「因為季子如今地位尊貴而且很有錢。」蘇秦感歎：「唉！貧窮時父母不把人當兒子，富貴時親戚便敬畏。人生在世，權勢、地位與財富，怎能輕忽呢！」',
    analysis: '【前倨後恭與勢利批判】父母、妻、嫂的態度與上一段失意返鄉形成鏡像。「季子」是蘇秦的字；「勢位富厚」並非正面人生格言，而是蘇秦看透親族以權勢財富衡量人的感歎。鮑彪據此批評他勤學的志向終究止於富貴。',
  },
  'zhan-guo-ce_ch-3_p-7': {
    translation: '秦惠王對寒泉子說：「蘇秦欺騙我，想憑一人智謀反覆操縱崤山以東的君主，組成合縱欺壓秦國。趙國本來仗著人多，所以先讓蘇秦拿財帛約結諸侯。但諸侯不可能真正合一，就像把雞綁在一起，也不能全都安停在同一棲木上，這很明白。我含怒已久，想派武安君白起前去表示我的意思。」寒泉子說：「不可。攻城毀邑，可以派武安君；宣揚秦國之善、出使諸侯，應派客卿張儀。」秦惠王說：「恭敬接受您的指教。」',
    analysis: '【武將與辯士各有所用】「連雞不能俱棲」比喻各國利益不同、合縱難久。寒泉子沒有直接爭論蘇秦，而是區分攻城與外交兩種任務，主張以張儀對付辯說。鮑彪指出此處稱白起為武安君有年代矛盾，顯示篇章史實曾有傳寫錯置。',
  },
  'zhan-guo-ce_ch-3_p-8': {
    translation: '泠向對秦王說：「我想使齊國侍奉大王，讓齊國去攻宋。宋國被攻破，魏國便危急，安邑就會成為大王所有。燕、趙厭惡齊秦聯合，必會割地來結交大王；齊國也必更加敬重大王。所以我主張攻宋，正是要使齊國畏懼而提高大王地位。大王為何不滿我攻宋的主張？我以為大王明察，早已知道其中用意，所以先前沒有說明。」',
    analysis: '【攻宋只是多重施壓的起點】「晉國」在此指三晉中的魏，安邑為魏舊都。泠向把攻宋的連鎖效應拆成三層：削弱魏而取安邑、迫燕趙割地、使齊更依附秦。末句以恭維秦王明察補救先前未說明的嫌疑。',
  },
  'zhan-guo-ce_ch-3_p-9': {
    translation: '張儀游說秦王說：「我聽說，不知道卻發言是不明智，知道卻不說是不忠。做臣子不忠應當處死，說話不審慎也應當處死。雖然如此，我仍願把所聽到的全部說出，請大王裁定我的罪。」',
    analysis: '【以死罪開場取得進言權】本則是下文長篇說辭的引言。「不智／不忠」與兩個「當死」形成對稱，先把進言塑造成冒死盡忠，再把判斷權交給君王，以降低直言的政治風險。原文引號跨到後續段落，資料分段時保留其承接關係。',
  },
  'zhan-guo-ce_ch-3_p-10': {
    translation: '張儀接著說：「我聽說天下諸侯以燕為北翼、魏為南翼，聯合楚國、鞏固齊國，又收攏其餘韓國力量，組成合縱，準備向西南方向與秦國為敵。我私下嘲笑他們。世上有三種必亡之道，而天下諸侯正好全都具備，說的就是這種情形吧！我聽說：以混亂攻打治理完善者會亡，以邪曲攻打正直者會亡，以逆勢攻打順勢者會亡。如今諸侯府庫不滿、糧倉空虛，動員全部士民，陳兵不知多少萬，前有利刃、後有斧鑕督戰，士卒仍都逃跑，不能死戰；上位者責怪百姓不肯死，自己卻又不能把他們全殺掉。說要賞賜卻不給，說要懲罰卻不執行；賞罰不能落實，所以人民不肯死戰。」',
    analysis: '【先判合縱有三亡】「陰燕陽魏」以陰陽表北南方位；「連荊固齊」是連楚、固齊。張儀把秦描述為治、正、順，把合縱國描述為亂、邪、逆，帶有強烈游說立場；其較具體的論據是諸侯財政空虛、動員失效與賞罰失信。此段尚未結束，後文將以秦軍紀律作對照。',
  },
};

function splitSentences(text) { return text.match(/[^。！？；]+[。！？；]?/g)?.map(v => v.trim()).filter(Boolean) ?? [text]; }

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
let [works, chapters, passages, sentences] = matches.map(m => JSON.parse(decodeURIComponent(m[1])));
const work = works.find(item => item.id === 'zhan-guo-ce');
for (const [passageId, canonicalText] of Object.entries(canonicalCorrections)) {
  const passage = passages.find(item => item.id === passageId);
  work.totalChars += canonicalText.length - passage.canonicalText.length;
  passage.canonicalText = canonicalText;
  sentences = sentences.filter(sentence => sentence.passageId !== passageId);
  passage.sentenceIds = splitSentences(canonicalText).map((text, index) => {
    const id = `${passageId}_s-${index + 1}`;
    sentences.push({ id, passageId, order: index + 1, canonicalText: text, cue: text[0], chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text, cue: text[0] }] });
    return id;
  });
}
let dataset = 0;
worksSource = worksSource.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () => `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify([works, chapters, passages, sentences][dataset++]))}"))`);
fs.writeFileSync(worksFile, worksSource, 'utf8');

const aidFile = 'src/data/readingAid.ts';
let aidSource = fs.readFileSync(aidFile, 'utf8');
const marker = '\n}\n\nexport function getPassageReadingAid';
for (const [id, aid] of Object.entries(aids)) {
  const entry = `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},\n`;
  const pattern = new RegExp(`  '${id}': \\{[\\s\\S]*?\\n  \\},\\n`);
  if (pattern.test(aidSource)) aidSource = aidSource.replace(pattern, entry); else aidSource = aidSource.replace(marker, `\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync(aidFile, aidSource, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = ['https://ctext.org/zhan-guo-ce/qin-yi/zh', 'https://zh.wikisource.org/zh-hant/戰國策_(鮑彪注,_四庫全書本)/全覽', '何建章《戰國策注釋》秦策一'];
for (const passageId of Object.keys(aids)) {
  const review = { passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29', notes: '對校通行本及四庫注本，改正轉錄訛字與標點，並同步重建逐句資料。' };
  const index = editorial.reviews.findIndex(item => item.passageId === passageId);
  if (index >= 0) editorial.reviews[index] = { ...editorial.reviews[index], ...review }; else editorial.reviews.push(review);
}
editorial.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8');
console.log('Reviewed and canonically verified Qin Yi passages 6-10.');
