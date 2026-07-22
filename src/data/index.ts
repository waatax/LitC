// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 資料存取器
// ─────────────────────────────────────────────────
import { schools } from './schools'
import { works, chapters, passages, sentences } from './works'
import { getReadingAid } from './readingAid'
import { STRUCTURED_ANNOTATIONS } from './structuredAnnotations'
import type { School, Work, Chapter, Passage, Sentence, SchoolId, StructuredTranslation } from '../types/content'

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

function normalizeText(str: string): string {
  return str.replace(/[「」『』""'']/g, '').trim()
}

function generateDynamicGlossary(text: string): string {
  const keywords: [RegExp, string][] = [
    [/道/g, '道：宇宙運行的根本規律與天理。'],
    [/德/g, '德：品德、操守與內在修養。'],
    [/仁/g, '仁：孔門核心思想，愛人與同理心。'],
    [/義/g, '義：正義、適宜與道德原則。'],
    [/禮/g, '禮：社會規範與禮儀制度。'],
    [/智/g, '智：智慧與理性判斷。'],
    [/信/g, '信：誠信與言而有信。'],
    [/君子/g, '君子：具備高尚品德的人。'],
    [/聖人/g, '聖人：道德與智慧達到最高境界的人。'],
    [/無為/g, '無為：順應自然，不主觀妄為。'],
    [/兵/g, '兵：軍事、用兵與戰略。'],
    [/故/g, '故：所以、因此。'],
    [/是以/g, '是以：因此、所以。'],
    [/謂/g, '謂：稱作、叫做。'],
    [/莫/g, '莫：沒有人、不要。']
  ]
  const matched = keywords.filter(([re]) => re.test(text)).map(([, desc]) => desc)
  if (matched.length > 0) return matched.slice(0, 3).join('\n')
  return `文言關鍵字：文意需結合上下文綜合領會。`
}

function generateDynamicPhilosophicalNote(text: string, workId?: string): string {
  if (workId === 'dao-de-jing' || workId === 'zhuangzi' || workId === 'liezi' || workId === 'wenzi' || workId === 'wenshi-zhenjing') {
    return '【道家哲思】本句體現了道家順應自然、清靜無為與超越二元對立的核心智慧，引導讀者體會事物的本然狀態。'
  }
  if (workId === 'han-fei-zi' || workId === 'shang-jun-shu' || workId === 'guanzi' || workId === 'shenzi') {
    return '【法家治道】本句反映了法家重視制度、嚴明賞罰與權謀勢位的治國主張，強調法治的客觀性與權力運作規律。'
  }
  if (workId === 'mo-zi') {
    return '【墨家思想】本句貫徹了墨家兼愛、非攻、尚賢、節用之理念，以興天下之利、除天下之害為終極道德指引。'
  }
  if (workId === 'art-of-war' || workId === 'wu-zi' || workId === 'si-ma-fa' || workId === 'six-tactics' || workId === 'three-strategies') {
    return '【兵家戰略】本句提煉了兵家因敵制勝、知己知彼與慎重決策的宏大勝敗規律，具有極高的戰略思維價值。'
  }
  if (workId === 'shiji' || workId === 'chun-qiu-zuo-zhuan' || workId === 'zhan-guo-ce' || workId === 'guo-yu') {
    return '【史家寄託】本句呈現了史書記錄歷史興衰、列國風雲與人物成敗的深遠寄託，體現歷史客觀鏡鑑作用。'
  }
  return '【儒家修養】本句體現了儒家修己安人、中庸之道與崇尚仁義之核心價值，引導讀者在日常生活中踐行君子品格。'
}

function generateDynamicWritingApplication(text: string): string {
  if (/。.*。/.test(text) || text.includes('；') || text.includes('？')) {
    return '【寫作修辭】對偶、排比或複句對照。\n【應用範例】常用於作文論述中作為經典論據，增強文采與說服力。'
  }
  return '【寫作修辭】警策句、修辭簡練。\n【應用範例】適合用於文章開篇點題或結尾昇華主題。'
}

function parseStructuredTranslation(sentence: { canonicalText: string }, rawHint?: string, workId?: string): StructuredTranslation | undefined {
  const normSent = normalizeText(sentence.canonicalText)
  
  // Exact match
  if (STRUCTURED_ANNOTATIONS[sentence.canonicalText]) {
    return STRUCTURED_ANNOTATIONS[sentence.canonicalText]
  }

  // Normalized match or substring match
  for (const [key, value] of Object.entries(STRUCTURED_ANNOTATIONS)) {
    const normKey = normalizeText(key)
    if (normKey === normSent || normKey.includes(normSent) || normSent.includes(normKey)) {
      return value
    }
  }

  const isValidHint = rawHint && rawHint.trim().length > 0 && !rawHint.includes('此句釋義提示');
  const translationText = isValidHint ? rawHint : (getReadingAid(sentence as any, workId || '') || sentence.canonicalText);

  return {
    translation: translationText,
    wordGlossary: generateDynamicGlossary(sentence.canonicalText),
    philosophicalNote: generateDynamicPhilosophicalNote(sentence.canonicalText, workId),
    writingApplication: generateDynamicWritingApplication(sentence.canonicalText)
  }
}

export function getSentencesByPassage(passageId: string): Sentence[] {
  const passage = passages.find(p => p.id === passageId)
  const chapter = passage ? chapters.find(c => c.id === passage.chapterId) : undefined
  return sentences
    .filter(s => s.passageId === passageId)
    .map(sentence => {
      if (chapter) {
        const rawHint = getReadingAid(sentence, chapter.workId)
        return {
          ...sentence,
          translationHint: rawHint,
          structuredTranslation: parseStructuredTranslation(sentence, rawHint, chapter.workId)
        }
      }
      return sentence
    })
}

export function getAllSentencesByChapter(chapterId: string): Sentence[] {
  return getPassagesByChapter(chapterId).flatMap(passage => getSentencesByPassage(passage.id))
}
