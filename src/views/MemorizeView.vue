<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Sentence, HintLevel, ReviewRating } from '@/types/content'
import { HINT_LEVELS } from '@/types/content'
import { getChapter, getWorks, getAllSentencesByChapter } from '@/data'
import { getCardState, saveCardState, logReview } from '@/data/db'
import { scheduleReview } from '@/utils/scheduler'
import SentenceCard from '@/components/SentenceCard.vue'
import HintLadder from '@/components/HintLadder.vue'
import ProgressRing from '@/components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()

const chapter = ref<Chapter | null>(null)
const work = ref<Work | null>(null)
const sentences = ref<Sentence[]>([])
const mounted = ref(false)

// Session state
const currentIndex = ref(0)
const hintLevel = ref<HintLevel>('full')
const showChunks = ref(false)
const showTypingArea = ref(false)
const typedText = ref('')
const showDiff = ref(false)
const isComplete = ref(false)

// Track ratings per sentence
const ratings = ref<Map<string, ReviewRating>>(new Map())

function loadChapter() {
  const chapterId = route.params.id as string
  if (!chapterId) return

  chapter.value = getChapter(chapterId) ?? null
  if (!chapter.value) return

  const allWorks = getWorks()
  work.value = allWorks.find(w => w.id === chapter.value!.workId) ?? null

  sentences.value = getAllSentencesByChapter(chapterId)
}

