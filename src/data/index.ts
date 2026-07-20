// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 資料存取器
// ─────────────────────────────────────────────────
import { schools } from './schools'
import { works, chapters, passages, sentences } from './works'
import { getReadingAid } from './readingAid'
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

function parseStructuredTranslation(sentence: { canonicalText: string }, rawHint?: string): StructuredTranslation | undefined {
  if (!rawHint) return undefined

  // Predefined rich annotations for golden fixtures to demonstrate deep pedagogical layers
  const presets: Record<string, StructuredTranslation> = {
    '道可道，非常道。名可名，非常名。': {
      translation: '可以說得出的「道」，不是永恆不變的道；可以叫得出的名稱，也不是事物最根本、固定的名稱。',
      wordGlossary: '道：宇宙運行的根本規律，不可言說。\n常：永恆不變的。\n名：事物的名稱、概念。',
      philosophicalNote: '老子開篇立論，指出真實的「道」超越語言文字的範疇。一旦可以用言詞命名，便落入相對的界限中，不再是永恆整全的本體。',
      writingApplication: '【寫作修辭】對仗、排比。\n【應用範例】可用於論述「事物的本質與名稱之間的相對關係」，或論證「追求真理不應拘泥於教條與形式表象」。例如：「真理如老子所言，道可道非常道；我們在學習新知時，切莫被名詞定義束縛，而應探求背後的核心邏輯。」'
    },
    '無名天地之始；有名萬物之母。': {
      translation: '未被命名時，是天地萬物的開端；有了名稱與分別後，便成為萬物生發的根源。',
      wordGlossary: '無名：指道的無形無相狀態。\n有名：指道演化出萬物、產生分別的狀態。\n始：開端。\n母：根源、母體。',
      philosophicalNote: '「無」與「有」是道的兩面。無名是形而上的混沌本體，有名是形而下的萬物演化。老子主張以「無名」觀其妙，以「有名」觀其徼（邊界）。',
      writingApplication: '【寫作修辭】對比、頂真。\n【應用範例】可用於探討「無中生有」的創新思維，或論述事物從隱性（概念）到顯性（實體）的發展規律。例如：「在設計新產品時，『無名』是天馬行空的創意，而『有名』則是具體化的功能實體，兩者缺一不可。」'
    },
    '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。': {
      translation: '最高的善像水：滋養萬物卻不爭功，安處在人們不喜歡的低處，因此最接近「道」。',
      wordGlossary: '上善：最完美的善。\n利：滋養、利益。\n爭：爭奪名利。\n幾：接近。',
      philosophicalNote: '水具有「避高趨下」與「利他而不爭」的特質。老子藉水喻道，說明處於卑下之位、默默奉獻而不爭執，才是最符合道的生活態度。',
      writingApplication: '【寫作修辭】象徵、擬人。\n【應用範例】可用於論述「謙遜的力量」、「利他主義」或「柔性領導力」。例如：「真正偉大的領導者，應如上善若水，默默支持團隊而不爭功，以無形的包容引領團隊前行。」'
    },
    '北冥有魚，其名為鯤。': {
      translation: '北方的大海有一條魚，牠的名字叫做鯤。',
      wordGlossary: '北冥：北方的大海。冥，同「溟」，大澤、大海。\n鯤：傳說中的巨魚。',
      philosophicalNote: '莊子借鯤化為鵬的宏大意象，展示生命的超越與精神的自由。鯤是積蓄能量的起點。',
      writingApplication: '【寫作修辭】起興、寓言叙事。\n【應用範例】可用於描繪「潛能的積累」或「大器晚成的志向」。比喻人在平凡的起點中積蓄力量，為未來的爆發做準備。'
    },
    '鯤之大，不知其幾千里也；化而為鳥，其名為鵬。': {
      translation: '鯤的身軀龐大，不知道有幾千里寬；牠羽化成鳥，名字叫做鵬。',
      wordGlossary: '幾千：大約數目。\n化：轉化、蛻變。\n鵬：傳說中的巨鳥。',
      philosophicalNote: '「化」代表著生命境界的躍遷，從深海之魚升華為九天之鵬，比喻心靈的解放與超越。',
      writingApplication: '【寫作修辭】誇張、對比、象徵。\n【應用範例】適合用於寫作「生命的躍遷與自我超越」或「宏大抱負的展現」。例如：「每個人心中都有一隻沉睡的鯤，唯有經歷奮鬥的『化』，方能成為展翅高飛的鵬，衝向無邊的天際。」'
    }
  }

  if (presets[sentence.canonicalText]) {
    return presets[sentence.canonicalText]
  }

  return {
    translation: rawHint,
    wordGlossary: undefined,
    philosophicalNote: undefined,
    writingApplication: undefined
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
          structuredTranslation: parseStructuredTranslation(sentence, rawHint)
        }
      }
      return sentence
    })
}

export function getAllSentencesByChapter(chapterId: string): Sentence[] {
  return getPassagesByChapter(chapterId).flatMap(passage => getSentencesByPassage(passage.id))
}
