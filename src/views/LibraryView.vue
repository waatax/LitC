<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Work, SchoolId, School, Chapter } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getSchools, getWorks, getWorksBySchool, getChapters } from '@/data'
import SchoolBadge from '@/components/SchoolBadge.vue'

const router = useRouter()
const mounted = ref(false)

type FilterTab = 'all' | SchoolId

const activeFilter = ref<FilterTab>('all')
const expandedWorkId = ref<string | null>(null)

// Load data
const allSchools = ref<School[]>([])
const allWorks = ref<Work[]>([])
const workChapters = ref<Map<string, Chapter[]>>(new Map())

onMounted(() => {
  allSchools.value = getSchools()
  allWorks.value = getWorks()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

interface FilterOption {
  id: FilterTab
  label: string
}

const filterTabs: FilterOption[] = [
  { id: 'all', label: '全部' },
  { id: 'daoism', label: '道家' },
  { id: 'legalism', label: '法家' },
  { id: 'mohism', label: '墨家' },
]

const filteredWorks = computed(() => {
  if (activeFilter.value === 'all') {
    return allWorks.value
  }
  return getWorksBySchool(activeFilter.value)
})

function setFilter(tab: FilterTab) {
  activeFilter.value = tab
  expandedWorkId.value = null
}

function toggleWork(workId: string) {
  if (expandedWorkId.value === workId) {
    expandedWorkId.value = null
    return
  }
  expandedWorkId.value = workId
  // Lazy load chapters
  if (!workChapters.value.has(workId)) {
    const chapters = getChapters(workId)
    workChapters.value.set(workId, chapters)
  }
}

function getWorkChapters(workId: string): Chapter[] {
  return workChapters.value.get(workId) ?? []
}

function goToChapter(chapterId: string) {
  router.push(`/chapter/${chapterId}`)
}

function difficultyDots(level: number): string {
  return '●'.repeat(level) + '○'.repeat(5 - level)
}

function countChapters(work: Work): number {
  return work.chapterIds.length
}
</script>

<template>
  <div class="library-view" :class="{ 'is-mounted': mounted }">
    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">典籍庫</h1>
      <p class="page-desc">先秦經典文本，按學派分類</p>
    </header>

    <!-- Filter Tabs -->
    <div class="filter-bar">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        class="filter-tab"
        :class="{ 'is-active': activeFilter === tab.id }"
        @click="setFilter(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Works Grid -->
    <div class="works-grid stagger-children">
      <div
        v-for="work in filteredWorks"
        :key="work.id"
        class="work-card glass-card"
        :class="{ 'is-expanded': expandedWorkId === work.id }"
      >
        <!-- Card Header -->
        <div class="work-header" @click="toggleWork(work.id)">
          <div class="work-info">
            <h3 class="work-title">{{ work.title }}</h3>
            <p v-if="work.subtitle" class="work-subtitle">{{ work.subtitle }}</p>
          </div>
          <div class="work-meta">
            <SchoolBadge :school-id="work.schoolId" />
            <span class="genre-badge badge">
              {{ GENRE_STRATEGY_META[work.genreStrategy].icon }}
              {{ GENRE_STRATEGY_META[work.genreStrategy].label }}
            </span>
          </div>
          <div class="work-stats">
            <span class="stat-text">{{ countChapters(work) }} 篇</span>
            <span class="stat-sep">·</span>
            <span class="stat-text">{{ work.totalChars }} 字</span>
          </div>
          <span class="expand-icon" :class="{ 'is-rotated': expandedWorkId === work.id }">▾</span>
        </div>

        <!-- Expanded Chapters -->
        <Transition name="expand">
          <div v-if="expandedWorkId === work.id" class="chapters-list">
            <div class="chapters-divider"></div>
            <div
              v-for="chapter in getWorkChapters(work.id)"
              :key="chapter.id"
              class="chapter-item"
              @click.stop="goToChapter(chapter.id)"
            >
              <div class="chapter-info">
                <span class="chapter-order">{{ chapter.order }}.</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </div>
              <div class="chapter-meta">
                <span class="chapter-difficulty" :title="`難度 ${chapter.difficulty}/5`">
                  {{ difficultyDots(chapter.difficulty) }}
                </span>
                <span class="chapter-time">~{{ chapter.estimatedMinutes }}分</span>
                <span class="chapter-arrow">→</span>
              </div>
            </div>
            <div
              v-if="getWorkChapters(work.id).length === 0"
              class="no-chapters"
            >
              尚無章節資料
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredWorks.length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <p class="empty-text">此學派尚無典籍</p>
    </div>
  </div>
</template>

<style scoped>
.library-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
}

.library-view.is-mounted {
  opacity: 1;
}

/* ── Header ── */
.page-header {
  margin-bottom: var(--sp-8);
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--fs-4xl);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--sp-2);
}

