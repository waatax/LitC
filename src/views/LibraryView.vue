<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Work, SchoolId, School, Chapter } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getSchools, getWorkDescription } from '@/data/catalogApi'
import { catalogWorks, catalogChapters } from '@/data/catalog'
import { THEMATIC_TOPICS, type ThematicTopic, type ThematicRecommendation } from '@/data/thematicTopics'
import SchoolBadge from '@/components/SchoolBadge.vue'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'

const router = useRouter()
const route = useRoute()
const mounted = ref(false)

type ViewMode = 'thematic' | 'schools'
const viewMode = ref<ViewMode>('thematic')
const selectedTopicId = ref<string>('inner-peace')

type FilterTab = 'all' | SchoolId
const activeFilter = ref<FilterTab>('all')
const expandedWorkId = ref<string | null>(null)

// Load data
const allSchools = ref<School[]>(getSchools())
const allWorks = ref<Work[]>(catalogWorks)
const workChapters = ref<Map<string, Chapter[]>>(new Map())

// 配備實體名家錄音檔之經典（其餘典籍皆 100% 配備古典正音 TTS）
const PHYSICAL_AUDIO_WORKS = new Set([
  'dao-de-jing',
  'da-xue',
  'zhong-yong',
  'art-of-war',
  'jian-zhu-ke-shu',
  'lun-yu',
  'gu-wen-guan-zhi',
])

const currentTopic = computed<ThematicTopic>(() => {
  return THEMATIC_TOPICS.find((t) => t.id === selectedTopicId.value) || THEMATIC_TOPICS[0]
})

