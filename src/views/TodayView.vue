<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mounted = ref(false)

onMounted(() => {
  // Trigger entrance animations after mount
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

interface StatCard {
  icon: string
  value: string
  label: string
  gradient: string
}

const stats: StatCard[] = [
  {
    icon: '🔄',
    value: '0',
    label: '到期複習',
    gradient: 'linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.04))',
  },
  {
    icon: '📖',
    value: '0',
    label: '今日已學',
    gradient: 'linear-gradient(135deg, rgba(91,138,114,0.12), rgba(91,138,114,0.04))',
  },
  {
    icon: '🔥',
    value: '0',
    label: '連續天數',
    gradient: 'linear-gradient(135deg, rgba(139,94,94,0.12), rgba(139,94,94,0.04))',
  },
]

function goToLibrary() {
  router.push('/library')
}
</script>

<template>
  <div class="today-view" :class="{ 'is-mounted': mounted }">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">經典文脈</h1>
        <p class="hero-subtitle">先秦諸子 · 深度記憶</p>
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
        <button class="btn btn-primary action-btn" disabled>
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
    <section class="activity-section">
      <h3 class="section-heading">近期活動</h3>
      <div class="activity-empty glass-card">
        <div class="empty-icon">🌿</div>
        <p class="empty-title">尚未開始學習</p>
        <p class="empty-text">從典籍庫選擇一篇經典，開啟你的記憶之旅</p>
        <button class="btn btn-ghost empty-btn" @click="goToLibrary">
          前往典籍庫 →
        </button>
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

.hero-subtitle {
  font-family: var(--font-serif);
  font-size: var(--fs-lg);
  color: var(--c-text-muted);
  letter-spacing: 0.3em;
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
