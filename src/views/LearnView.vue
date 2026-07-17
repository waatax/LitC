<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Chapter, Work, Passage, Sentence } from '@/types/content'
import { getChapter, getPassagesByChapter, getSentencesByPassage, getWorks } from '@/data'
import SchoolBadge from '@/components/SchoolBadge.vue'

const route = useRoute()
const router = useRouter()

const chapter = ref<Chapter | null>(null)
const work = ref<Work | null>(null)
const passages = ref<Passage[]>([])
const allSentences = ref<Sentence[]>([])
const mounted = ref(false)

interface Step {
  key: string
  label: string
  icon: string
  fullLabel: string
}

const steps: Step[] = [
  { key: 'intro', label: '導', icon: '🌊', fullLabel: '導入' },
  { key: 'read', label: '讀', icon: '📖', fullLabel: '通讀' },
  { key: 'understand', label: '解', icon: '💡', fullLabel: '理解' },
  { key: 'segment', label: '分', icon: '✂️', fullLabel: '分段' },
]

const currentStepIndex = ref(0)

const currentStep = computed(() => steps[currentStepIndex.value])
const progressPercent = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100)
const isFirstStep = computed(() => currentStepIndex.value === 0)
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1)

function loadChapter() {
  const chapterId = route.params.id as string
  if (!chapterId) return

  chapter.value = getChapter(chapterId) ?? null
  if (!chapter.value) return

  const allWorks = getWorks()
  work.value = allWorks.find(w => w.id === chapter.value!.workId) ?? null

  passages.value = getPassagesByChapter(chapterId)

  const sentences: Sentence[] = []
  for (const passage of passages.value) {
    sentences.push(...getSentencesByPassage(passage.id))
  }
  allSentences.value = sentences
}

