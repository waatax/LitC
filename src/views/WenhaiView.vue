<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_POINTS,
  LEARNING_TRACKS,
  getRandomKnowledgePoint,
  type KnowledgeCategory,
  type KnowledgePoint,
  type LearningTrack,
} from '@/data/knowledgeGraph'
import { WENHAI_RESOURCES, type WenhaiResourceKind } from '@/data/wenhaiResources'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'
import SchoolBadge from '@/components/SchoolBadge.vue'
import KnowledgePointModal from '@/components/KnowledgePointModal.vue'

const route = useRoute()
const collectionStore = useKnowledgeCollectionStore()

type MainTab = 'points' | 'tracks' | 'wander' | 'resources'
const currentTab = ref<MainTab>('points')

// 知識點篩選
type CategoryFilter = 'all' | KnowledgeCategory
const selectedCategory = ref<CategoryFilter>('all')
const selectedSchool = ref<string>('all')
const onlyCollected = ref(false)
const searchQuery = ref('')

// 當前點選的知識點詳情彈窗
const selectedPoint = ref<KnowledgePoint | null>(null)
const isModalOpen = ref(false)

// 每日漫遊知識點
const wanderingPoint = ref<KnowledgePoint>(KNOWLEDGE_POINTS[0])
const isWandering = ref(false)

// 外延資源分類過濾
type ResourceFilter = '全部' | WenhaiResourceKind
const resourceFilter = ref<ResourceFilter>('全部')
const resourceFilters: ResourceFilter[] = ['全部', '原典檢索', '善本影像', '註釋賞析', '專題研究']

const filteredPoints = computed(() => {
  return KNOWLEDGE_POINTS.filter((p) => {
    // 類別過濾
    if (selectedCategory.value !== 'all' && p.category !== selectedCategory.value) {
      return false
    }
    // 學派過濾
    if (selectedSchool.value !== 'all' && p.schoolId !== selectedSchool.value) {
      return false
    }
    // 收藏過濾
    if (onlyCollected.value && !collectionStore.isCollected(p.id)) {
      return false
    }
    // 關鍵字搜尋
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchSummary = p.summary.toLowerCase().includes(q)
      const matchQuote = p.famousQuote.toLowerCase().includes(q)
      const matchFigure = p.primaryFigure.toLowerCase().includes(q)
      const matchApp = p.modernApplication.toLowerCase().includes(q)
      if (!matchTitle && !matchSummary && !matchQuote && !matchFigure && !matchApp) {
        return false
      }
    }
    return true
  })
})

const filteredResources = computed(() => {
  return resourceFilter.value === '全部'
    ? WENHAI_RESOURCES
    : WENHAI_RESOURCES.filter((r) => r.kind === resourceFilter.value)
})

function openPointModal(point: KnowledgePoint) {
  selectedPoint.value = point
  isModalOpen.value = true
}

function closePointModal() {
  isModalOpen.value = false
}

function handleSelectRelated(relatedPoint: KnowledgePoint) {
  selectedPoint.value = relatedPoint
}

function rerollWander() {
  isWandering.value = true
  setTimeout(() => {
    let nextPoint = getRandomKnowledgePoint()
    while (nextPoint.id === wanderingPoint.value.id && KNOWLEDGE_POINTS.length > 1) {
      nextPoint = getRandomKnowledgePoint()
    }
    wanderingPoint.value = nextPoint
    isWandering.value = false
  }, 220)
}

function setTrackAsActive(trackId: string) {
  collectionStore.setActiveTrack(trackId)
}

onMounted(() => {
  // 支援 query 帶入
  if (route.query.tab === 'tracks') currentTab.value = 'tracks'
  else if (route.query.tab === 'wander') currentTab.value = 'wander'
  else if (route.query.tab === 'resources') currentTab.value = 'resources'

  if (route.query.point) {
    const target = KNOWLEDGE_POINTS.find(p => p.id === route.query.point)
    if (target) openPointModal(target)
  }
})
</script>