onMounted(() => {
  loadChapter()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(() => route.params.id, () => {
  loadChapter()
  resetSession()
})

const currentSentence = computed(() => {
  if (sentences.value.length === 0) return null
  return sentences.value[currentIndex.value] ?? null
})

const totalSentences = computed(() => sentences.value.length)

const progressPercent = computed(() => {
  if (totalSentences.value === 0) return 0
  return Math.round((ratings.value.size / totalSentences.value) * 100)
})

const isBlankLevel = computed(() => hintLevel.value === 'blank')

// Auto-show typing area when hint level is 'blank'
watch(hintLevel, (newLevel) => {
  if (newLevel === 'blank') {
    showTypingArea.value = true
  } else {
    showTypingArea.value = false
    showDiff.value = false
    typedText.value = ''
  }
})

// Character diff
interface DiffChar {
  char: string
  type: 'correct' | 'incorrect' | 'missing' | 'extra'
}

const diffResult = computed<DiffChar[]>(() => {
  if (!currentSentence.value || !showDiff.value) return []
  const canonical = currentSentence.value.canonicalText
  const typed = typedText.value
  const result: DiffChar[] = []
  const maxLen = Math.max(canonical.length, typed.length)

  for (let i = 0; i < maxLen; i++) {
    if (i < typed.length && i < canonical.length) {
      if (typed[i] === canonical[i]) {
        result.push({ char: typed[i], type: 'correct' })
      } else {
        result.push({ char: typed[i], type: 'incorrect' })
      }
    } else if (i >= typed.length) {
      result.push({ char: canonical[i], type: 'missing' })
    } else {
      result.push({ char: typed[i], type: 'extra' })
    }
  }
  return result
})

const diffAccuracy = computed(() => {
  if (diffResult.value.length === 0) return 0
  const correct = diffResult.value.filter(d => d.type === 'correct').length
  const canonical = currentSentence.value?.canonicalText.length ?? 0
  if (canonical === 0) return 100
  return Math.round((correct / canonical) * 100)
})

function checkTyping() {
  showDiff.value = true
}

function resetTyping() {
  typedText.value = ''
  showDiff.value = false
}

async function rateSentence(rating: ReviewRating) {
  if (!currentSentence.value) return
  const sentenceId = currentSentence.value.id
  ratings.value.set(sentenceId, rating)

  // Load current card state
  const currentState = await getCardState(sentenceId)

  // Map hint levels to rough hintsUsed count
  let hintsUsed = 0
  if (hintLevel.value === 'keyword-mask') hintsUsed = 1
  if (hintLevel.value === 'first-char') hintsUsed = 2
  if (hintLevel.value === 'meaning-only') hintsUsed = 3
  if (hintLevel.value === 'blank') hintsUsed = 4

  // Run spaced repetition scheduler
  const { cardState } = scheduleReview(
    {
      cardId: sentenceId,
      reviewedAt: new Date().toISOString(),
      rating,
      answerMode: showTypingArea.value ? 'typing' : 'recall',
      hintsUsed
    },
    currentState
  )

  // Save progress
  await saveCardState(cardState)
  await logReview({
    cardId: sentenceId,
    reviewedAt: new Date().toISOString(),
    rating,
    answerMode: showTypingArea.value ? 'typing' : 'recall',
    hintsUsed
  })

  // Move to next sentence or complete
  if (currentIndex.value < totalSentences.value - 1) {
    goToSentence(currentIndex.value + 1)
  } else {
    isComplete.value = true
  }
}

function goToSentence(index: number) {
  if (index < 0 || index >= totalSentences.value) return
  currentIndex.value = index
  hintLevel.value = 'full'
  showChunks.value = false
  typedText.value = ''
  showDiff.value = false
  showTypingArea.value = false
}

function goNext() {
  if (currentIndex.value < totalSentences.value - 1) {
    goToSentence(currentIndex.value + 1)
  }
}

function goPrev() {
  if (currentIndex.value > 0) {
    goToSentence(currentIndex.value - 1)
  }
}

function resetSession() {
  currentIndex.value = 0
  hintLevel.value = 'full'
  showChunks.value = false
  typedText.value = ''
  showDiff.value = false
  showTypingArea.value = false
  isComplete.value = false
  ratings.value = new Map()
}

function goBack() {
  if (chapter.value) {
    router.push(`/chapter/${chapter.value.id}`)
  } else {
    router.push('/library')
  }
}

interface RatingButton {
  rating: ReviewRating
  label: string
  icon: string
  className: string
}

const ratingButtons: RatingButton[] = [
  { rating: 'again', label: '再來', icon: '🔄', className: 'rating-again' },
  { rating: 'hard', label: '困難', icon: '😰', className: 'rating-hard' },
  { rating: 'good', label: '良好', icon: '👍', className: 'rating-good' },
  { rating: 'easy', label: '簡單', icon: '✨', className: 'rating-easy' },
]

// Summary stats
const summaryStats = computed(() => {
  const counts = { again: 0, hard: 0, good: 0, easy: 0 }
  for (const rating of ratings.value.values()) {
    counts[rating]++
  }
  return counts
})
</script>

<template>
  <div class="memorize-view" :class="{ 'is-mounted': mounted }">
    <!-- Top Bar -->
    <div class="mem-top-bar">
      <button class="btn btn-ghost btn-sm" @click="goBack">
        ← 返回
      </button>
      <div class="top-bar-center" v-if="chapter && !isComplete">
        <span class="top-bar-title">{{ chapter.title }}</span>
        <span class="top-bar-counter">{{ currentIndex + 1 }} / {{ totalSentences }}</span>
      </div>
      <div class="top-bar-right">
        <ProgressRing :value="progressPercent" :size="40" :stroke-width="3" />
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!isComplete && currentSentence">
      <!-- Hint Ladder -->
      <section class="hint-section">
        <HintLadder v-model="hintLevel" />
      </section>

      <!-- Sentence Card -->
      <section class="sentence-section">
        <Transition name="sentence" mode="out-in">
          <div :key="currentSentence.id" class="sentence-wrapper">
            <SentenceCard
              :sentence="currentSentence"
              :hint-level="hintLevel"
              :show-chunks="showChunks"
            />
          </div>
        </Transition>
      </section>

      <!-- Chunk Toggle -->
      <div class="controls-bar">
        <button
          class="btn btn-ghost chunk-toggle"
          :class="{ 'is-on': showChunks }"
          @click="showChunks = !showChunks"
        >
          <span>{{ showChunks ? '🔲' : '⬜' }}</span>
          <span>語塊{{ showChunks ? '已顯示' : '已隱藏' }}</span>
        </button>
      </div>

      <!-- Typing Area (at blank level) -->
      <Transition name="slide-up">
        <section v-if="showTypingArea" class="typing-section">
          <div class="typing-header">
            <span class="typing-icon">📝</span>
            <span class="typing-title">默寫區</span>
          </div>
          <textarea
            v-model="typedText"
            class="typing-input"
            :placeholder="'在此默寫此句……'"
            rows="3"
            @keydown.ctrl.enter="checkTyping"
          ></textarea>
          <div class="typing-actions">
            <button class="btn btn-ghost" @click="resetTyping">
              清除
            </button>
            <button class="btn btn-primary" @click="checkTyping" :disabled="typedText.trim().length === 0">
              核對 (Ctrl+Enter)
            </button>
          </div>

          <!-- Diff Result -->
          <Transition name="fade">
            <div v-if="showDiff" class="diff-result">
              <div class="diff-header">
                <span class="diff-accuracy" :class="{
                  'acc-high': diffAccuracy >= 80,
                  'acc-mid': diffAccuracy >= 50 && diffAccuracy < 80,
                  'acc-low': diffAccuracy < 50,
                }">
                  正確率 {{ diffAccuracy }}%
                </span>
              </div>
              <div class="diff-chars classical-text">
                <span
                  v-for="(ch, i) in diffResult"
                  :key="i"
                  class="diff-char"
                  :class="{
                    'char-correct': ch.type === 'correct',
                    'char-incorrect': ch.type === 'incorrect',
                    'char-missing': ch.type === 'missing',
                    'char-extra': ch.type === 'extra',
                  }"
                >{{ ch.char }}</span>
              </div>
              <div class="diff-legend">
                <span class="legend-item"><span class="legend-dot char-correct">●</span> 正確</span>
                <span class="legend-item"><span class="legend-dot char-incorrect">●</span> 錯誤</span>
                <span class="legend-item"><span class="legend-dot char-missing">●</span> 遺漏</span>
              </div>
            </div>
          </Transition>
        </section>
      </Transition>

      <!-- Self-Assessment Buttons -->
      <section class="rating-section">
        <p class="rating-prompt">你覺得這句的掌握程度如何？</p>
        <div class="rating-buttons">
          <button
            v-for="rb in ratingButtons"
            :key="rb.rating"
            class="btn rating-btn"
            :class="rb.className"
            @click="rateSentence(rb.rating)"
          >
            <span class="rating-icon">{{ rb.icon }}</span>
            <span class="rating-label">{{ rb.label }}</span>
          </button>
        </div>
      </section>

      <!-- Sentence Navigation -->
      <div class="sentence-nav">
        <button class="btn btn-ghost btn-sm" :disabled="currentIndex === 0" @click="goPrev">
          ← 上一句
        </button>
        <div class="nav-dots">
          <span
            v-for="(s, si) in sentences"
            :key="s.id"
            class="nav-dot"
            :class="{
              'is-current': si === currentIndex,
              'is-rated': ratings.has(s.id),
            }"
            @click="goToSentence(si)"
          ></span>
        </div>
        <button
          class="btn btn-ghost btn-sm"
          :disabled="currentIndex >= totalSentences - 1"
          @click="goNext"
        >
          下一句 →
        </button>
      </div>
    </template>

    <!-- Summary Screen -->
    <template v-else-if="isComplete">
      <div class="summary-screen">
        <div class="summary-header">
          <span class="summary-icon">🎉</span>
          <h2 class="summary-title">背誦完成！</h2>
          <p class="summary-subtitle" v-if="chapter">{{ chapter.title }} — 全 {{ totalSentences }} 句</p>
        </div>

        <div class="summary-ring">
          <ProgressRing :value="progressPercent" :size="120" :stroke-width="6" />
        </div>

        <div class="summary-stats">
          <div class="summary-stat rating-easy-bg">
            <span class="summary-stat-icon">✨</span>
            <span class="summary-stat-value">{{ summaryStats.easy }}</span>
            <span class="summary-stat-label">簡單</span>
          </div>
          <div class="summary-stat rating-good-bg">
            <span class="summary-stat-icon">👍</span>
            <span class="summary-stat-value">{{ summaryStats.good }}</span>
            <span class="summary-stat-label">良好</span>
          </div>
          <div class="summary-stat rating-hard-bg">
            <span class="summary-stat-icon">😰</span>
            <span class="summary-stat-value">{{ summaryStats.hard }}</span>
            <span class="summary-stat-label">困難</span>
          </div>
          <div class="summary-stat rating-again-bg">
            <span class="summary-stat-icon">🔄</span>
            <span class="summary-stat-value">{{ summaryStats.again }}</span>
            <span class="summary-stat-label">再來</span>
          </div>
        </div>

        <div class="summary-actions">
          <button class="btn btn-primary" @click="resetSession">
            🔄 再背一次
          </button>
          <button class="btn btn-ghost" @click="goBack">
            返回章節
          </button>
        </div>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else-if="mounted && sentences.length === 0" class="not-found">
      <h2>此章節尚無句子資料</h2>
      <button class="btn btn-ghost" @click="goBack">返回</button>
    </div>
  </div>
