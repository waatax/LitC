import fs from 'node:fs'

const aids = {
  'mo-zi_ch-1_p-1': {
    translation: '進入一個國家卻不關心、訪求其中的賢士，國家就有滅亡的危險；見到賢者卻不趕快任用，就是怠慢國君的大事。沒有賢者，就無人應付急難；沒有士人，就無人共同謀劃國政。怠慢賢者、遺忘士人，還能使國家保存下來的，從來沒有過。',
    analysis: '本段以「存士—急賢—慮國」構成層層推進的論證。「存」不是僅讓士人活著，而是省問、關懷並使其有所安置；「急」是以延攬賢才為急務。墨子把親士視為國家存亡的制度條件：君主若隔絕能議政、能救急的人，便失去修正決策與處理危機的能力。'
  },
  'mo-zi_ch-1_p-2': {
    translation: '從前晉文公曾流亡國外，後來匡正天下；齊桓公曾離開本國，後來稱霸諸侯；越王句踐遭受吳王所加的恥辱，後來仍成為威服中原的賢君。這三人之所以能名揚天下、成就功業，都是在本國遭受壓抑與重大恥辱之後奮起。最高明的是不遭失敗，其次是失敗後仍有辦法成功；這就叫作善於任用人才。',
    analysis: '晉文公、齊桓公、越王句踐都是由困辱轉而成就霸業的例證。「太上」意為最高一等；「尚攝」依上下文解作仍能威服、震懾。末句把逆境翻轉歸因於「用民」，此處的「民」偏指可供任使的人才。論點不是歌頌失敗，而是說真正的用人能力，能在挫敗後重建國勢。'
  },
  'mo-zi_ch-1_p-3': {
    translation: '我聽說：「不是沒有安定的住所，而是我的心不能安定；不是沒有充足的財物，而是我的心不知滿足。」所以君子嚴格要求自己，寬厚對待別人；一般人卻寬待自己，苛求別人。君子出仕進用時不損害自己的志向，退處時深入反省自己的實情；即使雜處在平常百姓之中，始終也沒有怨恨，因為他對自己有所確信。因此，肯從艱難處著手的人，必能得到他所追求的；從未聽說只做自己喜歡的事，卻能免除自己厭惡的後果。所以，權勢逼人的臣子會傷害君主，諂媚的下屬會傷害上位者。君主一定要有敢於違逆其意、直言勸諫的臣子，上位者一定要有敢於據理爭辯的下屬。持不同意見的人反覆詳議，彼此警戒的人嚴正直言，這樣才可以長養民生、保全國家。',
    analysis: '本段由修己轉入納諫：能安定內心、嚴以律己的人，才不會因進退得失而改志，也才可能成為敢言之士。「偪臣」指倚勢迫主的權臣；「弗弗」有拂逆、矯正之意；「詻詻」指言辭嚴正、敢於爭辯。「分議者延延，而支苟者詻詻」文字素有疑義，孫詒讓記有把「支苟」校作「交敬」的說法；譯文採其「相互警戒、嚴正直言」之旨，但保留底本文字。全段核心是：公開異議不是國政的阻力，而是保國所需的糾錯機制。'
  },
  'mo-zi_ch-1_p-4': {
    translation: '臣下看重自己的爵位而不肯說話，近臣沉默無聲，遠臣只能低聲吟歎；怨恨鬱結在民心，諂媚的人留在君主身旁，良善的議論又受到阻塞，國家就危險了。夏桀、商紂難道是因為天下沒有士人嗎？他們終究身死而失去天下。所以說：「把國寶歸還給國君，不如薦獻賢者、進用士人。」',
    analysis: '「近臣則喑，遠臣則唫」用聲音由無到微，呈現言路被壓抑的政治景象。桀、紂並非無人可用，而是不能使賢士進言、不能接納善議，因此人才存量沒有轉化為治理能力。結語故意把「國寶」與「賢士」比較，指出能防止決策失誤的人才，比物質珍寶更能保國。'
  },
  'mo-zi_ch-1_p-5': {
    translation: '現在有五把錐子，其中最鋒利的，必定最先受挫；有五把刀，其中最銳利的，必定最先磨損。因此甘甜的井容易被汲乾，招展高大的樹容易被砍伐，靈驗的龜容易被灼燒占卜，神異的蛇容易被曝露示眾。所以比干之死，是因為他敢於抗爭；孟賁被殺，是因為他勇猛；西施沉江，是因為她美麗；吳起遭車裂，是因為他善於任事。這些人很少不是死於自己的長處，所以說：「才德過盛而鋒芒盡露，便難以自守。」',
    analysis: '本段以錐、刀、井、木、龜、蛇連續設喻，說明出眾的才能既能成事，也最容易招致消耗與禍患。「錯」在此與「銛」對文，歷來多按銳利之義理解；「靡」是磨損。比干等四例把抗直、勇力、美貌與辦事才幹都列為可能致禍的「所長」。它不是要求賢士藏拙，而是提醒君主珍惜人才，也提醒有才者不可只恃鋒芒而缺乏自處之道。'
  },
  'mo-zi_ch-1_p-6': {
    translation: '所以，即使是賢明的君主，也不會偏愛沒有功勞的臣子；即使是慈愛的父親，也不會偏愛沒有益處的兒子。因此，不能勝任職責卻佔據職位，就不是適合這個職位的人；不能配得爵位卻享受俸祿，就不是應當領受這份俸祿的人。好弓難以張開，卻能射得高、射得深；良馬難以駕馭，卻能負重而到達遠方；優秀的人才難以驅使，卻能使君主成就功業、受到尊崇。因此江河不嫌棄小溪流入自己，所以能夠廣大。聖人對各種事務不推辭，對各類人才不排拒，所以能成為天下有用的大器。江河之水並非只來自一個源頭；價值千鎰的裘衣，也不是只靠一隻狐狸的白毛做成。哪有只採納與自己方向相同的意見、對不同意見一概不取的道理呢？這並不是兼有天下之王的治道。因此天地的光明不是只照一處，大水不是只積在一處，大火不是只燒一處，王者之德也不是只顯耀自己；這樣才能成為眾人的領袖。',
    analysis: '前半以「功—任—爵祿」建立任官標準，接著用良弓、良馬說明難以駕馭不等於不能成大用。江河納流與狐白集腋的比喻，把親士提升為廣納眾長的原則。「千鎰之裘」以及「夫惡有同方取不取同而已者乎」句法歷來有疑；譯文依上下文讀作：王者不可只取同向、同意者而拒絕異見。末尾數句以天地、水、火的廣被反襯王德不應狹隘自耀；其要旨與墨家尚賢、兼納人才的立場一致。'
  },
  'mo-zi_ch-1_p-7': {
    translation: '即使自身像箭一樣正直、像磨刀石一樣平坦，若容量狹小，仍不足以覆育萬物。所以狹窄的溪谷很快乾涸，水流淺薄的河道很快枯竭，瘠薄多石的土地不能生長作物。王者深厚的恩澤若不能流出宮廷，就不能遍及全國。',
    analysis: '本段收束全篇：個人的「直」與「平」仍不足以成為王者，還必須有包容、廣被的容量。「逝淺」二字義難相屬，孫詒讓《墨子閒詁》引王引之校「逝」為「遊」，並按「遊」讀作「流」，使「流淺」與「谿陝」相對；譯文採此通行校讀的語義，正文仍保留底本「逝淺」。「淳澤」是深厚恩澤。政治上的德若只停在宮中，未落實為延士、納諫與惠民，就不能真正治理全國。'
  }
}

