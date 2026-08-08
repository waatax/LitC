<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { QuizQuestion } from '@/data/quiz_bank'
import ClassicalTextLookup from '@/components/ClassicalTextLookup.vue'

const router = useRouter()

type QuizState = 'setup' | 'quiz' | 'result'
const state = ref<QuizState>('setup')

const questionCounts = [5, 10, 20, 40]
const selectedCount = ref(5)
const isQuizLoading = ref(false)

const currentQuiz = ref<QuizQuestion[]>([])
const userAnswers = ref<number[]>([])
const currentIndex = ref(0)
const selectedOption = ref<number | null>(null)

async function startQuiz() {
  isQuizLoading.value = true
  // Dynamically import quiz bank to avoid huge initial JS payload
  const module = await import('@/data/quiz_bank')
  const quizBank = module.quizBank
  isQuizLoading.value = false
  
  // Shuffle the quiz bank and take the selected count
  const shuffled = [...quizBank].sort(() => 0.5 - Math.random())
  currentQuiz.value = shuffled.slice(0, selectedCount.value)
  userAnswers.value = new Array(selectedCount.value).fill(-1)
  currentIndex.value = 0
  selectedOption.value = null
  state.value = 'quiz'
}

const currentQuestion = computed(() => currentQuiz.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === currentQuiz.value.length - 1)

function selectOption(index: number) {
  selectedOption.value = index
}

function nextQuestion() {
  if (selectedOption.value === null) return
  
  userAnswers.value[currentIndex.value] = selectedOption.value
  
  if (isLastQuestion.value) {
    state.value = 'result'
  } else {
    currentIndex.value++
    selectedOption.value = userAnswers.value[currentIndex.value] !== -1 
      ? userAnswers.value[currentIndex.value] 
      : null
  }
}

const score = computed(() => {
  let correct = 0
  for (let i = 0; i < currentQuiz.value.length; i++) {
    if (userAnswers.value[i] === currentQuiz.value[i].correctAnswer) {
      correct++
    }
  }
  return correct
})

const scorePercentage = computed(() => {
  return Math.round((score.value / currentQuiz.value.length) * 100)
})

function getQuestionTypeName(type: string) {
  switch(type) {
    case 'fill-in-blank': return '古文填空'
    case 'word-meaning': return '字詞含意'
    case 'analysis': return '解析分析'
    case 'background': return '背景資訊'
    case 'translation': return '白話文釋義'
    default: return '綜合考驗'
  }
}

function goBackToSetup() {
  state.value = 'setup'
}

function goToSource(question: QuizQuestion) {
  if (question.chapterId) {
    let url = `/chapter/${question.chapterId}`
    if (question.passageId) {
      // Find the sentence id if possible, but passage highlighting is easier if we just pass a query or hash
      // The ChapterView currently scrolls to a highlighted word or a sentence ID. We can just route to the chapter.
      // Wait, in ChapterView, we check route.query.highlight or route.query.sentenceId. We don't have sentenceId in QuizQuestion, but we have passageId.
      // The passage element has id="passage-xxx". We can use hash.
      url += `#passage-${question.passageId}`
    }
    router.push(url)
  } else if (question.workId) {
    router.push(`/library?work=${question.workId}`)
  }
}
</script>

