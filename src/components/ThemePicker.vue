<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
}>()

const themes = [
  { id: 'charcoal', name: '徽墨乾坤', desc: '深邃水墨金石', bg: '#06060b', accent: '#c9a96e' },
  { id: 'xuan', name: '寒江雪宣', desc: '溫潤紙質古籍', bg: '#faf6ee', accent: '#855b21' },
  { id: 'celadon', name: '雨過天青', desc: '淡雅青瓷色調', bg: '#ebf3ee', accent: '#3a8b64' },
  { id: 'cinnabar', name: '硃砂描金', desc: '古典朱紅金泥', bg: '#3a1616', accent: '#c9a96e' },
  { id: 'bamboo', name: '竹林月色', desc: '清幽夜間竹影', bg: '#0f1520', accent: '#5ba88a' },
  { id: 'pinesoot', name: '松煙夜讀', desc: '溫暖油燈夜讀', bg: '#1a130e', accent: '#c4943a' }
]

const pickerRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

const handleClickOutside = (event: MouseEvent) => {
  if (props.isOpen && pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  clearPreview()
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    focusedIndex.value = themes.findIndex(t => t.id === props.modelValue)
    if (focusedIndex.value === -1) focusedIndex.value = 0
  } else {
    clearPreview()
  }
})

const selectTheme = (id: string) => {
  emit('update:modelValue', id)
  emit('close')
}

const previewTheme = (id: string) => {
  if (!props.isOpen) return
  const html = document.documentElement
  html.classList.remove('theme-charcoal', 'theme-xuan', 'theme-celadon', 'theme-cinnabar', 'theme-bamboo', 'theme-pinesoot')
  html.classList.add(`theme-${id}`)
}

const clearPreview = () => {
  const html = document.documentElement
  html.classList.remove('theme-charcoal', 'theme-xuan', 'theme-celadon', 'theme-cinnabar', 'theme-bamboo', 'theme-pinesoot')
  if (props.modelValue) {
    html.classList.add(`theme-${props.modelValue}`)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % themes.length
      previewTheme(themes[focusedIndex.value].id)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value - 1 + themes.length) % themes.length
      previewTheme(themes[focusedIndex.value].id)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectTheme(themes[focusedIndex.value].id)
      break
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="isOpen"
      ref="pickerRef"
      class="theme-picker glass-card-elevated"
      role="radiogroup"
      aria-label="選擇主題"
    >
      <button
        v-for="(theme, index) in themes"
        :key="theme.id"
        type="button"
        role="radio"
        :aria-checked="modelValue === theme.id"
        class="theme-option"
        :class="{ active: modelValue === theme.id, focused: focusedIndex === index }"
        @click="selectTheme(theme.id)"
        @mouseenter="previewTheme(theme.id); focusedIndex = index"
        @mouseleave="clearPreview"
        @focus="previewTheme(theme.id); focusedIndex = index"
        @blur="clearPreview"
      >
        <div class="theme-swatch" :style="{ backgroundColor: theme.bg, borderColor: theme.accent }"></div>
        <div class="theme-info">
          <span class="theme-name font-serif">{{ theme.name }}</span>
          <span class="theme-desc">{{ theme.desc }}</span>
        </div>
        <div v-if="modelValue === theme.id" class="theme-check" :style="{ color: theme.accent }">
          ✓
        </div>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.theme-picker {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 240px;
  display: flex;
  flex-direction: column;
  padding: var(--sp-2);
  gap: var(--sp-1);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--c-bg-elevated) 85%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-lg);
  z-index: 200;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  padding: var(--sp-2) var(--sp-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  transition: background var(--duration-fast), transform var(--duration-fast);
}

.theme-option:hover,
.theme-option.focused {
  background: var(--c-glass-hover);
}

.theme-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.theme-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.theme-name {
  color: var(--c-text-primary);
  font-size: var(--fs-base);
  font-weight: var(--fw-bold);
  line-height: 1.2;
}

.theme-desc {
  color: var(--c-text-secondary);
  font-size: var(--fs-xs);
  margin-top: 2px;
}

.theme-check {
  font-weight: bold;
  font-size: var(--fs-lg);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity var(--ease-out) var(--duration-normal), transform var(--ease-out) var(--duration-normal);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
