# 經典文脈 ClassicFlow — Master Plan（第一性原理定案版）

> **文件版本**：v3.0（整合三份前置文件後之定案版）
> **前置文件**：
> 1. 本人 v2.0 草案（六角色專家團隊初版）
> 2. 您提供的 `LitC Implementation.MD`（Vue3 工程執行藍圖）
> 3. 您提供的 `ClassicFlow Master Plan v1.0`（完整產品規格，含五輪審核紀錄）
> **本版工作**：不是三份文件的拼接，而是先拆解到「為什麼要背古文、什麼機制真的讓人記住」的第一性原理，再重新推導出唯一一份架構決策，並在有衝突處明確裁決、標註理由。

---

## 0. 誠實揭露（延續前版聲明）

我目前的對話環境仍**沒有網頁瀏覽/搜尋工具**。您提供的 `ClassicFlow Master Plan` 文件中列出的 NChain repo、學習科學論文連結（Dunlosky、Cepeda 等）、古文島／西窗燭等網站，**我沒有能力重新驗證這些連結是否存在或內容是否準確**——我是把它們當作「您提供的參考輸入」來使用，就像閱讀一份上傳文件一樣，而不是我自己查證過的事實。若這些引用對您很重要（例如要放進正式文件），建議之後用瀏覽工具覆核一次。

這一版的價值不在於「查得更多」，而在於**用第一性原理把三份文件的架構決策重新驗證一遍，砍掉沒有站得住腳理由的部分，補齊邏輯斷點**。

---

## 1. 第一性原理推導鏈

在決定任何技術棧或功能之前，先回到最底層的事實，一條一條往上推：

**F1. 人會忘記，這是預設狀態，不是意外。**
記憶不會因為「讀過」或「看起來記得」就留下，會隨時間指數衰減（遺忘曲線）。

**F2. 對抗遺忘唯一被驗證有效的機制是「主動提取」＋「間隔重複」。**
單純重複閱讀（passive review）對長期保留幫助很小；讓大腦在快要忘記時「用力想起來」，才會強化記憶痕跡。
→ **推論**：任何「讀三次」「停留 5 分鐘」就判定熟練的設計都是偽指標，必須廢棄。（三份文件在這點上一致，予以保留。）

**F3. 提取練習必須落在「適度困難」區間。**
太容易（看得到答案的辨認題）沒有鍛鍊效果；太難（完全無提示默寫一篇 900 字的〈公輸〉）會導致挫敗放棄。
→ **推論**：需要一個**提示階梯（Hint Ladder）**，讓困難度可以連續調整，而不是「有提示 / 無提示」二選一。

**F4. 人類工作記憶一次只能處理約 4±1 個組塊。**
超過這個負荷，記憶會斷裂。古文的長句（如〈公輸〉單段可達數百字）若直接整段要求背誦，違反這條硬限制。
→ **推論**：內容必須有「句子」與「語義塊（chunk）」兩層顆粒度，讓長句可以先拆後合。

**F5. 不同文體的「可記憶結構」本質不同，這是無法迴避的內容事實。**
- 道德經：格言體、對仗、韻律感強 → 適合韻律／首字提示。
- 莊子：寓言敘事、意象強烈（鯤化鵬、渾沌鑿竅）→ 適合心像／故事骨架。
- 韓非子、商君書：論說體，無韻律可依，靠邏輯鏈 → 適合論證結構圖。
- 墨子：大量排比遞進句式（「至攘人犬豕雞豚者⋯至入人欄廄⋯」）→ 適合句式模板代換記憶。
→ **推論**：練習引擎不能是單一題型庫，必須依內容的 `genre_strategy` 標籤動態組合題型。（這是我 v2 版本提出、但 `ClassicFlow Master Plan` 沒有明確採用的一點，這一版**予以保留並整合進統一資料模型**。）

**F6. 如果背下去的文字本身有誤，那是負向資產，而且很難被日後的自己糾正。**
原始檔案已聲明「不主張為唯一權威定本」，且先秦古籍存在大量版本異文。一個記憶系統若沒有版本／異文管理，等於在幫使用者「牢牢記住可能是錯的東西」。
→ **推論**：文本溯源（來源、底本、異文）的優先級**必須與記憶引擎同級**，不是錦上添花的 P1 功能。（`ClassicFlow Master Plan` 這點判斷正確，予以保留。）

