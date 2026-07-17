import type { Sentence } from '../types/content'

/**
 * 白話輔讀的編輯原則：這不是逐字機器翻譯，而是讓背誦者先掌握句意。
 * 優先採用已校讀的名句；其餘句子保留原句並提供可讀的語法／詞義支架。
 */
const EDITED_HINTS: Record<string, string> = {
  '道可道，非常道。名可名，非常名。': '可以說得出的「道」，不是永恆不變的道；可以叫得出的名稱，也不是事物最根本、固定的名稱。',
  '無名天地之始；有名萬物之母。': '未被命名時，是天地萬物的開端；有了名稱與分別後，便成為萬物生發的根源。',
  '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。': '最高的善像水：滋養萬物卻不爭功，安處在人們不喜歡的低處，因此最接近「道」。',
  '知人者智，自知者明。': '能了解別人是聰明；能真正了解自己，才算明白。',
  '千里之行，始於足下。': '再遠的路，也要從眼前的一步開始。',
  '吾生也有涯，而知也無涯。': '人的生命有限，而知識沒有盡頭。',
  '子曰：學而時習之，不亦說乎？': '孔子說：學習後能在適當時候溫習、實踐，不也是很愉快嗎？',
  '有朋自遠方來，不亦樂乎？': '有志同道合的朋友從遠方來，不也是很快樂嗎？',
  '人不知而不慍，不亦君子乎？': '別人不了解自己卻不怨恨，這不正是君子的修養嗎？',
  '溫故而知新，可以為師矣。': '能溫習舊知識並得到新體會，就可以做別人的老師。',
  '學而不思則罔，思而不學則殆。': '只學不思考會迷惘；只空想不學習則危險而沒有根基。',
  '己所不欲，勿施於人。': '自己不願承受的事，不要加在別人身上。',
  '三人行，必有我師焉。': '幾個人同行，其中一定有人有值得我學習的地方。',
  '天將降大任於是人也，必先苦其心志，勞其筋骨。': '上天若要把重大責任交給一個人，會先用困苦磨鍊他的意志與身體。',
  '得道者多助，失道者寡助。': '行事合乎正道、得到人心的人，幫助他的人多；背離正道的人，幫助就少。',
  '富貴不能淫，貧賤不能移，威武不能屈。': '富貴不能使他放縱，貧賤不能改變他的志節，強權也不能使他屈服。',
  '大學之道，在明明德，在親民，在止於至善。': '大學教育的宗旨，是彰顯本有的光明德性、使人更新向善，並安住在最高的善。',
  '知止而后有定；定而后能靜；靜而后能安；安而后能慮；慮而后能得。': '知道目標與界限，心志才能安定；安定後才能沉靜、安穩、周詳思考，最後有所成就。',
  '天命之謂性；率性之謂道；修道之謂教。': '天所賦予人的本性叫「性」；依循本性而行叫「道」；修養這條道叫「教」。',
  '喜怒哀樂之未發，謂之中；發而皆中節，謂之和。': '喜怒哀樂尚未表現時叫「中」；表現出來而恰到好處叫「和」。',
}

const TERMS: Array<[RegExp, string]> = [
  [/子曰[：:]/g, '孔子說：'], [/孟子曰[：:]/g, '孟子說：'],
  [/君子/g, '有德行的人'], [/小人/g, '只顧私利的人'], [/仁/g, '仁愛'],
  [/義/g, '合宜正當的原則'], [/禮/g, '合乎分際的禮法'], [/道/g, '道理與正道'],
  [/德/g, '德行'], [/學/g, '學習'], [/知/g, '知道'], [/曰/g, '說'],
]

function scaffold(text: string, workId: string): string {
  const school = workId === 'dao-de-jing' || workId === 'zhuangzi' ? '道家' : '儒家'
  let modern = text.replace(/[「」]/g, '').replace(/；/g, '；')
  for (const [pattern, replacement] of TERMS) modern = modern.replace(pattern, replacement)
  // 長句若完全逐字替換反而難讀，因此明確標示為讀法支架，而非引文翻譯。
  return `${school}輔讀：本句重點在「${modern.slice(0, 52)}${modern.length > 52 ? '…' : ''}」。先依關鍵詞與上下句判讀其主張。`
}

export function getReadingAid(sentence: Sentence, workId: string): string | undefined {
  if (sentence.translationHint && sentence.translationHint !== '此句釋義提示。') return sentence.translationHint
  if (workId !== 'dao-de-jing' && workId !== 'zhuangzi' &&
      !['da-xue', 'zhong-yong', 'lun-yu', 'meng-zi', 'yi-jing', 'shu-jing', 'shi-jing', 'li-ji', 'chun-qiu'].includes(workId)) return sentence.translationHint
  return EDITED_HINTS[sentence.canonicalText] ?? scaffold(sentence.canonicalText, workId)
}

export const READING_AID_SOURCES = [
  { label: '使用者指定的經典輔讀索引', url: 'http://www.xn--5rtnx620bw5s.tw/f/f01/02.htm' },
  { label: '中國哲學書電子化計劃（原典校讀）', url: 'https://ctext.org/' },
  { label: '臺灣華文電子書庫《四書白話句解》', url: 'https://taiwanebook.ncl.edu.tw/zh-tw/book/FJU-E312062A/reader' },
]
