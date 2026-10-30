<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { QuestQuestion, QuestStage } from '@/types/content'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import { useGamificationStore, type Rank } from '@/stores/gamification'
import { speechService } from '@/services/speech'
import {
  playCorrectSound,
  playWrongSound,
  playComboSound,
  playVictorySound,
  playLifelineSound,
  isSoundEnabled,
  setSoundEnabled,
} from '@/utils/soundEffects'

const router = useRouter()
const gamificationStore = useGamificationStore()

// View States: 'map' | 'quiz' | 'result' | 'review-notebook'
type ViewMode = 'map' | 'quiz' | 'result' | 'review-notebook'
const mode = ref<ViewMode>('map')

// Selected stage & quiz questions
const allQuestions = ref<QuestQuestion[]>([])
const stages = ref<QuestStage[]>([])
const currentStage = ref<QuestStage | null>(null)
const currentQuiz = ref<QuestQuestion[]>([])
const userAnswers = ref<number[]>([])
const currentIndex = ref(0)
const selectedOption = ref<number | null>(null)
const isAnswerSubmitted = ref(false)
const isLoading = ref(true)

// Streak & Gamification
const currentStreak = ref(0)
const maxStreak = ref(0)
const sessionExpEarned = ref(0)
const newRankCelebration = ref<Rank | null>(null)

// Sound & Speech settings
const soundEffectsOn = ref(isSoundEnabled())
const isAutoReadEnabled = ref(typeof localStorage !== 'undefined' ? localStorage.getItem('litc_quiz_auto_read') === 'true' : false)
const speechRate = ref<number>(typeof localStorage !== 'undefined' ? Number(localStorage.getItem('litc_quiz_speech_rate') || '1.0') : 1.0)
const isSpeaking = ref(false)
const speakingTarget = ref<string | null>(null)

// Lifelines (三大錦囊)
const fiftyFiftyLeft = ref(2)
const hintLifelineLeft = ref(3)
const eliminatedOptions = ref<number[]>([])
const isHintModalOpen = ref(false)
const activeStageGuide = ref<QuestStage | null>(null)

// Storage keys
const STAGE_PROGRESS_KEY = 'litc_quest_stage_progress'
const MISSED_QUESTIONS_KEY = 'litc_quest_missed_ids'

interface StageProgressRecord {
  stars: number
  bestScore: number
  completed: boolean
}
const stageProgress = ref<Record<string, StageProgressRecord>>({})
const missedQuestionIds = ref<string[]>([])

// Quick Quiz settings
const quickQuizCounts = [10, 20, 30, 50]
const selectedQuickCount = ref(10)
const selectedQuickCategory = ref<string>('all')

// Load Data
onMounted(async () => {
  isLoading.value = true
  try {
    const module = await import('@/data/quest_bank_300')
    allQuestions.value = module.QUEST_BANK_300 || []
    stages.value = module.QUEST_STAGES || []
  } catch (err) {
    console.warn('Quest bank loading failed, fallback to legacy quiz bank...', err)
    try {
      const legacyMod = await import('@/data/quiz_bank')
      allQuestions.value = (legacyMod.quizBank || []).slice(0, 300).map((q: any, i: number) => ({
        id: q.id || `quest-${i + 1}`,
        stageId: `stage-${Math.floor(i / 35) + 1}`,
        stageTitle: `關卡 ${Math.floor(i / 35) + 1}`,
        difficulty: 2,
        type: q.type || 'fill-in-blank',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        source: {
          workTitle: q.explanation?.match(/【出處】(.*)/)?.[1] || '經典古籍',
          chapterTitle: '',
          author: '先秦名家',
          dynasty: '先秦',
        },
        context: q.explanation?.match(/【原句】(.*)/)?.[1] || q.question,
        targetSentence: q.explanation?.match(/【原句】(.*)/)?.[1] || '',
        vernacular: q.explanation?.match(/【白話通譯】(.*)/)?.[1] || '參照原文深入研讀體會。',
        explanation: q.explanation || '此為文言核心考點解析。',
        analysis: '通覽全篇，體味先賢立言旨歸。',
        modernLink: '古人處事智慧，足為今人立身借鏡。',
        workId: q.workId,
        chapterId: q.chapterId,
      }))
    } catch (e) {
      console.error('All quiz banks failed to load:', e)
    }
  } finally {
    isLoading.value = false
  }

  loadProgress()
})

onUnmounted(() => {
  stopSpeech()
})

watch(mode, (newMode) => {
  if (newMode !== 'quiz') {
    stopSpeech()
  }
})

function loadProgress() {
  try {
    const raw = localStorage.getItem(STAGE_PROGRESS_KEY)
    if (raw) stageProgress.value = JSON.parse(raw)
    const missed = localStorage.getItem(MISSED_QUESTIONS_KEY)
    if (missed) missedQuestionIds.value = JSON.parse(missed)
  } catch (e) {
    console.warn('Failed to parse quest progress from localStorage', e)
  }
}

function saveProgress(stageId: string, stars: number, scorePercent: number) {
  const current = stageProgress.value[stageId] || { stars: 0, bestScore: 0, completed: false }
  stageProgress.value[stageId] = {
    stars: Math.max(current.stars, stars),
    bestScore: Math.max(current.bestScore, scorePercent),
    completed: true,
  }
  localStorage.setItem(STAGE_PROGRESS_KEY, JSON.stringify(stageProgress.value))
}

function saveMissed(questionId: string) {
  if (!missedQuestionIds.value.includes(questionId)) {
    missedQuestionIds.value.push(questionId)
    localStorage.setItem(MISSED_QUESTIONS_KEY, JSON.stringify(missedQuestionIds.value))
  }
}

function removeMissed(questionId: string) {
  missedQuestionIds.value = missedQuestionIds.value.filter((id) => id !== questionId)
  localStorage.setItem(MISSED_QUESTIONS_KEY, JSON.stringify(missedQuestionIds.value))
}

function isStageUnlocked(stage: QuestStage, index: number): boolean {
  if (index === 0 || stage.unlockedByDefault) return true
  const prevStage = stages.value[index - 1]
  if (!prevStage) return true
  const prevProg = stageProgress.value[prevStage.id]
  return prevProg && prevProg.completed && prevProg.bestScore >= 60
}

function toggleSound() {
  soundEffectsOn.value = !soundEffectsOn.value
  setSoundEnabled(soundEffectsOn.value)
}

function toggleAutoRead() {
  isAutoReadEnabled.value = !isAutoReadEnabled.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('litc_quiz_auto_read', isAutoReadEnabled.value ? 'true' : 'false')
  }
  if (isAutoReadEnabled.value && mode.value === 'quiz') {
    speakQuestion()
  } else {
    stopSpeech()
  }
}

function setQuizSpeechRate(rate: number) {
  speechRate.value = rate
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('litc_quiz_speech_rate', String(rate))
  }
  if (isSpeaking.value) {
    stopSpeech()
  }
}