function checkQueryFilter() {
  const topicParam = route.query.topic as string
  const schoolParam = route.query.school as string
  const workParam = route.query.work as string

  if (topicParam) {
    viewMode.value = 'thematic'
    const match = THEMATIC_TOPICS.find((t) => t.id === topicParam)
    if (match) {
      selectedTopicId.value = match.id
    }
    return
  }

  if (workParam) {
    viewMode.value = 'schools'
    const work = allWorks.value.find((w) => w.id === workParam)
    if (work) {
      activeFilter.value = work.schoolId as FilterTab
      expandedWorkId.value = work.id
      if (!workChapters.value.has(work.id)) {
        workChapters.value.set(
          work.id,
          catalogChapters.filter((c) => c.workId === work.id)
        )
      }
      return
    }
  }

  if (schoolParam) {
    viewMode.value = 'schools'
    if (
      schoolParam === 'all' ||
      ['daoism', 'legalism', 'mohism', 'confucianism', 'literature', 'military', 'histories'].includes(schoolParam)
    ) {
      activeFilter.value = schoolParam as FilterTab
      expandedWorkId.value = null
    }
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(
  () => route.fullPath,
  () => {
    checkQueryFilter()
  },
  { immediate: true }
)

interface FilterOption {
  id: FilterTab
  label: string
}

const filterTabs: FilterOption[] = [
  { id: 'all', label: '全部學派' },
  { id: 'daoism', label: '道家' },
  { id: 'confucianism', label: '儒家' },
  { id: 'legalism', label: '法家' },
  { id: 'mohism', label: '墨家' },
  { id: 'military', label: '兵家' },
  { id: 'histories', label: '史書' },
  { id: 'literature', label: '文學' },
]

const filteredWorks = computed(() => {
  if (activeFilter.value === 'all') {
    return allWorks.value
  }
  return allWorks.value.filter((w) => w.schoolId === activeFilter.value)
})

interface WorkGroup {
  id: string
  title: string
  description: string
  works: Work[]
}

const collections: Record<SchoolId, ReadonlyArray<{ id: string; title: string; description: string; workIds?: string[] }>> = {
  confucianism: [
    { id: 'four-books', title: '四書', description: '《論語》、《孟子》、《大學》、《中庸》', workIds: ['lun-yu', 'meng-zi', 'da-xue', 'zhong-yong'] },
    { id: 'five-classics', title: '五經', description: '《易經》、《尚書》、《詩經》、《禮記》、《春秋》', workIds: ['yi-jing', 'shu-jing', 'shi-jing', 'li-ji', 'chun-qiu'] },
    { id: 'confucian-masters', title: '儒家諸子', description: '先秦儒家重要思想典籍', workIds: ['xunzi'] },
  ],
  daoism: [
    { id: 'daoism-core', title: '老莊經典', description: '道家核心哲學典籍', workIds: ['dao-de-jing', 'zhuangzi'] },
    { id: 'daoism-others', title: '其他道家文獻', description: '列子及其他重要道家著作', workIds: ['liezi', 'wenzi', 'wenshi-zhenjing'] },
  ],
  legalism: [
    { id: 'legalism-masters', title: '法家諸子', description: '法、術、勢相關著作', workIds: ['han-fei-zi', 'shang-jun-shu', 'shen-bu-hai', 'shenzi', 'guanzi', 'jian-zhu-ke-shu'] },
  ],
  mohism: [
    { id: 'mohism-core', title: '墨家經典', description: '墨翟及墨家學派傳世文獻', workIds: ['mo-zi'] },
  ],
  military: [
    { id: 'military-classics', title: '武經七書與兵法', description: '中國古代兵法精華', workIds: ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'] },
  ],
  histories: [
    { id: 'spring-autumn-commentaries', title: '春秋三傳', description: '《左傳》、《公羊傳》、《穀梁傳》', workIds: ['chun-qiu-zuo-zhuan', 'gongyang-zhuan', 'guliang-zhuan'] },
    { id: 'annals-biographies', title: '紀傳與編年史', description: '歷代官修史書', workIds: ['shiji', 'han-shu', 'hou-han-shu', 'qian-han-ji', 'dong-guan-han-ji', 'zhushu-jinian'] },
    { id: 'misc-histories', title: '國史與雜史', description: '《戰國策》、《國語》及其他史傳佚聞', workIds: ['guo-yu', 'zhan-guo-ce', 'wu-yue-chun-qiu', 'yue-jue-shu', 'lost-book-of-zhou', 'yanzi-chun-qiu', 'yan-tie-lun', 'yandanzi', 'xijing-zaji', 'lie-nv-zhuan', 'mutianzi-zhuan', 'gu-san-fen'] },
  ],
  literature: [
    { id: 'literature-classics', title: '文學典籍', description: '古文選集與文學作品', workIds: ['gu-wen-guan-zhi', 'cai-gen-tan'] },
  ],
}

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
  const byId = new Map(allWorks.value.map((work) => [work.id, work]))

  if (activeFilter.value === 'all') {
    return filterTabs.slice(1).map((tab) => {
      const schoolId = tab.id as SchoolId
      const meta = schoolGroupMeta[schoolId]
      return {
        id: schoolId,
        title: meta.title,
        description: meta.description,
        works: allWorks.value.filter((work) => work.schoolId === schoolId),
      }
    }).filter((group) => group.works.length > 0)
  }

  const schoolId = activeFilter.value as SchoolId
  const definedCollections = collections[schoolId]

  if (definedCollections && definedCollections.length > 0) {
    return definedCollections.map((group) => ({
      id: group.id,
      title: group.title,
      description: group.description,
      works: (group.workIds || [])
        .map((id) => byId.get(id))
        .filter((work): work is Work => Boolean(work)),
    })).filter((group) => group.works.length > 0)
  }

  return [
    {
      id: schoolId,
      title: schoolGroupMeta[schoolId].title,
      description: schoolGroupMeta[schoolId].description,
      works: filteredWorks.value,
    },
  ]
})

function setFilter(tab: FilterTab) {
  activeFilter.value = tab
  expandedWorkId.value = null
}

function selectTopic(topicId: string) {
  selectedTopicId.value = topicId
  router.replace({ path: '/library', query: { topic: topicId } })
}

function switchViewMode(mode: ViewMode) {
  viewMode.value = mode
  if (mode === 'thematic') {
    router.replace({ path: '/library', query: { topic: selectedTopicId.value } })
  } else {
    router.replace({ path: '/library', query: { school: activeFilter.value } })
  }
}

function viewWorkFromTopic(workId: string) {
  viewMode.value = 'schools'
  const work = allWorks.value.find((w) => w.id === workId)
  if (work) {
    activeFilter.value = work.schoolId as FilterTab
    expandedWorkId.value = work.id
    if (!workChapters.value.has(work.id)) {
      workChapters.value.set(
        work.id,
        catalogChapters.filter((c) => c.workId === work.id)
      )
    }
  }
}

function toggleWork(workId: string) {
  if (expandedWorkId.value === workId) {
    expandedWorkId.value = null
    return
  }
  expandedWorkId.value = workId
  if (!workChapters.value.has(workId)) {
    const chapters = catalogChapters.filter((c) => c.workId === workId)
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

function goToCompare() {
  router.push('/compare')
}
</script>

<template>
  <div class="library-view" :class="{ 'is-mounted': mounted }">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-main-row">
        <div>
          <div class="header-tag-row">
            <span class="classical-pill">先秦漢魏六朝 ‧ 傳世文脈</span>
            <span class="audio-all-indicator">
              <ClassicalIcon name="audio" :size="13" color="var(--c-gold)" />
              51 部文庫 100% 逐段雅正朗讀
            </span>
          </div>
          <h1 class="page-title">典籍文庫</h1>
          <p class="page-desc">按「生活課題與思想主題」尋道，或循「九流十家」縱覽原典正文。</p>
        </div>
        <button class="search-hero-btn btn-ghost" @click="triggerSearch">
          <ClassicalIcon name="search" :size="16" />
          <span>檢索全站經文 (Ctrl+K)</span>
        </button>
      </div>

      <!-- Quick Exploration Hot Tags -->
      <div class="hot-topics-strip" aria-label="主題探索推薦詞">
        <span class="hot-label">
          <ClassicalIcon name="sparkle" :size="13" color="var(--c-gold)" />
          心境熱搜：
        </span>
        <button class="hot-chip" @click="selectTopic('inner-peace'); viewMode = 'thematic'">
          #安頓身心
        </button>
        <button class="hot-chip" @click="selectTopic('noble-character'); viewMode = 'thematic'">
          #君子格局
        </button>
        <button class="hot-chip" @click="selectTopic('leadership-strategy'); viewMode = 'thematic'">
          #謀略決策
        </button>
        <button class="hot-chip" @click="selectTopic('literary-masterpieces'); viewMode = 'thematic'">
          #千古名篇
        </button>
        <button class="hot-chip" @click="selectTopic('philosophic-debates'); viewMode = 'thematic'">
          #諸子思辨
        </button>
        <button class="hot-chip" @click="selectTopic('daily-wisdom'); viewMode = 'thematic'">
          #晨昏金句
        </button>
        <button class="hot-chip" @click="goToChapter('gu-wen-guan-zhi_ch-57')">
          #桃花源記
        </button>
        <button class="hot-chip" @click="goToChapter('art-of-war_ch-3')">
          #知彼知己
        </button>
      </div>
    </header>

    <!-- Top View Mode Switcher -->
    <div class="view-mode-tabs" role="tablist" aria-label="閱讀模式切換">
      <button
        class="mode-tab-btn"
        :class="{ 'is-active': viewMode === 'thematic' }"
        role="tab"
        :aria-selected="viewMode === 'thematic'"
        @click="switchViewMode('thematic')"
      >
        <ClassicalIcon name="compass" :size="17" />
        <span class="tab-text-main font-serif">心境尋道 ‧ 主題策展</span>
        <span class="tab-text-sub">生活啟發 ‧ 核心名篇精選</span>
      </button>
      <button
        class="mode-tab-btn"
        :class="{ 'is-active': viewMode === 'schools' }"
        role="tab"
        :aria-selected="viewMode === 'schools'"
        @click="switchViewMode('schools')"
      >
        <ClassicalIcon name="library" :size="17" />
        <span class="tab-text-main font-serif">九流十家 ‧ 典籍大庫</span>
        <span class="tab-text-sub">51 部典籍 ‧ 原典全景檢索</span>
      </button>
      <button
        class="mode-tab-btn"
        role="tab"
        :aria-selected="false"
        @click="router.push('/wenhai')"
      >
        <ClassicalIcon name="wenhai" :size="17" />
        <span class="tab-text-main font-serif">文海觀瀾 ‧ 思想全譜</span>
        <span class="tab-text-sub">先秦思潮 ‧ 循序修習學程</span>
      </button>
    </div>

    <!-- ═══════════════ MODE 1: THEMATIC EXPLORATION ═══════════════ -->
    <div v-if="viewMode === 'thematic'" class="thematic-container stagger-children">
      <!-- 6 Themes Grid -->
      <div class="thematic-grid">
        <button
          v-for="topic in THEMATIC_TOPICS"
          :key="topic.id"
          class="thematic-card glass-card"
          :class="[{ 'is-active': selectedTopicId === topic.id }, topic.colorClass]"
          @click="selectTopic(topic.id)"
        >
          <div class="thematic-card-header">
            <span class="thematic-seal">{{ topic.sealText }}</span>
            <div class="thematic-title-box">
              <span class="thematic-eyebrow">{{ topic.eyebrow }}</span>
              <h3 class="thematic-title font-serif">{{ topic.title }}</h3>
            </div>
          </div>
          <p class="thematic-summary">{{ topic.summary }}</p>
          <div class="thematic-tags">
            <span v-for="tag in topic.tags.slice(0, 3)" :key="tag" class="topic-tag">
              {{ tag }}
            </span>
          </div>
          <div class="thematic-footer">
            <span class="thematic-rec-count">
              <ClassicalIcon name="book-open" :size="13" />
              精選 {{ topic.recommendations.length }} 部必讀名篇
            </span>
            <span class="thematic-arrow">
              <ClassicalIcon name="arrow-right" :size="14" />
            </span>
          </div>
        </button>
      </div>

      <!-- Active Topic Spotlight Panel -->
      <section class="topic-spotlight glass-card-elevated" :class="currentTopic.colorClass">
        <div class="spotlight-header">
          <div class="spotlight-seal-wrap">
            <RedSeal :text="currentTopic.sealText" :size="48" :animate="false" />
          </div>
          <div class="spotlight-info">
            <span class="spotlight-eyebrow font-serif">{{ currentTopic.eyebrow }}</span>
            <h2 class="spotlight-title font-serif">{{ currentTopic.title }}</h2>
            <p class="spotlight-desc">{{ currentTopic.summary }}</p>
            <div class="spotlight-best-for">
              <span class="best-for-label">適合修習：</span>
              <span class="best-for-text">{{ currentTopic.bestFor }}</span>
            </div>
          </div>
          <div v-if="currentTopic.compareThemeId" class="spotlight-action-aside">
            <button class="compare-direct-btn" @click="goToCompare">
              <ClassicalIcon name="compare" :size="16" />
              <span>諸子交鋒對照</span>
            </button>
          </div>
        </div>

        <!-- 3 Reflective Questions -->
        <div class="spotlight-questions-box">
          <h4 class="questions-title font-serif">
            <ClassicalIcon name="sparkle" :size="14" color="var(--c-gold)" />
            心靈叩問 ‧ 經典思辨
          </h4>
          <div class="questions-list">
            <div v-for="(q, idx) in currentTopic.keyQuestions" :key="idx" class="question-pill">
              <span class="q-num">問{{ ['一', '二', '三'][idx] }}</span>
              <span class="q-text">{{ q }}</span>
            </div>
          </div>
        </div>

        <!-- Curated Masterwork Recommendations -->
        <div class="spotlight-recommendations">
          <h4 class="recs-title font-serif">
            <ClassicalIcon name="book-open" :size="16" color="var(--c-gold)" />
            核心推薦篇章 ‧ 深入研讀
          </h4>

          <div class="recs-grid">
            <div
              v-for="rec in currentTopic.recommendations"
              :key="rec.highlightChapterId"
              class="rec-card glass-card"
            >
              <div class="rec-top">
                <div class="rec-work-badge-group">
                  <span class="rec-work-title font-serif">{{ rec.workTitle }}</span>
                  <span class="rec-chapter-title font-serif">{{ rec.chapterTitle }}</span>
                </div>
                <div class="rec-meta">
                  <span class="rec-time">約 {{ rec.estimatedMinutes }} 分鐘</span>
                  <span class="rec-diff" :title="`難度 ${rec.difficulty}/5`">
                    {{ difficultyDots(rec.difficulty) }}
                  </span>
                </div>
              </div>

              <!-- Canonical Quote -->
              <blockquote class="rec-quote font-serif">
                <ClassicalIcon name="quote" :size="14" color="var(--c-gold)" class="quote-icon" />
                {{ rec.famousQuote }}
              </blockquote>

              <!-- Reason to Read -->
              <div class="rec-reason">
                <span class="reason-tag">為何薦讀：</span>
                <span class="reason-text">{{ rec.reason }}</span>
              </div>

              <div class="rec-actions">
                <button class="rec-btn-primary" @click="goToChapter(rec.highlightChapterId)">
                  <span>進入篇章研讀</span>
                  <ClassicalIcon name="arrow-right" :size="14" />
                </button>
                <button class="rec-btn-secondary" @click="viewWorkFromTopic(rec.workId)">
                  <span>查看全書篇目</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ═══════════════ MODE 2: SCHOOLS & CANON ═══════════════ -->
    <div v-else class="schools-container stagger-children">
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
      <div class="works-grid">
        <section v-for="group in groupedWorks" :key="group.id" class="work-group">
          <header class="work-group-header">
            <div>
              <h2 class="work-group-title font-serif">{{ group.title }}</h2>
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
                  <h3 class="work-title font-serif">{{ work.title }}</h3>
                  <p v-if="work.subtitle" class="work-subtitle">{{ work.subtitle }}</p>
                </div>
                <div class="work-meta">
                  <SchoolBadge :school-id="work.schoolId" />
                  <span class="genre-badge badge">
                    <ClassicalIcon name="book-open" :size="12" />
                    {{ GENRE_STRATEGY_META[work.genreStrategy]?.label || '經典' }}
                  </span>
                  <span
                    v-if="PHYSICAL_AUDIO_WORKS.has(work.id)"
                    class="audio-supported-badge badge"
                    title="配備名家實體錄音朗讀，兼具智能正音"
                  >
                    <ClassicalIcon name="audio" :size="12" />
                    典藏名家原音
                  </span>
                  <span
                    v-else
                    class="audio-tts-badge badge"
                    title="支援 100% 逐段智能古典音韻朗讀"
                  >
                    <ClassicalIcon name="audio" :size="12" />
                    雅正朗讀
                  </span>
                </div>
                <div class="work-stats">
                  <span class="stat-text">{{ countChapters(work) }} 篇</span>
                  <span class="stat-sep">·</span>
                  <span class="stat-text">{{ work.totalChars }} 字</span>
                </div>
                <span class="expand-icon" :class="{ 'is-rotated': expandedWorkId === work.id }">
                  <ClassicalIcon name="chevron-down" :size="18" />
                </span>
              </div>

              <!-- Expanded Chapters -->
              <Transition name="expand">
                <div v-if="expandedWorkId === work.id" class="chapters-list">
                  <div class="chapters-divider"></div>

                  <!-- Work Description Preview -->
                  <div v-if="getWorkDescription(work.id)" class="work-intro-preview">
                    <div class="intro-preview-header">
                      <span class="preview-author">
                        <ClassicalIcon name="scholar" :size="14" />
                        {{ getWorkDescription(work.id)?.author }}
                      </span>
                      <span class="preview-period">
                        <ClassicalIcon name="hourglass" :size="14" />
                        {{ getWorkDescription(work.id)?.period }}
                      </span>
                    </div>
                    <p class="intro-preview-text">{{ getWorkDescription(work.id)?.introduction }}</p>
                    <div class="intro-preview-allusions">
                      <span class="allusion-label">名句典故：</span>
                      <span
                        v-for="allusion in getWorkDescription(work.id)?.keyAllusions.slice(0, 3)"
                        :key="allusion"
                        class="allusion-chip"
                      >
                        {{ allusion.split('：')[0] }}
                      </span>
                    </div>
                  </div>

                  <div class="chapters-grid-container">
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
                        <span class="chapter-arrow">
                          <ClassicalIcon name="arrow-right" :size="14" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-if="getWorkChapters(work.id).length === 0" class="no-chapters">
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
        <span class="empty-icon">
          <ClassicalIcon name="empty" :size="48" color="var(--c-gold)" />
        </span>
        <p class="empty-text">此學派尚無典籍</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
  max-width: 1140px;
  margin: 0 auto;
  padding-bottom: var(--sp-12);
}

.library-view.is-mounted {
  opacity: 1;
}

/* ── Header ── */
.page-header {
  margin-bottom: var(--sp-6);
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

.header-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--sp-4);
}

.header-tag-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--sp-2);
}

