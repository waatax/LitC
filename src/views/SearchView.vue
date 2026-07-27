<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchContent } from '@/utils/search'
import type { SearchResult } from '@/utils/search'
import type { SchoolId } from '@/types/content'
import SchoolBadge from '@/components/SchoolBadge.vue'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) || '')
const activeSchool = ref<SchoolId | 'all'>((route.query.school as SchoolId) || 'all')
const activeType = ref<'all' | 'sentence' | 'translation' | 'work' | 'chapter'>((route.query.type as any) || 'all')
const currentPage = ref(1)
const pageSize = 15

const allResults = ref<SearchResult[]>([])

const schools: { id: SchoolId | 'all'; name: string }[] = [
  { id: 'all', name: '全部學派' },
  { id: 'daoism', name: '道家' },
  { id: 'confucianism', name: '儒家' },
  { id: 'legalism', name: '法家' },
  { id: 'mohism', name: '墨家' },
  { id: 'military', name: '兵家' },
  { id: 'histories', name: '史書' },
  { id: 'literature', name: '文學' },
]

const typeTabs: { id: 'all' | 'sentence' | 'translation' | 'work' | 'chapter'; label: string }[] = [
  { id: 'all', label: '全部內容' },
  { id: 'sentence', label: '原文全文' },
  { id: 'translation', label: '白話文與解析' },
  { id: 'work', label: '典籍' },
  { id: 'chapter', label: '篇章' },
]

function executeSearch() {
  if (!query.value.trim()) {
    allResults.value = []
    return
  }

  allResults.value = searchContent(query.value, {
    schoolFilter: activeSchool.value,
    typeFilter: activeType.value,
  })
  currentPage.value = 1
}

function updateRoute() {
  router.replace({
    path: '/search',
    query: {
      q: query.value || undefined,
      school: activeSchool.value !== 'all' ? activeSchool.value : undefined,
      type: activeType.value !== 'all' ? activeType.value : undefined,
    },
  })
}

function handleSearchSubmit() {
  updateRoute()
  executeSearch()
}

function setSchool(schoolId: SchoolId | 'all') {
  activeSchool.value = schoolId
  updateRoute()
  executeSearch()
}

function setType(typeId: any) {
  activeType.value = typeId
  updateRoute()
  executeSearch()
}

const totalPages = computed(() => Math.ceil(allResults.value.length / pageSize) || 1)

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allResults.value.slice(start, start + pageSize)
})

function goToResult(item: SearchResult) {
  if (item.type === 'work') {
    router.push({ path: '/library', query: { work: item.workId } })
  } else if (item.chapterId) {
    router.push({
      path: `/chapter/${item.chapterId}`,
      query: {
        highlight: query.value,
        sentenceId: item.targetSentenceId,
      },
    })
  }
}

function renderHighlighted(text: string) {
  if (!query.value.trim()) return text
  const q = query.value.trim()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

onMounted(() => {
  if (query.value) {
    executeSearch()
  }
})

watch(() => route.query, () => {
  query.value = (route.query.q as string) || ''
  activeSchool.value = (route.query.school as SchoolId) || 'all'
  activeType.value = (route.query.type as any) || 'all'
  executeSearch()
})
</script>

<template>
  <div class="search-view-page">
    <div class="search-header-card">
      <h1 class="page-title">全站文庫檢索</h1>
      
      <!-- Big Search Bar -->
      <form class="big-search-box" @submit.prevent="handleSearchSubmit">
        <span class="search-icon">🔍</span>
        <input
          v-model="query"
          type="text"
          class="search-input"
          placeholder="搜尋典籍、篇章、原文、白話文、詞義與深度解析..."
        />
        <button type="submit" class="search-btn">搜尋</button>
      </form>

      <!-- Schools Bar -->
      <div class="school-pills">
        <button
          v-for="s in schools"
          :key="s.id"
          class="pill"
          :class="{ 'is-active': activeSchool === s.id }"
          @click="setSchool(s.id)"
        >
          {{ s.name }}
        </button>
      </div>
    </div>

    <!-- Filter Tabs & Stats -->
    <div v-if="query.trim()" class="results-stats-bar">
      <div class="type-tabs">
        <button
          v-for="tab in typeTabs"
          :key="tab.id"
          class="tab"
          :class="{ 'is-active': activeType === tab.id }"
          @click="setType(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="stats-text">
        共找到 <strong>{{ allResults.length }}</strong> 筆相關結果
      </div>
    </div>

    <!-- Main Results Grid / List -->
    <div class="results-content-area">
      <!-- Empty query state -->
      <div v-if="!query.trim()" class="empty-state">
        <div class="empty-icon">📖</div>
        <h3>輸入關鍵字探索經典文脈</h3>
        <p>支援全部原文、白話文、詞義註解、思想解析與典籍介紹的全庫檢索。</p>
      </div>

      <!-- No match state -->
      <div v-else-if="allResults.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>未找到與「{{ query }}」相符的結果</h3>
        <p>建議縮短關鍵字長度、改搜尋異體字或選擇「全部學派」。</p>
      </div>

      <!-- Result List -->
      <div v-else class="results-grid">
        <div
          v-for="item in paginatedResults"
          :key="item.id"
          class="result-card"
          @click="goToResult(item)"
        >
          <div class="card-top">
            <span class="field-badge" :class="`badge-${item.type}`">{{ item.matchField }}</span>
            <div class="card-meta">
              <SchoolBadge :schoolId="item.schoolId" size="sm" />
              <span class="meta-title">{{ item.workTitle }} <template v-if="item.chapterTitle">› {{ item.chapterTitle }}</template></span>
            </div>
          </div>
          <div class="card-snippet" v-html="renderHighlighted(item.snippet)"></div>
          <div class="card-arrow">前往閱讀 →</div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allResults.length > pageSize" class="pagination-bar">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ← 上一頁
        </button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 頁</span>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一頁 →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-view-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--sp-6, 24px) var(--sp-4, 16px);
  min-height: 80vh;
}

