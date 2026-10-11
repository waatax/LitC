<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_POINTS,
  LEARNING_TRACKS,
  DILEMMA_TOPICS,
  getRandomKnowledgePoint,
  getKnowledgePointById,
  type KnowledgeCategory,
  type KnowledgePoint,
  type DilemmaTopic,
} from '@/data/knowledgeGraph'
import { WENHAI_RESOURCES, type WenhaiResourceKind } from '@/data/wenhaiResources'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'
import SchoolBadge from '@/components/SchoolBadge.vue'
import KnowledgePointModal from '@/components/KnowledgePointModal.vue'

const route = useRoute()
const collectionStore = useKnowledgeCollectionStore()

type MainTab = 'points' | 'tracks' | 'dilemma' | 'wander' | 'resources'
const currentTab = ref<MainTab>('points')

// 知識點篩選
type CategoryFilter = 'all' | KnowledgeCategory
const selectedCategory = ref<CategoryFilter>('all')
const selectedSchool = ref<string>('all')
const selectedDifficulty = ref<string>('all')
const onlyCollected = ref(false)
const onlyWithNotes = ref(false)
const searchQuery = ref('')

// 當前點選的知識點詳情彈窗
const selectedPoint = ref<KnowledgePoint | null>(null)
const isModalOpen = ref(false)