**F7. 修訂內容（改錯字、重新拆句）不能摧毀使用者已經累積的記憶進度。**
如果每次校勘微調都讓使用者的複習排程歸零，會直接毀掉產品的核心價值主張。
→ **推論**：內容必須有**穩定 ID＋遷移機制（migration）**，這是資料模型的硬約束，不是「進階功能」。

**F8. 背誦是一個需要每天發生的習慣行為，中斷存取（沒網路、換裝置、重新整理頁面）會打斷這個迴圈。**
→ **推論**：本機優先、可離線、重新整理不遺失進度，是**結構性需求**，不是 Phase 2 才做的加分項。
→ **推論之二**：儲存機制必須撐得住「數千張複習卡＋內容快取＋離線可用」的資料量與存取模式。`localStorage` 同步阻塞、容量通常僅 5–10MB，**不適任**；`IndexedDB`（透過 Dexie.js 封裝）才符合這個規模與非同步存取需求。
→ **這是我 v2 版本與另外兩份文件最大的分歧點，此處第一性原理判定：v2 建議的「Astro/Next + localStorage」不成立，改採 IndexedDB／PWA 路線（詳見第 4 章技術棧裁決）。**

**F9. 介面複雜度本身會佔用做「提取練習」這件核心任務的認知資源。**
→ **推論**：閱讀（安靜、低互動）與練習（高互動、單一任務）必須明確分離；遊戲化與裝飾動效優先權必須低於「回想」這個訊號，不能互相干擾。

**F10. 產品是否有效，只能由「延遲後還記得多少」來驗證，不能由參與度代理指標（停留時間、點擊數）驗證。**
→ **推論**：北極星指標必須是「30 日後仍能正確回想的句子數量」，分析事件也必須圍繞這條 recall funnel 設計，而不是虛榮指標。

這十條，是接下來所有架構決策的唯一依據；後面每一個技術/產品決定，都可以回頭對應到 F1–F10 其中之一。

---

## 2. 三份文件的衝突裁決表

| 議題 | v2 草案（我方） | Implementation.MD / ClassicFlow | 第一性原理裁決 | 依據 |
|---|---|---|---|---|
| 本機儲存 | localStorage | IndexedDB + Dexie.js | **採用 IndexedDB** | F8 |
| 前端框架 | Astro/Next（未定案） | Vue 3 + TS + Vite | **採用 Vue 3 + TS + Vite** | 兩份獨立文件收斂到同一選擇，且無違反 F1–F10 之處，採用以降低決策風險 |
| 內容顆粒度 | 家→典籍→篇章→段落→意群 | School→Work→Chapter→Passage→Sentence→Chunk | **採用六層（多一層 Sentence）** | F4，句子需要獨立作為複習卡單位，比「段落」更細一級才能精準定位遺忘點 |
| 記憶策略是否依文體分流 | 有（`memory_strategy` 標籤） | 無明確機制，題型庫是通用的 | **保留並整合**：新增 `genreStrategy` 欄位於 Work/Chapter 層級 | F5 |
| 鎖鏈解鎖視覺隱喻 | 軟性解鎖（地圖always可瀏覽） | 未特別討論 UI 隱喻 | **保留軟性解鎖**，作為典籍庫的視覺呈現方式，不影響資料架構 | F9（不強制單一路徑，降低認知/情緒負擔） |
| 熟練度判定 | 未細緻定義 | 七種狀態（未開始→已接觸→初步記住→學習中→穩定→薄弱→暫停），排程器 adapter | **完整採用** | F2, F3 |
| ID 穩定性與內容遷移 | 未處理 | 完整規則（stable ID + migration map + tombstone） | **完整採用** | F7 |
| 版權/隱私/遙測白名單 | 未處理 | 完整規則 | **完整採用** | F6（延伸出的信任要求）與一般產品倫理 |
| MVP 範圍 | 道德經優先（21 章） | 48 章全收但控制功能範圍（P0/P1/P2） | **採用「48 章全收、功能分階段」**，但**保留道德經作為第一個完整驗證垂直切片（vertical slice）** | 見第 6 章說明 |
| 遊戲化強度 | 低調可關閉 | 溫和連續天數＋里程碑成就，明確排除排行榜/抽卡 | **完整採用** | F9, F10 |
| 北極星指標 | 未定義 | 30 日保留率 | **完整採用** | F10 |

