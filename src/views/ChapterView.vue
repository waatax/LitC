<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getChapter, getPassagesByChapter, getSentencesByPassage, getWorks } from '@/data'
import { getPassageReadingAid, READING_AID_SOURCES } from '@/data/readingAid'
import SchoolBadge from '@/components/SchoolBadge.vue'

const route = useRoute()
const router = useRouter()

const chapter = ref<Chapter | null>(null)
const work = ref<Work | null>(null)
const passages = ref<Passage[]>([])
const passageSentences = ref<Map<string, Sentence[]>>(new Map())

type ReadingMode = 'clean' | 'assisted'
// 典籍庫開啟章節時，優先呈現原文／白話對照；使用者仍可切回純原文。
const readingMode = ref<ReadingMode>('assisted')
const isVertical = ref(false)

const mounted = ref(false)

function loadChapter() {
  const chapterId = route.params.id as string
  if (!chapterId) return

  chapter.value = getChapter(chapterId) ?? null
  if (!chapter.value) return

  // Find parent work
  const allWorks = getWorks()
  work.value = allWorks.find(w => w.id === chapter.value!.workId) ?? null

  // Load passages
  passages.value = getPassagesByChapter(chapterId)

  // Load sentences for each passage
  const sentenceMap = new Map<string, Sentence[]>()
  for (const passage of passages.value) {
    sentenceMap.set(passage.id, getSentencesByPassage(passage.id))
  }
  passageSentences.value = sentenceMap
}