<template>
  <div class="wenhai-view">
    <!-- 頂部文海 Hero -->
    <header class="wenhai-hero">
      <div class="hero-seal-wrap">
        <RedSeal text="文海" :size="74" :animate="false" />
      </div>
      <div class="hero-content">
        <div class="eyebrow-row">
          <p class="eyebrow font-serif">經典之外，學問無涯 ‧ 諸子百家知識網絡</p>
          <div class="hero-stats-badge">
            <span>{{ KNOWLEDGE_POINTS.length }} 則核心知識點</span>
            <span class="dot-sep">·</span>
            <span>4 大研習學程</span>
            <span class="dot-sep">·</span>
            <span>已掌握 {{ collectionStore.totalMasteredCount }} 點</span>
          </div>
        </div>
        <h1 class="hero-title font-serif">文海觀瀾</h1>
        <p class="hero-copy">
          從一句警策古文出發，循概念、源流、思辨與現代生活心法，串聯先秦諸子核心思想網絡。隨意漫步、循徑修習，讓二千年前的智慧成為當下的清明定力。
        </p>

        <!-- 搜尋列 -->
        <div class="hero-search-box">
          <ClassicalIcon name="search" :size="16" color="var(--c-gold)" />
          <input
            v-model="searchQuery"
            type="search"
            class="hero-search-input"
            placeholder="搜尋知識點、哲學概念、金句成語、或現代處世解藥（例：無為、上善若水、謀略、性善）……"
          />
          <button v-if="searchQuery" class="search-clear-btn" @click="searchQuery = ''">
            <ClassicalIcon name="close" :size="14" />
          </button>
        </div>
      </div>
    </header>

    <!-- 四大視圖分頁導覽列 -->
    <nav class="main-tab-nav" aria-label="文海主要視圖">
      <button
        class="main-tab-btn"
        :class="{ active: currentTab === 'points' }"
        @click="currentTab = 'points'"
      >
        <ClassicalIcon name="wenhai" :size="16" />
        <span>知識全景譜</span>
        <span class="tab-badge">{{ KNOWLEDGE_POINTS.length }}</span>
      </button>

      <button
        class="main-tab-btn"
        :class="{ active: currentTab === 'tracks' }"
        @click="currentTab = 'tracks'"
      >
        <ClassicalIcon name="compass" :size="16" />
        <span>修習學程路徑</span>
        <span class="tab-badge">{{ LEARNING_TRACKS.length }}</span>
      </button>

      <button
        class="main-tab-btn"
        :class="{ active: currentTab === 'wander' }"
        @click="currentTab = 'wander'"
      >
        <ClassicalIcon name="dice" :size="16" />
        <span>每日靈感漫遊</span>
      </button>

      <button
        class="main-tab-btn"
        :class="{ active: currentTab === 'resources' }"
        @click="currentTab = 'resources'"
      >
        <ClassicalIcon name="library" :size="16" />
        <span>外延研讀資源</span>
      </button>
    </nav>

    <!-- ══════════ Tab 1: 知識全景譜 ══════════ -->
    <section v-if="currentTab === 'points'" class="tab-section tab-points">
      <!-- 篩選列 -->
      <div class="filters-toolbar">
        <!-- 分類膠囊標籤 -->
        <div class="category-pills">
          <button
            class="filter-pill"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            全部維度 ({{ KNOWLEDGE_POINTS.length }})
          </button>
          <button
            v-for="cat in KNOWLEDGE_CATEGORIES"
            :key="cat.id"
            class="filter-pill"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <ClassicalIcon :name="cat.icon" :size="13" />
            <span>{{ cat.name }}</span>
          </button>
        </div>

        <!-- 學派與收藏快捷開關 -->
        <div class="secondary-filters">
          <div class="select-wrapper">
            <select v-model="selectedSchool" class="school-select">
              <option value="all">所有學派</option>
              <option value="daoism">道家</option>
              <option value="confucianism">儒家</option>
              <option value="military">兵家</option>
              <option value="legalism">法家</option>
              <option value="mohism">墨家</option>
            </select>
          </div>

          <button
            class="collect-filter-btn"
            :class="{ active: onlyCollected }"
            @click="onlyCollected = !onlyCollected"
            title="僅看我的文萃收藏"
          >
            <ClassicalIcon name="star" :size="14" :color="onlyCollected ? 'var(--gold-400)' : 'currentColor'" />
            <span>我的收藏 ({{ collectionStore.totalCollectedCount }})</span>
          </button>
        </div>
      </div>

      <!-- 知識點網格 -->
      <div v-if="filteredPoints.length > 0" class="points-grid">
        <article
          v-for="pt in filteredPoints"
          :key="pt.id"
          class="point-card glass-card"
          @click="openPointModal(pt)"
        >
          <div class="card-top-row">
            <span class="card-category-tag">
              <ClassicalIcon :name="KNOWLEDGE_CATEGORIES.find(c => c.id === pt.category)?.icon || 'wenhai'" :size="12" />
              <span>{{ KNOWLEDGE_CATEGORIES.find(c => c.id === pt.category)?.name }}</span>
            </span>

            <div class="card-status-badges">
              <span
                v-if="collectionStore.isMastered(pt.id)"
                class="status-badge mastered"
                title="已掌握此概念"
              >
                <ClassicalIcon name="check" :size="12" />
                <span>已領會</span>
              </span>
              <button
                class="star-icon-btn"
                :class="{ 'is-saved': collectionStore.isCollected(pt.id) }"
                :title="collectionStore.isCollected(pt.id) ? '已收藏' : '加入收藏'"
                @click.stop="collectionStore.toggleCollect(pt.id)"
              >
                <ClassicalIcon name="star" :size="14" :color="collectionStore.isCollected(pt.id) ? 'var(--gold-400)' : 'var(--text-muted)'" />
              </button>
            </div>
          </div>

          <div class="card-title-group">
            <h3 class="point-title font-serif">{{ pt.title }}</h3>
            <span class="point-figure">{{ pt.primaryFigure }} · {{ pt.historicalPeriod }}</span>
          </div>

          <p class="point-tagline">{{ pt.tagline }}</p>

          <blockquote class="point-quote font-serif">
            「{{ pt.famousQuote }}」
          </blockquote>

          <div class="card-bottom-row">
            <span class="quote-source-label">《{{ pt.quoteSource.workTitle }}》</span>
            <span class="open-detail-link">
              <span>探微詳解</span>
              <ClassicalIcon name="arrow-right" :size="12" />
            </span>
          </div>
        </article>
      </div>

      <!-- 空搜尋狀態 -->
      <div v-else class="empty-state glass-card">
        <ClassicalIcon name="search" :size="36" color="var(--c-gold)" />
        <h3 class="font-serif">未尋得相符的知識點</h3>
        <p>請嘗試其他關鍵字，或重設篩選條件探索更多經典智慧。</p>
        <button class="btn btn-outline" @click="selectedCategory = 'all'; selectedSchool = 'all'; onlyCollected = false; searchQuery = ''">
          重設所有篩選
        </button>
      </div>
    </section>

    <!-- ══════════ Tab 2: 修習學程路徑 ══════════ -->
    <section v-else-if="currentTab === 'tracks'" class="tab-section tab-tracks">
      <div class="tracks-intro">
        <h2 class="font-serif section-heading">四大階梯修習學程</h2>
        <p class="section-subheading">
          不論你是尋求身心安頓的忙碌上班族、追求自律格局的君子學人，或是想洞悉戰略博弈的決策者，皆能依照清晰進階的路徑循序修持。
        </p>
      </div>

      <div class="tracks-grid">
        <div
          v-for="track in LEARNING_TRACKS"
          :key="track.id"
          class="track-card glass-panel"
          :class="{ 'is-active-track': collectionStore.activeTrackId === track.id }"
        >
          <div class="track-card-header">
            <div class="track-badge-group">
              <RedSeal :text="track.sealText" :size="32" />
              <div class="track-titles">
                <span class="track-est-time">
                  <ClassicalIcon name="hourglass" :size="12" />
                  <span>預估研習 {{ track.estimatedMinutes }} 分鐘</span>
                </span>
                <h3 class="track-title font-serif">{{ track.title }}</h3>
                <p class="track-subtitle">{{ track.subtitle }}</p>
              </div>
            </div>

            <button
              class="btn btn-sm track-select-btn"
              :class="collectionStore.activeTrackId === track.id ? 'btn-primary' : 'btn-outline'"
              @click="setTrackAsActive(track.id)"
            >
              <ClassicalIcon :name="collectionStore.activeTrackId === track.id ? 'check' : 'target'" :size="13" />
              <span>{{ collectionStore.activeTrackId === track.id ? '當前修習中' : '選擇此學程' }}</span>
            </button>
          </div>

          <p class="track-summary">{{ track.summary }}</p>

          <!-- 進度條 -->
          <div class="track-progress-box">
            <div class="progress-meta">
              <span>修習完成度</span>
              <span class="progress-val">{{ collectionStore.getTrackProgress(track.id).completed }} / {{ collectionStore.getTrackProgress(track.id).total }} ({{ collectionStore.getTrackProgress(track.id).percent }}%)</span>
            </div>
            <div class="track-progress-track">
              <div
                class="track-progress-bar"
                :style="{ width: `${collectionStore.getTrackProgress(track.id).percent}%`, backgroundColor: track.badgeColor }"
              ></div>
            </div>
          </div>

          <!-- 學程節點階梯 -->
          <div class="track-steps-ladder">
            <h4 class="ladder-title font-serif">學程研習節點：</h4>
            <div class="ladder-nodes">
              <div
                v-for="(pointId, pIdx) in track.pointIds"
                :key="pointId"
                class="ladder-node"
                @click="openPointModal(KNOWLEDGE_POINTS.find(p => p.id === pointId)!)"
              >
                <div class="node-order" :class="{ 'is-done': collectionStore.isMastered(pointId) }">
                  <ClassicalIcon v-if="collectionStore.isMastered(pointId)" name="check" :size="12" />
                  <span v-else>{{ pIdx + 1 }}</span>
                </div>
                <div class="node-info">
                  <span class="node-title font-serif">{{ KNOWLEDGE_POINTS.find(p => p.id === pointId)?.title }}</span>
                  <span class="node-tagline">{{ KNOWLEDGE_POINTS.find(p => p.id === pointId)?.tagline }}</span>
                </div>
                <ClassicalIcon name="arrow-right" :size="12" color="var(--c-gold)" />
              </div>
            </div>
          </div>

          <div class="track-footer">
            <span class="audience-label">🎯 適合對象：{{ track.targetAudience }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ Tab 3: 每日靈感漫遊 ══════════ -->
    <section v-else-if="currentTab === 'wander'" class="tab-section tab-wander">
      <div class="wander-wrapper">
        <div class="wander-toolbar">
          <div class="wander-title-group">
            <h2 class="font-serif wander-title">每日心境漫遊 ‧ 靈感錦囊</h2>
            <p class="wander-desc">心有疑難，或偶得片刻寧靜，隨機抽訪一位先秦先賢的處世金句，獲得今日生活的清明啟發。</p>
          </div>
          <button
            class="btn btn-primary reroll-wander-btn"
            :disabled="isWandering"
            @click="rerollWander"
          >
            <ClassicalIcon name="dice" :size="16" />
            <span>{{ isWandering ? '求索翻尋中…' : '求索博採 ‧ 換一錦囊' }}</span>
          </button>
        </div>

        <article class="wander-card glass-panel" :class="{ 'is-animating': isWandering }">
          <div class="wander-header">
            <div class="wander-seal-title">
              <RedSeal :text="KNOWLEDGE_CATEGORIES.find(c => c.id === wanderingPoint.category)?.sealText || '道'" :size="40" />
              <div>
                <span class="wander-cat-label">{{ KNOWLEDGE_CATEGORIES.find(c => c.id === wanderingPoint.category)?.name }} · {{ wanderingPoint.primaryFigure }}</span>
                <h3 class="wander-point-title font-serif">{{ wanderingPoint.title }}</h3>
              </div>
            </div>
            <SchoolBadge :school-id="wanderingPoint.schoolId" size="md" />
          </div>

          <blockquote class="wander-main-quote font-serif">
            「{{ wanderingPoint.famousQuote }}」
          </blockquote>

          <p class="wander-source-cite">
            —— 《{{ wanderingPoint.quoteSource.workTitle }}》· {{ wanderingPoint.quoteSource.chapterTitle }}
          </p>

          <div class="wander-body-grid">
            <div class="wander-block">
              <h4 class="font-serif block-title">
                <ClassicalIcon name="lantern" :size="14" />
                <span>核心智慧精要</span>
              </h4>
              <p class="block-text">{{ wanderingPoint.summary }}</p>
            </div>

            <div class="wander-block highlight-block">
              <h4 class="font-serif block-title">
                <ClassicalIcon name="compass" :size="14" />
                <span>今日生活解藥</span>
              </h4>
              <p class="block-text">{{ wanderingPoint.modernApplication }}</p>
            </div>
          </div>

          <div class="wander-reflection">
            <span class="reflect-tip font-serif">【今日自省策問】</span>
            <p class="reflect-question">{{ wanderingPoint.reflectionQuestion }}</p>
          </div>

          <div class="wander-actions">
            <button
              class="btn btn-outline"
              :class="{ 'is-saved': collectionStore.isCollected(wanderingPoint.id) }"
              @click="collectionStore.toggleCollect(wanderingPoint.id)"
            >
              <ClassicalIcon name="star" :size="14" :color="collectionStore.isCollected(wanderingPoint.id) ? 'var(--gold-400)' : 'currentColor'" />
              <span>{{ collectionStore.isCollected(wanderingPoint.id) ? '已珍藏入文萃' : '珍藏此智慧' }}</span>
            </button>
            <button class="btn btn-primary" @click="openPointModal(wanderingPoint)">
              <ClassicalIcon name="book-open" :size="14" />
              <span>深入研讀此概念全貌</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- ══════════ Tab 4: 外延研讀資源 ══════════ -->
    <section v-else-if="currentTab === 'resources'" class="tab-section tab-resources">
      <div class="resources-intro">
        <h2 class="font-serif section-heading">精選十大學術善本與原典檢索平台</h2>
        <p class="section-subheading">從一句古文出發，循版本、訓詁與歷代評說，走進更廣闊的中文古典文獻世界。</p>
      </div>

      <nav class="resource-filters" aria-label="文海資源分類">
        <button
          v-for="filter in resourceFilters"
          :key="filter"
          :class="{ active: resourceFilter === filter }"
          @click="resourceFilter = filter"
        >
          {{ filter }}
        </button>
      </nav>

      <div class="resource-grid">
        <a
          v-for="(resource, index) in filteredResources"
          :key="resource.url"
          class="resource-card glass-card"
          :href="resource.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card-heading">
            <span class="resource-number font-serif">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="kind font-serif">{{ resource.kind }}</span>
          </div>
          <h3 class="font-serif resource-name">{{ resource.name }}</h3>
          <p class="organization">{{ resource.organization }}</p>
          <p class="description">{{ resource.description }}</p>
          <dl>
            <div><dt>最適合</dt><dd>{{ resource.bestFor }}</dd></div>
            <div><dt>語言</dt><dd>{{ resource.language }}</dd></div>
          </dl>
          <span class="visit">
            <span>前往學術網站</span>
            <ClassicalIcon name="arrow-right" :size="14" />
          </span>
        </a>
      </div>

      <p class="research-note font-serif">
        研究提醒：站外譯文與註釋宜互相比對；正式引用時，請回查底本、版本說明及原網站授權資訊。
      </p>
    </section>

    <!-- 知識點詳細抽屜彈窗 -->
    <KnowledgePointModal
      :point="selectedPoint"
      :is-open="isModalOpen"
      @close="closePointModal"
      @select-point="handleSelectRelated"
    />
  </div>
</template>

<style scoped>
.wenhai-view {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 var(--sp-4) var(--sp-12);
  animation: fadeIn 0.25s ease-out;
}

/* ── 頂部 Hero ────────────────────────────────────── */
.wenhai-hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-6);
  align-items: center;
  padding: var(--sp-8);
  margin-bottom: var(--sp-6);
  border: 1px solid var(--c-border-accent, #c9a96e);
  border-radius: var(--radius-xl, 16px);
  background: radial-gradient(circle at 10% 20%, rgba(201, 169, 110, 0.16), transparent 45%), var(--c-bg-card);
}