</template>

<style scoped>
.memorize-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
}

.memorize-view.is-mounted {
  opacity: 1;
}

/* ── Top Bar ── */
.mem-top-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--sp-6);
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}

.btn-sm {
  padding: var(--sp-2) var(--sp-4);
  font-size: var(--fs-sm);
}

.top-bar-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-bar-title {
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  color: var(--c-text-secondary);
}

.top-bar-counter {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.top-bar-right {
  flex-shrink: 0;
}

/* ── Hint Section ── */
.hint-section {
  margin-bottom: var(--sp-6);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 100ms both;
}

/* ── Sentence Section ── */
.sentence-section {
  margin-bottom: var(--sp-4);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 200ms both;
}

.sentence-wrapper {
  transition: all var(--duration-normal) var(--ease-out);
}

/* Sentence transition */
.sentence-enter-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.sentence-leave-active {
  transition: all var(--duration-fast) ease-in;
}
.sentence-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.sentence-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

/* ── Controls Bar ── */
.controls-bar {
  display: flex;
  justify-content: center;
  margin-bottom: var(--sp-6);
}

.chunk-toggle {
  font-size: var(--fs-sm);
}

.chunk-toggle.is-on {
  background: var(--c-gold-glow);
  border-color: var(--c-border-accent);
  color: var(--c-gold);
}

/* ── Typing Section ── */
.typing-section {
  margin-bottom: var(--sp-6);
  padding: var(--sp-5);
  background: var(--c-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-accent);
}

.typing-header {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.typing-icon {
  font-size: var(--fs-lg);
}

.typing-title {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--c-text-secondary);
}

.typing-input {
  width: 100%;
  padding: var(--sp-4);
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  line-height: var(--lh-loose);
  letter-spacing: 0.05em;
  color: var(--c-text-primary);
  background: var(--c-bg-secondary);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  resize: vertical;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.typing-input:focus {
  border-color: var(--c-gold);
  box-shadow: 0 0 0 3px var(--c-gold-glow);
}

.typing-input::placeholder {
  color: var(--c-text-muted);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
}

.typing-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

/* ── Diff ── */
.diff-result {
  margin-top: var(--sp-4);
  padding: var(--sp-4);
  background: var(--c-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
}

.diff-header {
  margin-bottom: var(--sp-3);
}

.diff-accuracy {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
}

.acc-high {
  background: rgba(74, 139, 110, 0.15);
  color: var(--c-success);
}

.acc-mid {
  background: rgba(184, 148, 68, 0.15);
  color: var(--c-warning);
}

.acc-low {
  background: rgba(139, 74, 74, 0.15);
  color: var(--c-danger);
}

.diff-chars {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: var(--sp-3);
}

.diff-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  height: 1.8em;
  border-radius: 4px;
  transition: all var(--duration-fast) var(--ease-out);
}

.diff-char.char-correct {
  color: var(--c-success);
  background: rgba(74, 139, 110, 0.08);
}

.diff-char.char-incorrect {
  color: var(--c-danger);
  background: rgba(139, 74, 74, 0.1);
  text-decoration: underline wavy;
}

.diff-char.char-missing {
  color: var(--c-text-muted);
  opacity: 0.5;
  background: rgba(107, 99, 88, 0.08);
  border: 1px dashed var(--c-text-muted);
}

.diff-char.char-extra {
  color: var(--c-warning);
  background: rgba(184, 148, 68, 0.08);
  text-decoration: line-through;
}

.diff-legend {
  display: flex;
  gap: var(--sp-4);
}

.legend-item {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.legend-dot {
  font-size: 0.5rem;
}

/* ── Rating Section ── */
.rating-section {
  margin-bottom: var(--sp-6);
  text-align: center;
}

.rating-prompt {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-4);
}

.rating-buttons {
  display: flex;
  justify-content: center;
  gap: var(--sp-3);
}

.rating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-3) var(--sp-5);
  min-width: 72px;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.rating-icon {
  font-size: var(--fs-xl);
}

.rating-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
}