// 人生情境解惑當前選取
const selectedDilemmaId = ref<string>('dilemma-burnout')
const currentDilemma = computed<DilemmaTopic>(() => {
  return DILEMMA_TOPICS.find(d => d.id === selectedDilemmaId.value) || DILEMMA_TOPICS[0]
})

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
    // 難度過濾
    if (selectedDifficulty.value !== 'all' && String(p.difficulty) !== selectedDifficulty.value) {
      return false
    }
    // 收藏過濾
    if (onlyCollected.value && !collectionStore.isCollected(p.id)) {
      return false
    }
    // 札記過濾
    if (onlyWithNotes.value && !collectionStore.hasNote(p.id)) {
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
  else if (route.query.tab === 'dilemma') currentTab.value = 'dilemma'
  else if (route.query.tab === 'wander') currentTab.value = 'wander'
  else if (route.query.tab === 'resources') currentTab.value = 'resources'

  if (route.query.point) {
    const target = KNOWLEDGE_POINTS.find(p => p.id === route.query.point)
    if (target) openPointModal(target)
  }

  if (route.query.category) {
    const cat = route.query.category as KnowledgeCategory
    if (KNOWLEDGE_CATEGORIES.some(c => c.id === cat)) {
      selectedCategory.value = cat
    }
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
            <span>{{ KNOWLEDGE_POINTS.length }} 則先秦核心義理</span>
            <span class="dot-sep">·</span>
            <span>{{ LEARNING_TRACKS.length }} 大階梯學程</span>
            <span class="dot-sep">·</span>
            <span>已領會 {{ collectionStore.totalMasteredCount }} 點</span>
            <span class="dot-sep">·</span>
            <span class="mastery-rank-pill font-serif">{{ collectionStore.currentMasteryLevel.title }}</span>
          </div>
        </div>
        <h1 class="hero-title font-serif">文海觀瀾</h1>
        <p class="hero-copy">
          從一句警策古文出發，循概念、源流、思辨與現代生活心法，串聯先秦諸子核心思想網絡。隨意漫步、情境處方、循徑修習，讓二千年前的智慧成為當下的清明定力。
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

    <!-- 修行儀表盤快速統計條 -->
    <section class="mastery-summary-bar glass-panel">
      <div class="mastery-left">
        <div class="mastery-level-seal">
          <span class="mastery-seal-text font-serif">{{ collectionStore.currentMasteryLevel.sealText }}</span>
        </div>
        <div class="mastery-text-info">
          <div class="mastery-title-line">
            <strong class="font-serif">{{ collectionStore.currentMasteryLevel.title }}</strong>
            <span class="mastery-sub">先秦義理領會 {{ collectionStore.overallMasteryPercent }}%</span>
          </div>
          <p class="mastery-desc">{{ collectionStore.currentMasteryLevel.description }}</p>
        </div>
      </div>

      <div class="mastery-stats-chips">
        <div class="mini-stat-chip">
          <ClassicalIcon name="check" :size="14" color="var(--c-gold)" />
          <span>已領會 <strong>{{ collectionStore.totalMasteredCount }}</strong> / {{ collectionStore.totalPointsCount }}</span>
        </div>
        <div class="mini-stat-chip">
          <ClassicalIcon name="star" :size="14" color="var(--gold-400)" />
          <span>文萃收藏 <strong>{{ collectionStore.totalCollectedCount }}</strong></span>
        </div>
        <div class="mini-stat-chip">
          <ClassicalIcon name="brush" :size="14" color="#d5a25d" />
          <span>研讀札記 <strong>{{ collectionStore.totalNotesCount }}</strong></span>
        </div>
      </div>
    </section>

    <!-- 五大視圖分頁導覽列 -->
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
        :class="{ active: currentTab === 'dilemma' }"
        @click="currentTab = 'dilemma'"
      >
        <ClassicalIcon name="heart" :size="16" />
        <span>心靈解惑處方</span>
        <span class="tab-badge">{{ DILEMMA_TOPICS.length }}</span>
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

        <!-- 學派、難度與狀態快捷開關 -->
        <div class="secondary-filters">
          <div class="select-wrapper">
            <select v-model="selectedSchool" class="school-select" aria-label="學派篩選">
              <option value="all">所有學派</option>
              <option value="daoism">道家</option>
              <option value="confucianism">儒家</option>
              <option value="military">兵家</option>
              <option value="legalism">法家</option>
              <option value="mohism">墨家</option>
            </select>
          </div>

          <div class="select-wrapper">
            <select v-model="selectedDifficulty" class="school-select" aria-label="難度篩選">
              <option value="all">全部難度</option>
              <option value="1">入門階梯 (★)</option>
              <option value="2">進階探析 (★★)</option>
              <option value="3">深思心法 (★★★)</option>
            </select>
          </div>

          <button
            class="collect-filter-btn"
            :class="{ active: onlyCollected }"
            @click="onlyCollected = !onlyCollected"
            title="僅看我的文萃收藏"
          >
            <ClassicalIcon name="star" :size="14" :color="onlyCollected ? 'var(--gold-400)' : 'currentColor'" />
            <span>文萃 ({{ collectionStore.totalCollectedCount }})</span>
          </button>

          <button
            class="collect-filter-btn"
            :class="{ active: onlyWithNotes }"
            @click="onlyWithNotes = !onlyWithNotes"
            title="僅看已撰寫研讀札記之知識點"
          >
            <ClassicalIcon name="brush" :size="14" :color="onlyWithNotes ? 'var(--c-gold)' : 'currentColor'" />
            <span>有札記 ({{ collectionStore.totalNotesCount }})</span>
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
              <span v-if="collectionStore.hasNote(pt.id)" class="status-badge note-badge" title="已寫心得札記">
                <ClassicalIcon name="brush" :size="11" />
                <span>札記</span>
              </span>
              <span
                v-if="collectionStore.isMastered(pt.id)"
                class="status-badge mastered"
                title="已掌握此概念"
              >
                <ClassicalIcon name="check" :size="11" />
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
            <div class="card-foot-left">
              <span class="quote-source-label">《{{ pt.quoteSource.workTitle }}》</span>
              <span class="difficulty-indicator font-serif" :title="`難度階別 ${pt.difficulty}/3`">
                {{ pt.difficulty === 1 ? '入門' : pt.difficulty === 2 ? '進階' : '深奧' }}
              </span>
            </div>
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
        <button class="btn btn-outline" @click="selectedCategory = 'all'; selectedSchool = 'all'; selectedDifficulty = 'all'; onlyCollected = false; onlyWithNotes = false; searchQuery = ''">
          重設所有篩選
        </button>
      </div>
    </section>

    <!-- ══════════ Tab 2: 心靈解惑處方 (Dilemma Oracle) ══════════ -->
    <section v-else-if="currentTab === 'dilemma'" class="tab-section tab-dilemma">
      <div class="dilemma-intro">
        <h2 class="font-serif section-heading">心境尋道 ‧ 先秦良方</h2>
        <p class="section-subheading">
          現代人生活中的焦慮、迷茫、競爭與人際摩擦，二千年前的先哲早已給出深刻解答。點選你當前的心靈困境，查閱先秦諸子為你開立的思想處方。
        </p>
      </div>

      <!-- 5 大情境選擇標籤 -->
      <div class="dilemma-selector-grid">
        <button
          v-for="d in DILEMMA_TOPICS"
          :key="d.id"
          class="dilemma-pill-card glass-panel"
          :class="{ 'is-selected': selectedDilemmaId === d.id }"
          @click="selectedDilemmaId = d.id"
        >
          <div class="pill-seal-row">
            <span class="dilemma-seal font-serif">{{ d.sealText }}</span>
            <ClassicalIcon :name="d.icon" :size="16" color="var(--c-gold)" />
          </div>
          <h3 class="dilemma-pill-title font-serif">{{ d.title }}</h3>
          <p class="dilemma-pill-sub">{{ d.subtitle }}</p>
        </button>
      </div>

      <!-- 當前情境診斷與良方清單 -->
      <article class="dilemma-detail-panel glass-card">
        <header class="dilemma-detail-header">
          <div class="dilemma-diag-box">
            <span class="diag-label font-serif">【 現代困頓診斷 】</span>
            <p class="diag-text">{{ currentDilemma.situation }}</p>
          </div>
          <div class="dilemma-remedy-box">
            <span class="remedy-label font-serif">【 諸子破局要旨 】</span>
            <p class="remedy-text">{{ currentDilemma.remedyIntro }}</p>
          </div>
        </header>

        <div class="prescriptions-section">
          <h4 class="font-serif pres-heading">
            <ClassicalIcon name="sparkle" :size="16" color="var(--c-gold)" />
            <span>四步解惑處方指南</span>
          </h4>

          <div class="prescriptions-list">
            <div
              v-for="(rx, idx) in currentDilemma.prescriptions"
              :key="rx.pointId"
              class="prescription-card glass-panel"
            >
              <div class="pres-num font-serif">{{ idx + 1 }}</div>
              <div class="pres-content">
                <div class="pres-title-row">
                  <strong
                    class="pres-point-link font-serif"
                    @click="getKnowledgePointById(rx.pointId) && openPointModal(getKnowledgePointById(rx.pointId)!)"
                  >
                    {{ getKnowledgePointById(rx.pointId)?.title || rx.pointId }}
                  </strong>
                  <span class="pres-work font-serif">《{{ getKnowledgePointById(rx.pointId)?.quoteSource.workTitle }}》</span>
                  <button
                    class="btn btn-ghost btn-sm pres-btn"
                    @click="getKnowledgePointById(rx.pointId) && openPointModal(getKnowledgePointById(rx.pointId)!)"
                  >
                    <span>領會心法</span>
                    <ClassicalIcon name="arrow-right" :size="11" />
                  </button>
                </div>
                <blockquote class="pres-quote font-serif">
                  「{{ getKnowledgePointById(rx.pointId)?.famousQuote }}」
                </blockquote>
                <p class="pres-action">💡 <strong>實踐建議：</strong>{{ rx.actionPrompt }}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- ══════════ Tab 3: 修習學程路徑 ══════════ -->
    <section v-else-if="currentTab === 'tracks'" class="tab-section tab-tracks">
      <div class="tracks-intro">
        <h2 class="font-serif section-heading">六大階梯修習學程</h2>
        <p class="section-subheading">
          不論你是尋求身心安頓的忙碌上班族、追求自律格局的君子學人、想洞悉戰略博弈的決策者，或是熱愛先秦寓言批判思維者，皆能依照清晰進階的路徑循序修持。
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
            <div class="progress-info-row">
              <span class="progress-label font-serif">研習進度</span>
              <span class="progress-stats">
                {{ collectionStore.getTrackProgress(track.id).completed }} / {{ collectionStore.getTrackProgress(track.id).total }} 掌握
                ({{ collectionStore.getTrackProgress(track.id).percent }}%)
              </span>
            </div>
            <div class="progress-track-bar">
              <div
                class="progress-fill-bar"
                :style="{ width: `${collectionStore.getTrackProgress(track.id).percent}%`, backgroundColor: track.badgeColor }"
              ></div>
            </div>
          </div>

          <!-- 節點清單 -->
          <div class="track-steps-list">
            <span class="steps-heading font-serif">【 循序研修節點 】</span>
            <div class="steps-chips">
              <button
                v-for="ptId in track.pointIds"
                :key="ptId"
                class="track-step-pill"
                :class="{ 'is-mastered': collectionStore.isMastered(ptId) }"
                @click="getKnowledgePointById(ptId) && openPointModal(getKnowledgePointById(ptId)!)"
              >
                <ClassicalIcon :name="collectionStore.isMastered(ptId) ? 'check' : 'target'" :size="12" />
                <span>{{ getKnowledgePointById(ptId)?.title || ptId }}</span>
              </button>
            </div>
          </div>

          <div class="track-card-footer">
            <span class="track-audience">🎯 適合對象：{{ track.targetAudience }}</span>
            <span class="track-benefit">✨ 核心收穫：{{ track.coreBenefit }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ Tab 4: 每日靈感漫遊 ══════════ -->
    <section v-else-if="currentTab === 'wander'" class="tab-section tab-wander">
      <div class="wander-wrapper">
        <div class="wander-header-bar">
          <div>
            <h2 class="font-serif section-heading">文海偶拾 ‧ 每日靈感錦囊</h2>
            <p class="section-subheading">隨機抽取一則先秦警策，在不期而遇的古典箴言中尋找今天的定見。</p>
          </div>
          <button class="btn btn-outline reroll-btn" @click="rerollWander">
            <ClassicalIcon name="refresh" :size="15" />
            <span>抽取下一則靈感</span>
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

          <div class="wander-body-grid">
            <div class="wander-block">
              <span class="wander-block-title font-serif">💡 白話精解</span>
              <p>{{ wanderingPoint.summary }}</p>
            </div>
            <div class="wander-block">
              <span class="wander-block-title font-serif">🌱 現代啟發</span>
              <p>{{ wanderingPoint.modernApplication }}</p>
            </div>
          </div>

          <div class="wander-reflection-box">
            <span class="wander-ref-title font-serif">【 晨昏探問 】</span>
            <p>{{ wanderingPoint.reflectionQuestion }}</p>
          </div>

          <div class="wander-actions">
            <button class="btn btn-primary" @click="openPointModal(wanderingPoint)">
              <span>檢視完整思想源流與心法</span>
              <ClassicalIcon name="arrow-right" :size="14" />
            </button>
            <button class="btn btn-ghost" @click="collectionStore.toggleMaster(wanderingPoint.id)">
              <ClassicalIcon :name="collectionStore.isMastered(wanderingPoint.id) ? 'check' : 'target'" :size="14" />
              <span>{{ collectionStore.isMastered(wanderingPoint.id) ? '已領會此心法' : '標記為已掌握' }}</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- ══════════ Tab 5: 外延研讀資源 ══════════ -->
    <section v-else-if="currentTab === 'resources'" class="tab-section tab-resources">
      <div class="resource-header-bar">
        <div>
          <h2 class="font-serif section-heading">古籍研究與文獻資源</h2>
          <p class="section-subheading">精選先秦思想權威數位資料庫與研究平台，供進階考據、異文對校與深入專題研讀。</p>
        </div>

        <div class="resource-filter-pills">
          <button
            v-for="k in resourceFilters"
            :key="k"
            class="filter-pill"
            :class="{ active: resourceFilter === k }"
            @click="resourceFilter = k"
          >
            {{ k }}
          </button>
        </div>
      </div>

      <div class="resource-grid">
        <a
          v-for="item in filteredResources"
          :key="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="resource-card glass-panel"
        >
          <div class="card-header">
            <span class="kind-tag">{{ item.kind }}</span>
            <span class="target-badge">{{ item.organization }}</span>
          </div>
          <h3 class="font-serif title">{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>

          <dl>
            <div>
              <dt>適合</dt>
              <dd>{{ item.bestFor }}</dd>
            </div>
            <div>
              <dt>語言</dt>
              <dd>{{ item.language }}</dd>
            </div>
          </dl>

          <div class="visit">
            <span>前往研讀</span>
            <ClassicalIcon name="arrow-right" :size="13" />
          </div>
        </a>
      </div>

      <div class="research-note font-serif">
        <p>※ 典籍文脈 ClassicFlow 堅持學術嚴謹性，上述外連資源皆為兩岸三地及國際學界公認之權威學術文獻庫，推薦讀者配合本站原典段落逐字研習。</p>
      </div>
    </section>

    <!-- 全局知識點深度彈窗組件 -->
    <KnowledgePointModal
      v-model="isModalOpen"
      :point="selectedPoint"
      @select-point="handleSelectRelated"
    />
  </div>
</template>

<style scoped>
.wenhai-view {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 var(--sp-4) var(--sp-12);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  animation: fadeIn 0.3s ease-out;
}

/* 頂部 Hero */
.wenhai-hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-6);
  align-items: center;
  padding: var(--sp-8);
  border-radius: var(--radius-xl);
  background: radial-gradient(circle at 10% 20%, rgba(201, 169, 110, 0.12), transparent 50%), var(--c-surface-card);
  border: 1px solid var(--c-border-subtle);
  position: relative;
  overflow: hidden;
}

.hero-seal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.eyebrow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.eyebrow {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  letter-spacing: 0.15em;
  margin: 0;
}

.hero-stats-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  background: rgba(255, 255, 255, 0.04);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
}

.dot-sep {
  opacity: 0.4;
}

.mastery-rank-pill {
  color: var(--c-gold);
  font-weight: 600;
}

.hero-title {
  margin: 0;
  font-size: clamp(1.8rem, 3.2vw, 2.5rem);
  letter-spacing: 0.06em;
  color: var(--c-text-primary);
}

.hero-copy {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  line-height: var(--lh-relaxed);
  max-width: 820px;
}

/* 搜尋列 */
.hero-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-bg-card, #12100e);
  border: 1px solid var(--c-border-accent, #c9a96e);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  margin-top: var(--sp-2);
  max-width: 640px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.hero-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--c-text-primary);
  font-size: var(--fs-sm);
}

