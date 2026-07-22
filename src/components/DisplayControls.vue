<script setup lang="ts">
import { ref } from 'vue'

type ThemeMode = 'dark' | 'light'
type FontSize = 'small' | 'medium' | 'large'

const savedTheme = localStorage.getItem('display-theme') as ThemeMode | null
const savedFontSize = localStorage.getItem('display-font-size') as FontSize | null

const theme = ref<ThemeMode>(
  savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
)
const fontSize = ref<FontSize>(
  savedFontSize === 'small' || savedFontSize === 'large' ? savedFontSize : 'medium'
)

function applyTheme(mode: ThemeMode) {
  theme.value = mode
  const html = document.documentElement
  html.classList.remove('theme-charcoal', 'theme-xuan', 'theme-celadon', 'theme-cinnabar')
  html.classList.toggle('theme-light', mode === 'light')
  html.classList.toggle('theme-dark', mode === 'dark')
  html.classList.toggle('light-theme', mode === 'light')
  html.style.colorScheme = mode
  localStorage.setItem('display-theme', mode)
}

function applyFontSize(size: FontSize) {
  fontSize.value = size
  document.documentElement.dataset.fontSize = size
  localStorage.setItem('display-font-size', size)
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

applyTheme(theme.value)
applyFontSize(fontSize.value)
</script>

<template>
  <aside class="display-controls" aria-label="顯示設定">
    <button
      class="display-control theme-control"
      type="button"
      :aria-label="theme === 'dark' ? '切換為明亮底色' : '切換為暗色底色'"
      :title="theme === 'dark' ? '切換為明亮底色' : '切換為暗色底色'"
      @click="toggleTheme"
    >
      <span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
    </button>

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