// Start Stage Quest
function startStageQuest(stage: QuestStage) {
  currentStage.value = stage
  const stageQuestions = allQuestions.value.filter((q) => q.stageId === stage.id)
  currentQuiz.value = stageQuestions.length > 0 ? stageQuestions : allQuestions.value.slice(0, stage.targetCount)
  userAnswers.value = new Array(currentQuiz.value.length).fill(-1)
  currentIndex.value = 0
  selectedOption.value = null
  isAnswerSubmitted.value = false
  currentStreak.value = 0
  maxStreak.value = 0
  sessionExpEarned.value = 0
  fiftyFiftyLeft.value = 2
  hintLifelineLeft.value = 3
  eliminatedOptions.value = []
  mode.value = 'quiz'

  if (isAutoReadEnabled.value) {
    setTimeout(() => {
      if (mode.value === 'quiz') speakQuestion()
    }, 400)
  }
}

// Start Quick Quiz
function startQuickQuiz() {
  currentStage.value = null
  let pool = [...allQuestions.value]
  if (selectedQuickCategory.value !== 'all') {
    pool = pool.filter((q) => q.stageId === selectedQuickCategory.value)
  }
  const shuffled = pool.sort(() => 0.5 - Math.random())
  currentQuiz.value = shuffled.slice(0, selectedQuickCount.value)
  userAnswers.value = new Array(currentQuiz.value.length).fill(-1)
  currentIndex.value = 0
  selectedOption.value = null
  isAnswerSubmitted.value = false
  currentStreak.value = 0
  maxStreak.value = 0
  sessionExpEarned.value = 0
  fiftyFiftyLeft.value = 2
  hintLifelineLeft.value = 3
  eliminatedOptions.value = []
  mode.value = 'quiz'

  if (isAutoReadEnabled.value) {
    setTimeout(() => {
      if (mode.value === 'quiz') speakQuestion()
    }, 400)
  }
}

// Start Missed Review
function startMissedReview() {
  currentStage.value = null
  const missedList = allQuestions.value.filter((q) => missedQuestionIds.value.includes(q.id))
  if (missedList.length === 0) return
  currentQuiz.value = missedList
  userAnswers.value = new Array(currentQuiz.value.length).fill(-1)
  currentIndex.value = 0
  selectedOption.value = null
  isAnswerSubmitted.value = false
  currentStreak.value = 0
  maxStreak.value = 0
  sessionExpEarned.value = 0
  fiftyFiftyLeft.value = 2
  hintLifelineLeft.value = 3
  eliminatedOptions.value = []
  mode.value = 'quiz'

  if (isAutoReadEnabled.value) {
    setTimeout(() => {
      if (mode.value === 'quiz') speakQuestion()
    }, 400)
  }
}

// Active question
const currentQuestion = computed(() => currentQuiz.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === currentQuiz.value.length - 1)

// Combo title
const comboTitle = computed(() => {
  if (currentStreak.value >= 10) return '萬世師表 ‧ 獨步天下'
  if (currentStreak.value >= 7) return '登峯造極 ‧ 翰林清流'
  if (currentStreak.value >= 5) return '下筆有神 ‧ 勢不可擋'
  if (currentStreak.value >= 3) return '勢如破竹 ‧ 經學精深'
  if (currentStreak.value >= 2) return '小試鋒芒 ‧ 漸入佳境'
  return ''
})

// Speech Functions
function stopSpeech() {
  speechService.stop()
  isSpeaking.value = false
  speakingTarget.value = null
}

function speakQuestion() {
  if (isSpeaking.value && speakingTarget.value === 'question') {
    stopSpeech()
    return
  }
  if (!currentQuestion.value) return
  stopSpeech()
  speakingTarget.value = 'question'
  isSpeaking.value = true
  gamificationStore.unlockAchievement('quest-voice-master')

  const textToSpeak = `第 ${currentIndex.value + 1} 題：${currentQuestion.value.question}`
  speechService.speakText(textToSpeak, {
    rate: speechRate.value,
    onStart: () => { isSpeaking.value = true },
    onEnd: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    },
    onError: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    }
  })
}

function speakOption(index: number) {
  const targetKey = `opt-${index}`
  if (isSpeaking.value && speakingTarget.value === targetKey) {
    stopSpeech()
    return
  }
  if (!currentQuestion.value || !currentQuestion.value.options[index]) return
  stopSpeech()
  speakingTarget.value = targetKey
  isSpeaking.value = true
  gamificationStore.unlockAchievement('quest-voice-master')

  const prefix = String.fromCharCode(65 + index)
  const textToSpeak = `選項 ${prefix}：${currentQuestion.value.options[index]}`
  speechService.speakText(textToSpeak, {
    rate: speechRate.value,
    onStart: () => { isSpeaking.value = true },
    onEnd: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    },
    onError: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    }
  })
}

function speakExplanation() {
  if (isSpeaking.value && speakingTarget.value === 'explanation') {
    stopSpeech()
    return
  }
  if (!currentQuestion.value) return
  stopSpeech()
  speakingTarget.value = 'explanation'
  isSpeaking.value = true
  gamificationStore.unlockAchievement('quest-voice-master')

  const correctLetter = String.fromCharCode(65 + currentQuestion.value.correctAnswer)
  const correctText = currentQuestion.value.options[currentQuestion.value.correctAnswer]
  const textToSpeak = `正確答案是：選項 ${correctLetter}，${correctText}。考點解析：${currentQuestion.value.explanation}`

  speechService.speakText(textToSpeak, {
    rate: speechRate.value,
    onStart: () => { isSpeaking.value = true },
    onEnd: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    },
    onError: () => {
      isSpeaking.value = false
      speakingTarget.value = null
    }
  })
}

// Lifeline functions
function useLifelineFifty() {
  if (fiftyFiftyLeft.value <= 0 || isAnswerSubmitted.value || !currentQuestion.value) return
  playLifelineSound()
  fiftyFiftyLeft.value--
  gamificationStore.unlockAchievement('quest-lifeline-master')

  const correct = currentQuestion.value.correctAnswer
  const wrongs = [0, 1, 2, 3].filter(idx => idx !== correct)
  wrongs.sort(() => 0.5 - Math.random())
  eliminatedOptions.value = wrongs.slice(0, 2)
}

function useLifelineHint() {
  if (hintLifelineLeft.value <= 0 || !currentQuestion.value) return
  playLifelineSound()
  hintLifelineLeft.value--
  isHintModalOpen.value = true
  gamificationStore.unlockAchievement('quest-lifeline-master')
}

function retryQuestion() {
  selectedOption.value = null
  isAnswerSubmitted.value = false
  stopSpeech()
}

// Select option
function selectOption(index: number) {
  if (isAnswerSubmitted.value || eliminatedOptions.value.includes(index)) return
  stopSpeech()
  selectedOption.value = index
  isAnswerSubmitted.value = true
  userAnswers.value[currentIndex.value] = index

  if (index === currentQuestion.value.correctAnswer) {
    currentStreak.value++
    if (currentStreak.value > maxStreak.value) maxStreak.value = currentStreak.value
    removeMissed(currentQuestion.value.id)

    if (currentStreak.value >= 3) {
      playComboSound(currentStreak.value)
    } else {
      playCorrectSound()
    }

    // EXP awards
    const comboBonus = Math.min(20, Math.floor(currentStreak.value / 2) * 5)
    const expAward = 10 + comboBonus
    sessionExpEarned.value += expAward
    gamificationStore.addExp(expAward)

    if (currentStreak.value >= 5) gamificationStore.unlockAchievement('quest-combo-5')
    if (currentStreak.value >= 10) gamificationStore.unlockAchievement('quest-combo-10')

    const levelUp = gamificationStore.checkRankUp()
    if (levelUp) {
      newRankCelebration.value = levelUp
    }
  } else {
    currentStreak.value = 0
    playWrongSound()
    saveMissed(currentQuestion.value.id)
  }
}

