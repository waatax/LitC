<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getChapter, getPassagesByChapter, getSentencesByPassage, getWorks } from '@/data'
import SchoolBadge from '@/components/SchoolBadge.vue'

const route = useRoute()
const router = useRouter()

const chapter = ref<Chapter | null>(null)
const work = ref<Work | null>(null)
const passages = ref<Passage[]>([])
const passageSentences = ref<Map<string, Sentence[]>>(new Map())

type ReadingMode = 'clean' | 'assisted'
const readingMode = ref<ReadingMode>('clean')

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

      <!-- Reading Mode Tabs -->
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

      <!-- Reading Content -->
      <div class="reading-content">
        <!-- Clean Mode -->
        <div v-if="readingMode === 'clean'" class="clean-mode">
          <div class="text-body classical-text-lg">
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
          <div
            v-for="sentence in allSentences"
            :key="sentence.id"
            class="sentence-row"
          >
            <p class="sentence-original classical-text">{{ sentence.canonicalText }}</p>
            <p v-if="sentence.translationHint" class="sentence-hint">
              💡 {{ sentence.translationHint }}
            </p>
          </div>
          <div v-if="allSentences.length === 0" class="no-data">
            <p>尚無句級資料</p>
          </div>
        </div>
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
</style>
