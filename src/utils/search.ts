// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 全站全內文搜尋引擎
// ─────────────────────────────────────────────────
import { works, chapters, passages, sentences } from '@/data/works'
import { getWorkDescription } from '@/data/workDescriptions'
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
  matchField: string // e.g. '原文', '譯文', '關鍵字', '哲思解析', '書名', '篇名', '導讀'
  matchedText: string
  snippet: string
  targetSentenceId?: string
}

export interface SearchOptions {
  schoolFilter?: SchoolId | 'all'
  typeFilter?: 'all' | 'sentence' | 'translation' | 'work' | 'chapter'
  limit?: number
}

// 簡易常態化繁簡轉換對照表 (涵蓋古籍常見簡繁差異)
const SIMPLIFIED_TO_TRADITIONAL_MAP: Record<string, string> = {
  '经': '經', '论': '論', '语': '語', '学': '學', '孟': '孟', '庄': '莊', '孙': '孫',
  '法': '法', '墨': '墨', '韩': '韓', '非': '非', '战': '戰', '国': '國', '策': '策',
  '史': '史', '记': '記', '左': '左', '传': '傳', '书': '書', '礼': '禮', '易': '易',
  '诗': '詩', '无': '無', '为': '為', '爱': '愛', '兼': '兼', '德': '德', '道': '道',
  '义': '義', '仁': '仁', '智': '智', '信': '信', '圣': '聖', '人': '人', '君': '君',
  '子': '子', '兵': '兵', '势': '勢', '谋': '謀', '攻': '攻', '胜': '勝', '阴': '陰',
  '阳': '陽', '天': '天', '地': '地', '万': '萬', '物': '物', '修': '修', '身': '身',
  '齐': '齊', '家': '家', '治': '治', '平': '平', '乐': '樂', '气': '氣',
  '视': '視', '听': '聽', '言': '言', '动': '動', '尽': '盡', '诚': '誠', '明': '明'
}

/** 繁簡體與標點符號正規化 */
export function normalizeSearchText(text: string): string {
  if (!text) return ''
  let result = text.toLowerCase()
  // 繁簡對應轉換
  let converted = ''
  for (const char of result) {
    converted += SIMPLIFIED_TO_TRADITIONAL_MAP[char] || char
  }
  // 移除常見標點符號
  return converted.replace(/[「」『』""''\s,.\!?，。！？；：、\(\)（）—–\-]/g, '')
}

/** 取得學派名稱 */
function getSchoolName(schoolId: SchoolId): string {
  const school = schools.find(s => s.id === schoolId)
  return school ? school.name : schoolId
}

/** 生成包含加亮高亮與前後上下文的 Snippet */
export function highlightSnippet(text: string, rawQuery: string, maxLen = 60): string {
  if (!text) return ''
  const normText = normalizeSearchText(text)
  const normQuery = normalizeSearchText(rawQuery)

  if (!normQuery) return text.slice(0, maxLen)

  const matchIdx = normText.indexOf(normQuery)
  if (matchIdx === -1) {
    // 回退原始比對
    const rawIdx = text.toLowerCase().indexOf(rawQuery.toLowerCase())
    if (rawIdx === -1) return text.slice(0, maxLen)
    const start = Math.max(0, rawIdx - 15)
    const end = Math.min(text.length, start + maxLen)
    return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '')
  }

  // 以正規化字符對應找大約起止點
  const start = Math.max(0, matchIdx - 15)
  const end = Math.min(text.length, matchIdx + normQuery.length + 35)
  
  const prefix = start > 0 ? '...' : ''
  const suffix = end < text.length ? '...' : ''
  return prefix + text.slice(start, end) + suffix
}

// 建立索引快取
interface WorkIndexItem {
  workId: string
  title: string
  subtitle?: string
  schoolId: SchoolId
  author?: string
  period?: string
  intro?: string
  normTitle: string
  normSubtitle: string
  normIntro: string
}

interface ChapterIndexItem {
  chapterId: string
  workId: string
  workTitle: string
  title: string
  schoolId: SchoolId
  normTitle: string
}