function nextQuestion() {
  stopSpeech()
  eliminatedOptions.value = []

  if (isLastQuestion.value) {
    if (currentStage.value) {
      saveProgress(currentStage.value.id, starsAwarded.value, scorePercentage.value)
      if (currentStage.value.id === 'stage-1' && scorePercentage.value >= 60) {
        gamificationStore.unlockAchievement('quest-stage-1')
      }
      const allCompleted = stages.value.every(s => stageProgress.value[s.id]?.completed && stageProgress.value[s.id]?.bestScore >= 60)
      if (allCompleted) {
        gamificationStore.unlockAchievement('quest-stage-all')
      }
    }
    if (scorePercentage.value === 100) {
      gamificationStore.unlockAchievement('quiz-perfect')
    }

    const completionExp = starsAwarded.value * 30 + 30
    sessionExpEarned.value += completionExp
    gamificationStore.addExp(completionExp)

    const levelUp = gamificationStore.checkRankUp()
    if (levelUp) {
      newRankCelebration.value = levelUp
    }

    playVictorySound()
    mode.value = 'result'
  } else {
    currentIndex.value++
    selectedOption.value = null
    isAnswerSubmitted.value = false

    if (isAutoReadEnabled.value) {
      setTimeout(() => {
        if (mode.value === 'quiz') speakQuestion()
      }, 350)
    }
  }
}

// Score and Stats
const correctCount = computed(() => {
  return currentQuiz.value.reduce((acc, q, idx) => {
    return acc + (userAnswers.value[idx] === q.correctAnswer ? 1 : 0)
  }, 0)
})

const scorePercentage = computed(() => {
  if (currentQuiz.value.length === 0) return 0
  return Math.round((correctCount.value / currentQuiz.value.length) * 100)
})

const starsAwarded = computed(() => {
  const p = scorePercentage.value
  if (p >= 90) return 3
  if (p >= 75) return 2
  if (p >= 60) return 1
  return 0
})

const rankTitle = computed(() => {
  const p = scorePercentage.value
  if (p === 100) return '六藝宗師 ‧ 狀元及第'
  if (p >= 90) return '探驪得珠 ‧ 翰林清流'
  if (p >= 80) return '會試及第 ‧ 經學精深'
  if (p >= 60) return '鄉試名秀 ‧ 漸入佳境'
  return '童生入道 ‧ 勤加磨礪'
})

function getQuestionTypeName(type: string) {
  switch (type) {
    case 'fill-in-blank': return '名句填空'
    case 'word-meaning': return '字詞音義'
    case 'analysis': return '深層析理'
    case 'context-syntax': return '句式特殊語法'
    case 'translation': return '白話譯析'
    case 'modern-link': return '古今思辨'
    default: return '綜合考題'
  }
}

function goToSource(question: QuestQuestion) {
  if (question.chapterId) {
    let url = `/chapter/${question.chapterId}`
    if (question.passageId) {
      url += `#passage-${question.passageId}`
    }
    router.push(url)
  } else if (question.workId) {
    router.push(`/library?work=${question.workId}`)
  }
}
</script>

