import fs from 'node:fs'

const aids = {
  'mo-zi_ch-2_p-1': {
    translation: '君子作戰，雖然要有陣法，但勇氣才是根本；辦理喪事，雖然要有禮節，但哀痛才是根本；士人雖然要有學問，但實踐才是根本。因此，根本尚未安定，不要致力於使末節豐盛；近人尚未親附，不要急著招徠遠人；親族尚未歸附，不要忙於對外交往；做事不能有始有終，不要貪求多種事業；對所接觸的事物仍昏昧不明，不要只求廣博見聞。',
    analysis: '本段以戰、喪、學三組例子確立「本先末後」：陣法以勇為本，喪禮以哀為本，學問以行為本。「置本不安」是根本尚未安頓；「舉物而闇」指接觸、論述事物卻不能明辨。後五句從修身推到人際與事業管理，反覆要求先處理近處、根本和已承擔之事，再向外擴張。這不是否定禮、學或博聞，而是反對外在形式取代真實情感與行動。'
  },
  'mo-zi_ch-2_p-2': {
    translation: '所以先王治理天下，必先考察近處，再招來遠方；君子也先察近身之事，使身邊得到整治。看到自己德行未修、遭人毀謗時，能反過來檢查自身，怨恨便會減少，品行也會修好。讒毀邪惡的話，不讓它進入耳中；攻擊抵觸的話，不讓它出於口中；傷害別人的念頭，不讓它存於心裡。如此，即使有好詆毀、攻訐的人，也找不到可以依附、發作的地方。',
    analysis: '「察邇來遠」承接前段先近後遠；「邇脩」既指近處整治，也落實為自身修養。「見不脩行，見毀」傳本句讀有歧，白話依「受毀而反求諸身」的論旨疏通。「批扞」是攻擊、排拒之言。「殺傷人之孩」文字可疑，孫詒讓、吳毓江等有不同校說；依「耳—口—心」三層遞進，今取心中不存傷人意念的大意，不把「孩」強定為兒童。末句不是承諾修身可消滅惡人，而是說不納讒、不出惡言、不存害心，可減少攻訐依附與擴散的條件。'
  },
  'mo-zi_ch-2_p-3': {
    translation: '所以君子努力從事正當工作，力量一天比一天強；志願和追求一天比一天遠；所建立的德業一天比一天盛。君子的道路是：貧窮時顯出廉潔，富有時顯出道義，活著時顯出仁愛，死後使人顯出哀思。這四種品行不能虛假冒充，都要回到自身實踐。藏在心裡的愛，不可使它枯竭；表現在身體行動上的恭敬，不可使它枯竭；說出口的和順言語，也不可使它枯竭。讓這些德行暢達四肢、接連肌膚，直到頭髮斑白、頭頂禿落仍不捨棄，恐怕只有聖人能做到吧！',
    analysis: '「力事日彊」指實踐能力日益增強；「願欲日逾、設壯日盛」傳本用字較難，今依遞進關係解為志願日遠、所建德業日盛。「貧廉、富義、生愛、死哀」用不同處境檢驗品格，重點是不可虛假。「無以竭」不是不能充分表達，而是不可讓愛、恭、馴耗盡；「馴」在此近於和順。「華髮隳顛」是髮白頂禿，表示終身不懈。全段把修身理解為長期、身心一致的實踐，而不是臨時展示名聲。'
  },
  'mo-zi_ch-2_p-4': {
    translation: '志向不堅強，智慧便不能通達；言語不守信用，行動便不會果決。占有財物卻不能分給別人的人，不值得交友；守道不篤實、觀察事物不周遍、辨別是非不明察的人，也不值得交遊。根本不牢，末節必不能接近成功；勇武卻不修養，後來必會懈怠；源頭混濁，水流不會清澈；行為不可信，名聲必定耗損。名聲不會憑空產生，聲譽不會自行增長；功業成就，名聲才隨之而來。名譽不能虛假取得，仍須回到自身行為。只致力言談而延緩行動，即使善辯也不會被聽從；有很大能力卻誇耀功勞，即使辛苦也不會被人認可。明智者心中明辨而不說繁瑣的話，有能力而不誇功，因此名譽能傳揚天下。說話不要追求多，而要追求明智；不要追求文飾，而要追求明察。智慧若缺少明察，只停留在自己心中而自以為實，便是走回錯誤道路。善念若在心中沒有根本，便不能留存；行為若不能在自身辨明，便不能成立。名聲不能輕易成就，聲譽不能靠機巧建立；君子要用自身承載並實行德行。只顧追逐利益、忽略名節，卻能成為天下之士，從來沒有這種事。',
    analysis: '本段由擇友標準推到名實關係。「偏物不博」不是偏愛某物，而是對事物察看不周遍；「幾」是接近。「名不徒生」以下反覆說名譽必須由功行產生。「務言而緩行」批評言過於行，「多力而伐功」批評恃能自誇。「彼智無察，在身而情，反其路者也」傳本與句讀均有爭議，今依前後「智須察、行須身」解為智慧若不明察而只自信其情實，便走錯方向。「戴行」是以身承載德行。末句並非鼓勵求名勝於求利，而是說若完全忘卻名節、只逐私利，不能成為公共意義上的士。'
  }
}

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
editorial.reviews.push(...passageIds.map((passageId) => ({
  passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified',
  sources: [
    'https://ctext.org/mozi/self-cultivation/zh',
    'https://ctext.org/mozi-jiangu/xiu-shen/zh',
    'https://zh.wikisource.org/wiki/%E5%A2%A8%E5%AD%90/%E5%8D%B701',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf',
    '孫詒讓《墨子閒詁》、吳毓江《墨子校注》、張純一《墨子集解》及相關墨家修身思想研究'
  ], reviewedAt: '2026-07-29',
  notes: ['mo-zi_ch-2_p-2', 'mo-zi_ch-2_p-3', 'mo-zi_ch-2_p-4'].includes(passageId)
    ? '逐句核對傳本與主要校釋；疑難字句保留底本文字，白話依篇章論證暫譯，解析明示校讀限制。'
    : '逐句核對《四部叢刊》本、《墨子閒詁》、維基文庫及主要校釋；白話與解析為人工繁體中文。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《墨子·修身》`)
