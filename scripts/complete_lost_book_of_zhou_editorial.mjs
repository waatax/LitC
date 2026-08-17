#!/usr/bin/env node

/** Complete the two deployed passages of the Lost Book of Zhou bundle. */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundleFile = path.join(ROOT, 'src', 'data', 'work_chunks', 'lost-book-of-zhou.ts')
const reviewsFile = path.join(ROOT, 'src', 'data', 'editorialReviews.json')

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  fs.writeFileSync(file, `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))}) as WorkBundle\n`, 'utf8')
}

const content = {
  'lost-book-of-zhou_ch-1_p-1': {
    translation: '朱右曾說：《周書》被稱為「逸書」，起因於《說文》把它繫於汲冢出土；《隋書・經籍志》沿襲了這項錯誤，前儒已加辨正。此書其實並非散逸之書；若仍稱「逸」，便無法與《逸尚書》區別，所以應恢復《漢書・藝文志》的舊題。現存正文五十九篇，連序共六十篇，較《漢志》所載少十一篇。晉代五經博士孔晁作注，每篇題為「某某解第幾」，是孔晁所編次；舊本只寫「某某第幾」。蔡邕《明堂月令論》說《周書》七十一篇而〈月令〉為第五十三，正可證明。唐初孔晁注本已亡二十五篇，顏師古據此注《漢志》，所以說當時只存四十五篇；顏師古以後又亡三篇，今日孔注只剩四十二篇。\n然而晉、唐之間其實有兩種本子。孔晁注〈克殷〉「荷素質之旗於王前」另本作「以前於王」，注〈大武〉「三擯厥親」另本「擯」作「損」；李善注《文選》「邱中」又引《周書》「邱」一作「苑」。劉知幾《史通》說《周書》七十一章，上起文、武，下至靈、景，並未說有缺篇，和顏師古所見不同。《唐書・藝文志》又把《汲冢周書》十卷與孔晁注《周書》八卷並列，更是明證。把四十二篇孔注合入七十一篇正文而又亡十一篇，不知發生於哪個時代，大概已在唐以後。\n從周代到現在近三千年，即使在瓦礫中得到一點殘文，人們尚且珍如拱璧；像《山海經》的怪誕、《穆天子傳》的荒唐與偽《竹書紀年》的杜撰，也有人深入整理，何況這部上可輔翼六經、下能涵括諸子，文字宏深古樸的書呢？《漢志》所錄儒家《周政》六篇、《周法》九篇及道家《周訓》十四篇都已不傳，只有此書尚存；儒者卻不珍惜，任其殘缺，甚至排斥，實在過於拘守己見而輕蔑古書。\n我看此書即使未必全出於文王、武王、周公、召公之手，也不像戰國、秦漢人所能偽造。第一，周初箕子陳述洪範、周官分職，都以數字分類，和此書體例相近。第二，〈克殷〉敘事像親見者所記，〈商誓〉、〈度邑〉、〈皇門〉、〈芮良夫〉以及大姒今文的風格，也不是偽古文《尚書》所能仿效。第三，荀息、狼瞫、魏絳都在孔子以前便已引用此書。〈酆保〉談保國，〈武稱〉說用兵之難，〈常訓〉論人性，〈文酌〉、〈文傳〉論政，都不違背孔孟；批評它陰謀或顛倒的人，並未真正理解此書。\n《春秋左傳》說辛有兩個兒子到晉國，於是有董史。辛有是周平王時周史辛甲的後裔，世代掌記錄，他的兒子到晉國時或許帶去了周代典籍。〈太子晉〉末尾說師曠返國不到三年便有人來報王子死訊，也像晉國史官的文字。戰國以後，此書流傳漸廣，墨翟、蘇秦、蔡澤、呂不韋、韓非、蒙恬、蕭何，以至伏生、大戴、小戴、司馬遷，常擷取其中內容；可見當時學者誦習之盛僅次於六藝。因此劉歆、班固把它列入六藝略的書類九家，沒有因它不在孔子刪定之列便貶入諸子雜家。\n姜士昌說，左丘明以博物君子的身分臣事素王孔子而傳之不朽，學孔子者不能捨棄《左傳》，所以歷代訓詁十分完備。《周書》辭義格外深奧，俗學畏難就易，便不再深究。我反覆涵泳思考，認為孔注簡略且多訛缺；盧文弨集合諸家校訂，偶有解釋，仍不完備。後來又得到王念孫、洪頤烜的著作，便校定正文與義訓。我不自量力，彙集諸家說法，刪去違誤並申述己見：一方面考定正文，一方面依《說文》《儀禮》注、《楚辭》注等校正訓詁，另一方面詳考名物，如〈王會〉的「臺」即《司儀》的壇，「矛」是直刺兵器而非鉤曲的戟，〈作雒〉「畫旅」指旅樹，〈器服〉全篇多是明器。所有解說都以先儒為本，並附校訂、音釋，題名《集訓校釋》。\n本書道光丁酉年開始成稿，後經丁嘉葆、陸麟書、葛其仁共同商榷，隨時修訂，前後兩次易稿。今夏公務餘暇，想到已耗費不少心力，又感念朋友匡正，遂交付刻印；如《左傳》一般，也希望將來有服虔、杜預那樣的學者出來評定。道光二十六年丙午夏六月十六日，記於新安郡齋。',
    analysis: '【文體與主旨】這不是《逸周書》先秦正文，而是清代朱右曾《逸周書集訓校釋》的自序。全篇依次處理書名、篇卷流傳、兩本系統、文獻價值、真偽、傳播、校注方法與刊刻經過，是一篇版本學自述。\n【版本論證】朱氏用蔡邕所稱七十一篇、顏師古所見四十五篇、今日孔注四十二篇，以及《唐書・藝文志》並列十卷、八卷兩本，重建亡佚次序。孔注異文、李善引文與劉知幾記載則證明晉唐曾有不同文本系統；「唐以後合本而再亡十一篇」是依線索作出的推論，不是有直接紀年可證的事實。\n【真偽與流傳】三項早出證據分別訴諸分類體例、篇章語言與先秦引文；又以辛氏、董史的家族傳書解釋典籍可能入晉，以戰國秦漢人物的引用說明廣泛傳播。這些是清儒考證鏈，能提高早期成分的可能性，卻不能證明今本每篇同時、同人寫成。\n【校勘方法】作者把工作分成校正文句、釐清訓詁、考定名物三層，並列舉「臺」「矛」「畫旅」「器服」示範。文中黑方框與罕字反映底本殘缺或數位轉錄未定字，閱讀時不可擅自補成確定文字。\n【價值與界限】序文對經學重子輕雜、畏難棄古提出批評，顯示保存殘籍的學術倫理；但把《山海經》《穆天子傳》等概括為謬悠荒唐，屬清代作者的價值判斷，現代研究不必照單全收。',
    sources: [
      'https://ctext.org/lost-book-of-zhou/zhu-you-ceng-xu/zhs',
      'https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1315466.pdf',
    ],
    notes: '2026-08-14 依中國哲學書電子化計劃〈朱右曾序〉與《逸周書》掃描本逐段覆核；撤除誤植自〈度訓〉的白話，完成七層全文翻譯及版本學解析。保留底本未定黑框字，不臆補。',
  },
  'lost-book-of-zhou_ch-2_p-1': {
    translation: '上天生育人民，並為他們建立法度。衡量事物的大小以求端正，權衡輕重以求準確，辨明本末以確立中道；確立中道以補救不足，補救不足使人懂得知足；依爵位表明等級的準則，以此端正人民。端正內外關係以成就天命，端正上下關係以使政事順行。以下缺文數字不能確解；大意是政教由內而外、由近及遠，遠近都完備才算達到終點。細微處的補救也有缺文，但分辨細微要靠明察。因此明王慎重看待細微之事，順應應有的分際；分際次序分明，才知道和諧，知道和諧才懂得歡樂，懂得歡樂也才懂得哀痛，通曉哀樂才能有智慧，綜合內外表現才能識人。\n人民生來各有喜好與厭惡：稍微得到所愛便欣喜，充分得到所愛便快樂；稍微遭遇所惡便憂愁，嚴重遭遇所惡便哀痛。人民好惡的根本，是喜歡能維持生命之物，厭惡導致死亡之物。人民若一味追求所好而不肯退讓，一旦不能如願，必會犯法，不能事奉上級；若一味排斥所惡而不肯退讓，又不能避開它，也必會犯法，不能事奉上級。即使普遍推行教化，尚且會有怠慢輕忽的人民，何況只對他們說可以避開所惡、得到所好，他們怎會安坐不動？若不努力，又憑什麼求得？人人以力量相爭，政事就流於強力；崇尚強力便沒有人退讓，沒有退讓便沒有禮。即使得到所好，人民真的會快樂嗎？若不快樂，所得反成厭惡之物。\n人民若不能節制好惡、不能按分際排出次序，無次序便會互相爭奪，爭奪就導致戰爭；一旦戰爭，又怎能奉養老人幼兒、救助疾病傷痛與死亡喪葬，怎能共同服役？所以明王明定等級來裁斷好惡，教人民依次序分配，表揚並選用有能力者，任用壯年人而奉養老人，使長幼各有回報，人民因此能共同承擔勞役。\n力量競逐若沒有眾人便不能成功，眾人若不和諧便不能成為真正的群體；和諧若沒有中道便不能建立，中道若沒有禮便不能審慎遵守，禮若沒有樂便不能實踐。所以明王認為，沒有哪種歡樂不出於人的感受，也沒有哪種哀痛不出於人的感受，人由共同情感結合成群。人民眾多而賞賜多、刑罰少，是政治良善；刑罰多、賞賜少，是政治敗壞。刑罰多則人民困苦，賞賜少則人民匱乏；困乏之中若又不明善惡等差，教化便不能到達。\n因此人民之主應彰明善惡等差，使子孫長久承續。子孫習於遵行，仁德甚至及於鳥獸；土地所宜配合天時，各類事物都得到治理。末段有古字與殘文，句義未能完全確定；大意說治理初起必須慎始，教化形成就會順遂，沒有真正的順治便會轉為危厲；長幼秩序形成，義由此產生，這叫作「順」的最高準則。',
    analysis: '【主旨】〈度訓〉以「度」統攝政治：先以大小、輕重、本末建立中道，再把中道落實為等級、分配、禮樂、賞罰與長幼照護。它關心的不是抽象度量，而是如何節制好惡，避免競奪轉成戰爭。\n【人性與因果鏈】篇中承認人天生有好惡，且愛生惡死；問題不在欲望本身，而在「不讓」與「不能分次」。論證依「無次序—爭奪—戰爭—老幼病喪失養」推進，將個人欲望直接連到社會照護是否可能。\n【制度觀】明王的對策包括定等、教分、舉能、任壯養老與長幼互報；後段又用「眾—和—中—禮—樂」層層相依，說明人口聚集不等於政治共同體，還須經中道與禮樂組織。賞多罰少被視為善政結果，罰多賞少則造成困乏、使教化失效。\n【詞義與殘文】「度」兼有法度、尺度；「權」是權衡；「中」是使過與不及得到調節的準則；「分次」是依名分與次序分配；「醜」在此較接近類別、等差或善惡可辨，不宜只按今日「醜陋」理解。原文多處以「□」標示缺字，末段又有罕字；白話明示不確定處，不以猜補冒充定論。\n【多角度評議】從思想史看，它把民生、情感、禮樂和政治秩序串成系統；從制度史看，等級分配也可能固化權力，因此「順分」不能直接當成現代平等社會的規範。從文本學看，篇首三訓與清華簡相關材料可供互證，但目前段落仍應以具體底本和校注逐字判讀。',
    sources: [
      'https://ctext.org/lost-book-of-zhou/du-xun/zhs',
      'https://zh.wikisource.org/wiki/%E9%80%B8%E5%91%A8%E6%9B%B8/%E5%8D%B7%E4%B8%80',
      'https://upload.wikimedia.org/wikipedia/commons/f/ff/SSID-10483103_%E4%BA%8C%E5%8D%81%E4%BA%94%E5%88%A5%E5%8F%B2_1_%E9%80%B8%E5%91%A8%E6%9B%B8.pdf',
    ],
    notes: '2026-08-14 依中國哲學書電子化計劃〈度訓解〉、維基文庫卷一與掃描本逐段覆核；白話補至全文末尾，修正數位轉錄混入的註腳號「賞少1」「而2生」，殘缺處維持不確定標記。',
  },
}

