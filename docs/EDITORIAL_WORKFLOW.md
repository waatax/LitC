# LitC 核心編校流程

> 狀態：權威維護程序（Canonical SOP）  
> 適用範圍：古文原文、白話文、解析、來源、句段結構、人工覆核紀錄  
> 建立依據：2026-08-14 全庫診斷及多循環 PDCA 實作

## 一、完成的證據標準

每一 passage 必須同時滿足以下條件，才能標記為完成：

1. **原文完整性**：已與可靠底本逐字比對；篇名、段界、缺字、異文、標點與數位轉錄雜訊均已處理。
2. **白話完整性**：逐句覆蓋原文，不漏掉末句、否定、數量、主詞、專名、官名、因果與轉折；語言是真正現代漢語，不是換字式古文。
3. **解析專屬性**：能指出本段的具體詞義、章法、思想或制度背景，並說明史料、倫理或現代知識界限；內容不可搬到別段仍成立。
4. **來源證據**：至少兩個實際使用的來源，優先使用篇章直達頁、影印本或權威資料庫；作品首頁只能作輔助。
5. **覆核紀錄**：`editorialReviews.json` 三欄為 `verified`，日期有效，來源非空，備註明確描述本次做過的校正。
6. **結構一致**：passage 原文等於其 sentence 原文依序串接；ID、父子關係與 chunks 無遺失。
7. **嚴格稽核**：目標作品或章節在最新 audit 中為零 errors、零 warnings。

只有欄位存在、字數增加、來源網址增加或自動腳本執行成功，都不構成完成證據。

## 二、資料真實來源

| 用途 | 權威位置 |
| --- | --- |
| 應用實際載入的典籍 | `src/data/work_chunks/*.ts` |
| 三欄人工覆核證據 | `src/data/editorialReviews.json` |
| 編校品質規則 | `scripts/audit_editorial_quality.mjs` |
| 人工可讀診斷 | `docs/EDITORIAL_AUDIT_REPORT.md` |
| 機器可讀診斷 | `scratch/editorial_quality_audit.json` |
| 全庫真實進度 | `CORPUS_PROGRESS.md` |
| 循環紀錄與決策 | `docs/PDCA_EDITORIAL_REVIEW_2026-08-14.md` |

舊 Markdown、scratch、批次輸出與 archive 腳本只可作候選資料，不得覆蓋上線資料，除非通過本流程的逐段證據審查。

## 三、來源層級與使用規則

來源優先順序：

1. 可核頁碼的古籍影印本、國家圖書館或權威典藏影像。
2. Chinese Text Project、中央研究院漢籍等可定位篇章的學術資料庫。
3. 維基文庫等可查版本歷史的全文頁。
4. 可靠校注、專書或論文，用於訓詁、異文與思想史補充。
5. 一般整理網站只能作線索，不應單獨承擔 `verified`。

執行要求：

- 必須實際開啟來源，確認頁面存在且內容對應該篇。
- review 中優先記錄篇章直達網址，不使用搜尋結果網址。
- 兩個網址若只是同一頁不同語言參數，不視為真正獨立複核。
- 遇異文時，在解析或 notes 中記錄「底本 A 作何字、底本 B 作何字、採用哪一字及理由」。
- 缺字以 `□` 或明確說明保留，不因追求順文而猜補。

## 四、PDCA 循環

### Plan：建立可重現基線

1. 執行 `npm.cmd run editorial:baseline`。
2. 從 `scratch/editorial_quality_audit.json` 列出目標作品的 passageId、問題碼與現有內容。
3. 選擇一部小型作品或一個完整章節；不得跨數千段同時改寫。
4. 找到至少兩個可實際對讀的來源，辨認版本與篇章邊界。
5. 記錄批次開始時的 errors、warnings 及各問題碼數量。

### Do：逐段三欄校正

對每段依固定順序處理：

1. 原文：比對字詞、標點、脫字、註腳號、OCR 字與段界。
2. 句段：若原文改動，同步修正 passage、sentences、chunks。
3. 白話：按原文句序翻譯，完成後從末句倒查，確認沒有截短。
4. 解析：至少涵蓋下列四類中的三類：
   - 訓詁／名物；
   - 章法／修辭／論證；
   - 思想／史地／制度背景；
   - 史料界限／倫理界限／現代知識界限。
5. 覆核：更新 review 三欄、實際來源、日期及可稽核 notes。

### Check：雙層驗證

1. 執行非嚴格 audit，確認 bundle 可解析且報告已更新。
2. 從 JSON 報告確認目標作品是 `0 errors / 0 warnings`。
3. 執行繁體字稽核與 TypeScript 檢查。
4. 執行 production build，確認動態載入的 bundle 可編譯。
5. 再抽讀長段、含缺字段、異文段與倫理敏感段，不以自動分數取代閱讀。

### Act：固化結果並選下一循環

