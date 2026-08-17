#!/usr/bin/env node

/** Perform a six-passage, source-aware review of the deployed Jian Zhu Ke Shu. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'jian-zhu-ke-shu.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  return vm.runInNewContext(source.slice(source.indexOf('JSON.parse('), source.lastIndexOf(') as WorkBundle') + 1), Object.create(null), { timeout: 5_000 })
}
function writeBundle(file, bundle) {
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8')
}

const updates = {
  'jian-zhu-ke-shu_ch-1_p-1': {
    translation: '正逢韓國人鄭國來到秦國從事間諜活動，藉口興修引水灌溉的渠道；不久事情被察覺。秦國宗室大臣都對秦王說：「從諸侯國前來秦國任職的人，大多只是替本國君主在秦國遊說、離間罷了，請把外來賓客一律驅逐。」李斯也在預定驅逐之列，於是上書說：',
    analysis: '【文體位置】本段是史傳敘事者交代奏疏緣起，不是李斯正文。韓國使鄭國以修渠消耗秦力的事件，引發秦國把個案風險擴張成全面逐客政策。\n【詞義與異文】「閒／間秦」指在秦國從事間諜、離間；「注溉渠」是引水灌溉渠道；「遊閒／游間」指遊說離間；「客」是來自別國、在秦任職或活動之人，不是今日一般旅客。不同傳本在「閒／間」「斯乃上書／上曰」等字有異，宜保留底本系統並列校。\n【論證前提】宗室大臣以國安為由，把諸侯籍人士一概推定為代理人。李斯接下來並不否認鄭國事件，而是質疑用籍貫取代個別能力與忠誠判斷。\n【歷史視角】鄭國渠後來反而提升秦國關中農業能力，顯示政策後果可能偏離最初動機；但這是後見之明，不能抹去當時真實的間諜風險。',
  },
  'jian-zhu-ke-shu_ch-1_p-2': {
    translation: '我聽說官吏正在議論驅逐外來賓客，私下認為這項主張錯了。從前秦繆公招求人才，西從戎地得到由余，東從宛地得到百里奚，從宋國迎來蹇叔，又從晉國招來丕豹、公孫支。這五人都不是秦國出生，繆公卻任用他們，因而兼併二十國，終於稱霸西戎。孝公採用商鞅之法，移風易俗，使人民富足、國家富強，百姓樂於效力，諸侯歸服，擊敗楚、魏軍隊，取得千里土地，秦國直到今日仍治理有序而強盛。惠王採用張儀計策，攻取三川，西併巴蜀、北收上郡、南取漢中，包有九夷之地，控制鄢、郢，東據成皋險要，割取肥沃土地，於是拆散六國合縱，使諸侯向西事奉秦國，功效延續至今。昭王任用范睢，罷免穰侯、驅逐華陽君，強化王室、堵住權貴私門，逐步蠶食諸侯，使秦國具備帝業基礎。這四位君主都憑客卿建立功業。這樣看來，客卿哪裡有虧負秦國？假使四君當時拒絕客卿而不接納、疏遠人才而不任用，秦國便不會有富強的實效，也不會有強大的名聲。',
    analysis: '【主旨】李斯以秦國自己的成功史反駁逐客：四代君主的關鍵改革、外交與擴張，都有外來人才參與，因此國籍不是功過的可靠代理指標。\n【四組史例】繆公以五客稱霸西戎；孝公以商鞅變法富國強兵；惠王以張儀拆散合縱、擴張疆土；昭王以范睢削弱外戚私門、推進帝業。人物與成果按年代鋪排，逐步逼近秦王統一天下載想。\n【詞義】「百姓樂用」是樂於被國家任用、效力；「獲楚、魏之師」指戰勝或俘獲其軍；「從」通合縱之「縱」；「功施到今」之「施」讀義為延續；「內」通「納」。\n【史料界限】奏疏是勸說文本，會選擇最有利的因果鏈；四君功業不可能只由客卿造成。它的有效性在於證成「排除客卿會損失重要能力」，不是證明所有客卿都忠誠。',
  },
  'jian-zhu-ke-shu_ch-1_p-3': {
    translation: '如今陛下取得崑山美玉，擁有隨侯珠、和氏璧，懸掛明月寶珠，佩帶太阿寶劍，乘坐纖離良馬，豎起翠鳳旗，架設靈鼉皮鼓。這些寶物沒有一件產於秦國，陛下卻喜愛它們，為什麼？如果一定要秦國出產才能使用，那麼夜光璧便不能裝飾朝廷，犀角象牙器不能供人賞玩，鄭、衛美女不能充實後宮，駿馬駃騠不能充滿外廄，江南金錫不能使用，西蜀丹青也不能採取。若裝飾後宮、充列姬妾、愉悅心意耳目的事物都必須產於秦國，那麼宛珠簪、鑲璣珠的耳飾、東阿白絹衣與錦繡裝飾都不能進呈，能隨時俗修飾自己、姿容美好的趙國女子也不能侍立身旁。\n敲甕擊缶、彈箏拍腿，嗚嗚歌唱而使耳朵暢快，才是秦國本土音樂；鄭、衛、桑間以及昭、虞、武、象等則是異國音樂。如今陛下捨棄擊甕叩缶而採用鄭衛之音，排退秦箏而選取昭虞之樂，為什麼？不過因為它們當下令人愉快、適合觀賞罷了。然而選用人才卻不是這樣：不問能否勝任，不論是非曲直，只要不是秦人便去除，只要是客卿便驅逐。這等於重視美色、音樂、珠玉，卻輕視人才；絕不是統一海內、控制諸侯的辦法。',
    analysis: '【主旨】本段以秦王日常消費的跨地域開放，反襯人才政策的籍貫排斥：物品只問是否合用、悅目，人才反而不問能力曲直，形成無法自洽的雙重標準。\n【三層鋪陳】先列玉珠劍馬旗鼓等珍寶，再擴張到後宮服飾與各地音樂，最後突然轉入「今取人則不然」。長串名物不是炫博，而是讓秦王先承認自己早已按效用選物。\n【詞義名物】「說」通悅；「下陳」指後宮侍列；「駃騠」是良馬名；「搏髀」是拍擊大腿應節。中哲本作「桑閒、昭、虞、武、象」，通行標點與字形另有「桑間、《韶虞》、《武象》」，屬需保留底本差異之處。\n【倫理與策略】李斯稱「所輕者在乎人民」，把人才提升到超越珠玉聲色的位置；但論證仍服務於「跨海內、制諸侯」的帝國目標。現代可取其反籍貫歧視的推理，不必連同征服目的一起接受。',
  },
  'jian-zhu-ke-shu_ch-1_p-4': {
    translation: '我聽說，土地廣就糧食多，國家大就人口多，軍隊強就士卒勇。因此泰山不拒絕任何一撮泥土，才能成就它的高大；江河大海不排斥細小水流，才能成就它的深廣；成就王業的人不拒絕百姓，才能彰明德業。所以疆土不分東西南北，人民不因來自不同國家而被區別，四季充實美好，鬼神降下福祐，這正是五帝三王無敵的原因。如今卻拋棄人民去資助敵國，拒絕賓客去成就諸侯，使天下人才退縮而不敢向西，停步不入秦國；這就是所謂把兵器借給寇敵、把糧食送給盜賊。',
    analysis: '【主旨】本段由人口、土地與國力的關係，推出王者必須包容眾人的原則；逐客不只是少用人才，更會把本可為秦所用的能力轉送競爭者。\n【譬喻與章法】泰山由不拒細土而大，河海由不拒細流而深，王者由不拒眾庶而明德，三個同構句把自然累積轉成政治包容。接著由理想王者急轉到當前逐客，形成正反對照。\n【詞義】「讓」是辭讓、拒絕；「卻」是排拒；「業諸侯」是使諸侯成就功業；「裹足」是停步不前；「藉寇兵而齎盜糧」意為主動把武器與糧食送給敵人。\n【界限】「民無異國」在本篇是吸納人口與人才的國力論，未必等於現代普遍平等；但它確實反駁僅依出身排除人的政策。',
  },
  'jian-zhu-ke-shu_ch-1_p-5': {
    translation: '不是秦國出產的物品，值得珍愛的很多；不是秦國出生的人才，願意效忠秦國的也很多。如今驅逐客卿，等於資助敵國；減損本國人民，等於增益仇敵。如此對內使自己空虛，對外又在諸侯間結下怨恨，還想使國家沒有危險，是辦不到的。',
    analysis: '【主旨】結尾把全篇「外物可寶／外士可用」的類比壓縮成國安判斷：人才離秦不會從天下消失，而可能流向敵國，形成一失一得的相對損益。\n【因果鏈】逐客先「資敵國」，再「損民益讎」，結果是內部能力空虛、外部怨敵增加，最後推出國家必危。這不是單純的道德勸善，而是直接對準秦王安全與統一目標的風險模型。\n【詞義與修辭】「寶」作動詞，意為珍視；「讎」即仇敵；「樹怨」是結下怨恨。「求國無危，不可得也」以不可逆的斷語收束，比開頭自謙的「竊以為過」更強硬。\n【政策含義】本段反對的是一刀切的身分排除，並不排除對個別間諜作證據導向的審查；這也正是鄭國事件與李斯論證可以同時成立之處。',
  },
  'jian-zhu-ke-shu_ch-1_p-6': {
    translation: '秦王於是撤銷逐客令，恢復李斯的官職，最終採用他的計策。李斯做到廷尉。二十多年後，秦國終於兼併天下，尊奉君主為皇帝，任命李斯為丞相；拆平各郡縣舊城，熔毀兵器，表示不再使用；又使秦朝沒有一尺土地分封出去，不立宗室子弟為王，也不封功臣為諸侯，意在使後世不再有諸侯交戰攻伐的禍患。',
    analysis: '【文體位置】這是史傳敘事者在奏疏之後交代結果，不屬李斯上書正文。它把撤令復官、李斯升遷、秦統一與廢封建連成一條事功敘事。\n【制度名物】「廷尉」是最高司法官之一；「夷郡縣城」指削平六國舊城防；「銷其兵刃」是收熔兵器；「尺土之封」指封土建國。末句陳述政策意圖，即以郡縣制避免諸侯再戰。\n【史料來源】本段可與《史記・李斯列傳》及相關類書互證，維基文庫獨立〈諫逐客書〉頁則止於奏疏正文，沒有這段。資料展示應清楚區分「作品本身」和後人收錄時附加的傳記框架。\n【歷史評議】敘事把二十餘年後的統一視為採計的延伸效果，具有強烈目的論。秦撤逐客令確有直接關聯，但統一與郡縣化涉及長期軍政條件；而「使後無戰攻之患」是制度設計的願望，不是後世歷史結果的客觀保證。',
  },
}

const bundle = loadBundle(bundleFile)
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
  review.canonicalText = 'verified'
  review.translation = 'verified'
  review.analysis = 'verified'
  review.sources = passageId.endsWith('_p-6')
    ? ['https://ctext.org/jian-zhu-ke-shu/zh', 'https://ctext.org/wiki.pl?chapter=425250&if=gb&remap=gb', 'https://zh.wikisource.org/zh-hant/%E5%86%8A%E5%BA%9C%E5%85%83%E9%BE%9C_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B70212']
    : ['https://ctext.org/jian-zhu-ke-shu/zh', 'https://zh.wikisource.org/wiki/%E8%AB%AB%E9%80%90%E5%AE%A2%E6%9B%B8']
  review.reviewedAt = '2026-08-14'
  review.notes = `2026-08-14 完成《諫逐客書》第 ${passageId.match(/p-(\d+)/)?.[1]} 段逐句覆核；校分史傳框架與奏疏正文，白話、訓詁、章法、史料界限及政策論證均已重寫。`
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')

console.log('Completed Jian Zhu Ke Shu passages:', Object.keys(updates).join(', '))
