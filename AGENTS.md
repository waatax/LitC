# LitC 維護規範

任何會修改古文原文、白話文、解析、來源或覆核狀態的工作，開始前必須完整閱讀 [`docs/EDITORIAL_WORKFLOW.md`](docs/EDITORIAL_WORKFLOW.md)。該文件是 LitC 編校工作的權威作業程序；`docs/PDCA_EDITORIAL_REVIEW_2026-08-14.md` 是最近一次實作紀錄，不取代權威程序。

## 核心原則

1. 實際上線內容以 `src/data/work_chunks/*.ts` 為準；不得只修改舊 Markdown、暫存檔或未被應用載入的資料。
2. 「欄位非空」不等於「內容完成」。原文、白話、解析必須分欄覆核，證據寫入 `src/data/editorialReviews.json`。
3. 每筆 `verified` 必須代表實際逐段對讀，並至少列出兩個實際使用的來源。只新增作品級網址，不得批次升級為 `verified`。
4. 白話必須完整覆蓋原文；解析必須針對該段，不得用跨段模板、同義改寫或大量生成文字消除警報。
5. 原文有缺字、異文或不確定訓詁時，必須明示不確定性；不得無來源臆補。
6. 更動原文時，必須同步更新 passage、sentence 與 chunks，並確認句段串接一致。
7. 每一批以一部小型作品或一個語義完整章節為單位，先建立基線，再逐段校正，最後要求目標範圍為零問題。
8. 不得修改稽核門檻來讓資料通過；不得把警告刪除、降級或排除來冒充校正成果。
9. 全庫嚴格閘門未歸零前，只能說明「本批／本部完成」，不得宣稱全庫完成。

## 必跑命令

```powershell
npm.cmd run editorial:baseline
npm.cmd run editorial:verify
npm.cmd run editorial:gate
npm.cmd run build
```

`editorial:gate` 在全庫尚有內容錯誤時應回傳失敗；這是品質保護，不是建置故障。每輪必須同步更新 `CORPUS_PROGRESS.md` 與 PDCA 報告中的真實數字。