.classical-pill {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.25);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.audio-all-indicator {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--c-gold-light);
  background: rgba(91, 138, 114, 0.12);
  border: 1px solid rgba(91, 138, 114, 0.3);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.page-title {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3.2vw, 2.5rem);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 var(--sp-1) 0;
  letter-spacing: 0.08em;
}

.page-desc {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin: 0;
}

.search-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-accent);
  background: var(--c-bg-card);
  color: var(--c-gold-light);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.search-hero-btn:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
  transform: translateY(-1px);
}

/* ── Hot Topics Strip ── */
.hot-topics-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--sp-4);
  padding: 8px 14px;
  background: rgba(201, 169, 110, 0.04);
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: var(--radius-md);
}

.hot-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--c-gold);
  font-family: var(--font-serif);
  font-weight: 600;
  white-space: nowrap;
}

.hot-chip {
  background: transparent;
  border: 1px solid transparent;
  color: var(--c-text-secondary);
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.hot-chip:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-border-accent);
  color: var(--c-gold-light);
}

/* ── Top View Mode Switcher ── */
.view-mode-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
  padding: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-lg);
}

.mode-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.mode-tab-btn:hover {
  color: var(--c-text-primary);
  background: rgba(201, 169, 110, 0.05);
}

.mode-tab-btn.is-active {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.14), rgba(201, 169, 110, 0.06));
  border-color: var(--c-border-accent);
  color: var(--c-gold);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.tab-text-main {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.tab-text-sub {
  font-size: 0.75rem;
  color: var(--c-text-muted);
  display: inline-block;
  opacity: 0.8;
}

.mode-tab-btn.is-active .tab-text-sub {
  color: var(--c-gold-light);
  opacity: 0.9;
}

/* ═══════════════ THEMATIC GRID & SPOTLIGHT ═══════════════ */
.thematic-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.thematic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.thematic-card {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  text-align: left;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
  background: var(--c-bg-card);
}

.thematic-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-border-accent);
  box-shadow: var(--shadow-md);
}