const bundle = loadBundle(bundleFile)

// Remove two superscript footnote artefacts that were ingested as canonical text.
for (const passage of bundle.passages) {
  passage.canonicalText = passage.canonicalText.replace('賞少1則乏', '賞少則乏').replace('而2生', '而義生')
}
for (const sentence of bundle.sentences) {
  sentence.canonicalText = sentence.canonicalText.replace('賞少1則乏', '賞少則乏').replace('而2生', '而義生')
  sentence.chunks = sentence.chunks.map(([text, language]) => [text.replace('賞少1則乏', '賞少則乏').replace('而2生', '而義生'), language])
}

for (const [passageId, update] of Object.entries(content)) {
  const passage = bundle.passages.find((item) => item.id === passageId)
  if (!passage) throw new Error(`Missing passage: ${passageId}`)
  passage.readingAid = { translation: update.translation, analysis: update.analysis }
}
writeBundle(bundleFile, bundle)

const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'))
for (const [passageId, update] of Object.entries(content)) {
  const review = reviews.reviews.find((item) => item.passageId === passageId)
  if (!review) throw new Error(`Missing review: ${passageId}`)
  Object.assign(review, {
    canonicalText: 'verified',
    translation: 'verified',
    analysis: 'verified',
    sources: update.sources,
    reviewedAt: '2026-08-14',
    notes: update.notes,
  })
}
reviews.updatedAt = '2026-08-14'
fs.writeFileSync(reviewsFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8')

console.log('Completed deployed Lost Book of Zhou passages:', Object.keys(content).join(', '))