1. 更新 `CORPUS_PROGRESS.md` 的當前數字。
2. 在 PDCA 報告記錄本批範圍、來源、實錯、數字變化與未解風險。
3. 保留可重跑的校正腳本；腳本名稱應指出作品或批次，不得偽裝成全庫通用答案。
4. 下一輪優先選擇能整部封閉的小型作品，再處理大型作品的完整章節。

## 五、三欄校正檢查表

### 原文 canonicalText

- 書名、篇名、人物、地名與年代是否對應正確作品？
- 是否混入註腳號、HTML、`\uXXXX`、字面 `\n`、替代字元或私用區字元？
- 是否有同音 OCR、遺漏書名、異體字誤判或簡繁轉換破壞？
- passage 與 sentence 串接是否完全一致？
- 異文是否記錄，而不是悄悄選字？

### 白話 translation

- 是否每一句都有語義對應，尤其是段尾總結？
- 主詞與受詞是否因古文省略而補錯？
- 否定、反問、假設、數量、比較與因果是否保存？
- 是否把官名、器物、禮制名詞錯譯成日常詞？
- 是否仍大量照抄原文字序，只把「之」換成「的」？
- 不確定處是否保守說明，而非創造確定答案？

### 解析 analysis

- 是否引用本段實際詞句，而非只列作品通用標籤？
- 是否解釋論證如何推進，而非只說「影響深遠」？
- 是否區分作者主張、史傳敘事、後人附會與現代事實？
- 涉及戰爭、俘虜、性別、障礙、家庭暴力或政治權力時，是否補充適當倫理界限？
- 涉及醫療、植物、天文等前現代知識時，是否避免當成現代科學定律？

## 六、原子性修改規則

`work_chunks` 是一行序列化 payload，不宜直接手改。校正腳本必須以安全方式讀寫：

```js
function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8')
  const start = source.indexOf('JSON.parse(')
  const end = source.lastIndexOf(') as WorkBundle')
  return vm.runInNewContext(source.slice(start, end + 1), Object.create(null), { timeout: 5_000 })
}

function writeBundle(file, bundle) {
  const literal = JSON.stringify(JSON.stringify(bundle))
  fs.writeFileSync(
    file,
    `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${literal}) as WorkBundle\n`,
    'utf8',
  )
}
```

禁止使用只包一層引號的自製序列化、全域正則直接改 bundle、或把解析失敗後的部分資料寫回檔案。寫入前後都要確認 passageId 存在；任何一筆缺失都應中止整批。

原文更動必須同步到所有對應 sentence 與 chunk。完成後以 audit 的 `sentence_text_mismatch` 為零作為必要條件，但仍需人工確認標點和分句合理。

## 七、覆核紀錄格式

```json
{
  "passageId": "work_ch-1_p-1",
  "canonicalText": "verified",
  "translation": "verified",
  "analysis": "verified",
  "sources": [
    "https://第一個實際使用的篇章來源",
    "https://第二個實際使用的獨立來源"
  ],
  "reviewedAt": "YYYY-MM-DD",
  "notes": "逐句說明本次核了什麼、改了什麼、保留哪些不確定性。"
}
```

不得沿用與新內容不符的舊 `verified`。只要白話或解析被改寫，就應更新日期與 notes；原文若同時更動，須重新核定 canonicalText。

## 八、品質命令與通過語義

```powershell
# 重新產生基線報告；不因內容問題中止
npm.cmd run editorial:baseline

# 繁體、audit 報告與 TypeScript 結構驗證
npm.cmd run editorial:verify

# 嚴格內容閘門；有任何 error 時必須失敗
npm.cmd run editorial:gate

# 全庫內容完全通過後才可作為編校發佈門檻
npm.cmd run editorial:release
```

`build` 成功只證明應用可編譯，不代表典籍內容正確；`editorial:gate` 成功才表示全庫 error 歸零。warnings 仍須在發佈說明中列出，不能隱藏。

## 九、禁止的捷徑

- 不得批次把所有 review 改成 `verified`。
- 不得因作品有兩個來源，就推定作品內每一段均已逐字覆核。
- 不得使用同一套解析模板換作品名、篇名或前四字後大量寫入。
- 不得用相似度警報直接判定譯文錯誤，也不得為降低相似度故意扭曲準確翻譯。
- 不得以 LLM 生成成功、欄位非空、build 成功或警報數下降宣稱全庫完成。
- 不得刪除困難段、縮短原文、合併重複原文或改 audit 規則來消除問題。
- 不得在未確認 Git 既有修改來源時覆蓋其他人的內容。

## 十、完成宣告格式

每輪結案必須同時報告：

- 已完成的作品／章節與 passage 數；
- 原文、白話、解析各修正了什麼；
- 實際使用的主要來源；
- 前後 errors、warnings 與問題碼變化；
- 目標範圍是否為零問題；
- 全庫嚴格閘門是否通過；
- 尚餘問題及下一個可封閉單元。

若只有目標作品歸零，正確說法是「該作品完成，本輪驗證通過；全庫仍未完成」。

