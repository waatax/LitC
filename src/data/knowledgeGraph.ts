// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 諸子百家知識點網絡、情境處方與研習學程
// ─────────────────────────────────────────────────
import type { SchoolId } from '@/types/content'
import type { IconName } from '@/components/ClassicalIcon.vue'

export type KnowledgeCategory =
  | 'philosophy'  // 哲思玄旨
  | 'governance'  // 治道政略
  | 'strategy'    // 兵法謀略
  | 'conduct'     // 修己處世
  | 'allusions'   // 成語典故
  | 'literature'  // 辭章風骨

export interface KnowledgeCategoryMeta {
  id: KnowledgeCategory
  name: string
  sealText: string
  icon: IconName
  tagline: string
  description: string
  color: string
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategoryMeta[] = [
  {
    id: 'philosophy',
    name: '哲思玄旨',
    sealText: '玄',
    icon: 'wenhai',
    tagline: '探賾索隱，體悟宇宙本體與心智超脫',
    description: '涵蓋道家自然無為、儒家天命心性、墨家兼愛節用、荀子制天命等先秦核心哲學本體論與認識論。',
    color: '#5b8a72',
  },
  {
    id: 'conduct',
    name: '修己處世',
    sealText: '德',
    icon: 'heart',
    tagline: '安頓身心，淬鍊君子人格與從容氣度',
    description: '聚焦個人身心修持、應對世事紛擾、自省慎獨、守柔處弱、君子不器與逆境從容之道。',
    color: '#b58d3d',
  },
  {
    id: 'strategy',
    name: '兵法謀略',
    sealText: '策',
    icon: 'sword',
    tagline: '洞察形勢，以智取勝與全勝思維',
    description: '收錄《孫子兵法》、《司馬法》等兵家精粹，探討全局視野、避實擊虛、風林火山與博弈心智。',
    color: '#a64b4b',
  },
  {
    id: 'governance',
    name: '治道政略',
    sealText: '政',
    icon: 'crown',
    tagline: '經世濟民，制度權衡與大局治理',
    description: '包含法家明法審令、儒家王道仁政、黃老循名責實、墨家非攻尚賢與戰國變法思維。',
    color: '#8b5e5e',
  },
  {
    id: 'allusions',
    name: '成語典故',
    sealText: '典',
    icon: 'sparkle',
    tagline: '寓言喻理，先秦語言智慧與文化母題',
    description: '匯聚庖丁解牛、莊周夢蝶、自相矛盾、守株待兔等傳世寓言，解析其背後蘊含的思辨邏輯。',
    color: '#4a6fa5',
  },
  {
    id: 'literature',
    name: '辭章風骨',
    sealText: '文',
    icon: 'feather',
    tagline: '文以載道，千古散文氣度與精神寄託',
    description: '包含桃花源記、曹劌論戰、楚辭風骨等古文名篇的章法氣象、修辭美學與士人精神境界。',
    color: '#8a6e5b',
  },
]

export interface KnowledgePoint {
  id: string
  title: string
  tagline: string
  pinyin: string
  category: KnowledgeCategory
  schoolId: SchoolId
  primaryFigure: string
  historicalPeriod: string
  summary: string
  deepAnalysis: string
  modernApplication: string
  famousQuote: string
  quoteSource: {
    workId: string
    workTitle: string
    chapterId: string
    chapterTitle: string
  }
  keyInsights: string[]
  reflectionQuestion: string
  relatedPointIds: string[]
  crossSchoolComparison?: {
    targetSchool: string
    contrastIdea: string
  }
  difficulty: 1 | 2 | 3
}

export interface LearningTrack {
  id: string
  title: string
  subtitle: string
  sealText: string
  icon: IconName
  badgeColor: string
  summary: string
  estimatedMinutes: number
  targetAudience: string
  pointIds: string[]
  coreBenefit: string
}

export interface DilemmaTopic {
  id: string
  title: string
  subtitle: string
  sealText: string
  icon: IconName
  situation: string
  remedyIntro: string
  corePointIds: string[]
  prescriptions: {
    pointId: string
    actionPrompt: string
  }[]
}

export const KNOWLEDGE_POINTS: KnowledgePoint[] = [
  // ── 1. 上善若水 ────────────────────────────────
  {
    id: 'shang-shan-ruo-shui',
    title: '上善若水',
    tagline: '最崇高的善行如同水：利萬物而不與人爭鋒',
    pinyin: 'shàng shàn ruò shuǐ',
    category: 'conduct',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '水滋養萬物而不求回報，安處眾人所厭惡的低下之處，因此最契合「道」的本質。處事時如水般順應環境，不盲目對抗，卻能憑藉持久的柔韌化解至堅之物。',
    deepAnalysis: '老子以自然界的水作為哲學象徵，闡述道家「不爭而莫能與之爭」的核心辯證法。水具備七種美德：居善地（甘處卑下）、心善淵（沉靜深邃）、與善仁（真誠博施）、言善信（守信不欺）、政善治（自然有序）、事善能（因勢利導）、動善時（順應時機）。',
    modernApplication: '【職場與處世】在競爭激烈的職場中，避免硬碰硬引發內耗；學習以謙遜利他的態度成就團隊，化阻力為助力。當遭遇困頓時，如同水遇到磐石一般，繞道緩進，以柔克剛。',
    famousQuote: '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-8',
      chapterTitle: '第八章：上善若水',
    },
    keyInsights: [
      '居下謙退：不爭功名，反而能長久保全自身的價值。',
      '利萬物而不爭：聚焦於創造價值，而非在存量競爭中耗費心力。',
      '順勢而動：不被既定形狀所拘限，適應任何外在環境的變化。',
    ],
    reflectionQuestion: '在日常人際衝突中，你是否常因執著於「爭口氣」而耗損心神？若以水處下的智慧化解，局面會如何轉變？',
    relatedPointIds: ['wu-wei-er-zhi', 'dao-fa-zi-ran', 'da-qiao-ruo-zhuo', 'rou-ruo-sheng-gang-qiang'],
    crossSchoolComparison: {
      targetSchool: '儒家',
      contrastIdea: '儒家強調「當仁不讓」、「見義勇為」的積極擔當；道家則更重「守柔不爭」、「因勢利導」的內在超脫。',
    },
    difficulty: 1,
  },

