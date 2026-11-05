export interface DictionaryDefinition {
  type?: string
  text: string
}

export interface DictionaryReading {
  bopomofo: string
  pinyin?: string
  definitions: DictionaryDefinition[]
}

export interface DictionaryEntry {
  word: string
  readings: DictionaryReading[]
  source: '萌典（教育部《重編國語辭典修訂本》資料）'
}

export interface ClassicalGrammarNote {
  char: string
  pinyin: string
  category: '文言虛詞' | '核心實詞' | '通假破音' | '哲學範疇'
  usages: {
    role: string
    meaning: string
    example: string
  }[]
}

export const CLASSICAL_GRAMMAR_LEXICON: Record<string, ClassicalGrammarNote> = {
  '之': {
    char: '之',
    pinyin: 'zhī',
    category: '文言虛詞',
    usages: [
      { role: '結構助詞', meaning: '相當於「的」', example: '《論語》：「道千乘之國。」' },
      { role: '代詞', meaning: '代指人、事、物（他、它、這）', example: '《論語》：「學而時習之，不亦說乎？」' },
      { role: '助詞（取獨）', meaning: '置於主謂之間，取消句子獨立性', example: '《愛蓮說》：「予獨愛蓮之出淤泥而不染。」' },
      { role: '動詞', meaning: '往、到……去', example: '《孟子》：「吾欲之楚。」' },
    ],
  },
  '乎': {
    char: '乎',
    pinyin: 'hū',
    category: '文言虛詞',
    usages: [
      { role: '語氣助詞', meaning: '表疑問或反詰，相當於「嗎、呢」', example: '《論語》：「人不知而不慍，不亦君子乎？」' },
      { role: '介詞', meaning: '相當於「於」（在、對、比）', example: '《醉翁亭記》：「醉翁之意不在酒，在乎山水之間也。」' },
      { role: '詞尾助詞', meaning: '附於形容詞後，表狀態（……的樣子）', example: '《莊子》：「恢恢乎其於遊刃必有餘地矣。」' },
    ],
  },
  '者': {
    char: '者',
    pinyin: 'zhě',
    category: '文言虛詞',
    usages: [
      { role: '代詞性助詞', meaning: '指代「……的人、事、物」', example: '《論語》：「知之者不如好之者，好之者不如樂之者。」' },
      { role: '語氣助詞', meaning: '置於主語後表提頓與判斷，常與「也」呼應', example: '《師說》：「師者，所以傳道受業解惑也。」' },
    ],
  },
  '也': {
    char: '也',
    pinyin: 'yě',
    category: '文言虛詞',
    usages: [
      { role: '句末語氣詞', meaning: '表判斷與肯定語氣', example: '《孫子兵法》：「兵者，國之大事……不可不察也。」' },
      { role: '句中語氣詞', meaning: '表停頓，舒緩語氣以引出下文', example: '《莊子》：「吾生也有涯，而知也無涯。」' },
    ],
  },
  '以': {
    char: '以',
    pinyin: 'yǐ',
    category: '文言虛詞',
    usages: [
      { role: '介詞', meaning: '用、憑藉、拿、按照', example: '《論語》：「為政以德，譬如北辰。」' },
      { role: '介詞', meaning: '因為、由於', example: '《岳陽樓記》：「不以物喜，不以己悲。」' },
      { role: '連詞', meaning: '表目的或結果（用來、以便、以致）', example: '《道德經》：「常無，欲以觀其妙。」' },
      { role: '動詞', meaning: '認為、任用', example: '《論語》：「視其所以，觀其所由。」' },
    ],
  },
  '於': {
    char: '於',
    pinyin: 'yú',
    category: '文言虛詞',
    usages: [
      { role: '介詞（處所／時間）', meaning: '在、從、到', example: '《荀子》：「青，取之於藍，而青於藍。」' },
      { role: '介詞（比較）', meaning: '比……更……', example: '《荀子》：「冰，水為之，而寒於水。」' },
      { role: '介詞（對象／被動）', meaning: '對、向、被', example: '《論語》：「己所不欲，勿施於人。」' },
    ],
  },
  '而': {
    char: '而',
    pinyin: 'ér',
    category: '文言虛詞',
    usages: [
      { role: '連詞（順承）', meaning: '就、接著、而且', example: '《論語》：「學而時習之。」' },
      { role: '連詞（轉折）', meaning: '卻、但是、然而', example: '《論語》：「人不知而不慍。」' },
      { role: '連詞（修飾）', meaning: '連接狀語與動詞（地、著）', example: '《莊子》：「怒而飛，其翼若垂天之雲。」' },
    ],
  },
  '則': {
    char: '則',
    pinyin: 'zé',
    category: '文言虛詞',
    usages: [
      { role: '連詞', meaning: '就、那麼、便（表因果或條件）', example: '《論語》：「學而不思則罔，思而不學則殆。」' },
      { role: '連詞（對比）', meaning: '卻、則是', example: '《岳陽樓記》：「居廟堂之高則憂其民，處江湖之遠則憂其君。」' },
      { role: '名詞', meaning: '法則、準則、模範', example: '《詩經》：「天生烝民，有物有則。」' },
    ],
  },
  '乃': {
    char: '乃',
    pinyin: 'nǎi',
    category: '文言虛詞',
    usages: [
      { role: '副詞', meaning: '於是、才、就', example: '《桃花源記》：「乃記之而去。」' },
      { role: '副詞（轉折）', meaning: '竟然、卻（表出乎意料）', example: '《桃花源記》：「乃不知有漢，無論魏晉。」' },
      { role: '代詞', meaning: '你、你的（通「爾」）', example: '《示兒》：「家祭無忘告乃翁。」' },
    ],
  },
  '其': {
    char: '其',
    pinyin: 'qí',
    category: '文言虛詞',
    usages: [
      { role: '代詞', meaning: '他的、它的、那、其中的', example: '《論語》：「擇其善者而從之，其不善者而改之。」' },
      { role: '語氣副詞', meaning: '表推測、反詰或期勉（大概、難道、應當）', example: '《莊子》：「天之蒼蒼，其正色邪？」' },
    ],
  },
  '焉': {
    char: '焉',
    pinyin: 'yān',
    category: '文言虛詞',
    usages: [
      { role: '兼詞', meaning: '相當於「於之、於此」（在其中、在這裡）', example: '《論語》：「三人行，必有我師焉。」' },
      { role: '疑問代詞', meaning: '哪裡、怎麼', example: '《論語》：「未知生，焉知死？」' },
      { role: '語氣助詞', meaning: '置於句末表陳述或感嘆', example: '《中庸》：「致中和，天地位焉，萬物育焉。」' },
    ],
  },
  '矣': {
    char: '矣',
    pinyin: 'yǐ',
    category: '文言虛詞',
    usages: [
      { role: '語氣助詞', meaning: '相當於「了」，表事態已然或必然', example: '《論語》：「溫故而知新，可以為師矣。」' },
    ],
  },
  '夫': {
    char: '夫',
    pinyin: 'fú / fū',
    category: '文言虛詞',
    usages: [
      { role: '發語詞（讀 fú）', meaning: '置於句首，引出議論（至於說到、那）', example: '《孫子兵法》：「夫兵形象水，水之行避高而趨下。」' },
      { role: '句末感嘆詞（讀 fú）', meaning: '相當於「啊、吧」', example: '《論語》：「逝者如斯夫！不舍晝夜。」' },
      { role: '名詞（讀 fū）', meaning: '成年男子、大丈夫', example: '《孟子》：「此之謂大丈夫。」' },
    ],
  },
  '說': {
    char: '說',
    pinyin: 'yuè / shuō / shuì',
    category: '通假破音',
    usages: [
      { role: '通假字（讀 yuè）', meaning: '通「悅」，喜悅、高興', example: '《論語》：「學而時習之，不亦說乎？」' },
      { role: '動詞（讀 shuì）', meaning: '遊說、勸說', example: '《韓非子》：「凡說之難，在知所說之心。」' },
      { role: '文體／動詞（讀 shuō）', meaning: '解說、論述文體', example: '韓愈《師說》、周敦頤《愛蓮說》。' },
    ],
  },
  '見': {
    char: '見',
    pinyin: 'jiàn / xiàn',
    category: '通假破音',
    usages: [
      { role: '通假字（讀 xiàn）', meaning: '通「現」，顯露、出現、表現', example: '《中庸》：「莫見乎隱，莫顯乎微。」' },
      { role: '動詞（讀 jiàn）', meaning: '看見、拜見、洞察', example: '《論語》：「見賢思齊焉，見不賢而內自省也。」' },
      { role: '助詞（讀 jiàn）', meaning: '表被動（被）或指代第一人稱（我）', example: '《史記》：「信而見疑，忠而被謗。」' },
    ],
  },
  '知': {
    char: '知',
    pinyin: 'zhī / zhì',
    category: '通假破音',
    usages: [
      { role: '通假字（讀 zhì）', meaning: '通「智」，智慧、明智', example: '《論語》：「知者不惑，仁者不憂，勇者不懼。」' },
      { role: '動詞（讀 zhī）', meaning: '瞭解、懂得、明白', example: '《孫子兵法》：「知彼知己，百戰不殆。」' },
    ],
  },
  '女': {
    char: '女',
    pinyin: 'rǔ / nǚ',
    category: '通假破音',
    usages: [
      { role: '通假字（讀 rǔ）', meaning: '通「汝」，第二人稱代詞「你」', example: '《論語》：「由，誨女知之乎！」' },
      { role: '名詞（讀 nǚ）', meaning: '女子、女兒', example: '《詩經》：「窈窕淑女，君子好逑。」' },
    ],
  },
  '道': {
    char: '道',
    pinyin: 'dào',
    category: '哲學範疇',
    usages: [
      { role: '哲學本體', meaning: '宇宙萬物運行的根本法則與本源', example: '《道德經》：「道可道，非常道。」' },
      { role: '動詞', meaning: '言說、治理、引導（通「導」）', example: '《論語》：「道之以政，齊之以刑。」' },
      { role: '名詞', meaning: '道路、仁義正道、方法', example: '《孟子》：「得道者多助，失道者寡助。」' },
    ],
  },
  '仁': {
    char: '仁',
    pinyin: 'rén',
    category: '哲學範疇',
    usages: [
      { role: '儒家核心', meaning: '愛人、忠恕、發自本心的慈愛與同理德性', example: '《論語》：「克己復禮為仁。」' },
    ],
  },
  '義': {
    char: '義',
    pinyin: 'yì',
    category: '哲學範疇',
    usages: [
      { role: '道德準則', meaning: '合宜之正道、道義與公理擔當', example: '《孟子》：「二者不可得兼，舍生而取義者也。」' },
    ],
  },
  '故': {
    char: '故',
    pinyin: 'gù',
    category: '核心實詞',
    usages: [
      { role: '連詞', meaning: '所以、因此', example: '《道德經》：「夫唯不爭，故無尤。」' },
      { role: '名詞／形容詞', meaning: '舊的、原有的知識或緣故', example: '《論語》：「溫故而知新，可以為師矣。」' },
    ],
  },
  '善': {
    char: '善',
    pinyin: 'shàn',
    category: '核心實詞',
    usages: [
      { role: '動詞／副詞', meaning: '擅長、善於、好好地', example: '《荀子》：「君子生非異也，善假於物也。」' },
      { role: '名詞／形容詞', meaning: '美好、良善、高明境界', example: '《道德經》：「上善若水。水善利萬物而不爭。」' },
    ],
  },
  '微': {
    char: '微',
    pinyin: 'wēi',
    category: '核心實詞',
    usages: [
      { role: '否定副詞', meaning: '如果沒有、若非', example: '《岳陽樓記》：「微斯人，吾誰與歸！」' },
      { role: '形容詞', meaning: '細微、隱微、精深微妙', example: '《中庸》：「莫見乎隱，莫顯乎微。」' },
    ],
  },
  '誠': {
    char: '誠',
    pinyin: 'chéng',
    category: '核心實詞',
    usages: [
      { role: '連詞', meaning: '如果、果真、假使', example: '《孟子》：「誠如是也，民歸之，由水之就下。」' },
      { role: '副詞／名詞', meaning: '實在、確實；真誠無妄之本體', example: '《中庸》：「誠者，天之道也；誠之者，人之道也。」' },
    ],
  },
  '固': {
    char: '固',
    pinyin: 'gù',
    category: '核心實詞',
    usages: [
      { role: '副詞', meaning: '本來、固然、確實', example: '《師說》：「生乎吾前，其聞道也固先乎吾。」' },
      { role: '形容詞', meaning: '堅固、固執、鄙陋', example: '《論語》：「學則不固。」' },
    ],
  },
  '殆': {
    char: '殆',
    pinyin: 'dài',
    category: '核心實詞',
    usages: [
      { role: '形容詞', meaning: '危險、危殆、疑惑不安', example: '《孫子兵法》：「知彼知己，百戰不殆。」' },
      { role: '副詞', meaning: '大概、幾乎、恐怕', example: '《莊子》：「以有涯隨無涯，殆已！」' },
    ],
  },
  '信': {
    char: '信',
    pinyin: 'xìn / shēn',
    category: '核心實詞',
    usages: [
      { role: '名詞／形容詞', meaning: '誠信、守信、真實不欺', example: '《道德經》：「信言不美，美言不信。」' },
      { role: '副詞', meaning: '隨意、任憑；確實', example: '《琵琶行》：「低眉信手續續彈。」' },
      { role: '通假字（讀 shēn）', meaning: '通「伸」，伸展、伸張', example: '《隆中對》：「欲信大義於天下。」' },
    ],
  },
  '厭': {
    char: '厭',
    pinyin: 'yàn / yā',
    category: '核心實詞',
    usages: [
      { role: '動詞', meaning: '滿足、飽足（古義常指滿足而非討厭）', example: '《論語》：「學而不厭，誨人不倦。」' },
    ],
  },
  '去': {
    char: '去',
    pinyin: 'qù',
    category: '核心實詞',
    usages: [
      { role: '動詞（古今異義）', meaning: '離開、距離（古文「去」指離開某地，非往某地）', example: '《岳陽樓記》：「則有去國懷鄉，憂讒畏譏。」' },
    ],
  },
  '走': {
    char: '走',
    pinyin: 'zǒu',
    category: '核心實詞',
    usages: [
      { role: '動詞（古今異義）', meaning: '奔跑、疾行（古文「行」為慢走，「走」為快跑）', example: '《韓非子》：「兔走觸株，折頸而死。」' },
    ],
  },
}

