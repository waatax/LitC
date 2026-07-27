<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { searchContent } from '@/utils/search'
import type { SearchResult, SearchResultType } from '@/utils/search'
import type { SchoolId } from '@/types/content'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const searchInput = ref<HTMLInputElement | null>(null)

const query = ref('')
const selectedSchool = ref<SchoolId | 'all'>('all')
const selectedType = ref<'all' | 'sentence' | 'translation' | 'work' | 'chapter'>('all')
const selectedIndex = ref(0)

const results = ref<SearchResult[]>([])
const isSearching = ref(false)
let debounceTimer: any = null

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
  { id: 'sentence', label: '名句原文' },
  { id: 'translation', label: '譯文與解讀' },
  { id: 'work', label: '典籍書名' },
  { id: 'chapter', label: '篇章標題' },
]

function performSearch() {
  if (!query.value.trim()) {
    results.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  results.value = searchContent(query.value, {
    schoolFilter: selectedSchool.value,
    typeFilter: selectedType.value,
    limit: 30,
  })
  selectedIndex.value = 0
  isSearching.value = false
}

function handleInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performSearch()
  }, 150)
}

function closeModal() {
  emit('close')
}

function selectResult(item: SearchResult) {
  closeModal()
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

function viewAllResults() {
  if (!query.value.trim()) return
  closeModal()
  router.push({ path: '/search', query: { q: query.value, school: selectedSchool.value, type: selectedType.value } })
}

function onKeyDown(e: KeyboardEvent) {
  if (!props.isOpen) return

  if (e.key === 'Escape') {
    closeModal()
    return
  }

  if (results.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % results.value.length
    scrollToActiveItem()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length
    scrollToActiveItem()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (results.value[selectedIndex.value]) {
      selectResult(results.value[selectedIndex.value])
    }
  }
}

function scrollToActiveItem() {
  nextTick(() => {
    const activeEl = document.querySelector('.search-result-item.is-selected')
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
})

watch([selectedSchool, selectedType], () => {
  performSearch()
})

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

// Highlight matched letters helper
function renderHighlighted(text: string) {
  if (!query.value.trim()) return text
  const q = query.value.trim()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<template>
  <Teleport to="body">
    <transition name="search-fade">
      <div v-if="isOpen" class="search-modal-backdrop" @click.self="closeModal">
        <div class="search-modal-container">
          <!-- Top Input Bar -->
          <div class="search-modal-header">
            <span class="search-input-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              class="search-input-field"
              placeholder="搜尋典籍、篇章、原文名句、白話譯文、哲思解讀..."
              @input="handleInput"
            />
            <button v-if="query" class="clear-btn" @click="query = ''; performSearch()">✕</button>
            <span class="esc-badge">ESC</span>
          </div>

          <!-- School Filters -->
          <div class="search-filter-bar">
            <div class="filter-group">
              <button
                v-for="s in schools"
                :key="s.id"
                class="filter-pill"
                :class="{ 'is-active': selectedSchool === s.id }"
                @click="selectedSchool = s.id"
              >
                {{ s.name }}
              </button>
            </div>
          </div>

          <!-- Type Tabs -->
          <div class="search-tabs-bar">
            <button
              v-for="tab in typeTabs"
              :key="tab.id"
              class="tab-btn"
              :class="{ 'is-active': selectedType === tab.id }"
              @click="selectedType = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Results Body -->
          <div class="search-modal-body">
            <!-- Empty state when no query -->
            <div v-if="!query.trim()" class="search-placeholder">
              <div class="placeholder-icon">📚</div>
              <p class="placeholder-title">搜尋整個文庫典籍</p>
              <p class="placeholder-desc">輸入關鍵字（例如：「學而」、「道可道」、「兼愛」、「知己知彼」）</p>
            </div>

            <!-- No matches -->
            <div v-else-if="results.length === 0 && !isSearching" class="search-no-results">
              <p>未找到與「<strong>{{ query }}</strong>」相關的文本資料</p>
              <span class="no-results-hint">請嘗試簡化關鍵字或選擇「全部學派」</span>
            </div>

            <!-- Results list -->
            <div v-else class="search-results-list">
              <div
                v-for="(item, index) in results"
                :key="item.id"
                class="search-result-item"
                :class="{ 'is-selected': index === selectedIndex }"
                @click="selectResult(item)"
                @mouseenter="selectedIndex = index"
              >
                <div class="result-header">
                  <span class="result-badge" :class="`badge-${item.type}`">{{ item.matchField }}</span>
                  <span class="result-meta">{{ item.schoolName }} · {{ item.workTitle }} <template v-if="item.chapterTitle">› {{ item.chapterTitle }}</template></span>
                </div>
                <div class="result-content" v-html="renderHighlighted(item.snippet)"></div>
              </div>
            </div>
          </div>

          <!-- Footer Bar -->
          <div class="search-modal-footer">
            <div class="footer-tips">
              <span><kbd>↑</kbd><kbd>↓</kbd> 選擇</span>
              <span><kbd>↵</kbd> 開啟</span>
              <span><kbd>ESC</kbd> 關閉</span>
            </div>
            <button v-if="query.trim() && results.length > 0" class="view-all-btn" @click="viewAllResults">
              查看全部匹配結果 ({{ results.length }}+) →
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.search-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 17, 23, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5vh;
  padding-bottom: 5vh;
}

.search-modal-container {
  width: 90%;
  max-width: 720px;
  max-height: 85vh;
  background: var(--c-bg-card, #1c1f2b);
  border: 1px solid var(--c-border-gold-glow, rgba(201, 169, 110, 0.25));
  border-radius: var(--radius-xl, 16px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 169, 110, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: translateY(-16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.search-modal-header {
  display: flex;
  align-items: center;
  padding: var(--sp-4, 16px) var(--sp-5, 20px);
  border-bottom: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.08));
  gap: var(--sp-3, 12px);
}

.search-input-icon {
  font-size: 1.25rem;
  opacity: 0.7;
}

.search-input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--fs-lg, 1.125rem);
  color: var(--c-text-primary, #f3f4f6);
}

.search-input-field::placeholder {
  color: var(--c-text-muted, #6b7280);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--c-text-muted, #9ca3af);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-btn:hover {
  color: var(--c-text-primary, #ffffff);
  background: rgba(255, 255, 255, 0.1);
}

.esc-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: var(--c-text-muted, #9ca3af);
}

/* Filters & Tabs */
.search-filter-bar {
  padding: var(--sp-2, 8px) var(--sp-4, 16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.filter-group {
  display: flex;
  gap: 6px;
}

.filter-pill {
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--c-text-secondary, #9ca3af);
  font-size: 0.8125rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-primary, #fff);
}

.filter-pill.is-active {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.2));
  border-color: var(--c-gold, #c9a96e);
  color: var(--c-gold, #c9a96e);
  font-weight: var(--fw-medium, 500);
}

.search-tabs-bar {
  display: flex;
  padding: 0 var(--sp-4, 16px);
  border-bottom: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.08));
  gap: 16px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 0.875rem;
  color: var(--c-text-muted, #9ca3af);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: var(--c-text-primary, #fff);
}

.tab-btn.is-active {
  color: var(--c-gold, #c9a96e);
  border-bottom-color: var(--c-gold, #c9a96e);
  font-weight: var(--fw-medium, 500);
}

/* Body & Results */
.search-modal-body {
  flex: 1;
  overflow-y: auto;
  min-height: 240px;
  max-height: 50vh;
  padding: var(--sp-3, 12px) var(--sp-4, 16px);
}

.search-placeholder,
.search-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  text-align: center;
  color: var(--c-text-muted, #9ca3af);
}

.placeholder-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  opacity: 0.8;
}

.placeholder-title {
  font-size: 1.125rem;
  font-weight: var(--fw-bold, 600);
  color: var(--c-text-primary, #f3f4f6);
  margin-bottom: 4px;
}

.placeholder-desc,
.no-results-hint {
  font-size: 0.875rem;
  opacity: 0.7;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-item {
  padding: 12px 14px;
  border-radius: var(--radius-md, 8px);
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.15s ease;
}

.search-result-item:hover,
.search-result-item.is-selected {
  background: var(--c-bg-card-hover, rgba(201, 169, 110, 0.12));
  border-color: rgba(201, 169, 110, 0.3);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.result-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.badge-sentence {
  background: rgba(201, 169, 110, 0.2);
  color: #e5c17c;
}

.badge-translation {
  background: rgba(91, 138, 114, 0.2);
  color: #7ec49f;
}

.badge-work {
  background: rgba(139, 94, 94, 0.2);
  color: #e28a8a;
}

.badge-chapter {
  background: rgba(94, 110, 139, 0.2);
  color: #8ab0e2;
}

.result-meta {
  font-size: 0.8125rem;
  color: var(--c-text-muted, #9ca3af);
}

.result-content {
  font-family: var(--font-serif, serif);
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--c-text-primary, #e5e7eb);
}

:deep(mark) {
  background: rgba(201, 169, 110, 0.35);
  color: var(--c-gold-light, #f0d5a3);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* Footer */
.search-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid var(--c-border-subtle, rgba(255, 255, 255, 0.08));
  background: rgba(0, 0, 0, 0.2);
}

.footer-tips {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--c-text-muted, #6b7280);
}

.footer-tips kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: inherit;
  margin-right: 4px;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--c-gold, #c9a96e);
  font-size: 0.8125rem;
  cursor: pointer;
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}

/* Vue Transitions */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
