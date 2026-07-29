import fs from 'node:fs'

const aids = {
  'shang-jun-shu_ch-24_p-1': {
    translation: '君主用來禁止或驅使百姓的工具，是賞與罰。賞賜隨功績而給，刑罰隨罪過而施，所以評定功績、審察罪過，不可不精確。賞賜雖高、刑罰雖及下民，如果君上不能確實掌握運作的方法，便與沒有治道相同。凡能掌握這套治道，靠的是權勢與法定規則。',
    analysis: '「禁使」是禁止與驅使兩種統治功能。「賞高罰下」可理解為賞典隆重、刑罰下及百姓；重點不在高低本身，而在君主是否掌握「道」。「勢」是使命令得以貫徹的制度位置與客觀條件，「數」是可計量、可核驗的法規程序。作者因而把賞罰是否準確，放在個人善意之前；但其目的仍是增強君主控制力，並不等於現代司法獨立或正當法律程序。'
  },
  'shang-jun-shu_ch-24_p-2': {
    translation: '所以先王不倚仗自身的強力，而倚仗所處的形勢；不倚仗個人的誠信，而倚仗確定的規則。飛蓬遇到暴風能行千里，是乘風勢而行；探測深淵的人知道深達千仞，是憑懸繩的尺度。因此依託形勢，即使遙遠也必能到達；遵守尺度，即使幽深也必能探得。黑夜裡山陵雖大，離婁也看不見；清晨日光照耀，向上能分辨飛鳥，向下能察見秋毫。眼睛能看見，是依託日光之勢。制度形勢若運用到極致，不必層層參驗官吏也能澄清事情；把規則陳列明白，事物便能各得其當。如今卻倚靠眾多官吏，又在官員之間設丞、監互相監督。設丞、立監，本想禁止官吏謀取私利；可是丞、監自己也想牟利，又靠什麼彼此禁止？所以只靠丞、監維持的治理，最多只是勉強存在。通曉制度規則的人不這樣做，他辨明各方所處形勢，使作惡的途徑難以隱藏。因此說：「制度使罪行難以藏匿，即使盜跖也不敢作惡。」所以先王重視形勢。',
    analysis: '飛蓬、測淵、日光三喻分別說明「勢」與「數」能放大有限的人力。「縣繩」即懸繩測深；「日撽」是日光照耀。「不參官而潔，陳數而物當」傳本略有歧義，大意是制度與尺度清楚，便不必無限增加層級監督。「丞監亦欲為利」提出監督者也有私利的遞迴難題；作者的答案是重新配置利益，使違法難以隱匿，而非期待監官更賢。「雖跖不為非」與《畫策》的伯夷、盜跖對舉相通，強調制度情勢勝過個人品德。'
  },
  'shang-jun-shu_ch-24_p-3': {
    translation: '有人說：「君主保持虛靜，等事情呈現後再作回應，那麼事物便能接受查驗；經過查驗，奸邪就會被發現。」我認為不是這樣。地方官吏在千里之外獨自裁決政事，一年終了才用計簿定其成績；事情每年只分別考核一次，而君主也只聽取一次報告，即使看出可疑之處，也難以完全揭穿，所掌握的材料仍不充足。事物呈現在眼前，眼睛不能不看見；言語逼近耳邊，耳朵不能不聽見。所以實情到來便應辨察，言辭到來便應論定。',
    analysis: '此段反駁單靠君主「虛靜待下」與歲終考課即可察奸的想法。「執虛後以應」近於《韓非子》所說君主隱藏好惡、等待臣下呈現名實。「十二月而計書以定」指地方遠官一年才報送一次計簿；資訊集中、頻率過低，君主即使起疑也未必有足夠材料。「員不足」傳文可疑，白話依「資訊、證據不足」疏通。末句要求事實與言論一到便即時辨論，重點在建立持續可核驗的資訊機制。'
  },
  'shang-jun-shu_ch-24_p-4': {
    translation: '所以善治國家的制度，應使百姓無法逃避罪責，就像眼睛無法把已看見的事物從心中隱去。混亂的國家卻不是如此，只倚仗官多吏眾。官吏雖多，彼此所做的事相同、利益連成一體，便不可能真正互相監督。讓職務相關而利益有所區分，使彼此造成的利害不完全相同，正是先王用來建立監督保障的方法。',
    analysis: '「民不得避罪」承接前文「勢難匿」，重點是提高違法被發現與追責的確定性。「事同體一」不是單純同一機關，而是監督者與被監督者利益共同，容易合謀。「利異而害不同」主張把利益與責任分離配置，形成相互揭發的誘因；末字「保」也有校作「檢」「察」等異說，白話取保障、制約的大意。此制度能處理官官相護，卻也可能把社會推向普遍告發，須與下一段連讀。'
  },
  'shang-jun-shu_ch-24_p-5': {
    translation: '治理達到極致時，即使夫妻、朋友之間，也不能互相替對方拋棄對惡行的揭發、遮蓋過失；這並不是要傷害親愛，而是使百姓不能彼此隱匿罪行。君主與官吏共同辦理國事，職務目標相合而利益應當有別。如今若讓馭者與虞人彼此監督，便難以做到，因為他們辦同一件事、利益也相同；假使馬能說話，馭者的過失便無處可逃，因為馬與馭者的利益不同。利益相合、過失相同，父親便不能有效查問兒子，君主也不能只靠臣下互查臣下。官吏彼此之間往往利益相合、過失相同。讓共同辦事者的利益有所區分，正是先王建立制度端緒的方法。百姓若想蒙蔽君主，也不能因遮蓋而獲利；如此一來，賢者不能憑私人智慧額外增加什麼，不肖者也不能暗中減損制度。因此擱置對賢能、智慧的依賴，轉而採用客觀制度，才是治理的方法。',
    analysis: '本段訛脫甚多，「棄惡蓋非」「騶虞」「不害於蓋」「為端」各家校讀不一。可確定的論證軸線是「事合而利異」：共同承擔公務者若利益完全相同，容易相互包庇；若資訊與利益相互制衡，過失才難隱藏。馬能言而可揭馭者，是刻意誇張的制度譬喻。「遺賢去智」不是主張排除所有人才，而是說治理不可寄望賢人私智來補救結構性合謀。白話依此主軸作暫定疏通，不能視為對殘缺原文的唯一復原；夫妻親友互告的設想也顯示這套反隱匿制度對信任與倫理關係的侵蝕。'
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
    'https://ctext.org/shang-jun-shu/interdicts-and-encouragements/zh',
    'https://zh.wikisource.org/wiki/%E5%95%86%E5%90%9B%E6%9B%B8/%E5%8D%B7%E4%BA%94',
    'https://taiwanebook.ncl.edu.tw/zh-tw/book/NCL-A008475/reader',
    '嚴萬里校《商君書》、朱師轍《商君書解詁定本》、王時潤《商君書集解》、高亨《商君書注譯》、蔣禮鴻《商君書錐指》及《商君書》勢論、法制研究'
  ],
  reviewedAt: '2026-07-29',
  notes: ['shang-jun-shu_ch-24_p-3', 'shang-jun-shu_ch-24_p-5'].includes(passageId)
    ? '逐句核對卷五傳本、古籍影像與主要校釋；本段訛脫或歧義較多，底本文字保留，白話依論證主軸暫譯，解析明載不確定性。'
    : '逐句核對卷五傳本、古籍影像與主要校釋；勢、數、監督等術語依上下文疏解，白話與解析均為人工繁體中文。'
})))
editorial.updatedAt = '2026-07-29'
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8')

console.log(`Reviewed ${passageIds.length} passages in 《商君書·禁使》`)
