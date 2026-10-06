import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LEARNING_TRACKS, KNOWLEDGE_POINTS } from '@/data/knowledgeGraph'

const STORAGE_KEY_COLLECTED = 'litc_collected_knowledge_points'
const STORAGE_KEY_MASTERED = 'litc_mastered_knowledge_points'
const STORAGE_KEY_ACTIVE_TRACK = 'litc_active_learning_track'

export const useKnowledgeCollectionStore = defineStore('knowledgeCollection', () => {
  // 收藏清單
  const collectedPointIds = ref<string[]>(loadFromStorage(STORAGE_KEY_COLLECTED, []))
  // 已掌握/已研習清單
  const masteredPointIds = ref<string[]>(loadFromStorage(STORAGE_KEY_MASTERED, []))
  // 當前選定的學習路徑
  const activeTrackId = ref<string>(loadFromStorage(STORAGE_KEY_ACTIVE_TRACK, 'track-peace'))

  function loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') return fallback
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : fallback
    } catch {
      return fallback
    }
  }

  function saveToStorage<T>(key: string, value: T) {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }

  function toggleCollect(pointId: string) {
    const idx = collectedPointIds.value.indexOf(pointId)
    if (idx >= 0) {
      collectedPointIds.value.splice(idx, 1)
    } else {
      collectedPointIds.value.push(pointId)
    }
    saveToStorage(STORAGE_KEY_COLLECTED, collectedPointIds.value)
  }

  function toggleMaster(pointId: string) {
    const idx = masteredPointIds.value.indexOf(pointId)
    if (idx >= 0) {
      masteredPointIds.value.splice(idx, 1)
    } else {
      masteredPointIds.value.push(pointId)
    }
    saveToStorage(STORAGE_KEY_MASTERED, masteredPointIds.value)
  }

  function setActiveTrack(trackId: string) {
    activeTrackId.value = trackId
    saveToStorage(STORAGE_KEY_ACTIVE_TRACK, trackId)
  }

  function isCollected(pointId: string): boolean {
    return collectedPointIds.value.includes(pointId)
  }

  function isMastered(pointId: string): boolean {
    return masteredPointIds.value.includes(pointId)
  }

  const totalCollectedCount = computed(() => collectedPointIds.value.length)
  const totalMasteredCount = computed(() => masteredPointIds.value.length)
  const totalPointsCount = computed(() => KNOWLEDGE_POINTS.length)

  const overallMasteryPercent = computed(() => {
    if (totalPointsCount.value === 0) return 0
    return Math.round((totalMasteredCount.value / totalPointsCount.value) * 100)
  })

  function getTrackProgress(trackId: string): { total: number; completed: number; percent: number } {
    const track = LEARNING_TRACKS.find(t => t.id === trackId)
    if (!track || track.pointIds.length === 0) return { total: 0, completed: 0, percent: 0 }
    const total = track.pointIds.length
    const completed = track.pointIds.filter(id => masteredPointIds.value.includes(id)).length
    const percent = Math.round((completed / total) * 100)
    return { total, completed, percent }
  }

  return {
    collectedPointIds,
    masteredPointIds,
    activeTrackId,
    totalCollectedCount,
    totalMasteredCount,
    totalPointsCount,
    overallMasteryPercent,
    toggleCollect,
    toggleMaster,
    setActiveTrack,
    isCollected,
    isMastered,
    getTrackProgress,
  }
})
