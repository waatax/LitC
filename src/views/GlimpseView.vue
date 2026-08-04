<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence } from '@/types/content'
import { getWorks, getChapter, getPassagesByChapter, getSentencesByPassage, getWorkDescription } from '@/data'
import { getPassageReadingAid } from '@/data/readingAid'
import SchoolBadge from '@/components/SchoolBadge.vue'
import RedSeal from '@/components/RedSeal.vue'

const router = useRouter()
const mounted = ref(false)

export interface GlimpseItem {
  work: Work
  chapter: Chapter
  passages: Passage[]
  passageSentences: Map<string, Sentence[]>
  passageAids: Map<string, { translation?: string; analysis?: string }>
  workDesc?: string | null
  authorName: string
  periodName: string
}

const glimpses = ref<GlimpseItem[]>([])
const currentIndex = ref(0)
const isRefreshing = ref(false)
const viewMode = ref<'parallel' | 'stacked'>('parallel')
const copySuccess = ref(false)

const currentGlimpse = computed(() => glimpses.value[currentIndex.value] ?? null)

function sampleGlimpses() {
  isRefreshing.value = true
  const allWorks = getWorks()
  
  // Filter works that have chapters
  const validWorks = allWorks.filter(w => w.chapterIds && w.chapterIds.length > 0)
  
  // Collect all chapters across valid works
  const allChaptersList: { work: Work; chapterId: string }[] = []
  for (const w of validWorks) {
    for (const cId of w.chapterIds) {
      allChaptersList.push({ work: w, chapterId: cId })
    }
  }

  // Shuffle and pick 5 distinct items
  const shuffled = [...allChaptersList].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 5)

  const items: GlimpseItem[] = []
  for (const item of selected) {
    const ch = getChapter(item.chapterId)
    if (!ch) continue
    const ps = getPassagesByChapter(item.chapterId)
    
    const sentenceMap = new Map<string, Sentence[]>()
    const aidMap = new Map<string, { translation?: string; analysis?: string }>()

    for (const p of ps) {
      sentenceMap.set(p.id, getSentencesByPassage(p.id))
      aidMap.set(p.id, getPassageReadingAid(p.id) || {})
    }

    const descObj = getWorkDescription(item.work.id)

    items.push({
      work: item.work,
      chapter: ch,
      passages: ps,
      passageSentences: sentenceMap,
      passageAids: aidMap,
      workDesc: descObj ? descObj.introduction || descObj.significance : item.work.sourceNote,
      authorName: descObj?.author || item.work.subtitle || '古聖先賢',
      periodName: descObj?.period || '先秦兩漢',
    })
  }

  glimpses.value = items
  currentIndex.value = 0

  setTimeout(() => {
    isRefreshing.value = false
  }, 400)
}

