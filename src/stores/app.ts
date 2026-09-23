import { defineStore } from 'pinia'
import { ref } from 'vue'

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
      'theme-cinnabar', 'theme-bamboo', 'theme-pinesoot',
      'theme-light', 'theme-dark', 'light-theme'
    )
    
    // Add new theme class
    html.classList.add(`theme-${themeId}`)
    
    // Determine if light or dark
    const lightThemes = ['xuan', 'celadon']
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
    isVertical,
    toggleVertical,
    currentTheme,
    setTheme,
    glassEffect,
    toggleGlassEffect,
    applyGlassEffect
  }
})
