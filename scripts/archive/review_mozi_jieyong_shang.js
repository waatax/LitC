import fs from 'node:fs'

const aid = (translation, analysis) => ({ translation, analysis })
const reviewed = {
  'mo-zi_ch-20_p-1': aid(
    `聖人治理一國，能使一國的利益增加一倍；擴大到治理天下，也能使天下的利益增加一倍。這種加倍不是向外奪取土地，而是立足本國，去除無用的耗費，便足以使利益加倍。聖王治理國家，發布命令、興辦事情、役使人民和使用財物，沒有不是因為能增加實用才去做的；因此財物不被浪費，人民也不致勞苦，所興起的利益很多。

製作衣裘是為了什麼？是為冬天抵禦寒冷、夏天抵禦暑熱。製作衣裳的原則，能使冬衣增暖、夏衣增涼的才有用；徒增華飾而不能增加功用的便除去。建造宮室是為了什麼？是為冬天抵禦風寒、夏天抵禦暑雨，遇到盜賊又能增加防護；不能增加這些功用的便除去。製造鎧甲、盾牌和五種兵器是為了什麼？是為抵禦寇亂盜賊；遇到寇亂盜賊時，有甲盾五兵的能取勝，沒有的不能取勝，所以聖人製作甲盾五兵。製作甲盾五兵，應使它輕便銳利、堅固難折；不能增加這些功用的便除去。製造舟車是為了什麼？車用來行走丘陵陸地，舟用來行走河川谷地，以流通四方利益。製造舟車應使它更輕便好用；不能增加功用的便除去。凡製作這些器物，都是因為能增加實用才去做，所以財物不浪費，人民不勞苦，而所興起的利益很多。`,
    `本段不是主張一概少做或不用，而是以「加用」作公共支出的判準：衣服須保溫清涼，宮室須遮蔽與防盜，兵器須防衛且輕利堅固，舟車須便於交通。能增加必要功用的支出可以做，只有不能增加功用的裝飾與耗費才應刪除。「倍」指使國家財用或公共利益加倍，不靠兼併土地，而靠降低無效成本。「民德不勞」的「德」可通「得」，也可理解為人民不因役作而困勞。底本四見「芊䱉」，洪頤煊校作「則止」，俞樾讀為「鮮且／鮮𪓐」而解作華美；兩說都支持「有實用則止、無益者去」的大旨，但字形證據不足以定於一說，故正文保留底本，白話依上下文譯義。`
  ),
  'mo-zi_ch-20_p-2': aid(
    `如果去掉王公大人喜好聚集珠玉、鳥獸、犬馬的耗費，改用來增加衣裳、宮室、甲盾、五兵和舟車的數量，要增加數倍有什麼困難呢？這些器物不難加倍。那麼什麼最難加倍？只有人口最難加倍。然而人口也有可以加倍的方法。從前聖王制定法令說：「男子二十歲，不得不成家；女子十五歲，不得不嫁人。」這是聖王的法令。聖王去世後，人民依自己的意願而行；想早成家的，有的二十歲成家，想晚成家的，有的四十歲才成家。把早晚相抵計算，平均比聖王規定遲了十年。假若每隔三年生育一次，十年間可以生育兩三個孩子。這不正說明使人民早些成家，可以增加人口嗎？道理不過如此。`,
    `本段把「物可倍」推進到戰國時代地廣人稀背景下的「人可倍」。前半先說把奢侈品支出轉向衣、居、防衛、交通等實用品，同樣財力即可產生更多民用；後半則提出早婚生育的人口政策。「處家」指建立家庭，「事人」在此指女子出嫁，「字」指生育、養育子女。「以其蚤與其晚相踐」是把早晚婚年齡相抵、取其中數之意。這是先秦人口政策的歷史材料，不等於現代社會應直接採行的婚育規範；解析應區分作者所處人口稀少、戰爭頻仍的條件與當代個人權利。底本「聖王即沒，於民次也」的「次」仍有「恣／自」等校讀，白話依人民自行決定理解；只將可確定的簡繁混入「于」校為「於」。`
  ),
  'mo-zi_ch-20_p-3': aid(
    `如今天下執政者造成國家人口減少的方法很多：役使人民勞苦，徵收的賦稅沉重，人民財用不足，凍餓而死的多得無法計數。況且王公大人一旦發兵攻打鄰國，長的持續一年，短的也有數月，男女長久不能相見，這也是使人口減少的原因。再加上居處不安、飲食失時，因而患病死亡；又有人在逼近敵地、伏兵負橐、攻城和野戰中死亡，多得無法計數。這不正說明當今執政者使人口減少的方法從多方面發生嗎？聖人治理國家完全沒有這些弊害；這不也說明聖人為政，使人口增加的方法同樣可以從多方面產生嗎？

所以墨子說：「去除無用的耗費，實行聖王之道，是天下的大利。」`,
    `末段把節用、人口與非攻連成一體。重役厚斂直接造成貧困與凍餓，攻戰又使男女分離、生活失序、疾病與戰死增加；所以奢費和戰費不只是財政問題，也會降低人口與國家生產力。反過來，減輕無效役作、賦稅與戰爭，便能同時保存財富和人民。「數術而起」在此不是後世術數之學，而是「由多種方法、途徑產生」。「侵就伏橐」古本有訛，今本亦有異體，白話按接近敵境、軍役伏行負囊的戰爭情境概譯，不虛構確切器械。據今本和句義校「令」為「今」，補「此不聖人為政」的「此」，並在結語補出底本脫落的「行」字；「無用之費／無用之務」有版本差異，此處依底本保留「費」。`
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
if (!readingAidSource.includes(marker)) throw new Error('找不到 readingAid 插入標記')
readingAidSource = readingAidSource.replace(marker, `\n${entries}\n${marker}`)
fs.writeFileSync(readingAidFile, readingAidSource, 'utf8')

const editorialFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(editorialFile, 'utf8'))
const ids = Object.keys(reviewed)
editorial.reviews = editorial.reviews.filter(item => !ids.includes(item.passageId))
const sources = [
  'https://ctext.org/mozi/economy-of-expenditures-i/zh',
  'https://ctext.org/mozi-jiangu/jie-yong-shang/zh',
  'https://zh.wikisource.org/zh-hant/墨子/節用上',
  'https://zh.wikisource.org/wiki/墨子閒詁/卷六',
  'https://ctext.org/library.pl?if=gb&res=112767',
  '孫詒讓《墨子閒詁》卷六〈節用上〉；吳毓江《墨子校注》卷六〈節用上〉',
]
const notes = {
  'mo-zi_ch-20_p-1': '四處「芊䱉」有「則止」「鮮且」等校說，證據未定；保留底本並依「加用」原則譯解。',
  'mo-zi_ch-20_p-2': '校「于民」為「於民」；「次」之校讀未定，正文保留並按人民自行選擇疏解。',
  'mo-zi_ch-20_p-3': '據今本與句義校「令」為「今」、補「此」及結語「行」；疑文「侵就伏橐」保留。',
}
editorial.reviews.push(...ids.map(passageId => ({
  passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources,
  reviewedAt: '2026-07-29', notes: notes[passageId],
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(editorialFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`已審校《墨子·節用上》${ids.length} 段。`)
