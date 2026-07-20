import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export const useGamificationStore = defineStore('gamification', () => {
  const streak = ref(3) // Default streak initialized for demo purposes
  const exp = ref(15)   // Default exp
  
  const achievements = ref<Achievement[]>([
    { id: 'first-card', title: '首戰告捷', description: '成功背誦第一個句子', icon: '🎯' },
    { id: 'streak-3', title: '三日同心', description: '連續背誦達到 3 天', icon: '🔥', unlockedAt: new Date().toISOString() },
    { id: 'knowledge-king', title: '溫故知新', description: '成功完成一次舊句複習', icon: '📖' },
    { id: 'book-worm', title: '諸子百家', description: '累積學習達 50 經驗值', icon: '🦉' }
  ])

  function addExp(amount: number): Achievement[] {
    exp.value += amount
    const newUnlocked: Achievement[] = []
    
    // Check experience-based achievements
    if (exp.value >= 50) {
      const ach = achievements.value.find(a => a.id === 'book-worm')
      if (ach && !ach.unlockedAt) {
        ach.unlockedAt = new Date().toISOString()
        newUnlocked.push(ach)
      }
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

  return {
    streak,
    exp,
    achievements,
    addExp,
    unlockAchievement,
    incrementStreak
  }
})