.hero-seal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.eyebrow-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
}

.eyebrow {
  color: var(--c-gold, #c9a96e);
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
  margin: 0;
}

.hero-stats-badge {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.25);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border);
}

.dot-sep {
  opacity: 0.4;
}

.hero-title {
  font-size: var(--fs-4xl, 2.4rem);
  color: var(--c-text-primary);
  margin: 0 0 var(--sp-2);
  line-height: 1.2;
}

.hero-copy {
  max-width: 760px;
  color: var(--c-text-secondary);
  line-height: 1.8;
  margin: 0 0 var(--sp-5);
  font-size: var(--fs-sm);
}

.hero-search-box {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-full);
  max-width: 680px;
}

.hero-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--c-text-primary);
  font-size: var(--fs-sm);
}

.hero-search-input::placeholder {
  color: var(--c-text-muted);
}

.search-clear-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
}

/* ── 主導覽分頁 ─────────────────────────────────── */
.main-tab-nav {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
  border-bottom: 1px solid var(--c-border);
  padding-bottom: var(--sp-2);
  overflow-x: auto;
}

.main-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: var(--sp-3) var(--sp-5);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast);
  white-space: nowrap;
}

.main-tab-btn:hover {
  color: var(--c-text-primary);
}

.main-tab-btn.active {
  color: var(--c-gold);
  border-bottom-color: var(--c-gold);
  background: rgba(201, 169, 110, 0.06);
}

