// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 諸子百家知識點網絡與研習學程
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
    description: '涵蓋道家自然無為、儒家天命心性、墨家兼愛節用等先秦核心哲學本體論與認識論。',
    color: '#5b8a72',
  },
  {
    id: 'conduct',
    name: '修己處世',
    sealText: '德',
    icon: 'heart',
    tagline: '安頓身心，淬鍊君子人格與從容氣度',
    description: '聚焦個人身心修持、應對世事紛擾、自省慎獨、守柔處弱與逆境從容之道。',
    color: '#b58d3d',
  },
  {
    id: 'strategy',
    name: '兵法謀略',
    sealText: '策',
    icon: 'sword',
    tagline: '洞察形勢，以智取勝與全勝思維',
    description: '收錄《孫子兵法》、《司馬法》等兵家精粹，探討全局視野、決策判斷與博弈心智。',
    color: '#a64b4b',
  },
  {
    id: 'governance',
    name: '治道政略',
    sealText: '政',
    icon: 'crown',
    tagline: '經世濟民，制度權衡與大局治理',
    description: '包含法家明法審令、儒家王道仁政、黃老循名責實與戰國改革家變法思維。',
    color: '#8b5e5e',
  },
  {
    id: 'allusions',
    name: '成語典故',
    sealText: '典',
    icon: 'sparkle',
    tagline: '寓言喻理，先秦語言智慧與文化母題',
    description: '匯聚庖丁解牛、莊周夢蝶、自相矛盾等傳世寓言，解析其背後蘊含的思辨邏輯。',
    color: '#4a6fa5',
  },
  {
    id: 'literature',
    name: '辭章風骨',
    sealText: '文',
    icon: 'feather',
    tagline: '文以載道，千古散文氣度與精神寄託',
    description: '包含桃花源記、曹劌論戰、古文名篇的章法風骨、寫作修辭與士人精神境界。',
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
    relatedPointIds: ['wu-wei-er-zhi', 'dao-fa-zi-ran', 'da-qiao-ruo-zhuo'],
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
    deepAnalysis: '「自然」在先秦古漢語中意為「自己如此」（自成其所）。老子構建了由人至地、由地至天、由天至道、由道至自然的形上學層級。它打破了天帝人格神對宇宙的主宰，確立了客觀規律與自由無待的理性哲學。',
    modernApplication: '【生活節奏與決策】尊重萬物與人際關係的生長規律，戒除急功近利的「拔苗助長」心態。無論育兒、個人學習或組織經營，順應天性與時機，往往比強力干預更為健全持久。',
    famousQuote: '人法地，地法天，天法道，道法自然。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-25',
      chapterTitle: '第二十五章：字之曰道',
    },
    keyInsights: [
      '戒除主觀妄作：放下人為的過度控制欲，尊重事物發展節奏。',
      '天地生生不息：最好的狀態是無須刻意維持的自然平衡。',
      '心境清虛自明：當心思不被私欲蒙蔽，自然能洞察事物真相。',
    ],
    reflectionQuestion: '你在生活中有哪些事情正因為「過度用力」、「人為干涉」而反受其害？如何回歸「道法自然」的從容？',
    relatedPointIds: ['shang-shan-ruo-shui', 'wu-wei-er-zhi', 'qi-wu-xiao-yao'],
    difficulty: 2,
  },

  // ── 3. 無為而治 ────────────────────────────────
  {
    id: 'wu-wei-er-zhi',
    title: '無為而治',
    tagline: '不妄作、不折騰，激發系統自身生生不息的秩序',
    pinyin: 'wú wéi ér zhì',
    category: 'governance',
    schoolId: 'daoism',
    primaryFigure: '老子',
    historicalPeriod: '春秋末期',
    summary: '「無為」並非消極怠惰或什麼都不做，而是指「不妄為、不以主觀私欲破壞客觀規律」。上位者減少擾民與繁文縟節，讓民眾與組織能各安其位、自主發展。',
    deepAnalysis: '道家政治哲學的精髓在於「道常無為而無不為」。在老子看來，法令越繁瑣、政令越朝令夕改，社會反而越混亂；聖人處無為之事，行不言之教，建立透明簡單的底線，給予萬物最大的自治空間。',
    modernApplication: '【現代領導力】高明的管理者不搞微觀管理（Micromanagement），而是搭好舞台與機制，激發成員的自主驅動力與自組織能力，達成「我無為而民自化，我好靜而民自正」。',
    famousQuote: '道常無為而無不為。侯王若能守之，萬物將自化。',
    quoteSource: {
      workId: 'dao-de-jing',
      workTitle: '道德經',
      chapterId: 'dao-de-jing_ch-37',
      chapterTitle: '第三十七章：道常無為',
    },
    keyInsights: [
      '治理在於去苛求：規則越繁雜，灰色地帶越多。',
      '善於放手賦能：優秀體系的自愈力與創造力遠超領導者個人智謀。',
      '無為而成大有：不居功、不爭權，功成而事遂，百姓皆謂我自然。',
    ],
    reflectionQuestion: '作為管理者或家長，你是否常因不信任而過度插手？如何轉換為「搭建環境、給予信任」的無為之智？',
    relatedPointIds: ['dao-fa-zi-ran', 'shang-shan-ruo-shui', 'fa-shu-shi'],
    crossSchoolComparison: {
      targetSchool: '法家',
      contrastIdea: '法家主張嚴法審令、以術馭下；老莊黃老則主張省刑去苛、清靜自化。漢初文景之治即以黃老無為成就盛世。',
    },
    difficulty: 2,
  },

  // ── 4. 庖丁解牛 ────────────────────────────────
  {
    id: 'pao-ding-jie-niu',
    title: '庖丁解牛',
    tagline: '依循事物客觀紋理，在繁複紛擾中游刃有餘',
    pinyin: 'páo dīng jiě niú',
    category: 'allusions',
    schoolId: 'daoism',
    primaryFigure: '莊子',
    historicalPeriod: '戰國中期',
    summary: '庖丁宰牛歷經十九年，刀刃依舊完好如新，原因在於他「依乎天理，批大郤，導大窾」，從不以刀刃硬砍牛骨，而是在骨肉筋絡的空隙中遊走，以此比喻養生與處世之道。',
    deepAnalysis: '莊子借寓言說明「養生主」之道：世間世俗是非紛擾如同牛體盤根錯節之骨肉，若硬碰硬（良庖歲更刀，割也；族庖月更刀，折也），精神必然勞頓耗損。唯有掌握客觀規律，以「無厚入有間」，方能保身長生。',
    modernApplication: '【解難藝術與心流體驗】面對盤根錯節的複雜難題，切忌盲目硬幹；先冷靜觀察其底層邏輯與內在縫隙，順應結構規律著手。進入沉浸專注的心流狀態，達到「官知止而神欲行」。',
    famousQuote: '以無厚入有間，恢恢乎其於遊刃必有餘地矣。',
    quoteSource: {
      workId: 'zhuangzi',
      workTitle: '莊子',
      chapterId: 'zhuangzi_ch-3',
      chapterTitle: '內篇・養生主',
    },
    keyInsights: [
      '以道馭技：技藝修煉到極致，本質是順應自然的哲學悟道。',
      '避其銳氣：不硬碰障礙骨節，尋找問題結構中的留白與縫隙。',
      '斂藏收鋒：功成之後「提刀而立，為之四顧，為之躊躇滿志，善刀而藏之」。',
    ],
    reflectionQuestion: '你當前最棘手的困境是什麼？你是在用刀刃硬砍骨頭，還是已經找到問題的「關節空隙」？',
    relatedPointIds: ['qi-wu-xiao-yao', 'shang-shan-ruo-shui'],
    difficulty: 1,
  },

  // ── 5. 齊物逍遙 ────────────────────────────────
  {
    id: 'qi-wu-xiao-yao',
    title: '齊物逍遙',
    tagline: '破除世俗偏見執著，讓心靈翱翔於無窮之境',
    pinyin: 'qí wù xiāo yáo',
    category: 'philosophy',
    schoolId: 'daoism',
    primaryFigure: '莊子',
    historicalPeriod: '戰國中期',
    summary: '莊子認為世俗之是非、美醜、貴賤、壽夭皆是相對而立的狹隘判斷。若能從天地大道俯瞰萬物，「天地與我並生，萬物與我為一」，便能打破自我執念，享受精神絕對的自在逍遙。',
    deepAnalysis: '《齊物論》與《逍遙遊》為莊子思想雙璧。「齊物」是認識論，解構世俗語言與名相的絕對性；「逍遙」是存在論，鯤鵬展翅九萬里，斥鷃笑之於蓬蒿，各有其天性。真正無待的逍遙在於「乘天地之正，而御六氣之辯，以遊無窮」。',
    modernApplication: '【心靈解脫與焦慮消除】在社群媒體與他人期待中，人往往被比較心與外在標籤捆綁。體悟齊物之理，放下對名利評價的過度在乎，回歸生命本真，獲得不為外物所役的真正自由。',
    famousQuote: '天地與我並生，而萬物與我為一。',
    quoteSource: {
      workId: 'zhuangzi',
      workTitle: '莊子',
      chapterId: 'zhuangzi_ch-2',
      chapterTitle: '內篇・齊物論',
    },
    keyInsights: [
      '破除對立分別：莫為世俗相對的是非得失耗費心力神氣。',
      '無待之自由：不依賴外在權勢或讚美，內在自足方能逍遙。',
      '坐忘以同大化：忘卻軀體與心機束縛，精神與宇宙同遊。',
    ],
    reflectionQuestion: '是什麼外在條件讓你覺得「必須得到它我才能快乐」？如果放下這份依賴，你的精神能立刻逍遙嗎？',
    relatedPointIds: ['pao-ding-jie-niu', 'dao-fa-zi-ran'],
    difficulty: 3,
  },

  // ── 6. 克己復禮 ────────────────────────────────
  {
    id: 'ke-ji-fu-li',
    title: '克己復禮',
    tagline: '約束自私私慾，使言語行動回歸於和諧與秩序',
    pinyin: 'kè jǐ fù lǐ',
    category: 'conduct',
    schoolId: 'confucianism',
    primaryFigure: '孔子',
    historicalPeriod: '春秋末期',
    summary: '剋制自我的私欲成見，使自身行為完全合乎公義與倫理準則。孔子視「克己復禮」為通往「仁」的根本修習法門，強調實踐仁德完全出於自主意志，而非受外在強加。',
    deepAnalysis: '顏淵問仁，子曰：「克己復禮為仁。一日克己復禮，天下歸仁焉。為仁由己，而由人乎哉？」並具體提出「非禮勿視，非禮勿聽，非禮勿言，非禮勿動」的日用工夫。禮不是僵化的教條，而是仁愛精神的外在秩序化顯現。',
    modernApplication: '【個人自律與公共素養】在誘惑繁多的現代社會中，自律即是自由。學會情緒管理、尊重邊界感，在言談互動中展現恰當的教養與分寸感，使人際交往如沐春風。',
    famousQuote: '克己復禮為仁。一日克己復禮，天下歸仁焉。為仁由己，而由人乎哉？',
    quoteSource: {
      workId: 'lun-yu',
      workTitle: '論語',
      chapterId: 'lun-yu_ch-12',
      chapterTitle: '顏淵第十二',
    },
    keyInsights: [
      '道德自主性：修身行善源自內心覺醒，非為給他人觀看。',
      '微小日用著手：由視、聽、言、動四端嚴格自察。',
      '以禮節情：情緒與慾望需要理性的引導與節制，而非盲目放縱。',
    ],
    reflectionQuestion: '你在情緒失控或貪圖私欲時，是否常傷害了身邊最親近的人？如何實踐「克己」找回內在秩序？',
    relatedPointIds: ['si-duan-zhi-xin', 'shen-du-zi-sheng', 'ge-wu-zhi-zhi'],
    crossSchoolComparison: {
      targetSchool: '道家',
      contrastIdea: '老子認為「夫禮者，忠信之薄，而亂之首」；孔子則視「禮」為文明傳承與人倫和諧之基石。',
    },
    difficulty: 1,
  },

  // ── 7. 四端之心 ────────────────────────────────
  {
    id: 'si-duan-zhi-xin',
    title: '四端之心',
    tagline: '人人皆具惻隱羞惡辭讓是非之萌芽，擴而充之可成聖賢',
    pinyin: 'sì duān zhī xīn',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '孟子',
    historicalPeriod: '戰國中期',
    summary: '孟子提出人性本善，每個人生來皆具四種先天的善端：惻隱之心（仁之端）、羞惡之心（義之端）、辭讓之心（禮之端）、是非之心（智之端）。如同火之始然、泉之始達，只要用心擴充呵護，人人皆可成為君子。',
    deepAnalysis: '孟子以「孺子將入於井」的生動論證指出：人們見到小孩快掉入井中，都會自然產生驚駭惻隱之心，這絕非為了討好其父母，也不是為了鄉里名譽，而是人性先驗的善性流露。儒家由此奠定了道德主體性與王道政治的人性論基礎。',
    modernApplication: '【同理心與品格成長】肯定每個人內心深處的善意與良知。在團隊與家庭中，多給予正面肯定與同理，悉心灌溉同情與正義感的萌芽，讓善的力量在社群中如星火燎原。',
    famousQuote: '惻隱之心，仁之端也；羞惡之心，義之端也；辭讓之心，禮之端也；是非之心，智之端也。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-3',
      chapterTitle: '公孫丑上',
    },
    keyInsights: [
      '善心先驗：同理心與良知是人類最根本的心理底色。',
      '重在擴充涵養：萌芽若不以教育與省察澆灌，亦可能枯萎泯滅。',
      '仁政基石：將推己及人的惻隱之心擴充至政治，便是天下歸心的仁政。',
    ],
    reflectionQuestion: '當你目睹他人的苦難時，內心泛起的同情心你是否及時轉化為了具體的善意行動？',
    relatedPointIds: ['ke-ji-fu-li', 'min-gui-jun-qing', 'hua-xing-qi-wei'],
    crossSchoolComparison: {
      targetSchool: '荀子（儒家後學）',
      contrastIdea: '孟子主張「人性本善」，重在擴充內在良知；荀子則主張「人之性惡，其善者偽也」，重在後天禮義教化與規範約束。',
    },
    difficulty: 2,
  },

  // ── 8. 化性起偽 ────────────────────────────────
  {
    id: 'hua-xing-qi-wei',
    title: '化性起偽',
    tagline: '人天生多私欲嗜利，唯有依靠後天禮法教化修煉成善',
    pinyin: 'huà xìng qǐ wěi',
    category: 'philosophy',
    schoolId: 'confucianism',
    primaryFigure: '荀子',
    historicalPeriod: '戰國末期',
    summary: '荀子認為人的先天本能充滿好利、嫉妒與口腹之欲，若放任本能發展必然導致爭奪混亂（性惡）。因此必須依靠後天聖王制定的禮樂制度與嚴格教化（偽，意為「人為修習」），轉化野蠻天性，成就文明品格。',
    deepAnalysis: '荀子在《性惡篇》深刻論證：「人之性惡，其善者偽也。」「枸木必將待檃栝烝矯然後直，鈍金必將待礱厲然後利。」此觀點奠定了先秦制度主義哲學，強調師法之化與禮樂制度的不可或缺，對後世法家與漢代政制產生了深遠影響。',
    modernApplication: '【習慣重塑與制度設計】承認人性中自私、懈怠與衝動的客觀存在，不對人性作空泛不切實際的浪漫假設。在組織管理中，依靠清晰公正的規則流程；在個人成長中，依靠刻意練習與環境約束重塑自律習慣。',
    famousQuote: '故枸木必將待檃栝烝矯然後直，鈍金必將待礱厲然後利；今人之性惡，必將待師法然後正，得禮義然後治。',
    quoteSource: {
      workId: 'xunzi',
      workTitle: '荀子',
      chapterId: 'xunzi_ch-23',
      chapterTitle: '性惡篇第二十三',
    },
    keyInsights: [
      '正視真實人性：不否認利益與慾望，但追求理性的秩序昇華。',
      '刻意練習（偽）：道德與學識皆非天生，乃日積月累後天磨礪而成。',
      '尊師重道與崇禮：制度與典範是引領大眾走向文明的燈塔。',
    ],
    reflectionQuestion: '你是否有想改卻一直改不掉的壞習慣？你是在單純依賴「道德自覺」，還是為自己建立了嚴格的「環境機制（檃栝）」？',
    relatedPointIds: ['si-duan-zhi-xin', 'ke-ji-fu-li', 'fa-shu-shi'],
    difficulty: 2,
  },

  // ── 9. 上兵伐謀 ────────────────────────────────
  {
    id: 'shang-bing-fa-mou',
    title: '上兵伐謀',
    tagline: '最高明的競爭是破壞對手的策略，不戰而屈人之兵',
    pinyin: 'shàng bīng fá móu',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '百戰百勝固然英勇，但殺敵一千自損八百；最高明的戰略是在敵人計謀成型之前將其化解（伐謀），其次是瓦解其同盟（伐交），再次是戰場野戰（伐兵），最下策才是攻打城池（攻城）。以最小代價取得最大勝利。',
    deepAnalysis: '孫子兵法的終極追求是「全勝」，即保全自身實力的同時贏得全局。攻城是不得已的消耗戰，需準備數月，士卒死傷過半。故善用兵者，屈人之兵而非戰也，拔人之城而非攻也，毀人之國而非久也，必以全爭於天下。',
    modernApplication: '【商業競爭與談判】在商戰中避免價格戰等消耗性廝殺；透過商業模式創新、生態位互補或戰略同盟，使競爭對手主動放棄敵對，達成共贏或壓倒性優勢。凡事謀定而後動，著眼長遠全勝。',
    famousQuote: '百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。故上兵伐謀，其次伐交，其次伐兵，其下攻城。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-3',
      chapterTitle: '謀攻篇第三',
    },
    keyInsights: [
      '全勝思維：勝利的衡量標準是整體成本效益，而非單純的戰術破壞。',
      '戰略維度先於戰術：在認知、外交與布局層面解決問題，勝過在執行層面血戰。',
      '戒貪戒急：不打無準備之仗，不攻耗損國力的堅城。',
    ],
    reflectionQuestion: '在你目前面臨的挑戰中，你是在打代價慘重的「攻城戰」，還是能在更高維度「伐謀伐交」？',
    relatedPointIds: ['zhi-ji-zhi-bi', 'fa-shu-shi'],
    difficulty: 2,
  },

  // ── 10. 知己知彼 ────────────────────────────────
  {
    id: 'zhi-ji-zhi-bi',
    title: '知己知彼',
    tagline: '客觀洞察自身優劣與對手虛實，方能立於不敗之地',
    pinyin: 'zhī jǐ zhī bǐ',
    category: 'strategy',
    schoolId: 'military',
    primaryFigure: '孫武',
    historicalPeriod: '春秋末期',
    summary: '「知己知彼，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。」決策的成敗取決於對情報資訊的掌握深度，以及對自身實力邊界的清醒認知。',
    deepAnalysis: '孫子把「知」視為戰爭勝負的首要前提。《孫子兵法》末篇專立《用間篇》，強調「先知者，不可取於鬼神，不可象於事，不可驗於度，必取於人，知敵之情者也」。戰勝不靠盲目自信或僥倖心理，而是靠精確的數據與形勢計算（廟算）。',
    modernApplication: '【資訊情報與自知之明】在投資與職業規劃中，既要調研行業趨勢（知彼），更要深諳自身能力圈與盲點（知己）。克服達克效應（自負），永遠保持客觀求實的心態。',
    famousQuote: '知己知彼，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。',
    quoteSource: {
      workId: 'art-of-war',
      workTitle: '孫子兵法',
      chapterId: 'art-of-war_ch-3',
      chapterTitle: '謀攻篇第三',
    },
    keyInsights: [
      '拒絕盲信幸運：先勝而後求戰，在動手前已算清所有勝算。',
      '清醒的自我認知：知道自己的極限在哪裡，絕不涉足無法承受的風險。',
      '深度的動態情報：資訊差是現代博弈中最致命的勝負手。',
    ],
    reflectionQuestion: '你是否曾因為「自以為很懂」或「低估對手」而遭受失敗？你目前最關鍵的資訊盲點是什麼？',
    relatedPointIds: ['shang-bing-fa-mou', 'ge-wu-zhi-zhi'],
    difficulty: 1,
  },

  // ── 11. 法術勢 ────────────────────────────────
  {
    id: 'fa-shu-shi',
    title: '法、術、勢兼顧',
    tagline: '制度公開、馭人精深、威權鞏固的三位一體組織治理論',
    pinyin: 'fǎ shù shì',
    category: 'governance',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國末期',
    summary: '韓非集法家大成，融匯商鞅之「法」（客觀公開的法律制度）、申不害之「術」（君主暗中操縱考察臣下的心計術數）與慎到之「勢」（依托職位與權力的威懾權柄），構建嚴密的君主極權管理學。',
    deepAnalysis: '韓非指出「抱法處勢則治，背法去勢則亂」。「法者，編著之圖籍，設之於官府，而布之於百姓者也」——制度必須公開透明；「術者，藏之於胸中，以偶眾端，而潛御群臣者也」——考評任免深不可測；「勢者，勝眾之資也」——無權位威勢，聖賢亦不能行令。三者缺一不可。',
    modernApplication: '【組織制度與權責分配】現代企業治理中，「法」即明確透明的規章制度與 KPI；「術」即科學的績效考評、激勵機制與人才辨識；「勢」即組織架構授予的職權與管理權威。三者協同，組織才能高效運轉。',
    famousQuote: '法莫如顯，而術不欲見。徒法不能以自行，勢者，勝眾之資也。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-43',
      chapterTitle: '定法第四十三',
    },
    keyInsights: [
      '制度制度化（法）：不依賴個人人治，建立客觀賞罰標準。',
      '考察精準化（術）：循名責實，聽其言觀其效，杜絕欺瞞。',
      '權威程序化（勢）：權力來自職位機制，而非個人情感糾纏。',
    ],
    reflectionQuestion: '你的團隊目前運轉不暢，是因為規矩不明顯（缺法）、考評機制失靈（缺術），還是管理權威缺乏支撐（缺勢）？',
    relatedPointIds: ['wu-wei-er-zhi', 'hua-xing-qi-wei', 'shi-yi-bei-bian'],
    difficulty: 3,
  },

  // ── 12. 世異備變 ────────────────────────────────
  {
    id: 'shi-yi-bei-bian',
    title: '世異則事異，事異則備變',
    tagline: '時代環境變遷，思維與政策必須因時制宜、與時俱進',
    pinyin: 'shì yì zé shì yì, shì yì zé bèi biàn',
    category: 'governance',
    schoolId: 'legalism',
    primaryFigure: '韓非',
    historicalPeriod: '戰國末期',
    summary: '時代在發展，社會條件已不同於古代，治理國家的措施就必須因勢革新，絕不能墨守成規。韓非以此痛斥那些盲目因循守舊、刻舟求劍的迂腐之士。',
    deepAnalysis: '韓非在《五蠹》中講述了著名的「守株待兔」故事：宋國農夫偶遇撞樹而死的兔子，便放下農具天天守在樹旁，結果淪為天下笑柄。韓非警示：「今欲以先王之政，治當世之民，皆守株之類也。」這是中國古代最鮮明犀利的歷史進化論。',
    modernApplication: '【創新思維與敏捷變革】昨日成功的經驗往往是今日失敗的陷阱。身處 AI 數位化高速演進的時代，必須勇於顛覆固有認知，因應市場與環境的變化迅速調整策略，切莫守株待兔。',
    famousQuote: '聖人不期脩古，不法常可，論世之事，因為之備。世異則事異，事異則備變。',
    quoteSource: {
      workId: 'han-fei-zi',
      workTitle: '韓非子',
      chapterId: 'han-fei-zi_ch-49',
      chapterTitle: '五蠹第四十九',
    },
    keyInsights: [
      '破除路徑依賴：昨天的解藥可能是今天的毒藥。',
      '實事求是：決策依據必須建立在當前客觀數據與現實之上。',
      '敏捷適應：唯一不變的就是「變化」本身。',
    ],
    reflectionQuestion: '你有哪些過往的「成功經驗」正在限制你適應當前的新趨勢？如何走出思維的「守株待兔」？',
    relatedPointIds: ['fa-shu-shi', 'zhi-ji-zhi-bi'],
    difficulty: 2,
  },

  // ── 13. 兼相愛交相利 ────────────────────────────────
  {
    id: 'jian-ai-jiao-li',
    title: '兼相愛，交相利',
    tagline: '平等無差別地愛護所有人，在互利共贏中消除衝突與戰亂',
    pinyin: 'jiān xiāng ài, jiāo xiāng lì',
    category: 'philosophy',
    schoolId: 'mohism',
    primaryFigure: '墨子',
    historicalPeriod: '戰國初期',
    summary: '墨子反對儒家以親疏遠近為標準的「有差等之愛」，主張天下人應當像愛護自己與親人一樣，平等愛護世人。而且這種愛絕非空談口號，必須落實為讓彼此都能獲得切實利益（交相利）。',
    deepAnalysis: '墨子身處戰國大魚吃小魚的殘酷兼併期，從社會底層手工業者視角出發，指出天下的禍亂皆起於「不相愛」。若「視人之國若視其國，視人之家若視其家，視人之身若視其身」，強便不會凌弱，眾便不會暴寡。墨家學派具有極強的實踐力與自我犧牲精神。',
    modernApplication: '【利他思維與商業共贏】真正的長期主義就是「利他即利己」。在商業合作中，唯有讓合作夥伴、客戶與社會大眾共同獲利（交相利），事業才能根深葉茂。',
    famousQuote: '天下兼相愛則治，交相惡則亂。愛人若愛其身，猶有不孝者乎？',
    quoteSource: {
      workId: 'mo-zi',
      workTitle: '墨子',
      chapterId: 'mo-zi_ch-14',
      chapterTitle: '兼愛上第十四',
    },
    keyInsights: [
      '打破親疏偏見：擴大同理心圈子，善待陌生人與弱者。',
      '義利統一：道德情懷必須落實為切實改善大眾生活的物質互利。',
      '和平主義（非攻）：反對一切非正義的侵略戰爭，身體力行守衛和平。',
    ],
    reflectionQuestion: '在你的工作合作中，你追求的是零和博弈（我贏你輸），還是創造增量的「交相利」？',
    relatedPointIds: ['ke-ji-fu-li', 'si-duan-zhi-xin'],
    crossSchoolComparison: {
      targetSchool: '儒家',
      contrastIdea: '孟子曾批評墨家「墨氏兼愛，是無父也」，認為墨家抹殺了孝順父母與親疏倫理的自然順序；墨家則批評儒家愛有差等過於自私狹隘。',
    },
    difficulty: 2,
  },

  // ── 14. 民貴君輕 ────────────────────────────────
  {
    id: 'min-gui-jun-qing',
    title: '民為貴，社稷次之，君為輕',
    tagline: '人民是大地的根本，國家的存在以保障民眾福祉為最高正當性',
    pinyin: 'mín wéi guì, shè jì cì zhī, jūn wéi qīng',
    category: 'governance',
    schoolId: 'confucianism',
    primaryFigure: '孟子',
    historicalPeriod: '戰國中期',
    summary: '孟子提出了先秦最震聾發聵的民本主義宣言：在政治價值層級中，人民最為尊貴，國家政權次之，統治者個人最為輕微。君王若殘暴虐民、喪失民心，便喪失了統治正當性。',
    deepAnalysis: '孟子進一步提出了「湯武革命」的合法性解釋：當齊宣王問商湯流放夏桀、武王討伐商紂是否算臣弒君時，孟子回答：「賊仁者謂之賊，賊義者謂之殘。殘賊之人，謂之一夫。聞誅一夫紂矣，未聞弒君也。」把暴君定性為殘害仁義的獨夫民賊，將人民福祉置於統治者權力之上。',
    modernApplication: '【用戶思維與公僕精神】在任何組織中，真正的價值來源是使用者、員工與底層大眾，而非位高權重的領導者個人意志。「以人為本」才是可持續發展的真正基石。',
    famousQuote: '民為貴，社稷次之，君為輕。是故得乎丘民而為天子。',
    quoteSource: {
      workId: 'meng-zi',
      workTitle: '孟子',
      chapterId: 'meng-zi_ch-14',
      chapterTitle: '盡心下第十四',
    },
    keyInsights: [
      '權力來源於人民：得民心者得天下，失民心者失天下。',
      '政治倫理的底線：統治的唯一正當性在於養民、安民與富民。',
      '平民尊嚴的肯定：古代專制浪潮中閃爍的早期民主光芒。',
    ],
    reflectionQuestion: '在你的團隊或產品決策中，是否真正把「用戶與基層同仁」放在首位，還是僅僅在迎合主管的個人喜好？',
    relatedPointIds: ['si-duan-zhi-xin', 'fa-shu-shi'],
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
    modernApplication: '【無人監督時的自律】在遠距辦公、獨自面對手機屏幕或無人監控的利益誘惑時，能否依然堅持道德底線與專注力？慎獨就是你與自己心靈的真實契約。',
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
    relatedPointIds: ['ke-ji-fu-li', 'da-qiao-ruo-zhuo'],
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
    relatedPointIds: ['shang-shan-ruo-shui', 'shen-du-zi-sheng', 'pao-ding-jie-niu'],
    difficulty: 2,
  },
]