.thematic-card.is-active {
  border-color: var(--c-gold);
  background: linear-gradient(145deg, rgba(201, 169, 110, 0.12), rgba(20, 20, 30, 0.8));
  box-shadow: 0 0 20px rgba(201, 169, 110, 0.15);
}

.thematic-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--sp-3);
}

.thematic-seal {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--c-gold);
  border: 2px solid var(--c-gold);
  border-radius: 6px;
  background: rgba(201, 169, 110, 0.1);
  flex-shrink: 0;
}

.thematic-title-box {
  display: flex;
  flex-direction: column;
}

.thematic-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--c-gold-dark);
}

.thematic-title {
  margin: 0;
  font-size: 1.15rem;
  color: var(--c-text-primary);
}

.thematic-card.is-active .thematic-title {
  color: var(--c-gold);
}

.thematic-summary {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--c-text-secondary);
  margin: 0 0 var(--sp-3) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.thematic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--sp-3);
}

.topic-tag {
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--c-border-subtle);
  color: var(--c-text-muted);
}

.thematic-footer {
  margin-top: auto;
  padding-top: var(--sp-2);
  border-top: 1px solid var(--c-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--c-gold-light);
}

.thematic-rec-count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.thematic-arrow {
  color: var(--c-gold);
  transition: transform var(--duration-fast);
}

