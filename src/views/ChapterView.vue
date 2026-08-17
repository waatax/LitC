<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence } from '@/types/content'
import { GENRE_STRATEGY_META } from '@/types/content'
import { getWorkDescription } from '@/data/catalogApi'
import { loadChapterContent } from '@/data/workLoader'
import { READING_AID_SOURCES } from '@/data/readingAidSources'
import SchoolBadge from '@/components/SchoolBadge.vue'
import ClassicalTextLookup from '@/components/ClassicalTextLookup.vue'
import AudioPlayerBar from '@/components/AudioPlayerBar.vue'
import { speechService, type SpeechMode, type SpeechPlaylistItem } from '@/services/speech'

const route = useRoute()
const router = useRouter()

const chapter = ref<Chapter | null>(null)
const work = ref<Work | null>(null)
const passages = ref<Passage[]>([])
const passageSentences = ref<Map<string, Sentence[]>>(new Map())
const loadedChapters = ref<Chapter[]>([])
const showWorkGuide = ref(false)

const workDesc = computed(() => {
  if (!work.value) return null
  return getWorkDescription(work.value.id) ?? null
})

type ReadingMode = 'clean' | 'assisted'
// 典籍庫開啟章節時，優先呈現原文／白話對照；使用者仍可切回純原文。
const readingMode = ref<ReadingMode>('assisted')
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { isVertical } = storeToRefs(appStore)

const mounted = ref(false)

const isLostChapter = computed(() => {
  return chapter.value?.tags?.includes('亡佚') && passages.value.length === 0
})

async function loadChapter() {
  const chapterId = route.params.id as string
  if (!chapterId) return

  const content = await loadChapterContent(chapterId)
  chapter.value = content?.chapter ?? null
  work.value = content?.work ?? null
  passages.value = content?.passages ?? []
  loadedChapters.value = content?.chapters ?? []
  if (!content) return

  // Load sentences for each passage
  const sentenceMap = new Map<string, Sentence[]>()
  for (const passage of passages.value) {
    sentenceMap.set(passage.id, content.sentences.filter(sentence => sentence.passageId === passage.id))
  }
  passageSentences.value = sentenceMap

  checkTargetHighlight()
}

const highlightQuery = computed(() => (route.query.highlight as string) || '')

