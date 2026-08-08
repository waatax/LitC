import fs from 'node:fs'

const aid = (translation, analysis) => ({ translation, analysis })
const reviewed = {
  'mo-zi_ch-14_p-1': aid(
    '聖人把治理天下當作自己的職責，就一定要知道禍亂從哪裡發生，然後才能治理；不知道禍亂的根源，就不能治理。這好比醫生治療人的疾病，一定要知道疾病從哪裡發生，然後才能醫治；不知道病因，就不能醫治。治理禍亂又何嘗不是如此？一定要知道禍亂的根源，然後才能治理；不知道禍亂從哪裡發生，就不能治理。因此，以治理天下為職責的聖人，不可不仔細考察禍亂的根源。',
    '【章旨】本段先建立全篇的論證方法：治亂如治病，必須先找出病因。【字詞】「攻」在此是治療、醫治；「所自起」指由何處發生、根源何在；「焉能」意為然後才能。【論證】墨子用醫病作類比，把政治倫理問題化為可追究的因果問題；下文將以「不相愛」回答天下之亂的共同病因。'
  ),
  'mo-zi_ch-14_p-2': aid(
    '那麼，應當考察禍亂從哪裡發生。它起於人與人不相愛。臣與子不忠於君、不孝於父，就是所說的禍亂。兒子只愛自己而不愛父親，所以損害父親來使自己得利；弟弟只愛自己而不愛兄長，所以損害兄長來使自己得利；臣下只愛自己而不愛君主，所以損害君主來使自己得利，這就是所說的禍亂。至於父親不慈愛兒子、兄長不友愛弟弟、君主不恩惠臣下，也同樣是天下所說的禍亂。父親只愛自己而不愛兒子，所以損害兒子來使自己得利；兄長只愛自己而不愛弟弟，所以損害弟弟來使自己得利；君主只愛自己而不愛臣下，所以損害臣下來使自己得利。這是為什麼呢？全都起於彼此不相愛。',
    '【章旨】墨子從君臣、父子、兄弟三種關係的雙向失序，證明偏愛自己而不愛對方會形成「虧人自利」。【字詞】「虧」是損害；「慈」不只指父母之愛，在此也概括君惠臣、兄友弟；「孝」則連同臣忠君、弟敬兄一併論述。【結構】先由下對上說不忠不孝，再由上對下說不慈不惠，顯示責任不是單向服從，而是關係雙方都不得以損人求利。'
  ),
  'mo-zi_ch-14_p-3': aid(
    '即使天下那些做盜賊的人也是如此。盜只愛自己的家，不愛別人的家，所以偷竊別人的家來使自己的家得利；賊只愛自己，不愛別人，所以傷害別人來使自己得利。這是為什麼呢？全都起於彼此不相愛。至於大夫互相擾亂別人的封邑、諸侯互相攻打別人的國家，也是如此。大夫各自只愛自己的封邑，不愛別人的封邑，所以擾亂別人的封邑來使自己的封邑得利；諸侯各自只愛自己的國家，不愛別國，所以攻打別國來使本國得利。天下的亂事，全都包含在這些情形中了。考察它們從何而起？全都起於彼此不相愛。',
    '【章旨】論證由家庭倫理逐層推到盜賊行為、卿大夫兼併與諸侯戰爭，指出大小禍亂具有同一結構。【字詞】「室」指家室；前一「盜」偏指竊取財物，後一「賊」作動詞，指殘害人身；「家」是卿大夫的封邑或政治家族；「亂家」是侵擾、篡奪他家；「亂物」即亂事。【思想】墨子不是把兼愛限於私人情感，而是用「不損人以自利」貫通個人、家族與國際政治。'
  ),
  'mo-zi_ch-14_p-4': aid(
    '假使天下的人都能普遍相愛，愛別人如同愛自己，還會有不孝的人嗎？把父親、兄長和君主看得如同自己，哪裡還會施行不孝不忠的事？還會有不慈愛的人嗎？把弟弟、兒子和臣下看得如同自己，哪裡還會施行不慈不惠的事？所以不孝與不慈都不會存在。還會有盜賊嗎？把別人的家看作自己的家，誰還會偷竊？把別人的身體看作自己的身體，誰還會傷害？所以盜賊不會存在。還會有大夫互相擾亂封邑、諸侯互相攻打國家的事嗎？把別人的封邑看作自己的封邑，誰還會擾亂？把別人的國家看作自己的國家，誰還會攻打？所以大夫相亂家、諸侯相攻國的事都不會存在。',
    '【章旨】本段以反事實推演提出治亂的解方：若能「視人若己」，上一段列出的不孝不慈、偷竊殘害與兼併攻伐都會失去動機。【字詞】「兼相愛」指不受親疏、家國界線限制而彼此相愛；「惡」讀作何、哪裡；「施」是施行；「亡有」即無有。【校勘】傳本此處另有「故不慈不孝亡」「故盜賊有亡」等讀法，「有亡」是古代賓語前置，仍解作「無有」。本庫依《四部叢刊》系統通行本作「亡有」，不以今語習慣反改古本。【思想】兼愛在此首先是一項行為原則：不以損害他人、他家、他國來謀取自身利益。'
  ),
  'mo-zi_ch-14_p-5': aid(
    '假使天下的人都能普遍相愛，國與國不互相攻打，家與家不互相擾亂，盜賊不再存在，君臣、父子都能盡到忠惠孝慈，那麼天下就會得到治理。因此，以治理天下為職責的聖人，怎能不禁止彼此仇害而勉勵彼此相愛呢？所以天下彼此兼愛就會安定，彼此仇視就會混亂。因此墨子說：「不能不勉勵人們愛人，道理就在這裡。」',
    '【章旨】本段總結全篇：兼愛是治的原因，交惡是亂的原因，政治上的當務之急便是「禁惡勸愛」。【字詞】前後兩個「惡」讀音與意義不同：「惡得」的「惡」讀作何，意為怎能；「禁惡」的「惡」指相互憎惡、侵害；「勸」是勉勵、鼓勵。【篇章】全文依「先察亂源—列舉不相愛之害—反推兼愛之效—提出治理主張」展開，並非只給出抽象格言，而是一套完整的因果論證。'
  ),
}