onMounted(() => {
  loadChapter()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(() => route.params.id, () => {
  loadChapter()
})

const genreMeta = computed(() => {
  if (!work.value) return null
  const strategy = chapter.value?.genreStrategyOverride ?? work.value.genreStrategy
  return GENRE_STRATEGY_META[strategy]
})

const fullText = computed(() => {
  return passages.value.map(p => p.canonicalText).join('\n\n')
})

const allSentences = computed(() => {
  const result: Sentence[] = []
  for (const passage of passages.value) {
    const sentences = passageSentences.value.get(passage.id) ?? []
    result.push(...sentences)
  }
  return result
})

function passageAid(passage: Passage) {
  return getPassageReadingAid(
    passage.id,
    passage.canonicalText,
    chapter.value?.workId ?? '',
    passageSentences.value.get(passage.id) ?? [],
  )
}

function goBack() {
  router.push('/library')
}

function goToLearn() {
  if (chapter.value) {
    router.push(`/learn/${chapter.value.id}`)
  }
}

function goToMemorize() {
  if (chapter.value) {
    router.push(`/memorize/${chapter.value.id}`)
  }
}

const prevChapter = computed(() => {
  if (!work.value || !chapter.value) return null
  const idx = work.value.chapterIds.indexOf(chapter.value.id)
  if (idx > 0) {
    return getChapter(work.value.chapterIds[idx - 1]) ?? null
  }
  return null
})

const nextChapter = computed(() => {
  if (!work.value || !chapter.value) return null
  const idx = work.value.chapterIds.indexOf(chapter.value.id)
  if (idx !== -1 && idx < work.value.chapterIds.length - 1) {
    return getChapter(work.value.chapterIds[idx + 1]) ?? null
  }
  return null
})
</script>

<template>
  <div class="chapter-view" :class="{ 'is-mounted': mounted }">
    <!-- Back Button -->
    <button class="back-btn btn btn-ghost" @click="goBack">
      <span>←</span>
      <span>返回典籍庫</span>
    </button>

    <template v-if="chapter && work">
      <!-- Chapter Header -->
      <header class="chapter-header">
        <div class="breadcrumb">
          <span class="breadcrumb-work">{{ work.title }}</span>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-chapter">{{ chapter.title }}</span>
        </div>
        <h1 class="chapter-title">{{ chapter.title }}</h1>
        <div class="chapter-meta">
          <SchoolBadge :school-id="work.schoolId" />
          <span v-if="genreMeta" class="badge genre-badge">
            {{ genreMeta.icon }} {{ genreMeta.label }}
          </span>
          <span class="meta-detail">難度 {{ chapter.difficulty }}/5</span>
          <span class="meta-sep">·</span>
          <span class="meta-detail">約 {{ chapter.estimatedMinutes }} 分鐘</span>
        </div>
      </header>

      <!-- Reading Mode Tabs & Vertical Toggle -->
      <div class="reading-controls-bar">
        <div class="mode-tabs">
          <button
            class="mode-tab"
            :class="{ 'is-active': readingMode === 'clean' }"
            @click="readingMode = 'clean'"
          >
            📖 淨讀
          </button>
          <button
            class="mode-tab"
            :class="{ 'is-active': readingMode === 'assisted' }"
            @click="readingMode = 'assisted'"
          >
            💬 輔讀
          </button>
        </div>

        <button
          class="btn btn-ghost layout-toggle-btn"
          @click="isVertical = !isVertical"
          :title="isVertical ? '切換為橫排' : '切換為直排'"
        >
          {{ isVertical ? '🔤 橫書' : '📜 直書' }}
        </button>
      </div>

      <!-- Reading Content -->
      <div class="reading-content" :class="{ 'is-vertical-layout': isVertical }">
        <!-- Clean Mode -->
        <div v-if="readingMode === 'clean'" class="clean-mode">
          <div v-if="isVertical" class="vertical-container">
            <div class="vertical-text-flow">
              <p
                v-for="passage in passages"
                :key="passage.id"
                class="passage-text"
              >{{ passage.canonicalText }}</p>
            </div>
          </div>
          <div v-else class="text-body classical-text-lg">
            <p
              v-for="passage in passages"
              :key="passage.id"
              class="passage-text"
            >{{ passage.canonicalText }}</p>
          </div>
          <div v-if="work.sourceNote" class="source-note">
            {{ work.sourceNote }}
          </div>
        </div>

        <!-- Assisted Mode -->
        <div v-if="readingMode === 'assisted'" class="assisted-mode">
          <div v-if="isVertical" class="vertical-container" style="height: 520px;">
            <div class="vertical-assisted-list">
              <div v-for="passage in passages" :key="passage.id" class="vertical-passage-box">
                <div class="vertical-orig-wrapper">
                  <p class="sentence-original classical-text-lg vertical-original-text">{{ passage.canonicalText }}</p>
                </div>
                <div class="horizontal-explanation">
                  <p class="sentence-hint"><span class="translation-label">白話</span>{{ passageAid(passage).translation }}</p>
                  <p class="sentence-hint"><span class="translation-label">解析</span>{{ passageAid(passage).analysis }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else v-for="passage in passages" :key="passage.id" class="sentence-row">
            <p class="sentence-original classical-text">{{ passage.canonicalText }}</p>
            <p class="sentence-hint"><span class="translation-label">白話文</span>{{ passageAid(passage).translation }}</p>
            <p class="sentence-hint"><span class="translation-label">解析</span>{{ passageAid(passage).analysis }}</p>
          </div>
          <div v-if="allSentences.length === 0" class="no-data">
            <p>尚無句級資料</p>
          </div>
          <p class="reading-aid-source">
            輔讀校讀參考：
            <a v-for="(source, index) in READING_AID_SOURCES" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}{{ index < READING_AID_SOURCES.length - 1 ? '、' : '' }}</a>
          </p>
        </div>
      </div>

      <!-- Chapter Navigation -->
      <div v-if="prevChapter || nextChapter" class="chapter-navigation">
        <button
          v-if="prevChapter"
          class="btn btn-ghost nav-btn prev-btn"
          @click="router.push(`/chapter/${prevChapter.id}`)"
        >
          <span>← 上一章</span>
          <span class="nav-title">{{ prevChapter.title }}</span>
        </button>
        <div v-else class="nav-placeholder"></div>

        <button
          v-if="nextChapter"
          class="btn btn-ghost nav-btn next-btn"
          @click="router.push(`/chapter/${nextChapter.id}`)"
        >
          <span>下一章 →</span>
          <span class="nav-title">{{ nextChapter.title }}</span>
        </button>
        <div v-else class="nav-placeholder"></div>
      </div>

      <!-- Actions -->
      <div class="chapter-actions">
        <button class="btn btn-primary action-btn" @click="goToLearn">
          <span>📖</span>
          <span>開始學習</span>
        </button>
        <button class="btn btn-ghost action-btn" @click="goToMemorize">
          <span>🧠</span>
          <span>開始背誦</span>
        </button>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else-if="mounted" class="not-found">
      <span class="not-found-icon">📭</span>
      <h2>找不到此章節</h2>
      <p>請確認連結是否正確</p>
      <button class="btn btn-ghost" @click="goBack">返回典籍庫</button>
    </div>
  </div>
</template>

<style scoped>
.chapter-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
}

.chapter-view.is-mounted {
  opacity: 1;
}

.translation-label {
  display: inline-block;
  margin-right: var(--sp-2);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--c-gold-light);
  background: rgba(201, 169, 110, 0.14);
}

/* ── Back Button ── */
.back-btn {
  margin-bottom: var(--sp-6);
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}