.search-header-card {
  background: var(--c-bg-card, #1c1f2b);
  border: 1px solid var(--c-border-gold-glow, rgba(201, 169, 110, 0.2));
  border-radius: var(--radius-xl, 16px);
  padding: var(--sp-6, 24px);
  margin-bottom: var(--sp-6, 24px);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl, 1.75rem);
  font-weight: var(--fw-bold, 700);
  background: linear-gradient(135deg, var(--c-gold-light, #f0d5a3), var(--c-gold, #c9a96e));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--sp-4, 16px);
}

.big-search-box {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--c-border, rgba(201, 169, 110, 0.3));
  border-radius: var(--radius-lg, 12px);
  padding: var(--sp-2, 8px) var(--sp-4, 16px);
  gap: var(--sp-3, 12px);
  margin-bottom: var(--sp-4, 16px);
  transition: all 0.2s ease;
}

.big-search-box:focus-within {
  border-color: var(--c-gold, #c9a96e);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.25);
}

.search-icon {
  font-size: 1.25rem;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  color: var(--c-text-primary, #fff);
}

.search-btn {
  background: linear-gradient(135deg, var(--c-gold, #c9a96e), var(--c-gold-dark, #a38249));
  color: #12141d;
  font-weight: var(--fw-bold, 600);
  border: none;
  padding: 8px 18px;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(201, 169, 110, 0.4);
}

.school-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--c-text-secondary, #9ca3af);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.pill.is-active {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.2));
  border-color: var(--c-gold, #c9a96e);
  color: var(--c-gold, #c9a96e);
  font-weight: 500;
}

/* Stats Bar & Type Tabs */
.results-stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.08));
  padding-bottom: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.type-tabs {
  display: flex;
  gap: 12px;
}

.tab {
  background: none;
  border: none;
  font-size: 0.9375rem;
  color: var(--c-text-muted, #9ca3af);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.tab:hover {
  color: #fff;
}

.tab.is-active {
  color: var(--c-gold, #c9a96e);
  font-weight: 600;
  background: rgba(201, 169, 110, 0.1);
}

.stats-text {
  font-size: 0.875rem;
  color: var(--c-text-muted, #9ca3af);
}

.stats-text strong {
  color: var(--c-gold, #c9a96e);
}

/* Results Grid */
.results-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.result-card {
  background: var(--c-bg-card, #1c1f2b);
  border: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 12px);
  padding: var(--sp-4, 16px) var(--sp-5, 20px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-card:hover {
  border-color: rgba(201, 169, 110, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.field-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.badge-sentence { background: rgba(201, 169, 110, 0.2); color: #e5c17c; }
.badge-translation { background: rgba(91, 138, 114, 0.2); color: #7ec49f; }
.badge-work { background: rgba(139, 94, 94, 0.2); color: #e28a8a; }
.badge-chapter { background: rgba(94, 110, 139, 0.2); color: #8ab0e2; }

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-title {
  font-size: 0.875rem;
  color: var(--c-text-secondary, #9ca3af);
  font-weight: 500;
}

.card-snippet {
  font-family: var(--font-serif, serif);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--c-text-primary, #f3f4f6);
  margin-bottom: 10px;
}

:deep(mark) {
  background: rgba(201, 169, 110, 0.35);
  color: var(--c-gold-light, #f0d5a3);
  padding: 0 3px;
  border-radius: 2px;
  font-weight: 600;
}

.card-arrow {
  font-size: 0.8125rem;
  color: var(--c-gold, #c9a96e);
  font-weight: 500;
  text-align: right;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: var(--c-bg-card, #1c1f2b);
  border-radius: var(--radius-lg, 12px);
  border: 1px dashed var(--c-border-subtle, rgba(255, 255, 255, 0.1));
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--c-text-primary, #fff);
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--c-text-muted, #9ca3af);
}

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

.page-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.1));
  color: var(--c-text-primary, #fff);
  padding: 6px 14px;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.2));
  border-color: var(--c-gold, #c9a96e);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--c-text-muted, #9ca3af);
}
</style>
