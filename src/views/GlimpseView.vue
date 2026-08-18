<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence, WorkDescription } from '@/types/content'
import { catalogWorks } from '@/data/catalog'
import { getWorkDescription } from '@/data/catalogApi'
import { loadChapterContent } from '@/data/workLoader'
import { schools } from '@/data/schools'

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
  workDescObj?: WorkDescription | null
  authorName: string
  periodName: string
}

const glimpses = ref<GlimpseItem[]>([])
const currentIndex = ref(0)
const isRefreshing = ref(false)
const viewMode = ref<'parallel' | 'stacked'>('parallel')
const copySuccess = ref(false)
const activeIntroTab = ref<'summary' | 'significance' | 'allusions'>('summary')
const selectedSchoolId = ref('all')
const drawCount = ref(5)

const currentGlimpse = computed(() => glimpses.value[currentIndex.value] ?? null)

// Watchers to auto-refresh when criteria change
watch([selectedSchoolId, drawCount], () => {
  sampleGlimpses()
})

async function sampleGlimpses() {
  isRefreshing.value = true
  const allWorks = catalogWorks
  
  // Filter works that have chapters and match school
  let validWorks = allWorks.filter(w => w.chapterIds && w.chapterIds.length > 0)
  if (selectedSchoolId.value !== 'all') {
    validWorks = validWorks.filter(w => w.schoolId === selectedSchoolId.value)
  }
  
  // Collect all chapters across valid works
  const allChaptersList: { work: Work; chapterId: string }[] = []
  for (const w of validWorks) {
    for (const cId of w.chapterIds) {
      allChaptersList.push({ work: w, chapterId: cId })
    }
  }

  // Shuffle and pick selected items
  const shuffled = [...allChaptersList].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, drawCount.value)

  const items: GlimpseItem[] = []
  for (const item of selected) {
    const content = await loadChapterContent(item.chapterId)
    if (!content) continue
    const ch = content.chapter
    const ps = content.passages
    
    const sentenceMap = new Map<string, Sentence[]>()
    const aidMap = new Map<string, { translation?: string; analysis?: string }>()

    for (const p of ps) {
      sentenceMap.set(p.id, content.sentences.filter(sentence => sentence.passageId === p.id))
      aidMap.set(p.id, p.readingAid || { translation: '', analysis: '' })
    }

    const descObj = getWorkDescription(item.work.id)

    items.push({
      work: item.work,
      chapter: ch,
      passages: ps,
      passageSentences: sentenceMap,
      passageAids: aidMap,
      workDescObj: descObj || null,
      authorName: descObj?.author || item.work.subtitle || '古聖先賢',
      periodName: descObj?.period || '先秦兩漢',
    })
  }

  glimpses.value = items
  currentIndex.value = 0
  activeIntroTab.value = 'summary'

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

