<script setup lang="ts">
import { computed } from 'vue'
import type { SchoolId } from '@/types/content'

const props = defineProps<{
  schoolId: SchoolId
}>()

const schoolMeta: Record<SchoolId, { name: string; badgeClass: string }> = {
  daoism:  { name: '道家', badgeClass: 'badge-dao' },
  legalism: { name: '法家', badgeClass: 'badge-legal' },
  mohism:  { name: '墨家', badgeClass: 'badge-mohist' },
  confucianism: { name: '儒家', badgeClass: 'badge-confucian' },
  literature: { name: '文學', badgeClass: 'badge-literature' },
}

const meta = computed(() => {
  return schoolMeta[props.schoolId] || { name: '未知', badgeClass: '' }
})
</script>

<template>
  <span class="badge" :class="meta.badgeClass">
    {{ meta.name }}
  </span>
</template>

<style scoped>
/* Badge base styling is in main.css (.badge, .badge-dao, etc.)
   We just add a subtle transition for hover effects */
.badge {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  cursor: default;
}
.badge:hover {
  transform: scale(1.05);
}
</style>