> 結論：**技術棧與資料模型深度採用另外兩份文件的判斷**（因為它們更貼近 F7、F8 的硬約束），**但保留並強化 v2 提出的「文體差異化記憶策略」**（因為它是另外兩份文件的邏輯空白，且直接對應 F5）。

---

## 3. 內容基線（精算數據，取代前版估算值）

前面文件對字數/句數僅為粗估，這一版用程式重新精算原始檔案：

| 典籍 | 篇章數 | 中文字數（精算） | 句讀數（精算，依「。；！？」切分） |
|---|---:|---:|---:|
| 道德經 | 21 | 1,238 | 127 |
| 莊子 | 9 | 1,636 | 129 |
| 韓非子 | 8 | 1,311 | 81 |
| 商君書 | 3 | 583 | 44 |
| 墨子 | 7 | 1,784 | 139 |
| **合計** | **48** | **6,552** | **520** |

> 句讀數是以標點初步切分的**上限估計**（尚未區分獨立可背誦句 vs. 附屬子句），正式內容工程階段仍須人工覆核出「Sentence 卡片」的實際數量，預期會少於 520（因為部分子句需合併才有完整語義）。這是 ETL 驗證階段（第 7 章）要處理的工作，不在本規劃階段虛報精確度。

**產品意義**：全部 48 章、約 6,500 字、約 500 句候選卡片，是一個**單人可在 2–3 週內完成人工校對＋分塊**的規模，不需要眾包或自動化 NLP 分句，這直接支持「MVP 全收 48 章」的可行性（呼應第 2 章的裁決）。

---

## 4. 技術棧裁決（定案，不再反覆討論）

依 F7、F8 與兩份參考文件的收斂結果，**技術棧在此定案**：

| 層次 | 選擇 | 裁決理由 |
|---|---|---|
| 前端框架 | Vue 3 + TypeScript + Vite | 兩份獨立文件收斂 |
| 路由 | Vue Router | 標準配套 |
| 狀態管理 | Pinia（僅 UI／session 狀態） | F9：核心記憶資料不該混進 UI store |
| 內容資料驗證 | Zod（Runtime Schema） | F7：內容進 build 前必須通過型別/完整性檢查 |
| 本機資料庫 | IndexedDB（Dexie.js 封裝） | F8：容量與非同步存取需求 |
| 排程演算法 | FSRS 類 adapter，封裝於 `ReviewScheduler` 介面 | F2, F3：UI 不依賴特定演算法欄位，未來可替換 |
| PWA／離線 | Vite PWA / Workbox 類方案 | F8 |
| 測試 | Vitest（單元/元件）＋ Playwright（E2E） | F7：內容遷移與排程邏輯必須有跨日期回歸測試 |
| 部署 | 靜態託管＋SPA fallback＋build-time 產出公開閱讀頁（供索引/分享） | F10 的延伸：內容要能被搜尋與引用 |

**與 v2 草案的差異**：v2 原本傾向 Astro/Next 純靜態＋localStorage 的「最輕量 Demo」路線；這一版明確捨棄，改採上述工程化路線。原因是本專案的核心價值（間隔複習、離線可靠、內容可迭代）**結構上依賴** F7/F8 描述的能力，用輕量方案做不到，硬做只會在後期重寫。

---

## 5. 統一資料模型（六層內容架構＋文體策略標籤）

```text
School 學派
└── Work 典籍               genreStrategy: 'rhythmic' | 'narrative' | 'argumentative' | 'parallel'
    └── Chapter 篇／章       difficulty: 1-5, estimatedMinutes
        └── Passage 學習段   80-220 字，單次學習 3-8 分鐘
            └── Sentence 句  ← 複習卡最小單位
                └── Chunk 語義塊  2-10 字，一句建議 2-5 塊
```

### 5.1 `genreStrategy` 對照表（本版新增，整合 F5）

| genreStrategy | 適用典籍 | 對應主練習題型（見第 8 章） |
|---|---|---|
| `rhythmic`（韻律格言） | 道德經 | 首字提示、對仗填空、遮罩逐句還原 |
| `narrative`（寓言敘事） | 莊子 | 心像卡、故事骨架排序、情節接龍 |
| `argumentative`（論說結構） | 韓非子、商君書 | 論證地圖（論點→論據→結論）、關鍵詞挖空 |
| `parallel`（排比遞進） | 墨子 | 句式模板代換、遞進結構排序 |

