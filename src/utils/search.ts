import { catalogWorks as works, catalogChapters as chapters } from '@/data/catalog'
import { getWorkDescription } from '@/data/catalogApi'
import { schools } from '@/data/schools'
import { POETRY_COLLECTION } from '@/data/poetry'
import type { SchoolId } from '@/types/content'

export type SearchResultType = 'sentence' | 'translation' | 'work' | 'chapter' | 'poetry'

export interface SearchResult {
  id: string
  type: SearchResultType
  score: number
  workId: string
  workTitle: string
  chapterId?: string
  chapterTitle?: string
  schoolId: SchoolId | 'literature' | 'poetry'
  schoolName: string
  matchField: string
  matchedText: string
  snippet: string
  targetSentenceId?: string
  author?: string
  dynasty?: string
  poemId?: string
}

export interface SearchOptions {
  schoolFilter?: SchoolId | 'literature' | 'poetry' | 'all'
  typeFilter?: 'all' | SearchResultType
  limit?: number
}

export function normalizeSearchText(text: string): string {
  return (text || '').normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]/gu, '')
}

function schoolName(id: SchoolId | 'literature' | 'poetry'): string {
  if (id === 'poetry') return '詩詞元曲'
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

type IndexedItem = Omit<SearchResult, 'score' | 'snippet'> & {
  normalized: string
  baseScore: number
  initials?: string
}

let index: IndexedItem[] | undefined

// 常用典籍與名篇的拼音縮寫與別名字典
const WORK_ALIASES: Record<string, { initials: string; aliases: string[] }> = {
  'dao-de-jing': { initials: 'ddj', aliases: ['老子', '五千言', '道德真經', 'laozi'] },
  'zhuangzi': { initials: 'zz', aliases: ['南華真經', '莊子', '南華經', 'zhuangzi'] },
  'lun-yu': { initials: 'ly', aliases: ['論語', '孔子', '孔夫子', 'lunyu'] },
  'meng-zi': { initials: 'mz', aliases: ['孟子', '亞聖', 'mengzi'] },
  'da-xue': { initials: 'dx', aliases: ['大學', '四書', 'daxue'] },
  'zhong-yong': { initials: 'zy', aliases: ['中庸', '四書', 'zhongyong'] },
  'art-of-war': { initials: 'szbf', aliases: ['孫子兵法', '孫武', '兵經', 'sunzibingfa'] },
  'xunzi': { initials: 'xz', aliases: ['荀子', '荀卿', 'xunzi'] },
  'han-fei-zi': { initials: 'hfz', aliases: ['韓非子', '韓非', 'hanfeizi'] },
  'mo-zi': { initials: 'moz', aliases: ['墨子', '墨翟', 'mozi'] },
  'yi-jing': { initials: 'yj', aliases: ['易經', '周易', '易傳', 'yijing', 'zhouyi'] },
  'shi-jing': { initials: 'sj', aliases: ['詩經', '詩三百', '國風', 'shijing'] },
  'li-ji': { initials: 'lj', aliases: ['禮記', '小戴禮記', 'liji'] },
  'shiji': { initials: 'shiji', aliases: ['史記', '太史公書', '司馬遷'] },
  'gu-wen-guan-zhi': { initials: 'gwgz', aliases: ['古文觀止', '吳楚材', '吳調侯'] },
  'cai-gen-tan': { initials: 'cgt', aliases: ['菜根譚', '洪應明'] },
  'chun-qiu-zuo-zhuan': { initials: 'cqzz', aliases: ['左傳', '春秋左氏傳', '左丘明'] },
  'zhan-guo-ce': { initials: 'zgc', aliases: ['戰國策', '劉向'] },
  'guo-yu': { initials: 'gy', aliases: ['國語', '春秋外傳'] },
  'han-shu': { initials: 'hs', aliases: ['漢書', '前漢書', '班固'] },
  'hou-han-shu': { initials: 'hhs', aliases: ['後漢書', '范曄'] },
}

const FAMOUS_QUOTES = [
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-1', text: '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？', concept: '求學、修身、交友、樂道', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-2', text: '吾十有五而志於學，三十而立，四十而不惑，五十而知天命，六十而耳順，七十而從心所欲，不踰矩。', concept: '人生境界、修養進程', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-2', text: '為政以德，譬如北辰，居其所而眾星共之。', concept: '德治教化、為政之道', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-2', text: '溫故而知新，可以為師矣。學而不思則罔，思而不學則殆。', concept: '學習思考並重', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-7', text: '三人行，必有我師焉。擇其善者而從之，其不善者而改之。', concept: '謙虛求教、擇善而從', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-9', text: '子在川上曰：「逝者如斯夫！不舍晝夜。」', concept: '時光流逝、自強不息', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-12', text: '己所不欲，勿施於人。在邦無怨，在家無怨。', concept: '忠恕之道、仁者愛人', author: '孔子', dynasty: '春秋' },
  { workId: 'lun-yu', chapterId: 'lun-yu_ch-15', text: '志士仁人，無求生以害仁，有殺身以成仁。', concept: '殺身成仁、弘毅精神', author: '孔子', dynasty: '春秋' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-1', text: '王何必曰利？亦有仁義而已矣。', concept: '義利之辯、仁政王道', author: '孟子', dynasty: '戰國' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-3', text: '天時不如地利，地利不如人和。得道者多助，失道者寡助。', concept: '人和、民心所向', author: '孟子', dynasty: '戰國' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-4', text: '不以規矩，不能成方員；不以六律，不能正五音。', concept: '規矩法度、仁義正道', author: '孟子', dynasty: '戰國' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-6', text: '富貴不能淫，貧賤不能移，威武不能屈，此之謂大丈夫。', concept: '浩然正氣、大丈夫品格', author: '孟子', dynasty: '戰國' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-11', text: '魚，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍魚而取熊掌者也。生，亦我所欲也；義，亦我所欲也。二者不可得兼，舍生而取義者也。', concept: '捨生取義、道德浩氣', author: '孟子', dynasty: '戰國' },
  { workId: 'meng-zi', chapterId: 'meng-zi_ch-12', text: '故天將降大任於是人也，必先苦其心志，勞其筋骨，餓其體膚，空乏其身，行拂亂其所為，所以動心忍性，曾益其所不能。', concept: '生於憂患、磨礪成器', author: '孟子', dynasty: '戰國' },
  { workId: 'da-xue', chapterId: 'da-xue_ch-1', text: '大學之道，在明明德，在親民，在止於至善。古之欲明明德於天下者，先治其國；欲治其國者，先齊其家；欲齊其家者，先修其身。', concept: '三綱領、八條目', author: '曾子', dynasty: '戰國' },
  { workId: 'zhong-yong', chapterId: 'zhong-yong_ch-1', text: '天命之謂性，率性之謂道，修道之謂教。道也者，不可須臾離也，可離非道也。是故君子戒慎乎其所不睹，恐懼乎其所不聞。', concept: '中庸本體、慎獨功夫', author: '子思', dynasty: '戰國' },
  { workId: 'zhong-yong', chapterId: 'zhong-yong_ch-1', text: '喜怒哀樂之未發，謂之中；發而皆中節，謂之和。中也者，天下之大本也；和也者，天下之達道也。致中和，天地位焉，萬物育焉。', concept: '中和之道、宇宙生化', author: '子思', dynasty: '戰國' },
  { workId: 'zhong-yong', chapterId: 'zhong-yong_ch-20', text: '博學之，審問之，慎思之，明辨之，篤行之。人一能之己百之，人十能之己千之。', concept: '為學五步、勤懇篤實', author: '子思', dynasty: '戰國' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-1', text: '道可道，非常道；名可名，非常名。無名天地之始；有名萬物之母。同出而異名，同謂之玄。玄之又玄，眾妙之門。', concept: '宇宙本體、玄之又玄', author: '老子', dynasty: '春秋' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-8', text: '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。居善地，心善淵，與善仁，言善信，政善治，事善能，動善時。夫唯不爭，故無尤。', concept: '上善若水、謙下不爭', author: '老子', dynasty: '春秋' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-25', text: '人法地，地法天，天法道，道法自然。', concept: '道法自然、天人合一', author: '老子', dynasty: '春秋' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-42', text: '道生一，一生二，二生三，三生萬物。萬物負陰而抱陽，沖氣以為和。', concept: '宇宙創生、陰陽調和', author: '老子', dynasty: '春秋' },
  { workId: 'dao-de-jing', chapterId: 'dao-de-jing_ch-64', text: '合抱之木，生於毫末；九層之臺，起於累土；千里之行，始於足下。', concept: '防微杜漸、積累功夫', author: '老子', dynasty: '春秋' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-1', text: '北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也；怒而飛，其翼若垂天之雲。', concept: '逍遙無待、鵬程萬里', author: '莊子', dynasty: '戰國' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-2', text: '天地與我並生，而萬物與我為一。莊周夢為胡蝶，栩栩然胡蝶也。俄然覺，則蘧蘧然周也。', concept: '齊物論、莊周夢蝶、物化', author: '莊子', dynasty: '戰國' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-3', text: '吾生也有涯，而知也無涯。以有涯隨無涯，殆已！庖丁解牛，依乎天理，批大郤，導大窾，因其固然。', concept: '養生主、庖丁解牛、游刃有餘', author: '莊子', dynasty: '戰國' },
  { workId: 'zhuangzi', chapterId: 'zhuangzi_ch-17', text: '秋水時至，百川灌河。子非魚，安知魚之樂？子非我，安知我不知魚之樂？', concept: '秋水豪情、濠梁之辯', author: '莊子', dynasty: '戰國' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-1', text: '兵者，國之大事，死生之地，存亡之道，不可不察也。故經之以五事：一曰道，二曰天，三曰地，四曰將，五曰法。', concept: '戰略籌劃、兵學總綱', author: '孫武', dynasty: '春秋' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-3', text: '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。不戰而屈人之兵，善之善者也。', concept: '知己知彼、全勝智謀', author: '孫武', dynasty: '春秋' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-6', text: '夫兵形象水，水之行避高而趨下，兵之形避實而擊虛。水因地而制流，兵因敵而制勝。故兵無常勢，水無常形。', concept: '避實擊虛、兵形象水', author: '孫武', dynasty: '春秋' },
  { workId: 'art-of-war', chapterId: 'art-of-war_ch-7', text: '故其疾如風，其徐如林，侵掠如火，不動如山，難知如陰，動如雷震。', concept: '風林火山、用兵節奏', author: '孫武', dynasty: '春秋' },
  { workId: 'xunzi', chapterId: 'xunzi_ch-1', text: '學不可以已。青，取之於藍，而青於藍；冰，水為之，而寒於水。君子博學而日參省乎己，則知明而行無過矣。', concept: '勸學、青出於藍、日參省己', author: '荀子', dynasty: '戰國' },
  { workId: 'han-fei-zi', chapterId: 'han-fei-zi_ch-49', text: '宋人有耕者，田中有株。兔走觸株，折頸而死。因釋其耒而守株，冀復得兔。世異則事異，事異則備變。', concept: '守株待兔、因時制宜', author: '韓非', dynasty: '戰國' },
  { workId: 'mo-zi', chapterId: 'mo-zi_ch-14', text: '天下兼相愛，愛人若愛其身。視人之國若視其國，視人之家若視其家，視人之身若視其身。', concept: '兼相愛、交相利、天下和平', author: '墨子', dynasty: '戰國' },
  { workId: 'yi-jing', chapterId: 'yi-jing_ch-1', text: '天行健，君子以自強不息。地勢坤，君子以厚德載物。', concept: '乾坤二卦、自強厚德', author: '文王/周公/孔子', dynasty: '先秦' },
  { workId: 'shi-jing', chapterId: 'shi-jing_ch-1', text: '關關雎鳩，在河之洲。窈窕淑女，君子好逑。參差荇菜，左右流之。窈窕淑女，寤寐求之。', concept: '國風之始、風雅詩情', author: '佚名', dynasty: '西周' },
  { workId: 'shi-jing', chapterId: 'shi-jing_ch-6', text: '桃之夭夭，灼灼其華。之子于歸，宜其室家。', concept: '桃夭、新婚祝頌', author: '佚名', dynasty: '先秦' },
  { workId: 'shi-jing', chapterId: 'shi-jing_ch-42', text: '靜女其姝，俟我於城隅。愛而不見，搔首踟躕。', concept: '靜女、純樸戀歌', author: '佚名', dynasty: '先秦' },
  { workId: 'shi-jing', chapterId: 'shi-jing_ch-76', text: '青青子衿，悠悠我心。縱我不往，子寧不嗣音？', concept: '子衿、相思慕念', author: '佚名', dynasty: '先秦' },
  { workId: 'li-ji', chapterId: 'li-ji_ch-9', text: '大道之行也，天下為公。選賢與能，講信修睦。故人不獨親其親，不獨子其子。使老有所終，壯有所用，幼有所長。', concept: '大同世界、天下為公、禮運大同', author: '孔子門人', dynasty: '先秦' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-57', text: '忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。土地平曠，屋舍儼然，有良田美池桑竹之屬。', concept: '桃花源記、隱逸理想', author: '陶淵明', dynasty: '晉代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-56', text: '夫人之相與，俯仰一世。或取諸懷抱，悟言一室之內；或因寄所託，放浪形骸之外。固知一死生為虛誕，齊彭殤為妄作。', concept: '蘭亭集序、宇宙萬殊、流觴曲水', author: '王羲之', dynasty: '晉代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-134', text: '先天下之憂而憂，後天下之樂而樂。不以物喜，不以己悲；居廟堂之高則憂其民，處江湖之遠則憂其君。', concept: '岳陽樓記、憂樂天下', author: '范仲淹', dynasty: '宋代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-140', text: '醉翁之意不在酒，在乎山水之間也。山水之樂，得之心而寓之酒也。野芳發而幽香，佳木秀而繁陰。', concept: '醉翁亭記、與民同樂', author: '歐陽脩', dynasty: '宋代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-143', text: '清風徐來，水波不興。舉酒屬客，誦明月之詩，歌窈窕之章。寄蜉蝣於天地，渺滄海之一粟。哀吾生之須臾，羨長江之無窮。', concept: '前赤壁賦、超然達觀、物我兩忘', author: '蘇軾', dynasty: '宋代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-105', text: '古之學者必有師。師者，所以傳道受業解惑也。人非生而知之者，孰能無惑？惑而不從師，其為惑也，終不解矣。', concept: '師說、尊師重道、不恥相師', author: '韓愈', dynasty: '唐代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-110', text: '世有伯樂，然後有千里馬。千里馬常有，而伯樂不常有。故雖有名馬，祇辱於奴隸人之手，駢死於槽櫪之間，不以千里稱也。', concept: '馬說、知人善任', author: '韓愈', dynasty: '唐代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-112', text: '小石潭記：坐潭上，四面竹樹環合，寂寥無人，淒神寒骨，悄愴幽邃。以其境過清，不可久居，乃記之而去。', concept: '永州八記、清幽寄託', author: '柳宗元', dynasty: '唐代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-120', text: '水陸草木之花，可愛者甚蕃。予獨愛蓮之出淤泥而不染，濯清漣而不妖，中通外直，不蔓不枝，香遠益清，亭亭淨植。', concept: '愛蓮說、君子品格', author: '周敦頤', dynasty: '宋代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-94', text: '臣密今年四十有四，祖母今年九十有六，是臣盡節於陛下之日長，報養劉之日短也。烏鳥私情，願乞終養。', concept: '陳情表、孝感天地', author: '李密', dynasty: '晉代' },
  { workId: 'gu-wen-guan-zhi', chapterId: 'gu-wen-guan-zhi_ch-54', text: '親賢臣，遠小人，此先漢所以興隆也；親小人，遠賢臣，此後漢所以傾頹也。受任於敗軍之際，奉命於危難之間。', concept: '出師表、鞠躬盡瘁', author: '諸葛亮', dynasty: '三國' },
  { workId: 'shiji', chapterId: 'shiji_ch-7', text: '項羽大呼馳下，漢軍皆披靡。力拔山兮氣蓋世，時不利兮騅不逝。騅不逝兮可奈何，虞兮虞兮奈若何！', concept: '項羽本紀、垓下之圍、霸王悲歌', author: '司馬遷', dynasty: '西漢' },
  { workId: 'shiji', chapterId: 'shiji_ch-47', text: '高山仰止，景行行止。雖不能至，然心鄉往之。余讀孔氏書，想見其為人。', concept: '孔子世家贊、仰止至聖', author: '司馬遷', dynasty: '西漢' },
  { workId: 'chun-qiu-zuo-zhuan', chapterId: 'chun-qiu-zuo-zhuan_ch-1', text: '多行不義必自斃，子姑待之。公入而賦：「大隧之中，其樂也融融！」姜出而賦：「大隧之外，其樂也洩洩！」', concept: '鄭伯克段于鄢、左傳名篇', author: '左丘明', dynasty: '春秋' },
  { workId: 'chun-qiu-zuo-zhuan', chapterId: 'chun-qiu-zuo-zhuan_ch-3', text: '肉食者鄙，未能遠謀。夫戰，勇氣也。一鼓作氣，再而衰，三而竭。彼竭我盈，故克之。', concept: '曹劌論戰、一鼓作氣', author: '左丘明', dynasty: '春秋' },
]

function buildIndex(): IndexedItem[] {
  if (index) return index
  const result: IndexedItem[] = []
  const workById = new Map(works.map(work => [work.id, work]))
  const chapterById = new Map(chapters.map(ch => [ch.id, ch]))

  const add = (item: Omit<IndexedItem, 'normalized'>) => {
    const normalized = normalizeSearchText(item.matchedText)
    if (normalized) {
      result.push({
        ...item,
        normalized,
      })
    }
  }

  // 1. 典籍書名與導讀索引
  for (const work of works) {
    const description = getWorkDescription(work.id)
    const common = {
      workId: work.id,
      workTitle: work.title,
      schoolId: work.schoolId,
      schoolName: schoolName(work.schoolId),
      dynasty: description?.period,
      author: description?.author,
    }

    const aliasInfo = WORK_ALIASES[work.id]
    const aliasStr = aliasInfo ? aliasInfo.aliases.join('・') : ''

    add({
      ...common,
      id: `work-${work.id}`,
      type: 'work',
      matchField: '典籍',
      matchedText: [work.title, work.subtitle, aliasStr, description?.author, description?.introduction].filter(Boolean).join('・'),
      baseScore: 100,
      initials: aliasInfo?.initials,
    })
  }

  // 2. 篇章章名索引
  for (const chapter of chapters) {
    const work = workById.get(chapter.workId)
    if (!work) continue
    const description = getWorkDescription(work.id)
    add({
      id: `chapter-${chapter.id}`,
      type: 'chapter',
      workId: work.id,
      workTitle: work.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      schoolId: work.schoolId,
      schoolName: schoolName(work.schoolId),
      dynasty: description?.period,
      matchField: '篇章',
      matchedText: [chapter.title, ...(chapter.tags || [])].join('・'),
      baseScore: 88,
    })
  }

  // 3. 傳世經典名句索引
  for (const quote of FAMOUS_QUOTES) {
    const work = workById.get(quote.workId)
    const chapter = chapterById.get(quote.chapterId)
    if (!work || !chapter) continue
    add({
      id: `quote-${quote.workId}-${quote.chapterId}-${quote.text.slice(0, 6)}`,
      type: 'sentence',
      workId: work.id,
      workTitle: work.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      schoolId: work.schoolId,
      schoolName: schoolName(work.schoolId),
      matchField: '經典金句',
      matchedText: `${quote.text}・${quote.concept}・${quote.author || ''}`,
      author: quote.author,
      dynasty: quote.dynasty,
      baseScore: 95,
    })
  }

  // 4. 唐詩宋詞元曲全量索引
  for (const poem of POETRY_COLLECTION) {
    const allLinesStr = poem.lines.join(' ')
    const keyVersesStr = poem.keyVerses ? poem.keyVerses.join(' ') : ''
    const cipaiStr = poem.cipai ? `詞牌:${poem.cipai}` : ''
    const qupaiStr = poem.qupai ? `曲牌:${poem.qupai}` : ''

    add({
      id: `poetry-${poem.id}`,
      type: 'poetry',
      workId: poem.type,
      workTitle: poem.type === 'tang' ? '唐詩' : poem.type === 'song' ? '宋詞' : '元曲',
      schoolId: 'poetry',
      schoolName: '詩詞曲',
      author: poem.author,
      dynasty: poem.dynasty,
      poemId: poem.id,
      matchField: '詩詞曲名篇',
      matchedText: `${poem.title}・${poem.author}・${cipaiStr}・${qupaiStr}・${poem.theme}・${keyVersesStr}・${allLinesStr}`,
      baseScore: 92,
    })
  }

  index = result
  return result
}

export function getSearchIndexStats() {
  const items = buildIndex()
  return {
    total: items.length,
    works: works.length,
    chapters: chapters.length,
    originalPassages: FAMOUS_QUOTES.length,
    poetry: POETRY_COLLECTION.length,
    sentences: FAMOUS_QUOTES.length,
  }
}

export function searchContent(rawQuery: string, options: SearchOptions = {}): SearchResult[] {
  const clean = rawQuery.trim().toLowerCase()
  if (!clean) return []

  const normalizedQuery = normalizeSearchText(clean)
  const { schoolFilter = 'all', typeFilter = 'all', limit = Number.POSITIVE_INFINITY } = options

  return buildIndex()
    .filter(item => {
      if (schoolFilter !== 'all' && item.schoolId !== schoolFilter) return false
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      return true
    })
    .filter(item => {
      // 1. 拼音首字母匹配 (例如 'ddj' 匹配道德經)
      if (item.initials && item.initials.toLowerCase().startsWith(clean)) {
        return true
      }
      // 2. 正規化字串匹配
      return item.normalized.includes(normalizedQuery)
    })
    .map(item => {
      let bonus = 0
      if (item.initials && item.initials.toLowerCase() === clean) {
        bonus += 50
      }
      if (item.normalized === normalizedQuery) {
        bonus += 40
      } else if (item.normalized.startsWith(normalizedQuery)) {
        bonus += 25
      } else if (item.matchedText.toLowerCase().includes(clean)) {
        bonus += 15
      }

      return {
        ...item,
        score: item.baseScore + bonus,
        snippet: highlightSnippet(item.matchedText, rawQuery),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