interface SentenceIndexItem {
  sentenceId: string
  passageId: string
  chapterId: string
  workId: string
  workTitle: string
  chapterTitle: string
  schoolId: SchoolId
  canonicalText: string
  normCanonical: string
  translation?: string
  normTranslation?: string
  wordGlossary?: string
  normGlossary?: string
  philosophicalNote?: string
  normNote?: string
  writingApplication?: string
  normWriting?: string
}

let isIndexed = false
const indexedWorks: WorkIndexItem[] = []
const indexedChapters: ChapterIndexItem[] = []
const indexedSentences: SentenceIndexItem[] = []

function buildIndex() {
  if (isIndexed) return
  
  // 1. Index Works
  for (const w of works) {
    const desc = getWorkDescription(w.id)
    indexedWorks.push({
      workId: w.id,
      title: w.title,
      subtitle: w.subtitle,
      schoolId: w.schoolId,
      author: desc?.author,
      period: desc?.period,
      intro: desc?.introduction,
      normTitle: normalizeSearchText(w.title),
      normSubtitle: normalizeSearchText(w.subtitle || ''),
      normIntro: normalizeSearchText(desc?.introduction || ''),
    })
  }

  // 2. Index Chapters
  const workMap = new Map(works.map(w => [w.id, w]))
  for (const c of chapters) {
    const parentWork = workMap.get(c.workId)
    indexedChapters.push({
      chapterId: c.id,
      workId: c.workId,
      workTitle: parentWork?.title || '',
      title: c.title,
      schoolId: parentWork?.schoolId || 'daoism',
      normTitle: normalizeSearchText(c.title),
    })
  }

  // 3. Index Sentences & Passages
  const chapterMap = new Map(chapters.map(c => [c.id, c]))
  for (const s of sentences) {
    // 找出所屬 passage -> chapter -> work
    const passage = passages.find(p => p.id === s.passageId)
    if (!passage) continue
    const chapter = chapterMap.get(passage.chapterId)
    if (!chapter) continue
    const work = workMap.get(chapter.workId)
    if (!work) continue

    const translation = s.structuredTranslation?.translation || s.translationHint || ''
    const wordGlossary = s.structuredTranslation?.wordGlossary || ''
    const philosophicalNote = s.structuredTranslation?.philosophicalNote || ''
    const writingApplication = s.structuredTranslation?.writingApplication || ''

    indexedSentences.push({
      sentenceId: s.id,
      passageId: s.passageId,
      chapterId: chapter.id,
      workId: work.id,
      workTitle: work.title,
      chapterTitle: chapter.title,
      schoolId: work.schoolId,
      canonicalText: s.canonicalText,
      normCanonical: normalizeSearchText(s.canonicalText),
      translation,
      normTranslation: normalizeSearchText(translation),
      wordGlossary,
      normGlossary: normalizeSearchText(wordGlossary),
      philosophicalNote,
      normNote: normalizeSearchText(philosophicalNote),
      writingApplication,
      normWriting: normalizeSearchText(writingApplication),
    })
  }

  isIndexed = true
}