`genreStrategy` 標記在 `Work` 層級（同一典籍文體一致），必要時可在 `Chapter` 層級覆寫（例如〈公輸〉雖屬墨子，但其實是敘事對話體，應標記為 `narrative` 而非 `parallel`）。

### 5.2 TypeScript 資料模型

```typescript
export interface Work {
  id: string;                    // stable ID，如 "dao-de-jing"
  schoolId: 'daoism' | 'legalism' | 'mohism';
  title: string;
  genreStrategy: 'rhythmic' | 'narrative' | 'argumentative' | 'parallel';
  sourceNote: string;             // 版本聲明，對應原始檔案的校勘附記
  chapterIds: string[];
}

export interface Chapter {
  id: string;                     // 如 "dao-de-jing/ch-01"
  workId: string;
  order: number;
  title: string;
  genreStrategyOverride?: Work['genreStrategy'];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  passageIds: string[];
  tags: string[];
}

export interface Passage {
  id: string;                     // "dao-de-jing/ch-01/p-01"
  chapterId: string;
  order: number;
  canonicalText: string;          // 原文不可變
  sentenceIds: string[];
  sourceRefs: SourceReference[];
}

export interface Sentence {
  id: string;                     // "dao-de-jing/ch-01/p-01/s-01"
  passageId: string;
  order: number;
  canonicalText: string;
  chunkIds: string[];
  translationHint?: string;       // 僅供理解提示，非權威譯文
  allowedVariants?: AllowedVariant[]; // 異文，需附來源
  tags: string[];
}

export interface Chunk {
  id: string;
  sentenceId: string;
  order: number;
  text: string;
  cue?: string;                   // 提示階梯用（首字、語意提示等）
}

export interface SourceReference {
  label: string;
  edition?: string;               // 如「中國哲學書電子化計劃」「維基文庫」
  location?: string;
  accessedAt?: string;
}
```

### 5.3 原文不可變原則（F6 的直接落實）

- `canonicalText` 只能經內容編輯／校勘流程修改，前端不得直接改寫。
- 遮罩、拼音、挖空全部由 render layer 動態計算，不寫死進資料。
- 異文（`allowedVariants`）必須附 `SourceReference`，未附來源者在 ETL 驗證階段直接擋下（見第 7 章）。

### 5.4 穩定 ID 與內容遷移（F7 的直接落實）

```text
規則：
1. ID 只由「典籍在文本中的位置」決定，不使用陣列 index 即時生成。
2. 校正錯字不改 ID。
3. 拆句／合句時，必須在 scripts/migrate-progress 建立對應表，
   把使用者已累積的 ReviewCardState 遷移到新 ID，不得清零。
4. 被刪除的 ID 保留 tombstone，避免舊備份匯入時誤配到新內容。
```

---

## 6. MVP 範圍裁決：48 章全收 ＋ 垂直切片優先驗證

第 2 章已裁決 MVP 收錄全部 48 章（而非 v2 建議的「先只做道德經 21 章」），理由：

1. 第 3 章精算顯示全部內容僅 6,552 字、約 500 句候選卡片，人工校對工作量可控（估計 2–3 週單人工作量），沒有必要人為限縮範圍。
2. F5 要求「文體差異化記憶策略」必須成立，若 MVP 只做道德經（`rhythmic` 單一文體），就無法驗證 `narrative`／`argumentative`／`parallel` 三種策略是否真的有效——**這是產品最大的差異化假設，必須儘早驗證，而不是留到 V1.1 才做**。

但「全收」不等於「一次做完所有功能」。因此採用**垂直切片（Vertical Slice）優先**的工程順序：

> 先打通「一句話從閱讀 → 分塊 → 遮罩 → 默寫 → 進入複習排程 → 隔天到期複習」這一條完整鏈路，鎖定兩個 golden fixture（道德經第一章 + 莊子·逍遙遊），確認離線、鍵盤操作、進度不遺失都成立後，再批量擴充到其餘 46 章。

這同時滿足「範圍要完整」與「風險要先驗證」兩個看似衝突的要求。

---

## 7. 內容工程（ETL）流程

