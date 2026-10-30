// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 六層內容資料模型
// ─────────────────────────────────────────────────

/** 文體記憶策略 */
export type GenreStrategy = 'rhythmic' | 'narrative' | 'argumentative' | 'parallel'

/** 學派 ID */
export type SchoolId = 'daoism' | 'legalism' | 'mohism' | 'confucianism' | 'literature' | 'military' | 'histories'

/** 複習評級 */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

// ── Layer 1: School ──────────────────────────────

export interface School {
  id: SchoolId
  name: string
  description: string
  icon: string        // emoji or icon identifier
  workIds: string[]
  thinkingModel?: string
  cognitivePearls?: string[]
}

export interface WorkDescription {
  workId: string
  title: string
  subtitle?: string
  schoolName: string
  period: string
  author: string
  keyAllusions: string[]
  significance: string
  introduction: string
  sources: { label: string; url?: string }[]
}

export interface Work {
  id: string
  schoolId: SchoolId
  title: string
  subtitle?: string
  genreStrategy: GenreStrategy
  sourceNote: string
  chapterIds: string[]
  totalChars: number
}

// ── Layer 3: Chapter ─────────────────────────────

export interface Chapter {
  id: string
  workId: string
  order: number
  title: string
  subtitle?: string
  genreStrategyOverride?: GenreStrategy
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number
  passageIds: string[]
  tags: string[]
}

// ── Layer 4: Passage ─────────────────────────────

export interface PassageReadingAid {
  passageId?: string
  translation: string
  analysis: string
  historicalContext?: string
  sourceRefs?: SourceReference[]
}

export interface Passage {
  id: string
  chapterId: string
  order: number
  canonicalText: string
  sentenceIds: string[]
  sourceRefs: SourceReference[]
  readingAid?: PassageReadingAid
}

export interface StructuredTranslation {
  translation: string        // 現代漢語意譯
  wordGlossary?: string      // 關鍵字詞釋義
  philosophicalNote?: string // 思想哲理/章旨析理
  writingApplication?: string// 寫作與修辭應用引導
}

// ── Layer 5: Sentence ────────────────────────────

export interface Sentence {
  id: string
  passageId: string
  order: number
  canonicalText: string
  chunks: Chunk[]        // inline for convenience
  translationHint?: string
  structuredTranslation?: StructuredTranslation
  allowedVariants?: AllowedVariant[]
  tags: string[]
}

// ── Layer 6: Chunk ───────────────────────────────

export interface Chunk {
  id: string
  sentenceId: string
  order: number
  text: string
  cue?: string
}

// ── Supporting types ─────────────────────────────

export interface SourceReference {
  label: string
  edition?: string
  location?: string
  accessedAt?: string
}

export interface AllowedVariant {
  text: string
  source: SourceReference
}

// ── UI / State types ─────────────────────────────

export type MasteryState =
  | 'not-started'
  | 'encountered'
  | 'initial-recall'
  | 'learning'
  | 'stable'
  | 'leech'
  | 'paused'

export interface ReviewCardState {
  sentenceId: string
  mastery: MasteryState
  dueAt?: string
  stability: number
  difficulty: number
  reviewCount: number
  lastReviewedAt?: string
}

export interface ReviewInput {
  cardId: string
  reviewedAt: string
  rating: ReviewRating
  answerMode: 'recall' | 'typing' | 'ordering' | 'recitation'
  hintsUsed: number
  responseMs?: number
  diffAccuracy?: number // Added for objective accuracy calibration
}

export type HintLevel = 'full' | 'keyword-mask' | 'first-char' | 'meaning-only' | 'blank'

export const HINT_LEVELS: { level: HintLevel; label: string; icon: string }[] = [
  { level: 'full',         label: '完整原文', icon: '📖' },
  { level: 'keyword-mask', label: '關鍵詞遮罩', icon: '🔲' },
  { level: 'first-char',   label: '首字提示', icon: '✏️' },
  { level: 'meaning-only', label: '句意提示', icon: '💡' },
  { level: 'blank',        label: '自行默寫', icon: '📝' },
]

export const GENRE_STRATEGY_META: Record<GenreStrategy, { label: string; icon: string; description: string }> = {
  rhythmic:      { label: '韻律格言', icon: '🎵', description: '對仗、韻律感強，適合首字提示與遮罩還原' },
  narrative:     { label: '寓言敘事', icon: '📜', description: '意象強烈，適合心像卡與故事骨架排序' },
  argumentative: { label: '論說結構', icon: '⚖️', description: '邏輯鏈為主，適合論證地圖與關鍵詞挖空' },
  parallel:      { label: '排比遞進', icon: '📊', description: '排比句式，適合模板代換與遞進排序' },
}


// ── 四維融通學習體系 (4 Pillars of Classical Learning) ─────────────

export type LearningPillar = 'understand' | 'enjoy' | 'memorize' | 'connect'

