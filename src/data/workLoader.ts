import type { Work, Chapter, Passage, Sentence } from '@/types/content'
import { catalogChapters } from './catalog'
import { workImports } from './workImportManifest'

export interface WorkBundle {
  work: Work
  chapters: Chapter[]
  passages: Passage[]
  sentences: Sentence[]
}

const cache = new Map<string, Promise<WorkBundle>>()

export function getWorkIdForChapter(chapterId: string): string | undefined {
  return catalogChapters.find(chapter => chapter.id === chapterId)?.workId
}

export async function loadWork(workId: string): Promise<WorkBundle | null> {
  const importer = workImports[workId as keyof typeof workImports]
  if (!importer) return null
  if (!cache.has(workId)) {
    cache.set(workId, importer().then(module => module.default))
  }
  return cache.get(workId)!
}

export async function loadChapterContent(chapterId: string) {
  const workId = getWorkIdForChapter(chapterId)
  if (!workId) return null
  const bundle = await loadWork(workId)
  if (!bundle) return null
  const chapter = bundle.chapters.find(item => item.id === chapterId)
  if (!chapter) return null
  const passages = bundle.passages.filter(item => item.chapterId === chapterId)
  const passageIds = new Set(passages.map(item => item.id))
  const sentences = bundle.sentences.filter(item => passageIds.has(item.passageId))
  return { ...bundle, chapter, passages, sentences }
}