.tab-badge {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
}

.main-tab-btn.active .tab-badge {
  background: var(--c-gold-glow);
  color: var(--c-gold);
}

/* ── 篩選工具列 ─────────────────────────────────── */
.filters-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.filter-pill:hover,
.filter-pill.active {
  color: var(--c-gold);
  border-color: var(--c-border-accent);
  background: var(--c-gold-glow);
}

.secondary-filters {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.school-select {
  padding: 6px 12px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  outline: none;
}

.collect-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.collect-filter-btn:hover,
.collect-filter-btn.active {
  border-color: var(--gold-400);
  color: var(--gold-400);
  background: rgba(201, 169, 110, 0.08);
}

/* ── 知識點網格卡片 ─────────────────────────────── */
.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.point-card {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  background: var(--c-bg-card);
  cursor: pointer;
  transition: transform var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast);
}

.point-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-border-accent);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}

.card-category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-xs);
  color: var(--c-gold);
  font-weight: 500;
}

.card-status-badges {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.status-badge.mastered {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  background: rgba(91, 138, 114, 0.15);
  color: var(--c-accent-dao, #5b8a72);
  border: 1px solid rgba(91, 138, 114, 0.3);
}

.star-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 2px;
}

.card-title-group {
  margin-bottom: var(--sp-2);
}

.point-title {
  margin: 0 0 2px;
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
  line-height: 1.3;
}

.point-figure {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.point-tagline {
  font-size: var(--fs-sm);
  color: var(--c-gold);
  margin: var(--sp-2) 0;
  line-height: 1.5;
}

.point-quote {
  margin: var(--sp-3) 0;
  padding: var(--sp-3) var(--sp-4);
  background: rgba(0, 0, 0, 0.2);
  border-left: 2px solid var(--c-gold);
  border-radius: 4px;
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  line-height: 1.7;
}

.card-bottom-row {
  margin-top: auto;
  padding-top: var(--sp-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: var(--fs-xs);
}

.quote-source-label {
  color: var(--c-text-muted);
}

.open-detail-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-gold);
}

/* ── 學程路徑樣式 ───────────────────────────────── */
.section-heading {
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
  margin: 0 0 var(--sp-2);
}

.section-subheading {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin: 0 0 var(--sp-6);
  max-width: 720px;
  line-height: 1.7;
}

.tracks-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.track-card {
  padding: var(--sp-6);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-xl);
  background: var(--c-bg-card);
  transition: border-color var(--duration-fast);
}

