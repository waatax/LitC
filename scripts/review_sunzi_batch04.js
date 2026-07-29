import fs from 'fs';

const corrections = {
  'art-of-war_ch-7_p-1': {
    analysis: '【主旨】軍爭是在雙方接觸前後爭奪有利位置與先機，難處是以迂迴造成實際領先、把途中風險轉成利益。\n【詞義】「交和而舍」各家解法不一，大致指兩軍接近、對峙而駐止；「軍爭」不是軍內爭鬥，而是與敵爭利；「迂其途」可由我方走迂路，也可包含使敵繞路；「以患為利」是把不利條件轉化利用。\n【章法】先說軍爭最難，再以後發先至說明迂直之計，末句同時標出利與危。\n【思想】晚出而先至不靠單純疾走，而靠路線、誘敵、情報與目標選擇；任何機動優勢都伴隨補給、疲勞和失序風險。'
  },
  'art-of-war_ch-7_p-2': {
    translation: '全軍帶著所有輜重去爭利，行動遲緩，往往趕不上；丟下部隊或輜重輕裝爭利，物資又會損失。因此捲起甲胄疾走，日夜不停，加倍行程：趕一百里爭利，三軍將領都可能被擒，強健者先到、疲弱者落後，通常只有十分之一到達；趕五十里爭利，前軍主將可能受挫，約一半到達；趕三十里爭利，也只有三分之二到達。所以軍隊沒有輜重便會敗亡，沒有糧食便會敗亡，沒有預備物資便會敗亡。不知道諸侯的謀略，不能預先結交；不了解山林、險阻、沼澤等地形，不能行軍；不使用熟悉當地的嚮導，不能取得地利。',
    analysis: '【主旨】爭先不能只比速度：全軍太重則不及，輕裝過度又會失去人員、輜重和補給；有效機動須有外交、地形情報與嚮導。\n【文本校正】原資料「不能鄉導者」語義不通，宋刊《十一家注孫子》、趙注本等作「不用鄉導者」，今據以改正。電子本間仍可見訛文，故以影印古籍互證。\n【詞義】「委軍」可解為棄置部隊或丟下輜重；「三將軍」多指上、中、下三軍之將；「蹶」是受挫；「委積」是預置儲備；「豫交」是預先締交。\n【思想】百里、五十里、三十里及到達比例是古代行軍的風險模型，不是現代固定門檻；不變的是速度、完整性、後勤三者必須平衡。'
  },
  'art-of-war_ch-7_p-3': {
    translation: '所以軍事行動靠隱真示假建立，依據利益決定進退，以兵力分散、集中作為變化。因此，迅速時像風，舒緩整齊時像森林，侵襲時像烈火，駐止時像山嶽，隱蔽難知時像陰雲，發動時像雷霆。掠取敵境資源要分配兵力，擴展所得地域要分配利益，權衡輕重後才行動。先懂得迂直之計的一方取勝，這是軍爭的原則。',
    analysis: '【主旨】軍爭的機動不是永遠求快，而是依目標在疾、徐、攻、守、隱、發六種狀態間有紀律地轉換。\n【詞義】「以詐立」是以資訊欺敵建立行動條件；「分合」是兵力分散集中；「徐如林」重在行列整齊、徐進不亂；「陰」指幽暗難測；「廓地分利」可解拓地後分守、分配利益；「懸權」像懸秤般衡量輕重。\n【章法】風林火山陰雷六喻把抽象機動轉成可感形象，隨後回到資源分配與權衡。\n【界限】「侵掠如火」描述古代敵境作戰，不能成為傷害平民的正當化；現代軍事行動仍受區分、比例與必要性原則限制。'
  },
  'art-of-war_ch-7_p-4': {
    analysis: '【主旨】大部隊在噪音、距離與視線受限的戰場上，必須以統一的聽覺、視覺信號協同行動，避免個人擅進擅退。\n【詞義】《軍政》是今已佚的古兵書；「金鼓」泛指鉦、鼓等聲號，「旌旗」是視覺信號；「一人之耳目」不是只服務一人，而是使眾人視聽一致；「專一」是行動集中統一；「變人之耳目」是隨晝夜條件調整信息媒介。\n【章法】先引權威說明信號由來，再推導紀律效果，最後分夜戰與晝戰。\n【思想】本段本質是指揮通信：共同協議的信號降低協調成本。但統一行動不等於取消回報與判斷，可靠系統仍需處理誤傳、失聯和情勢變化。'
  },
  'art-of-war_ch-7_p-5': {
    analysis: '【主旨】可利用時間、秩序、距離、休整與補給差，削弱敵軍士氣、主將心志和實際體力。\n【詞義】「奪氣」是挫奪部隊銳氣，「奪心」是動搖將領判斷；朝、晝、暮既可指一日士氣節律，也概括初銳、漸惰、思歸的階段；「治氣、治心、治力」是管理士氣、心理與體能條件。\n【章法】先說可奪，再以銳—惰—歸三段變化說避實擊虛，最後列三組以己之治靜逸飽待敵之亂譁勞飢。\n【思想】這不是宣稱士氣每天機械地晨高暮低，而是要求不在敵氣最盛時硬碰，並以後勤與休整形成可持續優勢。'
  },
  'art-of-war_ch-7_p-6': {
    analysis: '【主旨】不要攻擊秩序嚴整、地勢有利或銳氣正盛之敵；對敗退、誘餌、歸師和窮寇，也要辨別其心理與反擊風險。\n【詞義】「邀」是半路截擊；「正正」「堂堂」寫旗幟陣容嚴整；「背丘」指敵背靠高地、順勢而來；「佯北」是假裝敗逃；「餌兵」是誘敵之兵；「圍師必闕」是包圍時故意留一缺口，使敵仍存逃生念頭；「窮寇」是陷於絕境之敵。\n【章法】前兩禁總說不擊盛整，後列高陵至窮寇八項情境規則。\n【思想】「勿迫」不是放棄追擊，而是避免把尚可控制的敵人逼成死戰；具體是否追、圍、攻仍須結合任務和風險，不能把清單當成脫離情境的禁令。'
  },
  'art-of-war_ch-8_p-1': {
    translation: '孫子說：將領接受國君命令、集結軍隊後，在難以通行的「圮地」不要久駐，在道路四通的「衢地」要聯合鄰近諸侯，在進退困難的「絕地」不要停留，在出入口受限的「圍地」要設法謀變，在無退路的「死地」要奮戰。有些道路不應走，有些敵軍不應打，有些城池不應攻，有些地方不應爭；若君命與現場軍情及國家利益明顯衝突，也有不照辦的情形。通曉各種權變利益的將領，才算懂得用兵；不通權變，即使知道地形，也不能取得地利；治軍不懂權變，即使知道地利，也不能充分發揮部隊作用。',
    analysis: '【主旨】地形知識只有經過權變才有用；將領必須判斷哪些路、敵、城、地乃至命令不符合整體軍事目的。\n【詞義】圮、衢、絕、圍、死五地的具體定義在〈九地〉另有詳說；「九變」不一定機械對應九項，重點是多端權變；「有所不受」是特定命令因現場條件不宜執行，不是將領一般性不服從。\n【章法】先列五地對策，再列五個「有所不」，最後正反說明通變與否的結果。\n【界限】古代將權不能直接套用現代軍政。現代軍人對合法命令有服從義務、對明顯非法命令則不得執行；臨機裁量也須在授權、交戰規則與問責體系內。'
  },
  'art-of-war_ch-8_p-2': {
    translation: '所以明智者思考事情，必定把利益與危害交互納入：在有利情況中同時考慮危害，事情才可望可靠完成；在危害情況中同時尋找有利條件，禍患才可能解除。因此，以威脅危害使諸侯屈服，以繁重事務使諸侯奔走，以可圖之利使諸侯趨赴。',
    analysis: '【主旨】權變不是追逐眼前利益，而是利中見害、害中見利，讓方案在反面條件下仍可成立。\n【詞義】「雜」是交互參酌；「務可信」的「信」可解伸展、達成，也有可靠之義，各本注解不一；「患可解」是找到解除危機的路徑；「屈、役、趨」分別以害、事業與利益影響諸侯行為。\n【章法】先提出利害互參的認知原則，再把同一原則用於外交控制。\n【思想】這接近壓力測試：好方案要包含失敗條件和補救，壞局面也要尋找可利用資源。但「害」在古代是對敵手施壓，現代國際行動仍受法律與人道界限。'
  },
  'art-of-war_ch-8_p-3': {
    analysis: '【主旨】安全不能建立在敵人可能不來、不攻的願望上，而要建立在自己已準備接敵、已形成難攻條件。\n【詞義】兩個「恃」形成所依據者的對照；「有以待之」是有足以應付的方法與準備；「有所不可攻」是有使敵難以得手的防禦條件，不是絕對永不被攻破。\n【章法】兩組「無恃……恃……」完全平行，把外在希望轉成內在可控能力。\n【思想】這是風險管理而非悲觀主義：不以低機率事件不發生作唯一保障。準備也須依威脅更新，若只建固定工事而忽略新型態攻擊，仍未真正做到「有以待之」。'
  },
  'art-of-war_ch-8_p-4': {
    translation: '將領有五種危險的性格偏執：一味死拚，可能被設法殺死；一味貪生，可能受迫而被俘；急躁易怒，可能被侮辱挑動；過分愛惜廉潔名聲，可能因受辱而中計；愛民而不能權衡，可能因敵人侵擾百姓而處處受牽制。這五種危險，是將領性格過度所造成的過失，也是用兵的災害。軍隊覆滅、將領被殺，往往與這五種偏失有關，不能不仔細考察。',
    analysis: '【主旨】勇、求生、廉潔、愛民等特質一旦僵化為可預測的單一反應，都可能被敵人利用；將領須能權衡而不受情緒與名聲綁架。\n【詞義】「必死」是只知死戰，「必生」是不惜代價求生；「忿速」是急躁易怒；「廉潔」在此偏重愛名、不能受辱，不是否定廉潔本身；「愛民可煩」是敵可用騷擾民眾使其疲於救援。\n【章法】五項都以性格—可受害方式配對，末段由個人偏失推到覆軍殺將。\n【思想】問題不在德目本身，而在「必」與失衡。尤其不能把「愛民可煩」曲解為不應愛民；它要求把保護責任轉化為周密防備，避免被敵方選擇攻擊節奏。'
  }
};

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
function updateEncoded(name, typePattern, mutate) {
  const re = new RegExp(`(export const ${name}: ${typePattern} = JSON\\.parse\\(decodeURIComponent\\(\")([\\s\\S]*?)(\"\\)\\);)`);
  const match = worksSource.match(re);
  if (!match) throw new Error(`Missing ${name}`);
  const data = JSON.parse(decodeURIComponent(match[2]));
  mutate(data);
  worksSource = worksSource.replace(re, `$1${encodeURIComponent(JSON.stringify(data))}$3`);
}
updateEncoded('passages', 'Passage\\[\\]', (items) => {
  const passage = items.find((item) => item.id === 'art-of-war_ch-7_p-2');
  if (!passage || !passage.canonicalText.includes('不能鄉導者')) throw new Error('Unexpected passage');
  passage.canonicalText = passage.canonicalText.replace('不能鄉導者', '不用鄉導者');
  passage.sourceRefs = [
    { label: '宋本《十一家注孫子》', edition: '國家圖書館藏宋刊本' },
    { label: '趙注《孫子十三篇》', edition: '國家圖書館藏本' }
  ];
});
updateEncoded('sentences', 'Sentence\\[\\]', (items) => {
  const sentence = items.find((item) => item.id === 'art-of-war_ch-7_p-2_s-8');
  if (!sentence || !sentence.canonicalText.includes('不能鄉導者')) throw new Error('Unexpected sentence');
  sentence.canonicalText = sentence.canonicalText.replace('不能鄉導者', '不用鄉導者');
  const chunk = sentence.chunks.find((item) => item.text === '不能鄉導者');
  if (!chunk) throw new Error('Missing chunk');
  chunk.text = '不用鄉導者';
});
fs.writeFileSync(worksFile, worksSource, 'utf8');

