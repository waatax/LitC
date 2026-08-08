import fs from 'node:fs'

const aids = {
  'mo-zi_ch-8_p-1': { translation: '墨子說：「如今治理國家的王公大人，都希望國家富足、人口眾多、刑法政令得到治理；結果卻沒有富足反而貧困，沒有增多反而減少，沒有安定反而混亂。這正是失去自己想要的，得到自己厭惡的，原因究竟是什麼呢？」', analysis: '開篇用「所欲／所惡」的反差設定問題：統治者的目標並沒有錯，錯在施政手段不能產生預期結果。墨子以富、眾、治三項可觀察成效作為政治評價標準，為下文把失敗歸因於不能尚賢事能預作鋪墊。' },
  'mo-zi_ch-8_p-2': { translation: '墨子說：「問題正在於治理國家的王公大人，不能用崇尚賢者、任用能者的方式施政。因此一國賢良之士多，國家的治理便深厚；賢良之士少，國家的治理便薄弱。所以執政者最重要的工作，就是使賢者增多。」', analysis: '「尚賢事能」兼含價值尊崇與實際任用，不只是口頭稱讚人才。墨子把人才數量和治理品質直接相連，並以「眾賢」概括政策目標。這裡的「眾」不是憑空造就，而是藉制度吸引、辨識並任用既有賢能。' },
  'mo-zi_ch-8_p-3': { translation: '有人問：「那麼，使賢者增多的方法應當怎麼做呢？」', analysis: '這一句承上啟下，把抽象的尚賢原則轉為制度問題。下文不再只論賢者可貴，而要回答政府如何藉獎勵結構，使人才願意出現並投入公共事務。' },
  'mo-zi_ch-8_p-4': { translation: '墨子說：「譬如想讓國內善於射箭駕車的人增多，必定要使他們富有、尊貴，敬重並讚譽他們，然後善射善御之士才能增多。何況那些德行深厚、善於言談辯論、廣通學術的賢良之士呢？他們本是國家的珍寶、社稷的輔佐，也必須使他們富有、尊貴，敬重並讚譽他們，國內賢良之士才會增多。」', analysis: '射御是可觀察的技能，墨子先用它說明獎勵會改變人才供給，再類推到德行、言談與道術兼備的賢士。「富、貴、敬、譽」涵蓋物質報酬、政治地位、社會尊重與公共聲望，形成完整的人才激勵制度。原資料段末缺少問號與引號，本次依通行本補正並重建逐句索引。' },
  'mo-zi_ch-8_p-5': { translation: '所以古代聖王施政時宣布：「不合義的人不能富有，不能尊貴，不能親近，也不能接近君主。」富貴者聽見後，想到君主推舉義士不因貧賤而避開，自己便不可不行義；親屬、近臣也發現親近關係不再可靠，遠方之人則知道不會因疏遠而被排除，於是從郊外臣屬、宮廷庶子到國中百姓、四境農民，都競相行義。原因是君上驅使臣下只用同一項標準，臣下事奉君上也只有同一條途徑。這好比富人有高牆深宅，牆築得嚴密，只開一扇門；盜賊若進入，關閉他進來的門再搜捕，他便無路逃出。這是因為主人掌握了關鍵出入口。', analysis: '本段主張把「義」設為取得財富、爵位與親近權力的唯一合法入口。當出身、親疏與距離都不能繞過標準，各階層便有一致誘因去行義。高牆一門的譬喻強調制度必須封住旁門：若仍可憑血緣或私恩進身，尚賢便會失效。原資料中的「門庭庶子」與「牆立既，謹上」分別校回「闕庭庶子」與「牆立既謹，上」，並補回「遠近」。' },
  'mo-zi_ch-8_p-6': { translation: '所以古代聖王施政，依德行安排位次、崇尚賢才；即使是農夫或工匠，只要有能力就推舉他，給予高爵、厚祿，委任政事並賦予裁決命令的權力。因為爵位不高，人民不會敬重；俸祿不厚，人民不會信服；政令不能決斷，人民不會畏服。把這三項交給賢者，不是偏私賞賜，而是要使政事成功。當時依德入列、按官職辦事、依功勞定賞、衡量功績分配俸祿；官員不會永遠尊貴，百姓也不會永遠卑賤，有能者升，無能者降，推行公義、排除私怨。堯從服澤之陽舉舜，禹從陰方之中舉益，湯從庖廚中舉伊尹，文王從捕獸網羅之間舉閎夭、泰顛，授政後都獲得成效。因此高官敬慎努力，農工商也競相勉勵。得到賢士，君主謀事不困、身體不勞，名聲與功業成立，善美彰顯而惡事不生。', analysis: '這是全篇制度核心：選拔不限身分，任用必同時授予爵、祿、事權，考核則依德與功。墨子特別說明高爵厚祿不是私人恩賜，而是完成公共任務的必要條件。舜、益、伊尹、閎夭與泰顛的事例，證明人才可以出自田野、庖廚與民間；「官無常貴，民無終賤」則把社會流動建立在能力與功績上。' },
  'mo-zi_ch-8_p-7': { translation: '所以墨子說：「處境得志的賢士不可不推舉，處境不得志的賢士也不可不推舉。若還想繼承堯、舜、禹、湯的治道，就不能不崇尚賢者。尚賢正是政治的根本。」', analysis: '結語說明選才不應受賢者當下際遇影響：已得志者與未得志者都要依賢能推舉。原資料把「得意賢士」連讀，容易誤解為一類人才；依通行句讀改為「得意，賢士……；不得意，賢士……」。全篇最後把尚賢提升為治政之本，回應開頭富、眾、治何以不能實現。' }
}
const passageIds = Object.keys(aids)
const aidFile = 'src/data/readingAid.ts'
let aidSource = fs.readFileSync(aidFile, 'utf8')
for (const id of passageIds) if (aidSource.includes(`'${id}': {`)) throw new Error(`Reading aid exists: ${id}`)
const marker = '\n}\n\nexport function getPassageReadingAid('
const insertion = Object.entries(aids).map(([id, aid]) => `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},`).join('\n')
if (!aidSource.includes(marker)) throw new Error('Reading-aid insertion marker not found')
fs.writeFileSync(aidFile, aidSource.replace(marker, `\n${insertion}\n${marker}`), 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
const sources = ['https://ctext.org/mozi/exaltation-of-the-virtuous-i/zh','https://ctext.org/mozi-jiangu/shang-xian-shang/zh','https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E5%B0%9A%E8%B3%A2%E4%B8%8A','https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf','孫詒讓《墨子閒詁》；吳毓江《墨子校注》']
editorial.reviews.push(...passageIds.map((passageId) => ({ passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29', notes: ['mo-zi_ch-8_p-4','mo-zi_ch-8_p-5','mo-zi_ch-8_p-7'].includes(passageId) ? '依通行本與校注本修復確證的標點、誤字或斷句，並重建句子索引；白話與解析以繁體中文重寫。' : '依《墨子》通行本、《墨子閒詁》與《墨子校注》交叉核對；白話與解析以繁體中文重寫。' })))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 墨子·尚賢上.`)