<template>
  <div class="quest-view">
    <!-- Top Header -->
    <header class="quest-view-header">
      <div class="view-pill-badge">
        <ClassicalIcon name="quiz" :size="18" />
        <span>古文闖關 ‧ 六藝策考</span>
      </div>
      <h1 class="view-title">古文闖關 ‧ 九重天闕</h1>
      <p class="view-subtitle">
        收錄 336 題核心題庫與九重關卡單元導讀，配備智慧語音朗讀、失誤深度診斷與遊戲化激勵系統
      </p>

      <!-- View Navigation Tabs -->
      <div class="mode-tabs">
        <button
          class="mode-tab-btn"
          :class="{ active: mode === 'map' }"
          @click="mode = 'map'"
        >
          <ClassicalIcon name="target" :size="16" />
          <span>九重關卡地圖</span>
        </button>
        <button
          class="mode-tab-btn"
          :class="{ active: mode === 'review-notebook' }"
          @click="mode = 'review-notebook'"
        >
          <ClassicalIcon name="book-open" :size="16" />
          <span>錯題錦囊 ({{ missedQuestionIds.length }})</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-box">
      <ClassicalIcon name="hourglass" :size="32" class="spin-icon" />
      <p>正在載入古文闖關題庫與六藝關卡...</p>
    </div>

    <!-- Mode 1: Stage Map Mode -->
    <div v-else-if="mode === 'map'" class="stage-map-container">
      <!-- Quick Quiz Box -->
      <section class="quick-quiz-banner">
        <div class="banner-left">
          <h3 class="banner-title">
            <ClassicalIcon name="sparkle" :size="18" />
            <span>自由測驗 ‧ 隨機策考</span>
          </h3>
          <p class="banner-desc">從全庫 336 題中自選題數抽考，考驗綜合國學底蘊。</p>
        </div>

        <div class="banner-controls">
          <div class="count-buttons">
            <button
              v-for="c in quickQuizCounts"
              :key="c"
              class="quick-count-btn"
              :class="{ active: selectedQuickCount === c }"
              @click="selectedQuickCount = c"
            >
              {{ c }} 題
            </button>
          </div>

          <button class="btn btn-primary start-quick-btn" @click="startQuickQuiz">
            <ClassicalIcon name="quiz" :size="16" />
            <span>開始隨機測驗</span>
          </button>
        </div>
      </section>

      <!-- 9 Stages Grid Map -->
      <h2 class="section-title">
        <ClassicalIcon name="crown" :size="20" />
        <span>九重天闕 ‧ 循序問道</span>
      </h2>

      <div class="stages-grid">
        <div
          v-for="(stage, sIdx) in stages"
          :key="stage.id"
          class="stage-card"
          :class="{
            unlocked: isStageUnlocked(stage, sIdx),
            locked: !isStageUnlocked(stage, sIdx),
            completed: stageProgress[stage.id]?.completed
          }"
        >
          <div class="stage-card-top">
            <div class="stage-order-badge">第 {{ stage.order }} 關</div>
            <div class="stage-stars">
              <span
                v-for="s in 3"
                :key="s"
                class="star-item"
                :class="{ filled: (stageProgress[stage.id]?.stars || 0) >= s }"
              >
                ★
              </span>
            </div>
          </div>

          <div class="stage-card-body">
            <div class="stage-icon-circle" :style="{ backgroundColor: stage.themeColor + '20', borderColor: stage.themeColor }">
              <ClassicalIcon :name="stage.icon as any" :size="24" :color="stage.themeColor" />
            </div>

            <h3 class="stage-card-title">{{ stage.title.split('：')[1] || stage.title }}</h3>
            <p class="stage-card-subtitle">{{ stage.subtitle }}</p>
            <p class="stage-card-desc">{{ stage.description }}</p>

            <div class="stage-meta-row">
              <span class="meta-item">題數：{{ stage.targetCount }} 題</span>
              <span v-if="stageProgress[stage.id]?.bestScore" class="meta-item best-score">
                最高：{{ stageProgress[stage.id]?.bestScore }}%
              </span>
            </div>
          </div>

          <div class="stage-card-action">
            <button
              class="stage-guide-btn"
              @click="activeStageGuide = stage"
              title="查看單元導讀與提分心法"
            >
              <ClassicalIcon name="scroll" :size="14" />
              <span>單元導讀</span>
            </button>
            <button
              v-if="isStageUnlocked(stage, sIdx)"
              class="stage-enter-btn"
              @click="startStageQuest(stage)"
            >
              <span>{{ stageProgress[stage.id]?.completed ? '再次重闖' : '踏入考驗' }}</span>
              <ClassicalIcon name="arrow-right" :size="14" />
            </button>
            <div v-else class="stage-locked-tag">
              <ClassicalIcon name="lock" :size="14" />
              <span>前關達 60% 解鎖</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mode 2: Missed Review Notebook -->
    <div v-else-if="mode === 'review-notebook'" class="missed-notebook-container">
      <div class="notebook-header">
        <h2 class="notebook-title">格物致知 ‧ 錯題錦囊</h2>
        <p class="notebook-desc">
          記錄您在闖關與策考中曾失誤的題目。知恥近乎勇，溫故而知新，專注突破盲區方能登峯造極。
        </p>

        <button
          v-if="missedQuestionIds.length > 0"
          class="btn btn-primary start-review-btn"
          @click="startMissedReview"
        >
          <ClassicalIcon name="refresh" :size="16" />
          <span>開始針對複習（共 {{ missedQuestionIds.length }} 題）</span>
        </button>
      </div>

      <div v-if="missedQuestionIds.length === 0" class="empty-missed-state">
        <ClassicalIcon name="check" :size="48" color="var(--c-gold)" />
        <h3>目前尚無錯題記錄！</h3>
        <p>您的國學底蘊深厚，繼續在九重天闕中挑戰高難度關卡吧！</p>
        <button class="btn btn-secondary" @click="mode = 'map'">返回關卡地圖</button>
      </div>

      <div v-else class="missed-list">
        <div v-for="qid in missedQuestionIds" :key="qid" class="missed-card">
          <template v-if="allQuestions.find((q) => q.id === qid)">
            <div class="missed-card-top">
              <span class="missed-source">
                {{ allQuestions.find((q) => q.id === qid)?.source.workTitle }}
              </span>
              <button class="btn-remove-missed" @click="removeMissed(qid)" title="已熟練，移出錯題本">
                ✕ 熟練移出
              </button>
            </div>
            <h4 class="missed-question">
              {{ allQuestions.find((q) => q.id === qid)?.question }}
            </h4>
            <div class="missed-explanation-preview">
              {{ allQuestions.find((q) => q.id === qid)?.explanation }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mode 3: In-Quiz Question Interface -->
    <div v-else-if="mode === 'quiz' && currentQuestion" class="quiz-active-container">
      <!-- Quiz Top Bar -->
      <div class="quiz-top-bar">
        <div class="quiz-progress-info">
          <span class="stage-indicator-text">
            {{ currentStage ? currentStage.title : '翰林自由策考' }}
          </span>
          <span class="index-indicator-text">
            第 <strong>{{ currentIndex + 1 }}</strong> / {{ currentQuiz.length }} 題
          </span>
        </div>

        <div v-if="currentStreak >= 2" class="streak-badge-animated">
          <span class="streak-fire">🔥</span>
          <span class="streak-text">{{ currentStreak }} 連對！{{ comboTitle }}</span>
        </div>

        <button class="quit-quiz-btn" @click="mode = 'map'">退出考驗</button>
      </div>

      <!-- Controls & Lifelines Toolbar -->
      <div class="quiz-toolbar">
        <div class="lifeline-group">
          <button
            class="lifeline-btn"
            :class="{ disabled: fiftyFiftyLeft <= 0 || isAnswerSubmitted }"
            :disabled="fiftyFiftyLeft <= 0 || isAnswerSubmitted"
            @click="useLifelineFifty"
            title="去蕪存菁：排除兩個錯誤選項"
          >
            <span>🪄 去蕪存菁 ({{ fiftyFiftyLeft }})</span>
          </button>
          <button
            class="lifeline-btn"
            :class="{ disabled: hintLifelineLeft <= 0 }"
            :disabled="hintLifelineLeft <= 0"
            @click="useLifelineHint"
            title="原典提點：展開關鍵線索"
          >
            <span>📜 錦囊提點 ({{ hintLifelineLeft }})</span>
          </button>
        </div>

        <div class="audio-control-group">
          <button
            class="audio-toggle-btn"
            :class="{ active: isAutoReadEnabled }"
            @click="toggleAutoRead"
            title="題目載入時自動語音朗讀"
          >
            <ClassicalIcon :name="isAutoReadEnabled ? 'headphones' : 'audio'" :size="15" />
            <span>{{ isAutoReadEnabled ? '自動朗讀: 開' : '自動朗讀: 關' }}</span>
          </button>

          <button
            class="audio-toggle-btn"
            :class="{ active: soundEffectsOn }"
            @click="toggleSound"
            title="作答與連擊音效開關"
          >
            <span>{{ soundEffectsOn ? '🔔 音效: 開' : '🔕 音效: 關' }}</span>
          </button>

          <div class="rate-select-pills">
            <button
              v-for="r in [0.8, 1.0, 1.25]"
              :key="r"
              class="rate-pill-btn"
              :class="{ active: speechRate === r }"
              @click="setQuizSpeechRate(r)"
            >
              {{ r }}x
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Track -->
      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :style="{ width: ((currentIndex + 1) / currentQuiz.length * 100) + '%' }"
        ></div>
      </div>

      <!-- Question Card -->
      <div class="question-main-card">
        <div class="q-meta-row">
          <span class="q-type-badge">{{ getQuestionTypeName(currentQuestion.type) }}</span>
          <span class="q-source-tag">
            {{ currentQuestion.source.workTitle }} {{ currentQuestion.source.chapterTitle }}
          </span>
          <span v-if="sessionExpEarned > 0" class="exp-session-tag">
            ✨ +{{ sessionExpEarned }} EXP
          </span>
        </div>

        <!-- Question Stem Row with Speech Readout Button -->
        <div class="q-stem-row">
          <h3 class="q-stem classical-text-lg">
            {{ currentQuestion.question }}
          </h3>
          <button
            class="q-speech-btn"
            :class="{ active: isSpeaking && speakingTarget === 'question' }"
            @click="speakQuestion"
            title="語音朗讀題目"
          >
            <ClassicalIcon :name="isSpeaking && speakingTarget === 'question' ? 'audio-playing' : 'audio'" :size="16" />
            <span>{{ isSpeaking && speakingTarget === 'question' ? '朗讀中...' : '念題目' }}</span>
          </button>
        </div>

        <!-- Options List -->
        <div class="options-container">
          <button
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option-choice-btn"
            :class="{
              selected: selectedOption === idx,
              correct: isAnswerSubmitted && idx === currentQuestion.correctAnswer,
              incorrect: isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswer,
              eliminated: eliminatedOptions.includes(idx),
              disabled: isAnswerSubmitted || eliminatedOptions.includes(idx)
            }"
            :disabled="isAnswerSubmitted || eliminatedOptions.includes(idx)"
            @click="selectOption(idx)"
          >
            <span class="option-prefix">{{ String.fromCharCode(65 + idx) }}</span>
            <span class="option-label-text">{{ opt }}</span>

            <button
              class="option-speech-trigger"
              :class="{ active: isSpeaking && speakingTarget === 'opt-' + idx }"
              @click.stop="speakOption(idx)"
              title="朗讀此選項"
            >
              <ClassicalIcon :name="isSpeaking && speakingTarget === 'opt-' + idx ? 'audio-playing' : 'audio'" :size="14" />
            </button>

            <span v-if="isAnswerSubmitted && idx === currentQuestion.correctAnswer" class="answer-stamp">
              ✓ 正確
            </span>
            <span v-else-if="isAnswerSubmitted && selectedOption === idx" class="answer-stamp wrong">
              ✕ 失誤
            </span>
            <span v-else-if="eliminatedOptions.includes(idx)" class="eliminated-tag">
              已排除
            </span>
          </button>
        </div>

        <!-- Feedback & Immediate Learning Panel -->
        <div v-if="isAnswerSubmitted" class="feedback-panel">
          <!-- Status Banner -->
          <div
            class="feedback-status-banner"
            :class="{ 'is-correct': selectedOption === currentQuestion.correctAnswer, 'is-wrong': selectedOption !== currentQuestion.correctAnswer }"
          >
            <div class="status-left">
              <ClassicalIcon
                :name="selectedOption === currentQuestion.correctAnswer ? 'check' : 'close'"
                :size="20"
              />
              <span class="status-title">
                {{ selectedOption === currentQuestion.correctAnswer ? '答對了！融會貫通！' : '作答失誤，已存入錯題錦囊' }}
              </span>
            </div>
            <button class="source-jump-btn" @click="goToSource(currentQuestion)">
              <ClassicalIcon name="book-open" :size="14" />
              <span>研讀出處章節</span>
            </button>
          </div>

          <!-- 失誤深度診斷與避坑指南 (Dedicated Error Diagnostic) -->
          <div v-if="selectedOption !== currentQuestion.correctAnswer" class="panel-section error-diagnostic-section">
            <div class="error-banner-header">
              <div class="error-banner-title">
                <span class="error-icon-badge">⚠️</span>
                <h4>知不足而自反 ‧ 錯因深度診斷</h4>
              </div>
              <span class="saved-badge">已納入錯題錦囊</span>
            </div>

            <div class="error-diagnostic-body">
              <div class="choice-contrast-grid">
                <div class="contrast-col your-pick">
                  <span class="contrast-label">您的失誤選擇</span>
                  <div class="contrast-val">
                    <span class="prefix-tag">選項 {{ String.fromCharCode(65 + (selectedOption ?? 0)) }}</span>
                    <p class="opt-text">{{ currentQuestion.options[selectedOption ?? 0] }}</p>
                  </div>
                  <span class="trap-tip">常見陷阱：字義引申偏差或望文生義</span>
                </div>

                <div class="contrast-col correct-pick">
                  <span class="contrast-label">正解權威考點</span>
                  <div class="contrast-val">
                    <span class="prefix-tag correct">選項 {{ String.fromCharCode(65 + currentQuestion.correctAnswer) }}</span>
                    <p class="opt-text">{{ currentQuestion.options[currentQuestion.correctAnswer] }}</p>
                  </div>
                  <span class="evidence-tip">典籍依據：{{ currentQuestion.targetSentence || currentQuestion.context }}</span>
                </div>
              </div>

              <div class="diagnostic-actions">
                <button class="btn-retry-now" @click="retryQuestion">
                  <ClassicalIcon name="refresh" :size="15" />
                  <span>雪恥再試（即刻刻意練習強化記憶）</span>
                </button>
                <button
                  class="btn-audio-read-explanation"
                  :class="{ active: isSpeaking && speakingTarget === 'explanation' }"
                  @click="speakExplanation"
                >
                  <ClassicalIcon :name="isSpeaking && speakingTarget === 'explanation' ? 'audio-playing' : 'audio'" :size="15" />
                  <span>{{ isSpeaking && speakingTarget === 'explanation' ? '停止朗讀' : '語音朗讀答案與詳析' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 答對融會貫通錦囊 (Correct celebration) -->
          <div v-else class="panel-section correct-celebration-section">
            <div class="correct-banner-header">
              <div class="correct-banner-title">
                <span class="correct-icon-badge">✓</span>
                <h4>正見通達 ‧ 融會貫通</h4>
              </div>
              <span class="exp-plus-badge">+10 EXP {{ currentStreak >= 2 ? '(連擊 +' + Math.min(20, Math.floor(currentStreak / 2) * 5) + ')' : '' }}</span>
            </div>
          </div>

          <!-- 原文出處與上下文 (Context) -->
          <div class="panel-section context-section">
            <h5 class="section-heading">
              <ClassicalIcon name="scroll" :size="15" />
              <span>【原文出處與上下文】{{ currentQuestion.source.workTitle }} {{ currentQuestion.source.chapterTitle }}</span>
            </h5>
            <div class="context-body classical-text">
              <p class="context-paragraph">{{ currentQuestion.context }}</p>
            </div>
          </div>

          <!-- 白話通譯 (Vernacular) -->
          <div class="panel-section vernacular-section">
            <h5 class="section-heading">
              <ClassicalIcon name="feather" :size="15" />
              <span>【白話文通譯】</span>
            </h5>
            <p class="vernacular-body">{{ currentQuestion.vernacular }}</p>
          </div>

          <!-- 答案解析 (Explanation) -->
          <div class="panel-section explanation-section">
            <div class="explanation-heading-row">
              <h5 class="section-heading">
                <ClassicalIcon name="sparkle" :size="15" />
                <span>【答案考點詳析】</span>
              </h5>
              <button
                class="btn-audio-inline-read"
                :class="{ active: isSpeaking && speakingTarget === 'explanation' }"
                @click="speakExplanation"
              >
                <ClassicalIcon :name="isSpeaking && speakingTarget === 'explanation' ? 'audio-playing' : 'audio'" :size="13" />
                <span>{{ isSpeaking && speakingTarget === 'explanation' ? '停止朗讀' : '朗讀詳解' }}</span>
              </button>
            </div>
            <p class="explanation-body">{{ currentQuestion.explanation }}</p>
          </div>

          <!-- 深度析讀 (Analysis) -->
          <div v-if="currentQuestion.analysis" class="panel-section analysis-section">
            <h5 class="section-heading">
              <ClassicalIcon name="crown" :size="15" />
              <span>【義理與文學深度析讀】</span>
            </h5>
            <p class="analysis-body">{{ currentQuestion.analysis }}</p>
          </div>

          <!-- 現代生活連結 (Modern Link) -->
          <div v-if="currentQuestion.modernLink" class="panel-section modern-link-section">
            <h5 class="section-heading">
              <ClassicalIcon name="flame" :size="15" />
              <span>【現代生活啟示與心靈共鳴】</span>
            </h5>
            <p class="modern-body">{{ currentQuestion.modernLink }}</p>
          </div>

          <!-- Next Button -->
          <div class="feedback-actions">
            <button class="btn btn-primary next-action-btn" @click="nextQuestion">
              <span>{{ isLastQuestion ? '查看通關結算' : '下一題 →' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mode 4: Settlement Result State -->
    <div v-else-if="mode === 'result'" class="result-settlement-container">
      <div class="settlement-card">
        <div class="settlement-seal">
          <ClassicalIcon name="crown" :size="32" color="var(--c-gold)" />
        </div>

        <h2 class="settlement-title">通關結算 ‧ 策考評級</h2>
        <div class="rank-title-banner">{{ rankTitle }}</div>

        <div class="settlement-score-ring">
          <span class="score-num">{{ scorePercentage }}%</span>
          <span class="score-fraction">{{ correctCount }} / {{ currentQuiz.length }} 題答對</span>
        </div>

        <div v-if="sessionExpEarned > 0" class="settlement-exp-tag">
          🌟 本次考驗共獲得 <strong>+{{ sessionExpEarned }} EXP</strong>
        </div>

        <div class="settlement-stars">
          <span
            v-for="s in 3"
            :key="s"
            class="star-badge"
            :class="{ filled: starsAwarded >= s }"
          >
            ★
          </span>
        </div>

        <div class="settlement-actions">
          <button class="btn btn-secondary" @click="mode = 'map'">返回關卡地圖</button>
          <button
            v-if="currentStage"
            class="btn btn-primary"
            @click="startStageQuest(currentStage)"
          >
            再試一次
          </button>
        </div>
      </div>

      <!-- Detailed Review -->
      <div class="session-review-list">
        <h3 class="review-heading">逐題回顧剖析 ({{ currentQuiz.length }} 題)</h3>
        <div
          v-for="(q, idx) in currentQuiz"
          :key="q.id"
          class="review-card"
          :class="{ correct: userAnswers[idx] === q.correctAnswer, incorrect: userAnswers[idx] !== q.correctAnswer }"
        >
          <div class="review-top">
            <span class="q-seq">第 {{ idx + 1 }} 題</span>
            <span class="result-label">
              {{ userAnswers[idx] === q.correctAnswer ? '✓ 答對' : '✕ 失誤' }}
            </span>
          </div>

          <p class="review-question">{{ q.question }}</p>

          <div class="review-answer-row">
            <span class="ans-label">您的作答：</span>
            <span class="ans-val" :class="{ wrong: userAnswers[idx] !== q.correctAnswer }">
              {{ userAnswers[idx] !== -1 ? q.options[userAnswers[idx]] : '未作答' }}
            </span>
          </div>

          <div v-if="userAnswers[idx] !== q.correctAnswer" class="review-answer-row">
            <span class="ans-label">正確解答：</span>
            <span class="ans-val correct">{{ q.options[q.correctAnswer] }}</span>
          </div>

          <div class="review-explanation">
            <strong>解析：</strong>{{ q.explanation }}
          </div>
        </div>
      </div>
    </div>

    <!-- 單元導讀指南彈窗 (Stage Guide Modal) -->
    <div v-if="activeStageGuide" class="modal-backdrop" @click.self="activeStageGuide = null">
      <div class="stage-guide-card">
        <div class="modal-header">
          <div class="modal-title-row">
            <ClassicalIcon :name="activeStageGuide.icon as any" :size="22" :color="activeStageGuide.themeColor" />
            <h3>{{ activeStageGuide.title }} ‧ 單元導讀指南</h3>
          </div>
          <button class="modal-close-btn" @click="activeStageGuide = null">✕</button>
        </div>
        <div class="guide-modal-body">
          <div class="guide-block wisdom-block">
            <h4>🌟 核心精義</h4>
            <p>{{ activeStageGuide.studyGuide?.coreWisdom || activeStageGuide.description }}</p>
          </div>

          <div v-if="activeStageGuide.studyGuide?.highYieldPoints?.length" class="guide-block points-block">
            <h4>🎯 必考核心知識點</h4>
            <ul>
              <li v-for="(pt, pIdx) in activeStageGuide.studyGuide.highYieldPoints" :key="pIdx">{{ pt }}</li>
            </ul>
          </div>

          <div v-if="activeStageGuide.studyGuide?.commonTraps?.length" class="guide-block traps-block">
            <h4>⚠️ 易混陷阱避坑</h4>
            <ul>
              <li v-for="(tr, tIdx) in activeStageGuide.studyGuide.commonTraps" :key="tIdx">{{ tr }}</li>
            </ul>
          </div>

          <div v-if="activeStageGuide.studyGuide?.masteryTips" class="guide-block tips-block">
            <h4>💡 提分通關心法</h4>
            <p>{{ activeStageGuide.studyGuide.masteryTips }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="activeStageGuide = null">返回地圖</button>
          <button class="btn btn-primary" @click="startStageQuest(activeStageGuide); activeStageGuide = null">
            <span>即刻挑戰本關</span>
            <ClassicalIcon name="arrow-right" :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- 錦囊提點彈窗 (Lifeline Hint Modal) -->
    <div v-if="isHintModalOpen && currentQuestion" class="modal-backdrop" @click.self="isHintModalOpen = false">
      <div class="hint-modal-card">
        <div class="modal-header">
          <div class="modal-title-row">
            <ClassicalIcon name="scroll" :size="20" color="var(--c-gold)" />
            <h3>原典錦囊 ‧ 提點線索</h3>
          </div>
          <button class="modal-close-btn" @click="isHintModalOpen = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="hint-eyebrow">【關鍵原典文脈】</p>
          <p class="hint-text classical-text">{{ currentQuestion.targetSentence || currentQuestion.context.slice(0, 90) }}...</p>
          <p class="hint-tip">💡 <strong>提點心法：</strong>請回歸「{{ currentQuestion.source.workTitle }}」之核心文義與語境詞句對照。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="isHintModalOpen = false">領受錦囊，繼續作答</button>
        </div>
      </div>
    </div>

    <!-- 榮登新境界 ‧ 等級晉升慶賀彈窗 (Level-Up Celebration Modal) -->
    <div v-if="newRankCelebration" class="modal-backdrop" @click.self="newRankCelebration = null">
      <div class="levelup-card">
        <div class="levelup-badge-halo">
          <span class="rank-icon-large">{{ newRankCelebration.icon }}</span>
        </div>
        <h2 class="levelup-title">榮登新境界 ‧ 及第進階</h2>
        <div class="new-rank-name">{{ newRankCelebration.title }}</div>
        <p class="levelup-congrats">
          恭喜學友文思日進，格物致知，積累深厚學養，榮升為<strong>「{{ newRankCelebration.title }}」</strong>！
        </p>
        <button class="btn btn-primary levelup-confirm-btn" @click="newRankCelebration = null">
          恭承嘉許，砥礪前行
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.quest-view-header {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.view-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-gold-glow);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  margin-bottom: var(--sp-3);
}

.view-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
  letter-spacing: 0.08em;
}

.view-subtitle {
  color: var(--c-text-secondary);
  font-size: var(--text-base);
  max-width: 760px;
  margin: 0 auto var(--sp-6);
  line-height: 1.6;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: var(--sp-3);
}

.mode-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.mode-tab-btn:hover,
.mode-tab-btn.active {
  background: var(--c-bg-elevated);
  border-color: var(--c-gold);
  color: var(--c-gold);
}

/* Loading Box */
.loading-box {
  text-align: center;
  padding: var(--sp-12) var(--sp-4);
  color: var(--c-text-muted);
}

.spin-icon {
  animation: spin 3s linear infinite;
  color: var(--c-gold);
  margin-bottom: var(--sp-3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Quick Quiz Banner */
.quick-quiz-banner {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  margin-bottom: var(--sp-8);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

@media (min-width: 768px) {
  .quick-quiz-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.banner-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-lg);
  color: var(--c-gold);
  margin-bottom: var(--sp-1);
}

.banner-desc {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  margin: 0;
}

.banner-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.count-buttons {
  display: flex;
  gap: 4px;
  background: var(--c-bg-deep);
  padding: 3px;
  border-radius: var(--radius-md);
}

.quick-count-btn {
  background: transparent;
  border: none;
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.quick-count-btn.active {
  background: var(--c-bg-elevated);
  color: var(--c-gold);
  font-weight: 600;
}

.start-quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-text-primary);
  font-size: var(--text-xl);
  margin-bottom: var(--sp-5);
}

/* Stages Grid */
.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--sp-4);
  margin-bottom: var(--sp-8);
}

.stage-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  display: flex;
  flex-direction: column;
  transition: all var(--duration-normal);
  position: relative;
}

.stage-card.unlocked:hover {
  transform: translateY(-4px);
  border-color: var(--c-gold);
  background: var(--c-bg-card-hover);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.stage-card.locked {
  opacity: 0.55;
  filter: grayscale(0.6);
}

.stage-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-4);
}

