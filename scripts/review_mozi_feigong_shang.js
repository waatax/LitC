import fs from 'node:fs'

const aid = (translation, analysis) => ({ translation, analysis })
const reviewed = {
  'mo-zi_ch-17_p-1': aid(
    '如今有一個人進入別人的果園，偷取桃李，眾人聽說便責斥他，執政者抓到也會處罰他。為什麼？因為他損害別人而使自己得利。至於偷人家的狗、豬、雞等牲畜，不義又比偷桃李嚴重，因為損害更多，不仁也更加嚴重，罪責更重。進入別人的牲口圈取走馬牛，又比偷狗豬雞豚更不仁不義；殺害無辜者、奪取衣裘和兵器，又比取人馬牛更嚴重。天下君子都知道這些行為不對，稱它們不義；可是到了大規模攻打別國，反而不知道責斥，還跟著稱讚為義。這能說是懂得義與不義的分別嗎？',
    '【章旨】以損害規模建立連續的罪責階梯：偷桃李、攘牲畜、取馬牛、殺人奪物，損害越多，罪越重；攻國造成更大損害，理應更不義。【字詞】「園圃」是果園菜圃；「攘」是竊取；「犬豕雞豚」泛指家畜；「欄廄」是畜圈馬廄；「扡」通「拖／奪」，指剝取；「茲」通「滋」，更加。【論證】墨子用同一尺度檢驗私人犯罪與國家戰爭，揭露因行為者權勢、規模不同而顛倒道德判斷的雙重標準。【校勘】繁體維基文庫篇首另有「古者王公大人……」一句，《四部叢刊》系統本無；本庫依既定底本不增補。'
  ),
  'mo-zi_ch-17_p-2': aid(
    '殺一個人被稱作不義，就有一項應死的罪；照這個道理推下去，殺十人便有十重不義、十項死罪，殺百人便有百重不義、百項死罪。天下君子都知道這是不義；可是到了發動攻國這種更大的不義，卻不知道反對，反而讚美為義。他們實在不知道攻國不義，所以把稱頌戰爭的話寫下留給後世；若知道不義，又有什麼理由把不義之言傳給後世？這好比一個人看見少量黑色便說黑，看見大量黑色反而說白，就不能說他懂黑白；稍嚐苦味說苦，多嚐苦味反說甜，也不能說他懂甘苦。小規模的錯事知道反對，大規模攻國卻稱為義，怎能說懂義與不義？由此可知，天下君子對義與不義的辨別已經混亂。',
    '【章旨】本段把第一段的罪責遞增推到數量邏輯，再以黑白、甘苦兩組知覺比喻證明：量的增加不能使行為性質反轉。【字詞】「重不義」是多一重不義；「情」通「誠」，確實；「奚說」是有何說法、理由；「辯」通「辨」；末句「辯義與不義之亂」意為對義與不義的辨別發生混亂。【修辭】「少黑為黑、多黑為白」使國家話語包裝戰爭的荒謬性變得直觀；批判對象不是所有防衛用兵，而是以侵略攻國為義。'
  ),
}

const readingAidFile = 'src/data/readingAid.ts'
let readingAidSource = fs.readFileSync(readingAidFile, 'utf8')
const marker = '\n}\n\nexport function getPassageReadingAid('
for (const id of Object.keys(reviewed)) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  readingAidSource = readingAidSource.replace(new RegExp(`\\s{2}'${escaped}': \\{[\\s\\S]*?\\n  \\},`, 'g'), '')
}
const entries = Object.entries(reviewed).map(([id, value]) => `  '${id}': ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')},`).join('\n')
if (!readingAidSource.includes(marker)) throw new Error('找不到 readingAid 插入位置')
readingAidSource = readingAidSource.replace(marker, `\n${entries}\n${marker}`)
fs.writeFileSync(readingAidFile, readingAidSource, 'utf8')

const editorialFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(editorialFile, 'utf8'))
const ids = Object.keys(reviewed)
editorial.reviews = editorial.reviews.filter(item => !ids.includes(item.passageId))
const sources = [
  'https://ctext.org/mozi/condemnation-of-offensive-war-i/zh',
  'https://ctext.org/mozi-jiangu/fei-gong-shang/zh',
  'https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E9%9D%9E%E6%94%BB%E4%B8%8A',
  'https://ctext.org/library.pl?if=gb&res=112767',
  '孫詒讓《墨子閒詁》卷五〈非攻上〉；吳毓江《墨子校注》卷五〈非攻上〉',
]
editorial.reviews.push(...ids.map(passageId => ({
  passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29',
  notes: '逐字對校；正文與《四部叢刊》系統底本相合，篇首增句及「知非／知而非」等異文保留於校勘紀錄，不擅改底本。',
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(editorialFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${ids.length} passages in 《墨子·非攻上》。`)
