<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDueCardIds, db } from '@/data/db'
import { sentences } from '@/data/works'

const router = useRouter()

function getSentenceText(id: string): string {
  const s = sentences.find(s => s.id === id)
  return s ? s.canonicalText : '未知句子'
}

const mounted = ref(false)
const dueCount = ref(0)
const learnedToday = ref(0)
const streakDays = ref(0)
const recentReviews = ref<any[]>([])

async function loadStats() {
  try {
    // 1. Get due count
    const dueIds = await getDueCardIds()
    dueCount.value = dueIds.length

    // 2. Get reviews completed today (since midnight local time)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayIso = startOfToday.toISOString()

    learnedToday.value = await db.reviews
      .where('reviewedAt')
      .aboveOrEqual(todayIso)
      .count()

    // 3. Compute consecutive active days streak
    const allReviews = await db.reviews.orderBy('reviewedAt').toArray()
    if (allReviews.length > 0) {
      const dates = allReviews.map(r => r.reviewedAt.split('T')[0])
      const uniqueDates = Array.from(new Set(dates)).sort()
      
      let streak = 0
      let lastDate = new Date()
      // Subtract 1 day loop to check backwards
      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const d = new Date(uniqueDates[i])
        const diffTime = Math.abs(lastDate.getTime() - d.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 1) {
          streak++
          lastDate = d
        } else {
          break
        }
      }
      streakDays.value = streak
    }

    // 4. Load recent reviews
    recentReviews.value = await db.reviews
      .orderBy('reviewedAt')
      .reverse()
      .limit(5)
      .toArray()
  } catch (e) {
    console.error('Failed to load DB stats in TodayView:', e)
  }
}