.track-card.is-active-track {
  border-color: var(--c-border-accent);
  box-shadow: 0 0 24px rgba(201, 169, 110, 0.12);
}

.track-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.track-badge-group {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.track-est-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-1);
}

.track-title {
  margin: 0 0 2px;
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
}

.track-subtitle {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--c-gold);
}

.track-summary {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  line-height: 1.7;
  margin: 0 0 var(--sp-4);
}

.track-progress-box {
  margin-bottom: var(--sp-5);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-bottom: 6px;
}

.track-progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.track-progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.ladder-title {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  margin: 0 0 var(--sp-3);
  letter-spacing: 0.06em;
}

.ladder-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.ladder-node {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.ladder-node:hover {
  border-color: var(--c-border-accent);
  background: var(--c-bg-card-hover);
  transform: translateY(-2px);
}

.node-order {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-xs);
  font-weight: 600;
  flex-shrink: 0;
}

.node-order.is-done {
  background: rgba(91, 138, 114, 0.2);
  color: var(--c-accent-dao, #5b8a72);
  border: 1px solid var(--c-accent-dao);
}

.node-info {
  flex: 1;
  min-width: 0;
}

.node-title {
  display: block;
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-tagline {
  display: block;
  font-size: 0.72rem;
  color: var(--c-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-footer {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  padding-top: var(--sp-3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ── 每日漫遊樣式 ───────────────────────────────── */
.wander-wrapper {
  max-width: 820px;
  margin: 0 auto;
}

.wander-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
  flex-wrap: wrap;
}

.wander-title {
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
  margin: 0 0 var(--sp-1);
}

.wander-desc {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.wander-card {
  padding: var(--sp-8);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-xl);
  background: radial-gradient(circle at 10% 20%, rgba(201, 169, 110, 0.12), transparent 45%), var(--c-bg-card);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wander-card.is-animating {
  opacity: 0.6;
  transform: scale(0.99);
}

.wander-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-6);
}

.wander-seal-title {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.wander-cat-label {
  font-size: var(--fs-xs);
  color: var(--c-gold);
}

.wander-point-title {
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
  margin: 2px 0 0;
}

.wander-main-quote {
  font-size: 1.45rem;
  line-height: 1.8;
  color: var(--c-text-primary);
  margin: 0 0 var(--sp-2);
  letter-spacing: 0.04em;
}

.wander-source-cite {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  text-align: right;
  margin: 0 0 var(--sp-6);
}

.wander-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.wander-block {
  padding: var(--sp-4);
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border);
}

.wander-block.highlight-block {
  background: rgba(91, 138, 114, 0.08);
  border-left: 3px solid var(--c-accent-dao, #5b8a72);
}

.block-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-gold);
  margin: 0 0 var(--sp-2);
}

.block-text {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--c-text-secondary);
  line-height: 1.8;
}

.wander-reflection {
  padding: var(--sp-4);
  background: rgba(181, 141, 61, 0.08);
  border: 1px dashed var(--c-gold);
  border-radius: var(--radius-md);
  margin-bottom: var(--sp-6);
}

.reflect-tip {
  display: block;
  font-size: var(--fs-xs);
  color: var(--c-gold);
  margin-bottom: var(--sp-1);
}

.reflect-question {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  font-style: italic;
  line-height: 1.6;
}

.wander-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-3);
}