.thematic-card:hover .thematic-arrow {
  transform: translateX(4px);
}

/* ── Active Topic Spotlight ── */
.topic-spotlight {
  padding: var(--sp-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--c-border-accent);
  background: radial-gradient(circle at 10% 10%, rgba(201, 169, 110, 0.1), transparent 40%), var(--c-bg-card);
  box-shadow: var(--shadow-lg);
}

.spotlight-header {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-6);
  padding-bottom: var(--sp-6);
  border-bottom: 1px solid var(--c-border-subtle);
  flex-wrap: wrap;
}

.spotlight-seal-wrap {
  flex-shrink: 0;
}

.spotlight-info {
  flex: 1;
  min-width: 280px;
}

.spotlight-eyebrow {
  display: block;
  font-size: 0.85rem;
  color: var(--c-gold);
  letter-spacing: 0.15em;
  margin-bottom: 4px;
}

.spotlight-title {
  margin: 0 0 10px 0;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  color: var(--c-text-primary);
  letter-spacing: 0.04em;
}

.spotlight-desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0 0 12px 0;
}

.spotlight-best-for {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  background: rgba(201, 169, 110, 0.06);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(201, 169, 110, 0.18);
}

.best-for-label {
  color: var(--c-gold);
  font-weight: 600;
  white-space: nowrap;
}

