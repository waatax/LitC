import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import type { WorkBundle } from '../src/types/content'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadBundle(file: string): WorkBundle {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  const expression = source.slice(start, end + 1)
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 })
}

function saveBundle(file: string, bundle: WorkBundle) {
  const content = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle, null, 2))}) as WorkBundle\n`
  fs.writeFileSync(file, content, 'utf8')
}

const file = path.resolve(__dirname, '../src/data/work_chunks/mo-zi.ts')
const bundle = loadBundle(file)

const fixes: Record<string, { translation: string; analysis?: string }> = {
  'mo-zi_ch-4_p-2': {
    translation: '如今，大至治理天下，其次治理大國，卻沒有用來衡量的法度，這就連工匠的明辨都不如了。那麼，究竟以什麼作為治理的法則才可以呢？若說人人都效法自己的父母，怎麼樣？天下做父母的人很多，仁愛的卻很少；如果人人都效法自己的父母，便可能效法到不仁的人。不仁德之人，自然不能作為法則。若說人人都效法自己的老師或所學者，怎麼樣？天下從事教學、學術的人很多，仁愛的卻很少；如果人人都效法自己所從學的人，便可能效法到不仁的人。故而不具仁德者，不可立為政教規範。若說人人都效法自己的君主，怎麼樣？天下做君主的人很多，仁愛的卻很少；如果人人都效法自己的君主，便可能效法到不仁的人。違背仁道之主，終究無法作為萬民取法之準則。所以父母、師學、君主這三者，都不能直接作為普遍的治國法則。',
    analysis: '【篇旨與法則之立】本段選自《墨子・法儀》。墨子以否定父母、師長、君主三者作為絕對法則之假設，論證世俗權威之有限性與局限性。\n【訓詁與詞義】「法儀」即度量準則；「不仁者」指缺乏博愛利人之心的人。\n【思想與哲理】墨子跳脫人治框架，主張治理天下必須依據超越世俗權威之客觀客義標準（天志），為古代政治哲學開闢法度至上之先河。'
  },
  'mo-zi_ch-10_p-1': {
    translation: '墨子說：「天下的王公大人，都希望自己的國家富強、人口眾多、刑法政令安定有序；然而卻往往不知道要以崇尚賢能來治理國家百姓，這正是王公大人在根本上失去了尚賢施政的要領。假使王公大人確實失去了尚賢施政的根本，難道不能舉出具體事理來予以說明嗎？如今假如這裡有一位諸侯治理國家，宣布說：『凡是我國擅長射箭駕車的勇士，我將給予重賞尊崇；不能射御之人，我將予以懲罰貶抑。』請問該國的士人，誰會歡喜、誰會恐懼呢？我認為必定是善射善御的人歡喜，不能射御的人恐懼。隨後以獎賞引導眾人說：『凡是我國忠誠守信的士人，我將重賞尊崇；不忠不信之人，我將處罰貶抑。』我認為必定是忠信之士歡喜，不忠不信之輩恐懼。現在若能真正以尚賢施政治理國家百姓，就能使國內行善者受勉勵、作亂者受遏止；進而以此治理天下，更能使天下為善之人競相勸勉、暴虐之人知所收斂。古時我們之所以尊崇堯舜禹湯文武之道，究竟是為什麼呢？正因為他們親臨大眾發行政令治理百姓時，能使天下為善者受到勉勵，為暴者受到阻絕。由此可見，這尚賢的主張，正與堯舜禹湯文武的大道完全相同！」',
    analysis: '【篇旨與獎懲誘因】本段為《墨子・尚賢下》開篇，以賞善罰暴之誘因機制，論證「尚賢」乃政治治理之根本樞紐。\n【訓詁與名物】「尚賢」即尊崇賢能；「射御」為古代君子六藝，此處用作技能與才能之具體表徵。\n【思想與義理】墨子將治理成效建立在客觀激勵機制之上，透過勸善沮暴引導社會風氣，接續上古聖王之德政。'
  },
  'mo-zi_ch-10_p-2': {
    translation: '如今世上的士大夫，平時談論都說要尊崇賢人，等到他們真正面對民眾、發佈政令、治理百姓時，卻不知道要尊崇賢人並任用能人。我因此知道，世上的士大夫只明白小道理，卻不明白大道理。怎麼知道是這樣呢？如果王公大人有一頭牛羊無法自己宰殺，一定會去找好的屠夫；有一塊布料無法自己裁製，一定會去找好的裁縫。當王公大人面對這些事時，即使有親生骨肉、無故富貴的人、長相俊美的人，如果知道他們沒有能力，也絕對不會任用他們。這是為什麼呢？因為怕他們把財物搞壞了。在這些小事上，王公大人就不會忘記尚賢使能。如果王公大人有一匹病馬無法醫治，一定會找好獸醫；有一把弓無法拉開，一定會找好工匠。面對這些事，即使是親屬或富貴俊美之人，只要知道他們不會，也絕不任用。為什麼？怕把財物搞壞了。在這些事上，他們也不會忘記尚賢使能。可是到了治理國家時就不一樣了，對於骨肉親屬、無故富貴、長相俊美的人，就提拔他們。那麼王公大人愛護自己的國家，竟然還不如愛護弓箭、病馬、衣服、牛羊嗎？我因此知道，世上的士大夫都只懂小事而不懂大事。這就好比讓啞巴去當外交使節，讓聾子去當音樂老師一樣荒謬。',
    analysis: '【篇旨與諷喻手法】本段以日常生活中牛羊、衣裳、病馬、弓箭之用人嚴謹，對比治國時之任人唯親，極具諷刺力道。\n【訓詁與名物】「罷馬」即疲病之馬；「行人」為古代掌管朝覲聘問之使節；「瞽瞽」指眼盲或耳聾之樂師。\n【思想與批判】墨子深刻批判貴族宗法社會「任人唯親、以貌取人」之弊病，主張治國大事應如百工之事般嚴格任用專業賢能。'
  },
  'mo-zi_ch-10_p-3': {
    translation: '所以古代聖王治理天下，他們所賜予財富、賦予尊位的人，未必是王公大人的骨肉至親、無故富貴之人或相貌俊美之輩。因此從前舜在歷山耕田，在黃河之濱製陶，在雷澤捕魚，在常陽燒灰，堯在服澤之南發現了他，便立他為天子，讓他接掌天下政務治理萬民。從前伊尹曾是莘氏女子的陪嫁奴僕，擔任廚師，商湯發現並提拔了他，立為三公，讓他接管天下政事治理百姓。從前傅說居住在北海之洲的圜土勞改之地，身穿粗麻布衣腰繫草繩，在傅巖城服勞役築牆，商王武丁發現並起用了他，立為三公，讓他接掌政務治理萬民。因此昔日堯提拔舜、湯提拔伊尹、武丁提拔傅說，難道是因為他們是骨肉至親、無故富貴或相貌俊美嗎？只因為取法他們的言論、採用他們的謀略、施行他們的主張，向上可以利益上天，居中可以利益鬼神，向下可以利益萬民，所以才將他們推舉到崇高尊貴的地位。',
    analysis: '【篇旨與布衣卿相】本段歷數舜、伊尹、傅說由民間草莽登臨三公天子之歷史典範，論證唯賢是舉之合理性。\n【訓詁與史實】「歷山」、「雷澤」為古地名；「傅巖」為傅說版築之處；「圜土」為古代拘禁勞役之所。\n【思想與實踐】墨子打破階級藩籬，確立「以道論才、三利（天、鬼、人）衡功」之平民晉升哲學。'
  }
}

for (const [id, data] of Object.entries(fixes)) {
  const p = bundle.passages.find(x => x.id === id)
  if (p) {
    p.readingAid.translation = data.translation
    if (data.analysis) p.readingAid.analysis = data.analysis
  }
}

saveBundle(file, bundle)
console.log('✅ Patched 4 target Mozi passages successfully!')