```text
原始 Markdown（Literature_Classic.md，唯讀保存於 content/source/）
  ↓ parse         依 #/##/### 標題階層解析為 AST
  ↓ normalize     全形標點、Unicode NFC、去除多餘空白
  ↓ segment       依標點候選切出 Passage / Sentence / Chunk
  ↓ editorial review   人工確認句界、語義塊、異文、genreStrategy 標記
  ↓ validate       Schema 驗證（見下方阻斷規則）
  ↓ generate       輸出 JSON、內容 hash、版本 manifest
  ↓ test           Snapshot／題型／舊進度遷移回歸測試
  ↓ publish        版本化靜態資產
```

**阻斷發布的驗證規則**（任一不通過，內容不得上線）：
- ID 重複或缺失、篇章找不到所屬典籍。
- Sentence 拼接後 ≠ Passage 原文；Chunk 拼接後 ≠ Sentence 原文。
- 異文缺少來源欄位。
- 題目存在多重正解（挖空/選擇類需自動檢查唯一解）。
- migration map 有衝突。

**僅警告、可人工審核後發布**：單句超過 40 字、Passage 超過 300 字（依第 3 章精算，〈公輸〉單段可能超標，需人工決定是否再切分）、連續三句無註解或句意提示。

---

## 8. 核心學習循環（八步，依文體動態切換題型）

```
導 → 讀 → 解 → 分 → 聽 → 背 → 測 → 複
```

| 步驟 | 內容 | 文體差異化之處 |
|---|---|---|
| 導 | ≤80 字導讀：位置、核心問題、任務 | — |
| 讀 | 純淨原文，註解預設收合 | — |
| 解 | 按句展開字詞、語法、典故 | 論說體（韓非子）加註術語定義；敘事體（莊子）加註人物/意象 |
| 分 | 語義塊拆解 | `rhythmic`：依對仗拆（道可道／非常道）；`narrative`：依情節拆；`argumentative`：依論證步驟拆；`parallel`：依排比單位拆 |
| 聽 | 逐句朗讀跟讀（TTS 或人工錄音，標明來源） | — |
| 背 | 提示階梯：完整原文→關鍵詞遮罩→首字提示→句意提示→自行輸入 | 每種 genreStrategy 對應不同的第一層主打題型（見 5.1 表） |
| 測 | 3–8 題主動回想，禁止純辨認題 | — |
| 複 | 進入 FSRS 排程佇列，跨典籍交錯複習 | — |

### 8.1 熟練度狀態機（採用 ClassicFlow 版本，完整保留）

`未開始 → 已接觸 → 初步記住 → 學習中 → 穩定 / 薄弱（Leech）→（可選）暫停`

禁止規則：閱讀次數、停留時間、按下「完成」按鈕，均不能直接跳到「穩定」——只有無提示回想成功＋延遲複習成功才能推進狀態（F2, F10 的直接落實）。

### 8.2 提示階梯使用懲罰

使用過提示後答對，即使最終正確，也不能獲得與「完全無提示答對」相同的排程評級——避免「假性熟練」污染複習排程（F3 的直接落實）。

---

## 9. 排程器介面（技術契約，UI 與演算法解耦）

```typescript
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewInput {
  cardId: string;              // 對應 Sentence.id
  reviewedAt: string;          // ISO 8601
  rating: ReviewRating;
  answerMode: 'recall' | 'typing' | 'ordering' | 'recitation';
  hintsUsed: number;
  responseMs?: number;
}

export interface ReviewSchedule {
  dueAt: string;
  stability: number;
  difficulty: number;
  predictedRetention: number;
  state: 'learning' | 'review' | 'relearning';
}

export interface ReviewScheduler {
  review(input: ReviewInput, previous?: ReviewSchedule): ReviewSchedule;
}
```

- 首版採 FSRS 類模型，目標保留率預設 `0.90`（可調整）。
- 每日新卡上限預設 10 句，到期複習永遠優先於新內容（避免 backlog 暴增導致使用者放棄，呼應 F9）。
- 薄弱卡（Leech）判定：近 8 次中至少 4 次 `again`，或三次以上 24 小時內反覆遺忘 → 自動降階、重新拆小語義塊，使用者可暫停但不強迫每天面對挫敗。

---

## 10. 資訊架構與頁面職責（沿用並簡化）