// ── 四大進階修習學程（Learning Tracks） ───────────────────────
export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'track-peace',
    title: '澄懷觀道 ‧ 心靈逍遙修習程',
    subtitle: '在焦慮時代找回靈魂的從容與自由',
    sealText: '心',
    icon: 'heart',
    badgeColor: '#5b8a72',
    summary: '從《老子》的甘處卑下、道法自然，到《莊子》的庖丁解牛與精神逍遙。這是一條引導你卸下內卷焦慮、化解外界執念、涵養如水韌性的修心之旅。',
    estimatedMinutes: 25,
    targetAudience: '工作疲倦、常感焦慮迷茫、渴望內心平靜與精神自足的現代人',
    pointIds: ['shang-shan-ruo-shui', 'dao-fa-zi-ran', 'pao-ding-jie-niu', 'qi-wu-xiao-yao'],
    coreBenefit: '掌握「以柔克剛」、「順勢而為」與「化解執念」的心靈心法。',
  },
  {
    id: 'track-gentleman',
    title: '君子立德 ‧ 內外修為進階程',
    subtitle: '淬鍊道德自律與卓然君子氣度',
    sealText: '德',
    icon: 'scholar',
    badgeColor: '#b58d3d',
    summary: '由孔子的克己自律，深入孟子的四端善性，再至中庸的慎獨定力與荀子的化性起偽。全面掌握儒家由內在心性延伸至公共秩序的修齊治平之學。',
    estimatedMinutes: 30,
    targetAudience: '追求品格自律、想提升人際涵養與建立清明內在秩序的求道者',
    pointIds: ['ke-ji-fu-li', 'si-duan-zhi-xin', 'shen-du-zi-sheng', 'hua-xing-qi-wei'],
    coreBenefit: '建立強大的自我反省習慣，培養仁愛同理心與堂堂正正的浩然之氣。',
  },
  {
    id: 'track-strategy',
    title: '洞察全局 ‧ 先秦戰略謀略程',
    subtitle: '高維博弈、決策判斷與全勝思維',
    sealText: '策',
    icon: 'sword',
    badgeColor: '#a64b4b',
    summary: '融合兵家《孫子兵法》之「上兵伐謀」、「知己知彼」，與法家韓非之「世異備變」、「法術勢治理」。培養冷靜理性的戰略格局與穿透本質的決策力。',
    estimatedMinutes: 35,
    targetAudience: '創業者、管理者、職場領導者及熱愛戰略博弈思維的深度讀者',
    pointIds: ['shang-bing-fa-mou', 'zhi-ji-zhi-bi', 'shi-yi-bei-bian', 'fa-shu-shi'],
    coreBenefit: '跳脫戰術細節內耗，學會以全勝視角謀篇布局，因時革新適應多變環境。',
  },
  {
    id: 'track-debate',
    title: '諸子爭鳴 ‧ 哲學思辨交鋒程',
    subtitle: '探討人性、秩序與大同的千古論辯',
    sealText: '辯',
    icon: 'scale',
    badgeColor: '#5e6e8b',
    summary: '先秦思想最精彩處在於百家辯難。孟子之「性善」與荀子之「性惡」、墨家之「兼愛」與儒家之「差等」、老莊之「無為」與法家之「嚴刑」，在此激盪碰撞。',
    estimatedMinutes: 30,
    targetAudience: '喜愛哲學探討、思辨邏輯與跨觀點深度碰撞的進階學習者',
    pointIds: ['si-duan-zhi-xin', 'hua-xing-qi-wei', 'jian-ai-jiao-li', 'min-gui-jun-qing', 'wu-wei-er-zhi'],
    coreBenefit: '打破單一思維盲點，學會從多個學派立場客觀審視世間複雜難題。',
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

export function getRandomKnowledgePoint(): KnowledgePoint {
  const idx = Math.floor(Math.random() * KNOWLEDGE_POINTS.length)
  return KNOWLEDGE_POINTS[idx]
}