.stage-order-badge {
  background: var(--c-bg-deep);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
  font-size: var(--text-xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.stage-stars {
  display: flex;
  gap: 2px;
}

.star-item {
  color: var(--c-text-muted);
  font-size: var(--text-base);
}

.star-item.filled {
  color: #ffb703;
}

.stage-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--sp-4);
}

.stage-icon-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-3);
}

.stage-card-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-1);
}

.stage-card-subtitle {
  font-size: var(--text-xs);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.stage-card-desc {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--sp-3);
}

.stage-meta-row {
  display: flex;
  gap: var(--sp-3);
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.best-score {
  color: var(--c-gold-light);
  font-weight: 600;
}

.stage-card-action {
  border-top: 1px solid var(--c-border-subtle);
  padding-top: var(--sp-3);
  display: flex;
  gap: var(--sp-2);
}

.stage-guide-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.stage-guide-btn:hover {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.stage-enter-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--c-gold);
  color: var(--c-bg-deep);
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--duration-fast);
}

.stage-enter-btn:hover {
  opacity: 0.9;
}

.stage-locked-tag {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--c-text-muted);
  font-size: var(--text-xs);
  padding: 0.45rem 0;
}

/* Quiz Top Bar */
.quiz-active-container {
  max-width: 840px;
  margin: 0 auto;
}