const aidFile = 'src/data/readingAid.ts';
let aid = fs.readFileSync(aidFile, 'utf8');
const pattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let changed = 0;
aid = aid.replace(pattern, (whole, id, oldTranslation) => {
  const item = corrections[id];
  if (!item) return whole;
  changed += 1;
  const translation = item.translation ?? JSON.parse(`"${oldTranslation}"`);
  return `'${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(item.analysis)}\n  }`;
});
if (changed !== 10) throw new Error(`Expected 10 changes, got ${changed}`);
fs.writeFileSync(aidFile, aid, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
const sources = ['https://ctext.org/art-of-war/zh', 'https://www.chineseclassic.com/content/1777', 'https://tcmb.culture.tw/zh-tw/detail?id=20130813000029&indexCode=BOCH_CountryCulture_61', 'https://www.leeyuri.org/Daxi-8T-YinZhu.pdf'];
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate ${passageId}`);
  const chapterSource = passageId.startsWith('art-of-war_ch-7') ? 'https://ctext.org/art-of-war/maneuvering/zh' : 'https://ctext.org/art-of-war/variation-in-tactics/zh';
  reviewData.reviews.push({ passageId, canonicalText: passageId === 'art-of-war_ch-7_p-2' ? 'verified' : 'pending', translation: 'verified', analysis: 'verified', sources: [...sources, chapterSource], reviewedAt: '2026-07-29' });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log('Reviewed Sunzi chapters 7-8 and corrected 不用鄉導者.');
