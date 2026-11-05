<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGamificationStore } from '@/stores/gamification'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import { getLearningTrackById } from '@/data/knowledgeGraph'
import ClassicalIcon, { type IconName } from '@/components/ClassicalIcon.vue'
import RedSeal from '@/components/RedSeal.vue'

const store = useGamificationStore()
const knowledgeStore = useKnowledgeCollectionStore()

// Imperial Examination Passport Modal
const isPassportModalOpen = ref(false)
const passportToast = ref<string | null>(null)

function openPassportModal() {
  isPassportModalOpen.value = true
}

function copyPassportCertificate() {
  const rank = store.currentRank.title
  const streak = store.streak
  const exp = store.exp
  const mastered = store.totalSentencesMastered
  const cert = `📜【經典文脈 ClassicFlow ‧ 文心雕龍修業通關文牒】\n` +
    `功名位階：${rank}（第 ${store.currentRank.level} 階）\n` +
    `連續修持：${streak} 日\n` +
    `文脈學分：${exp} 點\n` +
    `熟讀經句：${mastered} 句\n` +
    `鈐印：經典文脈 ‧ 傳世正宗\n` +
    `「博學之，審問之，慎思之，明辨之，篤行之。」`
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(cert)
  }
  passportToast.value = '已複製文心雕龍通關文牒！'
  setTimeout(() => { passportToast.value = null }, 2200)
}

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

      <!-- Passport Trigger Button -->
      <div class="passport-trigger-row">
        <button class="passport-btn font-serif" @click="openPassportModal">
          <ClassicalIcon name="feather" :size="16" color="var(--c-gold)" />
          <span>榮頒 ‧ 文心雕龍修業通關文牒</span>
          <span class="passport-arrow">→</span>
        </button>
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

    <!-- Imperial Scholarly Passport Modal -->
    <Teleport to="body">
      <transition name="search-fade">
        <div v-if="isPassportModalOpen" class="passport-modal-backdrop" @click.self="isPassportModalOpen = false">
          <div class="passport-modal-card">
            <button class="passport-close-btn" @click="isPassportModalOpen = false" aria-label="關閉">
              <ClassicalIcon name="close" :size="16" />
            </button>

            <!-- Printable Certificate Frame -->
            <div class="passport-parchment">
              <div class="parchment-border">
                <div class="passport-seal-watermark">
                  <RedSeal text="文脈" :size="64" :animate="false" />
                </div>

                <div class="passport-header">
                  <span class="passport-imperial font-serif">奉天承運 ‧ 文脈聿修</span>
                  <h2 class="passport-title font-serif">文心雕龍修業通關文牒</h2>
                  <span class="passport-subtitle font-serif">先秦兩漢唐宋經史子集通達之憑照</span>
                </div>

                <div class="passport-body font-serif">
                  <p class="passport-grant">
                    茲有修持士子，研讀華夏傳世經典，博採諸子百家微言大義。經筵試煉，學力卓著，特頒此牒，以昭策勵：
                  </p>

                  <div class="passport-data-grid">
                    <div class="data-cell">
                      <span class="data-key">功名位階</span>
                      <strong class="data-val rank-val">{{ store.currentRank.title }}</strong>
                      <span class="data-sub">第 {{ store.currentRank.level }} 階</span>
                    </div>
                    <div class="data-cell">
                      <span class="data-key">連續修持</span>
                      <strong class="data-val">{{ store.streak }} 日</strong>
                      <span class="data-sub">恆心如月</span>
                    </div>
                    <div class="data-cell">
                      <span class="data-key">文脈學分</span>
                      <strong class="data-val">{{ store.exp }} 點</strong>
                      <span class="data-sub">積水成淵</span>
                    </div>
                    <div class="data-cell">
                      <span class="data-key">熟讀經句</span>
                      <strong class="data-val">{{ store.totalSentencesMastered }} 句</strong>
                      <span class="data-sub">字字珠璣</span>
                    </div>
                  </div>

                  <div class="passport-motto">
                    「博學之，審問之，慎思之，明辨之，篤行之。」
                  </div>
                </div>

                <div class="passport-footer">
                  <div class="passport-issuer font-serif">
                    <span>經典文脈 ClassicFlow 經筵司</span>
                    <small>正宗古籍 ‧ 聲律傳承</small>
                  </div>
                  <div class="passport-seal-final">
                    <RedSeal text="至善" :size="48" :animate="false" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="passport-actions">
              <button class="btn btn-primary passport-copy-btn font-serif" @click="copyPassportCertificate">
                <ClassicalIcon name="feather" :size="15" />
                <span>複製通關殊榮題跋</span>
              </button>
              <button class="btn btn-ghost font-serif" @click="isPassportModalOpen = false">
                關閉
              </button>
            </div>

            <transition name="toast-fade">
              <div v-if="passportToast" class="passport-toast">
                {{ passportToast }}
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
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