.search-clear-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

/* 修行進度儀表盤 */
.mastery-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: 16px 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-accent, #c9a96e);
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.08), rgba(0, 0, 0, 0.25));
  flex-wrap: wrap;
}

.mastery-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mastery-level-seal {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #a64b4b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(166, 75, 75, 0.35);
}

.mastery-seal-text {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.mastery-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mastery-title-line strong {
  font-size: 1.15rem;
  color: var(--c-text-primary);
}

.mastery-sub {
  font-size: 0.8rem;
  color: var(--c-gold);
  font-weight: 600;
}

.mastery-desc {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.mastery-stats-chips {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.mini-stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--c-text-secondary);
  background: rgba(255, 255, 255, 0.04);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
}

.mini-stat-chip strong {
  color: var(--c-text-primary);
}

/* 分頁導覽列 */
.main-tab-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--c-border-subtle);
}

.main-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.main-tab-btn:hover {
  color: var(--c-text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.main-tab-btn.active {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.15));
  border-color: var(--c-border-accent);
  color: var(--c-gold);
  font-weight: 600;
}

.tab-badge {
  font-size: 0.72rem;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(201, 169, 110, 0.2);
  color: var(--c-gold-dark, #c9a96e);
}

/* 工具列與篩選膠囊 */
.filters-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: var(--c-surface-card);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all 0.18s ease;
}