export interface LearningPillarMeta {
  key: LearningPillar
  title: string
  subtitle: string
  icon: string
  description: string
  color: string
}

export const LEARNING_PILLARS: Record<LearningPillar, LearningPillarMeta> = {
  understand: {
    key: 'understand',
    title: '理解',
    subtitle: '通曉文義 ‧ 格物致知',
    icon: 'book-open',
    description: '逐字逐句深解、語法句式剖析、字詞通假及歷史哲學義理。',
    color: 'var(--color-primary-600, #2c4f5e)',
  },
  enjoy: {
    key: 'enjoy',
    title: '享受',
    subtitle: '吟詠品味 ‧ 意境通神',
    icon: 'sparkle',
    description: '水墨古典意境、聲律節奏頓挫、名家朗讀與文字美學沉浸。',
    color: 'var(--color-gold-500, #c89b3c)',
  },
  memorize: {
    key: 'memorize',
    title: '背誦記憶',
    subtitle: '意群骨架 ‧ 熟讀成誦',
    icon: 'scholar',
    description: '階梯挖空遮罩、首字提示、意群拆解重組與艾賓浩斯間隔複習。',
    color: 'var(--color-sage-600, #4a7c59)',
  },
  connect: {
    key: 'connect',
    title: '連結',
    subtitle: '古今共鳴 ‧ 經世致用',
    icon: 'flame',
    description: '穿越千年的心靈對話、現代職場與生活處境投射、哲學抉擇反思。',
    color: 'var(--color-rust-600, #b24c36)',
  },
}

// ── 唐詩宋詞典藏資料模型 (Tang Poetry & Song Ci) ─────────────

export type PoemType = 'tang' | 'song'

export interface PoemItem {
  id: string
  type: PoemType
  title: string
  subtitle?: string
  cipai?: string       // 宋詞詞牌名，如《念奴嬌》、《水調歌頭》
  author: string
  dynasty: '唐代' | '五代' | '宋代'
  authorBio: string
  genre: string        // 體裁：五言絕句、七言律詩、歌行體、長調、中調、小令等
  theme: string        // 主題：豪放豁達、婉約深情、山水田園、邊塞金戈、詠史懷古、行旅思鄉等
  lines: string[]      // 詩詞原文各行
  vernacular: string[] // 逐句白話文精譯
  appreciation: string // 意境與美學賞析
  background: string   // 寫作時代背景與作者境遇
  keyVerses: string[]  // 千古名句（如「大江東去，浪淘盡」、「長風破浪會有時」）
  modernEcho: string   // 現代生命共鳴與人生處境投射
  rhythmNotes?: string // 韻律平仄、韻腳、朗讀節奏指引
  recitationTips?: string // 記憶階梯與背誦聯想要訣
}

// ── 古文闖關題庫資料模型 (Quest Bank & Stages) ─────────────

export type QuestType =
  | 'fill-in-blank'
  | 'word-meaning'
  | 'analysis'
  | 'context-syntax'
  | 'translation'
  | 'modern-link'

export interface QuestSource {
  workTitle: string
  chapterTitle: string
  author?: string
  dynasty?: string
}

export interface QuestQuestion {
  id: string              // 'quest-001' ~ 'quest-300'
  stageId: string         // 'stage-1' ~ 'stage-9'
  stageTitle: string      // '第一關：啟蒙發軔 ‧ 蒙養正性'
  difficulty: 1 | 2 | 3 | 4 | 5
  type: QuestType
  question: string        // 題幹
  options: string[]       // 4 個選項 [A, B, C, D]
  correctAnswer: number   // 0, 1, 2, 3
  source: QuestSource
  context: string         // 原文上下文 (完整段落前後文，提供全景視野)
  targetSentence?: string // 考點原文句
  vernacular: string      // 原文上下文及考點句之流暢白話通譯
  explanation: string     // 答案選項逐項剖析 (正確原因與干擾項辨析)
  analysis: string        // 深度析讀 (思想哲理、文學修辭、寫作技巧)
  modernLink?: string     // 現代生活連結 (對現代人學習、處事、心理狀態之反思)
  workId?: string         // 跳轉本庫典籍
  chapterId?: string
  passageId?: string
}

export interface QuestStage {
  id: string
  order: number
  title: string
  subtitle: string
  description: string
  targetCount: number
  unlockedByDefault?: boolean
  requiredStars?: number
  icon: string
  themeColor: string
  studyGuide?: {
    coreWisdom: string
    highYieldPoints: string[]
    commonTraps: string[]
    masteryTips: string
  }
}

// ── Bundles for dynamic chunk loading ─────────────

export interface ChapterBundle {
  workId: string
  chapter: Chapter
  passages: Passage[]
  sentences: Sentence[]
}

export interface WorkBundle {
  work: Work
  chapters: Chapter[]
  passages: Passage[]
  sentences: Sentence[]
}