/* ── Header ── */
.chapter-header {
  margin-bottom: var(--sp-8);
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.breadcrumb-work {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.breadcrumb-sep {
  color: var(--c-text-muted);
  opacity: 0.4;
}

.breadcrumb-chapter {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
}

.chapter-title {
  font-family: var(--font-serif);
  font-size: var(--fs-4xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-4);
  letter-spacing: 0.05em;
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.genre-badge {
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  border: 1px solid var(--c-border);
}

.meta-detail {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.meta-sep {
  color: var(--c-text-muted);
  opacity: 0.4;
}

/* ── Mode Tabs ── */
.mode-tabs {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--c-border-subtle);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 100ms both;
}

.mode-tab {
  padding: var(--sp-2) var(--sp-5);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--c-text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.mode-tab:hover {
  color: var(--c-text-secondary);
  background: var(--c-bg-card);
}

.mode-tab.is-active {
  color: var(--c-gold);
  background: var(--c-gold-glow);
  border-color: var(--c-border-accent);
}

/* ── Reading Content ── */
.reading-content {
  margin-bottom: var(--sp-10);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 200ms both;
}

/* Clean Mode */
.clean-mode {
  padding: var(--sp-8);
  background: var(--c-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
}

.text-body {
  text-align: justify;
}

.passage-text {
  margin-bottom: var(--sp-6);
  text-indent: 2em;
}

.passage-text:last-child {
  margin-bottom: 0;
}

.source-note {
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border-subtle);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  text-align: right;
}

/* Assisted Mode */
.assisted-mode {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.sentence-row {
  padding: var(--sp-4) var(--sp-5);
  background: var(--c-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.sentence-row:hover {
  border-color: var(--c-border-accent);
}

.sentence-original {
  margin-bottom: var(--sp-2);
}

.sentence-hint {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  padding-left: var(--sp-3);
  border-left: 2px solid var(--c-border-accent);
}

.no-data {
  text-align: center;
  padding: var(--sp-12);
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
}

/* ── Chapter Navigation ── */
.chapter-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sp-4);
  margin-top: var(--sp-8);
  margin-bottom: var(--sp-8);
  padding: var(--sp-4) 0;
  border-top: 1px dashed var(--c-border-subtle);
  border-bottom: 1px dashed var(--c-border-subtle);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 250ms both;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  min-width: 140px;
}

.next-btn {
  align-items: flex-end;
  text-align: right;
}

.nav-title {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  font-weight: var(--fw-normal);
  margin-top: var(--sp-1);
}

.nav-placeholder {
  flex: 1;
}

/* ── Actions ── */
.chapter-actions {
  display: flex;
  gap: var(--sp-4);
  padding-top: var(--sp-6);
  border-top: 1px solid var(--c-border-subtle);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 300ms both;
}

.action-btn {
  padding: var(--sp-4) var(--sp-8);
  font-size: var(--fs-base);
}

/* ── Not Found ── */
.not-found {
  text-align: center;
  padding: var(--sp-20) 0;
}

.not-found-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--sp-4);
}

.not-found h2 {
  margin-bottom: var(--sp-2);
}

.not-found p {
  color: var(--c-text-muted);
  margin-bottom: var(--sp-6);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .clean-mode {
    padding: var(--sp-4);
  }

  .chapter-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

/* ── Reading Controls Bar ── */
.reading-controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-6);
  border-bottom: 1px solid var(--c-border-subtle);
  padding-bottom: var(--sp-3);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 100ms both;
}

.reading-controls-bar .mode-tabs {
  margin-bottom: 0;
  border-bottom: none;
}

.layout-toggle-btn {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  padding: var(--sp-1.5) var(--sp-3);
  height: auto;
}

/* ── Vertical Assisted Layout ── */
.vertical-assisted-list {
  display: flex;
  flex-direction: row-reverse;
  gap: var(--sp-8);
  height: 100%;
  padding: var(--sp-2) 0;
}

.vertical-passage-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px dashed var(--c-border-accent);
  padding-left: var(--sp-6);
}

.vertical-passage-box:last-child {
  border-left: none;
}

.vertical-orig-wrapper {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  flex: 1;
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  line-height: 2.2;
  letter-spacing: 0.15em;
  background-image: repeating-linear-gradient(
    to left,
    transparent,
    transparent 39px,
    var(--c-wusilan-line) 39px,
    var(--c-wusilan-line) 40px
  );
  background-size: 40px 100%;
  padding-left: var(--sp-2);
  white-space: nowrap;
  color: var(--c-text-primary);
}

.vertical-original-text {
  margin: 0;
  padding: 0;
  line-height: 2.2 !important;
  font-size: var(--fs-2xl);
}

.horizontal-explanation {
  writing-mode: horizontal-tb;
  width: 280px;
  margin-top: var(--sp-4);
  font-size: var(--fs-sm);
  opacity: 0.95;
  background: var(--c-bg-card);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-accent);
}

.horizontal-explanation .sentence-hint {
  margin-bottom: var(--sp-3) !important;
  line-height: 1.5;
  color: var(--c-text-secondary);
}

.horizontal-explanation .sentence-hint:last-child {
  margin-bottom: 0 !important;
}

.horizontal-explanation .translation-label {
  font-size: 11px;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
  padding: 1px 4px;
  border-radius: 3px;
  margin-right: 6px;
  display: inline-block;
}
</style>