/* ── 外延資源樣式 ───────────────────────────────── */
.resource-filters {
  display: flex;
  gap: var(--sp-2);
  overflow-x: auto;
  padding-bottom: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.resource-filters button {
  white-space: nowrap;
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.resource-filters button:hover,
.resource-filters button.active {
  color: var(--c-gold);
  border-color: var(--c-border-accent);
  background: var(--c-gold-glow);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-4);
}

.resource-card {
  display: flex;
  flex-direction: column;
  min-height: 310px;
  padding: var(--sp-6);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  background: var(--c-bg-card);
  color: inherit;
  text-decoration: none;
  transition: transform var(--duration-fast), border-color var(--duration-fast);
}

.resource-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-border-accent);
}

.card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-4);
}

.resource-number {
  color: var(--c-text-muted);
}

.kind {
  padding: 3px 9px;
  border-radius: var(--radius-full);
  background: var(--c-gold-glow);
  color: var(--c-gold);
  font-size: var(--fs-xs);
}

.resource-name {
  color: var(--c-text-primary);
  font-size: var(--fs-xl);
  margin: 0;
}

.organization {
  margin: var(--sp-1) 0 var(--sp-4);
  color: var(--c-gold);
  font-size: var(--fs-xs);
}

.description {
  color: var(--c-text-secondary);
  line-height: 1.7;
  font-size: var(--fs-sm);
}

dl {
  margin: var(--sp-4) 0;
  font-size: var(--fs-xs);
}

dl div {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
}

dt {
  color: var(--c-text-muted);
}

dd {
  color: var(--c-text-secondary);
  margin: 0;
}

.visit {
  margin-top: auto;
  color: var(--c-gold);
  font-size: var(--fs-sm);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.research-note {
  margin: var(--sp-8) 0;
  padding: var(--sp-4);
  border-left: 3px solid var(--c-gold-dark);
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  line-height: 1.7;
}

.empty-state {
  text-align: center;
  padding: var(--sp-12) var(--sp-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .wenhai-hero {
    grid-template-columns: 1fr;
    padding: var(--sp-6);
  }
  .resource-grid {
    grid-template-columns: 1fr;
  }
  .wander-body-grid {
    grid-template-columns: 1fr;
  }
  .track-card-header {
    flex-direction: column;
  }
  .wander-actions {
    flex-direction: column;
  }
  .wander-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>
