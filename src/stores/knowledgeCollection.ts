import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LEARNING_TRACKS, KNOWLEDGE_POINTS } from '@/data/knowledgeGraph'

const STORAGE_KEY_COLLECTED = 'litc_collected_knowledge_points'
const STORAGE_KEY_MASTERED = 'litc_mastered_knowledge_points'
const STORAGE_KEY_ACTIVE_TRACK = 'litc_active_learning_track'
const STORAGE_KEY_NOTES = 'litc_knowledge_notes'

export interface KnowledgeMasteryLevel {
  level: number
  title: string
  sealText: string
  description: string
  requiredCount: number
}

export const KNOWLEDGE_MASTERY_LEVELS: KnowledgeMasteryLevel[] = [
  { level: 1, title: '初啟文樞', sealText: '初', description: '初窺先秦先賢門徑，博覽群言。', requiredCount: 0 },
  { level: 2, title: '漸入佳境', sealText: '進', description: '對儒道兵墨核心義理有初步了悟。', requiredCount: 3 },
  { level: 3, title: '洞明條理', sealText: '明', description: '能融通先秦思想脈絡，辨析名實。', requiredCount: 8 },
  { level: 4, title: '融會百家', sealText: '通', description: '深得先秦諸子精粹，知行合一。', requiredCount: 16 },
  { level: 5, title: '經世通儒', sealText: '宗', description: '參透千古大義，思想豁然貫通。', requiredCount: 25 },
]

export const useKnowledgeCollectionStore = defineStore('knowledgeCollection', () => {
  // 收藏清單
  const collectedPointIds = ref<string[]>(loadFromStorage(STORAGE_KEY_COLLECTED, []))
  // 已掌握/已研習清單
  const masteredPointIds = ref<string[]>(loadFromStorage(STORAGE_KEY_MASTERED, []))
  // 當前選定的學習路徑
  const activeTrackId = ref<string>(loadFromStorage(STORAGE_KEY_ACTIVE_TRACK, 'track-peace'))
  // 個人研讀筆記與實踐心得 (pointId -> noteText)
  const notesMap = ref<Record<string, string>>(loadFromStorage(STORAGE_KEY_NOTES, {}))

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

  function getNote(pointId: string): string {
    return notesMap.value[pointId] || ''
  }

  function saveNote(pointId: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      delete notesMap.value[pointId]
    } else {
      notesMap.value[pointId] = trimmed
    }
    saveToStorage(STORAGE_KEY_NOTES, { ...notesMap.value })
  }

  function hasNote(pointId: string): boolean {
    return Boolean(notesMap.value[pointId]?.trim())
  }

  const totalCollectedCount = computed(() => collectedPointIds.value.length)
  const totalMasteredCount = computed(() => masteredPointIds.value.length)
  const totalPointsCount = computed(() => KNOWLEDGE_POINTS.length)
  const totalNotesCount = computed(() => Object.keys(notesMap.value).length)

  const overallMasteryPercent = computed(() => {
    if (totalPointsCount.value === 0) return 0
    return Math.round((totalMasteredCount.value / totalPointsCount.value) * 100)
  })

  const currentMasteryLevel = computed<KnowledgeMasteryLevel>(() => {
    const count = masteredPointIds.value.length
    let current = KNOWLEDGE_MASTERY_LEVELS[0]
    for (const lvl of KNOWLEDGE_MASTERY_LEVELS) {
      if (count >= lvl.requiredCount) {
        current = lvl
      } else {
        break
      }
    }
    return current
  })

  const nextMasteryLevel = computed<KnowledgeMasteryLevel | null>(() => {
    const count = masteredPointIds.value.length
    for (const lvl of KNOWLEDGE_MASTERY_LEVELS) {
      if (count < lvl.requiredCount) {
        return lvl
      }
    }
    return null
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
    notesMap,
    totalCollectedCount,
    totalMasteredCount,
    totalPointsCount,
    totalNotesCount,
    overallMasteryPercent,
    currentMasteryLevel,
    nextMasteryLevel,
    toggleCollect,
    toggleMaster,
    setActiveTrack,
    isCollected,
    isMastered,
    getNote,
    saveNote,
    hasNote,
    getTrackProgress,
  }
})
