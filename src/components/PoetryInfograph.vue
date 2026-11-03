<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'timeline' | 'table' | 'imagery' | 'social'>('timeline')

interface TimelineEra {
  period: string
  title: string
  badge: string
  icon: string
  characteristics: string
  representativeMaster: string
  famousQuote: string
  kidExplain: string
}

const timelineData: TimelineEra[] = [
  {
    period: '先秦時期',
    title: '詩經與諸子散文',
    badge: '源頭發軔',
    icon: '🌱',
    characteristics: '四言為主、重章疊句、樸素自然',
    representativeMaster: '孔子、屈原、莊子',
    famousQuote: '關關雎鳩，在河之洲。窈窕淑女，君子好逑。',
    kidExplain: '這是中國文學的最早源頭！那時候大家講話像唱歌一樣，四個字四個字很有節奏。'
  },
  {
    period: '漢魏六朝',
    title: '樂府民歌與建安風骨',
    badge: '長歌抒情',
    icon: '🏹',
    characteristics: '五言詩成熟、感於哀樂、真摯悲壯',
    representativeMaster: '曹操、曹植、陶淵明',
    famousQuote: '採菊東籬下，悠然見南山。',
    kidExplain: '人們開始把心中的故事寫進詩歌裡，陶淵明叔叔帶著大家去種田採菊花，生活好愜意！'
  },
  {
    period: '大唐盛世',
    title: '唐詩巔峯：絕句與律詩',
    badge: '黃金時代',
    icon: '✨',
    characteristics: '五七言整齊、平仄嚴整、氣象萬千',
    representativeMaster: '李白、杜甫、王維、白居易',
    famousQuote: '天生我材必有用，千金散盡還復來。',
    kidExplain: '唐朝是詩歌的超級宇宙！李白像神仙一樣浪漫，杜甫像爺爺一樣慈愛，每個人都在寫詩！'
  },
  {
    period: '兩宋風華',
    title: '宋詞璀璨：豪放與婉約',
    badge: '長短入樂',
    icon: '🪷',
    characteristics: '長短句交錯、依詞牌入樂、細膩幽深',
    representativeMaster: '蘇軾、辛棄疾、李清照',
    famousQuote: '但願人長久，千里共嬋娟。',
    kidExplain: '宋詞原本是配音樂唱的流行歌曲喔！一句長、一句短，李清照和蘇東坡是最厲害的作詞家！'
  },
  {
    period: '元代散曲',
    title: '元曲天籟：小令與套數',
    badge: '活潑市井',
    icon: '🐎',
    characteristics: '自由生動、加襯字、俚俗幽默、真率痛快',
    representativeMaster: '關漢卿、馬致遠、白樸、張養浩',
    famousQuote: '夕陽西下，斷腸人在天涯。',
    kidExplain: '元曲講話最直接、最接地氣！就像講俏皮話和演舞臺劇，生動活潑，讀起來特別過癮！'
  }
]

interface CompareRow {
  aspect: string
  tang: string
  song: string
  yuan: string
}

const compareTable: CompareRow[] = [
  {
    aspect: '句子長短',
    tang: '句齊整潔（五言、七言）',
    song: '長短相間（長短句、依調而定）',
    yuan: '長短靈活（句法自由、常加襯字）'
  },
  {
    aspect: '音樂關係',
    tang: '重於朗誦吟詠（樂府亦可唱）',
    song: '依詞牌音樂填詞（如流行歌曲）',
    yuan: '依曲牌配樂歌唱（多用於市井戲曲）'
  },
  {
    aspect: '格律要求',
    tang: '平仄嚴格，押平聲韻居多',
    song: '平仄嚴密，平仄韻可轉換',
    yuan: '平仄較寬，平仄通用，一韻到底'
  },
  {
    aspect: '語言風格',
    tang: '典雅雄渾、莊重深沉',
    song: '精緻婉轉、清新豪邁兼具',
    yuan: '口語俚俗、活潑辣利、爽快率真'
  },
  {
    aspect: '小學生易學點',
    tang: '朗朗上口，節奏規律好背',
    song: '意境優美，情感故事動人',
    yuan: '短小精悍，畫面感像看卡通'
  }
]

interface ImageryCard {
  symbol: string
  icon: string
  meaning: string
  sampleVerse: string
  author: string
  kidTip: string
}

