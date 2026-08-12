<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Work, SchoolId, School, Chapter } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getSchools, getWorkDescription } from '@/data/catalogApi'
import { catalogWorks, catalogChapters } from '@/data/catalog'
import SchoolBadge from '@/components/SchoolBadge.vue'

const router = useRouter()
const route = useRoute()
const mounted = ref(false)

type FilterTab = 'all' | SchoolId

const activeFilter = ref<FilterTab>('all')
const expandedWorkId = ref<string | null>(null)

// Load data
const allSchools = ref<School[]>(getSchools())
const allWorks = ref<Work[]>(catalogWorks)
const workChapters = ref<Map<string, Chapter[]>>(new Map())

function checkQueryFilter() {
  const schoolParam = route.query.school as string
  const workParam = route.query.work as string
  
  if (workParam) {
    const work = allWorks.value.find(w => w.id === workParam)
    if (work) {
      activeFilter.value = work.schoolId as FilterTab
      expandedWorkId.value = work.id
      // Lazy load chapters
      if (!workChapters.value.has(work.id)) {
        workChapters.value.set(work.id, catalogChapters.filter(c => c.workId === work.id))
      }
      return
    }
  }

  if (schoolParam) {
    if (schoolParam === 'all' || ['daoism', 'legalism', 'mohism', 'confucianism', 'literature', 'military', 'histories'].includes(schoolParam)) {
      activeFilter.value = schoolParam as FilterTab
      expandedWorkId.value = null
    }
  } else {
    activeFilter.value = 'all'
    expandedWorkId.value = null
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(() => route.fullPath, () => {
  checkQueryFilter()
}, { immediate: true })

interface FilterOption {
  id: FilterTab
  label: string
}

const filterTabs: FilterOption[] = [
  { id: 'all', label: '全部' },
  { id: 'daoism', label: '道家' },
  { id: 'legalism', label: '法家' },
  { id: 'mohism', label: '墨家' },
  { id: 'confucianism', label: '儒家' },
  { id: 'military', label: '兵家' },
  { id: 'histories', label: '史書' },
  { id: 'literature', label: '文學' },
]

const filteredWorks = computed(() => {
  // The Spring and Autumn commentaries are Confucian canonical works even
  // though their primary browsing school remains History.
  if (activeFilter.value === 'confucianism') {
    const canonicalCommentaries = new Set(['chun-qiu-zuo-zhuan', 'gongyang-zhuan', 'guliang-zhuan'])
    return allWorks.value.filter(w => w.schoolId === 'confucianism' || canonicalCommentaries.has(w.id))
  }
  if (activeFilter.value === 'all') {
    return allWorks.value
  }
  return allWorks.value.filter(w => w.schoolId === activeFilter.value)
})

interface WorkGroup {
  id: string
  title: string
  description: string
  works: Work[]
}

const confucianCollections = [
  { id: 'four-books', title: '四書', description: '《論語》、《孟子》、《大學》、《中庸》', workIds: ['lun-yu', 'meng-zi', 'da-xue', 'zhong-yong'] },
  { id: 'five-classics', title: '五經', description: '《易經》、《尚書》、《詩經》、《禮記》、《春秋》', workIds: ['yi-jing', 'shu-jing', 'shi-jing', 'li-ji', 'chun-qiu'] },
  { id: 'spring-autumn-commentaries', title: '春秋三傳', description: '《左傳》、《公羊傳》、《穀梁傳》', workIds: ['chun-qiu-zuo-zhuan', 'gongyang-zhuan', 'guliang-zhuan'] },
  { id: 'confucian-masters', title: '儒家諸子', description: '先秦儒家重要思想典籍', workIds: ['xunzi'] },
] as const

const schoolGroupMeta: Record<SchoolId, { title: string; description: string }> = {
  confucianism: { title: '儒家經典', description: '四書、五經與儒家諸子' },
  daoism: { title: '道家典籍', description: '老莊及道家重要文獻' },
  legalism: { title: '法家典籍', description: '法、術、勢相關著作' },
  mohism: { title: '墨家典籍', description: '墨家學派傳世文獻' },
  military: { title: '兵家典籍', description: '兵法與軍政著作' },
  histories: { title: '史傳典籍', description: '編年、紀傳與雜史文獻' },
  literature: { title: '文學典籍', description: '古文選集與文學作品' },
}

const groupedWorks = computed<WorkGroup[]>(() => {
  if (activeFilter.value === 'confucianism') {
    const byId = new Map(filteredWorks.value.map(work => [work.id, work]))
    return confucianCollections.map(group => ({
      id: group.id,
      title: group.title,
      description: group.description,
      works: group.workIds.map(id => byId.get(id)).filter((work): work is Work => Boolean(work)),
    })).filter(group => group.works.length > 0)
  }

  if (activeFilter.value === 'all') {
    return filterTabs.slice(1).map(tab => {
      const schoolId = tab.id as SchoolId
      const meta = schoolGroupMeta[schoolId]
      return {
        id: schoolId,
        title: meta.title,
        description: meta.description,
        works: filteredWorks.value.filter(work => work.schoolId === schoolId),
      }
    }).filter(group => group.works.length > 0)
  }

  const schoolId = activeFilter.value as SchoolId
  return [{
    id: schoolId,
    title: schoolGroupMeta[schoolId].title,
    description: schoolGroupMeta[schoolId].description,
    works: filteredWorks.value,
  }]
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
    const chapters = catalogChapters.filter(c => c.workId === workId)
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

function triggerSearch() {
  window.dispatchEvent(new CustomEvent('open-search-modal'))
}
</script>

<template>
  <div class="library-view" :class="{ 'is-mounted': mounted }">
    <!-- Page Header -->
    <header class="page-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1 class="page-title">典籍庫</h1>
        <p class="page-desc">先秦經典文本，按學派分類</p>
      </div>
      <button class="btn btn-ghost" style="border: 1px solid var(--c-border-gold-glow, rgba(201, 169, 110, 0.3)); border-radius: 20px; padding: 6px 16px; font-size: 0.875rem;" @click="triggerSearch">
        🔍 搜尋全站文庫 (Ctrl+K)
      </button>
    </header>

    <!-- Filter Tabs -->
    <div class="filter-bar">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        class="filter-tab"
        :class="[{ 'is-active': activeFilter === tab.id }, `tab-${tab.id}`]"
        @click="setFilter(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Works Grid -->
    <div class="works-grid stagger-children">
      <section v-for="group in groupedWorks" :key="group.id" class="work-group">
        <header class="work-group-header">
          <div>
            <h2 class="work-group-title">{{ group.title }}</h2>
            <p class="work-group-description">{{ group.description }}</p>
          </div>
          <span class="work-group-count">{{ group.works.length }} 部</span>
        </header>
        <div class="work-group-list">
          <div
            v-for="work in group.works"
            :key="work.id"
            class="work-card glass-card"
            :class="[{ 'is-expanded': expandedWorkId === work.id }, `school-${work.schoolId}`]"
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
              {{ GENRE_STRATEGY_META[work.genreStrategy]?.icon || '📖' }}
              {{ GENRE_STRATEGY_META[work.genreStrategy]?.label || '經典' }}
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
            
            <!-- Work Description Preview -->
            <div v-if="getWorkDescription(work.id)" class="work-intro-preview">
              <div class="intro-preview-header">
                <span class="preview-author">👤 {{ getWorkDescription(work.id)?.author }}</span>
                <span class="preview-period">⏳ {{ getWorkDescription(work.id)?.period }}</span>
              </div>
              <p class="intro-preview-text">{{ getWorkDescription(work.id)?.introduction }}</p>
              <div class="intro-preview-allusions">
                <span class="allusion-label">名句典故：</span>
                <span v-for="allusion in getWorkDescription(work.id)?.keyAllusions.slice(0, 2)" :key="allusion" class="allusion-chip">
                  {{ allusion.split('：')[0] }}
                </span>
              </div>
            </div>
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
      </section>
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

/* ── School-specific Theme Colors ── */
.filter-tab.tab-daoism.is-active {
  color: var(--c-accent-dao);
  background: rgba(91, 138, 114, 0.15);
  border-color: rgba(91, 138, 114, 0.5);
}
.school-daoism {
  --c-glass-border: rgba(91, 138, 114, 0.4);
  --c-glass-border-hover: rgba(91, 138, 114, 0.7);
  --c-glass-bg: rgba(91, 138, 114, 0.08);
  --c-glass-bg-hover: rgba(91, 138, 114, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(91, 138, 114, 0.15);
  --c-glass-glow: 0 0 24px rgba(91, 138, 114, 0.3);
}

.filter-tab.tab-legalism.is-active {
  color: var(--c-accent-legal);
  background: rgba(139, 94, 94, 0.15);
  border-color: rgba(139, 94, 94, 0.5);
}
.school-legalism {
  --c-glass-border: rgba(139, 94, 94, 0.4);
  --c-glass-border-hover: rgba(139, 94, 94, 0.7);
  --c-glass-bg: rgba(139, 94, 94, 0.08);
  --c-glass-bg-hover: rgba(139, 94, 94, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(139, 94, 94, 0.15);
  --c-glass-glow: 0 0 24px rgba(139, 94, 94, 0.3);
}

.filter-tab.tab-mohism.is-active {
  color: var(--c-accent-mohist);
  background: rgba(94, 110, 139, 0.15);
  border-color: rgba(94, 110, 139, 0.5);
}
.school-mohism {
  --c-glass-border: rgba(94, 110, 139, 0.4);
  --c-glass-border-hover: rgba(94, 110, 139, 0.7);
  --c-glass-bg: rgba(94, 110, 139, 0.08);
  --c-glass-bg-hover: rgba(94, 110, 139, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(94, 110, 139, 0.15);
  --c-glass-glow: 0 0 24px rgba(94, 110, 139, 0.3);
}

.filter-tab.tab-confucianism.is-active {
  color: var(--c-accent-confucian);
  background: rgba(181, 141, 61, 0.15);
  border-color: rgba(181, 141, 61, 0.5);
}
.school-confucianism {
  --c-glass-border: rgba(181, 141, 61, 0.4);
  --c-glass-border-hover: rgba(181, 141, 61, 0.7);
  --c-glass-bg: rgba(181, 141, 61, 0.08);
  --c-glass-bg-hover: rgba(181, 141, 61, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(181, 141, 61, 0.15);
  --c-glass-glow: 0 0 24px rgba(181, 141, 61, 0.3);
}

.filter-tab.tab-military.is-active {
  color: var(--c-accent-military);
  background: rgba(166, 75, 75, 0.15);
  border-color: rgba(166, 75, 75, 0.5);
}
.school-military {
  --c-glass-border: rgba(166, 75, 75, 0.4);
  --c-glass-border-hover: rgba(166, 75, 75, 0.7);
  --c-glass-bg: rgba(166, 75, 75, 0.08);
  --c-glass-bg-hover: rgba(166, 75, 75, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(166, 75, 75, 0.15);
  --c-glass-glow: 0 0 24px rgba(166, 75, 75, 0.3);
}

.filter-tab.tab-histories.is-active {
  color: var(--c-accent-histories);
  background: rgba(138, 110, 91, 0.15);
  border-color: rgba(138, 110, 91, 0.5);
}
.school-histories {
  --c-glass-border: rgba(138, 110, 91, 0.4);
  --c-glass-border-hover: rgba(138, 110, 91, 0.7);
  --c-glass-bg: rgba(138, 110, 91, 0.08);
  --c-glass-bg-hover: rgba(138, 110, 91, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(138, 110, 91, 0.15);
  --c-glass-glow: 0 0 24px rgba(138, 110, 91, 0.3);
}

.filter-tab.tab-literature.is-active {
  color: var(--c-accent-literature);
  background: rgba(74, 111, 165, 0.15);
  border-color: rgba(74, 111, 165, 0.5);
}
.school-literature {
  --c-glass-border: rgba(74, 111, 165, 0.4);
  --c-glass-border-hover: rgba(74, 111, 165, 0.7);
  --c-glass-bg: rgba(74, 111, 165, 0.08);
  --c-glass-bg-hover: rgba(74, 111, 165, 0.15);
  --c-glass-shadow: 0 8px 32px rgba(74, 111, 165, 0.15);
  --c-glass-glow: 0 0 24px rgba(74, 111, 165, 0.3);
}

/* ── Works Grid ── */
.works-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.work-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.work-group-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: 0 var(--sp-2) var(--sp-3);
  border-bottom: 1px solid var(--c-border-accent);
}

.work-group-title {
  margin: 0;
  color: var(--c-gold);
  font-family: var(--font-serif);
  font-size: var(--fs-2xl);
  letter-spacing: 0.08em;
}

.work-group-description,
.work-group-count {
  color: var(--c-text-muted);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
}

.work-group-description {
  margin: var(--sp-1) 0 0;
}

.work-group-count {
  flex-shrink: 0;
  padding: var(--sp-1) var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-full);
}

.work-group-list {
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

/* ── Work Intro Preview Card ── */
.work-intro-preview {
  background: rgba(212, 175, 55, 0.04);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.intro-preview-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-gold);
  font-weight: 600;
  margin-bottom: var(--sp-2);
}

.intro-preview-text {
  font-size: var(--fs-xs);
  line-height: 1.6;
  color: var(--c-text-secondary);
  margin: 0 0 var(--sp-3) 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.intro-preview-allusions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
}

.allusion-label {
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
}

.allusion-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--c-border-subtle);
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--c-text-primary);
  font-size: 0.75rem;
}
</style>