onMounted(async () => {
  await sampleGlimpses()
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
          <RedSeal text="驚鴻一撇" :size="46" :animate="true" />
          <div>
            <h1 class="page-title">驚鴻一撇</h1>
            <p class="page-subtitle">偶爾遇見，終生不忘 — 於全庫 50+ 典籍中隨機邂逅 {{ drawCount }} 處經典章節</p>
          </div>
        </div>
      </div>

      <div class="header-controls">
        <div class="filter-group">
          <select v-model="selectedSchoolId" class="glimpse-select">
            <option value="all">所有學派</option>
            <option v-for="school in schools" :key="school.id" :value="school.id">
              {{ school.icon }} {{ school.name }}
            </option>
          </select>
          <select v-model="drawCount" class="glimpse-select">
            <option :value="1">抽 1 景</option>
            <option :value="5">抽 5 景</option>
            <option :value="10">抽 10 景</option>
          </select>
        </div>

        <!-- Re-roll Chapters Button -->
        <button
          class="reroll-primary-btn"
          :class="{ spinning: isRefreshing }"
          @click="sampleGlimpses"
        >
          <span class="reroll-icon">🎲</span>
          <span class="reroll-text">隨機換一批</span>
        </button>

        <!-- View Mode Toggle -->
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
      </div>
    </header>

    <!-- Tab Progress Selector -->
    <nav class="glimpse-tabs" v-if="glimpses.length > 1">
      <div class="tabs-label">驚鴻 {{ glimpses.length }} 景：</div>
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
      <!-- Book Intro Banner Card (High Contrast Theme Color) -->
      <section class="work-intro-card">
        <div class="card-header-top">
          <div class="meta-row">
            <SchoolBadge :schoolId="currentGlimpse.work.schoolId" size="md" />
            <span class="meta-era">〔{{ currentGlimpse.periodName }}〕</span>
            <span class="meta-author">作者：{{ currentGlimpse.authorName }}</span>
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
        </div>

        <!-- 3-Tab Detailed Work Knowledge & Transmission -->
        <div class="intro-knowledge-box">
          <div class="knowledge-tabs">
            <button
              class="ktab-btn"
              :class="{ active: activeIntroTab === 'summary' }"
              @click="activeIntroTab = 'summary'"
            >
              📖 典籍解題
            </button>
            <button
              class="ktab-btn"
              :class="{ active: activeIntroTab === 'significance' }"
              @click="activeIntroTab = 'significance'"
            >
              🏛️ 文脈地位與傳承
            </button>
            <button
              v-if="currentGlimpse.workDescObj?.keyAllusions && currentGlimpse.workDescObj.keyAllusions.length > 0"
              class="ktab-btn"
              :class="{ active: activeIntroTab === 'allusions' }"
              @click="activeIntroTab = 'allusions'"
            >
              💡 經典典故成語
            </button>
          </div>

          <div class="knowledge-content">
            <!-- Tab 1: Summary -->
            <div v-if="activeIntroTab === 'summary'" class="tab-pane">
              <p class="intro-text">
                {{ currentGlimpse.workDescObj?.introduction || currentGlimpse.work.sourceNote }}
              </p>
            </div>

            <!-- Tab 2: Significance -->
            <div v-else-if="activeIntroTab === 'significance'" class="tab-pane">
              <p class="intro-text highlight">
                {{ currentGlimpse.workDescObj?.significance || '本典籍為中華文脈之璀璨瑰寶，記錄古聖先賢之治國修身智謀，歷代傳誦不絕。' }}
              </p>
            </div>

            <!-- Tab 3: Allusions -->
            <div v-else-if="activeIntroTab === 'allusions'" class="tab-pane">
              <div class="allusions-chips">
                <span
                  v-for="(allusion, aIdx) in currentGlimpse.workDescObj?.keyAllusions"
                  :key="aIdx"
                  class="allusion-chip"
                >
                  ✨ {{ allusion }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Bottom Action Bar -->
        <div class="card-actions-bar">
          <button class="action-btn primary" @click="goToChapter(currentGlimpse.chapter.id)">
            📖 深入研讀本篇全章
          </button>
          <button class="action-btn secondary" @click="copyGlimpseQuote">
            📋 複製經典金句
          </button>
          <button class="action-btn reroll-secondary" @click="sampleGlimpses">
            🎲 換一批
          </button>
          <span v-if="copySuccess" class="copy-toast">✓ 已成功複製經文至剪貼簿！</span>
        </div>
      </section>

      <!-- Chapter Content Section (High Contrast Theme Color) -->
      <section class="chapter-content-card">
        <!-- Section Controls -->
        <div class="chapter-nav-bar">
          <button class="nav-arrow-btn" @click="prevGlimpse" title="上一景 (方向鍵 ←)">
            ← 上一景
          </button>
          <span class="chapter-counter">驚鴻第 {{ currentIndex + 1 }} / {{ glimpses.length }} 景</span>
          <button class="nav-arrow-btn" @click="nextGlimpse" title="下一景 (方向鍵 →)">
            下一景 →
          </button>
        </div>

        <!-- Mode A: Parallel Dual-Column Mode -->
        <div v-if="viewMode === 'parallel'" class="parallel-view">
          <div v-for="(p, pIdx) in currentGlimpse.passages" :key="p.id" class="passage-parallel-row">
            <!-- Left Column: Classical Text -->
            <div class="classical-col">
              <div class="passage-num">第 {{ pIdx + 1 }} 段</div>
              <p class="classical-text">{{ p.canonicalText }}</p>
            </div>

            <!-- Right Column: Vernacular Translation & Analysis -->
            <div class="translation-col">
              <div class="aid-block translation-block">
                <span class="aid-label">【白話譯文】</span>
                <p class="aid-text">
                  {{ currentGlimpse.passageAids.get(p.id)?.translation || '白話文譯文詳見對照模式。' }}
                </p>
              </div>

              <div
                v-if="currentGlimpse.passageAids.get(p.id)?.analysis"
                class="aid-block analysis-block"
              >
                <span class="aid-label">【專屬賞析】</span>
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
                <h4 class="aid-title">【譯】白話文釋義</h4>
                <p class="aid-body">
                  {{ currentGlimpse.passageAids.get(p.id)?.translation || '白話譯文對照中。' }}
                </p>
              </div>

              <div class="aid-card analysis">
                <h4 class="aid-title">【析】核心哲思與背景註釋</h4>
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
  font-size: var(--fs-3xl, 2.2rem);
  font-weight: var(--fw-bold);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold), var(--c-gold-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.12em;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin-top: 4px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: var(--sp-2);
}

.glimpse-select {
  padding: 8px 12px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.glimpse-select:hover,
.glimpse-select:focus {
  border-color: var(--c-gold);
  box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.2);
}

/* Prominent Re-roll Button */
.reroll-primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--c-gold), var(--c-gold-dark));
  color: #111;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(201, 169, 110, 0.35);
  transition: all 0.25s var(--ease-out);
}

.reroll-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 169, 110, 0.5);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold));
}

.reroll-icon {
  font-size: 1.1rem;
  transition: transform 0.4s ease;
}

.reroll-primary-btn:hover .reroll-icon {
  transform: rotate(180deg);
}

.mode-toggle {
  display: flex;
  background: var(--c-bg-card-subtle, rgba(201, 169, 110, 0.08));
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 3px;
}

