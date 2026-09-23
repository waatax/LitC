import type { Work, Chapter, Passage, Sentence, ChapterBundle, WorkBundle } from '@/types/content'
import { catalogWorks, catalogChapters } from './catalog'
import { chapterImports, workChapterMap } from './workImportManifest'
import { STRUCTURED_ANNOTATIONS } from './structuredAnnotations'

export type { WorkBundle, ChapterBundle }

function normalizeText(text: string): string {
  return (text || '').replace(/[\s\p{P}\p{S}]/gu, '')
}

const annotationEntries = Object.entries(STRUCTURED_ANNOTATIONS).map(([rawKey, val]) => ({
  normKey: normalizeText(rawKey),
  val
}))

function findStructuredAnnotation(sentenceText: string) {
  const norm = normalizeText(sentenceText)
  if (!norm || norm.length < 4) return undefined

  // 1. Exact match on normalized text
  const exact = annotationEntries.find(e => e.normKey === norm)
  if (exact) return exact.val

  // 2. Sentence is a substantial subclause of an annotation
  if (norm.length >= 6) {
    const parent = annotationEntries.find(e => e.normKey.includes(norm))
    if (parent) return parent.val
  }

  // 3. Annotation is a substantial subclause of a sentence
  const child = annotationEntries.find(e => e.normKey.length >= 6 && norm.includes(e.normKey))
  if (child) return child.val

  return undefined
}

export interface ChapterContent {
  work: Work
  chapter: Chapter
  chapters: Chapter[]
  passages: Passage[]
  sentences: Sentence[]
}

const chapterCache = new Map<string, Promise<ChapterBundle | null>>()
const workCache = new Map<string, Promise<WorkBundle | null>>()

export function getWorkIdForChapter(chapterId: string): string | undefined {
  return catalogChapters.find(chapter => chapter.id === chapterId)?.workId
}

/**
 * Loads a single chapter bundle dynamically (on demand).
 * Average size: ~15KB - 40KB, ultra-fast download & instant parsing.
 */
export async function loadChapterBundle(chapterId: string): Promise<ChapterBundle | null> {
  if (chapterCache.has(chapterId)) {
    return chapterCache.get(chapterId)!
  }
  const importer = chapterImports[chapterId as keyof typeof chapterImports]
  if (!importer) return null

  const promise = importer()
    .then(module => {
      const bundle = module.default
      if (bundle && bundle.sentences) {
        for (const s of bundle.sentences) {
          if (!s.structuredTranslation) {
            const match = findStructuredAnnotation(s.canonicalText)
            if (match) {
              s.structuredTranslation = match
            }
          }
        }
      }
      return bundle
    })
    .catch(err => {
      console.error(`Failed to load chapter chunk ${chapterId}:`, err)
      chapterCache.delete(chapterId)
      return null
    })

  chapterCache.set(chapterId, promise)
  return promise
}

/**
 * Loads full content for a chapter view with associated work and sister chapters.
 */
export async function loadChapterContent(chapterId: string): Promise<ChapterContent | null> {
  const bundle = await loadChapterBundle(chapterId)
  if (!bundle) return null

  const workId = bundle.workId || getWorkIdForChapter(chapterId)
  const work = catalogWorks.find(w => w.id === workId)
  if (!work) return null

  const chapters = catalogChapters.filter(c => c.workId === workId)

  return {
    work,
    chapter: bundle.chapter,
    chapters,
    passages: bundle.passages,
    sentences: bundle.sentences
  }
}

/**
 * Backward-compatible work loader that dynamically aggregates chapter bundles on demand.
 */
export async function loadWork(workId: string): Promise<WorkBundle | null> {
  if (workCache.has(workId)) {
    return workCache.get(workId)!
  }

  const work = catalogWorks.find(w => w.id === workId)
  if (!work) return null

  const chapterIds = workChapterMap[workId] || work.chapterIds || []
  if (!chapterIds.length) return null

  const promise = (async () => {
    const chapterBundles = await Promise.all(chapterIds.map(chId => loadChapterBundle(chId)))
    const valid = chapterBundles.filter((b): b is ChapterBundle => b !== null)
    if (!valid.length) return null

    const chapters = valid.map(b => b.chapter)
    const passages = valid.flatMap(b => b.passages)
    const sentences = valid.flatMap(b => b.sentences)

    return {
      work,
      chapters,
      passages,
      sentences
    }
  })()

  workCache.set(workId, promise)
  return promise
}

