import type { IconName } from '@/components/ClassicalIcon.vue'
import type { SchoolId } from '@/types/content'

export interface ThematicRecommendation {
  workId: string
  workTitle: string
  schoolId: SchoolId
  highlightChapterId: string
  chapterTitle: string
  reason: string
  famousQuote: string
  estimatedMinutes: number
  difficulty: 1 | 2 | 3 | 4 | 5
}

export interface ThematicTopic {
  id: string
  title: string
  eyebrow: string
  summary: string
  sealText: string
  icon: IconName
  accentColor: string
  colorClass: string
  tags: string[]
  bestFor: string
  keyQuestions: string[]
  compareThemeId?: string
  quickSearchKeyword: string
  recommendations: ThematicRecommendation[]
}

export const THEMATIC_TOPICS: ThematicTopic[] = [
  {
    id: 'inner-peace',
    title: '安頓身心・逍遙處世',
    eyebrow: '虛室生白，吉祥止止',
    summary: '在喧囂塵世與焦慮壓力中，尋求心靈的清明澄澈。體悟道法自然之妙，放下執著分別，涵養如水般柔韌沉靜的生命格局。',
    sealText: '安',
    icon: 'heart',
    accentColor: '#5b8a72',
    colorClass: 'topic-peace',
    tags: ['順應自然', '清靜無為', '心靈自由', '逆境安頓', '大智若愚'],
    bestFor: '心神浮躁、工作疲倦、渴望找回生活步調與精神從容的現代人',
    keyQuestions: [
      '面對外在不確定與挫折時，如何保持內心的沉靜與韌性？',
      '老子為什麼說「上善若水」？柔軟如何能夠克制剛強？',
      '莊子如何在看似無用的事物中，發現浩瀚無窮的大用？',
    ],
    compareThemeId: 'dao',
    quickSearchKeyword: '逍遙 自然',
    recommendations: [
      {
        workId: 'dao-de-jing',
        workTitle: '《道德經》',
        schoolId: 'daoism',
        highlightChapterId: 'dao-de-jing_ch-8',
        chapterTitle: '第八章：上善若水',
        reason: '以水為師，處眾人之所惡，故幾於道。體會不爭而莫能與之爭的高妙境界。',
        famousQuote: '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。',
        estimatedMinutes: 2,
        difficulty: 2,
      },
      {
        workId: 'zhuangzi',
        workTitle: '《莊子》',
        schoolId: 'daoism',
        highlightChapterId: 'zhuangzi_ch-1',
        chapterTitle: '逍遙遊',
        reason: '打破常人認知的「小大之辨」，讓心靈乘雲氣、御飛龍，馳騁於無窮宇宙。',
        famousQuote: '鷦鷯巢於深林，不過一枝；偃鼠飲河，不過滿腹。',
        estimatedMinutes: 6,
        difficulty: 4,
      },
      {
        workId: 'gu-wen-guan-zhi',
        workTitle: '《古文觀止》',
        schoolId: 'literature',
        highlightChapterId: 'gu-wen-guan-zhi_ch-57',
        chapterTitle: '桃花源記',
        reason: '陶淵明為世人構築的心靈避風港，在山重水複處開啟理想之鄉。',
        famousQuote: '忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。',
        estimatedMinutes: 5,
        difficulty: 3,
      },
      {
        workId: 'cai-gen-tan',
        workTitle: '《菜根譚》',
        schoolId: 'literature',
        highlightChapterId: 'cai-gen-tan_ch-1',
        chapterTitle: '前集・第一卷',
        reason: '揉合儒道禪三家處世真詮，以清峻文字拂去名韁利鎖之煩惱。',
        famousQuote: '風來疏竹，風過而竹不留聲；雁度寒潭，雁去而潭不留影。',
        estimatedMinutes: 4,
        difficulty: 2,
      },
    ],
  },
  {
    id: 'noble-character',
    title: '修身立德・君子格局',
    eyebrow: '大學之道，在明明德',
    summary: '儒家千百年傳承的立身根本。從自我誠意正心做起，以仁厚為本、禮義為度，在日常起居待人接物中，淬鍊篤實溫潤的君子風範。',
    sealText: '修',
    icon: 'scholar',
    accentColor: '#b58d3d',
    colorClass: 'topic-character',
    tags: ['克己復禮', '慎獨存心', '知行合一', '仁者愛人', '浩然正氣'],
    bestFor: '追求人格自律、人際相處和睦、重視道德情操與自我成長者',
    keyQuestions: [
      '何謂「仁」與「禮」？如何在群體中既成全自己也成全他人？',
      '君子「不患人之不己知，患不知人也」展現何等豁達胸懷？',
      '如何透過慎獨修養，在無人監督之處仍持守初心？',
    ],
    compareThemeId: 'ren-li',
    quickSearchKeyword: '修身 君子',
    recommendations: [
      {
        workId: 'lun-yu',
        workTitle: '《論語》',
        schoolId: 'confucianism',
        highlightChapterId: 'lun-yu_ch-1',
        chapterTitle: '學而篇',
        reason: '儒學總綱，探討好學樂群、孝悌修德、知人自守的人生第一課。',
        famousQuote: '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？」',
        estimatedMinutes: 4,
        difficulty: 2,
      },
      {
        workId: 'da-xue',
        workTitle: '《大學》',
        schoolId: 'confucianism',
        highlightChapterId: 'da-xue_ch-1',
        chapterTitle: '經一章',
        reason: '三綱領（明明德、親民、止於至善）與八條目之始，大人之學的基石。',
        famousQuote: '物格而後知至，知至而後意誠，意誠而後心正，心正而後身修。',
        estimatedMinutes: 3,
        difficulty: 3,
      },
      {
        workId: 'zhong-yong',
        workTitle: '《中庸》',
        schoolId: 'confucianism',
        highlightChapterId: 'zhong-yong_ch-1',
        chapterTitle: '天命之謂性',
        reason: '發明心性之奧，探討極高明而道中庸的至美平衡哲學。',
        famousQuote: '喜怒哀樂之未發，謂之中；發而皆中節，謂之和。',
        estimatedMinutes: 3,
        difficulty: 3,
      },
      {
        workId: 'meng-zi',
        workTitle: '《孟子》',
        schoolId: 'confucianism',
        highlightChapterId: 'meng-zi_ch-3',
        chapterTitle: '公孫丑上',
        reason: '孟子浩然之氣與人皆有不忍人之心（四端說）的最核心表述。',
        famousQuote: '人皆有不忍人之心……無惻隱之心，非人也；無羞惡之心，非人也。',
        estimatedMinutes: 5,
        difficulty: 4,
      },
    ],
  },
  {
    id: 'leadership-strategy',
    title: '謀略決策・全局視野',
    eyebrow: '運籌帷幄，決勝千里',
    summary: '古代統帥、相國與縱橫策士的智慧結晶。以清醒客觀之眼洞察時勢，審度利害，掌握兵法全勝與法治制度的最高樞紐。',
    sealText: '謀',
    icon: 'crown',
    accentColor: '#a64b4b',
    colorClass: 'topic-strategy',
    tags: ['知彼知己', '全局思考', '借勢造局', '審時度勢', '以智克敵'],
    bestFor: '組織領導者、專案管理者、面臨重大人生決策與策略規劃者',
    keyQuestions: [
      '孫武為何提出「不戰而屈人之兵，善之善者也」？全勝的哲學是什麼？',
      '如何克服資訊不對稱與自負盲點，做出冷靜科學的決策？',
      '在複雜多變的競爭環境中，如何變法革新、因應形勢？',
    ],
    compareThemeId: 'military',
    quickSearchKeyword: '謀略 兵法 決策',
    recommendations: [
      {
        workId: 'art-of-war',
        workTitle: '《孫子兵法》',
        schoolId: 'military',
        highlightChapterId: 'art-of-war_ch-3',
        chapterTitle: '謀攻篇',
        reason: '兵學最高戰略宣言：上兵伐謀，其次伐交，以最小代價取得最大全勝。',
        famousQuote: '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。',
        estimatedMinutes: 4,
        difficulty: 3,
      },
      {
        workId: 'han-fei-zi',
        workTitle: '《韓非子》',
        schoolId: 'legalism',
        highlightChapterId: 'han-fei-zi_ch-49',
        chapterTitle: '五蠹',
        reason: '法家集大成之論，破除因循守舊之迷思，主張審度現實之制。',
        famousQuote: '聖人不期脩古，不法常可，論世之事，因為之備。',
        estimatedMinutes: 6,
        difficulty: 4,
      },
      {
        workId: 'jian-zhu-ke-shu',
        workTitle: '《諫逐客書》',
        schoolId: 'legalism',
        highlightChapterId: 'jian-zhu-ke-shu_ch-1',
        chapterTitle: '全文',
        reason: '李斯以宏博格局力陳包容天下人才之重，辭鋒雄健，氣勢磅礴。',
        famousQuote: '泰山不讓土壤，故能成其大；河海不擇細流，故能就其深。',
        estimatedMinutes: 5,
        difficulty: 3,
      },
      {
        workId: 'si-ma-fa',
        workTitle: '《司馬法》',
        schoolId: 'military',
        highlightChapterId: 'si-ma-fa_ch-1',
        chapterTitle: '仁本',
        reason: '將軍事置於仁德正義的根本之上，體現止戈為武的文明高度。',
        famousQuote: '古者以仁為本，以義治之之謂正。國雖大，好戰必亡；天下雖安，忘戰必危。',
        estimatedMinutes: 4,
        difficulty: 4,
      },
    ],
  },
  {
    id: 'literary-masterpieces',
    title: '辭章風骨・千古絕唱',
    eyebrow: '文以載道，藻麗千秋',
    summary: '漢唐宋明文人騷客的心靈寫照。山川丘壑的浩然之氣、家國情懷的慷慨長嘆、宴飲別離的深摯真情，字字珠璣，聲律協暢。',
    sealText: '文',
    icon: 'feather',
    accentColor: '#4a6fa5',
    colorClass: 'topic-literature',
    tags: ['駢散結合', '山水言志', '慷慨悲憫', '古文觀止', '美文朗誦'],
    bestFor: '語文與文學愛好者、希望提升寫作修辭技巧、陶冶審美心靈者',
    keyQuestions: [
      '古人如何透過山水景物之描摹，投射對人生離合與宇宙永恆的感慨？',
      '賦體與散文的音律對仗，如何營造朗朗上口、百讀不厭的節奏美？',
      '名篇中「先天下之憂而憂」與「不以物喜，不以己悲」的人格底色從何而來？',
    ],
    quickSearchKeyword: '古文觀止 名篇',
    recommendations: [
      {
        workId: 'gu-wen-guan-zhi',
        workTitle: '《古文觀止》',
        schoolId: 'literature',
        highlightChapterId: 'gu-wen-guan-zhi_ch-57',
        chapterTitle: '桃花源記',
        reason: '陶淵明曠世名作，文字質樸清新，寄寓對純樸和睦世界的無限神往。',
        famousQuote: '土地平曠，屋舍儼然，有良田、美池、桑竹之屬。阡陌交通，雞犬相聞。',
        estimatedMinutes: 5,
        difficulty: 3,
      },
      {
        workId: 'gu-wen-guan-zhi',
        workTitle: '《古文觀止》',
        schoolId: 'literature',
        highlightChapterId: 'gu-wen-guan-zhi_ch-8',
        chapterTitle: '曹劌論戰',
        reason: '《左傳》敘事名篇，以極精練之筆墨展現戰役全局與心理博弈。',
        famousQuote: '夫戰，勇氣也。一鼓作氣，再而衰，三而竭。彼竭我盈，故克之。',
        estimatedMinutes: 4,
        difficulty: 3,
      },
      {
        workId: 'shi-jing',
        workTitle: '《詩經》',
        schoolId: 'confucianism',
        highlightChapterId: 'shi-jing_ch-1',
        chapterTitle: '關雎',
        reason: '中國風雅詩教之發軔，哀而不傷，樂而不淫，純真溫厚。',
        famousQuote: '關關雎鳩，在河之洲。窈窕淑女，君子好逑。',
        estimatedMinutes: 3,
        difficulty: 2,
      },
      {
        workId: 'shiji',
        workTitle: '《史記》',
        schoolId: 'histories',
        highlightChapterId: 'shiji_ch-1',
        chapterTitle: '史記精選',
        reason: '太史公無韻之離騷，摹寫人物神態栩栩如生，歷史風雲如在眼前。',
        famousQuote: '大行不顧細謹，大禮不辭小讓。如今人方為刀俎，我為魚肉。',
        estimatedMinutes: 6,
        difficulty: 4,
      },
    ],
  },
  {
    id: 'philosophic-debates',
    title: '諸子爭鳴・哲學思辨',
    eyebrow: '百家並起，百花齊放',
    summary: '先秦思想最壯闊的黃金時代。孟荀論人性善惡、墨儒辨兼愛親疏、法儒爭德治法治、道家跳脫名相是非。激盪出華夏思維最深層的火花。',
    sealText: '辨',
    icon: 'compare',
    accentColor: '#8a6e5b',
    colorClass: 'topic-debate',
    tags: ['人性善惡', '義利之辨', '兼愛平權', '法德之爭', '名實天道'],
    bestFor: '喜愛批判性思維、邏輯推理、對哲學本體論與認識論抱有濃厚好奇者',
    keyQuestions: [
      '孟子主張人性本善，荀子力主性惡，兩者究竟是在哪一個層次上分歧？',
      '墨子的「兼愛」與儒家的「仁愛」，對平民與社會公義有何不同詮釋？',
      '韓非如何批判儒家法先王的理想，開創法術勢嚴密的政治哲學？',
    ],
    compareThemeId: 'governance',
    quickSearchKeyword: '人性 墨子 荀子',
    recommendations: [
      {
        workId: 'xunzi',
        workTitle: '《荀子》',
        schoolId: 'confucianism',
        highlightChapterId: 'xunzi_ch-23',
        chapterTitle: '性惡篇',
        reason: '力駁孟子性善論，確立「人之性惡，其善者偽也」，闡明禮義教化之必然。',
        famousQuote: '人之性惡，其善者偽也。今人之性，生而有好利焉。',
        estimatedMinutes: 6,
        difficulty: 5,
      },
      {
        workId: 'mo-zi',
        workTitle: '《墨子》',
        schoolId: 'mohism',
        highlightChapterId: 'mo-zi_ch-14',
        chapterTitle: '兼愛上',
        reason: '以平民視角直指戰亂禍根在於不相愛，倡導平等兼愛與互利共贏。',
        famousQuote: '若使天下兼相愛，愛人若愛其身，猶有不孝者乎？',
        estimatedMinutes: 5,
        difficulty: 3,
      },
      {
        workId: 'zhuangzi',
        workTitle: '《莊子》',
        schoolId: 'daoism',
        highlightChapterId: 'zhuangzi_ch-2',
        chapterTitle: '齊物論',
        reason: '解構人類語言與是非立論之局限，抵達「莫若以明」的天籟境界。',
        famousQuote: '物無非彼，物無非是。自彼則不見，自知則知之。故曰彼出於是，是亦因彼。',
        estimatedMinutes: 7,
        difficulty: 5,
      },
      {
        workId: 'shang-jun-shu',
        workTitle: '《商君書》',
        schoolId: 'legalism',
        highlightChapterId: 'shang-jun-shu_ch-1',
        chapterTitle: '更法',
        reason: '戰國激進變法論，揭櫫「治世不一道，便國不法古」的銳利洞見。',
        famousQuote: '治世不一道，便國不法古。故湯武不循古而王，夏殷不易禮而亡。',
        estimatedMinutes: 5,
        difficulty: 4,
      },
    ],
  },
  {
    id: 'daily-wisdom',
    title: '晨昏涵泳・日常金句',
    eyebrow: '字字珠璣，日日新知',
    summary: '無需冗長篇幅，以簡短精悍的格言警句切入。晨起誦讀一句，洗滌心智；夜闌靜思一句，溫故知新。專為碎片化時間打造的無痛入門徑路。',
    sealText: '晨',
    icon: 'today',
    accentColor: '#c9a96e',
    colorClass: 'topic-daily',
    tags: ['3分鐘速讀', '初學入門', '朗朗上口', '格言金句', '每日持修'],
    bestFor: '初學者、通勤族、時間有限但希望每天持續熏陶經典文脈者',
    keyQuestions: [
      '如何用每天三分鐘的時間，建立與古聖先賢心靈對話的習慣？',
      '經典中哪些精煉句子最能撫慰心緒、指引日常生活方向？',
      '如何透過有聲朗讀，自然而然體會古文抑揚頓挫的音樂美？',
    ],
    quickSearchKeyword: '名句 菜根譚 格言',
    recommendations: [
      {
        workId: 'cai-gen-tan',
        workTitle: '《菜根譚》',
        schoolId: 'literature',
        highlightChapterId: 'cai-gen-tan_ch-2',
        chapterTitle: '前集・第二卷',
        reason: '文字對仗精妙，三言兩語道盡為人處事之真味，極適合晨起清讀。',
        famousQuote: '寵辱不驚，閑看庭前花開花落；去留無意，漫隨天外雲卷雲舒。',
        estimatedMinutes: 3,
        difficulty: 1,
      },
      {
        workId: 'dao-de-jing',
        workTitle: '《道德經》',
        schoolId: 'daoism',
        highlightChapterId: 'dao-de-jing_ch-1',
        chapterTitle: '第一章：道可道',
        reason: '五千言玄妙之門，字字精純，反覆吟誦如泉水洗心。',
        famousQuote: '道可道，非常道；名可名，非常名。無名天地之始；有名萬物之母。',
        estimatedMinutes: 2,
        difficulty: 2,
      },
      {
        workId: 'lun-yu',
        workTitle: '《論語》',
        schoolId: 'confucianism',
        highlightChapterId: 'lun-yu_ch-2',
        chapterTitle: '為政篇',
        reason: '孔子論修德、孝親、立信的親切言談，字字皆是平實的生活智慧。',
        famousQuote: '溫故而知新，可以為師矣。學而不思則罔，思而不學則殆。',
        estimatedMinutes: 3,
        difficulty: 2,
      },
      {
        workId: 'da-xue',
        workTitle: '《大學》',
        schoolId: 'confucianism',
        highlightChapterId: 'da-xue_ch-3',
        chapterTitle: '傳2章：新民',
        reason: '商湯盤銘之警策名言，勉勵人日日自新、精進不輟。',
        famousQuote: '茍日新，日日新，又日新。作新民。',
        estimatedMinutes: 2,
        difficulty: 2,
      },
    ],
  },
]

export function getAllThematicTopics(): ThematicTopic[] {
  return THEMATIC_TOPICS
}

export function getTopicById(id: string): ThematicTopic | undefined {
  return THEMATIC_TOPICS.find((t) => t.id === id)
}

export function getTopicsForWork(workId: string): ThematicTopic[] {
  return THEMATIC_TOPICS.filter((t) => t.recommendations.some((r) => r.workId === workId))
}