onMounted(() => {
  loadChapter()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

watch(() => route.params.id, () => {
  loadChapter()
  currentStepIndex.value = 0
})

function nextStep() {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function goToMemorize() {
  if (chapter.value) {
    router.push(`/memorize/${chapter.value.id}`)
  }
}

function goBack() {
  if (chapter.value) {
    router.push(`/chapter/${chapter.value.id}`)
  } else {
    router.push('/library')
  }
}

const fullText = computed(() => {
  return passages.value.map(p => p.canonicalText).join('\n\n')
})
</script>

<template>
  <div class="learn-view" :class="{ 'is-mounted': mounted }">
    <!-- Top Bar -->
    <div class="learn-top-bar">
      <button class="btn btn-ghost btn-sm" @click="goBack">
        ← 返回
      </button>
      <div class="top-bar-title" v-if="chapter">
        {{ chapter.title }}
      </div>
      <div class="top-bar-spacer"></div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div
        v-for="(step, i) in steps"
        :key="step.key"
        class="step-pip"
        :class="{
          'is-active': i === currentStepIndex,
          'is-done': i < currentStepIndex,
        }"
        @click="currentStepIndex = i"
      >
        <span class="pip-icon">{{ step.icon }}</span>
        <span class="pip-label">{{ step.label }}</span>
      </div>
    </div>

    <template v-if="chapter && work">
      <!-- Step Content -->
      <div class="step-content">
        <Transition name="step" mode="out-in">
          <!-- Step 1: Introduction -->
          <div v-if="currentStep.key === 'intro'" key="intro" class="step-panel">
            <div class="step-heading">
              <span class="step-heading-icon">🌊</span>
              <h2>導入</h2>
            </div>
            <div class="intro-card glass-card">
              <h3 class="intro-title">{{ chapter.title }}</h3>
              <div class="intro-meta">
                <SchoolBadge :school-id="work.schoolId" />
                <span class="intro-work">《{{ work.title }}》</span>
              </div>
              <p v-if="work.sourceNote" class="intro-note">{{ work.sourceNote }}</p>
              <div class="intro-stats">
                <div class="intro-stat">
                  <span class="intro-stat-value">{{ allSentences.length }}</span>
                  <span class="intro-stat-label">句</span>
                </div>
                <div class="intro-stat">
                  <span class="intro-stat-value">{{ passages.length }}</span>
                  <span class="intro-stat-label">段</span>
                </div>
                <div class="intro-stat">
                  <span class="intro-stat-value">~{{ chapter.estimatedMinutes }}</span>
                  <span class="intro-stat-label">分鐘</span>
                </div>
              </div>
              <p class="intro-encourage">準備好了嗎？讓我們開始通讀全文。</p>
            </div>
          </div>

          <!-- Step 2: Read -->
          <div v-else-if="currentStep.key === 'read'" key="read" class="step-panel">
            <div class="step-heading">
              <span class="step-heading-icon">📖</span>
              <h2>通讀全文</h2>
            </div>
            <div class="read-card glass-card">
              <div class="classical-text-lg read-text">
                <p
                  v-for="passage in passages"
                  :key="passage.id"
                  class="read-paragraph"
                >{{ passage.canonicalText }}</p>
              </div>
            </div>
          </div>

          <!-- Step 3: Understand -->
          <div v-else-if="currentStep.key === 'understand'" key="understand" class="step-panel">
            <div class="step-heading">
              <span class="step-heading-icon">💡</span>
              <h2>逐句理解</h2>
            </div>
            <div class="understand-list">
              <div
                v-for="(sentence, si) in allSentences"
                :key="sentence.id"
                class="understand-item glass-card"
              >
                <div class="understand-order">{{ si + 1 }}</div>
                <div class="understand-body">
                  <p class="classical-text understand-text">{{ sentence.canonicalText }}</p>
                  <p v-if="sentence.translationHint" class="understand-hint">
                    💡 {{ sentence.translationHint }}
                  </p>
                </div>
              </div>
              <div v-if="allSentences.length === 0" class="no-data">
                尚無句級資料
              </div>
            </div>
          </div>

          <!-- Step 4: Segment -->
          <div v-else-if="currentStep.key === 'segment'" key="segment" class="step-panel">
            <div class="step-heading">
              <span class="step-heading-icon">✂️</span>
              <h2>分段解構</h2>
            </div>
            <p class="step-desc">觀察每句的語塊結構，為背誦做準備。</p>
            <div class="segment-list">
              <div
                v-for="sentence in allSentences"
                :key="sentence.id"
                class="segment-item glass-card"
              >
                <div class="segment-chunks">
                  <span
                    v-for="chunk in sentence.chunks"
                    :key="chunk.id"
                    class="segment-chunk"
                  >{{ chunk.text }}</span>
                </div>
                <p v-if="sentence.translationHint" class="segment-hint">{{ sentence.translationHint }}</p>
              </div>
              <div v-if="allSentences.length === 0" class="no-data">
                尚無分段資料
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Navigation -->
      <div class="step-nav">
        <button
          class="btn btn-ghost"
          :disabled="isFirstStep"
          @click="prevStep"
        >
          ← 上一步
        </button>
        <span class="step-counter">
          {{ currentStepIndex + 1 }} / {{ steps.length }}
        </span>
        <button
          v-if="!isLastStep"
          class="btn btn-primary"
          @click="nextStep"
        >
          下一步 →
        </button>
        <button
          v-else
          class="btn btn-primary memorize-btn"
          @click="goToMemorize"
        >
          🧠 進入背誦
        </button>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else-if="mounted" class="not-found">
      <h2>找不到此章節</h2>
      <button class="btn btn-ghost" @click="router.push('/library')">返回典籍庫</button>
    </div>
  </div>
</template>

<style scoped>
.learn-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
}

.learn-view.is-mounted {
  opacity: 1;
}

/* ── Top Bar ── */
.learn-top-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--sp-4);
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}

.btn-sm {
  padding: var(--sp-2) var(--sp-4);
  font-size: var(--fs-sm);
}

.top-bar-title {
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  color: var(--c-text-secondary);
  margin-left: var(--sp-4);
}

.top-bar-spacer {
  flex: 1;
}

/* ── Progress Bar ── */
.progress-bar-container {
  margin-bottom: var(--sp-6);
  animation: fadeIn var(--duration-normal) var(--ease-out) 100ms both;
}