<template>
  <div class="quiz-view">
    <header class="view-header">
      <h1 class="view-title">古文考驗</h1>
      <p class="view-subtitle">驗證您的國學底蘊與經典熟悉度</p>
    </header>

    <!-- Setup State -->
    <div v-if="state === 'setup'" class="quiz-card setup-card">
      <h2 class="setup-title">選擇題庫數量</h2>
      <div class="count-selector">
        <button 
          v-for="count in questionCounts" 
          :key="count"
          class="count-btn"
          :class="{ active: selectedCount === count }"
          @click="selectedCount = count"
        >
          {{ count }} 題
        </button>
      </div>
      <p class="setup-desc">本次測驗將從近千題精選古文題庫中隨機抽出。包含填空、釋義、解析與背景知識，須全部作答完畢方能顯示成績。</p>
      <button class="btn btn-primary start-btn" @click="startQuiz" :disabled="isQuizLoading">
        <span v-if="isQuizLoading">⏳ 載入題庫中...</span>
        <span v-else>📝 開始測驗</span>
      </button>
    </div>

    <!-- Quiz State -->
    <div v-if="state === 'quiz'" class="quiz-card question-card">
      <div class="quiz-progress">
        <div class="progress-text">題目 {{ currentIndex + 1 }} / {{ currentQuiz.length }}</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: ((currentIndex + 1) / currentQuiz.length * 100) + '%' }"></div>
        </div>
      </div>

      <div class="question-header">
        <span class="question-type">{{ getQuestionTypeName(currentQuestion.type) }}</span>
      </div>

      <p class="question-text classical-text-lg">
        <ClassicalTextLookup :text="currentQuestion.question" />
      </p>

      <div class="options-list">
        <button 
          v-for="(option, idx) in currentQuestion.options" 
          :key="idx"
          class="option-btn"
          :class="{ selected: selectedOption === idx }"
          @click="selectOption(idx)"
        >
          <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
          <span class="option-text">{{ option }}</span>
        </button>
      </div>

      <div class="quiz-actions">
        <button class="btn btn-primary next-btn" :disabled="selectedOption === null" @click="nextQuestion">
          {{ isLastQuestion ? '交卷' : '下一題' }}
        </button>
      </div>
    </div>

    <!-- Result State -->
    <div v-if="state === 'result'" class="result-container">
      <div class="quiz-card result-summary-card">
        <h2 class="result-title">測驗結果</h2>
        <div class="score-circle">
          <span class="score-number">{{ score }}</span>
          <span class="score-total">/ {{ currentQuiz.length }}</span>
        </div>
        <p class="score-desc">
          答對率 <strong>{{ scorePercentage }}%</strong>
          <span v-if="scorePercentage >= 80">，學養深厚！</span>
          <span v-else-if="scorePercentage >= 60">，繼續保持！</span>
          <span v-else>，建議多加複習喔！</span>
        </p>
        <button class="btn btn-primary retry-btn" @click="goBackToSetup">再測一次</button>
      </div>

      <div class="result-details">
        <h3 class="details-title">逐題解析</h3>
        <div class="review-list">
          <div v-for="(q, index) in currentQuiz" :key="q.id" class="review-item" :class="{ correct: userAnswers[index] === q.correctAnswer, incorrect: userAnswers[index] !== q.correctAnswer }">
            <div class="review-header">
              <span class="review-q-num">第 {{ index + 1 }} 題</span>
              <span class="review-status">
                {{ userAnswers[index] === q.correctAnswer ? '✅ 答對' : '❌ 答錯' }}
              </span>
            </div>
            
            <p class="review-q-text">{{ q.question }}</p>
            
            <div class="review-options">
              <div 
                v-for="(opt, oIdx) in q.options" 
                :key="oIdx"
                class="review-opt"
                :class="{ 
                  'is-correct': oIdx === q.correctAnswer,
                  'is-wrong-picked': oIdx === userAnswers[index] && oIdx !== q.correctAnswer
                }"
              >
                {{ String.fromCharCode(65 + oIdx) }}. {{ opt }}
              </div>
            </div>

            <div v-if="q.explanation" class="review-explanation">
              <strong>解析：</strong>{{ q.explanation }}
            </div>

            <div class="review-source">
              <button class="btn btn-ghost source-link-btn" @click="goToSource(q)">
                📖 前往出處閱讀段落與完整解析
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.view-header {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.view-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.view-subtitle {
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
}

.quiz-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--sp-8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Setup */
.setup-card {
  text-align: center;
}

.setup-title {
  margin-bottom: var(--sp-6);
  font-size: var(--fs-xl);
}

.count-selector {
  display: flex;
  justify-content: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.count-btn {
  padding: var(--sp-3) var(--sp-6);
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.count-btn:hover {
  background: rgba(201, 169, 110, 0.1);
}

.count-btn.active {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.setup-desc {
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  line-height: 1.6;
  margin-bottom: var(--sp-8);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Quiz */
.question-card {
  position: relative;
}

.quiz-progress {
  margin-bottom: var(--sp-6);
}

.progress-text {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-2);
  text-align: right;
}

.progress-bar-bg {
  height: 4px;
  background: var(--c-border-subtle);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--c-gold);
  transition: width var(--duration-normal) var(--ease-out);
}

.question-header {
  margin-bottom: var(--sp-4);
}

.question-type {
  display: inline-block;
  padding: 2px 8px;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold);
  font-size: var(--fs-xs);
  border-radius: var(--radius-sm);
}

.question-text {
  margin-bottom: var(--sp-8);
  line-height: 1.8;
  white-space: pre-wrap;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-8);
}

.option-btn {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  padding: var(--sp-4);
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  text-align: left;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.option-btn:hover {
  background: var(--c-bg-card-hover);
  border-color: var(--c-border);
}

.option-btn.selected {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
}

.option-letter {
  font-weight: var(--fw-bold);
  color: var(--c-text-muted);
}

.option-btn.selected .option-letter {
  color: var(--c-gold);
}

.quiz-actions {
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  min-width: 120px;
}

/* Result */
.result-summary-card {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.result-title {
  font-size: var(--fs-xl);
  margin-bottom: var(--sp-6);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--c-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--sp-4);
}

.score-number {
  font-size: 3rem;
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
}

.score-total {
  font-size: var(--fs-lg);
  color: var(--c-text-muted);
  margin-top: 10px;
  margin-left: 4px;
}

.score-desc {
  margin-bottom: var(--sp-6);
  color: var(--c-text-secondary);
}

.details-title {
  font-size: var(--fs-lg);
  margin-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-border-subtle);
  padding-bottom: var(--sp-2);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.review-item {
  background: var(--c-bg-card);
  border-radius: var(--radius-md);
  padding: var(--sp-5);
  border-left: 4px solid var(--c-border-subtle);
}

.review-item.correct {
  border-left-color: #4ade80;
}

.review-item.incorrect {
  border-left-color: #f87171;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
  font-size: var(--fs-sm);
}

.review-q-num {
  font-weight: var(--fw-bold);
  color: var(--c-text-secondary);
}

.review-status {
  font-weight: var(--fw-bold);
}

.review-q-text {
  margin-bottom: var(--sp-4);
  line-height: 1.6;
  white-space: pre-wrap;
}

.review-options {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
  font-size: var(--fs-sm);
}

.review-opt {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  background: var(--c-bg-elevated);
}

.review-opt.is-correct {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.review-opt.is-wrong-picked {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.review-explanation {
  background: var(--c-bg-elevated);
  padding: var(--sp-3);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  line-height: 1.5;
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
}

.review-source {
  text-align: right;
  border-top: 1px dashed var(--c-border-subtle);
  padding-top: var(--sp-3);
}

.source-link-btn {
  font-size: var(--fs-xs);
  color: var(--c-gold);
}
</style>
