// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 資料存取器
// ─────────────────────────────────────────────────
import { schools } from './schools'
import { works, chapters, passages, sentences } from './works'
import { getReadingAid } from './readingAid'
import type { School, Work, Chapter, Passage, Sentence, SchoolId } from '../types/content'

export function getSchools(): School[] {
  return schools
}

export function getWorks(): Work[] {
  return works
}

export function getWorksBySchool(schoolId: SchoolId): Work[] {
  return works.filter(w => w.schoolId === schoolId)
}

export function getChapters(workId: string): Chapter[] {
  return chapters.filter(c => c.workId === workId)
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapters.find(c => c.id === chapterId)
}

export function getPassagesByChapter(chapterId: string): Passage[] {
  return passages.filter(p => p.chapterId === chapterId)
}

export function getSentencesByPassage(passageId: string): Sentence[] {
  const passage = passages.find(p => p.id === passageId)
  const chapter = passage ? chapters.find(c => c.id === passage.chapterId) : undefined
  return sentences
    .filter(s => s.passageId === passageId)
    .map(sentence => chapter
      ? { ...sentence, translationHint: getReadingAid(sentence, chapter.workId) }
      : sentence)
}

export function getAllSentencesByChapter(chapterId: string): Sentence[] {
  return getPassagesByChapter(chapterId).flatMap(passage => getSentencesByPassage(passage.id))
}