.progress-bar {
  height: 3px;
  background: var(--c-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold-dark), var(--c-gold), var(--c-gold-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

/* ── Step Indicator ── */
.step-indicator {
  display: flex;
  justify-content: center;
  gap: var(--sp-6);
  margin-bottom: var(--sp-8);
  animation: fadeIn var(--duration-normal) var(--ease-out) 150ms both;
}

.step-pip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.step-pip:hover {
  transform: translateY(-2px);
}

.pip-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: var(--fs-lg);
  background: var(--c-bg-secondary);
  border: 2px solid var(--c-border);
  transition: all var(--duration-normal) var(--ease-out);
}

.step-pip.is-done .pip-icon {
  background: var(--c-gold-dark);
  border-color: var(--c-gold);
}

.step-pip.is-active .pip-icon {
  background: var(--c-gold);
  border-color: var(--c-gold-light);
  box-shadow: var(--shadow-gold);
}

.pip-label {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  transition: color var(--duration-fast) var(--ease-out);
}

.step-pip.is-active .pip-label {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

.step-pip.is-done .pip-label {
  color: var(--c-text-secondary);
}

/* ── Step Content ── */
.step-content {
  min-height: 300px;
  margin-bottom: var(--sp-8);
}

.step-panel {
  animation: fadeInUp var(--duration-normal) var(--ease-out) both;
}

.step-heading {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.step-heading-icon {
  font-size: var(--fs-2xl);
}

.step-heading h2 {
  font-family: var(--font-serif);
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
}

.step-desc {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-6);
}

/* Step Transition */
.step-enter-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.step-leave-active {
  transition: all var(--duration-fast) ease-in;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* ── Intro ── */
.intro-card {
  padding: var(--sp-8);
  text-align: center;
  cursor: default;
}

.intro-card:hover {
  transform: none;
}

.intro-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-4);
  letter-spacing: 0.1em;
}

.intro-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.intro-work {
  font-family: var(--font-serif);
  font-size: var(--fs-base);
  color: var(--c-text-secondary);
}

.intro-note {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  max-width: 480px;
  margin: 0 auto var(--sp-6);
  line-height: var(--lh-relaxed);
}

.intro-stats {
  display: flex;
  justify-content: center;
  gap: var(--sp-10);
  margin-bottom: var(--sp-6);
}

.intro-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-stat-value {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-bold);
  color: var(--c-gold);
}

.intro-stat-label {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-top: var(--sp-1);
}

.intro-encourage {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin-top: var(--sp-4);
}

/* ── Read ── */
.read-card {
  padding: var(--sp-8);
  cursor: default;
}

.read-card:hover {
  transform: none;
}

.read-text {
  text-align: justify;
}

.read-paragraph {
  margin-bottom: var(--sp-6);
  text-indent: 2em;
}

.read-paragraph:last-child {
  margin-bottom: 0;
}

/* ── Understand ── */
.understand-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.understand-item {
  display: flex;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
  cursor: default;
}

.understand-item:hover {
  transform: none;
}

.understand-order {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-elevated);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.understand-body {
  flex: 1;
  min-width: 0;
}

.understand-text {
  margin-bottom: var(--sp-2);
}

.understand-hint {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  padding-left: var(--sp-3);
  border-left: 2px solid var(--c-border-accent);
}

/* ── Segment ── */
.segment-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.segment-item {
  padding: var(--sp-4) var(--sp-5);
  cursor: default;
}

.segment-item:hover {
  transform: none;
}

.segment-chunks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
}

.segment-chunk {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  letter-spacing: 0.05em;
  padding: var(--sp-1) var(--sp-3);
  background: rgba(201, 169, 110, 0.06);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: var(--radius-sm);
  color: var(--c-text-primary);
  transition: all var(--duration-fast) var(--ease-out);
}

.segment-chunk:hover {
  background: rgba(201, 169, 110, 0.12);
  border-color: rgba(201, 169, 110, 0.4);
}

.segment-hint {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.no-data {
  text-align: center;
  padding: var(--sp-12);
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
}

/* ── Step Nav ── */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-6);
  border-top: 1px solid var(--c-border-subtle);
}

.step-counter {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.step-nav .btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.memorize-btn {
  animation: pulse-gold 2s infinite;
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(201, 169, 110, 0); }
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
  .step-indicator {
    gap: var(--sp-3);
  }

  .pip-icon {
    width: 34px;
    height: 34px;
    font-size: var(--fs-base);
  }

  .intro-stats {
    gap: var(--sp-6);
  }

  .intro-card,
  .read-card {
    padding: var(--sp-5);
  }
}
</style>
