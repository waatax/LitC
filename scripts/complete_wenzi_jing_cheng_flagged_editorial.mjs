#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BUNDLE_FILE = path.join(ROOT, 'src', 'data', 'work_chunks', 'wenzi.ts')
const REVIEW_FILE = path.join(ROOT, 'src', 'data', 'editorialReviews.json')
const C_TEXT = 'https://ctext.org/wenzi/jing-cheng/zh'
const WIKISOURCE = 'https://zh.wikisource.org/zh-hant/%E6%96%87%E5%AD%90/%E5%8D%B7%E4%BA%8C'
const SKQS = 'https://zh.wikisource.org/wiki/%E6%96%87%E5%AD%90_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%85%A8%E8%A6%BD'

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0 || end <= start) throw new Error('找不到 WorkBundle payload')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8')
}

const updates = {
  'wenzi_ch-2_p-1': {
    translation: `老子說：天達到它的高度，地達到它的厚度，日月照耀、群星明朗、陰陽和諧，並非刻意造作，只是各自端正其運行法則，萬物便自然化生。陰陽四時不是有意去生萬物，雨露按時降下也不是有意養育草木；神明之氣交接、陰陽和合，萬物便得以生長。所謂道，是把精氣藏在內部，使精神安住於心；保持寂靜恬淡、內心和悅，空曠而無形，寂然而無聲。

依此治理，官府好像沒有繁事，朝廷好像沒有人刻意操弄；沒有被迫隱居的士人，也沒有逃離政令的人民，沒有繁重勞役，也沒有因刑罰不公而生的怨恨。天下都景仰君上的儀表、遵從君主的旨意；遠方異國即使要經過多重翻譯也前來，不是君主逐家走訪、逐人接見，而只是把真誠之心推廣施行於天下。因此獎賞善者、懲罰暴者，是端正的命令；命令之所以能實行，靠的卻是內在精誠。法令即使明白，也不能自行生效，必須等待精誠支撐。所以統合大道施及人民而人民仍不服從，原因是精誠沒有把他們包容在內。`,
    analysis: `【主旨】本段區分「政令正確」與「政令真正生效」：賞善罰暴只是制度表層，能使遠近信服的是統治者內在精誠及低擾動的治理實踐。
【章法與訓詁】開頭以天地日月不刻意而萬物自化作譬喻，中段描畫「官府若無事」的政治效果，末段以「令雖明不能獨行」點題。「重譯而至」指遠國語言多重轉譯後來朝；「摠道」即統合、總持大道。
【倫理界限】精誠不能取代制度、程序與權利保障；文中的無事政治應理解為減少擾民與命令能取得信任，不是取消行政責任。`,
    notes: '將近乎照抄原文的白話逐句重譯，改正「老孔子」誤稱，完整交代自然無為、官府低擾動、遠國重譯及「明令仍待精誠」結論。解析聚焦制度與信任的差別，並補現代治理倫理界限。',
  },
  'wenzi_ch-2_p-2': {
    translation: `老子說：天布置日月星辰，展開四時，調節陰陽；白日以陽光曝曬萬物，夜間讓它們休息，風使它們乾燥，雨露使它們濕潤。天生養萬物時，人看不見它如何養育，萬物卻持續生長；它使萬物凋亡時，人看不見它奪去什麼，萬物卻自然消逝，這叫神明。因此聖人取法於此：興起福祉時，人看不見具體原因，福祉卻已形成；消除禍患時，人看不見禍患從何消除，它卻已消退。想逐項稽考難以找到，仔細觀察又並非虛假；按日計算好像不足，按年計算卻綽有餘裕。它寂然無聲，有時一句話便能大大感動天下，這是以合乎天心的方式推動教化。

所以古人相信，精誠在內形成，氣便上感於天，於是景星出現、黃龍下降、鳳凰到來、甘泉湧出、嘉穀生長，河不氾濫、海不起巨浪；若違逆天理、殘害萬物，便會有日月蝕、五星失序、四時錯亂、晝暗夜明、山崩川涸、冬雷夏霜等異象。天與人似有相通之處；國家將衰亡時，天象變異，世道混亂時虹霓出現。萬物彼此相連，精氣互相感迫，因此神明之事不能以智巧偽造，也不能靠強力取得。

所以大人使德性與天地相合，明察與日月相合，靈應與鬼神相合，信用與四時相合；胸懷天心、抱持地氣，守虛和、含中和，不出堂室而影響四海，改變習俗，使人民受化而遷善，彷彿這些善行都由自己內在生出，這就是以精神感化。`,
    analysis: `【主旨與章法】本段先由日月風雨的無聲作用說教化須累積而成，再以祥瑞災異建立天人感應圖式，最後描寫大人以內在精誠移風易俗。中心仍是「日計不足，歲計有餘」：真正影響常在長期中顯現。
【名物】景星、黃龍、鳳凰、醴泉、嘉穀是傳統政治祥瑞；日月薄蝕、五星失行、冬雷夏霜則被視作失政災異。「四時相乘」指季節秩序彼此侵凌錯位。
【史料與科學界限】祥瑞災異屬古代天人感應政治語言，不能當作君主德行會直接控制天文、氣象或地質事件的現代科學證據；其思想史作用在於用宇宙秩序約束政治權力。`,
    notes: '原白話只譯到「一言而大動天下」，漏去祥瑞、災異與大人神化約半段；本次補全並改正「老孔子」。解析分清古代天人感應的政治功能與現代天文氣象因果。',
  },
  'wenzi_ch-2_p-17': {
    analysis: `【主旨】本段以勇士一呼使三軍退避，說明感召力來自內在誠意；若言語有人領唱卻無人應和，便顯示內心、表情和行動彼此不一致。
【章法與詞義】文章依「言說—容貌—感忽」逐層深入：言語不能到達的由神色傳達，神色不能到達的由內心感通。「求諸己」是先整頓自身，而非用命令強制外界；「不可以照期」意指精誠感通不能指定日期、按表強求。
【現代界限】此處的「形接」可理解為真誠透過聲氣、表情與行動被他人感受，不必推論成超自然心靈感應；政治感召也仍需制度責任配合。`,
    notes: '保留原有完整白話並重寫模板解析，逐層說明言說、容貌、感忽與「求諸己」；對「形接」採可觀察的聲氣行動解釋，不擴張為超自然斷言。',
  },
}

