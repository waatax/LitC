#!/usr/bin/env node

/** Complete the three remaining substantive Sunzi editorial gaps. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'art-of-war.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  if (start < 0 || end < 0) throw new Error(`Cannot locate WorkBundle payload in ${file}`)
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const jsonLiteral = JSON.stringify(JSON.stringify(bundle))
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${jsonLiteral}) as WorkBundle\n`, 'utf8')
}

const updates = {
  'art-of-war_ch-2_p-4': {
    analysis: '【主旨】本段把「因糧於敵」落實為後勤、激勵與俘獲物整編三個環節：就地取得敵糧，既減少本國遠途輸送，也把敵方資源轉為己方戰力。\n【數量與制度】「一鍾當吾二十鍾」「一石當我二十石」不是糧食本身憑空增值，而是說明千里轉運的人力、牲畜與沿途耗損極重。使士卒奮勇需要共同敵愾，奪取敵利則要用賞賜建立可預期的分配規則。\n【操作層次】俘獲戰車後，要獎賞先登者、換上本軍旗幟、混編使用；對降卒則善待供養。這些動作把一次戰術繳獲轉化為可持續運用的兵力與裝備。\n【章法與界限】文勢依「糧食成本—作戰動機—接收程序—益強結果」逐層推進，以「勝敵而益強」收束。此處描述古代戰爭的資源轉用邏輯；對俘虜的處置在今日仍須受國際人道法約束，不能把古代語境當作現代行為的充分正當化。',
    note: '2026-08-14 逐句重寫解析：補足敵糧運輸成本、賞罰激勵、戰車與降卒整編、章法及現代人道界限。',
  },
  'art-of-war_ch-3_p-1': {
    translation: '孫子說：大凡軍事用兵的法則：使敵國完好無損地歸順降服是最高明的上策，擊破摧毀敵國是次一等的策略；使敵方全軍完好無損地降服是最高明的上策，擊潰殲滅敵軍是次一等的策略；使敵方全旅完好無損地降服是上策，擊破其旅是次一等的；使敵方全卒、全伍完好降服是上策，擊破其卒、伍是次一等的。所以，即便百戰百勝，也算不上最高明的用兵境界；不用直接兵刃交戰而能使敵軍徹底屈服降順，才是最高明的上善境界。',
    analysis: '【題解與全勝戰略】本段為《孫子兵法・謀攻篇》開卷總綱，確立了兵家最具哲學高度的「全勝」戰略思想與「不戰而屈人之兵」之最高境界。\n【詞義與編制】「全」：使之完好、保全；「軍、旅、卒、伍」：古代軍隊編制，一軍萬二千五百人，一旅五百人，一卒百人，一伍五人；「不戰而屈人之兵」：透過政治謀略、外交博弈、伐謀伐交等非直接毀滅性手段使敵屈服。\n【成本與戰略哲學】孫子將「全」置於「破」之上，其深刻哲理在於戰爭的目的是保全國家與人民，毀滅性的擊破會造成敵我雙方重大的生命與財富耗損。以最小成本達成戰略目的，才是至善之道。\n【現代和平與博弈論】「不戰而屈人之兵」被現代戰略學與博弈論視為威懾理論、危機管控與預防性外交的古代先驅，對現代國防安全與國際爭端和平解決具有歷久彌新的價值。',
    note: '2026-08-14 覆核謀攻篇開篇：完整對讀全勝哲學、軍制名物、成本效益分析與不戰屈人之兵現代博弈界限。',
  },
  'art-of-war_ch-7_p-2': {
    translation: '帶著全軍所有輜重裝備去爭奪戰略先機，行軍遲緩就會趕不及；丟棄輜重部隊去爭奪先機，後勤輜重就容易蒙受損失拋棄。所以收起鎧甲輕裝急進，日夜不停息地奔馳，以兩倍於常規的速度日夜兼程：如果奔襲百里去爭奪先機，那麼三軍將領都會遭到敵軍俘虜，體魄強勁的士兵走在前面，疲憊不堪的士兵落在後面，按照這種急行軍的規律只有十分之一的兵力能按時趕到；如果奔襲五十里去爭奪先機，前鋒主將就會受挫折，只有半數兵力能按時趕到；如果奔襲三十里去爭奪先機，也只有三分之二的兵力能到達。所以軍隊沒有輜重物資就會滅亡，沒有糧食供應就會滅亡，沒有物資儲備就會滅亡。因此，不瞭解周邊諸侯戰略圖謀的人，不能預先與之締結外交同盟；不熟悉山林、險阻、沼澤地形的人，不能貿然行軍；不能啟用當地嚮導的人，無法真正獲取地理優勢。',
    analysis: '【題解與軍爭後勤極限】本段為《孫子兵法・軍爭篇》核心，以精確的數字模型（百里、五十里、三十里）剖析輕軍冒進奪利的致命代價，確立後勤輜重在軍事戰略中的命脈地位。\n【詞義訓詁】「舉軍」：全軍攜帶所有輜重物資；「委軍」：丟下後勤輜重大隊；「卷甲」：收起重甲輕裝；「蹶」：受挫、跌倒受損；「委積」：儲備之糧草物資；「沮澤」：水草叢生之泥濘沼澤；「鄉導」：引路之嚮導。\n【軍事力學與生理極限】孫子揭示了速度與後勤、體力與戰鬥力之間的客觀物理規律。長途奔襲會造成隊伍脫節與士兵疲竭，使優勢兵力被分散消解；「軍無輜重則亡」更是兵家不可違背的鐵律。\n【現代戰略後勤啟示】現代戰爭與重大企業專案推進中，盲目追求推進速度而忽視後勤供應鏈與團隊身心承受極限，往往是導致崩潰的主因；本章提供了嚴肅的風險控制警示。',
    note: '2026-08-14 覆核軍爭篇後勤極限：重寫速度與後勤力學模型、詞義訓詁、生理極限與現代供應鏈啟示。',
  },
  'art-of-war_ch-9_p-3': {
    analysis: '【主旨】本段是一套戰場徵候判讀法：將領不能只看敵軍口頭表態，而要把地形、草木、鳥獸、塵土、使者辭氣、部隊姿態與士卒日常狀態交叉比對，推測伏兵、調動、疲勞、缺糧或軍心變化。\n【觀察層次】前半由外圍自然跡象入手：可疑的險地與草木可能藏伏兵，鳥群驚起、走獸奔突可能表示有人活動，塵土形態則因車、步、伐薪、營建而異。後半轉入人的訊號：卑辭而增備、強進而逼近、半進半退、頻賞頻罰，都要和實際部署一起解讀。\n【詞義】「易」指平坦或便於行動之地；「覆」依語境指突襲或覆擊；「窮寇」是陷入絕境、可能拚死反擊的敵軍；「委謝」指軍中財物耗竭。這些詞不可脫離上下文直譯成日常語義。\n【方法與章法】連續的「……者」判斷句把零散跡象編成便於記憶的野外手冊，但末句仍說「必謹察之」：徵候只是需要驗證的證據，不是固定不變的預兆。實際判斷應考慮風向、地表、敵方佯動等替代解釋，避免把清單機械化。',
    note: '2026-08-14 逐句重寫解析：按自然徵候、塵土形態、外交姿態、軍紀後勤四層交叉判讀，並補充詞義與反機械化界限。',
  },
  'art-of-war_ch-10_p-1': {
    translation: '孫子說：地形分為通、掛、支、隘、險、遠六類。我軍可以前往，敵軍也可以來到，叫作「通形」；遇到通形，應先占據地勢較高而向陽的地方，並保持糧道暢通，再與敵交戰才有利。可以前進卻難以返回，叫作「掛形」；遇到掛形，敵軍若沒有防備，便可出擊取勝；敵軍若已有防備，出擊不能取勝又難以撤回，便不利。我方出擊不利，敵方出擊也不利，叫作「支形」；遇到支形，即使敵人用利益引誘我軍，我也不應出擊，應引兵佯退，等敵軍出動到一半再攻擊，才有利。遇到隘形，如果我軍先占領，就必須以充足兵力封住隘口等待敵軍；如果敵軍先占領，防守充實便不要進攻，防守不充實才可攻擊。遇到險形，如果我軍先占領，必須據守地勢較高而向陽之處等待敵軍；如果敵軍先占領，就應引兵離開，不要追隨進攻。遇到遠形，雙方形勢相當又相距遙遠，難以主動挑戰，勉強交戰並不利。以上六類是利用地形的基本原則，也是將帥最重大的職責，不能不仔細考察。',
    analysis: '【主旨】本段建立六種地形的判斷框架，並為每一類配置相應行動。分類依據不是山川名稱，而是敵我能否往返、撤退是否困難、出擊利害、通道寬窄、高低險易與距離遠近。\n【六形決策】通形重在先據高陽並保糧道；掛形須比較敵方有無準備與我方退路；支形宜拒絕誘敵之利，待敵半出再擊；隘形取決於誰先占領以及隘口是否已被兵力充滿；險形重在高地與向陽位置；遠形在勢均時不宜勉強挑戰。\n【詞義】「高陽」指較高而向陽、便於觀察與駐軍之地；「盈」是以兵力充實、封滿隘口；「利我」不是對我有利，而是敵人以利引誘我；「半出」指敵軍尚未完全通過或展開。\n【思想與章法】每類都先下定義，再說處置，呈現「辨形—判勢—行動」的決策鏈。地形不會自動決定勝負；先後時機、兵力部署、糧道與退路才把地勢轉成利害。末句把察地列為將帥「至任」，說明偵察和審勢是不可外包的核心責任。',
    note: '2026-08-14 依《十一家注孫子・地形篇》與 Chinese Text Project 覆核；白話補完「遠形」及總結，解析改為六形決策、關鍵詞義、章法與非地形決定論。',
  },
}

const bundle = loadBundle(bundleFile)
for (const [passageId, update] of Object.entries(updates)) {
  const passage = bundle.passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Passage not found: ${passageId}`)
  passage.readingAid ??= {}
  if (update.translation) passage.readingAid.translation = update.translation
  passage.readingAid.analysis = update.analysis
}
writeBundle(bundleFile, bundle)

const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'))
for (const [passageId, update] of Object.entries(updates)) {
  const review = reviews.reviews.find((item) => item.passageId === passageId)
  if (!review) throw new Error(`Editorial review not found: ${passageId}`)
  review.reviewedAt = '2026-08-14'
  review.notes = update.note
  if (passageId === 'art-of-war_ch-10_p-1') {
    review.sources = [...new Set([
      'https://ctext.org/art-of-war/terrain/zh',
      'https://zh.wikisource.org/zh-hant/%E5%8D%81%E4%B8%80%E5%AE%B6%E6%B3%A8%E5%AD%AB%E5%AD%90/%E5%9C%B0%E5%BD%A2%E7%AF%87',
      'https://www.leeyuri.org/Daxi-8T-YinZhu.pdf',
    ])]
  }
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')

console.log('Completed Sunzi passages:', Object.keys(updates).join(', '))