```
/today         今日：到期複習優先於新學習，首屏最多三張卡片
/library       典籍庫：依學派/難度/狀態篩選，鎖鏈式軟性解鎖地圖
/chapter/:id   篇章閱讀：淨讀/輔讀/對照/專注句 四種模式
/learn/:id     學習：導→讀→解→分→聽 五步
/memorize/:id  背誦工作室：提示階梯＋自評
/review        複習：處理所有到期卡，可選 5分鐘/10分鐘/全部
/progress      進度：保留率趨勢、薄弱句、各典籍熟練度分布
/search /settings /offline /sources
```

**閱讀頁與練習頁分離**（F9 直接落實）：閱讀頁只有一個安靜任務（讀懂），練習頁只有一個高互動任務（回想）；不在同一畫面疊加。

---

## 11. 隱私與遙測（完整採用，理由對應 F6 的信任延伸）

**允許蒐集**（僅匿名產品事件）：`page_view`、`learning_session_completed`、`review_completed`、`quiz_item_answered`（只含題型/正誤/耗時/提示數）、`offline_used`、`backup_exported`。

**禁止蒐集**：使用者默寫的完整文字內容、麥克風原始音訊（除非明確啟用雲端口述辨識並事先告知）、未遮罩的搜尋全文、可反推個人的裝置指紋。

**預設**：免登入即可完整使用；進度預設只存本機；遙測可一鍵關閉。

---

## 12. 無障礙（WCAG 2.2 AA，完整採用）

關鍵條款：全流程鍵盤可完成；拖曳排序題必須有鍵盤替代操作；狀態同時用文字＋圖示＋顏色三重表示（不可只靠顏色）；觸控目標 ≥44×44 px；支援 `prefers-reduced-motion`；遮罩內容對螢幕閱讀器需明確狀態提示（如「答案已隱藏」）。

---

## 13. 分階段路線圖（依垂直切片原則調整）

| 階段 | 週數 | 交付重點 | 退出條件 |
|---|---|---|---|
| **Phase 0** | 1 週 | Repo/CI、content schema v1、48 章內容盤點報告、Markdown 匯入器 | 全部 48 章可被解析，阻斷型驗證為 0 |
| **Phase 0.5（新增，對應第 6 章垂直切片）** | 0.5 週 | 打通道德經第一章 + 莊子·逍遙遊 兩個 golden fixture 的完整鏈路：閱讀→分塊→遮罩→默寫→排程→隔天複習 | 離線、鍵盤操作、刷新後進度不遺失，三項皆通過 E2E 測試 |
| **Phase 1** | 2 週 | 典籍庫、篇章閱讀四種模式、收藏、搜尋 MVP | 五部典籍在 320px 與桌面皆可完整閱讀 |
| **Phase 2** | 3 週 | 八步學習流程、依 genreStrategy 切換題型、即時 diff 回饋 | 使用者可從未學狀態完成一段首次無提示回想，且四種 genreStrategy 皆有對應題型可用 |
| **Phase 3** | 2 週 | ReviewScheduler、到期佇列、薄弱卡、進度統計、備份匯出入 | 時間旅行測試驗證多日排程正確，刷新/離線後狀態一致 |
| **Phase 4** | 2 週 | PWA 離線、TTS 標示、Web Vitals 優化、WCAG AA 稽核 | 核心流程飛航模式下可完成；無障礙清單通過 |
| **Phase 5** | 1 週 | 48 章逐句內容 QA、10–20 人試用、缺陷修復 | P0/P1 缺陷為 0 |

**總計約 11.5 週**（比 ClassicFlow 原估多了 0.5 週的垂直切片驗證，但可大幅降低後期批量擴充 46 章時才發現架構問題的風險）。

---

## 14. Backlog（P0/P1/P2，精簡自 ClassicFlow 並加入 genreStrategy 相關任務）