  // ── 2. 道法自然 ────────────────────────────────
  {
    id: 'dao-fa-zi-ran',
    title: '道法自然',
    tagline: '宇宙最高的法則，在於順應事物本然的自發規律',
    pinyin: 'dào fǎ zì rán',
    category: 'philosophy',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '「人法地，地法天，天法道，道法自然。」並非指道仿效大自然界，而是指「道」以其自身的自發性、本然狀態為終極規律，不受任何外在意志或人為偏見所主宰。',
    deepAnalysis: '「自然」在先秦古漢語中意為「自己如此」（自成其所是）。老子破除人格神天命論，確立純粹客觀自足的宇宙本體觀。道不對萬物施加強迫指令，萬物各循其性命之理生長榮枯。人若違背客觀規律強行干預，必受規律反噬。',
    modernApplication: '【個人成長與經營】尊重人性的心理節奏與事物的客觀週期。在專案管理或自我提升時，不拔苗助長、不急躁焦慮，給予規律充分發酵的時間，順水推舟方能事半功倍。',
    famousQuote: '人法地，地法天，天法道，道法自然。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-25',
      chapterTitle: '第二十五章：道法自然',
    },
    keyInsights: [
      '尊重本然：萬物皆有獨特稟賦，不可強行用單一標準扭曲改造。',
      '不妄加干預：認清客觀規律邊界，在不可控的環境中保持冷靜。',
      '反璞歸真：摒棄過多人為造作與繁文縟節，回歸樸素本真。',
    ],
    reflectionQuestion: '在你當前感到焦慮或受阻的事情上，是否夾雜了過多想要強行操控結果的執念？哪些部分應回歸規律本然？',
    relatedPointIds: ['shang-shan-ruo-shui', 'wu-wei-er-zhi', 'tian-xing-you-chang'],
    crossSchoolComparison: {
      targetSchool: '法家',
      contrastIdea: '法家崇尚以嚴刑峻法強力改造社會行為；道家則主張順應民情自然，反對嚴苛的人為干預與繁瑣禁令。',
    },
    difficulty: 2,
  },

  // ── 3. 無為而治 ────────────────────────────────
  {
    id: 'wu-wei-er-zhi',
    title: '無為而無不為',
    tagline: '不妄為、不瞎折騰，激發系統內在的自我組織生命力',
    pinyin: 'wú wéi ér wú bù wéi',
    category: 'governance',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '「無為」絕非消極躺平或放任不管，而是「不妄為」——不憑主觀私欲隨意折騰干涉，使萬物在良好的底層規則下充分自我發揮，最終達到「無不為」的宏大治理效果。',
    deepAnalysis: '道家治國思想的核心在於「給百姓以空間」與「給系統以彈性」。老子深刻洞察到「法令滋彰，盜賊多有」、「治大國若烹小鮮」。過度的政令朝令夕改只會損耗社會信任與活力；最高明的領導者退居幕後搭建生態，使眾人皆曰「我自然」。',
    modernApplication: '【團隊領導與授權】優秀領導者不做微觀管理（Micromanagement），而是明晰底線原則與願景，賦予團隊充分的自主決策空間，讓成員的自驅力與創造力全面釋放。',
    famousQuote: '道常無為而無不為。侯王若能守之，萬物將自化。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-37',
      chapterTitle: '第三十七章：道常無為',
    },
    keyInsights: [
      '治大國若烹小鮮：不盲目翻動折騰，保持政策與節奏的長期穩定。',
      '賦能而非控制：搭建良好協同規則，依靠機制自我運轉而非人治干預。',
      '功成事遂身退：不居功自傲，成就集體也就是成就自我。',
    ],
    reflectionQuestion: '在管理或指導他人時，你是否總忍不住插手每一個細節？如何劃分「原則底線」與「自主授權」的邊界？',
    relatedPointIds: ['dao-fa-zi-ran', 'shang-shan-ruo-shui', 'fa-shu-shi'],
    difficulty: 2,
  },

  // ── 4. 庖丁解牛 ────────────────────────────────
  {
    id: 'pao-ding-jie-niu',
    title: '庖丁解牛 ‧ 依乎天理',
    tagline: '洞明事物結構紋理，在錯綜複雜的空隙中游刃有餘',
    pinyin: 'páo dīng jiě niú',
    category: 'allusions',
    schoolId: 'daoism',
    primaryFigure: '莊子',
    historicalPeriod: '戰國中期',
    summary: '庖丁為文惠君解牛，十九年刀刃若新發於硎。因其依循牛體的天然骨肉縫隙下刀，以無厚入有間，從不在骨肉糾結處硬砍硬碰。比喻掌握規律者在複雜世事中游刃有餘、保全自身。',
    deepAnalysis: '《莊子・養生主》以庖丁寓言闡發修身養生與處世之道。常人之刀月換或歲換，因其在筋骨交錯處「割」與「折」，耗損心神刀刃；庖丁則「官知止而神欲行」，以直覺洞察本質結構，專注於「有間」（空隙）。在高度複雜與壓力巨大的環境中，關鍵不在於蠻幹，而在於洞察結構盲點。',
    modernApplication: '【複雜問題拆解與工作心流】面對龐雜棘手的工作任務，不要用蠻力硬槓。先靜心觀察其內部架構與核心樞紐，抓住關鍵縫隙精準切入，才能在長期高壓下不損耗自身心智與精力。',
    famousQuote: '彼節者有間，而刀刃者無厚；以無厚入有間，恢恢乎其於遊刃必有餘地矣。',
    quoteSource: {
      workId: 'zhuangzi',
      workTitle: '莊子',
      chapterId: 'zhuangzi_ch-3',
      chapterTitle: '養生主第三',
    },
    keyInsights: [
      '目無全牛：由表象深入底層架構，不被問題的龐大表面所威懾。',
      '游刃有餘：尋找核心縫隙與槓桿點，以最小阻力化解最大阻礙。',
      '善刀而藏：大功告成後懂得收斂心神、居安思危，不放任自滿。',
    ],
    reflectionQuestion: '面對眼前讓你焦頭爛額的難題，你是否正在拿自己的「心智之刀」硬砍硬碰？這頭「牛」的內在關節縫隙究竟在哪裡？',
    relatedPointIds: ['qi-wu-xiao-yao', 'dao-fa-zi-ran', 'da-qiao-ruo-zhuo'],
    difficulty: 1,
  },

  // ── 5. 齊物逍遙 ────────────────────────────────
  {
    id: 'qi-wu-xiao-yao',
    title: '齊物之辨 ‧ 精神逍遙',
    tagline: '超越世俗相對是非成見，安頓靈魂於天地大化之中',
    pinyin: 'qí wù zhī biàn, xiāo yáo',
    category: 'philosophy',
    schoolId: 'daoism',
    primaryFigure: '莊子',
    historicalPeriod: '戰國中期',
    summary: '世人往往陷於「彼此是非」、「貴賤得失」的狹隘爭論，互執一詞而痛苦不堪。莊子主張「以道觀之，物無貴賤」，跳出個人偏見的坐井觀天，方能達到「乘天地之正，而御六氣之辯」的精神逍遙境地。',
    deepAnalysis: '《齊物論》是莊子認識論的最高峰。莊子指出世間語言名相皆具相對性（「方生方死，方死方生」），常人被自我主觀執念所困（「成心」），以致互相攻訐無休。唯有打破自我中心、齊同萬物，在心靈層面與宇宙造化共游，才能卸下心理包袱，獲致至高自由。',
    modernApplication: '【擺脫精神內耗與社交焦慮】當你為別人的評價、職場的升遷得失或一時的挫敗耿耿於懷時，拉大時空維度審視。放下非黑即白的心態，學會與不確定性和解，重獲精神自足。',
    famousQuote: '若夫乘天地之正，而御六氣之辯，以遊無窮者，彼且惡乎待哉？故曰：至人無己，神人無功，聖人無名。',
    quoteSource: {
      workId: 'zhuangzi',
      workTitle: '莊子',
      chapterId: 'zhuangzi_ch-1',
      chapterTitle: '逍遙遊第一',
    },
    keyInsights: [
      '至人無己：放下自我膨脹與受害者心態，痛苦往往源於對「我」的過度執念。',
      '以道觀之：拉長時間軸與空間尺度，當下的紛擾大多微不足道。',
      '無待而游：內在安全感不依賴於外界讚譽或物質條件，實現精神自立。',
    ],
    reflectionQuestion: '近期讓你最心煩的一句評價或得失，如果站在五年後甚至百年後的大視角來看，它真有那麼重要嗎？',
    relatedPointIds: ['pao-ding-jie-niu', 'dao-fa-zi-ran', 'zhuang-zhou-meng-die'],
    difficulty: 3,
  },

  // ── 6. 克己復禮 ────────────────────────────────
  {
    id: 'ke-ji-fu-li',
    title: '克己復禮為仁',
    tagline: '自我約束私欲偏執，使心靈舉止重歸自覺之禮與真誠之仁',
    pinyin: 'kè jǐ fù lǐ wéi rén',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '孔子',
    historicalPeriod: '春秋末期',
    summary: '顏淵問仁，子曰：「克己復禮為仁。一日克己復禮，天下歸仁焉。為仁由己，而由人乎哉？」克己是指約束個人的衝動、偏私與傲慢；復禮是指讓言行回歸社會公共道德與敬畏秩序。',
    deepAnalysis: '孔子確立了儒家道德主體性。「仁」是內在充沛的道德生命力與共情能力，「禮」是仁愛精神在外在人際關係中的合理體現（節文度數）。克己不是壓抑人性，而是自覺戰勝任性與私欲，確立「非禮勿視，非禮勿聽，非禮勿言，非禮勿動」的內心堤防。',
    modernApplication: '【情緒自律與職業素養】在社群網路容易情緒失控、口出惡言的時代，克制當下的衝動偏見，用專業、同理與禮貌對待身邊人。為仁完全在於自身抉擇，不推諉於外界環境。',
    famousQuote: '克己復禮為仁。一日克己復禮，天下歸仁焉。為仁由己，而由人乎哉？',
    quoteSource: {
      workId: 'lun-yu',
      workTitle: '論語',
      chapterId: 'lun-yu_ch-12',
      chapterTitle: '顏淵第十二',
    },
    keyInsights: [
      '主體自覺：成為一個正直的人完全取決於自己，不需要任何外在藉口。',
      '敬畏禮度：公共生活需要規則與邊界，尊重規則實質是尊重彼此的尊嚴。',
      '慎防私欲：時常覺察並清除傲慢、貪婪與成見，方能涵養清澈仁心。',
    ],
    reflectionQuestion: '當被冒犯或面對私利誘惑時，你是否能按捺住情緒衝動，做出真正符合長遠原則與尊嚴的選擇？',
    relatedPointIds: ['si-duan-zhi-xin', 'shen-du-zi-sheng', 'ren-zhe-ai-ren'],
    crossSchoolComparison: {
      targetSchool: '道家',
      contrastIdea: '老莊批評「禮者，忠信之薄，而亂之首」，認為刻意追求禮法反而破壞了純樸天真；儒家則視禮為防範墮落不可或缺的文明柱石。',
    },
    difficulty: 1,
  },

  // ── 7. 四端之心 ────────────────────────────────
  {
    id: 'si-duan-zhi-xin',
    title: '四端之心 ‧ 人性本善',
    tagline: '人皆有惻隱、羞惡、辭讓、是非四種善的萌芽，擴充之足以保四海',
    pinyin: 'sì duān zhī xīn',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '孟子',
    historicalPeriod: '戰國中期',
    summary: '孟子以「孺子將入於井」之例，證明人皆有不忍人之心。惻隱之心為仁之端，羞惡之心為義之端，辭讓之心為禮之端，是非之心為智之端。人性中蘊含著善的萌芽，只要精心擴充存養，皆可成為聖賢。',
    deepAnalysis: '孟子性善論奠定了儒家對人性尊嚴的崇高信念。四端如同人身之四體，是天生具備的道德潛能。「苟能充之，足以保四海；苟不充之，不足以事父母。」後天的惡乃因環境戕害與自我放棄（自暴自棄）所致，故君子之學在於「求其放心」（找回迷失的本心）。',
    modernApplication: '【同理心培養與利他精神】在冷漠快節奏的生活中，守護內心深處對弱者的憐憫、對不正義的不齒以及明辨是非的清醒。相信自己與他人潛在的善意，擴大內心的同理光芒。',
    famousQuote: '惻隱之心，仁之端也；羞惡之心，義之端也；辭讓之心，禮之端也；是非之心，智之端也。人之有是四端也，猶其有四體也。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-3',
      chapterTitle: '公孫醜上第三',
    },
    keyInsights: [
      '善端天賦：人皆具備同理心與是非感，善行是生命自帶的本能願望。',
      '持之以恆擴充：如同培育幼苗，必須在生活中不斷實踐善意，防止其萎縮。',
      '反求諸己：行有不得皆反求諸己，找回迷失焦躁的心，重歸寧靜。',
    ],
    reflectionQuestion: '在看到身邊有人遭遇窘境時，你最初掠過心頭的一絲同情是否曾被冷漠的理由壓制？如何讓這份善意轉化為具體行動？',
    relatedPointIds: ['ke-ji-fu-li', 'hua-xing-qi-wei', 'min-gui-jun-qing', 'hao-ran-zhi-qi'],
    difficulty: 2,
  },

  // ── 8. 化性起偽 ────────────────────────────────
  {
    id: 'hua-xing-qi-wei',
    title: '化性起偽 ‧ 隆禮重法',
    tagline: '人之天性本多私欲，唯有後天良師益友與禮義教化方能成德',
    pinyin: 'huà xìng qǐ wěi',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '荀子',
    historicalPeriod: '戰國晚期',
    summary: '荀子力主「人之性惡，其善者偽也」。「偽」在此指「人為（後天人為努力教化）」。人的原始生物本能充滿對利益、名譽與聲色的貪圖，若任其自然必生爭奪混亂；唯有透過後天制度規範、學習修養與師法教化，方能轉化本性，成就文明。',
    deepAnalysis: '荀子深刻補足了儒家的制度現實感。他不將希望寄託於縹緲的本能自覺，而是重視外在環境與結構的力量。「居必擇鄉，遊必就士」、「不積跬步，無以至千里」。荀子的思想成為法家韓非、李斯的先驅，但其終極歸宿依然是「隆禮」成聖。',
    modernApplication: '【制度設計與刻意練習】不能單純依賴個人的道德自覺來維繫團隊，必須依賴清晰的激勵制度與約束流程；在個人技能學習上，克服人性好逸惡勞的惰性，靠自律與日積月累的刻意練習雕琢自我。',
    famousQuote: '人之性惡，其善者偽也。今人之性，生而有好利焉，順是，故爭奪生而辭讓亡焉。',
    quoteSource: {
      workId: 'xunzi',
      workTitle: '荀子',
      chapterId: 'xunzi_ch-23',
      chapterTitle: '性惡篇第二十三',
    },
    keyInsights: [
      '承認人性的弱點：不對純粹自覺抱有不切實際的幻想，用制度築起防線。',
      '環境塑造力量：慎選朋友圈與學習環境，蓬生麻中，不扶而直。',
      '日拱一卒的積累：道德與才幹皆非天生圓滿，全賴後天苦功磨礪（偽）。',
    ],
    reflectionQuestion: '在習慣養成上，你是否常寄希望於「三分鐘熱度」的意志力？是否為自己設計了能夠持久推進的後天環境與防錯機制？',
    relatedPointIds: ['si-duan-zhi-xin', 'fa-shu-shi', 'ke-ji-fu-li', 'tian-xing-you-chang'],
    difficulty: 2,
  },

  // ── 9. 上兵伐謀 ────────────────────────────────
  {
    id: 'shang-bing-fa-mou',
    title: '上兵伐謀 ‧ 不戰而屈人之兵',
    tagline: '最高超的戰略在於挫敗敵方謀劃，以全勝智謀達成目標而非兩敗俱傷',
    pinyin: 'shàng bīng fá móu',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '百戰百勝固然英勇，但絕非善之善者；不用武力肉搏就能使對手屈服，才是戰略最高境界。故「上兵伐謀，其次伐交，其次伐兵，其下攻城」。攻城是迫不得已的下下策。',
    deepAnalysis: '《孫子兵法》是以慎戰、止戰為核心的高維戰略學。戰爭消耗國力民財，即使勝也是慘勝。孫子主張「全勝」理念：保全自身與保全資源。透過洞察對手戰略意圖（伐謀）、瓦解其聯盟關係（伐交），在衝突全面爆發前即解決問題。',
    modernApplication: '【商戰談判與危機化解】在商業競爭或人際博弈中，硬碰硬打價格戰或訴訟是代價最高的消耗。高明的操盤者懂得洞察對方核心訴求，整合生態聯盟，在談判桌前以共贏或威懾化解紛爭。',
    famousQuote: '百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。故上兵伐謀，其次伐交，其次伐兵，其下攻城。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-3',
      chapterTitle: '謀攻篇第三',
    },
    keyInsights: [
      '拒絕低維度內耗：避免將精力浪費在代價巨大的無謂血拼（攻城）。',
      '從根源拆解對手意圖：提前預判局勢走向，在趨勢醞釀期瓦解危機。',
      '追求全勝與多贏：最高明的勝利是保全雙方資源與生態的長久穩定。',
    ],
    reflectionQuestion: '在當前的重大競爭或衝突中，你是否正準備「硬碰硬攻城」？有沒有更高維度的戰略（伐謀、伐交）能夠和平達成目標？',
    relatedPointIds: ['zhi-ji-zhi-bi', 'shang-shan-ruo-shui', 'bi-shi-ji-xu'],
    difficulty: 1,
  },

  // ── 10. 知己知彼 ────────────────────────────────
  {
    id: 'zhi-ji-zhi-bi',
    title: '知彼知己 ‧ 百戰不殆',
    tagline: '清醒評估自身底牌與客觀實況，徹底破除資訊盲點與狂妄自滿',
    pinyin: 'zhī jǐ zhī bǐ, bǎi zhàn bù dài',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '「知彼知己者，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。」決策的成敗取決於對敵我雙方優劣勢、資源與動向的真實、客觀、清醒評估。',
    deepAnalysis: '孫子強調唯物冷靜的資訊決策論。戰略中最危險的是「傲慢」與「無知」。知己需要克服達克效應（自視過高或迴避自身致命弱點）；知彼需要克服主觀投射與盲目揣測。只有建立在可靠客觀情報上的行動，才能保證立於不敗之地。',
    modernApplication: '【自我定位與市場調查】創業者或職場人切忌拍腦袋做決定。做任何重大選擇前，客觀做一次 SWOT 分析：我的核心護城河在哪？對手的長處與痛點在哪？知己知彼，才能避免成為盲目下場的炮灰。',
    famousQuote: '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-3',
      chapterTitle: '謀攻篇第三',
    },
    keyInsights: [
      '實事求是：決策建立在客觀真實的數據與實況上，絕不自我欺騙。',
      '清醒看清自身邊界：知己之不能，方能避免狂妄冒進招致滅頂之災。',
      '動態收集回饋：隨時保持敏銳感知，隨對手與環境的變化即時校準認知。',
    ],
    reflectionQuestion: '你對目前手頭最重要的計畫，是否真的掌握了足夠的客觀資訊？是否有被自己的盲目自信或僥倖心理蒙蔽之處？',
    relatedPointIds: ['shang-bing-fa-mou', 'shi-yi-bei-bian', 'bi-shi-ji-xu'],
    difficulty: 1,
  },

  // ── 11. 法術勢合一 ──────────────────────────────
  {
    id: 'fa-shu-shi',
    title: '法術勢合一 ‧ 法家治理綱領',
    tagline: '以法為規範、以術操權柄、以勢居威位，三者交融的客觀統治科學',
    pinyin: 'fǎ shù shì hé yī',
    category: 'governance',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國晚期',
    summary: '韓非集法家之大成，揉合商鞅之「法」（公開明確的法律條規）、申不害之「術」（君主暗中操縱官吏之權術考驗）與慎子之「勢」（位高權重的威勢地位），建構起一套無情卻嚴密的客觀政治控制體系。',
    deepAnalysis: '法家徹底拋棄了儒家「道德君子」的唯心幻想，基於人性好利惡害的假設建立制度。「法莫如顯，而術不欲見。」法律必須公開透明、賞罰必信，使萬民知所遵循；君主則需隱藏好惡（虛靜以待之），以綜核名實之術防範下屬欺瞞；同時牢牢佔據體制制高點（勢），如龍乘雲翔。',
    modernApplication: '【組織制度與治理結構】現代企業管理中，「法」即明確透明的 SOP 與 KPI；「術」即管理者的用人考核與績效面談；「勢」即組織賦予的授權與領導影響力。缺少法會陷入人治混亂，缺少術會被下屬架空，缺少勢則政令難行。',
    famousQuote: '抱法處勢則治，背法去勢則亂。今廢勢背法而待堯舜，堯舜至乃治，是千世亂而一世治也。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-40',
      chapterTitle: '難勢第四十',
    },
    keyInsights: [
      '制度勝於賢能：不寄希望於偶爾出現的道德聖人，而建立任何中常之人皆能運行的制度。',
      '賞罰信賞必罰：信用是制度的靈魂，賞罰不公會直接瓦解組織公信力。',
      '名實相符：聽其言必觀其行，嚴格依據實際產出而非花言巧語評價結果。',
    ],
    reflectionQuestion: '在你的團隊或個人專案中，規章制度是否清晰公開？賞罰標準是否切實執行，還是常因人情面子而打折？',
    relatedPointIds: ['shi-yi-bei-bian', 'wu-wei-er-zhi', 'shou-zhu-dai-tu'],
    crossSchoolComparison: {
      targetSchool: '儒家',
      contrastIdea: '儒家主張「道之以政，齊之以刑，民免而無恥；道之以德，齊之以禮，有恥且格」，重在內心道德自省；法家則認為人性唯利是圖，唯有嚴明賞罰制度才能維持秩序。',
    },
    difficulty: 3,
  },

  // ── 12. 世異備變 ────────────────────────────────
  {
    id: 'shi-yi-bei-bian',
    title: '世異則事異，事異則備變',
    tagline: '時代在變迁，事情在轉化，應對之道必須與時俱進，破除食古不化',
    pinyin: 'shì yì zé shì yì, shì yì zé bèi biàn',
    category: 'governance',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國晚期',
    summary: '「聖人不期脩古，不法常可，論世之事，因為之備。」上古有巢氏、燧人氏之法不可用於現代。時代的客觀條件變了，社會問題就變了；問題變了，防備措施與制度政策就必須徹底革新。',
    deepAnalysis: '韓非提出了戰國時代最激進的歷史進化哲學，直接批判儒家「法先王」與「祖述堯舜」的復古思維。他以「守株待兔」的寓言辛辣嘲諷那些企圖拿古代陳規陋習治理當前時代的人。法家堅信實踐與時效性，主張制度必須因時因地因勢隨時動態調整。',
    modernApplication: '【敏捷適應與打破路徑依賴】在 AI 與數位化浪潮下，過去讓你成功的經驗，很可能成為今天困死你的陷阱。隨時保持自我革新的勇氣，拒絕「我們一直都是這樣做的」慣性思維。',
    famousQuote: '聖人不期脩古，不法常可，論世之事，因為之備。世異則事異，事異則備變。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-49',
      chapterTitle: '五蠹第四十九',
    },
    keyInsights: [
      '破除路徑依賴：昨天的成功方程式無法解決明天的新挑戰。',
      '實踐檢驗：不崇拜權威與古代教條，一切以當前現實效果為評判依歸。',
      '主動主導變革：在環境劇變來臨前未雨綢繆，主動求變方能立於不敗之地。',
    ],
    reflectionQuestion: '在你的工作或學習流程中，有哪些步驟早已不合時宜，卻因為「習慣如此」而仍在浪費時間？',
    relatedPointIds: ['fa-shu-shi', 'zhi-ji-zhi-bi', 'shou-zhu-dai-tu'],
    difficulty: 2,
  },

  // ── 13. 兼相愛交相利 ────────────────────────────
  {
    id: 'jian-ai-jiao-li',
    title: '兼相愛，交相利',
    tagline: '視人之國若視其國，視人之身若視其身；博愛天下必須落實為互利共贏',
    pinyin: 'jiān xiāng ài, jiāo xiāng lì',
    category: 'philosophy',
    schoolId: 'mohism',
    primaryFigure: '墨子',
    historicalPeriod: '戰國前期',
    summary: '墨家學派的核心旗幟。墨翟認為天下動盪戰亂的根源，在於「不相愛」與「自私自利」。故主張跨越宗族、階級與國界，平等無差別地愛護所有人（兼愛）；並將這種博愛落實為具體的互利共贏（交相利）。',
    deepAnalysis: '墨子代表了先秦手工業者與底層平民的崇高呼聲。不同於儒家基於血緣親疏建立的「差等之愛」（仁愛），墨家的「兼愛」具有早期普世人道主義特質。同時墨子強調極致的實用主義：如果一種道德不能為大眾帶來物質福祉（交相利），它就是空洞偽善的說教。',
    modernApplication: '【利他共贏與商業向善】最健康的商業合作與人際關係不是零和博弈，而是創造增量價值。懂得站在合作夥伴與客戶的利益角度思考，成就他人最終才能真正成就自己。',
    famousQuote: '若使天下兼相愛，愛人若愛其身，猶有不孝者乎？視父兄與君若其身，惡施不孝？故不孝不慈亡有。',
    quoteSource: {
      workId: 'mo-zi',
      workTitle: '墨子',
      chapterId: 'mo-zi_ch-14',
      chapterTitle: '兼愛上第十四',
    },
    keyInsights: [
      '兼相愛非空談：唯有兼愛伴隨「交相利」，善意才能具備自生長力量。',
      '打破親疏分別：克服陣營思維，平等尊重不同背景的個體。',
      '苦行救世擔當：不圖個人安逸，以天下蒼生的福祉為畢生奮鬥志業。',
    ],
    reflectionQuestion: '在你的商業決策或人際協商中，是否總想著「自己佔盡便宜」？如何設計一個讓雙方都獲利（交相利）的長久機制？',
    relatedPointIds: ['fei-gong', 'shang-xian', 'min-gui-jun-qing'],
    crossSchoolComparison: {
      targetSchool: '儒家',
      contrastIdea: '孟子曾激烈批判墨子「兼愛是無父也」，認為抹殺父母至親與路人的區別是違背人倫常情；墨家則指責儒家之厚葬久喪繁文縟節耗空天下。',
    },
    difficulty: 2,
  },

  // ── 14. 民貴君輕 ────────────────────────────────
  {
    id: 'min-gui-jun-qing',
    title: '民為貴，社稷次之，君為輕',
    tagline: '人民百姓的福祉具有最高價值，權力統治的唯一正當性在於護佑生民',
    pinyin: 'mín wéi guì, shè jì cì zhī, jūn wéi qīng',
    category: 'governance',
    schoolId: 'confucianism',
    primaryFigure: '孟子',
    historicalPeriod: '戰國中期',
    summary: '孟子提出了先秦最振聾發聵的民本主義宣言。政權體系中，人民的生存與意志最為珍貴，國家政權次之，君主個人最為輕微。若君主視臣民如草芥，甚至暴虐無道，人民有權更替之。',
    deepAnalysis: '孟子將周初「天命無常，惟德是輔」發展為成熟的政治正當性學說。在專制集權萌芽的戰國時代，孟子敢於對齊宣王、梁惠王等當世霸主直言：「君之視臣如土芥，則臣視君如寇讎。」他將「得民心」視為政治存亡的唯一指針，開創了古代中華民本主義思想的高峰。',
    modernApplication: '【以用戶為中心與僕人式領導】任何產品、企業或機構，脫離了用戶與基層的真實福祉，覆亡只是時間問題。優秀領導者是服務者而非特權者，以敬畏之心對待每位使用者與一線同仁。',
    famousQuote: '民為貴，社稷次之，君為輕。是故得乎丘民而為天子，得乎天子為諸侯，得乎諸侯為大夫。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-14',
      chapterTitle: '盡心下第十四',
    },
    keyInsights: [
      '權力來源於人民：得民心者得天下，失民心者失天下。',
      '政治倫理的底線：統治的唯一正當性在於養民、安民與富民。',
      '平民尊嚴的肯定：古代專制浪潮中閃爍的早期民本光芒。',
    ],
    reflectionQuestion: '在你的團隊或產品決策中，是否真正把「用戶與基層同仁」放在首位，還是僅僅在迎合主管的個人喜好？',
    relatedPointIds: ['si-duan-zhi-xin', 'fa-shu-shi', 'jian-ai-jiao-li'],
    difficulty: 2,
  },

  // ── 15. 慎獨自省 ────────────────────────────────
  {
    id: 'shen-du-zi-sheng',
    title: '慎獨自省',
    tagline: '在無人看見處依然恪守本心，在隱微幽暗中涵養浩然正氣',
    pinyin: 'shèn dú zì xǐng',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '子思（傳）',
    historicalPeriod: '戰國前期',
    summary: '《中庸》曰：「莫見乎隱，莫顯乎微，故君子慎其獨也。」君子在獨處、沒有外人監督或旁人知曉時，依然誠實面對良知，不欺暗室，自律謹嚴，以此作為立德根本。',
    deepAnalysis: '慎獨是儒家心性之學的最高考驗。世人往往在眾人環視時注重形象言行，在隱蔽獨處時放縱慾望怠惰。真正的德行不是表演給社會看的社交面具，而是內心澄明無愧的定力。「誠於中，形於外」，內心無愧，舉止自然坦蕩安詳。',
    modernApplication: '【無人監督時的自律】在遠距辦公、獨自面對手機螢幕或無人監控的利益誘惑時，能否依然堅持道德底線與專注力？慎獨就是你與自己心靈的真實契約。',
    famousQuote: '道也者，不可須臾離也，可離非道也。是故君子戒慎乎其所不睹，恐懼乎其所不聞。莫見乎隱，莫顯乎微，故君子慎其獨也。',
    quoteSource: {
      workId: 'zhong-yong',
      workTitle: '中庸',
      chapterId: 'zhong-yong_ch-1',
      chapterTitle: '第一章：天命之謂性',
    },
    keyInsights: [
      '不欺暗室：道德的真諦在於自我約束，非畏懼外在刑罰。',
      '防微杜漸：邪念往往萌生於隱微之處，需在起心動念時即時覺察消融。',
      '心安理得：唯有慎獨者，才能擁有夜半敲門心不驚的平靜與浩然之氣。',
    ],
    reflectionQuestion: '當身邊空無一人且絕不會被任何人發現時，你的行為舉止是否經得起自己良知的審視？',
    relatedPointIds: ['ke-ji-fu-li', 'da-qiao-ruo-zhuo', 'hao-ran-zhi-qi'],
    difficulty: 2,
  },

  // ── 16. 大巧若拙 ────────────────────────────────
  {
    id: 'da-qiao-ruo-zhuo',
    title: '大巧若拙，大成若缺',
    tagline: '最高超的智慧看似樸實笨拙，最圓滿的成就不顯山露水',
    pinyin: 'dà qiǎo ruò zhuō, dà chéng ruò quē',
    category: 'conduct',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '真正高超的技巧不賣弄小聰明，表面上顯得笨拙沉著；真正完美的大成就懂得留白不求盈滿，其功用反而歷久彌新。提倡擺脫浮躁技巧，回歸質樸與長遠價值。',
    deepAnalysis: '老子洞悉辯證運行的極致：「大直若屈，大巧若拙，大辯若訥。」世俗喜好炫耀小聰明與鋒芒畢露，然而物極必反，亢龍有悔。唯有如璞玉般質樸沉潛，懂得收斂光芒（和光同塵），方能立於不敗之地。',
    modernApplication: '【長期主義與匠人精神】不追求賺快錢或急功近利的投機技巧，而是踏踏實實打磨核心基本功（下笨功夫）。在溝通與為人中，誠懇拙樸往往比舌燦蓮花更能贏得持久的信賴。',
    famousQuote: '大成若缺，其用不弊。大盈若沖，其用不窮。大直若屈，大巧若拙，大辯若訥。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-45',
      chapterTitle: '第四十五章：大成若缺',
    },
    keyInsights: [
      '不露圭角：避免賣弄聰明，鋒芒太盛容易招致嫉恨與折損。',
      '下笨功夫：最扎實的壁壘往往是由最質樸持久的日常積累構築。',
      '留白智慧：事物不可太滿，盈滿則虧，留缺方能持續生長。',
    ],
    reflectionQuestion: '在工作或學習中，你是否常被「走捷徑、耍小聰明」的誘惑牽引？若甘願「下笨功夫」，會帶來什麼改變？',
    relatedPointIds: ['shang-shan-ruo-shui', 'shen-du-zi-sheng', 'pao-ding-jie-niu', 'rou-ruo-sheng-gang-qiang'],
    difficulty: 2,
  },

  // ── 17. 仁者愛人 ────────────────────────────────
  {
    id: 'ren-zhe-ai-ren',
    title: '仁者愛人，有禮者敬人',
    tagline: '以真誠之愛愛護他人，人亦恆愛之；以謙遜之禮尊敬他人，人亦恆敬之',
    pinyin: 'rén zhě ài rén',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '孟子 / 孔子',
    historicalPeriod: '戰國中期',
    summary: '君子之所以異於常人，在於其內心存養仁愛與敬畏。仁者發自肺腑關懷他人，懂得換位思考；愛護他人的人，別人也永遠會愛護他；尊敬他人的人，別人也永遠會尊敬他。這是人際關係最根本的反射定律。',
    deepAnalysis: '儒家倫理的核心在於「絜矩之道」與「忠恕」。「己所不欲，勿施於人；己欲立而立人，己欲達而達人。」愛不是居高臨下的施捨，而是平等真誠的尊重。孟子指出，當遇到他人無禮對待時，君子首先反省自己：「我是否不夠仁愛？是否不夠有禮？」若自反無愧，則坦然處之，不與之盲目糾纏。',
    modernApplication: '【人際溝通與同理心】在職場與日常交往中，少一點指責與算計，多一份真誠的欣賞與支援。凡事懂得為對方著想，種下善意的種子，最終必定收穫健康的信任網絡。',
    famousQuote: '仁者愛人，有禮者敬人。愛人者人恆愛之，敬人者人恆敬之。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-8',
      chapterTitle: '離婁下第八',
    },
    keyInsights: [
      '情感的鏡射原理：你向世界發射什麼態度，世界就會向你反射什麼回饋。',
      '行有不得反求諸己：遇人際衝突先自檢言行，避免怨天尤人。',
      '立人達人的胸懷：成全他人之時，亦是自我格局最大的拓展。',
    ],
    reflectionQuestion: '當身邊的人對你態度冷淡或苛刻時，你有沒有先檢視自己給予對方的言行與態度是否真誠溫和？',
    relatedPointIds: ['ke-ji-fu-li', 'si-duan-zhi-xin', 'jian-ai-jiao-li'],
    difficulty: 1,
  },

  // ── 18. 君子不器 ────────────────────────────────
  {
    id: 'jun-zi-bu-qi',
    title: '君子不器',
    tagline: '君子不應成為用途單一的工具，而應具備通達全局的格局與德行',
    pinyin: 'jūn zǐ bù qì',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '孔子',
    historicalPeriod: '春秋末期',
    summary: '「器」指器皿、器具，各有固定容量與特定功用（如碗盛飯、舟涉水）。孔子告誡弟子：君子應當具備開闊的胸襟、通達的智慧與獨立的道德反思能力，絕不能把自己局限於某種狹隘的工具性角色。',
    deepAnalysis: '孔子極力倡導博通與自由心智。在專業化高度分工的社會中，人極易異化為單向度的「零件」或「打工人」，喪失對生命整體與社會價值的宏觀觀照。「君子不器」要求我們超越工具理性，培育綜合的思辨力、價值判斷力與美德，使精神保持崇高與自由。',
    modernApplication: '【跨界融合與防範工具人異化】在人工智慧迅猛發展的今天，單一技能極易被算法替代。保持好奇心，拓展跨學科視野，培養無法被機器取代的創造力、批判性思維與同理心，成為一個有溫度、有全局觀的通才。',
    famousQuote: '子曰：「君子不器。」',
    quoteSource: {
      workId: 'lun-yu',
      workTitle: '論語',
      chapterId: 'lun-yu_ch-2',
      chapterTitle: '為政第二',
    },
    keyInsights: [
      '拒絕單向度發展：不將自己的價值僅綁定在單一崗位職銜上。',
      '通達宏觀全景：從更高的維度理解問題本質，具備跨界整合能力。',
      '守護獨立靈魂：在任何體制環境中，保持對善惡美醜的自主審視。',
    ],
    reflectionQuestion: '在你的專業領域之外，你是否曾給自己留出時間閱讀哲學、欣賞藝術或關懷社會？你是在當「工具」，還是在當「君子」？',
    relatedPointIds: ['ke-ji-fu-li', 'da-qiao-ruo-zhuo', 'zhong-yong-zhi-dao'],
    difficulty: 2,
  },

  // ── 19. 中庸之道 ────────────────────────────────
  {
    id: 'zhong-yong-zhi-dao',
    title: '中庸之道 ‧ 極高明而道中庸',
    tagline: '無過不及、允執其中；在動態平衡中追求至善與最高明的和諧',
    pinyin: 'zhōng yōng zhī dào',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '子思',
    historicalPeriod: '戰國前期',
    summary: '中者，不偏不倚、無過不及之名；庸者，平常不變之理。中庸並非毫無原則的騎牆中立或平庸折中，而是能在瞬息萬變的事態中，極其精準地拿捏恰如其分的動態平衡點。',
    deepAnalysis: '《中庸》開宗明義：「喜怒哀樂之未發，謂之中；發而皆中節，謂之和。」未發之時，心境澄明安寧；情感發動之際，節制適度無偏。中庸是極難的君子實踐（「君子中庸，小人反中庸」），它需要深厚的修養與洞察力，隨時隨地根據時機（時中）做出最恰當的決策。',
    modernApplication: '【決策分寸與情緒管理】處事不走極端，激進不至冒進、保守不至僵化；溝通講求分寸，直言不至傷人、溫和不至懦弱。在矛盾重重的複雜局勢中，把握「度」的藝術。',
    famousQuote: '喜怒哀樂之未發，謂之中；發而皆中節，謂之和。中也者，天下之大本也；和也者，天下之達道也。致中和，天地位焉，萬物育焉。',
    quoteSource: {
      workId: 'zhong-yong',
      workTitle: '中庸',
      chapterId: 'zhong-yong_ch-1',
      chapterTitle: '第一章：天命之謂性',
    },
    keyInsights: [
      '時中動態調整：依據具體情境尋求最佳解答，絕非僵死固執的一成不變。',
      '無過亦無不及：不及是缺陷，過頭同樣是破壞，掌握分寸是最高智慧。',
      '致中和以育萬物：追求多元平衡與共生，而非非黑即白的零和撕裂。',
    ],
    reflectionQuestion: '回顧你最近的一次激烈爭執或冒進決策，是否因為用力過猛、失了分寸而造成了反效果？如何找回「中節」的平衡？',
    relatedPointIds: ['shen-du-zi-sheng', 'jun-zi-bu-qi', 'zhi-zu-chang-zu'],
    difficulty: 3,
  },

  // ── 20. 浩然之氣 ────────────────────────────────
  {
    id: 'hao-ran-zhi-qi',
    title: '養我浩然之氣',
    tagline: '至大至剛、塞於天地之間；以正義與坦蕩涵養百折不摧的精神韌性',
    pinyin: 'hào rán zhī qì',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '孟子',
    historicalPeriod: '戰國中期',
    summary: '孟子自豪地宣稱：「我善養吾浩然之氣。」浩然之氣極其宏大、極其剛勁，它是人長期堅持踐行正義道德（集義所生）而在內心凝聚出的充沛生命力量與坦蕩定力。',
    deepAnalysis: '浩然之氣是儒家對抗強權威逼與世俗誘惑的精神盔甲。它不是憑空打坐或偶爾做一件善事就能獲得的（「非義襲而取之也」），必須日積月累地做符合良心之事。一旦問心無愧，則「自反而縮，雖千萬人吾往矣」；若內心有愧，則氣衰膽怯。浩然之氣讓人具備了「富貴不能淫，貧賤不能移，威武不能屈」的大丈夫氣概。',
    modernApplication: '【抗壓韌性與人格底氣】面對職場職場PUA、不公威脅或人生低谷，堅守底線與問心無愧是最好的精神護盾。堂堂正正做事，心中自有一股天地正氣，無所畏懼。',
    famousQuote: '我善養吾浩然之氣。其為氣也，至大至剛，以直養而無害，則塞於天地之間。其為氣也，配義與道；無是，餒也。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-3',
      chapterTitle: '公孫醜上第三',
    },
    keyInsights: [
      '集義而生：浩然底氣源自長期的正義言行積累，無法投機速成。',
      '雖千萬人吾往矣：真理在手、問心無愧時，哪怕面對千軍萬馬亦毫不退縮。',
      '勿忘勿助長：持之以恆蓄養精神，不拔苗助長，亦不半途而廢。',
    ],
    reflectionQuestion: '在利益考驗或壓力面前，你是否曾為了討好他人而違背良心妥協？怎樣的堅持能讓你重拾抬頭挺胸的浩然底氣？',
    relatedPointIds: ['si-duan-zhi-xin', 'shen-du-zi-sheng', 'lu-man-man'],
    difficulty: 2,
  },

  // ── 21. 天行有常 ────────────────────────────────
  {
    id: 'tian-xing-you-chang',
    title: '天行有常 ‧ 制天命而用之',
    tagline: '大自然客觀運轉不以人意轉移；尊重自然規律，發揮主觀能動性',
    pinyin: 'tiān xíng yǒu cháng, zhì tiān mìng',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '荀子',
    historicalPeriod: '戰國晚期',
    summary: '荀子破除對「天」的迷信：「天行有常，不為堯存，不為桀亡。」自然界的運轉有其客觀規律，不因聖君堯在位而風調雨順，也不因暴君桀在位而降下災禍。人應當「制天命而用之」——掌握自然規律並造福人類社會。',
    deepAnalysis: '《荀子・天論》是先秦唯物主義與科學理性精神的里程碑。荀子劃清了「天人相分」的界限：天管自然的生息變化，人管社會的禮法秩序與努力（「治亂非天也」）。他不主張像原始宗教般祈求天神賜福，也不主張像消極道家般完全無為，而是主張掌握客觀物理與季節規律，主動開拓進取。',
    modernApplication: '【科學理性與主觀能動性】不怨天尤人，不把失敗寄託於「運氣差」或算命占卜。清醒研究大環境與市場客觀規律，尊重客觀事實，在此基礎上發揮人的創造力與執行力。',
    famousQuote: '天行有常，不為堯存，不為桀亡。應之以治則吉，應之以亂則凶。大天而思之，孰與物畜而制之！',
    quoteSource: {
      workId: 'xunzi',
      workTitle: '荀子',
      chapterId: 'xunzi_ch-17',
      chapterTitle: '天論第十七',
    },
    keyInsights: [
      '客觀規律不講私情：天地不偏袒任何人，遵循規律則吉，違背規律則凶。',
      '天人相分各司其職：自然做好自然的運轉，人做好人的耕耘與治理。',
      '制天命而用之：在認識規律的前提下大膽作為，掌握自身命運主導權。',
    ],
    reflectionQuestion: '當遭遇挫敗時，你是否曾陷入「時運不濟」的自憐中？有哪些客觀規律你之前沒有認真研究，現在需要主動掌握？',
    relatedPointIds: ['dao-fa-zi-ran', 'hua-xing-qi-wei', 'shi-yi-bei-bian'],
    difficulty: 2,
  },

  // ── 22. 柔弱勝剛強 ──────────────────────────────
  {
    id: 'rou-ruo-sheng-gang-qiang',
    title: '柔弱勝剛強 ‧ 守雌抱樸',
    tagline: '生命充滿生機時皆為柔韌，唯死滅僵死之物方顯堅硬；以柔韌贏得長存',
    pinyin: 'róu ruò shèng gāng qiáng',
    category: 'philosophy',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '人活著時身體柔軟富有彈性，死後則僵硬冰冷；草木生長時嫩綠柔弱，枯死後則枯槁堅硬。因此，剛強是通往死亡的特徵，柔弱才是充滿生機的根本。以柔克剛、守雌處下，方為立身處世至高智慧。',
    deepAnalysis: '老子深刻揭示了事物的生機本質。世俗之人盲目追求表面上的強大、霸道與鋼鐵般剛硬，然而「兵強則滅，木強則折」。剛硬之物缺乏適應力，遇至堅外力必應聲斷裂；唯有如水、如草木般具備極高延展性與柔韌性的存在，能隨外力彎曲而不折，最終消解一切剛強衝擊。',
    modernApplication: '【心理彈性與抗脆弱能力】在生活與工作中，不要做動輒破防的「脆皮玻璃心」，而要鍛鍊「如水如蘆葦」般的柔韌性。面對批評與挫折，順勢化解，保持內心彈性與長期生命力。',
    famousQuote: '人之生也柔弱，其死也堅強。萬物草木之生也柔脆，其死也枯槁。故堅強者死之徒，柔弱者生之徒。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-76',
      chapterTitle: '第七十六章：人之生也柔弱',
    },
    keyInsights: [
      '柔韌才有生命力：僵化與自負往往是衰亡的起點，保持好奇與謙和才能生生不息。',
      '以柔克剛：不與強大阻力迎頭死磕，以迂迴包容的方式逐步同化轉變。',
      '守雌知雄：深知剛強之道，卻甘願選擇柔退沉潛，蓄積最深厚的底蘊。',
    ],
    reflectionQuestion: '在與他人的摩擦對抗中，你的「剛硬防衛」是否反而讓自己傷得更重？如何用柔軟與傾聽打破僵局？',
    relatedPointIds: ['shang-shan-ruo-shui', 'da-qiao-ruo-zhuo', 'zhi-zu-chang-zu'],
    difficulty: 1,
  },

  // ── 23. 莊周夢蝶 ────────────────────────────────
  {
    id: 'zhuang-zhou-meng-die',
    title: '莊周夢蝶 ‧ 物化之境',
    tagline: '不知周之夢為胡蝶，胡蝶之夢為周？打破主客界限，體悟萬物相通',
    pinyin: 'zhuāng zhōu mèng dié',
    category: 'allusions',
    schoolId: 'daoism',
    primaryFigure: '莊子',
    historicalPeriod: '戰國中期',
    summary: '莊子夢見自己變成了蝴蝶，翩翩起舞十分愜意，完全忘了自己是莊周。醒來後驚覺自己是莊周，卻不知究竟是莊周做夢變成蝴蝶，還是蝴蝶做夢變成莊周？此即「物化」——破除自我與外物的絕緣隔閡，達到物我兩忘的超脫之境。',
    deepAnalysis: '這是世界哲學史上最迷人的寓言之一。莊子並非陷入不可知論的虛無，而是透過夢與覺的轉換，啟發人們打破狹隘「自我主體」的執念。常人執著於「我是某某」、「這是我擁有的」，為社會身份所累。若能體會到自我是浩瀚宇宙物質與能量千變萬化中的一環，便能坦然接納生老病死與聚散無常。',
    modernApplication: '【解構自我執念與審美昇華】不要把個人的單一社會標籤（工程師、經理、失敗者）當作生命的全部。融入大自然與廣闊宇宙，以審美與好奇的心情看待生活的起伏，活得自在輕盈。',
    famousQuote: '昔者莊周夢為胡蝶，栩栩然胡蝶也，自喻適志與！不知周也。俄然覺，則蘧蘧然周也。不知周之夢為胡蝶與？胡蝶之夢為周與？周與胡蝶，則必有分矣。此之謂物化。',
    quoteSource: {
      workId: 'zhuangzi',
      workTitle: '莊子',
      chapterId: 'zhuangzi_ch-2',
      chapterTitle: '齊物論第二',
    },
    keyInsights: [
      '物我兩忘：突破孤立狹隘的自我視角，與萬事萬物共情相融。',
      '超越執念：人生如夢境流轉，不必將一時的得失榮辱看得過於沉重。',
      '逍遙審美：在生活微小處保持詩意與欣喜，感受生命本真的輕快自在。',
    ],
    reflectionQuestion: '當你被現實的某個身份身不由己地壓得喘不過氣時，能否給自己片刻時間，如蝴蝶般輕盈俯瞰這一切？',
    relatedPointIds: ['qi-wu-xiao-yao', 'pao-ding-jie-niu', 'da-qiao-ruo-zhuo'],
    difficulty: 2,
  },

  // ── 24. 知足常足 ────────────────────────────────
  {
    id: 'zhi-zu-chang-zu',
    title: '知足不辱，知止不殆',
    tagline: '明白知足便不會招致屈辱，懂得適可而止便不會遭遇危殆，可以長久',
    pinyin: 'zhī zú bù rǔ, zhī zhǐ bù dài',
    category: 'conduct',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '過度迷戀名聲往往耗費心神，過度積聚財物往往引來大禍。懂得滿足的人不會遭受貪婪帶來的屈辱，懂得適時停止的人不會陷入危殆深淵。能夠把握「止足」的邊界，生命才能歷久彌新。',
    deepAnalysis: '老子深入剖析了人類貪婪本性帶來的災難。「禍莫大於不知足，咎莫大於欲得。」現代社會充斥著刺激欲望的消費主義與內卷焦慮，讓人永遠在追求下一個目標中疲於奔命。知足不是不思進取，而是一種清醒的界限感——知道什麼對自己而言是「足夠」，從而守護心靈的自主權。',
    modernApplication: '【止損心態與防範過度消耗】學會設定生活與投資的「滿意線」與「止損線」。不被無休止的欲望牽著鼻子走，當斷則斷，留出精力陪伴家人、關照身心健康。',
    famousQuote: '名與身孰親？身與貨孰多？得與亡孰病？甚愛必大費，多藏必厚亡。故知足不辱，知止不殆，可以長久。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-44',
      chapterTitle: '第四十四章：知足常足',
    },
    keyInsights: [
      '明確足夠的邊界：不被無限膨脹的欲望奴役，重掌生活主動權。',
      '急流勇退知止：當事物到達極限頂點時主動剎車，避免物極必反。',
      '身外之物不重於生命：健康與心靈平靜永遠高於虛名與多餘財貨。',
    ],
    reflectionQuestion: '在你目前疲於奔命的生活中，有哪些事物其實早已「足夠」，只是你的執念不願踩下剎車？',
    relatedPointIds: ['shang-shan-ruo-shui', 'zhong-yong-zhi-dao', 'da-qiao-ruo-zhuo'],
    difficulty: 1,
  },

  // ── 25. 自相矛盾 ────────────────────────────────
  {
    id: 'zi-xiang-mao-dun',
    title: '自相矛盾 ‧ 難一之辨',
    tagline: '世間萬事不可立於互相否定之假設；以嚴密邏輯破除虛妄宣傳',
    pinyin: 'zì xiāng máo dùn',
    category: 'allusions',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國晚期',
    summary: '楚國有人賣矛與盾，誇耀其盾至堅「物莫能陷」，又誇耀其矛至利「於物無不陷」。有人問：「以子之矛陷子之盾，何如？」賣者無言以對。不可陷之盾與無不陷之矛，絕不可能同時並存於世。',
    deepAnalysis: '《韓非子・難一》藉此寓言深入論證邏輯一致性與法治思想。韓非以此批判儒家同時鼓吹「堯舜之德」與「湯武之伐」在邏輯上的不可兼得。在社會治理中，若法律規章本身互相衝突抵觸，下屬必然無所適從、奸邪必乘虛而入。法度條規必須邏輯嚴密自洽，方具權威。',
    modernApplication: '【批判性思維與邏輯自洽】在資訊爆炸時代，警惕各類互相矛盾的宣傳與言論（例如既要馬兒跑得快、又要馬兒不吃草）。在專案規劃與團隊目標設定時，檢查底層邏輯是否衝突，避免自相矛盾。',
    famousQuote: '楚人有鬻盾與矛者，譽之曰：「吾盾之堅，物莫能陷也。」又譽其矛曰：「吾矛之利，於物無不陷也。」或曰：「以子之矛陷子之盾，何如？」其人弗能應也。夫不可陷之盾與無不陷之矛，不可同世而立。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-36',
      chapterTitle: '難一第三十六',
    },
    keyInsights: [
      '邏輯一致性檢驗：檢驗言論與政策的第一步，是確認其是否存在自我否定。',
      '杜絕畫餅空談：凡事講求實證與相容性，不被浮誇的包裝所蒙蔽。',
      '制度規章一致：組織內的考核規章必須前後呼應，否則將徹底喪失公信力。',
    ],
    reflectionQuestion: '在你的目標規劃中，是否常常一方面想要極致的悠閒放鬆，一方面又渴望超凡的成就進展？如何梳理其中的邏輯優先級？',
    relatedPointIds: ['fa-shu-shi', 'shou-zhu-dai-tu', 'shi-yi-bei-bian'],
    difficulty: 1,
  },

  // ── 26. 守株待兔 ────────────────────────────────
  {
    id: 'shou-zhu-dai-tu',
    title: '守株待兔 ‧ 破除泥古',
    tagline: '時代環境已翻天覆地，若仍妄想靠偶發偶然的舊經驗坐享其成，必遭歷史淘汰',
    pinyin: 'shǒu zhū dài tù',
    category: 'allusions',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國晚期',
    summary: '宋國有農夫耕田，恰有一兔奔跑撞樹樁折頸而死。農夫從此放下農具整日守在樹旁，期望再撿到兔子，兔子未曾再得，反成天下笑柄。企圖拿過去的陳規老套治理今天的新時代，皆是守株待兔之徒。',
    deepAnalysis: '韓非借寓言精準抨擊了將「偶然僥倖」視為「必然規律」的認知偏差。許多人在歷史或人生中曾憑藉偶然運氣成功一次，便將其奉為圭臬，從此放棄努力與主動應變，死守在原地。法家強調動態進化觀：因時因地審視當下事實，靠扎實的制度耕耘，而非靠碰運氣過日子。',
    modernApplication: '【反對經驗主義與倖存者偏差】警惕將過去的偶然成功當成必然規律。在新興領域出現時，及時放下舊農具，主動探索新工具與新方法，不做在新時代守株待兔的人。',
    famousQuote: '宋人有耕者。田中有株，兔走觸株，折頸而死。因釋其耒而守株，冀復得兔。兔不可復得，而身為宋國笑。今欲以先王之政，治當世之民，皆守株之類也。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-49',
      chapterTitle: '五蠹第四十九',
    },
    keyInsights: [
      '認清偶然與必然：不將偶發幸運誤認為可複製的客觀規律。',
      '放下舊農具求新：面對新環境敢於揚棄老套路，避免陷入路徑依賴。',
      '勤於主動耕耘：把命運建立在扎實的日常耕作上，而非等待天上掉餡餅。',
    ],
    reflectionQuestion: '你是否在某些工作領域，依然習慣性地依賴多年前管用、如今早已低效的老辦法？什麼阻礙了你學習新工具？',
    relatedPointIds: ['shi-yi-bei-bian', 'fa-shu-shi', 'zi-xiang-mao-dun'],
    difficulty: 1,
  },

  // ── 27. 非攻兼義 ────────────────────────────────
  {
    id: 'fei-gong',
    title: '非攻 ‧ 誅暴安良之辨',
    tagline: '反對非正義之侵略與強權掠奪，以和平共處護佑萬民生命福祉',
    pinyin: 'fēi gōng',
    category: 'governance',
    schoolId: 'mohism',
    primaryFigure: '墨子',
    historicalPeriod: '戰國前期',
    summary: '偷竊一人財物已知為不義，若發動大軍攻伐別國殺戮百姓掠奪土地，世人反譽之為英雄正義，此乃大不義！墨子堅決反對任何形式的不義侵略戰爭（非攻），主張強不執弱、眾不劫寡、貴不傲賤。',
    deepAnalysis: '墨子的「非攻」並非絕對主義的被動挨打，而是反對以大欺小的侵奪性戰爭。為落實非攻，墨家精通防守器械製造與築城防禦技術（止楚攻宋），以實打實的防禦能力威懾侵略者。墨家認為侵略戰爭耗空國家府庫、殘害無辜百姓農桑，是人間至大罪惡。',
    modernApplication: '【反對職場內耗與惡性侵奪】在組織合作中，反對以大壓小、搶奪同仁成果或發動零和惡性競爭。建立公正透明的防禦防線，維護弱勢同仁的合法權益與公平正義。',
    famousQuote: '今至大為不義攻國，則弗知非，從而譽之，謂之義。情不知亂，故書其言以遺後世。若知其不義也，夫奚說書其不義以遺後世哉？',
    quoteSource: {
      workId: 'mo-zi',
      workTitle: '墨子',
      chapterId: 'mo-zi_ch-17',
      chapterTitle: '非攻上第十七',
    },
    keyInsights: [
      '正義無雙重標準：小偷為惡，發動戰爭者更是巨惡，不能用冠冕堂皇辭藻粉飾。',
      '實力支撐和平：單純祈禱不能阻擋侵略，必須擁有足夠的防禦實力方能止戰。',
      '民生福祉第一：反對耗損民力財力的好大喜功，一切以平民安居樂業為重。',
    ],
    reflectionQuestion: '在日常競爭中，你是否曾以「正當競爭」為名，做過損害他人合法利益、侵奪他人成果的事？如何守住道德底線？',
    relatedPointIds: ['jian-ai-jiao-li', 'shang-xian', 'shang-bing-fa-mou'],
    difficulty: 2,
  },

  // ── 28. 尚賢治國 ────────────────────────────────
  {
    id: 'shang-xian',
    title: '尚賢 ‧ 不拘一格聚英才',
    tagline: '官無常貴，民無終賤；打破門閥血緣枷鎖，唯才是舉任用賢能',
    pinyin: 'shàng xián',
    category: 'governance',
    schoolId: 'mohism',
    primaryFigure: '墨子',
    historicalPeriod: '戰國前期',
    summary: '國家的長治久安在於匯聚天下賢能之士。「官無常貴，而民無終賤，有能則舉之，無能則下之。」不因其出身貧賤或血緣遠近而有所偏見，唯有真正有德行才幹的人才能賦予治理權柄。',
    deepAnalysis: '在貴族世襲統治根深蒂固的先秦時代，墨子提出「尚賢」是極具革命性的思想解放。他主張給予賢者「高爵、重祿、分之以事、斷之以令」，不僅有虛名，更要賦予實質權力與待遇。尚賢打破了社會階層固化，讓底層優秀平民擁有了向上流動與治國理政的通道。',
    modernApplication: '【現代人才選拔與扁平賦能】在企業管理與團隊組建中，杜絕親疏有別或派系門閥。以能力與產出為唯一標準，為優秀人才提供施展抱負的平台與足夠的授權，啟發全員創新潛力。',
    famousQuote: '大人之務，將在於聚天下之善人也。是故國有賢良之士眾，則國家之治厚；賢良之士寡，則國家之治薄。故大人之早務，在於急得士。官無常貴，而民無終賤，有能則舉之，無能則下之。',
    quoteSource: {
      workId: 'mo-zi',
      workTitle: '墨子',
      chapterId: 'mo-zi_ch-8',
      chapterTitle: '尚賢上第八',
    },
    keyInsights: [
      '唯才是舉：打破出身、學歷與資歷偏見，專注考核實際能力與品德。',
      '實質賦權：給予人才決策權與充足資源，不讓賢能成為空掛的名號。',
      '能上能下：建立流動激勵機制，有能者晉升，尸位素餐者及時退位。',
    ],
    reflectionQuestion: '在評價或挑選合作夥伴時，你是否容易被「學校背景、親疏關係」帶偏？是否真正考察了他解決實際問題的能力？',
    relatedPointIds: ['jian-ai-jiao-li', 'fei-gong', 'min-gui-jun-qing'],
    difficulty: 2,
  },

  // ── 29. 風林火山 ────────────────────────────────
  {
    id: 'feng-lin-huo-shan',
    title: '風林火山 ‧ 六軍變幻之勢',
    tagline: '疾如風，徐如林，侵掠如火，不動如山，難知如陰，動如雷震',
    pinyin: 'fēng lín huǒ shān',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '行動迅捷如狂風掃落葉，行進從容如森林整齊嚴肅，進攻猛烈如燎原烈火，防守堅固如泰山不可撼動，隱蔽偽裝如陰雲遮日無懈可擊，發起衝擊如雷霆萬鈞猝不及防。戰略作戰必須具備高度的節奏掌控與多態變換。',
    deepAnalysis: '《孫子兵法・軍爭篇》提出了軍事行動節奏與隊列執行的極致美學。這六種自然意象，涵蓋了戰略行動的全部關鍵維度：速度（風）、秩序（林）、爆發力（火）、定力（山）、保密性（陰）與震懾力（雷）。兵無常勢，水無常形，能根據戰場變化自如切換狀態者，方為神兵。',
    modernApplication: '【執行力節奏與心智切換】在專案推進中，該快速交付時雷厲風行（疾如風），日常團隊運營時秩序井然（徐如林），抓住戰略機遇時全力出擊（侵掠如火），面臨市場動盪時堅守陣地沉著冷靜（不動如山）。',
    famousQuote: '故其疾如風，其徐如林，侵掠如火，不動如山，難知如陰，動如雷震。掠鄉分眾，廓地分利，懸權而動。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-7',
      chapterTitle: '軍爭篇第七',
    },
    keyInsights: [
      '動靜有常：知道何時該如疾風迅雷，何時該如深林泰山，切忌始終繃緊一種狀態。',
      '團隊合拍：個人速度不能凌駕於集體秩序之上，群體協同一致方能具備攻防威力。',
      '出其不意：隱藏底牌直至最關鍵時刻爆發，達成最大戰略震懾效果。',
    ],
    reflectionQuestion: '在當前工作中，你的步調是常年處於慌亂救火中，還是能夠依據任務階段自由切換「如山之定」與「如火之猛」？',
    relatedPointIds: ['shang-bing-fa-mou', 'bi-shi-ji-xu', 'zhi-ji-zhi-bi'],
    difficulty: 2,
  },

  // ── 30. 避實擊虛 ────────────────────────────────
  {
    id: 'bi-shi-ji-xu',
    title: '避實擊虛 ‧ 兵形象水',
    tagline: '水因地而制流，兵因敵而制勝；繞開對手強大重兵，精準打擊脆弱空虛',
    pinyin: 'bì shí jī xū',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '「夫兵形象水，水之行避高而趨下，兵之形避實而擊虛。」用兵之法如水流順隨地勢，水自然避開高山而流向低窪，用兵亦必須避開對手重兵防守之「實」，全力集中突破對手空虛疏漏之「虛」。',
    deepAnalysis: '《孫子兵法・虛實篇》探討了資源調度與主被動轉換的核心規律。常人容易陷入強強對決的死拼硬碰，結果殺敵一千自損八百。孫子倡導「致人而不致於人」——調動敵人而不是被敵人牽著鼻子走。透過聲東擊西與偽裝，迫使對手分散兵力處處防備，從而創造出對方的致命盲點與空虛，再以絕對優勢兵力一擊必殺。',
    modernApplication: '【差異化競爭與藍海戰略】在職場與商業賽道上，永遠不要去擠人滿為患、大廠重兵把守的紅海（避實）。尋找巨頭看不上或無法顧及的細分痛點與利基市場（擊虛），以極致專注打造差異化護城河。',
    famousQuote: '夫兵形象水，水之行避高而趨下，兵之形避實而擊虛。水因地而制流，兵因敵而制勝。故兵無常勢，水無常形；能因敵變化而取勝者，謂之神。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-6',
      chapterTitle: '虛實篇第六',
    },
    keyInsights: [
      '不與巨頭硬碰硬：在對手最擅長的賽道與之競爭無異於以卵擊石。',
      '創造相對優勢：在局部點位上集中優勢兵力，達成小勝累積為大勝。',
      '動態無常形：如流水般適應對手的變化，不固守僵化的競爭模式。',
    ],
    reflectionQuestion: '在你目前的業務或求職競爭中，你是否正在拿自己的弱項去碰對手的長項？對手真正的「虛處」在哪裡？',
    relatedPointIds: ['shang-bing-fa-mou', 'feng-lin-huo-shan', 'zhi-ji-zhi-bi', 'shang-shan-ruo-shui'],
    difficulty: 2,
  },
]

