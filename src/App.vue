<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'
import NavSidebar from '@/components/NavSidebar.vue'
import InkCanvas from '@/components/InkCanvas.vue'
import DisplayControls from '@/components/DisplayControls.vue'
const SearchModal = defineAsyncComponent(() => import('@/components/SearchModal.vue'))

const isSearchOpen = ref(false)

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}

function handleOpenSearch() {
  isSearchOpen.value = true
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('open-search-modal', handleOpenSearch)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('open-search-modal', handleOpenSearch)
})
</script>

<template>
  <div class="app-layout">
    <InkCanvas />
    <NavSidebar @open-search="isSearchOpen = true" />
    <DisplayControls />
    <SearchModal v-if="isSearchOpen" :isOpen="isSearchOpen" @close="isSearchOpen = false" />
    <main class="app-main">
      <div class="app-main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* App-level layout handled by main.css (.app-layout, .app-main) */
</style>
