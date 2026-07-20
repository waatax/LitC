<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Sentence, HintLevel, ReviewRating } from '@/types/content'
import { HINT_LEVELS } from '@/types/content'
import { getChapter, getWorks, getAllSentencesByChapter } from '@/data'
import { getCardState, saveCardState, logReview } from '@/data/db'
import { scheduleReview } from '@/utils/scheduler'
import { zenAudio } from '@/utils/audio'
import { useGamificationStore } from '@/stores/gamification'
import SentenceCard from '@/components/SentenceCard.vue'
import HintLadder from '@/components/HintLadder.vue'
import ProgressRing from '@/components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()
const gamificationStore = useGamificationStore()

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
const isFocusMode = ref(false)
const isSepia = ref(false)
const isVertical = ref(false)

// Breathing pacer state (Focus mode)
const pacerText = ref('吸氣 (Inhale)')
const pacerPhase = ref<'inhale' | 'hold' | 'exhale'>('inhale')
let pacerTimer: number | null = null

// Achievement Unlocked popup
const unlockedOverlay = ref<any>(null)

// Track ratings per sentence
const ratings = ref<Map<string, ReviewRating>>(new Map())

const isSentenceMastered = computed(() => {
  if (!currentSentence.value) return false
  const rating = ratings.value.get(currentSentence.value.id)
  return rating === 'good' || rating === 'easy'
})

function loadChapter() {
  const chapterId = route.params.id as string
  if (!chapterId) return

  chapter.value = getChapter(chapterId) ?? null
  if (!chapter.value) return

  const allWorks = getWorks()
  work.value = allWorks.find(w => w.id === chapter.value!.workId) ?? null

  sentences.value = getAllSentencesByChapter(chapterId)
}

function startPacer() {
  let elapsed = 0
  pacerText.value = '吸氣 4s'
  pacerPhase.value = 'inhale'
  pacerTimer = window.setInterval(() => {
    elapsed = (elapsed + 1) % 19
    if (elapsed < 4) {
      pacerText.value = `吸氣 ${4 - elapsed}s`
      pacerPhase.value = 'inhale'
    } else if (elapsed < 11) {
      pacerText.value = `屏息 ${11 - elapsed}s`
      pacerPhase.value = 'hold'
    } else {
      pacerText.value = `呼氣 ${19 - elapsed}s`
      pacerPhase.value = 'exhale'
    }
  }, 1000)
}

function stopPacer() {
  if (pacerTimer) {
    clearInterval(pacerTimer)
    pacerTimer = null
  }
}

watch(isFocusMode, (val) => {
  if (val) startPacer()
  else stopPacer()
})

function handleKeydown(e: KeyboardEvent) {
  // If user is inside a textarea or input field, do not trigger global shortcuts
  const isInputActive = document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT'
  
  if (isInputActive) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      checkTyping()
    }
    if (e.key === 'Escape') {
      ;(document.activeElement as HTMLElement).blur()
    }
    return
  }

  // 1-4 for self-ratings
  if (['1', '2', '3', '4'].includes(e.key)) {
    e.preventDefault()
    const ratingsMap: ReviewRating[] = ['again', 'hard', 'good', 'easy']
    const rating = ratingsMap[parseInt(e.key) - 1]
    if (rating && !isComplete.value && currentSentence.value) {
      rateSentence(rating)
    }
  }

  // Space / Enter to toggle answers or check typing
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    if (showTypingArea.value) {
      if (!showDiff.value && typedText.value.trim().length > 0) {
        checkTyping()
      } else {
        hintLevel.value = 'full'
      }
    } else {
      if (hintLevel.value !== 'full') {
        hintLevel.value = 'full'
      }
    }
  }

  // H to cycle through hint levels
  if (e.key.toLowerCase() === 'h') {
    e.preventDefault()
    const currentIndex = HINT_LEVELS.findIndex(h => h.level === hintLevel.value)
    const nextIndex = (currentIndex + 1) % HINT_LEVELS.length
    hintLevel.value = HINT_LEVELS[nextIndex].level
  }

  // C to toggle chunks
  if (e.key.toLowerCase() === 'c') {
    e.preventDefault()
    showChunks.value = !showChunks.value
  }

  // F to toggle Focus Mode
  if (e.key.toLowerCase() === 'f') {
    e.preventDefault()
    isFocusMode.value = !isFocusMode.value
  }
}