export function getClassicalGrammarNote(word: string): ClassicalGrammarNote | null {
  const normalized = Array.from(word.trim())[0]
  if (!normalized) return null
  return CLASSICAL_GRAMMAR_LEXICON[normalized] || null
}

interface MoedictDefinition {
  def?: string
  type?: string
}

interface MoedictHeteronym {
  bopomofo?: string
  pinyin?: string
  definitions?: MoedictDefinition[]
}

interface MoedictResponse {
  title?: string
  heteronyms?: MoedictHeteronym[]
}

const API_BASE = 'https://www.moedict.tw/'
const CACHE_PREFIX = 'litc-dictionary-v1:'
const REQUEST_TIMEOUT_MS = 8000

function plainText(value = ''): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function cacheKey(word: string): string {
  return `${CACHE_PREFIX}${word}`
}

function readCache(word: string): DictionaryEntry | null {
  try {
    const raw = localStorage.getItem(cacheKey(word))
    return raw ? JSON.parse(raw) as DictionaryEntry : null
  } catch {
    return null
  }
}

function writeCache(word: string, entry: DictionaryEntry): void {
  try {
    localStorage.setItem(cacheKey(word), JSON.stringify(entry))
  } catch {
    // 私密瀏覽或儲存空間不足時，查詢本身仍可正常使用。
  }
}

