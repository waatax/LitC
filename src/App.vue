<script setup lang="ts">
import NavSidebar from '@/components/NavSidebar.vue'
import InkCanvas from '@/components/InkCanvas.vue'
</script>

<template>
  <div class="app-layout">
    <InkCanvas />
    <NavSidebar />
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