.quiz-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-3);
}

.quiz-progress-info {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.stage-indicator-text {
  font-size: var(--text-sm);
  color: var(--c-gold);
  font-weight: 600;
}

.index-indicator-text {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.streak-badge-animated {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: linear-gradient(135deg, rgba(200, 90, 60, 0.25), rgba(255, 183, 3, 0.2));
  border: 1px solid rgba(255, 183, 3, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  color: #ffb703;
  animation: pulseStreak 1.8s infinite;
}

@keyframes pulseStreak {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.quit-quiz-btn {
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: var(--text-xs);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.quit-quiz-btn:hover {
  color: var(--c-text-primary);
  border-color: var(--c-border-accent);
}

/* Quiz Toolbar (Lifelines & Audio) */
.quiz-toolbar {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--sp-2) var(--sp-3);
  margin-bottom: var(--sp-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.lifeline-group,
.audio-control-group {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.lifeline-btn {
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold);
  font-size: var(--text-xs);
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.lifeline-btn:hover:not(.disabled) {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
}

.lifeline-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.audio-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.audio-toggle-btn.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

.rate-select-pills {
  display: flex;
  gap: 2px;
  background: var(--c-bg-deep);
  padding: 2px;
  border-radius: var(--radius-sm);
}

.rate-pill-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: 11px;
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  cursor: pointer;
}

.rate-pill-btn.active {
  background: var(--c-bg-elevated);
  color: var(--c-gold);
  font-weight: 600;
}

/* Progress Track */
.progress-bar-track {
  height: 4px;
  background: var(--c-bg-deep);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--sp-5);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold), #e0a96d);
  transition: width var(--duration-normal) var(--ease-out);
}

/* Question Main Card */
.question-main-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.q-meta-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.q-type-badge {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
  font-size: var(--text-xs);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.q-source-tag {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.exp-session-tag {
  margin-left: auto;
  font-size: var(--text-xs);
  color: #ffb703;
  font-weight: 600;
}

.q-stem-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.q-stem {
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  line-height: 1.6;
  color: var(--c-text-primary);
  margin: 0;
  flex: 1;
}

.q-speech-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration-fast);
}

.q-speech-btn:hover,
.q-speech-btn.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

/* Options Container */
.options-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.option-choice-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  font-size: var(--text-base);
  text-align: left;
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
}

.option-choice-btn:hover:not(.disabled) {
  border-color: var(--c-gold);
  background: var(--c-bg-card-hover);
  transform: translateX(4px);
}

.option-choice-btn.selected {
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
}

.option-choice-btn.correct {
  border-color: #5b8a72 !important;
  background: rgba(91, 138, 114, 0.15) !important;
  color: #88c0a0 !important;
}

.option-choice-btn.incorrect {
  border-color: #c85a3c !important;
  background: rgba(200, 90, 60, 0.15) !important;
  color: #e58f7a !important;
}

.option-choice-btn.eliminated {
  opacity: 0.3;
  text-decoration: line-through;
  cursor: not-allowed;
}

.option-choice-btn.disabled {
  cursor: default;
}

.option-prefix {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--c-gold);
  flex-shrink: 0;
}

.option-label-text {
  flex: 1;
  line-height: 1.5;
}

.option-speech-trigger {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  opacity: 0.6;
  transition: opacity var(--duration-fast);
}

.option-speech-trigger:hover,
.option-speech-trigger.active {
  opacity: 1;
  color: var(--c-gold);
}

.answer-stamp {
  font-size: var(--text-xs);
  font-weight: 700;
  color: #88c0a0;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  background: rgba(91, 138, 114, 0.2);
}

.answer-stamp.wrong {
  color: #e58f7a;
  background: rgba(200, 90, 60, 0.2);
}

.eliminated-tag {
  font-size: 11px;
  color: var(--c-text-muted);
}

/* Feedback Panel */
.feedback-panel {
  border-top: 1px solid var(--c-border-subtle);
  padding-top: var(--sp-5);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.feedback-status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--sp-4);
}

.feedback-status-banner.is-correct {
  background: rgba(91, 138, 114, 0.15);
  border: 1px solid rgba(91, 138, 114, 0.4);
  color: #88c0a0;
}

.feedback-status-banner.is-wrong {
  background: rgba(200, 90, 60, 0.15);
  border: 1px solid rgba(200, 90, 60, 0.4);
  color: #e58f7a;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: var(--text-sm);
}

.source-jump-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.source-jump-btn:hover {
  color: var(--c-gold);
  border-color: var(--c-gold);
}

/* Error Diagnostic Section */
.error-diagnostic-section {
  background: rgba(200, 90, 60, 0.08);
  border: 1px solid rgba(200, 90, 60, 0.35);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.error-banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-3);
}

