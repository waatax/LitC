<script setup lang="ts">
import { useGamificationStore } from '@/stores/gamification'

const store = useGamificationStore()

const schools = [
  { id: 'daoism', name: '道家', icon: '☯️', colorVar: '--c-accent-dao' },
  { id: 'confucianism', name: '儒家', icon: '📜', colorVar: '--c-accent-confucian' },
  { id: 'legalism', name: '法家', icon: '⚖️', colorVar: '--c-accent-legal' },
  { id: 'mohism', name: '墨家', icon: '🛠️', colorVar: '--c-accent-mohist' },
  { id: 'military', name: '兵家', icon: '⚔️', colorVar: '--c-accent-military' },
  { id: 'histories', name: '史書', icon: '📚', colorVar: '--c-accent-histories' },
  { id: 'literature', name: '文學', icon: '✒️', colorVar: '--c-accent-literature' },
  { id: 'syncretism', name: '雜家', icon: '🎭', colorVar: '--c-accent-syncretism' },
]
</script>

<template>
  <div class="profile-container">
    <header class="profile-header">
      <h1 class="classical-text">修行履歷</h1>
    </header>

    <section class="glass-card player-card fade-in">
      <div class="rank-info">
        <div class="rank-icon">{{ store.currentRank.icon }}</div>
        <div class="rank-text">
          <h2 class="classical-text">{{ store.currentRank.title }}</h2>
          <span class="level-badge">階級 {{ store.currentRank.level }}</span>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">累積經驗</span>
          <span class="stat-value">{{ store.exp }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">連續學習</span>
          <span class="stat-value fire">{{ store.streak }} <small>天</small>🔥</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">背誦總句數</span>
          <span class="stat-value">{{ store.totalSentencesMastered }} <small>句</small></span>
        </div>
      </div>

      <div class="exp-bar-container" v-if="store.nextRank">
        <div class="exp-labels">
          <span>距離 {{ store.nextRank.title }}</span>
          <span>{{ store.exp }} / {{ store.nextRank.minExp }}</span>
        </div>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: store.rankProgress + '%' }"></div>
        </div>
      </div>
      <div v-else class="exp-bar-container max-rank">
        <p>已達到最高境界！</p>
      </div>
    </section>

    <div class="divider brush-divider my-8"></div>

    <section class="schools-section fade-in delay-1">
      <h3 class="section-title">學派造詣</h3>
      <div class="schools-grid">
        <div 
          v-for="school in schools" 
          :key="school.id" 
          class="glass-card-elevated school-card" 
          :style="{ '--school-color': `var(${school.colorVar})` }"
        >
          <div class="school-header">
            <span class="school-icon">{{ school.icon }}</span>
            <span class="school-name">{{ school.name }}</span>
          </div>
          <div class="school-progress-text">
            <span>{{ store.schoolProgress[school.id] || 0 }} 句</span>
          </div>
          <div class="school-bar">
            <div class="school-fill" :style="{ width: Math.min(((store.schoolProgress[school.id] || 0) / 30) * 100, 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider brush-divider my-8"></div>

    <section class="achievements-section fade-in delay-2">
      <h3 class="section-title">成就功名</h3>
      <div class="achievements-grid">
        <div 
          v-for="ach in store.achievements" 
          :key="ach.id"
          class="scholarly-pill-tab achievement-badge"
          :class="{ 'is-unlocked': ach.unlockedAt }"
          :title="ach.unlockedAt ? ach.description : `未解鎖: ${ach.description}`"
        >
          <span class="ach-icon" v-if="ach.unlockedAt">{{ ach.icon }}</span>
          <span class="ach-icon locked" v-else>🔒</span>
          <div class="ach-info">
            <span class="ach-title">{{ ach.title }}</span>
            <span class="ach-desc">{{ ach.description }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-container {
  padding: var(--sp-6) var(--sp-4);
  max-width: var(--content-max-width);
  margin: 0 auto;
}
.profile-header {
  margin-bottom: var(--sp-6);
  text-align: center;
}
.profile-header h1 {
  font-size: var(--fs-2xl);
  color: var(--c-text-primary);
}

.player-card {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(201,169,110,0.05) 100%);
  border: 1px solid var(--c-gold-dark);
}

.rank-info {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.rank-icon {
  font-size: 3rem;
}
.rank-text h2 {
  font-size: var(--fs-xl);
  margin: 0;
  color: var(--c-gold);
}
.level-badge {
  display: inline-block;
  margin-top: var(--sp-1);
  padding: 2px 8px;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--c-bg-card);
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
}
.stat-label {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-1);
}
.stat-value {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
}
.stat-value.fire {
  color: #ff9800;
}
.stat-value small {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.exp-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
}
.exp-bar {
  height: 8px;
  background: var(--c-bg-card);
  border-radius: 4px;
  overflow: hidden;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold-light), var(--c-gold));
  border-radius: 4px;
  transition: width 1s var(--ease-out);
}
.max-rank {
  align-items: center;
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.my-8 { margin: var(--sp-8) 0; }
.section-title {
  font-size: var(--fs-lg);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-4);
  font-family: var(--font-serif);
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
}
@media (max-width: 600px) {
  .schools-grid { grid-template-columns: 1fr; }
}
.school-card {
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  border-left: 4px solid var(--school-color, var(--c-gold));
}
.school-header {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.school-icon { font-size: var(--fs-lg); }
.school-name { font-weight: var(--fw-bold); color: var(--c-text-primary); }
.school-progress-text {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  text-align: right;
}
.school-bar {
  height: 4px;
  background: var(--c-bg-card);
  border-radius: 2px;
  overflow: hidden;
}
.school-fill {
  height: 100%;
  background: var(--school-color, var(--c-gold));
  transition: width 1s var(--ease-out);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--sp-4);
}
.achievement-badge {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all var(--duration-normal) var(--ease-out);
  cursor: help;
  justify-content: flex-start;
}
.achievement-badge.is-unlocked {
  opacity: 1;
  filter: none;
  border: 1px solid var(--c-gold);
  background: var(--c-gold-glow);
}
.ach-icon { font-size: var(--fs-xl); }
.ach-info { display: flex; flex-direction: column; }
.ach-title { font-weight: var(--fw-bold); color: var(--c-text-primary); font-size: var(--fs-sm); }
.ach-desc { font-size: var(--fs-xs); color: var(--c-text-muted); }

.fade-in { animation: fadeIn 0.5s var(--ease-out) forwards; opacity: 0; transform: translateY(10px); }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
