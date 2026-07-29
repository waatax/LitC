import fs from 'node:fs'

const aid = (translation, analysis) => ({ translation, analysis })
const reviewed = {
  'mo-zi_ch-21_p-1': aid(
    `墨子說：「古代英明的聖王之所以能統治天下、端正諸侯，是因為他們愛護人民極其忠誠，使人民得利極其厚實；忠誠與信實相連，又把實際利益顯示給人民，所以終身不厭倦，到死也不懈怠。古代明王聖人之所以能統治天下、端正諸侯，原因就在這裡。」`,
    `本段先為節用確立目的：不是君主個人的節儉形象，而是持續、真實地利民。「謹忠」「謹厚」的「謹」有甚、極之意；「不饜」是不厭倦，「不卷」的「卷」通倦。王天下、正諸侯的正當性來自長期把利益落到人民身上。節用因此是利民政治的一部分，而非單純縮減預算。原資料開啟引號卻未閉合，據篇章結構補上右引號，不改正文用字。`
  ),
  'mo-zi_ch-21_p-2': aid(
    `所以古代聖王制定節用法則說：「天下各類工匠，如製輪車的工人、製革皮的工人、陶工、冶工、木工等，都要各自從事所擅長的工作。」又說：「凡是足以供給人民使用的，便到此為止。」凡是增加費用卻不能增加人民利益的事，聖王都不做。`,
    `本段用一句話概括墨家生產原則：「足以奉給民用，則止。」百工應專業分工並供應必要民用；是否生產，不以華飾、身分或無限擴張為標準，而以邊際支出能否增加民利為準。「群百工」是各類工匠總稱；「輪車、韗鞄、陶、冶、梓匠」涉及車輪、皮革、陶冶與木作等職種，今本有「輪、車、鞼、匏」等分合異文，不能只據現代標點判定唯一職名。正文依《墨子閒詁》底本保留，只將混入的「于」校為繁體「於」。`
  ),
  'mo-zi_ch-21_p-3': aid(
    `古代聖王制定飲食法則說：「能夠充實空虛的腹胃、接續氣力，使四肢強健、耳目聰明，便到此為止。不追求五味調和到極致，不追求芬芳香氣的精美搭配，也不從遠方國家招致珍奇怪異的食物。」怎麼知道是這樣呢？古代堯治理天下，南面安撫到交阯，北面使幽都歸服，東西達到日出日落之處，無不臣服。即使他如此廣愛天下，自己的飲食仍是黍稷不備兩種，肉羹不設重味，用陶製食器吃飯、飲湯，以斗斟酌。至於俯仰周旋等繁複威儀禮節，聖王也不刻意營辦。`,
    `飲食的停止點是維持生命、體力與感官功能，而不是窮盡味覺、香氣與遠方珍品。堯的例子用最高政治地位反證奢食並非治理天下的必要條件。「黍稷不二，羹胾不重」指主食、肉羹不求多品重設；「土塯」「土形」皆指樸素陶器，但具體器形有異說；「斗以酌」是用普通量器斟取。末句批評的是耗費性的繁縟威儀，不是否定一切禮節。今本有「使耳目聰明」等小異，底本文義已通，故不增改。`
  ),
  'mo-zi_ch-21_p-4': aid(
    `古代聖王制定衣服法則說：「冬天穿深青赤色的衣服，以輕而暖為限；夏天穿細葛、粗葛製成的衣服，以輕而涼為限。」凡增加費用卻不增加人民利益的，聖王都不做。

古代有猛禽狡獸和暴徒傷害人民，所以聖人教人民使用兵器，平日佩劍；劍用來刺能刺入，用來砍能砍斷，側擊也不折損，這就是劍的實用。鎧甲穿在身上應輕便合用，活動時兵器裝備能隨身而動，這是甲的實用。車用來載重致遠，乘坐安穩，牽引便利；安穩便不傷人，便利便能迅速到達，這是車的實用。古代聖王因大河深谷不能徒步渡過，於是便利地製作舟楫，足以載人渡越便停止。即使乘坐者是三公、諸侯，舟楫也不另行更換，津渡之人不加裝飾，這就是舟的實用。`,
    `本段把衣、劍、甲、車、舟逐一用功能驗收：衣求輕暖或輕涼，劍求能刺能斷而不折，甲求輕便隨動，車求安全、載重、致遠，舟求足以渡河。高位者不另換豪華舟楫，說明同一效用不應因身分而追加裝飾成本。「紺緅」是深青帶赤的衣色，「絺綌」是細葛與粗葛。「車為服重」的「服」有承載、負荷義；「足以將之」的「將」可解載送渡越，今本另作「足以將之則上」，校讀未定。這套論證再次顯示墨家不是反技術，而是要求技術服務安全、交通與民用。`
  ),
  'mo-zi_ch-21_p-5': aid(
    `古代聖王制定節葬法則說：「入殮衣服三套，足以讓屍肉在其中腐朽；棺木厚三寸，足以讓骨骸在其中朽化。墓穴深度不達地下泉水，水流不致外洩，便到此為止。死者安葬以後，活著的人不要長期服喪而耗用哀情。」`,
    `這是《節用中》將效用原則推到喪葬：衣與棺只須完成收殮、掩蔽與安葬功能，墓穴須避免觸及地下水及造成滲洩；安葬後也不應以長期喪制阻礙生者工作。「衣三領」是三套或三件殮衣，「棺三寸」指棺板厚度。底本「流不發洩」可能涉及墓穴水流、氣味或土壤滲漏，各家解說不一；白話採水流不外洩的保守解法。這裡只提出原則，完整反厚葬久喪論證在〈節葬下〉展開。`
  ),
  'mo-zi_ch-21_p-6': aid(
    `古時人類初生、還沒有宮室時，依著丘陵挖洞居住。聖王考慮這件事，認為洞穴冬天可以避風寒，可是到了夏天，下方潮濕，上方熱氣蒸騰，恐怕損害人民身體，所以建造宮室，使人民得到便利。那麼建造宮室的法則應當怎樣呢？墨子說：「四周足以抵禦風寒，上方足以抵禦雪霜雨露，內部潔淨，可以祭祀，宮牆足以分隔男女，便到此為止；凡增加費用卻不增加人民利益的，聖王都不做。」`,
    `宮室的必要功能有四項：遮蔽風寒、覆蓋雨雪、保持內部潔淨以供祭祀，以及形成生活空間的男女區隔。建築起源於改善洞穴冬可避寒、夏卻濕熱的缺點，所以墨子並不反對建築本身，而反對超出這些功能的勞民奢飾。「蠲潔」是清潔、潔淨，「圉」通禦。「辟風寒」的「辟」是避的通假寫法，屬古文原字，不應由繁體轉換器改成「闢」。原資料把引號錯置在「宮室而利」之後，並混入「于是」，據今本校為正常敘述及「於是」。`
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
  'https://ctext.org/mozi/economy-of-expenditures-ii/zh',
  'https://ctext.org/mozi-jiangu/jie-yong-zhong/zh',
  'https://zh.wikisource.org/zh-hant/墨子/節用中',
  'https://zh.wikisource.org/wiki/墨子閒詁/卷六',
  'https://ctext.org/library.pl?if=gb&res=112767',
  '孫詒讓《墨子閒詁》卷六〈節用中〉；吳毓江《墨子校注》卷六〈節用中〉',
]
const notes = {
  'mo-zi_ch-21_p-1': '正文與校本相合；補原資料缺失的右引號。',
  'mo-zi_ch-21_p-2': '百工職名有分合異文，依底本保留；只校「于」為「於」。',
  'mo-zi_ch-21_p-3': '飲食器名與「使耳目」異文已核，底本文義可通，不改。',
  'mo-zi_ch-21_p-4': '「足以將之則止／上」有異讀，保留底本並於解析說明。',
  'mo-zi_ch-21_p-5': '「流不發洩」諸解未定，正文保留，白話採墓穴水流不外洩解。',
  'mo-zi_ch-21_p-6': '校正錯置右引號及「于是／於是」；古字「辟」依底本保留。',
}
editorial.reviews.push(...ids.map(passageId => ({
  passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources,
  reviewedAt: '2026-07-29', notes: notes[passageId],
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(editorialFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`已審校《墨子·節用中》${ids.length} 段。`)
