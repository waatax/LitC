<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '@/stores/gamification'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import { getLearningTrackById } from '@/data/knowledgeGraph'
import ClassicalIcon, { type IconName } from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'

const store = useGamificationStore()
const knowledgeStore = useKnowledgeCollectionStore()

const activeTrack = computed(() => {
  return getLearningTrackById(knowledgeStore.activeTrackId) || null
})

const activeTrackProgress = computed(() => {
  if (!activeTrack.value) return { total: 0, completed: 0, percent: 0 }
  return knowledgeStore.getTrackProgress(activeTrack.value.id)
})

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

    <!-- 主卡片：背誦修為境界 -->
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

    <!-- 先秦義理與思想造詣 -->
    <section class="knowledge-mastery-section glass-card fade-in delay-1">
      <div class="km-header-row">
        <div>
          <span class="km-eyebrow font-serif">文海觀瀾 ‧ 義理深思</span>
          <h3 class="km-title font-serif">先秦諸子思想造詣</h3>
        </div>
        <div class="km-badge font-serif">
          <span>文海境界：{{ knowledgeStore.currentMasteryLevel.title }}</span>
        </div>
      </div>

      <div class="km-stats-row">
        <div class="km-stat-box">
          <small>已深刻領會義理</small>
          <strong>{{ knowledgeStore.totalMasteredCount }} / {{ knowledgeStore.totalPointsCount }}</strong>
          <span class="km-pct">領會率 {{ knowledgeStore.overallMasteryPercent }}%</span>
        </div>
        <div class="km-stat-box">
          <small>文萃精華收藏</small>
          <strong>{{ knowledgeStore.totalCollectedCount }} 則</strong>
          <span class="km-pct">隨時溫故</span>
        </div>
        <div class="km-stat-box">
          <small>實踐研讀札記</small>
          <strong>{{ knowledgeStore.totalNotesCount }} 篇</strong>
          <span class="km-pct">個人體悟心得</span>
        </div>
      </div>

      <!-- 當前修習學程進度條 -->
      <div v-if="activeTrack" class="km-track-banner glass-panel">
        <div class="km-track-left">
          <RedSeal :text="activeTrack.sealText" :size="32" />
          <div>
            <strong class="font-serif km-track-name">{{ activeTrack.title }}</strong>
            <p class="km-track-sub">{{ activeTrack.subtitle }}</p>
          </div>
        </div>
        <div class="km-track-right">
          <span class="km-track-pct font-serif">已掌握 {{ activeTrackProgress.percent }}%</span>
          <router-link to="/wenhai?tab=tracks" class="btn btn-outline btn-sm km-nav-btn">
            <span>前往文海研修</span>
            <ClassicalIcon name="arrow-right" :size="12" />
          </router-link>
        </div>
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--sp-4) var(--sp-12);
}

.profile-header {
  margin-bottom: var(--sp-6);
}
.classical-text {
  letter-spacing: 0.05em;
}
.profile-desc {
  color: var(--c-text-secondary);
  font-size: var(--fs-sm);
  margin-top: var(--sp-1);
}

.player-card {
  padding: var(--sp-6);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.rank-info {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.rank-seal-wrap {
  flex-shrink: 0;
}
.rank-text {
  display: flex;
  flex-direction: column;
}
.rank-name-row {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
}
.rank-name-row h2 {
  font-size: var(--fs-2xl);
  color: var(--c-gold);
  margin: 0;
}
.level-badge {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  border: 1px solid var(--c-border-subtle);
  padding: 1px var(--sp-2);
  border-radius: var(--radius-full);
}
.rank-sub {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-top: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
  background: rgba(0, 0, 0, 0.2);
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
}
.stat-label {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}
.stat-value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--c-text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}
.stat-value.fire {
  color: #d97706;
}
.stat-value small {
  font-size: var(--fs-xs);
  font-weight: normal;
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

/* 先秦思想造詣區塊 */
.knowledge-mastery-section {
  padding: var(--sp-6);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  border-left: 4px solid var(--c-gold);
}

.km-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.km-eyebrow {
  display: block;
  font-size: 0.75rem;
  color: var(--c-gold);
  margin-bottom: 4px;
}

.km-title {
  margin: 0;
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
}

.km-badge {
  font-size: 0.82rem;
  color: var(--c-gold);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid var(--c-border-accent);
}

.km-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.km-stat-box {
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.km-stat-box small {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.km-stat-box strong {
  font-size: 1.25rem;
  color: var(--c-text-primary);
}

.km-pct {
  font-size: 0.75rem;
  color: var(--c-gold);
}

.km-track-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
  flex-wrap: wrap;
}

.km-track-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.km-track-name {
  font-size: 1.05rem;
  color: var(--c-text-primary);
}

.km-track-sub {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.km-track-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.km-track-pct {
  font-size: 0.82rem;
  color: var(--c-gold);
  font-weight: 600;
}

.km-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
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
  border-radius: 2px;
  transition: width 0.6s ease;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-3);
}
.achievement-badge {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s ease;
  opacity: 0.5;
}
.achievement-badge.is-unlocked {
  opacity: 1;
  border-color: var(--c-border-accent);
  background: rgba(201, 169, 110, 0.08);
}
.ach-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(201, 169, 110, 0.15);
  flex-shrink: 0;
}
.ach-icon-wrap.locked {
  background: rgba(0, 0, 0, 0.2);
}
.ach-info {
  display: flex;
  flex-direction: column;
}
.ach-title {
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  font-weight: var(--fw-semibold);
}
.ach-desc {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .km-track-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
