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

  return {
    sidebarCollapsed,
    toggleSidebar,
    activeSchoolFilter,
    currentSessionChapterId,
  }
})