.rating-again {
  background: rgba(139, 74, 74, 0.1);
  border: 1px solid rgba(139, 74, 74, 0.25);
  color: var(--c-danger);
}

.rating-again:hover {
  background: rgba(139, 74, 74, 0.2);
  border-color: rgba(139, 74, 74, 0.4);
  transform: translateY(-2px);
}

.rating-hard {
  background: rgba(184, 148, 68, 0.1);
  border: 1px solid rgba(184, 148, 68, 0.25);
  color: var(--c-warning);
}

.rating-hard:hover {
  background: rgba(184, 148, 68, 0.2);
  border-color: rgba(184, 148, 68, 0.4);
  transform: translateY(-2px);
}

.rating-good {
  background: rgba(74, 139, 110, 0.1);
  border: 1px solid rgba(74, 139, 110, 0.25);
  color: var(--c-success);
}

.rating-good:hover {
  background: rgba(74, 139, 110, 0.2);
  border-color: rgba(74, 139, 110, 0.4);
  transform: translateY(-2px);
}

.rating-easy {
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.25);
  color: var(--c-gold);
}

.rating-easy:hover {
  background: rgba(201, 169, 110, 0.2);
  border-color: rgba(201, 169, 110, 0.4);
  transform: translateY(-2px);
}

/* ── Sentence Nav ── */
.sentence-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border-subtle);
}