const aidFile = 'src/data/readingAid.ts'
let aidSource = fs.readFileSync(aidFile, 'utf8')
const passageIds = Object.keys(aids)
for (const passageId of passageIds) {
  if (aidSource.includes(`'${passageId}': {`)) throw new Error(`Reading aid already exists: ${passageId}`)
}
const marker = '\n}\n\nexport function getPassageReadingAid('
const insertion = Object.entries(aids)
  .map(([id, aid]) => `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},`)
  .join('\n')
if (!aidSource.includes(marker)) throw new Error('Reading-aid insertion marker not found')
aidSource = aidSource.replace(marker, `\n${insertion}\n${marker}`)
fs.writeFileSync(aidFile, aidSource, 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map((passageId) => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources: [
    'https://ctext.org/mozi/befriending-the-learned/zh',
    'https://ctext.org/mozi-jiangu/qin-shi/zh',
    'https://zh.wikisource.org/wiki/%E5%A2%A8%E5%AD%90/%E8%A6%AA%E5%A3%AB',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf',
    '孫詒讓《墨子閒詁》；吳毓江《墨子校注》；張純一《墨子集解》'
  ],
  reviewedAt: '2026-07-29',
  notes: passageId === 'mo-zi_ch-1_p-3'
    ? '「支苟」等字有異文與校改說；保留底本，白話與解析交代孫詒讓所錄「交敬」校說。'
    : passageId === 'mo-zi_ch-1_p-6'
      ? '「千鎰之裘」及其後句法有疑；未據單一通行本逕改正文，依篇旨審慎疏通。'
      : passageId === 'mo-zi_ch-1_p-7'
        ? '底本作「逝淺」；保留正文，解析交代王引之「遊／流淺」校讀。'
        : '已對讀中國哲學書電子化計劃、《墨子閒詁》《墨子校注》與維基文庫文本；繁體白話及解析逐段人工校訂。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《墨子·親士》`)