.best-for-text {
  color: var(--c-text-secondary);
}

.spotlight-action-aside {
  display: flex;
  align-items: center;
}

.compare-direct-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid var(--c-gold);
  color: var(--c-gold-light);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.compare-direct-btn:hover {
  background: var(--c-gold);
  color: #0c0c14;
}

/* ── 3 Reflective Questions ── */
.spotlight-questions-box {
  margin: var(--sp-6) 0;
  padding: var(--sp-5);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
}

.questions-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 var(--sp-3) 0;
  color: var(--c-gold);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
}

.questions-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--sp-3);
}

.question-pill {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
}

.q-num {
  font-size: 0.72rem;
  font-family: var(--font-serif);
  font-weight: 700;
  color: var(--c-gold);
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(201, 169, 110, 0.15);
  flex-shrink: 0;
}

.q-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--c-text-primary);
}

/* ── Curated Recommendations ── */
.spotlight-recommendations {
  margin-top: var(--sp-6);
}

.recs-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 var(--sp-4) 0;
  color: var(--c-gold);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.recs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.rec-card {
  padding: var(--sp-5);
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border);
  background: var(--c-bg-card);
  transition: all var(--duration-fast);
}

.rec-card:hover {
  border-color: var(--c-border-accent);
  transform: translateY(-2px);
}

