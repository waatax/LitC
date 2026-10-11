<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { KnowledgePoint } from '@/data/knowledgeGraph'
import { getRelatedPoints, KNOWLEDGE_CATEGORIES } from '@/data/knowledgeGraph'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import { speechService, type SpeechMode } from '@/services/speech'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import SchoolBadge from '@/components/SchoolBadge.vue'
import RedSeal from '@/components/RedSeal.vue'

const props = withDefaults(
  defineProps<{
    point: KnowledgePoint | null
    isOpen?: boolean
    modelValue?: boolean
  }>(),
  {
    isOpen: undefined,
    modelValue: false,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:modelValue', value: boolean): void
  (e: 'selectPoint', point: KnowledgePoint): void
}>()

const router = useRouter()
const store = useKnowledgeCollectionStore()

const userNote = ref('')
const isNoteSaving = ref(false)
const saveNoteStatus = ref('')
const isCopied = ref(false)

const isModalVisible = computed(() => {
  if (props.isOpen !== undefined) {
    return props.isOpen
  }
  return props.modelValue
})

function closeModal() {
  emit('close')
  emit('update:modelValue', false)
}

const categoryMeta = computed(() => {
  if (!props.point) return null
  return KNOWLEDGE_CATEGORIES.find(c => c.id === props.point?.category)
})

const relatedPoints = computed(() => {
  if (!props.point) return []
  return getRelatedPoints(props.point)
})

const isCollected = computed(() => {
  if (!props.point) return false
  return store.isCollected(props.point.id)
})

const isMastered = computed(() => {
  if (!props.point) return false
  return store.isMastered(props.point.id)
})

const isQuoteSpeaking = computed(() => {
  if (!props.point) return false
  const curId = speechService.state.currentPassageId
  return (
    (curId === props.point.quoteSource.chapterId || curId === props.point.id + '-guide') &&
    speechService.state.isPlaying &&
    !speechService.state.isPaused
  )
})

const isGuideSpeaking = computed(() => {
  if (!props.point) return false
  return (
    speechService.state.currentPassageId === props.point.id + '-guide' &&
    speechService.state.isPlaying &&
    !speechService.state.isPaused
  )
})

watch(
  () => props.point?.id,
  (newId) => {
    if (newId) {
      userNote.value = store.getNote(newId)
      saveNoteStatus.value = ''
    } else {
      userNote.value = ''
    }
  },
  { immediate: true }
)

let saveNoteTimer: ReturnType<typeof setTimeout> | null = null
function handleNoteInput() {
  if (!props.point) return
  if (saveNoteTimer) clearTimeout(saveNoteTimer)
  isNoteSaving.value = true
  saveNoteTimer = setTimeout(() => {
    if (props.point) {
      store.saveNote(props.point.id, userNote.value)
      isNoteSaving.value = false
      saveNoteStatus.value = '札記已保存'
      setTimeout(() => {
        saveNoteStatus.value = ''
      }, 2000)
    }
  }, 400)
}

function playQuoteSpeech(mode: SpeechMode = 'canonical') {
  if (!props.point) return
  if (isQuoteSpeaking.value && !isGuideSpeaking.value && speechService.state.currentMode === mode) {
    speechService.pause()
    return
  }
  const text = mode === 'canonical' ? props.point.famousQuote : props.point.summary
  speechService.speakPassage(
    props.point.quoteSource.chapterId,
    text,
    mode,
    {
      workTitle: props.point.quoteSource.workTitle,
      chapterTitle: props.point.title + ' · ' + props.point.quoteSource.chapterTitle,
      canonicalText: props.point.famousQuote,
      vernacularText: props.point.summary,
    }
  )
}

function playFullGuide() {
  if (!props.point) return
  if (isGuideSpeaking.value) {
    speechService.pause()
    return
  }
  const guideText = `經典名言：${props.point.famousQuote}。此典出自《${props.point.quoteSource.workTitle}》${props.point.quoteSource.chapterTitle}。核心義理：${props.point.summary}。現代啟發與實踐：${props.point.modernApplication}`
  speechService.speakPassage(
    props.point.id + '-guide',
    guideText,
    'vernacular',
    {
      workTitle: props.point.title,
      chapterTitle: '全篇有聲導聆',
      canonicalText: props.point.famousQuote,
      vernacularText: guideText,
    }
  )
}

async function copyQuoteCard() {
  if (!props.point) return
  const text = `「${props.point.famousQuote}」\n—— 《${props.point.quoteSource.workTitle}》· ${props.point.quoteSource.chapterTitle}\n\n【白話精解】${props.point.summary}\n【現代實踐】${props.point.modernApplication}\n\n—— 經典文脈 ClassicFlow 研習札記`
  try {
    await navigator.clipboard.writeText(text)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch {
    // clipboard fallback
  }
}

function handleToggleCollect() {
  if (!props.point) return
  store.toggleCollect(props.point.id)
}

function handleToggleMaster() {
  if (!props.point) return
  store.toggleMaster(props.point.id)
}

function goToSourceChapter() {
  if (!props.point) return
  closeModal()
  router.push(`/chapter/${props.point.quoteSource.chapterId}`)
}

function selectRelated(related: KnowledgePoint) {
  emit('selectPoint', related)
}

onUnmounted(() => {
  if (saveNoteTimer) clearTimeout(saveNoteTimer)
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isModalVisible && point"
      class="knowledge-modal-backdrop"
      @click.self="closeModal"
    >
      <div class="knowledge-modal-card glass-panel" role="dialog" aria-modal="true">
        <!-- 頂部頭部 -->
        <header class="modal-header">
          <div class="header-left">
            <RedSeal :text="categoryMeta?.sealText || '道'" :size="32" />
            <div class="title-group">
              <div class="category-meta-strip">
                <span class="category-tag" :style="{ color: categoryMeta?.color }">
                  <ClassicalIcon :name="categoryMeta?.icon || 'wenhai'" :size="12" />
                  <span>{{ categoryMeta?.name }}</span>
                </span>
                <span class="pinyin-label">{{ point.pinyin }}</span>
                <span class="period-badge">{{ point.historicalPeriod }}</span>
              </div>
              <h2 class="point-main-title font-serif">{{ point.title }}</h2>
            </div>
          </div>

          <div class="header-actions">
            <button
              class="action-icon-btn"
              :class="{ 'is-active': isCollected }"
              :title="isCollected ? '已收藏至文萃' : '收藏此知識點'"
              @click="handleToggleCollect"
            >
              <ClassicalIcon :name="isCollected ? 'star' : 'star'" :size="18" :color="isCollected ? 'var(--gold-400)' : 'var(--text-muted)'" />
            </button>
            <button
              class="action-icon-btn close-btn"
              title="關閉 (Esc)"
              @click="closeModal"
            >
              <ClassicalIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <!-- 標語副標 -->
        <div class="modal-tagline">
          <p class="tagline-text">{{ point.tagline }}</p>
        </div>

        <div class="modal-scroll-body">
          <!-- 經典出處引句錦囊 -->
          <section class="quote-banner">
            <div class="quote-header">
              <span class="quote-label font-serif">【傳世原文】</span>
              <div class="quote-header-tools">
                <button
                  class="quote-tool-mini-btn"
                  :class="{ 'is-active': isQuoteSpeaking && !isGuideSpeaking && speechService.state.currentMode === 'canonical' }"
                  :title="isQuoteSpeaking && !isGuideSpeaking && speechService.state.currentMode === 'canonical' ? '暫停朗讀' : '聆聽古韻正音朗讀'"
                  @click="playQuoteSpeech('canonical')"
                >
                  <ClassicalIcon :name="isQuoteSpeaking && !isGuideSpeaking && speechService.state.currentMode === 'canonical' ? 'pause' : 'volume'" :size="14" />
                  <span>原文誦讀</span>
                </button>
                <button
                  class="quote-tool-mini-btn"
                  :class="{ 'is-active': isQuoteSpeaking && !isGuideSpeaking && speechService.state.currentMode === 'vernacular' }"
                  title="聆聽白話核心精解"
                  @click="playQuoteSpeech('vernacular')"
                >
                  <ClassicalIcon :name="isQuoteSpeaking && !isGuideSpeaking && speechService.state.currentMode === 'vernacular' ? 'pause' : 'headphones'" :size="14" />
                  <span>白話精析</span>
                </button>
                <button
                  class="quote-tool-mini-btn guide-audio-btn"
                  :class="{ 'is-active': isGuideSpeaking }"
                  title="聆聽全篇名句、釋義與現代啟發導聆"
                  @click="playFullGuide"
                >
                  <ClassicalIcon :name="isGuideSpeaking ? 'pause' : 'audio-playing'" :size="14" />
                  <span>🎧 全篇導聆</span>
                </button>
                <button
                  class="quote-tool-mini-btn"
                  :title="isCopied ? '已複製' : '抄錄金句'"
                  @click="copyQuoteCard"
                >
                  <ClassicalIcon :name="isCopied ? 'check' : 'copy'" :size="13" :color="isCopied ? '#5b8a72' : undefined" />
                  <span>{{ isCopied ? '已抄錄' : '抄錄' }}</span>
                </button>
                <SchoolBadge :school-id="point.schoolId" size="sm" />
              </div>
            </div>
            <p class="quote-text font-serif">「{{ point.famousQuote }}」</p>
            <div class="quote-meta-row">
              <span class="source-chapter-name">—— 《{{ point.quoteSource.workTitle }}》· {{ point.quoteSource.chapterTitle }}</span>
              <button class="btn btn-ghost btn-sm source-link-btn" @click="goToSourceChapter">
                <ClassicalIcon name="book-open" :size="13" />
                <span>研讀本章</span>
              </button>
            </div>
          </section>

          <!-- 通俗精要 -->
          <section class="section-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="lantern" :size="15" />
              <span>核心釋義</span>
            </h3>
            <p class="section-content">{{ point.summary }}</p>
          </section>

          <!-- 深度思想源流 -->
          <section class="section-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="scroll" :size="15" />
              <span>文脈源流與哲學深思</span>
            </h3>
            <p class="section-content">{{ point.deepAnalysis }}</p>
          </section>

          <!-- 三大精微領悟 -->
          <section class="section-block insights-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="sparkle" :size="15" />
              <span>三大核心心法</span>
            </h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in point.keyInsights" :key="idx" class="insight-item">
                <span class="insight-bullet">
                  <ClassicalIcon name="check" :size="13" color="var(--gold-400)" />
                </span>
                <span>{{ insight }}</span>
              </li>
            </ul>
          </section>

          <!-- 現代生活與職場啟示（高黏著度核心） -->
          <section class="section-block modern-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="compass" :size="15" />
              <span>現代生活與處世實踐</span>
            </h3>
            <div class="modern-card">
              <p class="section-content">{{ point.modernApplication }}</p>
            </div>
          </section>

          <!-- 深化思辨策問 -->
          <section class="section-block reflection-block">
            <div class="reflection-box">
              <span class="reflection-label font-serif">【晨昏省思 ‧ 探問本心】</span>
              <p class="reflection-question">{{ point.reflectionQuestion }}</p>
            </div>
          </section>

          <!-- 個人研讀札記 ‧ 修持心得 -->
          <section class="section-block note-block">
            <div class="note-header">
              <h3 class="section-title font-serif">
                <ClassicalIcon name="brush" :size="15" />
                <span>研讀札記 ‧ 修持心得</span>
              </h3>
              <span v-if="saveNoteStatus" class="save-status-badge font-serif">
                <ClassicalIcon name="check" :size="11" />
                <span>{{ saveNoteStatus }}</span>
              </span>
            </div>
            <div class="note-input-container">
              <textarea
                v-model="userNote"
                class="note-textarea font-serif"
                placeholder="在此記下你的體悟、生活反思或行動計劃（自動儲存於本地）…"
                rows="3"
                @input="handleNoteInput"
              ></textarea>
              <div class="note-footer-hint">
                <span>💡 札記將保存在修行履歷中，隨時回訪溫故知新</span>
                <span class="note-char-count font-serif">{{ userNote.length }} 字</span>
              </div>
            </div>
          </section>

          <!-- 跨學派觀點交鋒（若有） -->
          <section v-if="point.crossSchoolComparison" class="section-block contrast-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="scale" :size="15" />
              <span>諸子交鋒：對照{{ point.crossSchoolComparison.targetSchool }}</span>
            </h3>
            <p class="section-content">{{ point.crossSchoolComparison.contrastIdea }}</p>
          </section>

          <!-- 關聯知識點網絡（維基式流暢漫遊） -->
          <section v-if="relatedPoints.length > 0" class="section-block related-block">
            <h3 class="section-title font-serif">
              <ClassicalIcon name="wenhai" :size="15" />
              <span>關聯文脈網漫遊</span>
            </h3>
            <div class="related-tags">
              <button
                v-for="rel in relatedPoints"
                :key="rel.id"
                class="related-tag-btn"
                @click="selectRelated(rel)"
              >
                <span>{{ rel.title }}</span>
                <span class="tag-arrow">→</span>
              </button>
            </div>
          </section>
        </div>

        <!-- 底部功能列 -->
        <footer class="modal-footer">
          <button
            class="btn btn-outline master-btn"
            :class="{ 'is-mastered': isMastered }"
            @click="handleToggleMaster"
          >
            <ClassicalIcon :name="isMastered ? 'check' : 'target'" :size="15" />
            <span>{{ isMastered ? '已深刻領會' : '標記為已掌握' }}</span>
          </button>
          <button class="btn btn-primary read-cta-btn" @click="goToSourceChapter">
            <ClassicalIcon name="book-open" :size="15" />
            <span>前往出處章節全文研讀</span>
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.knowledge-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(8, 8, 12, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  animation: fadeIn 0.2s ease-out;
}

.knowledge-modal-card {
  width: 100%;
  max-width: 680px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg-card, #141210);
  border: 1px solid var(--c-border-accent, #c9a96e);
  border-radius: var(--radius-xl, 16px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-5) var(--sp-6) var(--sp-4);
  border-bottom: 1px solid var(--c-border, rgba(201, 169, 110, 0.15));
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-meta-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-xs, 0.75rem);
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.pinyin-label {
  color: var(--c-text-muted);
  font-style: italic;
}

.period-badge {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
}

.point-main-title {
  margin: 0;
  font-size: 1.45rem;
  color: var(--c-text-primary, #f5ecd8);
  letter-spacing: 0.04em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-icon-btn {
  background: transparent;
  border: 1px solid var(--c-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-full, 9999px);
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.action-icon-btn:hover {
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.15));
  border-color: var(--c-border-accent);
  color: var(--c-gold);
}

.modal-tagline {
  padding: var(--sp-3) var(--sp-6);
  background: rgba(201, 169, 110, 0.06);
  border-bottom: 1px solid var(--c-border, rgba(201, 169, 110, 0.12));
}

.tagline-text {
  margin: 0;
  font-size: var(--fs-sm, 0.875rem);
  color: var(--c-gold, #c9a96e);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.modal-scroll-body {
  padding: var(--sp-5) var(--sp-6);
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.quote-banner {
  padding: var(--sp-4) var(--sp-5);
  background: radial-gradient(circle at 10% 20%, rgba(201, 169, 110, 0.12), transparent 45%), rgba(0, 0, 0, 0.25);
  border: 1px solid var(--c-border-accent, #c9a96e);
  border-radius: var(--radius-lg, 12px);
}

.quote-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}

.quote-header-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quote-tool-mini-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle, rgba(201, 169, 110, 0.2));
  background: rgba(255, 255, 255, 0.03);
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.quote-tool-mini-btn:hover {
  background: rgba(201, 169, 110, 0.1);
  color: var(--c-gold);
  border-color: var(--c-border-accent);
}

.quote-tool-mini-btn.is-active {
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.quote-tool-mini-btn.guide-audio-btn {
  background: rgba(201, 169, 110, 0.12);
  color: var(--c-gold-light);
  border-color: var(--c-gold-glow);
}

.quote-tool-mini-btn.guide-audio-btn:hover {
  background: rgba(201, 169, 110, 0.22);
}

.quote-tool-mini-btn.guide-audio-btn.is-active {
  background: linear-gradient(135deg, var(--c-gold-deep), var(--c-gold));
  color: #fff;
  border-color: var(--c-gold);
}

.quote-label {
  font-size: var(--fs-xs, 0.75rem);
  color: var(--c-gold);
  letter-spacing: 0.1em;
}

.quote-text {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--c-text-primary, #f5ecd8);
  margin: var(--sp-2) 0;
  letter-spacing: 0.03em;
}

.quote-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.source-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-xs);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold);
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.section-title {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-base, 1rem);
  color: var(--c-gold, #c9a96e);
  margin: 0;
  letter-spacing: 0.05em;
}

.section-content {
  margin: 0;
  font-size: var(--fs-sm, 0.9rem);
  color: var(--c-text-secondary, #b8b2a7);
  line-height: var(--lh-relaxed, 1.75);
}

.insights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--fs-sm, 0.9rem);
  color: var(--c-text-secondary);
  line-height: 1.6;
}

.insight-bullet {
  flex-shrink: 0;
  margin-top: 2px;
}

.modern-card {
  padding: var(--sp-4);
  background: rgba(91, 138, 114, 0.08);
  border-left: 3px solid var(--c-accent-dao, #5b8a72);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.reflection-box {
  padding: var(--sp-4);
  background: rgba(201, 169, 110, 0.08);
  border: 1px dashed var(--c-border-accent);
  border-radius: var(--radius-md);
}

.reflection-label {
  display: block;
  font-size: var(--fs-xs, 0.75rem);
  color: var(--c-gold);
  margin-bottom: 6px;
  letter-spacing: 0.08em;
}

.reflection-question {
  margin: 0;
  font-size: var(--fs-sm, 0.92rem);
  color: var(--c-text-primary);
  line-height: 1.6;
  font-weight: 500;
}

/* 筆記區塊 */
.note-block {
  padding-top: var(--sp-2);
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.save-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #5b8a72;
  background: rgba(91, 138, 114, 0.12);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.note-input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note-textarea {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--c-border-subtle, rgba(201, 169, 110, 0.2));
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--c-gold);
  background: rgba(0, 0, 0, 0.35);
}

.note-footer-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.contrast-block {
  padding: var(--sp-4);
  background: rgba(166, 75, 75, 0.08);
  border-left: 3px solid var(--c-accent-military, #a64b4b);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.related-tag-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-full);
  color: var(--c-text-secondary);
  font-size: var(--fs-xs, 0.8rem);
  cursor: pointer;
  transition: all 0.18s ease;
}

.related-tag-btn:hover {
  background: var(--c-gold-glow);
  color: var(--c-gold-light);
  transform: translateX(2px);
}

.tag-arrow {
  color: var(--c-gold);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-6);
  border-top: 1px solid var(--c-border, rgba(201, 169, 110, 0.15));
  background: rgba(0, 0, 0, 0.2);
}

.master-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  padding: 8px 16px;
}

.master-btn.is-mastered {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.12);
}

.read-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-sm);
  padding: 8px 20px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 640px) {
  .knowledge-modal-card {
    max-height: 94vh;
    border-radius: var(--radius-lg);
  }
  .modal-header,
  .modal-scroll-body,
  .modal-footer {
    padding-left: var(--sp-4);
    padding-right: var(--sp-4);
  }
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .master-btn,
  .read-cta-btn {
    justify-content: center;
    width: 100%;
  }
}
</style>
