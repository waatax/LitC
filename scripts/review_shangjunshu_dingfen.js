import fs from 'node:fs'

const aids = {
  'shang-jun-shu_ch-26_p-1': {
    translation: '秦公問公孫鞅說：「法令若在今天制定，想在明天早晨就使天下官吏百姓都清楚了解，並且一致施行、沒有私意，該怎麼辦？」',
    analysis: '開篇把問題限定得很具體：法律不只要制定，還要迅速公布、讓全國理解並一致適用。「當時」是即時、當下，「明旦」是次日清晨；「用之如一而無私」同時要求認知一致與執行不受私情影響。以下回答因而不是抽象法理，而是一套法令保管、解釋、詢問、憑證與官吏責任制度。'
  },
  'shang-jun-shu_ch-26_p-2': {
    translation: '公孫鞅回答：應為法令設置專官、專吏，選用質樸而足以理解法令含義的人，任為天下解釋法律的標準官員，奏報天子。天子正式任命後，各地主管法令的人都接受命令、到官任職。主管法令者若忘記施行自己所掌法令的名稱與內容，就按其遺忘的那條法令定罪。主管法令的官吏若有調職或死亡，立即令接任學員誦讀法令內容，訂定考核標準，要求數日內理解；考核不合標準，就依法治罪。若有人敢刪改既定法令，增減一字以上，處死不赦。官吏百姓向主管法令者詢問法令含義時，主管者都須依所問條文清楚告知，並製作一尺六寸長的符券，明寫詢問的年、月、日、時及法令名稱，交付官吏百姓。主管法令者若不回答，以致詢問者觸犯所問法令，便按該條罪名處罰主管法令的官吏。當時把左券交給詢問者，主管者謹慎把右券收入木匣、藏在專室，以法令長官印封存。日後即使有人死亡或發生變故，也依符券文書辦理。',
    analysis: '本段建立官方法律解釋與書面答覆責任。「樸」是質樸可靠；「程式」是學習與考核標準；「剟」是刪削。「尺六寸之符」是可剖分核對的長券，左券給詢問人，右券由法官封存，形成雙方可驗的法律諮詢紀錄。「物故」通常指死亡，也可泛指事故。最重要的制度創意是：人民事前詢法而主管官拒答，若人民因此犯罪，責任轉由主管官承擔。另一方面，增減一字即死的規定顯示它以極刑維護文本固定，與現代容許依法修法、司法解釋的制度有根本差別。'
  },
  'shang-jun-shu_ch-26_p-3': {
    translation: '法令都要製作副本：一份置於天子宮殿中，另設法令禁室，以鎖鑰封閉；一份藏入禁室，以專用禁印封存。擅自拆開禁室封印、進入禁室觀看封存法令，或刪改禁本一字以上，都處死不赦。每年依禁室法令向各地頒授一次法令。天子設三名法官：殿中一名，御史機構一名並配法吏，丞相府一名；諸侯、郡縣也各設法官和法吏，都比照秦中央法官。郡縣諸侯統一領受禁室法令，並學習其含義。官吏百姓想知道法令，都向法官詢問，所以天下官民沒有不知法的。官吏知道百姓也懂法，便不敢用非法方式對待百姓；百姓也不敢犯法冒犯執法官。官吏對待百姓若不依法，百姓便詢問法官；法官立即把相關罪責告知，百姓再依法律正告違法官吏。官吏知道制度如此，便不敢非法待民，百姓也不敢犯法。這樣，即使有賢良善辯、聰慧之人，也不敢說一句話扭曲法律；即使有千金，也不能用上一銖行賄。於是聰明、詐巧、賢能的人都轉而行善，人人致力自我約束、奉行公法；百姓保持質樸，便容易治理。這些都產生於法令明白易懂而且必定施行。',
    analysis: '「副置」是以正副本分藏，禁室本兼具權威文本與防篡改功能。「一歲受法令」指按年度頒授、核對。「皆比秦一法官」是地方配置比照秦中央。「以非法遇民」指官吏違法對待人民；百姓能持法官解釋反向要求官吏守法，是本篇特別值得注意的公開法思想。「不能以用一銖」省略賄賂之意。末句「民愚則易治」仍暴露其治理取向：法律公開並非為人民參與立法，而是使人人明白避就、便於統治。'
  },
  'shang-jun-shu_ch-26_p-4': {
    translation: '法令是百姓安身立命的依據，是治理的根本，也是用來防護百姓的工具。治理國家卻去掉法令，就像想不挨餓卻丟掉食物，想不受寒卻丟掉衣服，又像想同時向東向西行走；其荒謬是很明白的。一隻野兔奔跑，一百人追逐，並不是因為一隻兔子可以分給一百人，而是因為權利歸屬尚未確定。市場上賣兔的人很多，盜賊卻不敢隨便拿取，是因為歸屬已經確定。所以名分未定，即使堯、舜、禹、湯也會像群鴨奔走般去追；名分已定，即使貪婪的盜賊也不取。如今法令不明，事物的名稱與權責便不確定，天下人都可各自議論；人人說法不同，沒有定準。君主在上制定法律，下民在下各自議論，便使法令不能確定，等於讓下凌上，這就叫名分不定。名分不定，即使堯舜也可能挫折原則而作奸，何況一般人？這會使奸惡大起、君主喪失威勢，是亡國滅社稷的道路。',
    analysis: '本段以野兔與市場兔說明「名分」是權利歸屬及法律名稱、責任界線。現底本「非以兔也」「夫賣者滿市」有明顯脫文，據《呂氏春秋·慎勢》平行文及嚴萬里系校本補為「非以兔可分以為百，由名分未定也」「夫賣兔者滿市」，段落、逐句、分塊已同步。「如騖」指如鴨群趨逐，是競逐貌。「折而姦之」傳文仍有異解，今依名分不定連聖人也難免被競逐形勢牽動疏通。前半可用來理解產權明確減少爭奪，後半卻把法律解釋分歧直接視為下凌上，顯示其定分同時服務君主權威。'
  },
  'shang-jun-shu_ch-26_p-5': {
    translation: '古代聖人寫成的書傳到後世，必須由老師傳授，才能知道其中名稱的確切含義；若不從師學習，而人人依自己心意議論，到死也未必懂得名稱與意旨。因此聖人制定法令，必設專官專吏作天下人的老師，用來確定名分。名分確定，即使大奸詐者也會表現貞信，百姓都變得謹厚誠實，各自約束自己。所以名分確定，是形成治勢的道路；名分不定，是形成亂勢的道路。治勢一成便不易被擾亂，亂勢一成便難以治理。在亂勢上勉強治理，只會更加混亂；在治勢上繼續治理，才會越治越好。所以聖王治理已形成秩序的局勢，不在混亂結構上徒勞施治。',
    analysis: '「師受」是從師承受定解，本段以經書需師說比喻法令需法官統一解釋。「大詐貞信」不是奸詐本性消失，而是權利、責任與後果明確後，奸者也不得不守信。「勢治／勢亂」指制度結構自我強化形成治勢或亂勢。「治治不治亂」不是放棄處理亂國，而是主張先建立可治的制度條件，再據此治理；若仍沿用造成亂勢的結構，只會愈治愈亂。其統一解釋能提高確定性，也可能壓縮合理爭議和法律修正空間。'
  },
  'shang-jun-shu_ch-26_p-6': {
    translation: '微妙深奧、只可意會的言論，即使上等智慧的人也難理解。不依靠法令準繩而能事事正確的人，千萬人中才有一個；所以聖人要用適合千萬人的辦法治理天下。必須智者才能明白的內容，不能制定為法，因為百姓不全是智者；必須賢者才能懂得的內容，也不能制定為法，因為百姓不全是賢者。所以聖人制定法律，必使它明白易懂。名稱與權責正確，愚者智者都能知道。再設法官與主管法令的官吏作天下人的老師，使萬民不致陷入危險。因此聖人治理天下而沒有因刑罰死亡的人，並不是不用刑殺，而是法令明白易懂，又設法官法吏教導，使萬民都知道應當避開什麼、趨向什麼；人人避禍就福，便各自約束。所以明主憑藉已形成的治勢繼續治理，天下便能大治。',
    analysis: '「聖人以千萬治天下」指法律要按千萬普通人的理解能力設計，而不是以極少數天才為標準。「名正」在此是法律術語與權責界線明確。「無刑死者，非不刑殺也」看似矛盾，實指仍保留嚴刑，但希望以公開、易知與確定執行產生威懾，使實際受刑者減少。「以道之知」當讀為引導使其知。這一段提出法律可理解性與可取得性的重要原則；然而以嚴刑威懾達成無刑，仍須與比例原則、程序保障及國家權力限制分別評價。'
  }
}

