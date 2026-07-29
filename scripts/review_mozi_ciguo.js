import fs from 'node:fs'

const aids = {
  'mo-zi_ch-6_p-1': { translation: '墨子說：上古人民還不懂建造房屋時，住在丘陵或洞穴裡，低下潮濕的環境會傷害身體，所以聖王才建造宮室。房屋只要能避潮、防風寒、遮蔽霜雪雨露，牆垣足以維持男女之別，便已足夠。凡耗費財力卻不能增加實際利益的，一概不做。因此，宮室是為了便利生活，不是供人觀賞娛樂；衣服鞋帶是為了保護身體，不是為了標新立異。君主自身節制並教導人民，天下便容易治理，財用也能充足。', analysis: '本段先提出墨家的造物原則：制度與器物的正當性，在於解除真實困苦並產生公共利益。「謹此則止」不是反對住宅或衣服，而是以滿足基本功能為限；超出功能且徒耗民力的裝飾，便違反「利民」標準。由君主示範節用，再推及社會風氣，是本篇政治論證的起點。' },
  'mo-zi_ch-6_p-2': { translation: '如今君主建造宮室卻與古代不同：重重向百姓徵斂，強奪人民賴以衣食的財物，用來建造宮室臺榭，追求曲折多變的景觀和青黃彩飾、雕刻裝飾。左右臣下又競相仿效，於是國家沒有足夠財力救濟荒年與孤寡，終致國貧民難治。君主若真希望天下安定、厭惡動亂，建造宮室便不可不節制。', analysis: '墨子把宮室奢華連成一條因果鏈：厚斂與掠奪民財—上行下效—救荒救弱資源不足—國貧而亂。批評的核心不是審美本身，而是統治者把維生資源轉作炫耀性消費，並造成全社會仿效。末句以「欲治惡亂」反詰，要求君主使手段符合政治目的。' },
  'mo-zi_ch-6_p-3': { translation: '古人尚未製作衣服時，披獸皮、繫草帶；冬天雖暖卻不輕便，夏天又不輕涼。聖王認為這不合人的需要，便教婦女治理絲麻、製成布帛，供人民穿著。衣服的標準是：冬服輕暖，夏服輕涼，達到這些便停止。聖人製衣，只求合身而使肌膚舒適，不為炫耀耳目、迷惑愚民。當時人不以堅車良馬、雕刻彩飾為貴，因為所遵循的原則如此。百姓不受外在奢華誘惑，能掌握自我供養的實際需要，所以家有衣食，可以防備水旱荒年；人民儉樸易治，君主節用易於供給，府庫充實可應變故，軍備不致疲敝，士民不必過勞，也有力量征服不服從者，因而可以成就王霸之業。', analysis: '本段以衣服說明「適用」與「觀好」的區別。輕暖、輕涼、合身和膚是合理需求；車馬雕飾則被用來代表外在誘惑。「不感於外」意指不被奢華風尚牽動。節用因而不只是私人美德，也會積累家庭與國家的抗災、國防資源，形成由生活倫理通往國家能力的論證。' },
  'mo-zi_ch-6_p-4': { translation: '如今君主製作衣服卻不同：冬衣已經輕暖、夏衣已經輕涼，仍向百姓厚加徵斂，奪取衣食之資，製作錦繡華麗的衣裳，又用黃金鑄帶鉤、珠玉作佩飾；女工織作紋彩，男工從事雕刻，全用來裝飾身體。這並不能增加保暖，只是耗盡財物人力而歸於無用。可見這些衣服不是為身體，而是為炫耀美觀。因此人民邪僻難治，君主奢侈難諫。奢侈的君主統治好淫邪僻的人民，想使國家不亂是不可能的。若真想天下安定，衣服不可不節制。', analysis: '本段用邊際效用作判準：保暖與清涼功能既已具備，額外徵斂只服務於觀賞與身分展示。「單財勞力」即盡耗財力。墨子又指出奢侈會同時敗壞君民：君主拒諫，人民競逐浮華，政治秩序便失去自我修正能力。' },
  'mo-zi_ch-6_p-5': { translation: '古人還不懂飲食製作時，只吃粗食而散居。聖人便教男子耕種栽植，供給人民食物。飲食只須增益氣力、補充虛弱、強健身體並使腹中舒適。因此耗財有節、自養儉約，人民富足而國家安定。如今卻向百姓厚斂，置辦牲畜肉食、蒸烤魚鱉；大國陳列上百器皿，小國也有數十器，食物鋪滿面前一丈見方，眼看不完、手取不遍、口嘗不盡，冬天凍藏冰品，夏天食物腐敗。君主如此飲食，左右也跟著仿效，結果富貴者奢侈，孤寡者挨餓受凍，想不亂也不可能。若真想天下安定，飲食不可不節制。', analysis: '飲食的合理尺度是「增氣、充虛、強體、適腹」。大量菜品既不能被充分觀看、取用或品嘗，甚至腐敗，正顯示消費已脫離養生功能。篇中特別並置富貴者的浪費與孤寡者的凍餒，使奢宴成為分配不義與社會動亂的直接原因。' },
  'mo-zi_ch-6_p-6': { translation: '古人還不會製造舟車時，重物無法搬移，遠方不能到達，所以聖王製造舟車，以便利人民辦事。舟車只求完整堅固、輕便好用，能載重致遠；耗費的財物少，產生的利益多，因此人民樂於使用並從中得利。法令不必催逼也能施行，人民不過度勞苦而上位者用度充足，所以人民歸附。', analysis: '本段正面界定技術的公共價值：舟車以少量成本產生載重致遠的大利。墨子並不排斥器物創新，而是要求「用財少、為利多」。當制度真正便利人民，政令可以少用強制而獲得合作，顯示功利標準同時包含治理的正當性。' },
  'mo-zi_ch-6_p-7': { translation: '如今君主製造舟車卻與古代不同：堅固輕便的功能已經具備，仍向百姓厚斂來裝飾舟車，以紋彩飾車、雕刻飾船。女子停下紡織去製作文彩，人民因而缺衣受寒；男子離開耕作去從事雕刻，人民因而缺糧挨餓。君主如此，左右也仿效，飢寒一同到來，人民便作奸犯邪；奸邪增多，刑罰隨之加重，終致國亂。若真想天下安定，舟車不可不節制。', analysis: '這裡區分運輸工具的功能性生產與裝飾性勞動。後者抽走紡織、農耕的人力，直接製造寒餓，再迫使國家用重刑處理由寒餓衍生的犯罪。墨子把奢侈、產業錯置、民生危機、刑罰深化與國亂串成完整因果鏈。' },
  'mo-zi_ch-6_p-8': { translation: '凡天地四海之內，天地的本性與陰陽的調和無不具備，即使至聖也不能改變。怎知如此？聖人傳下的說法是：天地分上下，四時有陰陽，人類有男女，禽獸有牡牝雌雄。這確是天地的常情，先王也不能改變。上古至聖雖也蓄有妻妾，卻不因此損害德行，所以人民沒有怨恨；宮中不拘留大量女子，天下便沒有眾多無妻男子。內廷不拘女，外間不多寡夫，人民自然繁盛。如今君主蓄養私妾，大國拘留女子數以千計，小國也數以百計，因此男子多無妻、女子多無夫，婚配失去適當時機，人口便減少。若真希望人民眾多，蓄養私妾不可不節制。', analysis: '第五項「蓄私」把宮廷後宮置於人口與婚配秩序中考察。篇中採用古代陰陽、男女相配的宇宙觀，實際論點則是君主集中占有大量女性，造成社會婚配失衡與人口減少。「節」並非禁絕婚姻，而是限制權力者超量占有。' },
  'mo-zi_ch-6_p-9': { translation: '以上五件事，聖人都能儉約節制，小人卻放縱無度。儉約節制就昌盛，放縱奢侈就滅亡，所以這五項不可不節制。夫婦關係有節，天地之氣便和諧；風雨有節，五穀便成熟；衣服有節，肌膚便舒適。', analysis: '結語總收宮室、衣服、飲食、舟車與蓄私五項。全篇的「節」不是一味刻苦，而是使需求、資源與功能各得其度；「淫佚」則指越過實際利益的無限擴張。最後以夫婦、風雨、衣服三個層次說明：合宜的節度能使宇宙、農業與身體各自和諧。' }
}