const imageryData: ImageryCard[] = [
  {
    symbol: '明月',
    icon: '🌕',
    meaning: '思念家鄉、掛念親人、純潔團圓',
    sampleVerse: '舉頭望明月，低頭思故鄉。',
    author: '李白《靜夜思》',
    kidTip: '小口訣：看見天上大明月，心裡就想爸爸媽媽和小夥伴！'
  },
  {
    symbol: '楊柳',
    icon: '🌿',
    meaning: '依依惜別、挽留好友（「柳」諧音「留」）',
    sampleVerse: '不知細葉誰裁出，二月春風似剪刀。',
    author: '賀知章《詠柳》',
    kidTip: '古人送別朋友折一枝柳條，意思就是：「求求你留下來，別走啦！」'
  },
  {
    symbol: '落花與流水',
    icon: '🌸',
    meaning: '春光短暫、時光流逝、珍惜歲月',
    sampleVerse: '夜來風雨聲，花落知多少。',
    author: '孟浩然《春曉》',
    kidTip: '花兒落了不要難過，要記得珍惜今天的大好陽光喔！'
  },
  {
    symbol: '孤鴻與寒鴉',
    icon: '🦅',
    meaning: '漂泊天涯、孤獨無依、思鄉懷遠',
    sampleVerse: '枯藤老樹昏鴉，小橋流水人家。',
    author: '馬致遠《天淨沙·秋思》',
    kidTip: '小鳥黃昏都知道飛回巢裡，漂泊的旅人也最想回家！'
  },
  {
    symbol: '松柏與傲雪',
    icon: '🌲',
    meaning: '堅強不屈、品格高尚、永不低頭',
    sampleVerse: '孤舟蓑笠翁，獨釣寒江雪。',
    author: '柳宗元《江雪》',
    kidTip: '像大雪裡的松樹一樣勇敢，遇到考試難題也絕不害怕！'
  },
  {
    symbol: '青草',
    icon: '🌱',
    meaning: '生命頑強、生生不息、春回大地',
    sampleVerse: '野火燒不盡，春風吹又生。',
    author: '白居易《賦得古原草送別》',
    kidTip: '哪怕被踩了一腳，只要喝點水曬曬太陽，小草又能挺直腰桿！'
  }
]

interface MasterRelation {
  duo: string
  icon: string
  relation: string
  story: string
}

const socialRelations: MasterRelation[] = [
  {
    duo: '李白 ↔ 杜甫',
    icon: '🤝',
    relation: '盛唐雙子星・千古知己',
    story: '年長十一歲的李白豪邁奔放，杜甫崇拜李白如神明！兩人曾一同在洛陽漫遊山水、攜手策馬，杜甫寫了十幾首詩深深想念李白，堪稱文壇最偉大的友情！'
  },
  {
    duo: '李白 ↔ 孟浩然',
    icon: '⛵',
    relation: '瀟灑忘年交・黃鶴樓送別',
    story: '李白極愛孟浩然的瀟灑風度，曾寫下「吾愛孟夫子，風流天下聞」。在黃鶴樓送別孟浩然去揚州時，目送孤帆遠去，寫下了千古名篇！'
  },
  {
    duo: '蘇軾 ↔ 辛棄疾',
    icon: '⚔️',
    relation: '豪放兩大家・蘇辛並稱',
    story: '蘇東坡在黃州赤壁大喊「大江東去」，辛棄疾在抗金前線撫劍高唱「醉裡挑燈看劍」。雖然他們時代相隔百年，但豪邁雄渾的英雄氣概完全心有靈犀！'
  },
  {
    duo: '關漢卿 ↔ 白樸 ↔ 馬致遠',
    icon: '🎭',
    relation: '元曲四大家・市井曲聖',
    story: '在元代的大舞臺上，他們為老百姓寫曲唱戲！關漢卿幽默辛辣自比「銅豌豆」，馬致遠一曲《秋思》名垂千古，白樸寫盡春花秋月，聯手開創了元曲盛世！'
  }
]
</script>

