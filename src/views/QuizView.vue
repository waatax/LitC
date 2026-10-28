<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { QuestQuestion, QuestStage } from '@/types/content'
import ClassicalIcon from '@/components/ClassicalIcon.vue'

const router = useRouter()

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

// Storage keys
const STAGE_PROGRESS_KEY = 'litc_quest_stage_progress'
const MISSED_QUESTIONS_KEY = 'litc_quest_missed_ids'

// User progress record per stage: { [stageId]: { stars: number, bestScore: number, completedCount: number } }
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
    // Attempt dynamic import of 300 quest bank
    const module = await import('@/data/quest_bank_300')
    allQuestions.value = module.QUEST_BANK_300 || []
    stages.value = module.QUEST_STAGES || []
  } catch (err) {
    console.warn('300 Quest bank loading in progress, falling back to legacy quiz bank...', err)
    // Fallback if compilation/build still in flight
    try {
      const legacyMod = await import('@/data/quiz_bank')
      // Adapt legacy questions
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

      // Default stages if not defined
      stages.value = [
        { id: 'stage-1', order: 1, title: '第一關：啟蒙發軔', subtitle: '蒙養正性 ‧ 聖賢發端', description: '論語禮記蒙學精選', targetCount: 30, unlockedByDefault: true, icon: 'scholar', themeColor: '#2c4f5e' },
        { id: 'stage-2', order: 2, title: '第二關：儒家心性', subtitle: '修己安人 ‧ 內聖外王', description: '孔孟心性浩然之氣', targetCount: 35, icon: 'crown', themeColor: '#b58d3d' },
        { id: 'stage-3', order: 3, title: '第三關：道法自然', subtitle: '逍遙無待 ‧ 齊物通神', description: '老莊列子玄妙之門', targetCount: 35, icon: 'leaf', themeColor: '#5b8a72' },
        { id: 'stage-4', order: 4, title: '第四關：經世百家', subtitle: '兼愛法度 ‧ 謀略縱橫', description: '墨子韓非孫子兵法', targetCount: 35, icon: 'sword', themeColor: '#8b5e5e' },
        { id: 'stage-5', order: 5, title: '第五關：史家絕唱', subtitle: '興衰沈浮 ‧ 英雄風雲', description: '史記左傳戰國策名篇', targetCount: 35, icon: 'shield', themeColor: '#8a6e5b' },
        { id: 'stage-6', order: 6, title: '第六關：唐音浩蕩', subtitle: '盛唐風骨 ‧ 李杜千載', description: '盛唐詩韻邊塞壯志', targetCount: 35, icon: 'feather', themeColor: '#4a6fa5' },
        { id: 'stage-7', order: 7, title: '第七關：宋韻悠悠', subtitle: '大江東去 ‧ 尋尋覓覓', description: '蘇辛李清照宋詞雅境', targetCount: 35, icon: 'sparkle', themeColor: '#c9a96e' },
        { id: 'stage-8', order: 8, title: '第八關：文以載道', subtitle: '古文觀止 ‧ 韓柳歐蘇', description: '唐宋名家散文名篇', targetCount: 30, icon: 'book-open', themeColor: '#a64b4b' },
        { id: 'stage-9', order: 9, title: '第九關：字詞玄機', subtitle: '微言大義 ‧ 融會貫通', description: '虛詞句式倒裝融通', targetCount: 30, icon: 'flame', themeColor: '#c85a3c' },
      ]
    } catch (e) {
      console.error('All quiz banks failed to load:', e)
    }
  } finally {
    isLoading.value = false
  }

  // Load local progress
  loadProgress()
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

// Stage Unlock Checking
function isStageUnlocked(stage: QuestStage, index: number): boolean {
  if (index === 0 || stage.unlockedByDefault) return true
  const prevStage = stages.value[index - 1]
  if (!prevStage) return true
  const prevProg = stageProgress.value[prevStage.id]
  return prevProg && prevProg.completed && prevProg.bestScore >= 60
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
  mode.value = 'quiz'
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
  mode.value = 'quiz'
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
  mode.value = 'quiz'
}

// Active question
const currentQuestion = computed(() => currentQuiz.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === currentQuiz.value.length - 1)

function selectOption(index: number) {
  if (isAnswerSubmitted.value) return
  selectedOption.value = index
  isAnswerSubmitted.value = true
  userAnswers.value[currentIndex.value] = index

  // Check correct
  if (index === currentQuestion.value.correctAnswer) {
    currentStreak.value++
    if (currentStreak.value > maxStreak.value) maxStreak.value = currentStreak.value
    // If was missed, remove from missed list
    removeMissed(currentQuestion.value.id)
  } else {
    currentStreak.value = 0
    saveMissed(currentQuestion.value.id)
  }
}