onMounted(() => {
  loadChapter()
  requestAnimationFrame(() => {
    mounted.value = true
  })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopPacer()
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

  // Play synthesized audio feedback
  if (rating === 'easy' || rating === 'good') {
    zenAudio.playBell()
  } else if (rating === 'hard') {
    zenAudio.playMuyu()
  } else if (rating === 'again') {
    zenAudio.playGong()
  }

  // Load current card state
  const currentState = await getCardState(sentenceId)

  // Map hint levels to the scheduler's penalty indices:
  // blank = 0 (no penalty), meaning-only = 1, first-char = 2, keyword-mask = 3, full = 4
  let hintsUsed = 0
  if (hintLevel.value === 'meaning-only') hintsUsed = 1
  else if (hintLevel.value === 'first-char') hintsUsed = 2
  else if (hintLevel.value === 'keyword-mask') hintsUsed = 3
  else if (hintLevel.value === 'full') hintsUsed = 4

  // Run spaced repetition scheduler (with diffAccuracy passed for rating calibration)
  const { cardState } = scheduleReview(
    {
      cardId: sentenceId,
      reviewedAt: new Date().toISOString(),
      rating,
      answerMode: showTypingArea.value ? 'typing' : 'recall',
      hintsUsed,
      diffAccuracy: showTypingArea.value ? diffAccuracy.value : undefined
    },
    currentState
  )

  // Save progress
  await saveCardState(cardState)
  currentCardState.value = cardState
  await logReview({
    cardId: sentenceId,
    reviewedAt: new Date().toISOString(),
    rating,
    answerMode: showTypingArea.value ? 'typing' : 'recall',
    hintsUsed,
    diffAccuracy: showTypingArea.value ? diffAccuracy.value : undefined
  })

  // Award EXP & unlock achievement checklist
  const newAchievements = gamificationStore.addExp(15)
  if (newAchievements.length > 0) {
    unlockedOverlay.value = newAchievements[0]
    setTimeout(() => {
      unlockedOverlay.value = null
    }, 4500)
  }

  // Check and unlock 'first-card' on first rate
  if (gamificationStore.exp >= 15) {
    const ach = gamificationStore.unlockAchievement('first-card')
    if (ach) {
      unlockedOverlay.value = ach
      setTimeout(() => {
        unlockedOverlay.value = null
      }, 4500)
    }
  }

  // Move to next sentence or complete
  if (currentIndex.value < totalSentences.value - 1) {
    goToSentence(currentIndex.value + 1)
  } else {
    gamificationStore.incrementStreak()
    isComplete.value = true
  }
}

const currentCardState = ref<any>(null)
const showDebugger = ref(false)

async function loadCurrentCardState() {
  if (currentSentence.value) {
    currentCardState.value = await getCardState(currentSentence.value.id)
  } else {
    currentCardState.value = null
  }
}

watch(currentSentence, () => {
  loadCurrentCardState()
}, { immediate: true })

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

// Reset the back-end tracker and current index
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
  <div class="memorize-view" :class="{ 'is-mounted': mounted, 'focus-mode-active': isFocusMode, 'sepia-theme-active': isSepia }">
    <!-- Floating exit focus mode button -->
    <div class="zen-floating-controls" v-if="isFocusMode && !isComplete">
      <button
        class="btn btn-ghost floating-sepia-toggle"
        :class="{ 'is-on': isSepia }"
        @click="isSepia = !isSepia"
        title="切換護眼紙張色"
      >
        {{ isSepia ? '紙張色 📖' : '護眼色 👁️' }}
      </button>
      <button
        class="btn btn-ghost floating-exit-focus"
        @click="isFocusMode = false"
        title="退出專注模式 (F)"
      >
        退出專注 ✕ (F)
      </button>
    </div>

    <!-- Top Bar -->
    <div class="mem-top-bar" v-if="!isFocusMode">
      <button class="btn btn-ghost btn-sm" @click="goBack">
        ← 返回
      </button>
      <div class="top-bar-center" v-if="chapter && !isComplete">
        <span class="top-bar-title">{{ chapter.title }}</span>
        <span class="top-bar-counter">{{ currentIndex + 1 }} / {{ totalSentences }}</span>
      </div>
      <div class="top-bar-right" style="display: flex; align-items: center; gap: 8px;">
        <button
          class="btn btn-ghost btn-sm layout-toggle-btn"
          @click="isVertical = !isVertical"
          :title="isVertical ? '切換為橫排' : '切換為直排'"
          style="margin-right: 8px;"
        >
          {{ isVertical ? '🔤 橫書' : '📜 直書' }}
        </button>
        <ProgressRing :value="progressPercent" :size="40" :stroke-width="3" />
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!isComplete && currentSentence">
      <!-- Hint Ladder -->
      <section class="hint-section">
        <HintLadder v-model="hintLevel" />
      </section>

      <!-- Breathing Pacer (Visible in Focus Mode) -->
      <section v-if="isFocusMode" class="zen-pacer-section">
        <div class="zen-pacer-container">
          <div class="zen-pacer-ring" :class="pacerPhase"></div>
          <span class="zen-pacer-label">{{ pacerText }}</span>
        </div>
      </section>

      <!-- Sentence Card -->
      <section class="sentence-section">
        <Transition name="sentence" mode="out-in">
          <div :key="currentSentence.id" class="sentence-wrapper">
            <SentenceCard
              :sentence="currentSentence"
              :hint-level="hintLevel"
              :show-chunks="showChunks"
              :is-vertical="isVertical"
              :is-mastered="isSentenceMastered"
            />
          </div>
        </Transition>
      </section>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <button
          class="btn btn-ghost chunk-toggle"
          :class="{ 'is-on': showChunks }"
          @click="showChunks = !showChunks"
        >
          <span>{{ showChunks ? '🔲' : '⬜' }}</span>
          <span>語塊{{ showChunks ? '已顯示' : '已隱藏' }} (C)</span>
        </button>
        <button
          class="btn btn-ghost focus-toggle"
          :class="{ 'is-on': isFocusMode }"
          @click="isFocusMode = !isFocusMode"
        >
          <span>{{ isFocusMode ? '👁️‍🗨️' : '👁️' }}</span>
          <span>專注模式{{ isFocusMode ? '已開啟' : '已關閉' }} (F)</span>
        </button>
      </div>

      <!-- Typing Area (at blank level) -->
      <Transition name="slide-up">
        <section v-if="showTypingArea" class="typing-section" :class="{ 'is-vertical-section': isVertical }">
          <div class="typing-header">
            <span class="typing-icon">📝</span>
            <span class="typing-title">默寫區</span>
          </div>
          <textarea
            v-model="typedText"
            class="typing-input"
            :class="{ 'is-vertical-input': isVertical }"
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
            <div v-if="showDiff" class="diff-result" :class="{ 'is-vertical-diff': isVertical }">
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
        <!-- Rating Calibration Warning Alert -->
        <Transition name="fade">
          <p v-if="showDiff && diffAccuracy < 80" class="rating-warning-alert">
            ⚠️ 當前默寫正確率較低 ({{ diffAccuracy }}%)，建議點選「再來」或「困難」，系統排程亦會自動限制穩定度增長。
          </p>
        </Transition>

        <p class="rating-prompt">你覺得這句的掌握程度如何？<span v-if="!showTypingArea" class="shortcut-tip">(快速鍵: 1-4)</span></p>
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

      <!-- FSRS Debugger Panel (Iteration 5) -->
      <section class="debugger-section" v-if="!isFocusMode">
        <div class="fsrs-debugger glass-card">
          <button class="btn btn-ghost btn-debugger-toggle" @click="showDebugger = !showDebugger">
            🛠️ FSRS 排程除錯器 {{ showDebugger ? '▲' : '▼' }}
          </button>
          <Transition name="slide-up">
            <div v-if="showDebugger" class="debugger-content">
              <div v-if="currentCardState" class="debug-grid">
                <div class="debug-item"><strong>卡片 ID:</strong> <span>{{ currentCardState.sentenceId }}</span></div>
                <div class="debug-item"><strong>熟練狀態:</strong> <span>{{ currentCardState.mastery }}</span></div>
                <div class="debug-item"><strong>穩定度 (Stability):</strong> <span>{{ currentCardState.stability.toFixed(4) }} 天</span></div>
                <div class="debug-item"><strong>難度 (Difficulty):</strong> <span>{{ currentCardState.difficulty.toFixed(2) }}</span></div>
                <div class="debug-item"><strong>已複習次數:</strong> <span>{{ currentCardState.reviewCount }} 次</span></div>
                <div class="debug-item"><strong>下次到期時間:</strong> <span>{{ new Date(currentCardState.dueAt).toLocaleString() }}</span></div>
              </div>
              <div v-else class="debug-empty-state">
                <span>（新卡片，尚未有複習紀錄，完成本次背誦評分後寫入資料庫）</span>
              </div>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Sentence Navigation -->
      <div class="sentence-nav" v-if="!isFocusMode">

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
          <RedSeal text="學成" :size="80" style="margin: 0 auto var(--sp-4) auto;" />
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

        <!-- Gamification Reward Summary -->
        <div class="summary-gamification">
          <div class="summary-exp-tag">獲得 +{{ totalSentences * 15 }} EXP (總計 {{ gamificationStore.exp }} EXP)</div>
          <div class="summary-streak-tag">🔥 連續背誦天數：{{ gamificationStore.streak }} 天</div>
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

    <!-- Achievement Unlock Toast -->
    <Transition name="slide-up">
      <div v-if="unlockedOverlay" class="achievement-toast">
        <div class="toast-badge">{{ unlockedOverlay.icon }}</div>
        <div class="toast-info">
          <div class="toast-label">解鎖新成就！</div>
          <div class="toast-title">{{ unlockedOverlay.title }}</div>
          <div class="toast-desc">{{ unlockedOverlay.description }}</div>
        </div>
      </div>
    </Transition>
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

/* ── Focus Mode active state overrides ── */
.memorize-view.focus-mode-active .mem-top-bar,
.memorize-view.focus-mode-active .sentence-nav {
  opacity: 0;
  pointer-events: none;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.floating-exit-focus {
  position: fixed;
  top: var(--sp-4);
  right: var(--sp-4);
  opacity: 0.4;
  z-index: 100;
  font-size: var(--fs-xs);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  transition: all var(--duration-fast) var(--ease-out);
}

.floating-exit-focus:hover {
  opacity: 1;
  background: var(--c-bg-elevated);
}

/* Zen sepia focus toggle */
.zen-floating-controls {
  position: fixed;
  top: var(--sp-4);
  right: var(--sp-4);
  display: flex;
  gap: var(--sp-3);
  z-index: 100;
}

.floating-sepia-toggle {
  opacity: 0.4;
  font-size: var(--fs-xs);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  transition: all var(--duration-fast) var(--ease-out);
}

.floating-sepia-toggle:hover,
.floating-sepia-toggle.is-on {
  opacity: 1;
  color: var(--c-gold);
  background: var(--c-bg-elevated);
  border-color: var(--c-gold);
}

.focus-toggle.is-on {
  background: var(--c-gold-glow);
  border-color: var(--c-border-accent);
  color: var(--c-gold);
}

.rating-warning-alert {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-warning);
  background: rgba(184, 148, 68, 0.08);
  border: 1px solid rgba(184, 148, 68, 0.2);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--sp-4);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}

