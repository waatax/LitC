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