<template>
  <div class="poetry-infograph-container">
    <div class="infograph-header">
      <div class="title-wrap">
        <span class="badge-tag">小學童趣味通識</span>
        <h3 class="main-title">古文大講堂 ‧ 知識小寶盒</h3>
        <p class="sub-title">圖表對比、朝代時光軸、意象解碼與文豪朋友圈，一眼看懂唐詩宋詞元曲！</p>
      </div>
      <div class="infograph-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'timeline' }"
          @click="activeTab = 'timeline'"
        >
          <span class="tab-icon">📜</span>
          <span class="tab-label">時光演進軸</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          <span class="tab-icon">📊</span>
          <span class="tab-label">體裁全景表</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'imagery' }"
          @click="activeTab = 'imagery'"
        >
          <span class="tab-icon">🌸</span>
          <span class="tab-label">意象密碼庫</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'social' }"
          @click="activeTab = 'social'"
        >
          <span class="tab-icon">🗺️</span>
          <span class="tab-label">文豪好友圈</span>
        </button>
      </div>
    </div>

    <!-- Panel 1: Timeline -->
    <div v-if="activeTab === 'timeline'" class="tab-content timeline-panel">
      <div class="timeline-intro">
        <p>跟著時光飛船出發！看看古人說話寫詩是怎樣從四言古詩，一步步變成唐詩、宋詞、元曲的吧！</p>
      </div>
      <div class="timeline-flow">
        <div
          v-for="(era, idx) in timelineData"
          :key="era.period"
          class="timeline-card"
        >
          <div class="step-badge">第 {{ idx + 1 }} 站</div>
          <div class="card-top">
            <span class="era-icon">{{ era.icon }}</span>
            <div class="era-meta">
              <span class="era-period">{{ era.period }}</span>
              <h4 class="era-title">{{ era.title }}</h4>
            </div>
            <span class="era-tag">{{ era.badge }}</span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">體裁特點：</span>
              <span class="info-val">{{ era.characteristics }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">代表大師：</span>
              <span class="info-val font-semibold">{{ era.representativeMaster }}</span>
            </div>
            <div class="quote-box">
              <span class="quote-mark">“</span>
              <span class="quote-text">{{ era.famousQuote }}</span>
            </div>
            <div class="kid-box">
              <span class="kid-tag">👦 小童聽懂了：</span>
              <p class="kid-text">{{ era.kidExplain }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel 2: Table Comparison -->
    <div v-if="activeTab === 'table'" class="tab-content table-panel">
      <div class="table-intro">
        <p>唐詩、宋詞、元曲到底有什麼不一樣？用一張彩色對比表，讓你五分鐘變身古文小博士！</p>
      </div>
      <div class="table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="col-aspect">比較維度</th>
              <th class="col-tang">唐詩 🌟</th>
              <th class="col-song">宋詞 🪷</th>
              <th class="col-yuan">元曲 🐎</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in compareTable" :key="row.aspect">
              <td class="cell-aspect">{{ row.aspect }}</td>
              <td class="cell-tang">{{ row.tang }}</td>
              <td class="cell-song">{{ row.song }}</td>
              <td class="cell-yuan">{{ row.yuan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Panel 3: Imagery Cards -->
    <div v-if="activeTab === 'imagery'" class="tab-content imagery-panel">
      <div class="imagery-intro">
        <p>古詩詞裡的「小暗號」！詩人看見月亮在想什麼？看到柳樹又要表達什麼？解開密碼，古詩一點都不難！</p>
      </div>
      <div class="imagery-grid">
        <div
          v-for="img in imageryData"
          :key="img.symbol"
          class="imagery-card"
        >
          <div class="imagery-top">
            <span class="imagery-icon">{{ img.icon }}</span>
            <div class="imagery-title-group">
              <h4 class="imagery-name">{{ img.symbol }}</h4>
              <span class="imagery-meaning">{{ img.meaning }}</span>
            </div>
          </div>
          <div class="sample-verse-box">
            <p class="sample-verse">{{ img.sampleVerse }}</p>
            <span class="sample-author">{{ img.author }}</span>
          </div>
          <div class="kid-tip-box">
            <span class="tip-icon">💡</span>
            <span class="tip-text">{{ img.kidTip }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel 4: Social Network -->
    <div v-if="activeTab === 'social'" class="tab-content social-panel">
      <div class="social-intro">
        <p>穿越千年看文豪朋友圈！李白杜甫是怎樣成為好兄弟的？蘇東坡和辛棄疾又有什麼共同心願？</p>
      </div>
      <div class="social-grid">
        <div
          v-for="item in socialRelations"
          :key="item.duo"
          class="social-card"
        >
          <div class="social-top">
            <span class="social-icon">{{ item.icon }}</span>
            <div class="social-meta">
              <h4 class="social-duo">{{ item.duo }}</h4>
              <span class="social-relation">{{ item.relation }}</span>
            </div>
          </div>
          <p class="social-story">{{ item.story }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-infograph-container {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.infograph-header {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .infograph-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.badge-tag {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2b6cb0;
  background: #ebf8ff;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid #bee3f8;
}

.main-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0;
  letter-spacing: -0.02em;
}

.sub-title {
  font-size: 0.875rem;
  color: var(--color-text-muted, #718096);
  margin: 0;
  line-height: 1.4;
}

.infograph-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f7fafc);
  color: var(--color-text-muted, #4a5568);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #edf2f7;
  color: var(--color-text, #1a202c);
}

.tab-btn.active {
  background: #2b6cb0;
  border-color: #2b6cb0;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(43, 108, 176, 0.25);
}

.tab-intro {
  font-size: 0.9rem;
  color: var(--color-text-muted, #4a5568);
  margin-bottom: 1.25rem;
  padding: 0.6rem 1rem;
  background: #f7fafc;
  border-left: 4px solid #3182ce;
  border-radius: 0 8px 8px 0;
}

/* Timeline Layout */
.timeline-flow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .timeline-flow {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

.timeline-card {
  position: relative;
  background: var(--color-bg-subtle, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
}

.step-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #c53030;
  background: #fff5f5;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
  border: 1px solid #fed7d7;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.era-icon {
  font-size: 1.75rem;
}

.era-meta {
  flex: 1;
}

.era-period {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 500;
}

.era-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text, #1a202c);
  margin: 0;
}

.era-tag {
  font-size: 0.75rem;
  font-weight: 600;
  background: #edf2f7;
  color: #4a5568;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.info-row {
  font-size: 0.825rem;
  color: var(--color-text-muted, #4a5568);
  margin-bottom: 0.25rem;
}

.info-label {
  color: #718096;
}

.quote-box {
  background: rgba(43, 108, 176, 0.06);
  border-left: 3px solid #3182ce;
  border-radius: 0 8px 8px 0;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
  font-size: 0.85rem;
  font-style: italic;
  color: #2c5282;
  display: flex;
  gap: 0.35rem;
}

.kid-box {
  background: #fffaf0;
  border: 1px dashed #fbd38d;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
}

.kid-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #dd6b20;
}

.kid-text {
  font-size: 0.8rem;
  color: #744210;
  margin: 0.2rem 0 0 0;
  line-height: 1.35;
}

/* Table Layout */
.table-wrapper {
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid var(--color-border, #e2e8f0);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  min-width: 600px;
}

.compare-table th {
  padding: 0.85rem 1rem;
  font-weight: 700;
  border-bottom: 2px solid var(--color-border, #e2e8f0);
}

.col-aspect {
  background: #f7fafc;
  color: #4a5568;
  width: 18%;
}

.col-tang {
  background: #ebf8ff;
  color: #2b6cb0;
  width: 27%;
}

.col-song {
  background: #f0fff4;
  color: #276749;
  width: 27%;
}

.col-yuan {
  background: #fffaf0;
  color: #c05621;
  width: 28%;
}

.compare-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  vertical-align: top;
  line-height: 1.45;
}

.cell-aspect {
  font-weight: 700;
  color: #4a5568;
  background: #f8fafc;
}

.cell-tang {
  background: #f7fafc;
  color: #2d3748;
}

.cell-song {
  background: #fcfffb;
  color: #2d3748;
}

.cell-yuan {
  background: #fffdfa;
  color: #2d3748;
}

/* Imagery Cards */
.imagery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .imagery-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

.imagery-card {
  background: var(--color-bg-subtle, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.imagery-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e0;
}

.imagery-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.imagery-icon {
  font-size: 2rem;
}

.imagery-title-group {
  display: flex;
  flex-direction: column;
}

.imagery-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0;
}

.imagery-meaning {
  font-size: 0.75rem;
  color: #4a5568;
  font-weight: 500;
}

.sample-verse-box {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
}

.sample-verse {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b6cb0;
  margin: 0 0 0.25rem 0;
}

.sample-author {
  font-size: 0.725rem;
  color: #718096;
}

.kid-tip-box {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  background: #fefcbf;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #744210;
  line-height: 1.35;
}

/* Social Grid */
.social-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .social-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

.social-card {
  background: var(--color-bg-subtle, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.social-card:hover {
  border-color: #cbd5e0;
}

.social-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.social-icon {
  font-size: 1.75rem;
}

.social-meta {
  display: flex;
  flex-direction: column;
}

.social-duo {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0;
}

.social-relation {
  font-size: 0.75rem;
  color: #c53030;
  font-weight: 600;
}

.social-story {
  font-size: 0.825rem;
  color: var(--color-text-muted, #4a5568);
  line-height: 1.45;
  margin: 0;
}
</style>