.filter-pill:hover {
  border-color: var(--c-border-accent);
  color: var(--c-text-primary);
}

.filter-pill.active {
  background: rgba(201, 169, 110, 0.15);
  border-color: var(--c-border-accent);
  color: var(--c-gold);
  font-weight: 600;
}

.secondary-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.school-select {
  padding: 5px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: var(--c-surface-card);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  outline: none;
  cursor: pointer;
}

.collect-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: var(--c-surface-card);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all 0.18s ease;
}

.collect-filter-btn.active {
  border-color: var(--gold-400);
  background: rgba(212, 162, 93, 0.12);
  color: var(--gold-400);
}

/* 知識點卡片網格 */
.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.point-card {
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
}

.point-card:hover {
  transform: translateY(-2px);
  border-color: var(--c-border-accent);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--c-gold);
  font-weight: 600;
}

.card-status-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.status-badge.mastered {
  background: rgba(91, 138, 114, 0.15);
  color: #5b8a72;
}

.status-badge.note-badge {
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
}

.star-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.card-title-group {
  margin-bottom: 6px;
}

.point-title {
  margin: 0;
  font-size: 1.22rem;
  color: var(--c-text-primary);
  letter-spacing: 0.03em;
}

.point-figure {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.point-tagline {
  margin: 6px 0 12px;
  font-size: 0.84rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
}

.point-quote {
  margin: 0 0 16px;
  padding: 8px 12px;
  background: rgba(201, 169, 110, 0.05);
  border-left: 2px solid var(--c-gold);
  border-radius: 0 6px 6px 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--c-text-primary);
}