const worksFile = 'src/data/works.ts'
let worksSource = fs.readFileSync(worksFile, 'utf8')
const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const datasets = matches.map((match) => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = datasets
const passageId = 'shang-jun-shu_ch-26_p-4'
const replacements = [
  ['一兔走，百人逐之，非以兔也。', '一兔走，百人逐之，非以兔可分以為百，由名分未定也。'],
  ['夫賣者滿市，而盜不敢取', '夫賣兔者滿市，而盜不敢取'],
]
const passage = passages.find((item) => item.id === passageId)
if (!passage) throw new Error(`Missing passage ${passageId}`)
for (const [before, after] of replacements) passage.canonicalText = passage.canonicalText.replace(before, after)
for (const sentence of sentences.filter((item) => item.passageId === passageId)) {
  for (const [before, after] of replacements) {
    sentence.canonicalText = sentence.canonicalText.replace(before, after)
    for (const chunk of sentence.chunks || []) chunk.text = chunk.text.replace(before, after)
  }
}
let datasetIndex = 0
worksSource = worksSource.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () =>
  `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(datasets[datasetIndex++]))}"))`)
fs.writeFileSync(worksFile, worksSource, 'utf8')

const aidFile = 'src/data/readingAid.ts'
let aidSource = fs.readFileSync(aidFile, 'utf8')
const marker = '\n}\n\nexport function getPassageReadingAid('
const insertion = Object.entries(aids).map(([id, aid]) => `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},`).join('\n')
if (!aidSource.includes(marker)) throw new Error('Reading-aid insertion marker not found')
aidSource = aidSource.replace(marker, `\n${insertion}\n${marker}`)
fs.writeFileSync(aidFile, aidSource, 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
const passageIds = Object.keys(aids)
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
editorial.reviews.push(...passageIds.map((id) => ({
  passageId: id, canonicalText: 'verified', translation: 'verified', analysis: 'verified',
  sources: [
    'https://ctext.org/shang-jun-shu/fixing-of-rights-and-duties/zh',
    'https://zh.wikisource.org/wiki/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E4%BA%94',
    'https://taiwanebook.ncl.edu.tw/zh-tw/book/NCL-A008475/reader',
    'https://ctext.org/lv-shi-chun-qiu/shen-shi-lan/zh',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、王時潤《商君書集解》、高亨《商君書注譯》、蔣禮鴻《商君書錐指》及《定分》法律公開、名分研究'
  ], reviewedAt: '2026-07-29',
  notes: id === passageId
    ? '據《呂氏春秋·慎勢》平行文及嚴萬里系校本補「可分以為百，由名分未定也」與「賣兔者」脫文；段落、逐句、分塊同步，理由記入解析。'
    : '逐句核對卷五傳本、古籍影像、主要校釋及法律史研究；法官、符券、禁室與名分術語依制度語境疏解。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《商君書·定分》`)