.error-banner-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.error-banner-title h4 {
  font-size: var(--text-sm);
  color: #e58f7a;
  font-weight: 700;
  margin: 0;
}

.saved-badge {
  font-size: 11px;
  background: rgba(200, 90, 60, 0.2);
  color: #e58f7a;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.choice-contrast-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

@media (min-width: 640px) {
  .choice-contrast-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.contrast-col {
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contrast-col.your-pick {
  border-color: rgba(200, 90, 60, 0.4);
}

.contrast-col.correct-pick {
  border-color: rgba(91, 138, 114, 0.5);
}

.contrast-label {
  font-size: 11px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.contrast-val {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.prefix-tag {
  font-size: 11px;
  font-weight: 700;
  color: #e58f7a;
  background: rgba(200, 90, 60, 0.15);
  padding: 0.1rem 0.35rem;
  border-radius: 2px;
}

.prefix-tag.correct {
  color: #88c0a0;
  background: rgba(91, 138, 114, 0.2);
}

.opt-text {
  font-size: var(--text-sm);
  color: var(--c-text-primary);
  margin: 0;
}

.trap-tip {
  font-size: 11px;
  color: #e58f7a;
  margin-top: auto;
}

.evidence-tip {
  font-size: 11px;
  color: #88c0a0;
  margin-top: auto;
  line-height: 1.4;
}

.diagnostic-actions {
  display: flex;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.btn-retry-now {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #c85a3c;
  color: #fff;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--duration-fast);
}

.btn-retry-now:hover {
  opacity: 0.9;
}

.btn-audio-read-explanation {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-audio-read-explanation:hover,
.btn-audio-read-explanation.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

/* Correct Celebration Section */
.correct-celebration-section {
  background: rgba(91, 138, 114, 0.1);
  border: 1px solid rgba(91, 138, 114, 0.3);
  border-radius: var(--radius-md);
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-4);
}

.correct-banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.correct-banner-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.correct-icon-badge {
  color: #88c0a0;
  font-weight: 700;
}

.correct-banner-title h4 {
  font-size: var(--text-sm);
  color: #88c0a0;
  margin: 0;
  font-weight: 700;
}

.exp-plus-badge {
  font-size: var(--text-xs);
  color: #ffb703;
  font-weight: 700;
}

/* Generic Panel Sections */
.panel-section {
  background: var(--c-bg-deep);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-3);
  border: 1px solid var(--c-border-subtle);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.explanation-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-2);
}

.explanation-heading-row .section-heading {
  margin-bottom: 0;
}

.btn-audio-inline-read {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: 11px;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.btn-audio-inline-read:hover,
.btn-audio-inline-read.active {
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.context-paragraph,
.vernacular-body,
.explanation-body,
.analysis-body,
.modern-body {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--c-text-primary);
  margin: 0;
}

.feedback-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--sp-5);
}

.next-action-btn {
  padding: 0.65rem 1.8rem;
  font-size: var(--text-base);
  font-weight: 700;
}

/* Result Settlement Container */
.result-settlement-container {
  max-width: 800px;
  margin: 0 auto;
}

.settlement-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  padding: var(--sp-8);
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  margin-bottom: var(--sp-8);
}

.settlement-seal {
  margin-bottom: var(--sp-3);
}

.settlement-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.rank-title-banner {
  display: inline-block;
  background: var(--c-gold-glow);
  border: 1px solid var(--c-gold);
  color: var(--c-gold);
  padding: 0.35rem 1.2rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
  margin-bottom: var(--sp-5);
}

.settlement-score-ring {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: var(--sp-4);
}

.score-num {
  font-size: clamp(2.5rem, 6vw, 3.8rem);
  font-weight: 900;
  color: var(--c-gold);
}

.score-fraction {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
}

.settlement-exp-tag {
  font-size: var(--text-sm);
  color: #ffb703;
  margin-bottom: var(--sp-4);
}

.settlement-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: var(--sp-6);
}

.star-badge {
  font-size: 2rem;
  color: var(--c-text-muted);
}

.star-badge.filled {
  color: #ffb703;
}

.settlement-actions {
  display: flex;
  justify-content: center;
  gap: var(--sp-4);
}

/* Detailed Review */
.session-review-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.review-heading {
  font-size: var(--text-lg);
  color: var(--c-text-primary);
}

.review-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
}