onMounted(async () => {
  await loadStats()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

const stats = computed(() => [
  {
    icon: '🔄',
    value: dueCount.value.toString(),
    label: '到期複習',
    gradient: 'linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.04))',
  },
  {
    icon: '📖',
    value: learnedToday.value.toString(),
    label: '今日已學',
    gradient: 'linear-gradient(135deg, rgba(91,138,114,0.12), rgba(91,138,114,0.04))',
  },
  {
    icon: '🔥',
    value: streakDays.value.toString(),
    label: '連續天數',
    gradient: 'linear-gradient(135deg, rgba(139,94,94,0.12), rgba(139,94,94,0.04))',
  },
])

async function startReview() {
  const dueIds = await getDueCardIds()
  if (dueIds.length === 0) return
  
  // Get first due card and extract its chapterId
  const firstDueId = dueIds[0]
  const parts = firstDueId.split('_')
  if (parts.length >= 2) {
    const chapterId = `${parts[0]}_${parts[1]}`
    router.push(`/memorize/${chapterId}`)
  }
}

function goToLibrary() {
  router.push('/library')
}

function goToSchool(schoolId: string) {
  router.push({ path: '/library', query: { school: schoolId } })
}
</script>

<template>
  <div class="today-view" :class="{ 'is-mounted': mounted }">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">經典文脈</h1>
        <div class="hero-schools">
          <a class="hero-school-link link-dao" @click="goToSchool('daoism')">道家</a>
          <span class="school-sep">·</span>
          <a class="hero-school-link link-legal" @click="goToSchool('legalism')">法家</a>
          <span class="school-sep">·</span>
          <a class="hero-school-link link-mohist" @click="goToSchool('mohism')">墨家</a>
          <span class="school-sep">·</span>
          <a class="hero-school-link link-confucian" @click="goToSchool('confucianism')">儒家</a>
          <span class="school-sep">·</span>
          <a class="hero-school-link link-literature" @click="goToSchool('literature')">文學</a>
        </div>
        <div class="hero-accent"></div>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="stats-section">
      <div class="stats-grid stagger-children">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card glass-card"
          :style="{ background: stat.gradient }"
        >
          <span class="stat-icon">{{ stat.icon }}</span>
          <div class="stat-body">
            <span class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.label.slice(-1) }}</span></span>
            <span class="stat-label">{{ stat.label.slice(0, -1) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="actions-section">
      <h3 class="section-heading">快速開始</h3>
      <div class="actions-row">
        <button class="btn btn-primary action-btn" :disabled="dueCount === 0" @click="startReview">
          <span>🔄</span>
          <span>開始複習</span>
        </button>
        <button class="btn btn-ghost action-btn" @click="goToLibrary">
          <span>📚</span>
          <span>瀏覽典籍庫</span>
        </button>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="activity-section animate-fade-in" style="animation-delay: 240ms;">
      <h3 class="section-heading">近期活動</h3>
      
      <div v-if="recentReviews.length === 0" class="activity-empty glass-card">
        <div class="empty-icon">🌿</div>
        <p class="empty-title">尚未開始學習</p>
        <p class="empty-text">從典籍庫選擇一篇經典，開啟你的記憶之旅</p>
        <button class="btn btn-ghost empty-btn" @click="goToLibrary">
          前往典籍庫 →
        </button>
      </div>

      <div v-else class="activity-list stagger-children">
        <div 
          v-for="review in recentReviews" 
          :key="review.id" 
          class="activity-item glass-card"
        >
          <div class="activity-status" :class="'status-' + review.rating">
            <span v-if="review.rating === 'again'">🔄 再來</span>
            <span v-else-if="review.rating === 'hard'">😰 困難</span>
            <span v-else-if="review.rating === 'good'">👍 良好</span>
            <span v-else-if="review.rating === 'easy'">✨ 簡單</span>
          </div>
          <div class="activity-body">
            <p class="activity-text classical-text">{{ getSentenceText(review.cardId) }}</p>
            <div class="activity-meta">
              <span class="meta-item">模式：{{ review.answerMode === 'typing' ? '📝 默寫' : '🧠 回想' }}</span>
              <span class="meta-item">提示：{{ review.hintsUsed === 0 ? '無' : review.hintsUsed + '階' }}</span>
              <span class="meta-item">時間：{{ new Date(review.reviewedAt).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.today-view {
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
}

.today-view.is-mounted {
  opacity: 1;
}

/* ── Hero ── */
.hero {
  position: relative;
  text-align: center;
  padding: var(--sp-16) 0 var(--sp-12);
  margin-bottom: var(--sp-8);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(201, 169, 110, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: var(--fs-hero);
  font-weight: var(--fw-bold);
  background: linear-gradient(
    135deg,
    var(--c-gold-light) 0%,
    var(--c-gold) 40%,
    var(--c-gold-dark) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.15em;
  margin-bottom: var(--sp-3);
}

.hero-schools {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--sp-3);
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  margin-top: var(--sp-2);
}

.hero-school-link {
  cursor: pointer;
  color: var(--c-text-muted);
  transition: all var(--duration-normal) var(--ease-out);
  text-decoration: none;
  font-weight: var(--fw-medium);
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.hero-school-link:hover {
  transform: translateY(-2px);
  text-shadow: 0 0 8px currentColor;
}

.link-dao:hover { color: var(--c-accent-dao); }
.link-legal:hover { color: var(--c-accent-legal); }
.link-mohist:hover { color: var(--c-accent-mohist); }
.link-confucian:hover { color: var(--c-accent-confucian); }
.link-literature:hover { color: var(--c-accent-literature); }

.school-sep {
  color: var(--c-text-muted);
  opacity: 0.3;
}

.hero-accent {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-gold), transparent);
  margin: var(--sp-6) auto 0;
}

/* ── Stats ── */
.stats-section {
  margin-bottom: var(--sp-10);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
}

.stat-card {
  padding: var(--sp-5) var(--sp-4);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  cursor: default;
}

.stat-icon {
  font-size: var(--fs-3xl);
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
  line-height: 1;
}

.stat-unit {
  font-size: var(--fs-sm);
  font-weight: var(--fw-normal);
  color: var(--c-text-muted);
  margin-left: var(--sp-1);
}

.stat-label {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin-top: var(--sp-1);
}

/* ── Actions ── */
.actions-section {
  margin-bottom: var(--sp-10);
  animation: fadeInUp var(--duration-slow) var(--ease-out) 200ms both;
}

.section-heading {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-4);
  letter-spacing: 0.05em;
}

.actions-row {
  display: flex;
  gap: var(--sp-4);
  flex-wrap: wrap;
}

.action-btn {
  padding: var(--sp-4) var(--sp-8);
  font-size: var(--fs-base);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
  filter: none !important;
}

/* ── Activity ── */
.activity-section {
  animation: fadeInUp var(--duration-slow) var(--ease-out) 350ms both;
}

.activity-empty {
  padding: var(--sp-12) var(--sp-8);
  text-align: center;
  cursor: default;
}

.activity-empty:hover {
  transform: none;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--sp-4);
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.empty-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.empty-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-6);
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

.empty-btn {
  margin: 0 auto;
}

/* ── Activity List ── */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.activity-item {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  border-left: 4px solid var(--c-border);
  gap: var(--sp-3);
}

.activity-status {
  align-self: flex-start;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
}

.status-again {
  background: rgba(139, 94, 94, 0.15);
  color: #ff8888;
  border: 1px solid rgba(139, 94, 94, 0.3);
}

.status-hard {
  background: rgba(184, 148, 68, 0.15);
  color: #ffcc66;
  border: 1px solid rgba(184, 148, 68, 0.3);
}

.status-good {
  background: rgba(74, 139, 110, 0.15);
  color: #88ff88;
  border: 1px solid rgba(74, 139, 110, 0.3);
}

.status-easy {
  background: rgba(201, 169, 110, 0.15);
  color: #ffeeb8;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

.activity-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.activity-text {
  font-size: var(--fs-lg) !important;
  color: var(--c-text-primary);
  margin: 0;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.meta-item {
  display: inline-flex;
  align-items: center;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero {
    padding: var(--sp-10) 0 var(--sp-8);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--sp-3);
  }

  .stat-card {
    padding: var(--sp-4);
  }

  .actions-row {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
