// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 六層內容資料模型
// ─────────────────────────────────────────────────

/** 文體記憶策略 */
export type GenreStrategy = 'rhythmic' | 'narrative' | 'argumentative' | 'parallel'

/** 學派 ID */
export type SchoolId = 'daoism' | 'legalism' | 'mohism'

/** 複習評級 */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

// ── Layer 1: School ──────────────────────────────

export interface School {
  id: SchoolId
  name: string
  description: string
  icon: string        // emoji or icon identifier
  workIds: string[]
}

// ── Layer 2: Work ────────────────────────────────

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
  genreStrategyOverride?: GenreStrategy
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number
  passageIds: string[]
  tags: string[]
}

// ── Layer 4: Passage ─────────────────────────────

export interface Passage {
  id: string
  chapterId: string
  order: number
  canonicalText: string
  sentenceIds: string[]
  sourceRefs: SourceReference[]
}

// ── Layer 5: Sentence ────────────────────────────

export interface Sentence {
  id: string
  passageId: string
  order: number
  canonicalText: string
  chunks: Chunk[]        // inline for convenience
  translationHint?: string
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