.review-card.correct {
  border-left: 4px solid #5b8a72;
}

.review-card.incorrect {
  border-left: 4px solid #c85a3c;
}

.review-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.review-question {
  font-size: var(--text-base);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-3);
}

.review-answer-row {
  font-size: var(--text-xs);
  margin-bottom: 0.25rem;
}

.ans-label {
  color: var(--c-text-muted);
}

.ans-val.wrong {
  color: #e58f7a;
}

.ans-val.correct {
  color: #88c0a0;
  font-weight: 600;
}

.review-explanation {
  margin-top: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  line-height: 1.5;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  z-index: 1000;
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.stage-guide-card,
.hint-modal-card,
.levelup-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  max-width: 600px;
  width: 100%;
  animation: scaleUp var(--duration-fast) var(--ease-out);
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-4) var(--sp-5);
  border-bottom: 1px solid var(--c-border-subtle);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-title-row h3 {
  font-size: var(--text-base);
  color: var(--c-text-primary);
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: var(--text-base);
  cursor: pointer;
}

.guide-modal-body,
.modal-body {
  padding: var(--sp-5);
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.guide-block h4 {
  font-size: var(--text-sm);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.guide-block p {
  font-size: var(--text-sm);
  color: var(--c-text-primary);
  line-height: 1.6;
  margin: 0;
}

.guide-block ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--c-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.hint-eyebrow {
  font-size: var(--text-xs);
  color: var(--c-gold);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.hint-text {
  font-size: var(--text-base);
  color: var(--c-text-primary);
  background: var(--c-bg-deep);
  padding: var(--sp-3);
  border-radius: var(--radius-sm);
  line-height: 1.6;
  margin-bottom: var(--sp-3);
}

.hint-tip {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  border-top: 1px solid var(--c-border-subtle);
}

/* Level Up Card */
.levelup-card {
  max-width: 440px;
  text-align: center;
  padding: var(--sp-8) var(--sp-6);
}

.levelup-badge-halo {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--sp-4);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 183, 3, 0.3) 0%, rgba(255, 183, 3, 0) 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--c-gold);
}

.rank-icon-large {
  font-size: 2.5rem;
}

.levelup-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.new-rank-name {
  font-size: 2rem;
  font-weight: 900;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-4);
}

.levelup-congrats {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--sp-6);
}

.levelup-confirm-btn {
  width: 100%;
  padding: 0.65rem;
  font-weight: 700;
}
</style>
