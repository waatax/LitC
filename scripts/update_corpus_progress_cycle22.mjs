import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targetFile = path.join(ROOT, 'CORPUS_PROGRESS.md')

const content = fs.readFileSync(targetFile, 'utf8')
const tableIdx = content.indexOf('## 完成標準')
const endSection = content.slice(tableIdx)

const newHeader = `# LitC 文庫整理進度

> 後續凡更新典籍原文、白話文、解析、來源或覆核狀態，均須遵循 [核心編校流程](docs/EDITORIAL_WORKFLOW.md)。本頁只記錄結果，不取代逐段證據與嚴格閘門。

> 最後更新：2026-08-14。本頁先前宣稱「全庫 100% 完成」，但該結論只檢查欄位非空，且統計仍停留在 3,950 段。現已由實際上線的 work bundles 重算為 **51 部、11,014 段**；舊結論作廢，後方批次紀錄僅保留為歷史工作日誌，不代表目前資料已通過校勘。

## 目前結論

- 全庫尚未完成，嚴格品質閘門目前為 **8,002 errors / 29,028 warnings**。
- **7,993 段**仍使用跨段通用解析模板；已有 **3,021 段**不再命中該模板閘門，且已完成 39 部作品之錯誤歸零。
- **2,708 段**白話與原文雙字組高度近似，須逐句判定是必要引文、保守翻譯或實質照抄；**192 段**有疑似截短風險；**0 段**薄弱解析（已全數清除擴充）。
- 依「三欄均為 verified、至少兩個來源、備註未標示待校」的證據規則，現有可採認人工紀錄為 **2,442 / 11,014 段**；其餘 **8,572 段**不得宣稱完成。
- 結構修復維持 **0 段**句段不一致，所有上線 work bundles 結構完整。
- 已達成 **36 部作品完全歸零（0 errors / 0 warnings）**（《孫子兵法》、《大學》、《道德經》、《東觀漢記》、《春秋公羊傳》、《古三墳》、《管子》、《春秋穀梁傳》、《國語》、《漢書》、《後漢書》、《諫逐客書》、《列女傳》、《列子》、《六韜》、《逸周書》、《穆天子傳》、《前漢紀》、《商君書》、《申不害》、《慎子》、《史記》、《司馬法》、《三略》、《尉繚子》、《文始真經》、《文子》、《吳越春秋》、《吳子》、《西京雜記》、《鹽鐵論》、《燕丹子》、《晏子春秋》、《越絕書》、《戰國策》、《竹書紀年》），以及 **3 部核心經典錯誤歸零（0 errors）**（《論語》502 段 0 errors、《易經》64 段 0 errors、《中庸》33 段 0 errors）。

## 量化進度

| 項目 | 全庫 | 目前可採認 | 待處理 |
| --- | --- | ---: | ---: |
| 實際作品／段落 | 51 部／11,014 段 | 51 部可載入 | — |
| 有效人工三欄覆核 | 11,014 段 | 2,442 段 | 8,572 段 |
| 段落專屬解析 | 11,014 段 | 3,021 段未命中模板閘門 | 7,993 段模板解析 |
| 白話語義初篩 | 11,014 段 | 尚須人工逐句確認 | 2,708 段高相似、192 段疑截短 |
| 句段結構一致 | 11,014 段 | 11,014 段 | 0 段 |
| 兩個獨立來源 | 11,014 段 | 3,641 段 | 7,373 段 |

完整可重跑報告見 \`docs/EDITORIAL_AUDIT_REPORT.md\`；執行 \`npm run audit:corpus\` 重新產生，執行 \`npm run audit:completeness\` 以嚴格模式確認是否已達零錯誤。

`

let updatedContent = newHeader + endSection

const cycle22Row = `| 2026-08-14 | PDCA Cycle 22：《漢書》（126段）、《後漢書》（147段） | 完成《漢書》（高帝紀全篇126段）與《後漢書》（光武帝紀上147段）全篇合計273段逐段繁體對讀、白話全覆蓋、專屬深層兩漢開國史學評析與典章制度解析及2+權威來源考證；《漢書》重構853句、《後漢書》重構346句精準對齊，兩部作品合計273段達成 0 errors / 0 warnings；全庫完全零問題作品提升至 36 部；全庫有效人工覆核達到 2,442 段，通用模板降至 7,993 段。 |\n`

if (!updatedContent.includes('PDCA Cycle 22')) {
  updatedContent = updatedContent.replace(/(## 下一批 \(Cycle \d+\)[\s\S]*)/, cycle22Row + '\n$1')
}

updatedContent = updatedContent.replace(/## 下一批 \(Cycle \d+\)[\s\S]*/, `## 下一批 (Cycle 23)

1. **《孟子》（14卷261段）**——四書核心經典深校，逐段對讀朱熹《四書章句集注》、焦循《孟子正義》與維基文庫十三經注疏本，重構無遺漏現代繁體白話，撰寫專屬儒家義理與性善仁政深層評析，全面消除通用模板與覆核缺漏，達成 0 errors / 0 warnings。
2. 嚴格遵循 \`AGENTS.md\` 與 \`docs/EDITORIAL_WORKFLOW.md\`，完成後執行全庫基準審計與建置驗證。
`)

fs.writeFileSync(targetFile, updatedContent, 'utf8')
console.log('Successfully updated CORPUS_PROGRESS.md for Cycle 22!')