const readingAidFile = 'src/data/readingAid.ts'
let readingAidSource = fs.readFileSync(readingAidFile, 'utf8')
const marker = '\n}\n\nexport function getPassageReadingAid('
const entries = Object.entries(reviewed).map(([id, value]) => `  '${id}': ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')},`).join('\n')

for (const id of Object.keys(reviewed)) {
  const pattern = new RegExp(`\\s{2}'${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}': \\{[\\s\\S]*?\\n  \\},`, 'g')
  readingAidSource = readingAidSource.replace(pattern, '')
}
if (!readingAidSource.includes(marker)) throw new Error('找不到 readingAid 插入位置')
readingAidSource = readingAidSource.replace(marker, `\n${entries}\n${marker}`)
fs.writeFileSync(readingAidFile, readingAidSource, 'utf8')

const editorialFile = 'src/data/editorialReviews.json'
const editorial = JSON.parse(fs.readFileSync(editorialFile, 'utf8'))
const ids = Object.keys(reviewed)
editorial.reviews = editorial.reviews.filter(item => !ids.includes(item.passageId))
const sources = [
  'https://ctext.org/mozi/universal-love-i/zh',
  'https://ctext.org/mozi-jiangu/juan-si/zh',
  'https://zh.wikisource.org/zh-hant/%E5%A2%A8%E5%AD%90/%E5%85%BC%E6%84%9B%E4%B8%8A',
  'https://ctext.org/library.pl?if=gb&res=112767',
  '孫詒讓《墨子閒詁》卷四〈兼愛上〉；吳毓江《墨子校注》卷四〈兼愛上〉',
]
editorial.reviews.push(...ids.map(passageId => ({
  passageId,
  canonicalText: 'verified',
  translation: 'verified',
  analysis: 'verified',
  sources,
  reviewedAt: '2026-07-29',
  notes: passageId === 'mo-zi_ch-14_p-4'
    ? '逐字對校；「亡有」與「亡／有亡」為版本異文，本庫保留《四部叢刊》系統通行讀法，解析並列古本語序。'
    : passageId === 'mo-zi_ch-14_p-5'
      ? '逐字對校；修復末句右引號被拆成獨立句的資料結構錯誤，正文未改。'
      : '逐字對校《墨子》通行本、《墨子閒詁》與《墨子校注》，重寫繁體白話及章法解析。',
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(editorialFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${ids.length} passages in 《墨子·兼愛上》。`)