.sentence-nav .btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-dots {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 60%;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.nav-dot:hover {
  background: var(--c-text-muted);
  transform: scale(1.3);
}

.nav-dot.is-current {
  background: var(--c-gold);
  box-shadow: 0 0 6px rgba(201, 169, 110, 0.4);
  transform: scale(1.3);
}

.nav-dot.is-rated {
  background: var(--c-success);
}

.nav-dot.is-rated.is-current {
  background: var(--c-gold);
}

/* ── Slide-up transition ── */
.slide-up-enter-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.slide-up-leave-active {
  transition: all var(--duration-fast) ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ── Fade transition ── */
.fade-enter-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}
.fade-leave-active {
  transition: opacity var(--duration-fast) ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Summary Screen ── */
.summary-screen {
  text-align: center;
  padding: var(--sp-10) 0;
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

.summary-header {
  margin-bottom: var(--sp-8);
}

.summary-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: var(--sp-4);
}

.summary-title {
  font-family: var(--font-serif);
  font-size: var(--fs-4xl);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--sp-2);
}

.summary-subtitle {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.summary-ring {
  display: flex;
  justify-content: center;
  margin-bottom: var(--sp-8);
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-10);
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-lg);
  min-width: 72px;
}

.summary-stat-icon {
  font-size: var(--fs-xl);
}

.summary-stat-value {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
}

.summary-stat-label {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.rating-easy-bg {
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.15);
}

.rating-good-bg {
  background: rgba(74, 139, 110, 0.08);
  border: 1px solid rgba(74, 139, 110, 0.15);
}

.rating-hard-bg {
  background: rgba(184, 148, 68, 0.08);
  border: 1px solid rgba(184, 148, 68, 0.15);
}

.rating-again-bg {
  background: rgba(139, 74, 74, 0.08);
  border: 1px solid rgba(139, 74, 74, 0.15);
}

.summary-actions {
  display: flex;
  justify-content: center;
  gap: var(--sp-4);
}

/* ── Not Found ── */
.not-found {
  text-align: center;
  padding: var(--sp-20) 0;
}

.not-found h2 {
  margin-bottom: var(--sp-4);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .rating-buttons {
    gap: var(--sp-2);
  }

  .rating-btn {
    padding: var(--sp-2) var(--sp-3);
    min-width: 60px;
  }

  .summary-stats {
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  .summary-actions {
    flex-direction: column;
    align-items: center;
  }

  .nav-dots {
    max-width: 50%;
  }
}
</style>