// ── 六大進階修習學程（Learning Tracks） ───────────────────────
export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'track-peace',
    title: '澄懷觀道 ‧ 心靈逍遙修習程',
    subtitle: '在焦慮時代找回靈魂的從容、彈性與自由',
    sealText: '心',
    icon: 'heart',
    badgeColor: '#5b8a72',
    summary: '從老子的甘處卑下、柔弱勝剛強，到莊子的庖丁解牛、齊物逍遙與夢蝶之思。這是一條引導你卸下內耗焦慮、化解外界執念、涵養如水般抗脆弱生命力的修心之旅。',
    estimatedMinutes: 28,
    targetAudience: '工作疲倦、常感焦慮迷茫、渴望內心平靜與精神自足的現代人',
    pointIds: ['shang-shan-ruo-shui', 'dao-fa-zi-ran', 'rou-ruo-sheng-gang-qiang', 'pao-ding-jie-niu', 'qi-wu-xiao-yao', 'zhuang-zhou-meng-die', 'zhi-zu-chang-zu'],
    coreBenefit: '掌握「以柔克剛」、「順勢而為」、「物我兩忘」與「知足常足」的心靈心法。',
  },
  {
    id: 'track-gentleman',
    title: '君子立德 ‧ 內外修為進階程',
    subtitle: '淬鍊道德自律、君子格局與卓然氣度',
    sealText: '德',
    icon: 'scholar',
    badgeColor: '#b58d3d',
    summary: '由孔子的克己自律、仁者愛人、君子不器，深入孟子的四端善性與浩然正氣，再至中庸的慎獨定力與荀子的化性起偽。全面掌握儒家修齊治平的立德實踐之學。',
    estimatedMinutes: 32,
    targetAudience: '追求品格自律、想提升人際修養與建立清明內在秩序的求道者',
    pointIds: ['ke-ji-fu-li', 'ren-zhe-ai-ren', 'jun-zi-bu-qi', 'si-duan-zhi-xin', 'hao-ran-zhi-qi', 'shen-du-zi-sheng', 'zhong-yong-zhi-dao', 'hua-xing-qi-wei'],
    coreBenefit: '建立強大的自我反省習慣，培養仁愛同理心與堂堂正正的浩然之氣。',
  },
  {
    id: 'track-strategy',
    title: '洞察全局 ‧ 先秦戰略謀略程',
    subtitle: '高維博弈、決策判斷、避實擊虛與全勝思維',
    sealText: '策',
    icon: 'sword',
    badgeColor: '#a64b4b',
    summary: '融合《孫子兵法》之「上兵伐謀」、「知己知彼」、「風林火山」、「避實擊虛」，與法家韓非之「世異備變」。培養冷靜理性的戰略格局與穿透本質的決策勝率。',
    estimatedMinutes: 35,
    targetAudience: '創業者、管理者、職場博弈者及熱愛戰略思維的深度讀者',
    pointIds: ['shang-bing-fa-mou', 'zhi-ji-zhi-bi', 'feng-lin-huo-shan', 'bi-shi-ji-xu', 'shi-yi-bei-bian'],
    coreBenefit: '跳脫低維度內耗，學會以全勝視角謀篇布局，因時因地靈活變革。',
  },
  {
    id: 'track-mohism',
    title: '兼愛非攻 ‧ 墨家博愛實踐程',
    subtitle: '摩頂放踵利天下，底層平民的崇高正義與公理',
    sealText: '墨',
    icon: 'shield',
    badgeColor: '#4d7c8a',
    summary: '深入墨翟及其門徒為天下蒼生奔走的熱血志業。從「兼相愛，交相利」的互利大同，到「非攻」的捍衛和平，再到「尚賢」的打破階級桎梏。',
    estimatedMinutes: 25,
    targetAudience: '重視社會公義、關心公共福祉、追求實用共贏的熱血實踐者',
    pointIds: ['jian-ai-jiao-li', 'fei-gong', 'shang-xian'],
    coreBenefit: '體會不計私利的博愛胸襟，學會建立互利共贏的真實社會連結。',
  },
  {
    id: 'track-wisdom',
    title: '寓言喻理 ‧ 先秦思辨破局程',
    subtitle: '以生動寓言看透世相人心與思維陷阱',
    sealText: '典',
    icon: 'sparkle',
    badgeColor: '#4a6fa5',
    summary: '先秦諸子善於運用寓言精闢說理。透過庖丁解牛看清結構、莊周夢蝶跳出成心、自相矛盾檢驗邏輯、守株待兔反對泥古、大巧若拙守護本真，全面升級認知思維模型。',
    estimatedMinutes: 28,
    targetAudience: '喜歡生動故事、希望提升邏輯批判力與突破思維盲區的終身學習者',
    pointIds: ['pao-ding-jie-niu', 'zhuang-zhou-meng-die', 'zi-xiang-mao-dun', 'shou-zhu-dai-tu', 'da-qiao-ruo-zhuo'],
    coreBenefit: '破除教條主義與經驗主義，習得先秦大家穿透表象的犀利洞察。',
  },
  {
    id: 'track-debate',
    title: '諸子爭鳴 ‧ 哲學思辨巔峰程',
    subtitle: '探討人性善惡、治國秩序與大千本質的千古辯難',
    sealText: '辯',
    icon: 'scale',
    badgeColor: '#5e6e8b',
    summary: '先秦思想最精彩處在於百家辯難。孟子之「性善」與荀子之「性惡」、墨家之「兼愛」與儒家之「差等」、道家之「無為」與法家之「嚴刑」，在此激盪碰撞。',
    estimatedMinutes: 36,
    targetAudience: '喜愛哲學探討、思辨邏輯與跨觀點深度碰撞的進階求道者',
    pointIds: ['si-duan-zhi-xin', 'hua-xing-qi-wei', 'wu-wei-er-zhi', 'fa-shu-shi', 'tian-xing-you-chang', 'min-gui-jun-qing'],
    coreBenefit: '打破單一思維盲點，學會從多個學派立場客觀審視世間複雜難題。',
  },
]

