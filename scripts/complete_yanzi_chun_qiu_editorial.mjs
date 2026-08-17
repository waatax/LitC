#!/usr/bin/env node

/** Complete the five deployed Yanzi diplomatic anecdotes. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'yanzi-chun-qiu.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')
function loadBundle(file) { const s = fs.readFileSync(file, 'utf8'); return vm.runInNewContext(s.slice(s.indexOf('JSON.parse('), s.lastIndexOf(') as WorkBundle') + 1), Object.create(null), { timeout: 5_000 }) }
function writeBundle(file, bundle) { fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8') }

const updates = {
  'yanzi-chun-qiu_ch-1_p-1': {
    translation: '晏子出使楚國。楚人因為晏子身材矮小，便在大門旁另開一道小門，請他由小門進去。晏子不肯進，說：「出使狗國的人才從狗門進入；如今我出使的是楚國，不應當從這道門進去。」接待賓客的官員只好改換通道，讓他從大門進入。',
    analysis: '【情境】楚方先利用晏子身高設小門，是以身體特徵貶低使者，也藉此壓低齊國的外交地位。晏子若接受，就等於默認羞辱。\n【詞義】「使楚」是奉命出使楚國；「短」指身材矮；「延」是引請；「儐者」是負責迎賓接待的官員；「更道」是改換進入路線。\n【語用策略】晏子沒有直接爭論門的尺寸，而接受「小門有特定對象」的暗示，再把它命名為「狗門」；楚若堅持，就等於自稱狗國。這是以對方行動前提反制對方。\n【現代界限】故事讚賞維護使節尊嚴的機智，但其反擊仍借「狗」作貶稱。現代不應以身高或其他身體差異作羞辱工具，也不必以另一種貶抑複製歧視。',
    group: 1,
  },
  'yanzi-chun-qiu_ch-1_p-2': {
    translation: '晏子見到楚王，楚王說：「齊國沒有人才了嗎？竟派你來做使者。」晏子回答：「齊國都城臨淄有三百閭人口；人們張開衣袖就能遮成一片陰影，揮灑汗水就像下雨，肩並肩、腳跟接腳跟地站在一起，怎麼能說沒有人呢？」',
    analysis: '【主旨】楚王把對晏子外貌的輕視擴大為對齊國選使的嘲諷；晏子先不回答「為何派你」，而先否定「齊無人」這個前提。\n【詞義與修辭】「閭」是里巷戶籍單位；「張袂成陰、揮汗成雨、比肩繼踵」以三組誇飾描寫臨淄人口稠密，後兩語後來成為常用成語。\n【論證節奏】先用可視化的人群景象建立齊國人才眾多，迫使楚王改問：既然人多，為何偏派晏子？這為下一段反轉預留位置，屬兩步式答辯。\n【史料界限】三百閭與衣袖成陰是文學化說辭，功能在外交辯難，不宜直接拿來估算臨淄實際人口。',
    group: 1,
  },
  'yanzi-chun-qiu_ch-1_p-3': {
    translation: '楚王說：「既然如此，為什麼派你來？」晏子回答：「齊國派遣使者，各依對方君主而有不同安排：賢能的使者派往賢明君主，不成材的使者派往不成材的君主。我晏嬰最不成材，所以正適合出使楚國。」',
    analysis: '【主旨】晏子表面自貶，實際依「使者與受使君主相配」的規則，把楚王對他的侮辱完整回送給楚王。\n【詞義】「命使」指派遣使者；「有所主」指各有相應出使對象；「不肖」是不賢、不成材；「嬰」是晏子自稱其名。\n【反諷結構】前兩句先建立一般分類規則，末句才把自己放進最低一類；如果楚王同意他不肖，就也承認自己是不肖之主。自謙語在此不是實話，而是保留禮貌外形的攻擊。\n【外交倫理】機辯成功維護弱勢使者尊嚴，但故事把外交寫成零和口舌競賽。真實外交還需要目標、關係與後果評估，不能只以讓對方難堪判定成功。',
    group: 1,
  },
  'yanzi-chun-qiu_ch-2_p-1': {
    translation: '晏子到楚國後，楚王賜酒。喝到興濃時，兩名官吏綁著一個人來到楚王面前。楚王問：「被綁的人是做什麼的？」官吏回答：「是齊國人，因偷盜而獲罪。」楚王看著晏子說：「齊國人本來就善於偷盜嗎？」',
    analysis: '【情境】酒宴中的押人問答帶有表演性：楚王當著齊使的面，把一名齊人犯盜的個案轉化為對全體齊人的國族羞辱。\n【詞義】「酒酣」是飲酒興濃；「吏二」即兩名官吏；「詣王」是到王前；「曷為者」問此人做什麼或犯何事；「坐盜」是因盜竊定罪；「固」意為本來、向來。\n【推理問題】由一名齊人犯罪推出「齊人善盜」，是以偏概全；若押人場景出自預先安排，還包含操控證據與公共羞辱。\n【篇章作用】本段只設下圈套，不立即評論。楚王的「水土／族性」暗示，將被下一段晏子沿用同一框架反轉。',
    group: 2,
  },
  'yanzi-chun-qiu_ch-2_p-2': {
    translation: '晏子離席起身回答：「我聽說，橘樹生在淮河以南就結橘，生在淮河以北便成了枳；葉子只是相似，果實滋味卻不同。為什麼會這樣？水土環境不同。如今百姓生長在齊國時不偷盜，一到楚國卻偷盜，莫非是楚國的水土使人變得善於偷盜嗎？」楚王笑著說：「聖人不是可以隨便戲弄的；我反而自討羞辱了。」',
    analysis: '【主旨】晏子接受楚王把行為歸因於出生地的框架，卻把關鍵變項從齊人本性改成楚國環境；於是楚王原想羞辱齊國，反而必須承擔楚地使人為盜的結論。\n【詞義】「避席」是離席起身，表示正式作答；「徒」是只、僅；「其實」的「實」指果實；「得無……耶」表示推測反問；「熙」通嬉，意為戲弄；「取病」是自取羞辱、難堪。\n【譬喻與邏輯】橘枳譬喻強調環境會影響表現，能反駁固定族性偏見；但從單一犯人推到楚地使人偷盜，同樣不是嚴格因果證明，而是針對楚王謬誤的以子之矛攻子之盾。\n【知識界限】古人常說橘逾淮為枳；現代植物分類中的枳與橘並非同一植株只因移地便互變。應把它讀作生態與教化的政治譬喻，不作植物學定律。',
    group: 2,
  },
}

const bundle = loadBundle(bundleFile)
for (const [id, update] of Object.entries(updates)) {
  const passage = bundle.passages.find((p) => p.id === id)
  if (!passage) throw new Error(`Missing passage: ${id}`)
  passage.readingAid = { translation: update.translation, analysis: update.analysis }
}
writeBundle(bundleFile, bundle)

const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'))
for (const [id, update] of Object.entries(updates)) {
  const review = reviews.reviews.find((r) => r.passageId === id)
  if (!review) throw new Error(`Missing review: ${id}`)
  Object.assign(review, {
    canonicalText: 'verified', translation: 'verified', analysis: 'verified', reviewedAt: '2026-08-14',
    sources: update.group === 1
      ? ['https://ctext.org/yanzi-chun-qiu/yan-zi-shi-chu-chu-wei/zh', 'https://ctext.org/yanzi-chun-qiu/zh', 'https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E9%83%A8%E5%82%99%E8%A6%81_%E6%99%8F%E5%AD%90%E6%98%A5%E7%A7%8B.pdf']
      : ['https://ctext.org/yanzi-chun-qiu/za-xia/zh', 'https://zh.wikisource.org/zh-hant/%E6%99%8F%E5%AD%90%E6%98%A5%E7%A7%8B_(%E5%9B%9B%E9%83%A8%E5%8F%A2%E5%88%8A%E6%9C%AC)/%E5%8D%B7%E7%AC%AC%E5%85%AD', 'https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E9%83%A8%E5%82%99%E8%A6%81_%E6%99%8F%E5%AD%90%E6%98%A5%E7%A7%8B.pdf'],
    notes: `2026-08-14 完成晏子使楚故事第 ${id.match(/p-(\d+)/)?.[1]} 段逐句覆核；撤除錯置白話，重寫外交語用、反諷、邏輯與現代知識界限。`,
  })
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')
console.log('Completed Yanzi passages:', Object.keys(updates).join(', '))