function nextGlimpse() {
  if (glimpses.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % glimpses.value.length
}

function prevGlimpse() {
  if (glimpses.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + glimpses.value.length) % glimpses.value.length
}

function selectGlimpse(idx: number) {
  currentIndex.value = idx
}

function goToChapter(chapterId: string) {
  router.push(`/chapter/${chapterId}`)
}

function copyGlimpseQuote() {
  if (!currentGlimpse.value) return
  const g = currentGlimpse.value
  const firstPassage = g.passages[0]?.canonicalText || ''
  const shareText = `【驚鴻一撇·${g.work.title}】${g.chapter.title}\n\n「${firstPassage}」\n\n— 經典文脈 ClassicFlow`
  navigator.clipboard.writeText(shareText).then(() => {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') {
    nextGlimpse()
  } else if (e.key === 'ArrowLeft') {
    prevGlimpse()
  }
}

onMounted(() => {
  sampleGlimpses()
  window.addEventListener('keydown', handleKeydown)
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="glimpse-page" :class="{ ready: mounted }">
    <!-- Top Header -->
    <header class="glimpse-header">
      <div class="header-left">
        <div class="title-badge">
          <RedSeal text="驚鴻" :size="36" />
          <div>
            <h1 class="page-title">驚鴻一撇</h1>
            <p class="page-subtitle">偶爾遇見，終生不忘 — 於全庫 50+ 典籍中隨機邂逅五處經典</p>
          </div>
        </div>
      </div>

      <div class="header-controls">
        <div class="mode-toggle">
          <button
            class="mode-btn"
            :class="{ active: viewMode === 'parallel' }"
            @click="viewMode = 'parallel'"
          >
            雙欄對照
          </button>
          <button
            class="mode-btn"
            :class="{ active: viewMode === 'stacked' }"
            @click="viewMode = 'stacked'"
          >
            逐段賞析
          </button>
        </div>

        <button
          class="refresh-btn"
          :class="{ spinning: isRefreshing }"
          @click="sampleGlimpses"
          title="重新隨機抽樣五處"
        >
          <span class="refresh-icon">🔄</span>
          <span class="refresh-text">重新邂逅</span>
        </button>
      </div>
    </header>

    <!-- 5 Tab Progress Selector -->
    <nav class="glimpse-tabs">
      <div class="tabs-label">驚鴻五景：</div>
      <div class="tabs-list">
        <button
          v-for="(g, idx) in glimpses"
          :key="g.chapter.id"
          class="glimpse-tab-btn"
          :class="{ active: currentIndex === idx }"
          @click="selectGlimpse(idx)"
        >
          <span class="tab-num">景 {{ idx + 1 }}</span>
          <span class="tab-title">{{ g.work.title }}・{{ g.chapter.title }}</span>
        </button>
      </div>
    </nav>

    <!-- Main Card Body -->
    <main v-if="currentGlimpse" class="glimpse-content">
      <!-- Book Intro Banner Card -->
      <section class="work-intro-card">
        <div class="card-header">
          <div class="meta-row">
            <SchoolBadge :schoolId="currentGlimpse.work.schoolId" size="md" />
            <span class="meta-era">{{ currentGlimpse.periodName }}</span>
            <span class="meta-author">〔{{ currentGlimpse.authorName }}〕</span>
            <div class="meta-difficulty">
              <span class="star-label">難易度：</span>
              <span class="stars">
                <template v-for="s in 5" :key="s">
                  {{ s <= currentGlimpse.chapter.difficulty ? '★' : '☆' }}
                </template>
              </span>
            </div>
          </div>

          <div class="work-title-group">
            <h2 class="work-main-title">{{ currentGlimpse.work.title }}</h2>
            <span class="chapter-sub-title">《{{ currentGlimpse.chapter.title }}》</span>
          </div>

          <p class="work-description">
            {{ currentGlimpse.workDesc || currentGlimpse.work.sourceNote }}
          </p>

          <div class="card-actions">
            <button class="action-btn primary" @click="goToChapter(currentGlimpse.chapter.id)">
              📖 深入研讀全篇
            </button>
            <button class="action-btn secondary" @click="copyGlimpseQuote">
              📋 複製經典金句
            </button>
            <span v-if="copySuccess" class="copy-toast">✓ 已複製到剪貼簿</span>
          </div>
        </div>
      </section>

      <!-- Chapter Content: Parallel vs Stacked Mode -->
      <section class="chapter-content-card">
        <!-- Section Controls -->
        <div class="chapter-nav-bar">
          <button class="nav-arrow-btn" @click="prevGlimpse" title="上一景 (方向鍵 ←)">
            ← 上一景
          </button>
          <span class="chapter-counter">第 {{ currentIndex + 1 }} / {{ glimpses.length }} 景</span>
          <button class="nav-arrow-btn" @click="nextGlimpse" title="下一景 (方向鍵 →)">
            下一景 →
          </button>
        </div>

        <!-- Mode A: Parallel Dual-Column Mode -->
        <div v-if="viewMode === 'parallel'" class="parallel-view">
          <div v-for="(p, pIdx) in currentGlimpse.passages" :key="p.id" class="passage-parallel-row">
            <!-- Left Column: Classical Text -->
            <div class="classical-col">
              <div class="passage-num">段 {{ pIdx + 1 }}</div>
              <p class="classical-text">{{ p.canonicalText }}</p>
            </div>

            <!-- Right Column: Vernacular Translation & Analysis -->
            <div class="translation-col">
              <div class="aid-block translation-block">
                <span class="aid-label">【白話譯文】</span>
                <p class="aid-text">
                  {{ currentGlimpse.passageAids.get(p.id)?.translation || '白話文譯文詳見完整對照模式。' }}
                </p>
              </div>

              <div
                v-if="currentGlimpse.passageAids.get(p.id)?.analysis"
                class="aid-block analysis-block"
              >
                <span class="aid-label">【專屬解析】</span>
                <p class="aid-text">
                  {{ currentGlimpse.passageAids.get(p.id)?.analysis }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mode B: Stacked Bespoke Analysis Mode -->
        <div v-else class="stacked-view">
          <div v-for="(p, pIdx) in currentGlimpse.passages" :key="p.id" class="passage-stacked-card">
            <div class="passage-stacked-header">
              <span class="passage-badge">第 {{ pIdx + 1 }} 段</span>
            </div>

            <div class="classical-text-box">
              <p class="classical-text-large">{{ p.canonicalText }}</p>
            </div>

            <div class="stacked-aid-grid">
              <div class="aid-card translation">
                <h4 class="aid-title">譯 白話文釋義</h4>
                <p class="aid-body">
                  {{ currentGlimpse.passageAids.get(p.id)?.translation || '白話譯文對照中。' }}
                </p>
              </div>

              <div class="aid-card analysis">
                <h4 class="aid-title">析 核心哲思與背景註釋</h4>
                <p class="aid-body">
                  {{ currentGlimpse.passageAids.get(p.id)?.analysis || '專屬學術解析備悉中。' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.glimpse-page {
  padding: var(--sp-6) var(--sp-6) var(--sp-12);
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}

.glimpse-page.ready {
  opacity: 1;
  transform: translateY(0);
}

/* ── Header ── */
.glimpse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
  flex-wrap: wrap;
}

.title-badge {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl, 2rem);
  font-weight: var(--fw-bold);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold), var(--c-gold-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.1em;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin-top: 4px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  padding: 3px;
}

.mode-btn {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: var(--c-gold);
  color: #111;
  font-weight: var(--fw-bold);
  box-shadow: 0 2px 8px rgba(201, 169, 110, 0.3);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.15), rgba(201, 169, 110, 0.05));
  border: 1px solid var(--c-gold);
  border-radius: var(--radius-md);
  color: var(--c-gold-light);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: var(--c-gold);
  color: #111;
  box-shadow: 0 0 16px rgba(201, 169, 110, 0.4);
}

.refresh-btn.spinning .refresh-icon {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── 5 Tab Progress Selector ── */
.glimpse-tabs {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
  overflow-x: auto;
  padding-bottom: 8px;
}

.tabs-label {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-gold);
  flex-shrink: 0;
}

.tabs-list {
  display: flex;
  gap: var(--sp-2);
}

.glimpse-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.glimpse-tab-btn:hover {
  background: rgba(201, 169, 110, 0.1);
  border-color: rgba(201, 169, 110, 0.4);
}

.glimpse-tab-btn.active {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.15));
  border-color: var(--c-gold);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.2);
}

