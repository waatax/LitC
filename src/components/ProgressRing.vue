<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}>(), {
  size: 64,
  strokeWidth: 4,
  color: 'var(--c-gold)',
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => {
  const clamped = Math.max(0, Math.min(100, props.value))
  return circumference.value * (1 - clamped / 100)
})
const center = computed(() => props.size / 2)
const displayValue = computed(() => Math.round(Math.max(0, Math.min(100, props.value))))
</script>

<template>
  <div class="progress-ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
    >
      <!-- Background track -->
      <circle
        class="ring-track"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Progress arc -->
      <circle
        class="ring-progress"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
    <span class="ring-label">{{ displayValue }}%</span>
  </div>
</template>

<style scoped>
.progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.ring-track {
  stroke: var(--c-border);
  opacity: 0.4;
}

.ring-progress {
  transition: stroke-dashoffset var(--duration-slow) var(--ease-out);
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--c-text-secondary);
  pointer-events: none;
}
</style>