function nextQuestion() {
  if (isLastQuestion.value) {
    // Settle score
    if (currentStage.value) {
      saveProgress(currentStage.value.id, starsAwarded.value, scorePercentage.value)
    }
    mode.value = 'result'
  } else {
    currentIndex.value++
    selectedOption.value = null
    isAnswerSubmitted.value = false
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
        以 300 題精華題庫逐關問道，每題俱全「答案詳解、原文上下文、流暢白話通譯、深入析讀與現代生活啟示」
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
      <p>正在載入 300 題古文闖關題庫與六藝關卡...</p>
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
          <p class="banner-desc">從全庫 300 題中自由選題抽考，考驗綜合國學底蘊。</p>
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
        <div
          v-for="qid in missedQuestionIds"
          :key="qid"
          class="missed-card"
        >
          <template v-if="allQuestions.find((q) => q.id === qid)">
            <div class="missed-card-header">
              <span class="missed-source-tag">
                {{ allQuestions.find((q) => q.id === qid)?.source.workTitle }}
                {{ allQuestions.find((q) => q.id === qid)?.source.chapterTitle }}
              </span>
              <button
                class="remove-missed-btn"
                title="已熟練，移出錦囊"
                @click="removeMissed(qid)"
              >
                ✕ 標記已掌握
              </button>
            </div>

            <p class="missed-q-text">{{ allQuestions.find((q) => q.id === qid)?.question }}</p>

            <div class="missed-correct-box">
              <span class="correct-label">正確答案：</span>
              <span class="correct-text">
                {{ allQuestions.find((q) => q.id === qid)?.options[allQuestions.find((q) => q.id === qid)!.correctAnswer] }}
              </span>
            </div>

            <div class="missed-explanation-preview">
              {{ allQuestions.find((q) => q.id === qid)?.explanation }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mode 3: In-Quiz Question Interface -->
    <div v-else-if="mode === 'quiz' && currentQuestion" class="quiz-active-container">
      <!-- Quiz Progress & Streak Bar -->
      <div class="quiz-top-bar">
        <div class="quiz-progress-info">
          <span class="stage-indicator-text">
            {{ currentStage ? currentStage.title : '翰林自由策考' }}
          </span>
          <span class="index-indicator-text">
            第 <strong>{{ currentIndex + 1 }}</strong> / {{ currentQuiz.length }} 題
          </span>
        </div>

        <div v-if="currentStreak >= 2" class="streak-badge">
          <span>🔥 連對 {{ currentStreak }} 題</span>
        </div>

        <button class="quit-quiz-btn" @click="mode = 'map'">退出考驗</button>
      </div>

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
        </div>

        <h3 class="q-stem classical-text-lg">
          {{ currentQuestion.question }}
        </h3>

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
              disabled: isAnswerSubmitted
            }"
            :disabled="isAnswerSubmitted"
            @click="selectOption(idx)"
          >
            <span class="option-prefix">{{ String.fromCharCode(65 + idx) }}</span>
            <span class="option-label-text">{{ opt }}</span>
            <span v-if="isAnswerSubmitted && idx === currentQuestion.correctAnswer" class="answer-stamp">
              ✓ 正確
            </span>
            <span v-else-if="isAnswerSubmitted && selectedOption === idx" class="answer-stamp wrong">
              ✕ 失誤
            </span>
          </button>
        </div>

        <!-- 錦囊玉牒 (Immediate Deep Learning Feedback Panel) -->
        <div v-if="isAnswerSubmitted" class="feedback-panel">
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

          <!-- 原文上下文 (Context) -->
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
            <h5 class="section-heading">
              <ClassicalIcon name="sparkle" :size="15" />
              <span>【答案考點詳析】</span>
            </h5>
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

      <!-- Detailed Review of this session -->
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
  max-width: 720px;
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
}

.stage-enter-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold);
  padding: 0.45rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--duration-fast);
}

.stage-enter-btn:hover {
  background: var(--c-gold);
  color: var(--c-bg-deep);
}

.stage-locked-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--c-text-muted);
  font-size: var(--text-xs);
}

/* In-Quiz Layout */
.quiz-active-container {
  max-width: 850px;
  margin: 0 auto;
}

.quiz-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-2);
}

.quiz-progress-info {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}

.stage-indicator-text {
  font-size: var(--text-sm);
  color: var(--c-gold);
  font-weight: 600;
}

.index-indicator-text {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
}

.streak-badge {
  background: rgba(230, 57, 70, 0.2);
  border: 1px solid rgba(230, 57, 70, 0.4);
  color: #ff6b6b;
  font-size: var(--text-xs);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.quit-quiz-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: var(--text-xs);
  cursor: pointer;
}

.quit-quiz-btn:hover {
  color: var(--c-text-primary);
}

.progress-bar-track {
  height: 4px;
  background: var(--c-bg-card);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--sp-5);
}

.progress-bar-fill {
  height: 100%;
  background: var(--c-gold);
  transition: width var(--duration-normal);
}

.question-main-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-xl);
  padding: var(--sp-6);
}

.q-meta-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: var(--sp-4);
}