const bundle = loadBundle(BUNDLE_FILE)
const reviewsDocument = JSON.parse(fs.readFileSync(REVIEW_FILE, 'utf8'))
const reviews = new Map(reviewsDocument.reviews.map((review) => [review.passageId, review]))
for (const [passageId, update] of Object.entries(updates)) {
  const passage = bundle.passages.find((item) => item.id === passageId)
  const review = reviews.get(passageId)
  if (!passage || !review) throw new Error(`找不到 ${passageId}`)
  passage.readingAid = { ...passage.readingAid, ...(update.translation ? { translation: update.translation } : {}), analysis: update.analysis }
  passage.sourceRefs = [
    { label: '中國哲學書電子化計劃《文子・精誠》', edition: '通行本篇章直達頁，2026-08-14 對讀', url: C_TEXT },
    { label: '維基文庫《文子・卷二》', edition: '繁體卷二全文，2026-08-14 對讀', url: WIKISOURCE },
    { label: '維基文庫《文子》四庫全書本', edition: '異文輔助對讀', url: SKQS },
  ]
  Object.assign(review, { canonicalText: 'verified', translation: 'verified', analysis: 'verified', sources: [C_TEXT, WIKISOURCE, SKQS], reviewedAt: '2026-08-14', notes: update.notes })
}
reviewsDocument.updatedAt = '2026-08-14'
writeBundle(BUNDLE_FILE, bundle)
fs.writeFileSync(REVIEW_FILE, `${JSON.stringify(reviewsDocument, null, 2)}\n`, 'utf8')
console.log(`Updated ${Object.keys(updates).length} passages in 《文子・精誠》`)