.card-bottom-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px dashed var(--c-border-subtle);
  font-size: 0.78rem;
}

.card-foot-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.quote-source-label {
  color: var(--c-text-muted);
}

.difficulty-indicator {
  font-size: 0.72rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--c-gold);
}

.open-detail-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-gold);
  font-weight: 500;
}

/* ══════════ 心靈解惑處方 (Dilemma) ══════════ */
.dilemma-intro {
  margin-bottom: var(--sp-4);
}

.dilemma-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: var(--sp-6);
}

.dilemma-pill-card {
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
  background: var(--c-surface-card);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dilemma-pill-card:hover {
  border-color: var(--c-border-accent);
  transform: translateY(-2px);
}

.dilemma-pill-card.is-selected {
  border-color: var(--c-gold);
  background: rgba(201, 169, 110, 0.12);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.pill-seal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.dilemma-seal {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-gold);
}

.dilemma-pill-title {
  margin: 0 0 4px;
  font-size: 1.05rem;
  color: var(--c-text-primary);
}

.dilemma-pill-sub {
  margin: 0;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.dilemma-detail-panel {
  padding: var(--sp-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--c-border-accent);
}

.dilemma-detail-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-5);
  padding-bottom: var(--sp-5);
  border-bottom: 1px dashed var(--c-border-subtle);
  margin-bottom: var(--sp-6);
}