.shortcut-tip {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-left: var(--sp-2);
}

/* ── Sepia Theme active styles ── */
.memorize-view.sepia-theme-active {
  filter: sepia(0.65) contrast(0.95);
  background-color: #f6eedb !important;
}

/* ── Gamification Badges ── */
.summary-gamification {
  margin-bottom: var(--sp-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
}

.summary-exp-tag {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-success);
  background: rgba(74, 139, 110, 0.1);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
}

.summary-streak-tag {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.1);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
}

/* ── Breathing Pacer ── */
.zen-pacer-section {
  display: flex;
  justify-content: center;
  margin-bottom: var(--sp-6);
}

.zen-pacer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 140px;
  height: 140px;
  justify-content: center;
}

.zen-pacer-ring {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid var(--c-gold);
  background: var(--c-gold-glow);
  transition: all 1s ease-in-out;
  box-sizing: border-box;
}

.zen-pacer-ring.inhale {
  transform: scale(1.2);
  opacity: 0.9;
  border-color: var(--c-gold);
  background: rgba(201, 169, 110, 0.25);
  box-shadow: 0 0 25px rgba(201, 169, 110, 0.4);
}

.zen-pacer-ring.hold {
  transform: scale(1.2);
  opacity: 0.9;
  border-color: var(--c-success);
  background: rgba(74, 139, 110, 0.25);
  box-shadow: 0 0 25px rgba(74, 139, 110, 0.4);
}