// ── 五大人生情境解惑指南（Dilemma Topics） ───────────────────
export const DILEMMA_TOPICS: DilemmaTopic[] = [
  {
    id: 'dilemma-burnout',
    title: '精神內耗與焦慮倦怠',
    subtitle: '工作壓力巨大、容易被外界評價綁架、患得患失焦躁不安',
    sealText: '釋',
    icon: 'heart',
    situation: '每天被繁雜事務牽著鼻子走，別人一句質疑就輾轉反側，時刻活在內卷焦慮中，感覺自己快被榨乾。',
    remedyIntro: '道家老莊教我們「順應自發」與「守柔處下」。把外界聲音與內在自我剝離，如水般善處卑下，如莊周般物我兩忘。',
    corePointIds: ['shang-shan-ruo-shui', 'qi-wu-xiao-yao', 'rou-ruo-sheng-gang-qiang', 'zhi-zu-chang-zu'],
    prescriptions: [
      { pointId: 'shang-shan-ruo-shui', actionPrompt: '學會不爭之德：不在情緒上跟人硬槓，像水一樣繞開阻力，保全自己的心智能量。' },
      { pointId: 'qi-wu-xiao-yao', actionPrompt: '拉大時空維度：五年之後再回看眼前的糾結，它微不足道；學會對非原則性評價一笑了之。' },
      { pointId: 'rou-ruo-sheng-gang-qiang', actionPrompt: '鍛鍊心理彈性：柔軟才能長存，不要做一碰就碎的硬骨頭，順應環境尋求轉機。' },
      { pointId: 'zhi-zu-chang-zu', actionPrompt: '及時踩下煞車：認清什麼是「足夠」，劃定工作與休閒的防護線，避免欲望無底洞。' },
    ],
  },
  {
    id: 'dilemma-career',
    title: '職場競爭與進退抉擇',
    subtitle: '身處複雜競爭博弈、不知何時該進取何時該防守、缺乏護城河',
    sealText: '謀',
    icon: 'sword',
    situation: '周圍競爭激烈，有人搶功有人推諉，不知該如何破局；在重大決策前瞻前顧後，害怕一著不慎滿盤皆輸。',
    remedyIntro: '兵家孫武教我們「上兵伐謀」與「避實擊虛」。戰略的精髓不在於硬拼，而在於洞察底層情報與巧妙調動對手。',
    corePointIds: ['shang-bing-fa-mou', 'zhi-ji-zhi-bi', 'bi-shi-ji-xu', 'feng-lin-huo-shan'],
    prescriptions: [
      { pointId: 'zhi-ji-zhi-bi', actionPrompt: '冷靜盤點底牌：徹底查清客觀資訊與對手實況，不被表面虛張聲勢嚇倒，亦不盲目自大。' },
      { pointId: 'shang-bing-fa-mou', actionPrompt: '拒絕打消耗戰：優先尋求共贏或在規則前哨化解矛盾，硬碰硬是最後才考慮的下策。' },
      { pointId: 'bi-shi-ji-xu', actionPrompt: '避開主戰場：不在紅海中拼刺刀，找到競爭對手忽略的利基細分市場，精準建立優勢。' },
      { pointId: 'feng-lin-huo-shan', actionPrompt: '掌控行動節奏：平時像泰山般沉穩蓄力，機遇一旦出現如雷火般果斷出擊。' },
    ],
  },
  {
    id: 'dilemma-relationship',
    title: '人際摩擦與溝通障礙',
    subtitle: '常常發生爭端、團隊難帶、覺得周圍人難以相處孤立無援',
    sealText: '和',
    icon: 'people',
    situation: '無論在家庭還是職場，總是容易跟他人鬧脾氣；自認為好心好意，別人卻不領情甚至反感，關係陷入僵局。',
    remedyIntro: '儒墨兩家提供了極為深厚的處世智慧：克己約束私心、仁者愛人敬人、兼愛交相利。唯有利他與同理方能破冰。',
    corePointIds: ['ren-zhe-ai-ren', 'ke-ji-fu-li', 'jian-ai-jiao-li', 'jun-zi-bu-qi'],
    prescriptions: [
      { pointId: 'ren-zhe-ai-ren', actionPrompt: '行有不得反求諸己：遇摩擦先檢視自己是否做到了敬重與傾聽，善意往往能引發善意的回饋。' },
      { pointId: 'ke-ji-fu-li', actionPrompt: '控制下意識的衝動：在想發火前深呼吸十秒，約束嘴邊的尖酸刻薄，用有尊嚴的方式表達立場。' },
      { pointId: 'jian-ai-jiao-li', actionPrompt: '尋找共贏交集：不要只談自己的訴求，明確告訴對方這件事能如何同時為他帶來利益。' },
      { pointId: 'jun-zi-bu-qi', actionPrompt: '拓展共情維度：不以單一工具標準苛責他人，學會欣賞團隊成員不同的稟賦特質。' },
    ],
  },
  {
    id: 'dilemma-innovation',
    title: '思維固化與面臨轉型',
    subtitle: '老方法不管用了、遭遇人生瓶頸期、害怕變革陷入停滯',
    sealText: '變',
    icon: 'refresh',
    situation: '原有的業務或學習方式遇到了天花板，感覺思維被陳舊框架框死；面對新技術與新趨勢心生畏懼，想突破又不知從何入手。',
    remedyIntro: '法家革新家與道家大師教我們「世異備變」與「庖丁解牛」。時代變了規則就必須變，打破經驗主義神話，直面本質。',
    corePointIds: ['shi-yi-bei-bian', 'pao-ding-jie-niu', 'shou-zhu-dai-tu', 'zi-xiang-mao-dun'],
    prescriptions: [
      { pointId: 'shi-yi-bei-bian', actionPrompt: '打破路徑依賴：徹底承認過去的經驗已不適應當下，主動擁抱新工具，因時因地調整策略。' },
      { pointId: 'pao-ding-jie-niu', actionPrompt: '抽絲剝繭找骨架：不要被複雜龐大的新領域嚇退，靜心拆解其核心運轉關節，由表及裡。' },
      { pointId: 'shou-zhu-dai-tu', actionPrompt: '放下老樹樁：不要寄希望於過去的僥倖再次降臨，動手耕耘新的技能田地。' },
      { pointId: 'zi-xiang-mao-dun', actionPrompt: '梳理底層邏輯：檢查自己轉型規劃中是否有互相抵觸的盲點，確保戰略行動前後自洽。' },
    ],
  },
  {
    id: 'dilemma-character',
    title: '自我懷疑與志向迷茫',
    subtitle: '感覺人生缺乏意義、缺乏持之以恆的定力、容易在孤獨中動搖',
    sealText: '立',
    icon: 'scholar',
    situation: '常常問自己活著為了什麼，在物欲橫流中感到精神空虛；在無人監督時容易放縱墮落，事後又陷入深深的自責與迷茫。',
    remedyIntro: '儒家孟子、中庸與荀子教我們「浩然正氣」與「慎獨自省」。從起心動念處修養本心，建立堅如磐石的內心支柱。',
    corePointIds: ['hao-ran-zhi-qi', 'shen-du-zi-sheng', 'si-duan-zhi-xin', 'zhong-yong-zhi-dao'],
    prescriptions: [
      { pointId: 'shen-du-zi-sheng', actionPrompt: '不欺暗室的自律：在無人注視的角落恪守規矩，這會帶給你極其深厚堅固的內在自信。' },
      { pointId: 'hao-ran-zhi-qi', actionPrompt: '堅持日拱一卒的善行：去做你認為真正正確、符合良知的事，你的內心氣魄會一天天茁壯。' },
      { pointId: 'si-duan-zhi-xin', actionPrompt: '相信自己的潛能：同理與向善是每個人與生俱來的寶藏，用心呵護那顆原本純粹的本心。' },
      { pointId: 'zhong-yong-zhi-dao', actionPrompt: '致中和尋求自洽：不急於速成，也不隨意擺爛，在日常生活的每件小事中尋求平衡。' },
    ],
  },
]