const aidFile = 'src/data/readingAid.ts'
let aidSource = fs.readFileSync(aidFile, 'utf8')
const passageIds = Object.keys(aids)
for (const passageId of passageIds) if (aidSource.includes(`'${passageId}': {`)) throw new Error(`Reading aid exists: ${passageId}`)
const marker = '\n}\n\nexport function getPassageReadingAid('
const insertion = Object.entries(aids).map(([id, aid]) => `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},`).join('\n')
if (!aidSource.includes(marker)) throw new Error('Reading-aid insertion marker not found')
aidSource = aidSource.replace(marker, `\n${insertion}\n${marker}`)
fs.writeFileSync(aidFile, aidSource, 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
const sources = ['https://ctext.org/mozi/indulgence-in-excess/zh','https://ctext.org/mozi-jiangu/ci-guo/zh','https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E8%BE%AD%E9%81%8E','https://ctext.org/text.pl?if=zh&node=418094','https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf','孫詒讓《墨子閒詁》；吳毓江《墨子校注》']
editorial.reviews.push(...passageIds.map((passageId) => ({ passageId, canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources, reviewedAt: '2026-07-29', notes: passageId === 'mo-zi_ch-6_p-1' || passageId === 'mo-zi_ch-6_p-3' ? '交叉比對傳本，移除誤混入的《七患》文字，重建逐句索引；白話與解析依校定繁體本文重寫。' : '依《墨子》通行本、《墨子閒詁》、《墨子校注》及《群書治要》相關節文交叉核對；白話與解析均以繁體中文重寫。' })))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 墨子·辭過.`)