.zen-pacer-ring.exhale {
  transform: scale(0.7);
  opacity: 0.3;
  border-color: var(--c-danger);
  background: rgba(139, 74, 74, 0.15);
  box-shadow: 0 0 5px rgba(139, 74, 74, 0.1);
}

.zen-pacer-label {
  position: relative;
  z-index: 10;
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-primary);
  font-weight: var(--fw-semibold);
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* ── Achievement Toast Notification ── */
.achievement-toast {
  position: fixed;
  bottom: var(--sp-8);
  right: var(--sp-8);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  background: linear-gradient(135deg, rgba(20, 18, 14, 0.95) 0%, rgba(12, 12, 20, 0.98) 100%);
  border: 2px solid var(--c-gold);
  border-radius: var(--radius-lg);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 169, 110, 0.2);
  z-index: 200;
  animation: slideUpFade var(--duration-normal) var(--ease-spring), gold-pulse-border 3s infinite ease-in-out;
  max-width: 350px;
  overflow: hidden;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}

.achievement-toast::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 45%,
    rgba(201, 169, 110, 0.15) 50%,
    transparent 55%
  );
  animation: gold-shimmer-sweep 4s infinite linear;
  pointer-events: none;
}

@keyframes gold-pulse-border {
  0%, 100% {
    border-color: var(--c-gold);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 169, 110, 0.2);
  }
  50% {
    border-color: var(--c-gold-light);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 35px rgba(201, 169, 110, 0.4);
  }
}