// ── 輔助檢索與關係導航函數 ──────────────────────────────
export function getKnowledgePointById(id: string): KnowledgePoint | undefined {
  return KNOWLEDGE_POINTS.find(p => p.id === id)
}

export function getKnowledgePointsByCategory(category: KnowledgeCategory): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter(p => p.category === category)
}

export function getKnowledgePointsBySchool(schoolId: SchoolId): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter(p => p.schoolId === schoolId)
}

export function getKnowledgePointsByWork(workId: string): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter(p => p.quoteSource.workId === workId)
}

export function getKnowledgePointsByChapter(chapterId: string): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter(p => p.quoteSource.chapterId === chapterId)
}

export function getRelatedPoints(point: KnowledgePoint): KnowledgePoint[] {
  return point.relatedPointIds
    .map(id => getKnowledgePointById(id))
    .filter((p): p is KnowledgePoint => Boolean(p))
}

export function getLearningTrackById(trackId: string): LearningTrack | undefined {
  return LEARNING_TRACKS.find(t => t.id === trackId)
}

export function getDilemmaTopicById(dilemmaId: string): DilemmaTopic | undefined {
  return DILEMMA_TOPICS.find(d => d.id === dilemmaId)
}

export function getRandomKnowledgePoint(): KnowledgePoint {
  const idx = Math.floor(Math.random() * KNOWLEDGE_POINTS.length)
  return KNOWLEDGE_POINTS[idx]
}