.tab-num {
  font-size: 0.7rem;
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.tab-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  color: var(--c-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

/* ── Work Intro Card ── */
.work-intro-card {
  background: rgba(20, 20, 25, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg, 16px);
  padding: var(--sp-6);
  margin-bottom: var(--sp-6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
  flex-wrap: wrap;
}

.meta-era, .meta-author {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.meta-difficulty {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-xs);
  color: var(--c-gold);
}

.stars {
  letter-spacing: 2px;
}

.work-title-group {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
}

.work-main-title {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl, 1.75rem);
  font-weight: var(--fw-bold);
  color: var(--c-gold-light);
}

.chapter-sub-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xl, 1.25rem);
  color: var(--c-text-primary);
}

.work-description {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.action-btn {
  padding: 8px 18px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--c-gold);
  color: #111;
  border: none;
  font-weight: var(--fw-bold);
}

.action-btn.primary:hover {
  background: var(--c-gold-light);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-primary);
  border: 1px solid var(--c-border-subtle);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--c-gold);
}

.copy-toast {
  font-size: var(--fs-xs);
  color: var(--c-accent-dao, #5b8a72);
  margin-left: 8px;
}

/* ── Chapter Content Section ── */
.chapter-content-card {
  background: rgba(20, 20, 25, 0.6);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-lg, 16px);
  padding: var(--sp-6);
}

.chapter-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--sp-4);
  margin-bottom: var(--sp-6);
  border-bottom: 1px solid var(--c-border-subtle);
}

.nav-arrow-btn {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow-btn:hover {
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.chapter-counter {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

/* Parallel Mode */
.parallel-view {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.passage-parallel-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-6);
  padding: var(--sp-4);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .passage-parallel-row {
    grid-template-columns: 1fr;
  }
}

.classical-col {
  border-right: 1px dashed var(--c-border-subtle);
  padding-right: var(--sp-4);
}

@media (max-width: 768px) {
  .classical-col {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px dashed var(--c-border-subtle);
    padding-bottom: var(--sp-4);
  }
}

.passage-num {
  font-size: 0.75rem;
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
  font-family: var(--font-serif);
}

.classical-text {
  font-family: var(--font-serif);
  font-size: var(--fs-lg, 1.125rem);
  line-height: 1.8;
  color: var(--c-text-primary);
  letter-spacing: 0.05em;
}

.translation-col {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.aid-block {
  padding: var(--sp-3);
  border-radius: var(--radius-sm);
}

.translation-block {
  background: rgba(91, 138, 114, 0.08);
  border-left: 3px solid var(--c-accent-dao, #5b8a72);
}

.analysis-block {
  background: rgba(201, 169, 110, 0.08);
  border-left: 3px solid var(--c-gold);
}

.aid-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--c-gold);
  display: block;
  margin-bottom: 4px;
}

.aid-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.6;
  color: var(--c-text-secondary);
}

/* Stacked Mode */
.stacked-view {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.passage-stacked-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--sp-6);
}

.passage-stacked-header {
  margin-bottom: var(--sp-4);
}

.passage-badge {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  padding: 3px 10px;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-radius: var(--radius-sm);
}

.classical-text-box {
  margin-bottom: var(--sp-6);
  padding: var(--sp-4);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
}

.classical-text-large {
  font-family: var(--font-serif);
  font-size: var(--fs-xl, 1.25rem);
  line-height: 1.9;
  color: var(--c-gold-light);
}

.stacked-aid-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
}

@media (max-width: 768px) {
  .stacked-aid-grid {
    grid-template-columns: 1fr;
  }
}

.aid-card {
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--c-border-subtle);
}

.aid-card.translation {
  border-left: 4px solid var(--c-accent-dao, #5b8a72);
}

.aid-card.analysis {
  border-left: 4px solid var(--c-gold);
}

.aid-title {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.aid-body {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--c-text-secondary);
}
</style>
