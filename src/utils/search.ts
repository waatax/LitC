import { works, chapters, passages, sentences } from '@/data/works'
import { getWorkDescription } from '@/data/workDescriptions'
import { getPassageReadingAid } from '@/data/readingAid'
import { schools } from '@/data/schools'
import type { SchoolId } from '@/types/content'

export type SearchResultType = 'sentence' | 'translation' | 'work' | 'chapter'

export interface SearchResult {
  id: string
  type: SearchResultType
  score: number
  workId: string
  workTitle: string
  chapterId?: string
  chapterTitle?: string
  schoolId: SchoolId
  schoolName: string
  matchField: string
  matchedText: string
  snippet: string
  targetSentenceId?: string
}

export interface SearchOptions {
  schoolFilter?: SchoolId | 'all'
  typeFilter?: 'all' | SearchResultType
  limit?: number
}

const S2T: Record<string, string> = {
  学: '學', 国: '國', 书: '書', 经: '經', 传: '傳', 论: '論', 语: '語', 礼: '禮', 乐: '樂',
  道: '道', 德: '德', 无: '無', 为: '為', 义: '義', 仁: '仁', 爱: '愛', 众: '眾', 万: '萬',
  东: '東', 西: '西', 后: '後', 汉: '漢', 战: '戰', 争: '爭', 军: '軍', 将: '將', 兵: '兵',
  说: '說', 问: '問', 闻: '聞', 见: '見', 知: '知', 时: '時', 来: '來', 处: '處', 长: '長',
  发: '發', 兴: '興', 与: '與', 于: '於', 里: '裡', 这: '這', 个: '個', 们: '們', 进: '進',
  实: '實', 应: '應', 历: '歷', 观: '觀', 关: '關', 系: '係', 体: '體', 现: '現', 权: '權',
  势: '勢', 赏: '賞', 罚: '罰', 治: '治', 乱: '亂', 圣: '聖', 君: '君', 师: '師', 庙: '廟',
  诗: '詩', 记: '記', 孙: '孫', 庄: '莊', 墨: '墨', 韩: '韓', 刘: '劉', 马: '馬', 门: '門',
  风: '風', 云: '雲', 龙: '龍', 鸟: '鳥', 鱼: '魚', 水: '水', 天: '天', 地: '地', 人: '人'
}

export function normalizeSearchText(text: string): string {
  return Array.from((text || '').normalize('NFKC').toLowerCase())
    .map(char => S2T[char] || char)
    .join('')
    .replace(/[\p{P}\p{S}\s]/gu, '')
}

function schoolName(id: SchoolId): string {
  return schools.find(school => school.id === id)?.name || id
}