function checkTargetHighlight() {
  const queryText = highlightQuery.value
  const sentenceId = (route.query.sentenceId as string) || ''

  if (!queryText && !sentenceId && !route.hash) return

  requestAnimationFrame(() => {
    setTimeout(() => {
      let targetEl: HTMLElement | null = null
      if (route.hash) {
        targetEl = document.querySelector(route.hash)
      }
      if (!targetEl && sentenceId) {
        targetEl = document.querySelector(`[data-sentence-id="${sentenceId}"]`)
      }
      if (!targetEl && queryText) {
        targetEl = document.querySelector('.search-highlight-mark')
      }
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 250)
  })
}

onMounted(async () => {
  await loadChapter()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(() => [route.params.id, route.query.highlight, route.hash], async () => {
  await loadChapter()
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
  return passage.readingAid || { translation: '', analysis: '' }
}

const speechState = speechService.state

function isPassageActive(passageId: string, mode?: SpeechMode) {
  if (mode) {
    return speechState.currentPassageId === passageId && speechState.currentMode === mode && (speechState.isPlaying || speechState.isPaused)
  }
  return speechState.currentPassageId === passageId && (speechState.isPlaying || speechState.isPaused)
}

function isPassageSpeaking(passageId: string) {
  return speechState.currentPassageId === passageId && speechState.isPlaying && !speechState.isPaused
}

function playPassage(passage: Passage, mode: SpeechMode = 'canonical') {
  const textToRead = mode === 'canonical'
    ? passage.canonicalText
    : (passageAid(passage)?.translation || passage.canonicalText)
  
  speechService.speakPassage(passage.id, textToRead, mode, {
    workTitle: work.value?.title,
    chapterTitle: chapter.value?.title,
    canonicalText: passage.canonicalText,
    vernacularText: passageAid(passage)?.translation,
  })
}

function startChapterRecitation(mode: SpeechMode = 'canonical') {
  if (speechState.isPlaying && speechState.playlist.length > 0 && speechState.currentMode === mode) {
    speechService.stop()
    return
  }

  const playlist: SpeechPlaylistItem[] = passages.value.map(p => ({
    passageId: p.id,
    chapterId: chapter.value?.id || '',
    canonicalText: p.canonicalText,
    vernacularText: passageAid(p)?.translation,
    chapterTitle: chapter.value?.title,
    workTitle: work.value?.title,
  }))

  speechService.startChapterPlayback(playlist, mode, 0)
}

onBeforeUnmount(() => {
  speechService.stop()
})

function goBack() {
  speechService.stop()
  router.push('/library')
}

function goToLearn() {
  if (chapter.value) {
    speechService.stop()
    router.push(`/learn/${chapter.value.id}`)
  }
}

function goToMemorize() {
  if (chapter.value) {
    speechService.stop()
    router.push(`/memorize/${chapter.value.id}`)
  }
}

const prevChapter = computed(() => {
  if (!work.value || !chapter.value) return null
  const idx = work.value.chapterIds.indexOf(chapter.value.id)
  if (idx > 0) {
    return loadedChapters.value.find(item => item.id === work.value!.chapterIds[idx - 1]) ?? null
  }
  return null
})

const nextChapter = computed(() => {
  if (!work.value || !chapter.value) return null
  const idx = work.value.chapterIds.indexOf(chapter.value.id)
  if (idx !== -1 && idx < work.value.chapterIds.length - 1) {
    return loadedChapters.value.find(item => item.id === work.value!.chapterIds[idx + 1]) ?? null
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
        <p v-if="chapter.subtitle" class="chapter-subtitle">{{ chapter.subtitle }}</p>
        <div class="chapter-meta">
          <SchoolBadge :school-id="work.schoolId" />
          <span v-if="genreMeta" class="badge genre-badge">
            {{ genreMeta.icon }} {{ genreMeta.label }}
          </span>
          <span class="meta-sep">·</span>
          <span class="meta-detail">約 {{ chapter.estimatedMinutes }} 分鐘</span>
        </div>
      </header>

      <aside v-if="isLostChapter" class="lost-chapter-notice glass-card" aria-label="亡佚篇章說明">
        <strong>今本亡佚，僅存篇名</strong>
        <p>本篇在傳世《墨子》的篇次中有目而無正文，並非網站載入失敗。文庫保留篇位，以呈現全書原有編次。</p>
      </aside>

      <!-- Work Deep Research Guide Card -->
      <div v-if="workDesc" class="work-guide-card glass-card">
        <div class="work-guide-header" @click="showWorkGuide = !showWorkGuide">
          <div class="work-guide-title">
            <span class="guide-icon">📚</span>
            <span>【典籍深度導讀】《{{ workDesc.title }}》考據與名篇解讀</span>
          </div>
          <button class="btn btn-ghost guide-toggle-btn">
            {{ showWorkGuide ? '收起導讀 ▲' : '展開導讀 ▼' }}
          </button>
        </div>
        
        <div v-if="showWorkGuide" class="work-guide-body">
          <div class="guide-grid">
            <div class="guide-item">
              <span class="guide-label">成書時間：</span>
              <span class="guide-val">{{ workDesc.period }}</span>
            </div>
            <div class="guide-item">
              <span class="guide-label">作者/輯者：</span>
              <span class="guide-val">{{ workDesc.author }}</span>
            </div>
          </div>
          <div class="guide-section">
            <span class="guide-label">經典導讀與學術源流：</span>
            <p class="guide-text">{{ workDesc.introduction }}</p>
          </div>
          <div class="guide-section">
            <span class="guide-label">代表典故與名句：</span>
            <ul class="guide-allusions">
              <li v-for="allusion in workDesc.keyAllusions" :key="allusion">{{ allusion }}</li>
            </ul>
          </div>
          <div class="guide-section">
            <span class="guide-label">歷史與學術價值：</span>
            <p class="guide-text">{{ workDesc.significance }}</p>
          </div>
          <div class="guide-sources">
            <span class="guide-label">考據與三源引用：</span>
            <span v-for="(src, idx) in workDesc.sources" :key="src.label" class="source-tag">
              <a v-if="src.url" :href="src.url" target="_blank" rel="noopener noreferrer">{{ src.label }}</a>
              <span v-else>{{ src.label }}</span>
              <span v-if="idx < workDesc.sources.length - 1" class="src-sep">·</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Reading Mode Tabs & Controls -->
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

        <div class="reading-actions-bar">
          <button
            class="recitation-chapter-btn"
            :class="{ 'is-playing': speechState.isPlaying && speechState.playlist.length > 0 }"
            :title="speechState.isPlaying && speechState.playlist.length > 0 ? '停止全章朗讀' : '由第一段起逐段連續朗讀本章'"
            @click="startChapterRecitation('canonical')"
          >
            <span v-if="speechState.isPlaying && speechState.playlist.length > 0">⏹ 停止朗讀</span>
            <span v-else>▶️ 逐段連續朗讀</span>
          </button>

          <button
            class="mode-btn"
            @click="appStore.toggleVertical()"
            :title="isVertical ? '切換為橫排' : '切換為直排'"
          >
            {{ isVertical ? '🔤 橫書' : '📜 直書' }}
          </button>
        </div>
      </div>
      <p class="dictionary-tip">提示：點擊任一漢字可查字義；點擊「🔊」可直接逐段播放語音誦讀（一段對應一段）。</p>

      <!-- Reading Content -->
      <div class="reading-content" :class="{ 'is-vertical-layout': isVertical }">
        <!-- Clean Mode -->
        <div v-if="readingMode === 'clean'" class="clean-mode">
          <div v-if="isVertical" class="vertical-container">
            <div class="vertical-text-flow">
              <div
                v-for="passage in passages"
                :key="passage.id"
                :id="'passage-' + passage.id"
                class="vertical-clean-block"
                :class="{ 'is-speaking-passage': isPassageActive(passage.id) }"
              >
                <button
                  type="button"
                  class="vertical-inline-audio-btn"
                  :class="{ 'is-playing': isPassageSpeaking(passage.id) }"
                  :title="isPassageSpeaking(passage.id) ? '暫停朗讀本段' : '朗讀本段原文'"
                  @click="playPassage(passage, 'canonical')"
                >
                  <span v-if="isPassageSpeaking(passage.id)">⏸</span>
                  <span v-else>🔊</span>
                </button>
                <p class="passage-text">
                  <ClassicalTextLookup :text="passage.canonicalText" :highlight="highlightQuery" />
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-body classical-text-lg">
            <div
              v-for="passage in passages"
              :key="passage.id"
              :id="'passage-' + passage.id"
              class="clean-passage-item"
              :class="{ 'is-speaking-passage': isPassageActive(passage.id) }"
            >
              <button
                type="button"
                class="passage-inline-audio-btn"
                :class="{ 'is-playing': isPassageSpeaking(passage.id) }"
                :title="isPassageSpeaking(passage.id) ? '暫停朗讀本段' : '朗讀本段原文'"
                :aria-label="`朗讀本段原文`"
                @click="playPassage(passage, 'canonical')"
              >
                <span v-if="isPassageSpeaking(passage.id)">⏸</span>
                <span v-else>🔊</span>
              </button>
              <p class="passage-text">
                <ClassicalTextLookup :text="passage.canonicalText" :highlight="highlightQuery" />
              </p>
            </div>
          </div>
          <div v-if="work.sourceNote" class="source-note">
            {{ work.sourceNote }}
          </div>
        </div>

        <!-- Assisted Mode -->
        <div v-if="readingMode === 'assisted'" class="assisted-mode">
          <div v-if="isVertical" class="vertical-container" style="height: 520px;">
            <div class="vertical-assisted-list">
              <div
                v-for="passage in passages"
                :key="passage.id"
                :id="'passage-' + passage.id"
                class="vertical-passage-box"
                :class="{ 'is-speaking-passage': isPassageActive(passage.id) }"
              >
                <div class="vertical-orig-wrapper">
                  <div class="vertical-audio-trigger">
                    <button
                      type="button"
                      class="vertical-audio-tag-btn"
                      :class="{ 'is-active': isPassageActive(passage.id, 'canonical') }"
                      :title="isPassageSpeaking(passage.id) ? '暫停朗讀本段' : '朗讀本段原文'"
                      @click="playPassage(passage, 'canonical')"
                    >
                      <span v-if="isPassageSpeaking(passage.id)">⏸</span>
                      <span v-else>🔊</span>
                    </button>
                  </div>
                  <p class="sentence-original classical-text-lg vertical-original-text"><ClassicalTextLookup :text="passage.canonicalText" :highlight="highlightQuery" /></p>
                </div>
                <div class="horizontal-explanation">
                  <div class="assisted-audio-quick-bar">
                    <button
                      type="button"
                      class="audio-mini-btn"
                      :class="{ 'is-active': isPassageActive(passage.id, 'canonical') }"
                      @click="playPassage(passage, 'canonical')"
                    >
                      🔊 原文
                    </button>
                    <button
                      v-if="passageAid(passage)?.translation"
                      type="button"
                      class="audio-mini-btn"
                      :class="{ 'is-active': isPassageActive(passage.id, 'vernacular') }"
                      @click="playPassage(passage, 'vernacular')"
                    >
                      🎧 白話
                    </button>
                  </div>
                  <p class="sentence-hint"><span class="translation-label">白話</span>{{ passageAid(passage)?.translation }}</p>
                  <p class="sentence-hint"><span class="translation-label">解析</span>{{ passageAid(passage)?.analysis }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              v-for="passage in passages"
              :key="passage.id"
              :id="'passage-' + passage.id"
              class="sentence-row"
              :class="{ 'is-speaking-passage': isPassageActive(passage.id) }"
            >
              <div class="passage-audio-header">
                <div class="passage-audio-btns">
                  <button
                    type="button"
                    class="passage-audio-btn"
                    :class="{ 'is-active': isPassageActive(passage.id, 'canonical') }"
                    :title="isPassageSpeaking(passage.id) && speechState.currentMode === 'canonical' ? '暫停朗讀' : '逐段朗讀原文'"
                    @click="playPassage(passage, 'canonical')"
                  >
                    <span v-if="isPassageSpeaking(passage.id) && speechState.currentMode === 'canonical'">⏸ 誦讀中</span>
                    <span v-else>🔊 朗讀原文</span>
                  </button>
                  <button
                    v-if="passageAid(passage)?.translation"
                    type="button"
                    class="passage-audio-btn vernacular-btn"
                    :class="{ 'is-active': isPassageActive(passage.id, 'vernacular') }"
                    :title="isPassageSpeaking(passage.id) && speechState.currentMode === 'vernacular' ? '暫停朗讀' : '逐段朗讀白話'"
                    @click="playPassage(passage, 'vernacular')"
                  >
                    <span v-if="isPassageSpeaking(passage.id) && speechState.currentMode === 'vernacular'">⏸ 播讀中</span>
                    <span v-else>🎧 朗讀白話</span>
                  </button>
                </div>
                <span v-if="isPassageActive(passage.id)" class="passage-playing-badge">
                  🎵 正在逐段播音
                </span>
              </div>

              <p class="sentence-original classical-text"><ClassicalTextLookup :text="passage.canonicalText" :highlight="highlightQuery" /></p>
              
              <p class="sentence-hint"><span class="translation-label">白話文</span>{{ passageAid(passage)?.translation }}</p>
              <p class="sentence-hint"><span class="translation-label">解析</span>{{ passageAid(passage)?.analysis }}</p>
            </div>
          </div>
          <div v-if="allSentences.length === 0" class="no-data">
            <p>尚無句級資料</p>
          </div>
          <p class="reading-aid-source">
            輔讀校讀參考：
            <span v-for="(source, key) in READING_AID_SOURCES" :key="key">{{ source.edition }}（{{ source.note }}）</span>
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

    <!-- Audio Player Floating Bar -->
    <AudioPlayerBar />
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

.chapter-subtitle {
  margin-top: var(--sp-2);
  color: var(--c-text-muted);
  font-size: var(--fs-base);
}

.lost-chapter-notice {
  margin-bottom: var(--sp-8);
  padding: var(--sp-5);
  border-left: 3px solid var(--c-gold);
}

.lost-chapter-notice p {
  margin: var(--sp-2) 0 0;
  color: var(--c-text-muted);
  line-height: 1.8;
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

.dictionary-tip {
  margin: calc(-1 * var(--sp-3)) 0 var(--sp-5);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
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

.sentence-calibrated-aid {
  margin-top: var(--sp-4);
  padding-top: var(--sp-4);
  border-top: 1px dashed var(--c-border-subtle);
}

.sentence-calibrated-aid:first-child {
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.sentence-calibrated-aid .sentence-hint {
  margin-bottom: var(--sp-2);
}

.sentence-calibrated-aid .sentence-hint:last-child {
  margin-bottom: 0;
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
  font-size: 0.6875rem;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
  padding: 1px 4px;
  border-radius: 3px;
  margin-right: 6px;
  display: inline-block;
}

/* ── Work Guide Card ── */
.work-guide-card {
  margin-bottom: var(--sp-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-accent);
  overflow: hidden;
  background: var(--c-bg-card);
  transition: all var(--transition-base);
}

.work-guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-4) var(--sp-5);
  cursor: pointer;
  background: rgba(212, 175, 55, 0.05);
}

.work-guide-title {
  font-weight: 600;
  font-size: var(--fs-md);
  color: var(--c-gold);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.guide-toggle-btn {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.work-guide-body {
  padding: var(--sp-5);
  border-top: 1px solid var(--c-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-3);
  background: rgba(0, 0, 0, 0.15);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
}

.guide-item {
  font-size: var(--fs-sm);
}

.guide-label {
  font-weight: 600;
  color: var(--c-gold);
  font-size: var(--fs-sm);
}

.guide-val {
  color: var(--c-text-primary);
}

.guide-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.guide-text {
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--c-text-secondary);
  margin: 0;
}

.guide-allusions {
  margin: 0;
  padding-left: var(--sp-5);
  font-size: var(--fs-sm);
  line-height: 1.7;
  color: var(--c-text-secondary);
}

.guide-sources {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  border-top: 1px dashed var(--c-border-subtle);
  padding-top: var(--sp-3);
}

.source-tag a {
  color: var(--c-gold);
  text-decoration: underline;
}

.src-sep {
  margin: 0 var(--sp-2);
}

:deep(.search-highlight-mark) {
  background: rgba(201, 169, 110, 0.45);
  color: #fff;
  padding: 0 4px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.6);
  animation: search-mark-pulse 2s ease-in-out infinite;
}

@keyframes search-mark-pulse {
  0%, 100% {
    background: rgba(201, 169, 110, 0.45);
    box-shadow: 0 0 10px rgba(201, 169, 110, 0.5);
  }
  50% {
    background: rgba(230, 190, 120, 0.85);
    box-shadow: 0 0 20px rgba(230, 190, 120, 0.9);
  }
}

/* ── Reading Actions & Recitation Bar ── */
.reading-actions-bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.recitation-chapter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1.5);
  padding: var(--sp-1.5) var(--sp-3.5);
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid var(--c-gold);
  border-radius: var(--radius-full);
  color: var(--c-gold-light);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.recitation-chapter-btn:hover {
  background: var(--c-gold);
  color: #12141a;
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.35);
}

.recitation-chapter-btn.is-playing {
  background: var(--c-gold);
  color: #12141a;
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(201, 169, 110, 0.4); }
  50% { box-shadow: 0 0 20px rgba(201, 169, 110, 0.8); }
}

/* ── Clean Mode Audio Enhancements ── */
.clean-passage-item {
  position: relative;
  margin-bottom: var(--sp-6);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--ease-out);
}

.clean-passage-item:last-child {
  margin-bottom: 0;
}

.clean-passage-item .passage-text {
  margin-bottom: 0;
}

.passage-inline-audio-btn {
  position: absolute;
  left: -2.2rem;
  top: 0.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-border-subtle);
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  cursor: pointer;
  opacity: 0.55;
  transition: all var(--duration-fast);
}

.clean-passage-item:hover .passage-inline-audio-btn,
.passage-inline-audio-btn.is-playing,
.passage-inline-audio-btn:hover {
  opacity: 1;
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.2);
  border-color: var(--c-gold);
  transform: scale(1.1);
}

/* ── Speaking Passage Highlight ── */
.is-speaking-passage {
  border-color: var(--c-gold) !important;
  background: rgba(201, 169, 110, 0.06) !important;
  box-shadow: 0 0 16px rgba(201, 169, 110, 0.2);
}

/* ── Assisted Mode Audio Headers ── */
.passage-audio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-2);
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed rgba(201, 169, 110, 0.15);
}

.passage-audio-btns {
  display: flex;
  gap: var(--sp-2);
}

.passage-audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-accent);
  background: rgba(0, 0, 0, 0.2);
  color: var(--c-gold-light);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.passage-audio-btn:hover {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.passage-audio-btn.is-active {
  background: var(--c-gold);
  color: #12141a;
  font-weight: var(--fw-semibold);
  border-color: var(--c-gold);
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.4);
}