.page-desc {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

/* ── Filter Tabs ── */
.filter-bar {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-border-subtle);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 100ms both;
}

.filter-tab {
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

.filter-tab:hover {
  color: var(--c-text-secondary);
  background: var(--c-bg-card);
}

.filter-tab.is-active {
  color: var(--c-gold);
  background: var(--c-gold-glow);
  border-color: var(--c-border-accent);
}

/* ── Works Grid ── */
.works-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.work-card {
  overflow: hidden;
  cursor: default;
}

.work-card:hover {
  transform: translateY(-1px);
}

.work-header {
  padding: var(--sp-5) var(--sp-6);
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: var(--sp-2) var(--sp-4);
  align-items: start;
  cursor: pointer;
  position: relative;
}

.work-info {
  grid-column: 1;
  grid-row: 1;
}

.work-title {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
  letter-spacing: 0.05em;
  line-height: var(--lh-tight);
}

.work-subtitle {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin-top: var(--sp-1);
}

.work-meta {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.genre-badge {
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  border: 1px solid var(--c-border);
}

.work-stats {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.stat-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.stat-sep {
  color: var(--c-text-muted);
  opacity: 0.4;
}

.expand-icon {
  position: absolute;
  right: var(--sp-6);
  bottom: var(--sp-4);
  font-size: var(--fs-lg);
  color: var(--c-text-muted);
  transition: transform var(--duration-normal) var(--ease-out);
}

.expand-icon.is-rotated {
  transform: rotate(180deg);
}

/* ── Chapters List ── */
.chapters-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--c-border) 20%,
    var(--c-border) 80%,
    transparent
  );
  margin: 0 var(--sp-6);
}

.chapters-list {
  padding-bottom: var(--sp-4);
}

.chapter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3) var(--sp-6);
  margin: 0 var(--sp-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.chapter-item:hover {
  background: var(--c-bg-card);
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  min-width: 0;
}

.chapter-order {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  min-width: 24px;
}

.chapter-title {
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  color: var(--c-text-primary);
  transition: color var(--duration-fast) var(--ease-out);
}

.chapter-item:hover .chapter-title {
  color: var(--c-gold);
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  flex-shrink: 0;
}

.chapter-difficulty {
  font-size: 0.5rem;
  color: var(--c-gold-dark);
  letter-spacing: 2px;
}

.chapter-time {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.chapter-arrow {
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.chapter-item:hover .chapter-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.no-chapters {
  padding: var(--sp-6);
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

/* ── Expand Transition ── */
.expand-enter-active {
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.expand-leave-active {
  transition: all var(--duration-fast) ease-in;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: var(--sp-16) 0;
}

.empty-state .empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--sp-4);
}

.empty-state .empty-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .work-header {
    padding: var(--sp-4);
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .work-meta {
    grid-column: 1;
    grid-row: 2;
    justify-content: flex-start;
  }

  .work-stats {
    grid-row: 3;
  }

  .expand-icon {
    right: var(--sp-4);
    top: var(--sp-4);
    bottom: auto;
  }

  .chapter-meta {
    gap: var(--sp-2);
  }

  .chapter-difficulty {
    display: none;
  }
}
</style>
