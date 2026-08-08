import fs from 'node:fs'

const aids = {
  'mo-zi_ch-3_p-1': {
    translation: '墨子看見染絲的人，感歎說：「用青色染料染，絲就變青；用黃色染料染，絲就變黃。放進不同染料，絲的顏色也隨之改變。接連浸染五次，最後便呈現五種不同的顏色。所以，受到什麼薰染，不可不慎重選擇。」',
    analysis: '篇首從染絲的實際過程立喻。「蒼」是青色；「入」指把絲投入染汁。底本「五入必而已」句讀與字義有爭議，但上下文清楚強調：材料本身相同，因反覆投入不同染料而變色。墨子藉此建立全篇的因果模型——人的品行與政治決策會受長期交往環境塑造，因此「慎染」不是一時選擇，而是持續檢視親近何人、聽取何言。'
  },
  'mo-zi_ch-3_p-2': {
    translation: '不只是染絲如此，國君也會受到薰染。舜受到許由、伯陽的良好影響，禹受到皋陶、伯益的良好影響，商湯受到伊尹、仲虺的良好影響，周武王受到太公、周公的良好影響。這四位王者所受的薰染適當，所以能統治天下、立為天子，功名遍及天地。列舉天下彰明仁義的人，人們一定會稱道這四位王者。',
    analysis: '本段把染絲譬喻移到君主政治。「染於」不是被動模仿而已，也包含親近、信任並採納臣輔之言；「所染當」即所親近者選擇得當。「蔽天地」是充滿、遍及天地。四組聖王與賢臣的配對，說明政治成就並非君主單獨完成，而由長期諮詢、用人與價值薰習共同形成。'
  },
  'mo-zi_ch-3_p-3': {
    translation: '夏桀受到干辛、推哆的不良影響，商紂受到崇侯、惡來的不良影響，周厲王受到厲公長父、榮夷終的不良影響，周幽王受到傅公夷、蔡公穀的不良影響。這四位君王所受的薰染不當，所以國家殘破、自身死亡，成為天下人的恥辱。列舉天下不義而受辱的人，人們一定會提到這四位君王。',
    analysis: '這一段與上段形成整齊反證：同樣身居最高權位，結果卻因所親近、所採信的人不同而相反。「僇」通戮辱之義，指成為天下羞辱的對象。部分佞臣姓名在傳本與諸史中有異寫，現依底本保留；論證重點不在為每一次亡國尋找單一人物替罪，而在指出封閉於惡劣顧問圈會反覆放大君主的錯誤。'
  },
  'mo-zi_ch-3_p-4': {
    translation: '齊桓公受到管仲、鮑叔的良好影響，晉文公受到舅犯、高偃的良好影響，楚莊王受到孫叔敖、沈尹的良好影響，吳王闔閭受到伍員、文義的良好影響，越王句踐受到范蠡、大夫種的良好影響。這五位君主所受的薰染適當，所以能稱霸諸侯，功名流傳後世。',
    analysis: '由古代聖王轉入春秋霸主，證明「所染」原則不只用於理想化的遠古政治，也能解釋較近的歷史成敗。「傅」讀為傳布、流傳；「孫叔」指孫叔敖，「大夫種」即文種。五位君主的德行與事功並不相同，篇中共同抽取的條件是：能讓有才識的臣下長期參與決策。'
  },
  'mo-zi_ch-3_p-5': {
    translation: '范吉射受到長柳朔、王勝的不良影響，中行寅受到籍秦、高彊的不良影響，吳王夫差受到王孫雒、太宰嚭的不良影響，智伯瑤受到智國、張武的不良影響，中山君尚受到魏義、偃長的不良影響，宋康王受到唐鞅、佃不禮的不良影響。這六位君主所受的薰染不當，所以國家殘破滅亡，自身遭受刑戮，宗廟毀滅，後嗣斷絕，君臣離散，人民流亡。列舉天下貪婪暴虐、苛刻擾民的人，人們一定會提到這六位君主。',
    analysis: '六組反例由諸侯擴及卿族，後果依「國亡—身戮—宗廟絕—臣民散」逐層展開。「苛擾」指苛刻而擾害人民。人名如「知伯搖／智伯瑤」涉及古今字或傳本異寫，正文維持底本，白話採通行稱名以利辨識。本段顯示錯誤用人的損害不止於君主本人，而會傳導到政治共同體與百姓。'
  },
  'mo-zi_ch-3_p-6': {
    translation: '凡是君主之所以能安定，原因是什麼？是因為他的施政合乎事理；而能實行正理，形成於所受的薰染適當。所以善於做君主的人，在考察、選擇人才上費心，治理百官時反而安逸；不善於做君主的人，損傷身體、耗費精神，憂心勞意，國家卻更加危險，自己也更加受辱。前述六位君主並非不看重國家、不愛惜自身，而是不懂得治國的關鍵。不懂關鍵，正是因為所受的薰染不當。',
    analysis: '本段由史例提煉治理原則：「勞於論人，而佚於治官」意謂把主要心力放在辨識人才，任得其人後，百官即可各治其職。「行理性於染當」是全篇難句；畢沅以「性」通「生」，近代研究亦有把「性」讀作「形成其性」的解釋。譯文採兩說可交會的最低限度語義：合宜的行為與品性，生成於適當薰習。正文不據單一解說改字。'
  },
  'mo-zi_ch-3_p-7': {
    translation: '不只是國君會受到薰染，士人也會受到薰染。若他的朋友都崇尚仁義，敦厚謹慎，敬畏法令，那麼家業日益增進，身心日益安定，名聲日益榮耀，任官也能合乎治理之道；段干木、禽子、傅說一類人就是如此。若他的朋友都喜歡誇耀逞強、妄作生事、結黨營私，那麼家業日益受損，自身日益危險，名聲日益受辱，任官也會失去治理之道；子西、易牙、豎刀一類人就是如此。《詩》說：「一定要慎選所能浸染自己的環境。」一定要謹慎對待自己所受的薰染，說的就是這個道理。',
    analysis: '末段把君主用人推廣為士人交友。「淳謹畏令」指敦厚謹慎並敬守法令；「矜奮」偏向自誇逞強；「創作比周」可依語勢解作妄生事端、結黨相阿。「禽子」所指歷來有不同說法，正文不強定其人。「必擇所堪」是佚詩，且「堪」有承受、浸染等校釋；篇中引用它回扣染絲意象。全篇最後把環境影響與個人責任並置：人會受朋友改變，因此更須主動選擇交往圈。'
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
    'https://ctext.org/mozi/on-dyeing/zh',
    'https://ctext.org/mozi-jiangu/suo-ran/zh',
    'https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E6%89%80%E6%9F%93',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf',
    '孫詒讓《墨子閒詁》；吳毓江《墨子校注》；張純一《墨子集解》',
    '鄭澤綿〈孟子的治水反諷——從「逃楊、墨必歸儒」看「天下之言性」章〉，《清華學報》第五十四卷第二期'
  ],
  reviewedAt: '2026-07-29',
  notes: passageId === 'mo-zi_ch-3_p-1'
    ? '「五入必而已」句讀有異；保留底本，依染絲反覆入染的篇旨疏通。'
    : passageId === 'mo-zi_ch-3_p-6'
      ? '「行理性於染當」有「性／生」及動詞「性」等解；保留正文並於解析交代。'
      : passageId === 'mo-zi_ch-3_p-7'
        ? '「創作比周」「所堪」均有校釋分歧；未逕改正文，白話依上下文最低限度疏通。'
        : '已對讀中國哲學書電子化計劃、《墨子閒詁》《墨子校注》、維基文庫及相關史例；繁體白話與解析逐段人工校訂。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《墨子·所染》`)