.vernacular-btn {
  color: var(--c-text-secondary);
  border-color: var(--c-border-subtle);
}

.vernacular-btn:hover {
  color: var(--c-text-primary);
  border-color: var(--c-border-accent);
}

.passage-playing-badge {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  font-family: var(--font-sans);
  animation: pulse-opacity 1.5s infinite;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* ── Vertical Audio Integration ── */
.vertical-clean-block {
  position: relative;
  padding-bottom: var(--sp-4);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast);
}

.vertical-inline-audio-btn {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: rgba(0, 0, 0, 0.4);
  color: var(--c-gold);
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0.7;
}

.vertical-inline-audio-btn:hover, .vertical-inline-audio-btn.is-playing {
  opacity: 1;
  background: var(--c-gold);
  color: #12141a;
}

.vertical-audio-trigger {
  writing-mode: horizontal-tb;
  margin-bottom: var(--sp-2);
}

.vertical-audio-tag-btn {
  border: 1px solid var(--c-border-accent);
  background: rgba(0, 0, 0, 0.3);
  color: var(--c-gold);
  border-radius: var(--radius-full);
  padding: 2px 8px;
  font-size: 0.75rem;
  cursor: pointer;
}

.vertical-audio-tag-btn.is-active, .vertical-audio-tag-btn:hover {
  background: var(--c-gold);
  color: #12141a;
}

.assisted-audio-quick-bar {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed var(--c-border-subtle);
}

.audio-mini-btn {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-accent);
  background: rgba(0, 0, 0, 0.2);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  cursor: pointer;
}

.audio-mini-btn:hover, .audio-mini-btn.is-active {
  background: var(--c-gold);
  color: #12141a;
}
</style>