export function highlightSnippet(text: string, rawQuery: string, maxLen = 90): string {
  if (!text) return ''
  const query = rawQuery.trim()
  const direct = text.toLowerCase().indexOf(query.toLowerCase())
  const normalizedQuery = normalizeSearchText(query)
  const approximate = normalizeSearchText(text).indexOf(normalizedQuery)
  const index = direct >= 0 ? direct : approximate
  if (index < 0) return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text
  const start = Math.max(0, index - 24)
  const end = Math.min(text.length, Math.max(index + query.length + 42, start + maxLen))
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

type IndexedItem = Omit<SearchResult, 'score' | 'snippet'> & { normalized: string; baseScore: number }
let index: IndexedItem[] | undefined

function buildIndex(): IndexedItem[] {
  if (index) return index
  const result: IndexedItem[] = []
  const workById = new Map(works.map(work => [work.id, work]))
  const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]))
  const passageById = new Map(passages.map(passage => [passage.id, passage]))
  const sentencesByPassage = new Map<string, typeof sentences>()
  for (const sentence of sentences) {
    const list = sentencesByPassage.get(sentence.passageId) || []
    list.push(sentence)
    sentencesByPassage.set(sentence.passageId, list)
  }
  const add = (item: Omit<IndexedItem, 'normalized'>) => {
    const normalized = normalizeSearchText(item.matchedText)
    if (normalized) result.push({ ...item, normalized })
  }

  for (const work of works) {
    const description = getWorkDescription(work.id)
    const common = { workId: work.id, workTitle: work.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId) }
    add({ ...common, id: `work-title-${work.id}`, type: 'work', matchField: '典籍', matchedText: [work.title, work.subtitle].filter(Boolean).join('｜'), baseScore: 100 })
    if (description) add({ ...common, id: `work-intro-${work.id}`, type: 'work', matchField: '典籍介紹', matchedText: [description.author, description.period, description.introduction, description.significance, ...description.keyAllusions].filter(Boolean).join('；'), baseScore: 64 })
  }

  for (const chapter of chapters) {
    const work = workById.get(chapter.workId)
    if (!work) continue
    add({ id: `chapter-${chapter.id}`, type: 'chapter', workId: work.id, workTitle: work.title, chapterId: chapter.id, chapterTitle: chapter.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId), matchField: '篇章', matchedText: [chapter.title, ...chapter.tags].join('；'), baseScore: 88 })
  }

  for (const passage of passages) {
    const chapter = chapterById.get(passage.chapterId)
    const work = chapter && workById.get(chapter.workId)
    if (!chapter || !work) continue
    const passageSentences = sentencesByPassage.get(passage.id) || []
    const aid = getPassageReadingAid(passage.id, passage.canonicalText, work.id, passageSentences)
    const common = { workId: work.id, workTitle: work.title, chapterId: chapter.id, chapterTitle: chapter.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId), targetSentenceId: passageSentences[0]?.id }
    add({ ...common, id: `passage-original-${passage.id}`, type: 'sentence', matchField: '原文', matchedText: passage.canonicalText, baseScore: 82 })
    add({ ...common, id: `passage-translation-${passage.id}`, type: 'translation', matchField: '白話文', matchedText: aid.translation, baseScore: 70 })
    add({ ...common, id: `passage-analysis-${passage.id}`, type: 'translation', matchField: '解析', matchedText: aid.analysis, baseScore: 66 })
  }

  for (const sentence of sentences) {
    const passage = passageById.get(sentence.passageId)
    const chapter = passage && chapterById.get(passage.chapterId)
    const work = chapter && workById.get(chapter.workId)
    if (!chapter || !work) continue
    const common = { workId: work.id, workTitle: work.title, chapterId: chapter.id, chapterTitle: chapter.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId), targetSentenceId: sentence.id }
    add({ ...common, id: `sentence-${sentence.id}`, type: 'sentence', matchField: '原文句', matchedText: sentence.canonicalText, baseScore: 84 })
    const structured = sentence.structuredTranslation
    if (structured) {
      add({ ...common, id: `sentence-aid-${sentence.id}`, type: 'translation', matchField: '逐句註解', matchedText: [structured.translation, structured.wordGlossary, structured.philosophicalNote, structured.writingApplication].filter(Boolean).join('\n'), baseScore: 62 })
    }
  }
  index = result
  return result
}

export function getSearchIndexStats() {
  const items = buildIndex()
  return {
    total: items.length,
    works: new Set(items.map(item => item.workId)).size,
    chapters: new Set(items.map(item => item.chapterId).filter(Boolean)).size,
    originalPassages: items.filter(item => item.id.startsWith('passage-original-')).length,
    passageTranslations: items.filter(item => item.id.startsWith('passage-translation-')).length,
    passageAnalyses: items.filter(item => item.id.startsWith('passage-analysis-')).length,
    sentences: items.filter(item => item.id.startsWith('sentence-') && item.type === 'sentence').length,
  }
}

export function searchContent(rawQuery: string, options: SearchOptions = {}): SearchResult[] {
  const normalizedQuery = normalizeSearchText(rawQuery)
  if (!normalizedQuery) return []
  const tokens = rawQuery.trim().split(/\s+/).map(normalizeSearchText).filter(Boolean)
  const { schoolFilter = 'all', typeFilter = 'all', limit = Number.POSITIVE_INFINITY } = options
  return buildIndex()
    .filter(item => (schoolFilter === 'all' || item.schoolId === schoolFilter) && (typeFilter === 'all' || item.type === typeFilter))
    .map(item => {
      const exact = item.normalized === normalizedQuery
      const contiguous = item.normalized.includes(normalizedQuery)
      const tokenMatch = tokens.length > 1 && tokens.every(token => item.normalized.includes(token))
      if (!exact && !contiguous && !tokenMatch) return undefined
      const score = item.baseScore + (exact ? 30 : contiguous ? 15 : 5) - Math.min(item.matchedText.length / 500, 8)
      return { ...item, score, snippet: highlightSnippet(item.matchedText, rawQuery) }
    })
    .filter((item): item is SearchResult & { baseScore: number; normalized: string } => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