/* Scholarly Imperial Passport Styles */
.passport-trigger-row {
  margin-top: var(--sp-2);
}

.passport-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(201, 169, 110, 0.05) 100%);
  border: 1px solid var(--c-gold);
  color: var(--c-gold-light);
  font-size: var(--fs-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.passport-btn:hover {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.25) 0%, rgba(201, 169, 110, 0.1) 100%);
  box-shadow: 0 4px 16px rgba(201, 169, 110, 0.2);
  transform: translateY(-1px);
}

.passport-arrow {
  color: var(--c-gold);
  font-size: 1.1rem;
}

.passport-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(10, 12, 18, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.passport-modal-card {
  position: relative;
  width: 100%;
  max-width: 620px;
  background: var(--c-bg-card, #1c1f2b);
  border: 1px solid var(--c-border-gold-glow, rgba(201, 169, 110, 0.3));
  border-radius: var(--radius-xl, 16px);
  padding: 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.passport-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.passport-parchment {
  background: #faf6ee;
  color: #2c251e;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.parchment-border {
  position: relative;
  border: 2px solid #9c7b45;
  border-radius: 8px;
  padding: 24px 20px;
  background: #f8f3e8;
  overflow: hidden;
}

.passport-seal-watermark {
  position: absolute;
  top: 15px;
  right: 15px;
  opacity: 0.18;
  pointer-events: none;
}

.passport-header {
  text-align: center;
  border-bottom: 2px solid #8c6d3b;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.passport-imperial {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #8c6d3b;
  display: block;
  font-weight: 700;
}

.passport-title {
  font-size: 1.5rem;
  color: #1f1b18;
  margin: 4px 0;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.passport-subtitle {
  font-size: 0.75rem;
  color: #665a4c;
}

.passport-body {
  margin-bottom: 16px;
}

.passport-grant {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #3d352b;
  text-align: justify;
  margin-bottom: 16px;
}

.passport-data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  background: rgba(140, 109, 59, 0.08);
  border: 1px solid rgba(140, 109, 59, 0.25);
  border-radius: 6px;
  padding: 12px 8px;
  margin-bottom: 16px;
}

.data-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.data-key {
  font-size: 0.7rem;
  color: #665a4c;
}

.data-val {
  font-size: 1.15rem;
  color: #855b21;
  margin: 2px 0;
}

.data-val.rank-val {
  color: #a62b2b;
}

.data-sub {
  font-size: 0.65rem;
  color: #8c6d3b;
}

.passport-motto {
  text-align: center;
  font-size: 0.85rem;
  font-style: italic;
  color: #735930;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.passport-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed rgba(140, 109, 59, 0.35);
  padding-top: 12px;
}

.passport-issuer {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: #4a3e31;
  font-weight: 700;
}

.passport-issuer small {
  font-size: 0.68rem;
  color: #7a6a57;
  font-weight: 400;
}

.passport-actions {
  display: flex;
  gap: 10px;
}

.passport-copy-btn {
  flex: 1;
  background: var(--c-gold);
  color: #1a150b;
  font-weight: 700;
}

.passport-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(18, 20, 28, 0.95);
  border: 1px solid var(--c-gold);
  color: var(--c-gold-light);
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 0.875rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  z-index: 20;
}
</style>
