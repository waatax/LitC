import { catalogWorks as works, catalogChapters as chapters } from '@/data/catalog'
import { getWorkDescription } from '@/data/catalogApi'
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

export function normalizeSearchText(text: string): string {
  return (text || '').normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]/gu, '')
}

function schoolName(id: SchoolId): string {
  return schools.find(school => school.id === id)?.name || id
}

export function highlightSnippet(text: string, rawQuery: string, maxLen = 90): string {
  if (!text) return ''
  const index = text.toLowerCase().indexOf(rawQuery.trim().toLowerCase())
  if (index < 0) return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text
  const start = Math.max(0, index - 24)
  const end = Math.min(text.length, Math.max(index + rawQuery.length + 42, start + maxLen))
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

type IndexedItem = Omit<SearchResult, 'score' | 'snippet'> & { normalized: string; baseScore: number }
let index: IndexedItem[] | undefined

function buildIndex(): IndexedItem[] {
  if (index) return index
  const result: IndexedItem[] = []
  const workById = new Map(works.map(work => [work.id, work]))
  const add = (item: Omit<IndexedItem, 'normalized'>) => {
    const normalized = normalizeSearchText(item.matchedText)
    if (normalized) result.push({ ...item, normalized })
  }

  for (const work of works) {
    const description = getWorkDescription(work.id)
    const common = { workId: work.id, workTitle: work.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId) }
    add({ ...common, id: `work-${work.id}`, type: 'work', matchField: '典籍', matchedText: [work.title, work.subtitle, description?.author, description?.introduction].filter(Boolean).join('・'), baseScore: 100 })
  }

  for (const chapter of chapters) {
    const work = workById.get(chapter.workId)
    if (!work) continue
    add({ id: `chapter-${chapter.id}`, type: 'chapter', workId: work.id, workTitle: work.title, chapterId: chapter.id, chapterTitle: chapter.title, schoolId: work.schoolId, schoolName: schoolName(work.schoolId), matchField: '篇章', matchedText: [chapter.title, ...(chapter.tags || [])].join('・'), baseScore: 88 })
  }

  index = result
  return result
}

export function getSearchIndexStats() {
  const items = buildIndex()
  return { total: items.length, works: works.length, chapters: chapters.length, originalPassages: 0, passageTranslations: 0, passageAnalyses: 0, sentences: 0 }
}

export function searchContent(rawQuery: string, options: SearchOptions = {}): SearchResult[] {
  const normalizedQuery = normalizeSearchText(rawQuery)
  if (!normalizedQuery) return []
  const { schoolFilter = 'all', typeFilter = 'all', limit = Number.POSITIVE_INFINITY } = options
  return buildIndex()
    .filter(item => (schoolFilter === 'all' || item.schoolId === schoolFilter) && (typeFilter === 'all' || item.type === typeFilter))
    .filter(item => item.normalized.includes(normalizedQuery))
    .map(item => ({ ...item, score: item.baseScore + (item.normalized === normalizedQuery ? 30 : 15), snippet: highlightSnippet(item.matchedText, rawQuery) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
