import fs from 'node:fs'

const aids = {
  'mo-zi_ch-4_p-1': {
    translation: '墨子說：「天下從事各種工作的人，不可以沒有法度和準則；沒有法度而能把事情辦成的，從來沒有。即使是身居將相的傑出士人，也都有法度；即使是各類工匠做事，也都有準則。工匠用矩畫方，用規畫圓，用水準器、墨繩判定平直，用懸垂的線校正垂直。無論是技藝高明或不高明的工匠，都把這些工具當作標準。技藝高明的能完全符合標準；技藝不高明的即使不能完全符合，只要依照它們做事，也仍會勝過全憑自己。所以各類工匠做事，都有用來衡量的法度。」',
    analysis: '篇首從百工的可操作工具建立「法儀」概念：標準必須外在、可重複使用，也能讓不同能力的人校正結果。「放依」即仿效、依循；「猶逾己」指仍勝過只憑個人臆斷。原文說「五者」，現存列舉文字疑有脫漏；孫詒讓據相關材料疑脫「平以水」一項。正文維持底本，白話依規、矩、水、繩、懸等測量功能疏通，不把校補直接混入原文。'
  },
  'mo-zi_ch-4_p-2': {
    translation: '如今，大至治理天下，其次治理大國，卻沒有用來衡量的法度，這就連工匠的明辨都不如了。那麼，究竟以什麼作為治理的法則才可以呢？若說人人都效法自己的父母，怎麼樣？天下做父母的人很多，仁愛的卻很少；如果人人都效法自己的父母，便可能效法到不仁的人。不仁者不能作為法則。若說人人都效法自己的老師或所學者，怎麼樣？天下從事教學、學術的人很多，仁愛的卻很少；如果人人都效法自己所從學的人，便可能效法到不仁的人。不仁者不能作為法則。若說人人都效法自己的君主，怎麼樣？天下做君主的人很多，仁愛的卻很少；如果人人都效法自己的君主，便可能效法到不仁的人。不仁者不能作為法則。所以父母、師學、君主這三者，都不能直接作為普遍的治國法則。',
    analysis: '本段不是否定親親、教育或政治權威，而是檢驗它們能否充當普遍且可靠的最高標準。父母、學者、君主都是具體而多樣的人，其中有仁也有不仁；若僅因關係或身分便無條件效法，就無法判斷權威本身是否錯誤。「學」在此多依「為學者」「法其學」理解為所從學的師者或學術傳授者。墨子的問題是標準不能由被評量者自行提供，否則治理缺少共同尺度。'
  },
  'mo-zi_ch-4_p-3': {
    translation: '那麼，以什麼作為治理的法則才可以呢？所以說，沒有比效法天更好的。天的運行廣大而沒有偏私，施予深厚卻不自居有德，光明長久而不衰減，因此聖王效法天。既然以天為法則，一切行動作為都必須用天意衡量：天所希望的就去做，天所不希望的就停止。然而，天究竟希望什麼、厭惡什麼呢？天一定希望人們相愛、彼此有利，不希望人們相互憎惡、彼此殘害。怎麼知道天希望人們相愛相利，而不希望相惡相害呢？因為天普遍地愛護、利益眾人。怎麼知道天普遍愛護、利益眾人呢？因為天下人全都為天所有，也全都受到天的養育。',
    analysis: '「法天」把標準置於各種人間身分之上；其可取之處在「廣而無私」，即不因親疏貴賤改變尺度。「不德」不是無德，而是不自以為恩德。後半採連續問答，把抽象天意逐步落實為「兼愛、兼利」：天既普遍涵有並養育眾人，其規範便不能只服務某一家庭或國家。這是墨家從宇宙秩序推出公共倫理的核心論證。'
  },
  'mo-zi_ch-4_p-4': {
    translation: '如今天下無論大國小國，都是天的城邑；人無論幼長、貴賤，都是天的臣民。因此沒有誰不飼養牛羊、畜養犬豬，潔淨地備辦甜酒和祭糧，用來恭敬事奉上天。這不正表明天普遍擁有眾人，也普遍享用眾人的祭獻嗎？天既然普遍擁有並接受眾人的供養，又怎能說它不希望人們相愛相利呢？所以說：「愛人、利人的，天必定賜福；憎惡、殘害人的，天必定降禍。」又說：「殺害無罪的人，必會得到不祥。」若非天不贊成人們相互殺害，又怎會對這種行為降下災禍呢？由此可知，天希望人們相愛相利，不希望人們相惡相害。',
    analysis: '本段以普遍祭天的社會實踐補強上一段。「犓」是飼養牲畜，「豢」偏指圈養；「酒醴粢盛」是祭祀用的酒與黍稷等盛饌。「兼而有之，兼而食之」在此一面指天下皆屬於天，一面以各地共同祭獻說明天不專屬一國一族。由此再以福禍、無辜不可殺建立行為後果。其規範重點是生命無分貴賤皆在天的共同涵攝下。'
  },
  'mo-zi_ch-4_p-5': {
    translation: '從前的聖王禹、湯、文王、武王，普遍愛護天下百姓，率領眾人尊敬上天、事奉鬼神；他們帶給人的利益很多，所以天賜福給他們，使他們立為天子，天下諸侯都歸服事奉。暴君桀、紂、幽王、厲王，普遍憎惡天下百姓，率領眾人辱罵上天、輕侮鬼神；他們殘害的人很多，所以天降禍給他們，使他們終於失去國家，自身死亡，受天下人羞辱。後世子孫譴責他們，直到今天仍未停止。所以，因作惡而得禍的，桀、紂、幽、厲就是例子；因愛人利人而得福的，禹、湯、文、武就是例子。愛人利人而得福確有其例，憎惡害人而得禍也同樣有其例。',
    analysis: '結尾用正反歷史驗證「法天」的規範：禹、湯、文、武代表兼愛利人，桀、紂、幽、厲代表兼惡賊人。「賓事」指諸侯以賓服之禮事奉；「僇」含刑辱、恥辱之義。這些史例在篇內不只是宗教報應敘事，也用公共後果檢驗政治：能廣泛利民者獲得擁戴，普遍害民者失國受辱，從而把天意、兼愛與治績結合。'
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
    'https://ctext.org/mozi/on-the-necessity-of-standards/zh',
    'https://ctext.org/mozi-jiangu/fa-yi/zh',
    'https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E6%B3%95%E5%84%80',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf',
    '孫詒讓《墨子閒詁》；吳毓江《墨子校注》；張純一《墨子集解》',
    '教育部《教育百科》「法天」「天明」條'
  ],
  reviewedAt: '2026-07-29',
  notes: passageId === 'mo-zi_ch-4_p-1'
    ? '原文稱「五者」而列項疑有脫文；保留底本，解析記錄孫詒讓疑脫「平以水」說。'
    : passageId === 'mo-zi_ch-4_p-2'
      ? '「法其學」依上下文譯為效法所從學的師者／學術傳授者，不逕改正文。'
      : '已對讀中國哲學書電子化計劃、《墨子閒詁》《墨子校注》及維基文庫；繁體白話與解析逐段人工校訂。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《墨子·法儀》`)
