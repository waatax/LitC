<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import ThemePicker from './ThemePicker.vue'

type FontSize = 'small' | 'medium' | 'large'

const appStore = useAppStore()

const savedFontSize = localStorage.getItem('display-font-size') as FontSize | null

const fontSize = ref<FontSize>(
  savedFontSize === 'small' || savedFontSize === 'large' ? savedFontSize : 'medium'
)

const isThemePickerOpen = ref(false)

function applyFontSize(size: FontSize) {
  fontSize.value = size
  document.documentElement.dataset.fontSize = size
  localStorage.setItem('display-font-size', size)
}

function handleThemeChange(newTheme: string) {
  appStore.setTheme(newTheme)
}

// Initial apply
appStore.setTheme(appStore.currentTheme)
applyFontSize(fontSize.value)

// Theme swatches mapping for the button
const themeColors: Record<string, { bg: string, accent: string }> = {
  charcoal: { bg: '#06060b', accent: '#c9a96e' },
  xuan: { bg: '#faf6ee', accent: '#855b21' },
  celadon: { bg: '#ebf3ee', accent: '#3a8b64' },
  cinnabar: { bg: '#3a1616', accent: '#c9a96e' },
  bamboo: { bg: '#0f1520', accent: '#5ba88a' },
  pinesoot: { bg: '#1a130e', accent: '#c4943a' }
}

const currentThemeSwatch = computed(() => themeColors[appStore.currentTheme] || themeColors.charcoal)
</script>

<template>
  <aside class="display-controls" aria-label="顯示設定">
    <div style="position: relative;">
      <button
        class="display-control theme-control"
        type="button"
        aria-label="選擇主題"
        title="選擇主題"
        @click.stop="isThemePickerOpen = !isThemePickerOpen"
      >
        <span 
          class="theme-swatch-btn" 
          :style="{ backgroundColor: currentThemeSwatch.bg, borderColor: currentThemeSwatch.accent }"
          aria-hidden="true"
        ></span>
      </button>

      <ThemePicker 
        :model-value="appStore.currentTheme" 
        :is-open="isThemePickerOpen" 
        @update:model-value="handleThemeChange"
        @close="isThemePickerOpen = false"
      />
    </div>

    <div class="font-size-controls" role="group" aria-label="文字大小">
      <button
        v-for="option in (['small', 'medium', 'large'] as FontSize[])"
        :key="option"
        class="display-control font-control"
        :class="{ active: fontSize === option }"
        type="button"
        :aria-pressed="fontSize === option"
        :aria-label="`切換為${option === 'small' ? '小' : option === 'medium' ? '中' : '大'}字`"
        :title="`${option === 'small' ? '小' : option === 'medium' ? '中' : '大'}字`"
        @click="applyFontSize(option)"
      >
        <span aria-hidden="true">字</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.display-controls {
  position: fixed;
  top: max(1rem, env(safe-area-inset-top));
  right: max(1rem, env(safe-area-inset-right));
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  color: var(--c-text-primary);
  background: color-mix(in srgb, var(--c-bg-elevated) 88%, transparent);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.font-size-controls {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding-left: 0.375rem;
  border-left: 1px solid var(--c-border);
}

.display-control {
  display: grid;
  place-items: center;
  min-width: 2.25rem;
  min-height: 2.25rem;
  padding: 0.25rem;
  color: var(--c-text-secondary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--duration-fast), background var(--duration-fast), transform var(--duration-fast);
}

.display-control:hover,
.display-control.active {
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

.display-control:active { transform: scale(0.94); }
.theme-control { font-size: 1.25rem; }

.theme-swatch-btn {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.font-control:nth-child(1) { font-size: 0.75rem; }
.font-control:nth-child(2) { font-size: 0.95rem; }
.font-control:nth-child(3) { font-size: 1.15rem; }

@media (max-width: 768px) {
  .display-controls {
    top: max(0.625rem, env(safe-area-inset-top));
    right: max(0.625rem, env(safe-area-inset-right));
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .display-control {
    min-width: 2rem;
    min-height: 2rem;
  }
}
</style>
