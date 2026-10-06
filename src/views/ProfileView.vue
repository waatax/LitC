<script setup lang="ts">
import { useGamificationStore } from '@/stores/gamification'
import ClassicalIcon, { type IconName } from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'

const store = useGamificationStore()

interface SchoolCultivation {
  id: string
  name: string
  icon: IconName
  colorVar: string
}

const schools: SchoolCultivation[] = [
  { id: 'daoism', name: '道家', icon: 'leaf', colorVar: '--c-accent-dao' },
  { id: 'confucianism', name: '儒家', icon: 'scholar', colorVar: '--c-accent-confucian' },
  { id: 'legalism', name: '法家', icon: 'scale', colorVar: '--c-accent-legal' },
  { id: 'mohism', name: '墨家', icon: 'shield', colorVar: '--c-accent-mohist' },
  { id: 'military', name: '兵家', icon: 'sword', colorVar: '--c-accent-military' },
  { id: 'histories', name: '史書', icon: 'history', colorVar: '--c-accent-histories' },
  { id: 'literature', name: '文學', icon: 'feather', colorVar: '--c-accent-literature' },
]
</script>

<template>
  <div class="profile-container">
    <header class="profile-header">
      <h1 class="font-serif classical-text">修行造詣 ‧ 履歷</h1>
      <p class="profile-desc">日進有功，溫故知新；體悟經典，涵養正氣。</p>
    </header>

    <section class="glass-card player-card fade-in">
      <div class="rank-info">
        <div class="rank-seal-wrap">
          <RedSeal text="修持" :size="48" :animate="false" />
        </div>
        <div class="rank-text">
          <div class="rank-name-row">
            <h2 class="font-serif classical-text">{{ store.currentRank.title }}</h2>
            <span class="level-badge font-serif">第 {{ store.currentRank.level }} 階</span>
          </div>
          <span class="rank-sub">文脈積累 ‧ 當前修行境界</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">累積修為</span>
          <span class="stat-value">
            <ClassicalIcon name="sparkle" :size="16" color="var(--c-gold)" />
            {{ store.exp }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">連續修持</span>
          <span class="stat-value fire">
            <ClassicalIcon name="flame" :size="16" color="#b9674d" />
            {{ store.streak }} <small>天</small>
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">背誦總句數</span>
          <span class="stat-value">
            <ClassicalIcon name="library" :size="16" color="var(--c-gold)" />
            {{ store.totalSentencesMastered }} <small>句</small>
          </span>
        </div>
      </div>

      <div class="exp-bar-container" v-if="store.nextRank">
        <div class="exp-labels">
          <span class="font-serif">距進階「{{ store.nextRank.title }}」</span>
          <span>{{ store.exp }} / {{ store.nextRank.minExp }} 點</span>
        </div>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: store.rankProgress + '%' }"></div>
        </div>
      </div>
      <div v-else class="exp-bar-container max-rank">
        <p class="font-serif">已臻太學士至高境界，學富五車！</p>
      </div>
    </section>

    <div class="divider brush-divider my-8"></div>

    <section class="schools-section fade-in delay-1">
      <h3 class="section-title font-serif">諸子學派 ‧ 研讀造詣</h3>
      <div class="schools-grid">
        <div
          v-for="school in schools"
          :key="school.id"
          class="glass-card-elevated school-card"
          :style="{ '--school-color': `var(${school.colorVar})` }"
        >
          <div class="school-header">
            <span class="school-icon">
              <ClassicalIcon :name="school.icon" :size="18" :color="`var(${school.colorVar})`" />
            </span>
            <span class="school-name font-serif">{{ school.name }}</span>
          </div>
          <div class="school-progress-text">
            <span>{{ store.schoolProgress[school.id] || 0 }} 句</span>
          </div>
          <div class="school-bar">
            <div
              class="school-fill"
              :style="{ width: Math.min(((store.schoolProgress[school.id] || 0) / 30) * 100, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider brush-divider my-8"></div>

    <section class="achievements-section fade-in delay-2">
      <h3 class="section-title font-serif">成就功名 ‧ 經筵印契</h3>
      <div class="achievements-grid">
        <div
          v-for="ach in store.achievements"
          :key="ach.id"
          class="scholarly-pill-tab achievement-badge"
          :class="{ 'is-unlocked': ach.unlockedAt }"
          :title="ach.unlockedAt ? ach.description : `未解鎖: ${ach.description}`"
        >
          <span class="ach-icon-wrap" v-if="ach.unlockedAt">
            <ClassicalIcon name="sparkle" :size="18" color="var(--c-gold)" />
          </span>
          <span class="ach-icon-wrap locked" v-else>
            <ClassicalIcon name="lock" :size="16" color="var(--c-text-muted)" />
          </span>
          <div class="ach-info">
            <span class="ach-title font-serif">{{ ach.title }}</span>
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
  font-size: var(--fs-3xl);
  color: var(--c-gold);
  margin: 0 0 6px 0;
  letter-spacing: 0.08em;
}
.profile-desc {
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  margin: 0;
}

.player-card {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(201, 169, 110, 0.05) 100%);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-xl);
}

.rank-info {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.rank-seal-wrap {
  flex-shrink: 0;
}
.rank-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rank-text h2 {
  font-size: var(--fs-2xl);
  margin: 0;
  color: var(--c-gold);
}
.rank-sub {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}
.level-badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border: 1px solid var(--c-border-accent);
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
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
}
.stat-label {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-2);
}
.stat-value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
}
.stat-value.fire {
  color: #c86f4d;
}
.stat-value small {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  font-weight: 400;
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
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--c-border-subtle);
}
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #b9674d, var(--c-gold));
  border-radius: 4px;
  transition: width 1s var(--ease-out);
}
.max-rank {
  align-items: center;
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.my-8 {
  margin: var(--sp-8) 0;
}
.section-title {
  font-size: var(--fs-xl);
  color: var(--c-gold);
  margin-bottom: var(--sp-4);
  letter-spacing: 0.05em;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--sp-4);
}
.school-card {
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  border-left: 4px solid var(--school-color, var(--c-gold));
  border-radius: var(--radius-md);
}
.school-header {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.school-icon {
  display: flex;
  align-items: center;
}
.school-name {
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
  font-size: var(--fs-base);
}
.school-progress-text {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  text-align: right;
}
.school-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.25);
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--sp-3);
}
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  opacity: 0.55;
  filter: grayscale(80%);
  transition: all var(--duration-normal) var(--ease-out);
  cursor: help;
}
.achievement-badge.is-unlocked {
  opacity: 1;
  filter: none;
  border-color: var(--c-border-accent);
  background: var(--c-gold-glow);
}
.ach-icon-wrap {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(201, 169, 110, 0.12);
  flex-shrink: 0;
}
.ach-icon-wrap.locked {
  background: rgba(255, 255, 255, 0.04);
}
.ach-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ach-title {
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
  font-size: var(--fs-sm);
}
.ach-desc {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.fade-in {
  animation: fadeIn 0.5s var(--ease-out) forwards;
  opacity: 0;
  transform: translateY(10px);
}
.delay-1 {
  animation-delay: 0.1s;
}
.delay-2 {
  animation-delay: 0.2s;
}
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 650px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
