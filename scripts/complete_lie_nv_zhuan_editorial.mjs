#!/usr/bin/env node

/** Complete the four deployed Youyu consorts passages in Lie Nü Zhuan. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'lie-nv-zhuan.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  return vm.runInNewContext(source.slice(source.indexOf('JSON.parse('), source.lastIndexOf(') as WorkBundle') + 1), Object.create(null), { timeout: 5_000 })
}
function writeBundle(file, bundle) {
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8')
}

const updates = {
  'lie-nv-zhuan_ch-1_p-1': {
    translation: '有虞氏舜的兩位妃子，是堯帝的兩個女兒；姐姐叫娥皇，妹妹叫女英。舜的父親愚頑，母親言語奸惡；父親名叫瞽叟，弟弟名叫象。象傲慢放蕩，舜卻能和順地與他相處，又以孝道奉事瞽叟。母親憎恨舜而偏愛象，舜仍治理好家內事務，沒有邪曲加害之心。四嶽把舜推薦給堯，堯便把兩個女兒嫁給舜，以觀察他治理家庭的能力。二女在田間侍奉舜，不因自己是天子之女便驕傲自滿、懈怠傲慢，仍然謙遜恭敬、節儉自持，力求盡到當時所說的婦道。',
    analysis: '【敘事功能】篇首先交代娥皇、女英身分，卻以舜的家庭危機作為考驗背景。堯「妻以二女以觀厥內」，把婚姻同時當作選才試驗，二女也成為觀察舜內在德性的媒介。\n【詞義】「頑」指愚昧不化；「嚚」指奸惡而不明理；「敖遊於嫚」形容象傲慢放縱；「諧柔」是以和順方式調和；「內治」指處理家內關係；「畎畝」即田間。\n【人物書寫】文本肯定二女由尊就卑、共同勞作而不驕，但她們的個別性格與言語尚未展開，主要被放在「婦道」框架中。閱讀時既可看見其在逆境中的判斷與協作，也須留意漢代女教文本如何按妻職塑造理想女性。\n【史料界限】舜、堯與二妃屬上古傳說人物，本篇是西漢以後的倫理敘事整理，不能直接當成可逐事驗證的上古實錄。',
  },
  'lie-nv-zhuan_ch-1_p-2': {
    translation: '瞽叟和象密謀殺害舜，先叫他去塗修穀倉。舜回來告訴二女：「父母叫我去塗修穀倉，我要去嗎？」二女說：「去吧！」舜修好穀倉後，他們便撤掉梯子，瞽叟又放火燒倉；舜飛身逃了出來。象再和父母商量，叫舜挖井。舜又告訴二女，二女說：「好，去吧！」舜下去挖井，他們堵住出入口，接著從上面掩埋，舜卻從暗道潛出。\n幾次都沒能殺死舜，瞽叟又邀舜喝酒，打算等他醉後殺害。舜把事情告訴二女，二女給他藥，又讓他以藥水沐浴；舜前去後，整天飲酒也沒有醉。舜的妹妹繫同情他，和兩位嫂嫂相處和諧。父母一心想殺舜，舜仍不怨恨；他們對舜的怒恨卻沒有停止。舜到田野號哭，天天呼喊上天，也呼喚父母。他們即使這樣加害，舜依舊思念不止；也不怨恨弟弟，始終忠厚而不懈怠。',
    analysis: '【情節結構】三次謀害依「焚廩—掩井—醉殺」遞進，二女每次都在舜行動前知情並提供脫險條件；現存正文把具體方法大幅省略，古本引文另有鳥工、龍工等神異服具。\n【難詞與敘事缺口】「捐階」是撤去梯子；「格其出入，從掩」指堵住井的出入口後從上掩埋；「潛出」可理解為由旁穴暗道逃出。「速」是召請。「藥浴汪」字義與斷句不穩，本譯採給藥並藥浴的保守解，不把不確定細節說死。\n【女性能動性】娥皇、女英不是被動陪襯：她們辨識致命風險、設計救援，並與舜妹繫形成合作。但敘事最後把焦點移回舜的孝與不怨，使救援智慧受「助夫成德」框架收束。\n【倫理評議】文本把舜面對持續殺害仍不怨視為篤厚典範；現代閱讀必須區分理解古代孝道敘事與鼓勵受害者留在暴力環境。面對家庭暴力，安全、求援與法律保護應優先，不能用本段要求受害者忍受。',
  },
  'lie-nv-zhuan_ch-1_p-3': {
    translation: '後來舜被任命統理百官，在四門接待各方賓客，又在林木山野與大山腳下接受考驗；堯用各種方式考察他，而舜遇事常和二女商量。舜繼承帝位、升為天子後，娥皇成為王后，女英成為妃。舜把象封在有庳，奉事瞽叟仍和從前一樣。天下人都稱讚二妃聰慧、貞正而仁愛。舜巡行四方，死在蒼梧，號稱重華；二妃死於長江、湘水之間，民間稱她們為湘君。君子評論說：「二妃德性純正，行為篤實。《詩經》說：『最顯著的正是德行，眾諸侯都會取法。』說的就是這件事。」',
    analysis: '【主旨】本段由舜受堯試用寫到即位、南巡與二妃身後傳說，並以《詩》句把二妃定位為可供諸侯取法的德行典型。\n【職官與地名】「百揆」指總理百官政務；「賓於四門」是接待四方來賓；「大麓」是大山腳下；「有庳」為象的封地；「陟方」多解巡行四方；蒼梧在南方傳說地理中與舜死相連。\n【二妃角色】「每事常謀於二女」明言舜在決策中諮詢她們，提供了超出家內服從的政治智慧形象；但後文仍以王后、妃位階和貞仁德目概括，沒有保存其具體建言。\n【神話與接受史】二妃死於江湘、成為湘君，把人物傳記接到地方神祇與湘水傳說。這是文化記憶的形成，不宜與可考死亡紀錄混為一談。原資料「《》雲」是書名標記脫落，已依中哲原篇與維基文庫補為「《詩》雲」。',
  },
  'lie-nv-zhuan_ch-1_p-4': {
    translation: '頌辭說：最早的兩位賢妃，是堯帝的女兒；一同嫁到有虞氏，處在下位輔助舜。她們以尊貴身分侍奉身分較低的夫家，始終能承受勞苦，終使瞽叟和順安寧，最後享有福祐。',
    analysis: '【文體】「頌」以八個短句濃縮前文，是《列女傳》篇末的評價性韻語，不再重述焚廩、掩井細節，而選取身分下降、勤勞與家庭和寧作為核心。\n【詞義】「嬪列有虞」指二女同列嫁入有虞；「承舜於下」指居下位輔佐、順承舜；「以尊事卑」突出天子女下嫁田間之人的身分反差；「福祜」即福祐。\n【因果與偏向】頌辭把瞽叟終能和寧歸功於二妃勞苦，呼應母儀篇的教化理想；但它同時淡化了瞽叟與象的主動暴力，把修復責任放在受害一方及其妻子身上。\n【現代閱讀】可肯定二妃的合作、韌性與實際救援，不必把「以尊事卑」或無限承受勞苦視為今日婚姻中的單向義務。',
  },
}

function repairLostTitle(value) {
  if (typeof value === 'string') return value.replace('《》雲', '《詩》雲')
  if (Array.isArray(value)) return value.map(repairLostTitle)
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = repairLostTitle(value[key])
  }
  return value
}

const bundle = repairLostTitle(loadBundle(bundleFile))
for (const [passageId, update] of Object.entries(updates)) {
  const passage = bundle.passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  passage.readingAid = { translation: update.translation, analysis: update.analysis }
}
writeBundle(bundleFile, bundle)

const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'))
for (const [passageId] of Object.entries(updates)) {
  const review = reviews.reviews.find((item) => item.passageId === passageId)
  if (!review) throw new Error(`Missing review: ${passageId}`)
  Object.assign(review, {
    canonicalText: 'verified', translation: 'verified', analysis: 'verified', reviewedAt: '2026-08-14',
    sources: [
      'https://ctext.org/lie-nv-zhuan/you-yu-er-fei/zh',
      'https://zh.wikisource.org/wiki/%E5%88%97%E5%A5%B3%E5%82%B3/%E5%8D%B71',
      'https://www2.iath.virginia.edu/saxon/servlet/SaxonServlet?chunk.id=d2.1&doc.lang=bilingual&source=xwomen%2Ftexts%2Flienuzhuan.xml&style=xwomen%2Fxsl%2Fdynaxml.xsl&toc.depth=1&toc.id=d2.7',
    ],
    notes: `2026-08-14 完成〈有虞二妃〉第 ${passageId.match(/p-(\d+)/)?.[1]} 段逐句覆核；撤除完全錯置白話，補入字詞、神話層、女性能動性與家庭暴力倫理界限。`,
  })
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')

console.log('Completed Lie Nü Zhuan passages:', Object.keys(updates).join(', '))
