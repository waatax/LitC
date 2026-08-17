#!/usr/bin/env node

/** Complete every remaining flagged Wenshi Zhenjing passage, with passage-specific review. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'wenshi-zhenjing.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  return vm.runInNewContext(source.slice(source.indexOf('JSON.parse('), source.lastIndexOf(') as WorkBundle') + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8')
}

const updates = {
  'wenshi-zhenjing_ch-6_p-2': {
    translation: '關尹子說：偏好實踐仁德的人，常夢見松、柏、桃、李；偏好義的人，常夢見兵器、刀刃、金鐵；偏好禮的人，常夢見簠、簋、籩、豆等禮器；偏好智的人，常夢見江河湖澤；偏好信的人，常夢見山嶽原野。人的意識受五行分類牽動，通常會出現這種對應。然而夢中若聽到某件事，或正在思考某件事，夢境也會跟著改變，所以不能用五行把夢拘限成固定公式。聖人以心駕馭外物，又以本性收攝心念，使心與天地的生成變化相通，也就不受五行模式拘限。',
    analysis: '【主旨】本段先用五常與五行的傳統配屬解釋夢象，再立即加入「所聞」「所思」會改變夢境，否定僵硬的一對一占夢法。\n【配屬結構】仁配木，故見草木；義配金，故見兵刀金鐵；禮配火而以祭器表徵儀節；智配水，故見江湖川澤；信配土，故見山嶽原野。這套分類是古代象徵系統，不是現代心理學的實證定律。\n【詞義校正】底本應作「禦物以心」：以心調御對外物的反應；「攝心以性」是以本性收束分散心念；「造化」指天地生成變化。「役於五行」說人的偏好受分類模式牽引。\n【思想張力】前半承認類型化的解釋力，後半以夢會隨刺激變動及聖人不受拘束，限制模型的適用範圍。重點不是預測夢兆，而是從被心象牽引進到能反觀、統攝心象。',
    chapter: 6,
  },
  'wenshi-zhenjing_ch-6_p-5': {
    translation: '關尹子說：形體可以分開、可以結合，也可以延續、可以隱藏。一男一女可以生出兩個孩子，說明形體能夠分化；一男一女兩人共同生成一個孩子，說明形體能夠結合。服食巨勝子可以養生延年，說明形體可以延續；夜裡沒有月光和燈火，別人看不見我，說明形體可以隱藏。由一氣化生萬物，好比脫落的頭髮仍能再長，所以說形能分；由一氣會合萬物，好比破裂的嘴脣可以癒合，所以說形能合。用精神保全氣，用氣保全形體，便能延續形體；把形體會歸於神，再把神會歸於「無」，便能隱形。你是只想知道這個道理，還是真想實踐它呢？',
    analysis: '【主旨】本段以生殖、生長、癒合、光線與養生作比喻，說明形體並非封閉不變，而在分化、結合、延續與顯隱之間流動。\n【詞義與物質觀】「巨勝」是古代養生語境中的胡麻；「一氣生萬物／合萬物」把個體形體放進共同氣化過程。「神—氣—形」構成由精神活動、生命之氣到可見身體的層次。\n【論證方式】前四例先從日常可見現象證成四種可能，後四句再以氣、神、無提供宇宙論解釋。夜暗而不見只證明視覺上的隱藏，不能單獨證成肉體消失；文本在此由經驗譬喻跨向修煉主張。\n【末問意義】「欲知／欲為」把知識與工夫分開：理解術語不等於完成修行。閱讀時可把它視為古代身心論與養生想像，不能把延壽、隱形直接當成已被現代醫學證實的效果。',
    chapter: 6,
  },
  'wenshi-zhenjing_ch-9_p-13': {
    translation: '關尹子說：「不要以為笨拙粗陋就是大道的純質，應當樂於行事敏捷精煉；不要以為愚昧昏暗就是大道的韜晦深藏，應當樂於心境輕靈澄明；不要以為傲慢怠慢就是大道的高超孤傲，應當樂於和光同塵與眾和睦；不要以為漫無邊際就是大道的寬廣博大，應當樂於切中要害把握急務；不要以為愁悶幽怨就是大道的寂靜清修，應當樂於內心和悅歡欣。古代聖賢流傳下來的言論，學者如果死板機械地去效法往往會產生諸多流弊，不能不加以救正反省。」',
    analysis: '【題解與道家流弊之針砭】本段為《文始真經・九藥第九》名篇，關尹子直指後世學者對道家「質、晦、高、廣、寂」等概念的嚴重誤解與習氣偏枯，提出五對清醒的對治良藥。\n【詞義訓詁】「拙陋」：笨拙粗俗；「愚闇」：愚蒙昏暗；「傲易」：傲慢怠慢；「汗漫」：漫無邊際、放浪無拘；「幽憂」：憂鬱苦悶；「急要」：緊要切實之處；「悅豫」：喜悅安樂。\n【哲學反省論】真正的道家追求虛靈活潑、和光同塵的高妙境界，而非病態的愚鈍、傲世或孤僻。關尹子強調要分清「大道之實」與「形骸之弊」，反對將道家清靜化為消極避世與自命不凡。\n【現代思想解放】本章展現了極強的反教條主義精神，提醒學習任何傳統哲學都應取其精神精髓，避免陷入形式化、偏執化的認知陷阱。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-21': {
    translation: '關尹子說：人若不明白眼前最急迫、最根本的事，反而忙於過多的事、與己無關的事或標新立異的事，窮困、災禍便會隨之而來。他尤其不明白，道無處不在，不能丟下此時此地的實際處境，另到別處追求它。',
    analysis: '【主旨】本段批評以忙碌掩蓋失序：事務越多、越奇，不等於越接近道；先辨認「急務」，才不致讓注意力與資源耗散。\n【詞義】「急務」是當下迫切而根本之事；「他務」指旁出、與本分無關的事；「奇務」指刻意追逐怪異新奇。「捨此就彼」既是行動上的捨近求遠，也是修道上把道想成遠方特殊對象。\n【思想與應用】「道無不在」不是說所有選擇都同樣妥當，恰好相反：既然道在具體處境中，就應處理眼前責任。它可用來反省目標膨脹與新奇偏誤，但不能被拿來拒絕必要的長期規劃。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-22': {
    translation: '關尹子說：「天下的常理：捨棄至親而親近疏遠，捨棄根本而追逐枝末，捨棄賢能而任用愚鈍，捨棄近切而謀求遙遠，這種做法只能作為特定情勢下的權宜暫時之計罷了。如果將其當作常態長期推行，必定會引發嚴重的禍患危害。」',
    analysis: '【題解與常道與權變之界限】本段論述政治治理與人倫常道中的「常」與「變」，確立常道為本、權變不可久用的核心原則。\n【詞義訓詁】「捨親就疏」：捨棄親近者而親任疏遠者；「捨本就末」：忽略根本事務而專注細枝末節；「就」：趨向、遷就；「可暫而已」：只能作為非常時期的權宜應變。\n【政理與系統思維】關尹子指出，在特殊危機時刻，領導者可能被迫採取非常規手段（如捨本就末、捨近求遠以避險）；但治理體系必須迅速回歸「親親、尊賢、重本、務實」的健康常態，否則反常態操作必導致系統崩潰。\n【管理學反思】現代組織治理中，非常時期的應急手段（如超常規集權、特事特辦）若被常態化、制度化，必將滋生腐敗與效率低下；本章提供了深刻的制度理性自覺。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-24': {
    translation: '關尹子說：聖人談到宏大的事，可以用金玉般貴重的話；談到細小切近的事，也可以說桔梗、芣苢這類平常藥草。運用得當，桔梗、芣苢也能救活人；運用不當，即使金玉也會害死人。',
    analysis: '【主旨】語言和事物的價值不由名目貴賤決定，而由是否切合情境、能否產生合宜效果決定。\n【譬喻】金玉象徵尊貴宏大的言論；桔梗、芣苢是常見草藥，象徵平易細小之言。「生／斃」把言語使用比成用藥：普通藥材對症能救人，珍寶不對症反而致害。\n【修辭與界限】「大言／小言」「金玉／草藥」「當／不當」「生／斃」四組對照，迅速翻轉崇貴輕賤的預設。此處不是否定內容品質，而是說內容、時機、對象與用法必須共同判斷。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-27': {
    translation: '關尹子說：不相信愚昧的人很容易，但不盲從賢者就比較難；能不盲從一位賢者，仍未必能不盲從聖人；能不盲從一位聖人，也未必能放下千百聖人的共同權威。真正不把千百聖人的話當作外在成見的人，向外不固著於「他人」，向內不固著於「自我」，向上不把「道」看成固定對象，向下也不被具體事務的表象拘住。',
    analysis: '【主旨】本段把懷疑的難度逐級提高：對低權威保持距離容易，面對賢人、聖人及累積傳統仍能自主審察才難。\n【「不信」的尺度】這裡的「不信」不宜理解成否定一切知識或拒絕證據，而是不因身份與數量而盲從。末句更把人、我、道、事都解除為固定執著，指向不以任何概念作絕對權威。\n【章法與風險】三層「易／難」遞進，最後用外／內、上／下四方展開。它能支持反權威反省；若脫離文本脈絡，也可能被誤用為反智主義，因此實際判斷仍需理由、證據與可修正性。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-28': {
    translation: '關尹子說：聖人的言語幽微朦朧，是要使人像聾者那樣停止追逐聲音；聖人的言語深暗難見，是要使人像盲者那樣停止追逐形色；聖人的言語沉潛無聲，是要使人像啞者那樣停止逞口舌。所謂「聾」，就是不再被聲音牽引；所謂「盲」，就是不再被形色牽引；所謂「瘖」，就是不再以言語造作。於是不把道、外在事物和自我當成可由聽覺取得的對象，不把它們當成可由視覺掌握的形象，也不把它們當成能由言語說盡的概念。',
    analysis: '【主旨】本段用「聾、盲、瘖」的強烈逆向譬喻，要求暫停對聲色言說的執著，使道、事、我不再被當作可直接感取或說盡的固定對象。\n【詞義】「濛濛」偏於朦朧未分，「冥冥」偏於幽暗不可見，「沈沈」偏於深沉不顯；「不音言」意為不發言、不以言語造作。三者不是生理診斷，而是修辭性的感官懸置。\n【章法】三次「聖人言……所以使人……」立題，再以聲／色／言分釋，最後每一路都通到「道—事—我」，形成三乘三的矩陣。\n【倫理界限】文本借身心障礙作負面感官譬喻，反映古代語彙習慣；現代闡釋應避免把聽覺、視覺或語言障礙等同於認知缺陷，也不應把它當成拒絕溝通的理由。',
    chapter: 9,
  },
  'wenshi-zhenjing_ch-9_p-30': {
    translation: '關尹子說：談論「道」，就像向別人敘述一場夢。說夢的人可以描述夢裡有這樣的金玉、這樣的器皿、這樣的禽獸，卻不能把夢中之物取出來交給別人；聽的人雖能聽懂描述，也不能因此接過夢中之物、真正得到它。只有善於聆聽的人，既不拘泥於字句，也不忙著在字句上爭辯分判。',
    analysis: '【主旨】語言可以指向經驗，卻不能把經驗本身交付給聽者；談道尤其如此。文本要求讀者透過言語而不黏著言語。\n【夢喻】金玉、器皿、禽獸都是能被描述卻不能從夢中取出的物件，清楚區分「可說」與「可交付」。同樣，聽見道論不等於完成體驗或實踐。\n【末句】「不泥」是不拘滯字面；「不辨／不辯」有版本字形差異，可分別理解為不執著概念分判、不徒作口舌爭論，兩義在此相通。\n【界限】語言有限不代表所有說法無真偽，也不等於拒絕論證；較合理的讀法是把言說視為指引，仍須由實踐、反省與經驗檢驗。',
    chapter: 9,
  },
}

const bundle = loadBundle(bundleFile)

// Both the chapter text and an independent electronic edition read 禦/御, not 仰.
for (const passage of bundle.passages) passage.canonicalText = passage.canonicalText.replace('聖人仰物以心', '聖人禦物以心')
for (const sentence of bundle.sentences) {
  sentence.canonicalText = sentence.canonicalText.replace('聖人仰物以心', '聖人禦物以心')
  if (!sentence.chunks) continue
  sentence.chunks = sentence.chunks.map((chunk) => {
    if (Array.isArray(chunk)) return [chunk[0].replace('聖人仰物以心', '聖人禦物以心'), chunk[1]]
    return { ...chunk, text: chunk.text.replace('聖人仰物以心', '聖人禦物以心') }
  })
}

for (const [passageId, update] of Object.entries(updates)) {
  const passage = bundle.passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  passage.readingAid = { translation: update.translation, analysis: update.analysis }
}
writeBundle(bundleFile, bundle)

const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'))
for (const [passageId, update] of Object.entries(updates)) {
  const review = reviews.reviews.find((item) => item.passageId === passageId)
  if (!review) throw new Error(`Missing review: ${passageId}`)
  review.canonicalText = 'verified'
  review.translation = 'verified'
  review.analysis = 'verified'
  review.sources = [
    'https://ctext.org/wenshi-zhenjing/zh',
    `https://zh.wikisource.org/wiki/%E9%97%9C%E5%B0%B9%E5%AD%90/${update.chapter}`,
    'https://commons.wikimedia.org/wiki/File:NLC892-411999003932-135885_%E9%97%9C%E5%B0%B9%E5%AD%90%E6%96%87%E5%A7%8B%E7%9C%9F%E7%B6%93.pdf',
  ]
  review.reviewedAt = '2026-08-14'
  review.notes = `2026-08-14 逐句覆核〈${update.chapter === 6 ? '六匕' : '九藥'}〉原文、白話與解析；撤除「關尹孔子」誤稱及照抄式白話，依原典、章頁與掃描本重寫。`
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')

console.log('Completed Wenshi passages:', Object.keys(updates).join(', '))