@keyframes gold-shimmer-sweep {
  0% { transform: translate(-30%, -30%) rotate(0deg); }
  100% { transform: translate(30%, 30%) rotate(0deg); }
}


.toast-badge {
  font-size: 2.2rem;
}

.toast-info {
  display: flex;
  flex-direction: column;
}

.toast-label {
  font-family: var(--font-sans);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.toast-title {
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
  margin: 2px 0;
}

.toast-desc {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

@keyframes slideUpFade {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ── FSRS Debugger Styles ── */
.debugger-section {
  margin: var(--sp-4) 0;
  width: 100%;
}

.fsrs-debugger {
  border: 1px dashed var(--c-border-accent);
  border-radius: var(--radius-md);
  padding: var(--sp-3);
  background: rgba(20, 20, 30, 0.4);
}

.btn-debugger-toggle {
  width: 100%;
  text-align: left;
  font-family: var(--font-sans);
  font-size: var(--fs-xs) !important;
  color: var(--c-text-secondary);
  border: none;
  background: transparent;
  padding: var(--sp-1) var(--sp-2) !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-debugger-toggle:hover {
  background: var(--c-bg-card-hover) !important;
  color: var(--c-gold);
}

.debugger-content {
  margin-top: var(--sp-3);
  padding: var(--sp-3);
  background: var(--c-bg-deep);
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-subtle);
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-2) var(--sp-4);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-secondary);
}

.debug-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed var(--c-border-subtle);
  padding-bottom: 2px;
}

.debug-item strong {
  color: var(--c-text-muted);
}

.debug-empty-state {
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  padding: var(--sp-2) 0;
}

/* ── Vertical typing modes ── */
.typing-section.is-vertical-section {
  display: flex;
  flex-direction: row-reverse;
  gap: var(--sp-4);
  height: 220px;
  align-items: stretch;
}

.typing-section.is-vertical-section .typing-header {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  margin-bottom: 0;
  gap: var(--sp-2);
}

.typing-input.is-vertical-input {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  width: auto;
  flex: 1;
  height: 100%;
  resize: horizontal;
}

.typing-section.is-vertical-section .typing-actions {
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 0;
  gap: var(--sp-2);
}

.diff-result.is-vertical-diff {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--sp-4);
  height: 100%;
  padding: var(--sp-2);
  margin-top: 0;
}

.diff-result.is-vertical-diff .diff-header {
  writing-mode: vertical-rl;
  margin-bottom: 0;
}

.diff-result.is-vertical-diff .diff-chars {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  flex-direction: row;
  height: 120px;
  line-height: 2.2;
  gap: 2px;
  margin-bottom: 0;
}
</style>

