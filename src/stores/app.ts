import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RecentChapterRecord {
  chapterId: string
  chapterTitle: string
  workId: string
  workTitle: string
  schoolId: string
  timestamp: number
}

const RECENT_CHAPTERS_KEY = 'litc-recent-chapters'
const BOOKMARK_WORKS_KEY = 'litc-bookmark-works'
const BOOKMARK_CHAPTERS_KEY = 'litc-bookmark-chapters'
const COMPLETED_CHAPTERS_KEY = 'litc-completed-chapters'

function loadJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJson<T>(key: string, val: T) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    // ignore storage quota errors
  }
}

/**
 * App-level UI state (Pinia store).
 * Core learning data lives in the content data modules, not here.
 * Per F9 from the Master Plan: "核心記憶資料不該混進 UI store"
 */
export const useAppStore = defineStore('app', () => {
  // Sidebar state
  const sidebarCollapsed = ref(false)
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // Active school filter for library
  const activeSchoolFilter = ref<string | null>(null)

  // Current learning session
  const currentSessionChapterId = ref<string | null>(null)

  // Reading History & Bookmarks ("書齋案頭 & 藏書閣收藏")
  const recentChapters = ref<RecentChapterRecord[]>(loadJson<RecentChapterRecord[]>(RECENT_CHAPTERS_KEY, []))
  const bookmarkedWorks = ref<string[]>(loadJson<string[]>(BOOKMARK_WORKS_KEY, ['dao-de-jing', 'lun-yu', 'gu-wen-guan-zhi']))
  const bookmarkedChapters = ref<string[]>(loadJson<string[]>(BOOKMARK_CHAPTERS_KEY, []))
  const completedChapters = ref<string[]>(loadJson<string[]>(COMPLETED_CHAPTERS_KEY, []))

  const recordChapterRead = (record: Omit<RecentChapterRecord, 'timestamp'>) => {
    const filtered = recentChapters.value.filter(r => r.chapterId !== record.chapterId)
    filtered.unshift({
      ...record,
      timestamp: Date.now()
    })
    recentChapters.value = filtered.slice(0, 8)
    saveJson(RECENT_CHAPTERS_KEY, recentChapters.value)
  }

  const toggleWorkBookmark = (workId: string) => {
    const idx = bookmarkedWorks.value.indexOf(workId)
    if (idx >= 0) {
      bookmarkedWorks.value.splice(idx, 1)
    } else {
      bookmarkedWorks.value.unshift(workId)
    }
    saveJson(BOOKMARK_WORKS_KEY, bookmarkedWorks.value)
  }

  const isWorkBookmarked = (workId: string) => bookmarkedWorks.value.includes(workId)

  const toggleChapterBookmark = (chapterId: string) => {
    const idx = bookmarkedChapters.value.indexOf(chapterId)
    if (idx >= 0) {
      bookmarkedChapters.value.splice(idx, 1)
    } else {
      bookmarkedChapters.value.unshift(chapterId)
    }
    saveJson(BOOKMARK_CHAPTERS_KEY, bookmarkedChapters.value)
  }

  const isChapterBookmarked = (chapterId: string) => bookmarkedChapters.value.includes(chapterId)

  const markChapterCompleted = (chapterId: string) => {
    if (!completedChapters.value.includes(chapterId)) {
      completedChapters.value.push(chapterId)
      saveJson(COMPLETED_CHAPTERS_KEY, completedChapters.value)
    }
  }

  const isChapterCompleted = (chapterId: string) => completedChapters.value.includes(chapterId)

  // Global reader vertical layout preference
  const isVertical = ref(localStorage.getItem('litc-is-vertical') === 'true')
  const toggleVertical = () => {
    isVertical.value = !isVertical.value
    localStorage.setItem('litc-is-vertical', String(isVertical.value))
  }

  // Theme state
  const currentTheme = ref<string>(localStorage.getItem('litc-theme') || 'charcoal')
  
  const setTheme = (themeId: string) => {
    currentTheme.value = themeId
    const html = document.documentElement
    
    // Remove old theme classes
    html.classList.remove(
      'theme-charcoal', 'theme-xuan', 'theme-celadon', 
      'theme-cinnabar', 'theme-bamboo', 'theme-pinesoot', 'theme-amber',
      'theme-light', 'theme-dark', 'light-theme'
    )
    
    // Add new theme class
    html.classList.add(`theme-${themeId}`)
    
    // Determine if light or dark
    const lightThemes = ['xuan', 'celadon', 'amber']
    const isLight = lightThemes.includes(themeId)
    
    html.classList.toggle('theme-light', isLight)
    html.classList.toggle('light-theme', isLight)
    html.classList.toggle('theme-dark', !isLight)
    html.style.colorScheme = isLight ? 'light' : 'dark'
    localStorage.setItem('litc-theme', themeId)
  }

  // Glassmorphism effect state (true: frosted glass with backdrop blur, false: clean reading / fast performance)
  const glassEffect = ref(typeof localStorage !== 'undefined' ? localStorage.getItem('litc-glass-effect') !== 'false' : true)

  const applyGlassEffect = (enabled: boolean) => {
    glassEffect.value = enabled
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.classList.toggle('no-glass', !enabled)
      html.dataset.glass = enabled ? 'true' : 'false'
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('litc-glass-effect', String(enabled))
    }
  }

  const toggleGlassEffect = (enable?: boolean) => {
    const nextVal = typeof enable === 'boolean' ? enable : !glassEffect.value
    applyGlassEffect(nextVal)
  }

  // Initial apply of glass effect
  if (typeof document !== 'undefined') {
    applyGlassEffect(glassEffect.value)
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    activeSchoolFilter,
    currentSessionChapterId,
    recentChapters,
    bookmarkedWorks,
    bookmarkedChapters,
    completedChapters,
    recordChapterRead,
    toggleWorkBookmark,
    isWorkBookmarked,
    toggleChapterBookmark,
    isChapterBookmarked,
    markChapterCompleted,
    isChapterCompleted,
    isVertical,
    toggleVertical,
    currentTheme,
    setTheme,
    glassEffect,
    toggleGlassEffect,
    applyGlassEffect
  }
})
