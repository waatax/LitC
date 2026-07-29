import fs from 'node:fs'

const aids = {
  'mo-zi_ch-7_p-1': {
    translation: '程繁問墨子說：「先生說聖王不製作音樂。可是從前諸侯處理政事疲倦了，就用鐘鼓之樂休息；士大夫處理政事疲倦了，就用竽瑟之樂休息；農夫春耕、夏耘、秋收、冬藏，疲倦時也敲擊陶器作樂。如今先生說聖王不作樂，這就像馬一直套著車而不卸駕，弓一直張著而不放鬆，恐怕不是有血氣的人能夠做到的吧？」',
    analysis: '程繁從人的生理需要發難：勞動之後必須休息，而音樂正是一種恢復身心的方式。「馬駕不稅、弓張不弛」用持續緊繃必然損壞的譬喻，質疑墨家的非樂主張是否違反人情。這使爭論焦點不在音樂是否悅耳，而在它是否具有正當的休養功能。'
  },
  'mo-zi_ch-7_p-2': {
    translation: '墨子回答：「從前堯舜居住茅草屋，並以此建立禮制和音樂。商湯把夏桀放逐到大水一帶，統一天下而立為王，功業建立、沒有重大後患之後，承用先王之樂，又創作名為《護》的音樂，並修成《九招》。周武王戰勝殷商、誅殺紂王，統一天下而立為王，功業建立、沒有重大後患之後，也承用先王之樂，又創作《象》。周成王承襲先王之樂，又創作《騶虞》。可是成王治理天下不如武王，武王不如成湯，成湯又不如堯舜。因此音樂越繁盛，治理的成效反而越少。由此看來，音樂不是用來治理天下的手段。」',
    analysis: '墨子沒有直接否定休息需求，而把問題轉向治國效用。他排列堯舜、成湯、武王、成王，建立「樂愈繁而治愈寡」的反向比較，主張政治成效不能歸功於音樂。這是墨家一貫的功利檢驗：即使聖王有樂，也必須分清伴隨現象與真正治因。篇中的樂名及若干語句有傳本增補，本文依孫詒讓校本保存通行讀法。'
  },
  'mo-zi_ch-7_p-3': {
    translation: '程繁說：「先生說聖王沒有音樂，可是這些事例明明也是音樂，怎麼能說聖王無樂呢？」墨子說：「聖王的命令，是要把過多的事物減少。飲食固然有益，但人知道餓了就吃，這點見識太淺，不能算作智慧。如今聖王雖有音樂，數量卻很少，少到也可以說是沒有。」',
    analysis: '本段澄清「無樂」是限制性表述，不必理解為絕對零音樂。孫詒讓認為「多寡之」當讀作「多者寡之」，即把過量者減少；「因為無智」或校作「固為無智」，意在說餓而知食只是最低限度的本能。墨子的答辯因此是：聖王即使用樂，也只保留極少、合乎節用的部分，不能據此把音樂視為治國根本。'
  }
}

const passageIds = Object.keys(aids)
const aidFile = 'src/data/readingAid.ts'
let aidSource = fs.readFileSync(aidFile, 'utf8')
for (const id of passageIds) if (aidSource.includes(`'${id}': {`)) throw new Error(`Reading aid exists: ${id}`)
const marker = '\n}\n\nexport function getPassageReadingAid('
const insertion = Object.entries(aids).map(([id, aid]) => `  '${id}': ${JSON.stringify(aid, null, 2).replace(/\n/g, '\n  ')},`).join('\n')
if (!aidSource.includes(marker)) throw new Error('Reading-aid insertion marker not found')
aidSource = aidSource.replace(marker, `\n${insertion}\n${marker}`)
fs.writeFileSync(aidFile, aidSource, 'utf8')

const reviewFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'))
editorial.reviews = editorial.reviews.filter((review) => !passageIds.includes(review.passageId))
const sources = [
  'https://ctext.org/mozi/threefold-argument/zh',
  'https://ctext.org/mozi-jiangu/san-bian/zh',
  'https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E4%B8%89%E8%BE%AF',
  'https://upload.wikimedia.org/wikipedia/commons/e/ec/SSID-13362508_%E5%A2%A8%E5%AD%90%E6%A0%A1%E6%B3%A8_1.pdf',
  '孫詒讓《墨子閒詁》；吳毓江《墨子校注》'
]
editorial.reviews.push(...passageIds.map((passageId) => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources,
  reviewedAt: '2026-07-29',
  notes: passageId === 'mo-zi_ch-7_p-3'
    ? '原文依通行校本；「多寡之」「因為無智」存在舊本訛誤，解析中明列孫詒讓「多者寡之」「固為無智」校說，不逕以推校字改動正文。'
    : '以《正統道藏》系統通行本文、《墨子閒詁》與《墨子校注》交叉核對；白話與解析以繁體中文重新撰寫。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${passageIds.length} passages in 墨子·三辯.`)