export async function lookupDictionary(word: string): Promise<DictionaryEntry | null> {
  const normalized = Array.from(word.trim())[0]
  if (!normalized) return null

  const cached = readCache(normalized)
  if (cached) return cached

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${encodeURIComponent(normalized)}.json`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) return null

    const data = await response.json() as MoedictResponse
    const readings = (data.heteronyms ?? []).map((reading) => ({
      bopomofo: plainText(reading.bopomofo),
      pinyin: plainText(reading.pinyin),
      definitions: (reading.definitions ?? [])
        .map((definition) => ({ type: plainText(definition.type), text: plainText(definition.def) }))
        .filter((definition) => definition.text),
    })).filter((reading) => reading.bopomofo || reading.definitions.length)

    if (!readings.length) return null
    const entry: DictionaryEntry = {
      word: plainText(data.title) || normalized,
      readings,
      source: '萌典（教育部《重編國語辭典修訂本》資料）',
    }
    writeCache(normalized, entry)
    return entry
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

export function dictionarySourceLinks(word: string) {
  const query = encodeURIComponent(word)
  return [
    { label: '教育部《重編國語辭典》', url: `https://dict.revised.moe.edu.tw/search.jsp?la=0&powerMode=0&word=${query}` },
    { label: '教育部《國語辭典簡編本》', url: `https://dict.concised.moe.edu.tw/search.jsp?la=0&powerMode=0&word=${query}` },
    { label: '教育部《異體字字典》', url: `https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD=${query}` },
    { label: '萌典完整詞條', url: `https://www.moedict.tw/${query}` },
  ]
}
