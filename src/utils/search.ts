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

const FAMOUS_QUOTES = [
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-1', text: '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？', concept: '求學、修身、交友' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-2', text: '吾十有五而志於學，三十而立，四十而不惑，五十而知天命，六十而耳順，七十而從心所欲，不踰矩。', concept: '人生境界、修養進程' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-7', text: '三人行，必有我師焉。擇其善者而從之，其不善者而改之。', concept: '謙虛求教、擇善而從' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-9', text: '子在川上曰：「逝者如斯夫！不舍晝夜。」', concept: '時光流逝、自強不息' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-1', text: '王何必曰利？亦有仁義而已矣。', concept: '義利之辯、仁政王道' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-3', text: '天時不如地利，地利不如人和。得道者多助，失道者寡助。', concept: '人和、民心所向' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-11', text: '魚，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍魚而取熊掌者也。生，亦我所欲也；義，亦我所欲也。二者不可得兼，舍生而取義者也。', concept: '捨生取義、道德浩氣' },
  { workId: 'da-xue', chapterId: 'da-xue_ch-1', text: '大學之道，在明明德，在親民，在止於至善。古之欲明明德於天下者，先治其國；欲治其國者，先齊其家；欲齊其家者，先修其身。', concept: '三綱領、八條目' },
  { workId: 'zhong-yong', chapterId: 'zhong-yong_ch-1', text: '天命之謂性，率性之謂道，修道之謂教。道也者，不可須臾離也，可離非道也。是故君子戒慎乎其所不睹，恐懼乎其所不聞。', concept: '中庸本體、慎獨功夫' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-1', text: '道可道，非常道；名可名，非常名。無名天地之始；有名萬物之母。', concept: '宇宙本體、玄之又玄' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-8', text: '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。', concept: '上善若水、謙下不爭' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-25', text: '人法地，地法天，天法道，道法自然。', concept: '道法自然、天人合一' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-1', text: '北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也；怒而飛，其翼若垂天之雲。', concept: '逍遙無待、鵬程萬里' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-2', text: '天地與我並生，而萬物與我為一。莊周夢為胡蝶，栩栩然胡蝶也。', concept: '齊物論、莊周夢蝶' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-3', text: '吾生也有涯，而知也無涯。以有涯隨無涯，殆已！庖丁解牛，依乎天理，批大郤，導大窾。', concept: '養生主、庖丁解牛' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-1', text: '兵者，國之大事，死生之地，存亡之道，不可不察也。故經之以五事：一曰道，二曰天，三曰地，四曰將，五曰法。', concept: '戰略籌劃、兵學總綱' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-3', text: '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。不戰而屈人之兵，善之善者也。', concept: '知己知彼、全勝智謀' },
  { workId: 'xunzi', chapterId: 'xunzi_ch-1', text: '學不可以已。青，取之於藍，而青於藍；冰，水為之，而寒於水。君子博學而日參省乎己，則知明而行無過矣。', concept: '勸學、化性起偽' },
  { workId: 'han-fei-zi', chapterId: 'han-fei-zi_ch-49', text: '宋人有耕者，田中有株。兔走觸株，折頸而死。因釋其耒而守株，冀復得兔。世異則事異，事異則備變。', concept: '守株待兔、因時制宜' },
  { workId: 'mo-zi', chapterId: 'mo-zi_ch-14', text: '天下兼相愛，愛人若愛其身。視人之國若視其國，視人之家若視其家，視人之身若視其身。', concept: '兼相愛、交相利' },
  { workId: 'yi-jing', chapterId: 'yi-jing_ch-1', text: '天行健，君子以自強不息。地勢坤，君子以厚德載物。', concept: '乾坤二卦、自強厚德' },
  { workId: 'shi-jing', chapterId: 'shi-jing_ch-1', text: '關關雎鳩，在河之洲。窈窕淑女，君子好逑。', concept: '國風之始、風雅詩情' },
  { workId: 'li-ji', chapterId: 'li-ji_ch-9', text: '大道之行也，天下為公。選賢與能，講信修睦。故人不獨親其親，不獨子其子。', concept: '大同世界、天下為公' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-57', text: '忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。土地平曠，屋舍儼然，有良田美池桑竹之屬。', concept: '世外桃源、隱逸情懷' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-134', text: '先天下之憂而憂，後天下之樂而樂。不以物喜，不以己悲；居廟堂之高則憂其民，處江湖之遠則憂其君。', concept: '岳陽樓記、憂樂情懷' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-140', text: '醉翁之意不在酒，在乎山水之間也。山水之樂，得之心而寓之酒也。', concept: '醉翁亭記、與民同樂' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-143', text: '清風徐來，水波不興。舉酒屬客，誦明月之詩，歌窈窕之章。寄蜉蝣於天地，渺滄海之一粟。哀吾生之須臾，羨長江之無窮。', concept: '前赤壁賦、超然達觀' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-105', text: '古之學者必有師。師者，所以傳道受業解惑也。人非生而知之者，孰能無惑？惑而不從師，其為惑也，終不解矣。', concept: '師說、尊師重道' },
  { workId: 'shiji', chapterId: 'shiji_ch-7', text: '項羽大呼馳下，漢軍皆披靡。力拔山兮氣蓋世，時不利兮騅不逝。騅不逝兮可奈何，虞兮虞兮奈若何！', concept: '項羽本紀、霸王悲歌' },
  { workId: 'chun-qiu-zuo-zhuan', chapterId: 'chun-qiu-zuo-zhuan_ch-1', text: '多行不義必自斃，子姑待之。公入而賦：「大隧之中，其樂也融融！」姜出而賦：「大隧之外，其樂也洩洩！」', concept: '鄭伯克段于鄢、左傳名篇' },
]

function buildIndex(): IndexedItem[] {
  if (index) return index
  const result: IndexedItem[] = []
  const workById = new Map(works.map(work => [work.id, work]))
  const chapterById = new Map(chapters.map(ch => [ch.id, ch]))

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

  for (const quote of FAMOUS_QUOTES) {
    const work = workById.get(quote.workId)
    const chapter = chapterById.get(quote.chapterId)
    if (!work || !chapter) continue
    add({
      id: `quote-${quote.workId}-${quote.chapterId}`,
      type: 'sentence',
      workId: work.id,
      workTitle: work.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      schoolId: work.schoolId,
      schoolName: schoolName(work.schoolId),
      matchField: '經典名句',
      matchedText: `${quote.text}・${quote.concept}`,
      baseScore: 95,
    })
  }

  index = result
  return result
}

export function getSearchIndexStats() {
  const items = buildIndex()
  return { total: items.length, works: works.length, chapters: chapters.length, originalPassages: FAMOUS_QUOTES.length, passageTranslations: 0, passageAnalyses: 0, sentences: FAMOUS_QUOTES.length }
}

export function searchContent(rawQuery: string, options: SearchOptions = {}): SearchResult[] {
  const normalizedQuery = normalizeSearchText(rawQuery)
  if (!normalizedQuery) return []
  const { schoolFilter = 'all', typeFilter = 'all', limit = Number.POSITIVE_INFINITY } = options
  return buildIndex()
    .filter(item => (schoolFilter === 'all' || item.schoolId === schoolFilter) && (typeFilter === 'all' || item.type === typeFilter))
    .filter(item => item.normalized.includes(normalizedQuery))
    .map(item => ({ ...item, score: item.baseScore + (item.normalized === normalizedQuery ? 30 : item.normalized.startsWith(normalizedQuery) ? 20 : 10), snippet: highlightSnippet(item.matchedText, rawQuery) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
