export type WenhaiResourceKind = '原典檢索' | '善本影像' | '註釋賞析' | '專題研究'

export interface WenhaiResource {
  name: string
  url: string
  kind: WenhaiResourceKind
  organization: string
  description: string
  bestFor: string
  language: string
}

/** 經人工核對的站外研究資源；連結僅指向公開首頁或穩定入口。 */
export const WENHAI_RESOURCES: WenhaiResource[] = [
  {
    name: '中國哲學書電子化計劃',
    url: 'https://ctext.org/zh',
    kind: '原典檢索',
    organization: 'Chinese Text Project',
    description: '開放的中國古籍全文庫，涵蓋先秦兩漢至後世文獻，提供全文檢索、字典、異文及影印本對照。',
    bestFor: '校讀先秦諸子、查找古文語句與跨典籍用例',
    language: '繁中／簡中／英文',
  },
  {
    name: '漢籍電子文獻資料庫',
    url: 'https://hanji.sinica.edu.tw/',
    kind: '原典檢索',
    organization: '中央研究院歷史語言研究所',
    description: '大型學術漢籍全文資料庫，收錄十三經、二十五史、文學、小說戲曲與臺灣文獻等研究語料。',
    bestFor: '嚴謹全文檢索、詞彙統計與史料互證',
    language: '繁體中文',
  },
  {
    name: '古籍與特藏文獻資源',
    url: 'https://rbook.ncl.edu.tw/NCLSearch/Search',
    kind: '善本影像',
    organization: '國家圖書館',
    description: '整合古籍影像、中文古籍聯合目錄、金石拓片、家譜及善本題跋，可直接查看珍貴版本。',
    bestFor: '版本考證、查善本書影與題跋',
    language: '繁體中文',
  },
  {
    name: '臺灣華文電子書庫',
    url: 'https://taiwanebook.ncl.edu.tw/zh-tw',
    kind: '善本影像',
    organization: '國家圖書館',
    description: '開放取用的近代華文圖書庫，保存大量民國時期古籍整理、國學讀本、文學選本與早期研究著作。',
    bestFor: '尋找古文舊注、民國國學讀本與研究史料',
    language: '繁體中文',
  },
  {
    name: '中文維基文庫',
    url: 'https://zh.wikisource.org/',
    kind: '原典檢索',
    organization: 'Wikimedia Foundation',
    description: '自由版權文本庫，古籍、詩文與歷代文集種類廣，適合快速瀏覽、交叉連結與版本初查。',
    bestFor: '快速找全文、作者作品與相關條目',
    language: '繁中／簡中',
  },
  {
    name: '漢籍リポジトリ（Kanripo）',
    url: 'https://www.kanripo.org/',
    kind: '專題研究',
    organization: '京都大學人文科學研究所',
    description: '面向研究者的開放漢籍文本庫，保留版本與結構資訊，支援學術引用及數位人文應用。',
    bestFor: '跨版本文本、東亞漢籍與可計算研究',
    language: '中文／日文／英文',
  },
  {
    name: 'CBETA Online',
    url: 'https://cbetaonline.dila.edu.tw/',
    kind: '專題研究',
    organization: '中華電子佛典協會',
    description: '高品質佛典與漢文宗教文獻資料庫，具科判、校注、辭典及全文搜尋，亦保存大量古典語彙用例。',
    bestFor: '佛典古文、宗教思想及中古漢語研究',
    language: '繁體中文',
  },
  {
    name: 'Chinese Rare Books',
    url: 'https://curiosity.lib.harvard.edu/chinese-rare-books',
    kind: '善本影像',
    organization: 'Harvard Library',
    description: '哈佛燕京圖書館中文善本數位典藏，提供高解析書影、書目資訊與珍稀刻本線上閱覽。',
    bestFor: '海外漢籍善本、刻本版式與收藏研究',
    language: '英文／中文書目',
  },
  {
    name: '古文島',
    url: 'https://www.guwendao.net/',
    kind: '註釋賞析',
    organization: '古文學習分享平台',
    description: '以古詩文閱讀為主，常見名篇附原文、翻譯、註釋與賞析，版面適合一般讀者延伸學習。',
    bestFor: '入門閱讀、白話翻譯與名篇賞析',
    language: '簡體中文',
  },
  {
    name: '古詩文網',
    url: 'https://www.gushiwen.cn/',
    kind: '註釋賞析',
    organization: '古詩文學習分享平台',
    description: '收錄大量詩、詞、曲與古文名篇，提供作者資料、註釋、譯文、賞析及主題分類。',
    bestFor: '名篇導讀、作者脈絡與教學參考',
    language: '簡體中文',
  },
]