.diag-label,
.remedy-label {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gold);
  margin-bottom: 6px;
  font-weight: 600;
}

.diag-text,
.remedy-text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--c-text-secondary);
}

.pres-heading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  color: var(--c-text-primary);
  margin: 0 0 16px;
}

.prescriptions-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.prescription-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
}

.pres-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.pres-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pres-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pres-point-link {
  font-size: 1.1rem;
  color: var(--c-gold);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.pres-work {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.pres-btn {
  margin-left: auto;
  font-size: 0.75rem;
  padding: 2px 10px;
  color: var(--c-gold);
}

.pres-quote {
  margin: 4px 0;
  font-size: 0.95rem;
  color: var(--c-text-primary);
  line-height: 1.6;
}

.pres-action {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
}

/* ══════════ 修習學程 (Tracks) ══════════ */
.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--sp-5);
}

.track-card {
  padding: var(--sp-6);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  border: 1px solid var(--c-border-subtle);
  transition: all 0.2s ease;
}

.track-card.is-active-track {
  border-color: var(--c-gold);
  box-shadow: 0 8px 30px rgba(201, 169, 110, 0.12);
}

.track-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-3);
}

.track-badge-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.track-est-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.track-title {
  margin: 2px 0 4px;
  font-size: 1.25rem;
  color: var(--c-text-primary);
}