/** 主搜尋函式 */
export function searchContent(rawQuery: string, options: SearchOptions = {}): SearchResult[] {
  const query = rawQuery.trim()
  if (!query) return []
  
  buildIndex()

  const normQ = normalizeSearchText(query)
  if (!normQ) return []

  const { schoolFilter = 'all', typeFilter = 'all', limit = 100 } = options
  const results: SearchResult[] = []

  // 1. Search Works
  if (typeFilter === 'all' || typeFilter === 'work') {
    for (const item of indexedWorks) {
      if (schoolFilter !== 'all' && item.schoolId !== schoolFilter) continue

      let score = 0
      let matchField = ''
      let matchedText = ''

      if (item.normTitle === normQ) {
        score = 100
        matchField = '典籍名稱(完全匹配)'
        matchedText = item.title
      } else if (item.normTitle.includes(normQ)) {
        score = 85
        matchField = '典籍名稱'
        matchedText = item.title
      } else if (item.normSubtitle.includes(normQ)) {
        score = 75
        matchField = '典籍別名'
        matchedText = item.subtitle || ''
      } else if (item.normIntro.includes(normQ)) {
        score = 50
        matchField = '典籍導讀'
        matchedText = item.intro || ''
      }

      if (score > 0) {
        results.push({
          id: `work_${item.workId}`,
          type: 'work',
          score,
          workId: item.workId,
          workTitle: item.title,
          schoolId: item.schoolId,
          schoolName: getSchoolName(item.schoolId),
          matchField,
          matchedText,
          snippet: highlightSnippet(matchedText, query),
        })
      }
    }
  }

  // 2. Search Chapters
  if (typeFilter === 'all' || typeFilter === 'chapter') {
    for (const item of indexedChapters) {
      if (schoolFilter !== 'all' && item.schoolId !== schoolFilter) continue

      let score = 0
      if (item.normTitle === normQ) {
        score = 90
      } else if (item.normTitle.includes(normQ)) {
        score = 70
      }

      if (score > 0) {
        results.push({
          id: `chapter_${item.chapterId}`,
          type: 'chapter',
          score,
          workId: item.workId,
          workTitle: item.workTitle,
          chapterId: item.chapterId,
          chapterTitle: item.title,
          schoolId: item.schoolId,
          schoolName: getSchoolName(item.schoolId),
          matchField: '篇章名稱',
          matchedText: item.title,
          snippet: highlightSnippet(item.title, query),
        })
      }
    }
  }

  // 3. Search Sentences & Annotations
  if (typeFilter === 'all' || typeFilter === 'sentence' || typeFilter === 'translation') {
    for (const item of indexedSentences) {
      if (schoolFilter !== 'all' && item.schoolId !== schoolFilter) continue

      let maxScore = 0
      let matchField = ''
      let matchedText = ''
      let resType: SearchResultType = 'sentence'

      // 原文完全匹配
      if (item.normCanonical === normQ) {
        maxScore = 95
        matchField = '名句原文'
        matchedText = item.canonicalText
        resType = 'sentence'
      } 
      // 原文包含
      else if (item.normCanonical.includes(normQ)) {
        maxScore = 80
        matchField = '名句原文'
        matchedText = item.canonicalText
        resType = 'sentence'
      }

      // 白話譯文包含
      if (item.normTranslation && item.normTranslation.includes(normQ)) {
        const trScore = 65
        if (trScore > maxScore && (typeFilter === 'all' || typeFilter === 'translation')) {
          maxScore = trScore
          matchField = '白話譯文'
          matchedText = item.translation || ''
          resType = 'translation'
        }
      }

      // 關鍵字釋義 / 哲思 / 寫作應用包含
      if (item.normGlossary && item.normGlossary.includes(normQ)) {
        const glScore = 55
        if (glScore > maxScore && (typeFilter === 'all' || typeFilter === 'translation')) {
          maxScore = glScore
          matchField = '字詞釋義'
          matchedText = item.wordGlossary || ''
          resType = 'translation'
        }
      }

      if (item.normNote && item.normNote.includes(normQ)) {
        const ntScore = 50
        if (ntScore > maxScore && (typeFilter === 'all' || typeFilter === 'translation')) {
          maxScore = ntScore
          matchField = '思想哲理'
          matchedText = item.philosophicalNote || ''
          resType = 'translation'
        }
      }

      if (maxScore > 0) {
        results.push({
          id: `sentence_${item.sentenceId}`,
          type: resType,
          score: maxScore,
          workId: item.workId,
          workTitle: item.workTitle,
          chapterId: item.chapterId,
          chapterTitle: item.chapterTitle,
          schoolId: item.schoolId,
          schoolName: getSchoolName(item.schoolId),
          matchField,
          matchedText,
          snippet: highlightSnippet(matchedText, query),
          targetSentenceId: item.sentenceId,
        })
      }
    }
  }

  // 按 Score 排序降序
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}