.q-type-badge {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
  font-size: var(--text-xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.q-source-tag {
  background: var(--c-bg-deep);
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.q-stem {
  color: var(--c-text-primary);
  font-size: var(--text-xl);
  line-height: 1.6;
  margin-bottom: var(--sp-6);
  font-weight: 600;
}

/* Options */
.options-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.option-choice-btn {
  display: flex;
  align-items: center;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-lg);
  color: var(--c-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-align: left;
  font-size: var(--text-base);
}

.option-choice-btn:not(:disabled):hover {
  border-color: var(--c-gold);
  background: var(--c-bg-elevated);
}

.option-prefix {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--text-xs);
  margin-right: var(--sp-4);
  color: var(--c-gold);
  flex-shrink: 0;
}

.option-label-text {
  flex: 1;
}

.answer-stamp {
  font-size: var(--text-xs);
  font-weight: 700;
  color: #4ade80;
  margin-left: var(--sp-3);
}

.answer-stamp.wrong {
  color: #f87171;
}

.option-choice-btn.correct {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.15);
}

.option-choice-btn.incorrect {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

/* Feedback Panel (錦囊玉牒) */
.feedback-panel {
  border-top: 1px solid var(--c-border-accent);
  padding-top: var(--sp-5);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.feedback-status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
}

.feedback-status-banner.is-correct {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

.feedback-status-banner.is-wrong {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.source-jump-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-primary);
  font-size: var(--text-xs);
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.panel-section {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-xs);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
  letter-spacing: 0.05em;
}

.context-paragraph {
  color: var(--c-text-primary);
  font-size: var(--text-base);
  line-height: 1.7;
  margin: 0;
}

.vernacular-body,
.explanation-body,
.analysis-body,
.modern-body {
  font-size: var(--text-sm);
  line-height: 1.6;
  margin: 0;
  color: var(--c-text-secondary);
}

.modern-body {
  color: var(--c-gold-light);
}

.feedback-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--sp-2);
}

.next-action-btn {
  padding: 0.6rem 1.8rem;
  font-size: var(--text-base);
}

/* Result Settlement */
.result-settlement-container {
  max-width: 800px;
  margin: 0 auto;
}

.settlement-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-xl);
  padding: var(--sp-8);
  text-align: center;
  margin-bottom: var(--sp-8);
}

.settlement-seal {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-gold-glow);
  border: 1px solid var(--c-border-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-3);
}

.settlement-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-1);
}

.rank-title-banner {
  display: inline-block;
  background: var(--c-gold);
  color: var(--c-bg-deep);
  font-weight: 700;
  font-size: var(--text-sm);
  padding: 0.25rem 1rem;
  border-radius: var(--radius-full);
  margin-bottom: var(--sp-5);
}

.settlement-score-ring {
  margin-bottom: var(--sp-4);
}

.score-num {
  display: block;
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--c-gold);
  font-family: var(--font-classical);
}

.score-fraction {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
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

/* Review List */
.session-review-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.review-heading {
  font-size: var(--text-lg);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.review-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-4);
}

.review-card.correct {
  border-left: 4px solid #22c55e;
}

.review-card.incorrect {
  border-left: 4px solid #ef4444;
}

.review-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}

.q-seq {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.result-label {
  font-size: var(--text-xs);
  font-weight: 700;
}

.review-card.correct .result-label { color: #4ade80; }
.review-card.incorrect .result-label { color: #f87171; }

.review-question {
  color: var(--c-text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--sp-3);
}

.review-answer-row {
  font-size: var(--text-sm);
  margin-bottom: var(--sp-1);
}

.ans-label { color: var(--c-text-muted); }
.ans-val.correct { color: #4ade80; }
.ans-val.wrong { color: #f87171; text-decoration: line-through; }

.review-explanation {
  background: var(--c-bg-deep);
  border-radius: var(--radius-sm);
  padding: var(--sp-3);
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  line-height: 1.5;
  margin-top: var(--sp-2);
}

/* Missed Notebook */
.missed-notebook-container {
  max-width: 800px;
  margin: 0 auto;
}

.notebook-header {
  text-align: center;
  margin-bottom: var(--sp-6);
}

.notebook-title {
  font-size: var(--text-2xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.notebook-desc {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
}

.missed-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.missed-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-4);
}

.missed-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}

.missed-source-tag {
  font-size: var(--text-xs);
  color: var(--c-gold);
}

.remove-missed-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: var(--text-xs);
  cursor: pointer;
}

.remove-missed-btn:hover {
  color: var(--c-gold);
}

.missed-q-text {
  color: var(--c-text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--sp-3);
}

.missed-correct-box {
  font-size: var(--text-sm);
  margin-bottom: var(--sp-2);
}

.correct-label { color: var(--c-text-muted); }
.correct-text { color: #4ade80; font-weight: 600; }

.missed-explanation-preview {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  background: var(--c-bg-deep);
  padding: var(--sp-3);
  border-radius: var(--radius-sm);
  line-height: 1.5;
}

.empty-missed-state {
  text-align: center;
  padding: var(--sp-12) var(--sp-4);
  color: var(--c-text-secondary);
}

.empty-missed-state h3 {
  color: var(--c-text-primary);
  margin-top: var(--sp-3);
  margin-bottom: var(--sp-1);
}
</style>