.track-subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: var(--c-gold);
}

.track-summary {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--c-text-secondary);
}

.track-progress-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
}

.progress-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 6px;
}

.progress-label {
  color: var(--c-gold);
  font-weight: 600;
}

.progress-stats {
  color: var(--c-text-muted);
}

.progress-track-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.steps-heading {
  display: block;
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-bottom: 6px;
}

.steps-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.track-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.02);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.18s ease;
}

.track-step-pill:hover {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.track-step-pill.is-mastered {
  border-color: #5b8a72;
  background: rgba(91, 138, 114, 0.12);
  color: #5b8a72;
}

.track-card-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed var(--c-border-subtle);
  font-size: 0.76rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--c-text-muted);
}

/* ══════════ 靈感漫遊 (Wander) ══════════ */
.wander-wrapper {
  max-width: 820px;
  margin: 0 auto;
}

.wander-header-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
  gap: var(--sp-4);
}

.wander-card {
  padding: var(--sp-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--c-border-accent);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.wander-card.is-animating {
  opacity: 0.3;
  transform: scale(0.98);
}

.wander-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wander-seal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wander-cat-label {
  font-size: 0.8rem;
  color: var(--c-gold);
}

.wander-point-title {
  margin: 0;
  font-size: 1.45rem;
  color: var(--c-text-primary);
}

.wander-main-quote {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--c-text-primary);
  margin: 0;
  padding: var(--sp-4) var(--sp-5);
  background: rgba(201, 169, 110, 0.08);
  border-left: 3px solid var(--c-gold);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.wander-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
}

.wander-block {
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--c-border-subtle);
}

.wander-block-title {
  display: block;
  font-size: 0.82rem;
  color: var(--c-gold);
  margin-bottom: 6px;
}

.wander-block p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--c-text-secondary);
}

.wander-reflection-box {
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: rgba(201, 169, 110, 0.06);
  border: 1px dashed var(--c-border-accent);
}

.wander-ref-title {
  display: block;
  font-size: 0.78rem;
  color: var(--c-gold);
  margin-bottom: 4px;
}

.wander-reflection-box p {
  margin: 0;
  font-size: 0.92rem;
  color: var(--c-text-primary);
  line-height: 1.6;
}

.wander-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding-top: var(--sp-2);
}

/* ══════════ 外延研讀資源 (Resources) ══════════ */
.resource-header-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-5);
  flex-wrap: wrap;
}

.resource-filter-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.resource-card {
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.resource-card:hover {
  border-color: var(--c-gold);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.kind-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  font-weight: 600;
}

.target-badge {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.resource-card .title {
  margin: 4px 0 8px;
  font-size: 1.15rem;
  color: var(--c-text-primary);
}

.resource-card .description {
  margin: 0 0 12px;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
}

.resource-card dl {
  margin: 0 0 16px;
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-card dl div {
  display: flex;
  gap: 8px;
}

.resource-card dt {
  color: var(--c-text-muted);
  flex-shrink: 0;
}

.resource-card dd {
  margin: 0;
  color: var(--c-text-secondary);
}

.resource-card .visit {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  color: var(--c-gold);
  font-weight: 500;
}

.research-note {
  margin-top: var(--sp-6);
  padding: var(--sp-4);
  border-left: 3px solid var(--c-gold);
  font-size: 0.82rem;
  color: var(--c-text-muted);
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.1);
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
  .dilemma-detail-header {
    grid-template-columns: 1fr;
  }
  .wander-body-grid {
    grid-template-columns: 1fr;
  }
  .wander-actions {
    flex-direction: column;
  }
  .wander-actions button {
    width: 100%;
    justify-content: center;
  }
  .mastery-summary-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