.mode-btn {
  padding: 8px 16px;
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

/* ── 5 Tab Selector ── */
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
  font-weight: var(--fw-bold);
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
  padding: 10px 16px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
}

.glimpse-tab-btn:hover {
  border-color: var(--c-gold);
  background: var(--c-bg-card-subtle);
}

.glimpse-tab-btn.active {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.15));
  border-color: var(--c-gold);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.25);
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
  max-width: 140px;
}

/* ── Work Intro Card (Theme Compliant High Contrast) ── */
.work-intro-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg, 16px);
  padding: var(--sp-6);
  margin-bottom: var(--sp-6);
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.1));
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
  color: var(--c-text-secondary);
  font-family: var(--font-sans);
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
  margin-bottom: var(--sp-4);
}

.work-main-title {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl, 1.85rem);
  font-weight: var(--fw-bold);
  color: var(--c-gold-dark, #b58d3d);
}

.chapter-sub-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xl, 1.3rem);
  color: var(--c-text-primary);
  font-weight: var(--fw-bold);
}

/* Knowledge Box & Tabs */
.intro-knowledge-box {
  background: var(--c-bg-card-subtle, rgba(201, 169, 110, 0.05));
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.knowledge-tabs {
  display: flex;
  gap: var(--sp-2);
  border-bottom: 1px solid var(--c-border-subtle);
  padding-bottom: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.ktab-btn {
  padding: 6px 14px;
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.ktab-btn:hover {
  color: var(--c-text-primary);
}

.ktab-btn.active {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.intro-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.8;
  color: var(--c-text-primary);
}

.intro-text.highlight {
  color: var(--c-text-primary);
  border-left: 3px solid var(--c-gold);
  padding-left: var(--sp-3);
}

.allusions-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.allusion-chip {
  padding: 4px 12px;
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid var(--c-border);
  border-radius: 20px;
  font-size: var(--fs-xs);
  color: var(--c-gold-dark);
  font-family: var(--font-serif);
}

.card-actions-bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.action-btn {
  padding: 9px 20px;
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
  box-shadow: 0 2px 10px rgba(201, 169, 110, 0.4);
}

.action-btn.secondary {
  background: var(--c-bg-card);
  color: var(--c-text-primary);
  border: 1px solid var(--c-border);
}

.action-btn.secondary:hover {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.action-btn.reroll-secondary {
  background: transparent;
  color: var(--c-gold);
  border: 1px dashed var(--c-gold);
}

.action-btn.reroll-secondary:hover {
  background: var(--c-gold-glow);
}

.copy-toast {
  font-size: var(--fs-xs);
  color: var(--c-accent-dao, #5b8a72);
  font-weight: var(--fw-bold);
}

/* ── Chapter Content Section (High Contrast Theme Color) ── */
.chapter-content-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg, 16px);
  padding: var(--sp-6);
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.1));
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
  padding: 8px 16px;
  background: var(--c-bg-card-subtle);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow-btn:hover {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.chapter-counter {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-gold);
  font-weight: var(--fw-bold);
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
  padding: var(--sp-5);
  background: var(--c-bg-card-subtle, rgba(201, 169, 110, 0.04));
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .passage-parallel-row {
    grid-template-columns: 1fr;
  }
}

.classical-col {
  border-right: 1px dashed var(--c-border);
  padding-right: var(--sp-5);
}

@media (max-width: 768px) {
  .classical-col {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px dashed var(--c-border);
    padding-bottom: var(--sp-4);
  }
}

.passage-num {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
  font-family: var(--font-serif);
  font-weight: var(--fw-bold);
}

.classical-text {
  font-family: var(--font-serif);
  font-size: var(--fs-xl, 1.2rem);
  line-height: 1.95;
  color: var(--c-text-primary);
  letter-spacing: 0.05em;
}

.translation-col {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.aid-block {
  padding: var(--sp-4);
  border-radius: var(--radius-sm);
}

.translation-block {
  background: rgba(91, 138, 114, 0.08);
  border-left: 4px solid var(--c-accent-dao, #5b8a72);
}

.analysis-block {
  background: rgba(201, 169, 110, 0.08);
  border-left: 4px solid var(--c-gold);
}

.aid-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--c-gold-dark, #b58d3d);
  display: block;
  margin-bottom: 6px;
}

.aid-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--c-text-primary);
}

/* Stacked Mode */
.stacked-view {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.passage-stacked-card {
  background: var(--c-bg-card-subtle);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-6);
}

.passage-stacked-header {
  margin-bottom: var(--sp-4);
}

.passage-badge {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  padding: 4px 12px;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-radius: var(--radius-sm);
  font-weight: var(--fw-bold);
}

.classical-text-box {
  margin-bottom: var(--sp-6);
  padding: var(--sp-5);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
}

.classical-text-large {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl, 1.35rem);
  line-height: 2;
  color: var(--c-text-primary);
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
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
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
  color: var(--c-gold-dark);
  margin-bottom: var(--sp-2);
  font-weight: var(--fw-bold);
}

.aid-body {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: 1.75;
  color: var(--c-text-primary);
}
</style>