.rec-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: var(--sp-3);
}

.rec-work-badge-group {
  display: flex;
  flex-direction: column;
}

.rec-work-title {
  font-size: 0.85rem;
  color: var(--c-gold);
  font-weight: 600;
}

.rec-chapter-title {
  font-size: 1.15rem;
  color: var(--c-text-primary);
  font-weight: 600;
}

.rec-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.rec-time {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.rec-diff {
  font-size: 0.55rem;
  letter-spacing: 2px;
  color: var(--c-gold-dark);
}

.rec-quote {
  position: relative;
  margin: 0 0 var(--sp-3) 0;
  padding: 12px 14px 12px 30px;
  background: rgba(201, 169, 110, 0.05);
  border-left: 3px solid var(--c-gold);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--c-text-primary);
}

.quote-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0.6;
}

.rec-reason {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}

.reason-tag {
  color: var(--c-gold);
  font-weight: 600;
}

.rec-actions {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rec-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 14px;
  background: var(--c-gold);
  color: #0c0c14;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.rec-btn-primary:hover {
  background: var(--c-gold-light);
  transform: translateY(-1px);
}

.rec-btn-secondary {
  padding: 9px 12px;
  background: transparent;
  color: var(--c-text-muted);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.rec-btn-secondary:hover {
  color: var(--c-text-primary);
  border-color: var(--c-border-accent);
}

/* ═══════════════ SCHOOLS & CANON STYLES ═══════════════ */
.filter-bar {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--c-border-subtle);
  overflow-x: auto;
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
  white-space: nowrap;
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
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: 0 var(--sp-2) var(--sp-3);
  border-bottom: 1px solid var(--c-border-accent);
}

.work-group-title {
  margin: 0;
  color: var(--c-gold);
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
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  border: 1px solid var(--c-border);
}

.audio-supported-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold-light);
  border: 1px solid var(--c-gold);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.02em;
}

.audio-tts-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(91, 138, 114, 0.12);
  color: #7ab89b;
  border: 1px solid rgba(91, 138, 114, 0.4);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  letter-spacing: 0.02em;
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
  color: var(--c-text-muted);
  transition: transform var(--duration-normal) var(--ease-out);
}

.expand-icon.is-rotated {
  transform: rotate(180deg);
}

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

.chapters-grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-1);
  padding: 0 var(--sp-3);
}

@media (min-width: 680px) {
  .chapters-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--sp-2);
  }
}

.chapter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.chapter-item:hover {
  background: var(--c-bg-card);
  border-color: var(--c-border-accent);
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

.work-intro-preview {
  background: rgba(212, 175, 55, 0.04);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  margin: var(--sp-4) var(--sp-4) var(--sp-4);
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

.intro-preview-header span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
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

.empty-state {
  text-align: center;
  padding: var(--sp-16) 0;
}

.empty-state .empty-icon {
  display: block;
  margin-bottom: var(--sp-4);
}

.empty-state .empty-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

/* ── Transitions ── */
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
  max-height: 3200px;
}

@media (max-width: 768px) {
  .view-mode-tabs {
    grid-template-columns: 1fr;
  }
  .tab-text-sub {
    display: none;
  }
  .spotlight-header {
    flex-direction: column;
  }
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