**P0（沒有就不能上線）**
`MP-001` Repo/CI/Lint/Typecheck ｜ `MP-002` Content schema + stable ID（含 genreStrategy 欄位）｜ `MP-003` Markdown 匯入器 ｜ `MP-004` 內容驗證報告 ｜ `MP-005` 典籍庫與篇章閱讀 ｜ `MP-006` Sentence/Chunk render model ｜ `MP-007` 學習 session state machine ｜ `MP-008` 四種 genreStrategy 對應題型（首字提示／心像卡／論證地圖／排比模板）＋通用遮罩、挖空、默寫 ｜ `MP-009` 文字 diff 與異文處理 ｜ `MP-010` ReviewScheduler 與到期佇列 ｜ `MP-011` IndexedDB 進度儲存與 migration ｜ `MP-012` PWA 離線核心流程 ｜ `MP-013` 備份匯出/匯入 ｜ `MP-014` 無障礙與鍵盤操作 ｜ `MP-015` Playwright 主要旅程測試

**P1**：人工朗讀＋逐句時間碼、深色模式、更完整註解與典故、相似句辨析題、內容修訂版本 diff。

**P2**：帳號/跨裝置同步、語音辨識口述比對、跨典籍概念地圖、AI 問答（若加入，答案必須引用站內來源並明示不確定性）。

---

## 15. 測試與上線 Definition of Done

**測試金字塔**：內容測試（Schema、ID、拼接完整性、異文來源）→ 單元測試（遮罩生成、diff、排程器、薄弱卡判定）→ 元件測試（句子工具列、背誦卡、評分按鈕）→ E2E（含「時間旅行」測試到期複習排程、飛航模式完整流程、匯出匯入還原、鍵盤完成主要旅程）。

**DoD 檢查清單**：
- [ ] 48 章內容全數通過 schema，Sentence/Chunk 可逆拼接
- [ ] 四種 genreStrategy 對應題型皆有單元與 E2E 測試
- [ ] 複習排程跨日期測試通過
- [ ] 無網路可完成閱讀/背誦/複習
- [ ] 備份可完整還原，內容版本升級不遺失 stable ID 進度
- [ ] WCAG 2.2 AA 核心流程通過
- [ ] 版本聲明與來源可見（呼應 F6）
- [ ] P0/P1 缺陷為 0

---

## 16. 主要風險（精簡，聚焦本版新增或強化的部分）

| 風險 | 影響 | 緩解 |
|---|---|---|
| genreStrategy 分類主觀，可能不是每章都乾淨對應單一文體 | 題型引導失準 | Chapter 層級可覆寫 Work 層級預設（見 5.1），〈公輸〉已是明確案例 |
| 全收 48 章但 Phase 2 才做題型，前期進度不可見 | 團隊/使用者信心風險 | Phase 0.5 垂直切片提前展示端到端可行性 |
| IndexedDB／PWA 技術棧比純靜態站複雜，前期開發較慢 | 時程風險 | 已在第 4 章明確裁決並說明理由，避免中期反覆猶豫重工 |
| 古籍版本異文被誤判為錯字 | 學習者困惑、信任下降 | canonical/allowedVariants/來源欄位分離（5.3 節） |
| 我本人（Claude）無法驗證您提供文件中的外部連結真實性 | 若引用進正式文件可能有誤 | 見第 0 章聲明，建議日後用瀏覽工具覆核 |

---

## 17. 尚待您決策的事項

1. **技術棧裁決是否接受**：本版把 v2 的「輕量靜態站」改為「Vue3+IndexedDB+PWA 工程化路線」，工作量明顯增加，但對應 F7/F8 的硬約束。若您的實際情境是「先做一個能展示的 Demo」而非「要長期維運的產品」，我建議先做 Phase 0.5 的垂直切片 Demo（不含完整 PWA/IndexedDB），驗證概念後再決定是否升級到完整工程化路線——這樣可以兩者兼顧。
2. **genreStrategy 的章節覆寫**需要文獻顧問（或您）逐一過一遍 48 章，確認哪些章節不屬於典籍預設文體（目前已知〈公輸〉是明確例外）。
3. 網站正式名稱是否採用「經典文脈 ClassicFlow」（沿用您提供文件的命名），或另訂。

---

## 18. 立即可執行的下一步

若您確認方向，我可以直接：
1. 把 `Literature_Classic.md` 轉換為第 5 章定義的 JSON 資料模型（含 genreStrategy 標記），作為 `content/build` 的第一版輸出。
2. 建立 Phase 0.5 垂直切片的可互動 Demo（道德經第一章 + 莊子·逍遙遊），實際展示「閱讀→分塊→遮罩→默寫→複習」的完整體驗，讓您在投入完整工程化路線前先驗證產品概念是否符合預期。

請告訴我要先做哪一項。
