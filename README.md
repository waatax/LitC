# 經典文脈 ClassicFlow

> **先秦諸子典籍研讀與間隔重複背誦學習系統**  
> 基於認知科學（間隔重複 + 提示階梯）與正體文獻嚴格校勘，打造極簡沉浸的文言經典研習體驗。

[![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **線上展示體驗**：[https://waatax.github.io/LitC/](https://waatax.github.io/LitC/)

---

## 📖 專案緣起與理念

古文典籍承載千年思想精髓，但傳統背誦方式常受挫於「死記硬背」與「迅速遺忘」。  
**ClassicFlow** 結合當代認知心理學與軟體工藝，以兩大核心機制重塑古典研習：
1. **主動提取與間隔重複（Active Recall & Spaced Repetition）**：依據遺忘曲線動態調度複習間隔，將短期工作記憶轉化為長久思維烙印。
2. **適度挑戰的提示階梯（Hint Ladder）**：克服「全無提示則受挫、全覽答案則無效」的兩極困境，提供首字引導、韻律骨架、局部遮蔽到盲測默寫的漸進階梯。

---

## ✨ 核心特色

### 1. 諸子百家經典典藏
- 收錄**儒、道、法、墨、兵、史**等 50 部先秦兩漢魏晉經典（涵蓋《道德經》、《論語》、《莊子》、《孟子》、《孫子兵法》、《史記》精選等）。
- 採用**按章按卷動態加載（Dynamic Chunking）**，首頁秒開、毫秒級篇章切換，閱讀零卡頓。

### 2. 多維度記憶與背誦訓練
- **提示階梯（Hint Ladder）**：支援「全文顯現 ➔ 骨架導引 ➔ 首字提示 ➔ 默寫盲測」等多階切換。
- **語塊重組（Chunk Order Game）**：將經典長句拆解為語義組塊，透過拖曳重組鍛鍊語感與結構記憶。
- **間隔排程（Spaced Repetition System）**：精準追蹤每一句的熟練度與複習週期。

### 3. 文海研讀與比較視圖
- **即時字典與訓詁**：點擊字詞即刻展開說文解字、字音字義與典故註解。
- **跨篇比較閱讀（Compare View）**：支援不同學派或平行篇章之對讀，洞悉先秦諸子思想交鋒。
- **多音朗讀與標音**：支援拼音/注音標註與現代語音引擎朗誦。

### 4. 古雅沉浸美學
- **雙主題設計**：內建「素雅書齋（淺色象牙）」與「玄墨夜讀（深色黛黑）」典雅風格。
- **墨客水墨手寫板（Ink Canvas）**：支援擬真毛筆筆觸與印章簽收互動，以手寫靜心輔助記憶。

### 5. 離線優先與隱私保障
- 採用 **IndexedDB（Dexie.js）** 進行本機儲存，無網路狀態下仍可離線背誦與記錄進度。
- 資料 100% 留存於使用者瀏覽器，無隱私外洩風險。

---

## 🛠️ 技術架構

- **核心框架**：[Vue 3](https://vuejs.org/)（Composition API + `<script setup>`）
- **型別系統**：[TypeScript](https://www.typescriptlang.org/)（嚴格型別檢查）
- **建置工具**：[Vite](https://vitejs.dev/)（ESM 模組熱更新與極速打包）
- **狀態管理**：[Pinia](https://pinia.vuejs.org/)
- **本機資料庫**：[Dexie.js](https://dexie.org/)（IndexedDB 封裝）
- **字體與校勘**：正體中文文獻標準排版、OpenCC 正體轉換稽核

---

## 📁 專案目錄架構

```text
LitC/
├── .github/              # GitHub Actions 自動部署工作流
├── public/               # 公開靜態資源 (Favicon、Web Manifest)
├── src/
│   ├── assets/           # 主題色彩、字型與全域 CSS
│   ├── components/       # UI 元件 (提示階梯、印章、手寫板、卡片等)
│   ├── composables/      # 核心邏輯 (間隔重複、呼吸節奏、輸入比對)
│   ├── data/             # 典籍目錄、題庫、閱讀輔助與動態篇章資料
│   │   ├── work_chunks/  # 50 部經典獨立動態分塊模組
│   │   ├── catalog.ts    # 典籍篇卷結構中繼資料
│   │   ├── quiz_bank.ts  # 測驗與自我檢驗題庫
│   │   └── readingAid.ts # 逐句白話與核心解析
│   ├── services/         # 語音朗讀與字詞字典服務
│   ├── stores/           # Pinia 狀態儲存庫 (App、進度與熟練度)
│   ├── types/            # TypeScript 核心型別定義
│   ├── utils/            # 拼音、排程演算法與檢索工具
│   ├── views/            # 主頁面 (研讀、背誦、章節、文海、比較等)
│   ├── App.vue           # 根元件
│   └── main.ts           # 程式進入點
├── scripts/              # 專案建置與正體字規範檢查腳本
├── index.html            # HTML 模板
├── package.json          # 依賴管理與執行腳本
├── tsconfig.json         # TypeScript 設定
└── vite.config.ts        # Vite 建置配置
```

---

## 🚀 快速開始

### 環境要求
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) `>= 9.0.0`

### 安裝步驟

1. **複製專案**
   ```bash
   git clone https://github.com/waatax/LitC.git
   cd LitC
   ```

2. **安裝依賴套件**
   ```bash
   npm install
   ```

3. **啟動本機開發伺服器**
   ```bash
   npm run dev
   ```
   啟動後於瀏覽器開啟 `http://localhost:5173/LitC/` 即可瀏覽。

4. **生產環境建置**
   ```bash
   npm run build
   ```
   建置產物將輸出於 `dist/` 目錄。

5. **本地預覽生產建置**
   ```bash
   npm run preview
   ```

---

## 📜 常用命令

| 命令 | 說明 |
| :--- | :--- |
| `npm run dev` | 啟動 Vite 熱重載開發伺服器 |
| `npm run build` | 執行正體中文稽核、TypeScript 型別檢查並完成生產打包 |
| `npm run deploy` | 本機建置並推送靜態網頁至 GitHub Pages (`gh-pages` 分支) |
| `npm run audit:traditional` | 執行正體中文嚴格校勘稽核 |
| `npm run preview` | 本地預覽 `dist/` 打包產物 |

---

## 📄 授權條款 (License)

本專案採用 [MIT 授權條款](LICENSE)。典籍文本屬公有領域（Public Domain），詮釋與解析內容遵循開放知識共享原則。
