import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Rank {
  level: number
  title: string
  minExp: number
  icon: string
}

export const RANKS: Rank[] = [
  { level: 1, title: '蒙童', minExp: 0, icon: '🌱' },
  { level: 2, title: '童生', minExp: 50, icon: '📒' },
  { level: 3, title: '秀才', minExp: 150, icon: '🎋' },
  { level: 4, title: '舉人', minExp: 400, icon: '🏮' },
  { level: 5, title: '貢士', minExp: 800, icon: '🎯' },
  { level: 6, title: '進士', minExp: 1500, icon: '🏛️' },
  { level: 7, title: '翰林', minExp: 3000, icon: '🐉' },
  { level: 8, title: '太學士', minExp: 5000, icon: '👑' },
]

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export const useGamificationStore = defineStore('gamification', () => {
  const streak = ref(Number(localStorage.getItem('litc-streak') || 3))
  const exp = ref(Number(localStorage.getItem('litc-exp') || 15))
  const totalSentencesMastered = ref(Number(localStorage.getItem('litc-sentences') || 0))
  const schoolProgress = ref<Record<string, number>>(JSON.parse(localStorage.getItem('litc-school') || '{}'))

  // persistence
  watch(streak, (val) => localStorage.setItem('litc-streak', val.toString()))
  watch(exp, (val) => localStorage.setItem('litc-exp', val.toString()))
  watch(totalSentencesMastered, (val) => localStorage.setItem('litc-sentences', val.toString()))
  watch(schoolProgress, (val) => localStorage.setItem('litc-school', JSON.stringify(val)), { deep: true })
  
  const achievements = ref<Achievement[]>([
    { id: 'first-card', title: '首戰告捷', description: '成功背誦第一個句子', icon: '🎯' },
    { id: 'streak-3', title: '三日同心', description: '連續背誦達到 3 天', icon: '🔥', unlockedAt: new Date().toISOString() },
    { id: 'knowledge-king', title: '溫故知新', description: '成功完成一次舊句複習', icon: '📖' },
    { id: 'book-worm', title: '諸子百家', description: '累積學習達 50 經驗值', icon: '🦉' },
    { id: 'streak-7', title: '七日修行', description: '連續學習達到 7 天', icon: '🔥' },
    { id: 'streak-30', title: '三十而立', description: '連續學習達到 30 天', icon: '💪' },
    { id: 'quiz-perfect', title: '百發百中', description: '測驗得分 100%', icon: '🎯' },
    { id: 'speed-reader', title: '行雲流水', description: '背誦速度達到 30 字/分鐘', icon: '🌊' },
    { id: 'easy-streak-5', title: '過目不忘', description: '連續 5 句評級為 Easy', icon: '⚡' },
    { id: 'milestone-100', title: '百句入心', description: '累計背誦突破 100 句', icon: '📖' },
    { id: 'milestone-500', title: '金石為開', description: '累計背誦突破 500 句', icon: '💎' },
    { id: 'daily-triple', title: '一日三省', description: '單日完成 3 個章節的複習', icon: '🌟' },
    { id: 'explorer-10', title: '博覽群書', description: '閱讀過 10 部不同典籍', icon: '🗺️' },
    { id: 'school-dao-1', title: '道家初學', description: '道家背誦 ≥5 句', icon: '☯️' },
    { id: 'school-dao-2', title: '道家門人', description: '道家背誦 ≥30 句', icon: '☯️' },
    { id: 'school-dao-3', title: '道家真人', description: '道家融會貫通', icon: '☯️' },
    { id: 'school-confucian-1', title: '儒門初學', description: '儒家背誦 ≥5 句', icon: '📜' },
    { id: 'school-confucian-2', title: '儒門弟子', description: '儒家背誦 ≥30 句', icon: '📜' },
    { id: 'school-confucian-3', title: '大儒通儒', description: '儒家融會貫通', icon: '📜' },
    { id: 'school-legalism-1', title: '法家初識', description: '法家背誦 ≥5 句', icon: '⚖️' },
    { id: 'school-legalism-2', title: '法家入門', description: '法家背誦 ≥30 句', icon: '⚖️' },
    { id: 'school-legalism-3', title: '法家通達', description: '法家融會貫通', icon: '⚖️' },
    { id: 'school-military-1', title: '兵法初窺', description: '兵家背誦 ≥5 句', icon: '⚔️' },
    { id: 'school-military-2', title: '兵法習練', description: '兵家背誦 ≥30 句', icon: '⚔️' },
    { id: 'school-military-3', title: '兵法大師', description: '兵家融會貫通', icon: '⚔️' }
  ])

  // load saved achievements if any
  const savedAchievements = JSON.parse(localStorage.getItem('litc-achievements') || '[]')
  savedAchievements.forEach((saved: any) => {
    const ach = achievements.value.find(a => a.id === saved.id)
    if (ach && saved.unlockedAt) {
      ach.unlockedAt = saved.unlockedAt
    }
  })

  watch(achievements, (val) => {
    localStorage.setItem('litc-achievements', JSON.stringify(val.filter(a => a.unlockedAt).map(a => ({ id: a.id, unlockedAt: a.unlockedAt }))))
  }, { deep: true })

  const currentRank = computed(() => {
    let rank = RANKS[0]
    for (const r of RANKS) {
      if (exp.value >= r.minExp) {
        rank = r
      } else {
        break
      }
    }
    return rank
  })

  const nextRank = computed(() => {
    return RANKS.find(r => r.level === currentRank.value.level + 1) || null
  })

  const rankProgress = computed(() => {
    if (!nextRank.value) return 100
    const rankMin = currentRank.value.minExp
    const rankMax = nextRank.value.minExp
    const progress = ((exp.value - rankMin) / (rankMax - rankMin)) * 100
    return Math.min(Math.max(progress, 0), 100)
  })

  // Track previous rank to check level up
  let previousRank = currentRank.value

  function checkRankUp(): Rank | null {
    const current = currentRank.value
    if (current.level > previousRank.level) {
      previousRank = current
      return current
    }
    return null
  }

  function addExp(amount: number): Achievement[] {
    exp.value += amount
    const newUnlocked: Achievement[] = []
    
    // Check experience-based achievements
    if (exp.value >= 50) {
      const unlocked = unlockAchievement('book-worm')
      if (unlocked) newUnlocked.push(unlocked)
    }

    return newUnlocked
  }

  function unlockAchievement(id: string): Achievement | null {
    const ach = achievements.value.find(a => a.id === id)
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = new Date().toISOString()
      return ach
    }
    return null
  }

  function incrementStreak() {
    streak.value += 1
  }

  function addSchoolProgress(schoolId: string, count: number) {
    if (!schoolProgress.value[schoolId]) {
      schoolProgress.value[schoolId] = 0
    }
    schoolProgress.value[schoolId] += count
    totalSentencesMastered.value += count

    // Example logic to unlock school-specific achievements
    const progress = schoolProgress.value[schoolId]
    if (schoolId === 'daoism') {
      if (progress >= 5) unlockAchievement('school-dao-1')
      if (progress >= 30) unlockAchievement('school-dao-2')
    }
    // ... we could expand this further
  }

  return {
    streak,
    exp,
    totalSentencesMastered,
    schoolProgress,
    achievements,
    currentRank,
    nextRank,
    rankProgress,
    addExp,
    unlockAchievement,
    incrementStreak,
    checkRankUp,
    addSchoolProgress
  }
})
