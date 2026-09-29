<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import ThemePicker from './ThemePicker.vue'

export type FontSize = 'compact' | 'standard' | 'comfortable' | 'large' | 'huge'

interface FontSizeOption {
  id: FontSize
  label: string
  px: number
  desc: string
}

const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'compact', label: '小', px: 14, desc: '緊湊 (14px)' },
  { id: 'standard', label: '中', px: 16, desc: '標準 (16px)' },
  { id: 'comfortable', label: '舒', px: 18, desc: '舒讀 (18px)' },
  { id: 'large', label: '大', px: 20, desc: '放大 (20px)' },
  { id: 'huge', label: '特', px: 22, desc: '特大 (22px)' },
]

const appStore = useAppStore()

// Map legacy font size keys
function normalizeFontSize(val: string | null): FontSize {
  if (val === 'small' || val === 'compact') return 'compact'
  if (val === 'medium' || val === 'standard') return 'standard'
  if (val === 'large' || val === 'comfortable') return 'comfortable'
  if (val === 'xlarge') return 'large'
  if (val === 'huge') return 'huge'
  return 'standard'
}

const savedFontSize = typeof localStorage !== 'undefined' ? localStorage.getItem('display-font-size') : null
const fontSize = ref<FontSize>(normalizeFontSize(savedFontSize))

const isThemePickerOpen = ref(false)
const isFontMenuOpen = ref(false)
const controlsRef = ref<HTMLElement | null>(null)

const currentIndex = computed(() => {
  const idx = FONT_SIZE_OPTIONS.findIndex(o => o.id === fontSize.value)
  return idx !== -1 ? idx : 1
})

const currentOption = computed(() => FONT_SIZE_OPTIONS[currentIndex.value])

function applyFontSize(size: FontSize) {
  fontSize.value = size
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.fontSize = size
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('display-font-size', size)
  }
}

function stepFont(delta: number) {
  const nextIdx = Math.max(0, Math.min(FONT_SIZE_OPTIONS.length - 1, currentIndex.value + delta))
  applyFontSize(FONT_SIZE_OPTIONS[nextIdx].id)
}

function handleThemeChange(newTheme: string) {
  appStore.setTheme(newTheme)
}

function handleClickOutside(e: MouseEvent) {
  if (controlsRef.value && !controlsRef.value.contains(e.target as Node)) {
    isThemePickerOpen.value = false
    isFontMenuOpen.value = false
  }
}

onMounted(() => {
  appStore.setTheme(appStore.currentTheme)
  applyFontSize(fontSize.value)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Theme swatches mapping for the button
const themeColors: Record<string, { bg: string, accent: string }> = {
  charcoal: { bg: '#06060b', accent: '#c9a96e' },
  xuan: { bg: '#faf6ee', accent: '#855b21' },
  celadon: { bg: '#ebf3ee', accent: '#3a8b64' },
  cinnabar: { bg: '#3a1616', accent: '#c9a96e' },
  bamboo: { bg: '#0f1520', accent: '#5ba88a' },
  pinesoot: { bg: '#1a130e', accent: '#c4943a' },
  amber: { bg: '#f7f1e3', accent: '#9c6518' },
}

const currentThemeSwatch = computed(() => themeColors[appStore.currentTheme] || themeColors.charcoal)
</script>

<template>
  <aside ref="controlsRef" class="display-controls" aria-label="顯示設定">
    <!-- 主題選擇按鈕 -->
    <div class="control-relative">
      <button
        class="display-control theme-control"
        type="button"
        aria-label="選擇主題色調"
        title="選擇古籍主題色調"
        :aria-expanded="isThemePickerOpen"
        @click.stop="isThemePickerOpen = !isThemePickerOpen; isFontMenuOpen = false"
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

    <!-- 視覺風格切換：毛玻璃質感 / 簡約易讀極速版 -->
    <button
      class="display-control glass-toggle-btn"
      :class="{ 'is-clean-mode': !appStore.glassEffect }"
      type="button"
      :aria-pressed="!appStore.glassEffect"
      :aria-label="appStore.glassEffect ? '當前為毛玻璃質感，點擊切換為「簡約易讀・極速版」' : '當前為簡約易讀版，點擊切換為「毛玻璃質感版」'"
      :title="appStore.glassEffect ? '切換為簡約易讀・極速版（降低炫光與模糊）' : '切換為典雅水墨毛玻璃'"
      @click="appStore.toggleGlassEffect()"
    >
      <span class="glass-btn-content">
        <span class="mode-icon">{{ appStore.glassEffect ? '✨' : '⚡' }}</span>
        <span class="mode-label">{{ appStore.glassEffect ? '毛玻璃' : '簡約' }}</span>
      </span>
    </button>

    <!-- 字體大小調整步進器 (A- / 尺寸指示 / A+) -->
    <div class="font-size-stepper" role="group" aria-label="調整閱讀字級">
      <button
        class="font-step-btn"
        type="button"
        :disabled="currentIndex === 0"
        aria-label="縮小文字字級"
        title="縮小文字字級"
        @click="stepFont(-1)"
      >
        <span class="step-char">A⁻</span>
      </button>

      <div class="control-relative">
        <button
          class="font-current-pill"
          type="button"
          :aria-expanded="isFontMenuOpen"
          :title="`目前字級：${currentOption.desc}，點擊展開完整選單`"
          @click.stop="isFontMenuOpen = !isFontMenuOpen; isThemePickerOpen = false"
        >
          <span class="current-label">{{ currentOption.label }}</span>
          <span class="current-px">{{ currentOption.px }}</span>
        </button>

        <!-- 5 階字級快選浮動面板 -->
        <Transition name="fade-slide">
          <div v-if="isFontMenuOpen" class="font-menu-popover glass-card-elevated" @click.stop>
            <div class="font-menu-header">
              <span class="font-menu-title font-serif">閱讀字級調整</span>
              <span class="font-menu-sub">5 級尺度</span>
            </div>
            <div class="font-menu-list">
              <button
                v-for="opt in FONT_SIZE_OPTIONS"
                :key="opt.id"
                class="font-menu-item"
                :class="{ active: fontSize === opt.id }"
                @click="applyFontSize(opt.id); isFontMenuOpen = false"
              >
                <span class="item-name font-serif">{{ opt.desc }}</span>
                <span class="item-preview" :style="{ fontSize: `${opt.px}px` }">閱</span>
                <span v-if="fontSize === opt.id" class="item-check">✓</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <button
        class="font-step-btn"
        type="button"
        :disabled="currentIndex === FONT_SIZE_OPTIONS.length - 1"
        aria-label="放大文字字級"
        title="放大文字字級"
        @click="stepFont(1)"
      >
        <span class="step-char">A⁺</span>
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
  gap: 0.375rem;
  padding: 0.3125rem 0.5rem;
  color: var(--c-text-primary);
  background: color-mix(in srgb, var(--c-bg-elevated) 90%, transparent);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  user-select: none;
}

.control-relative {
  position: relative;
}

.display-control {
  display: grid;
  place-items: center;
  min-width: 2.125rem;
  min-height: 2.125rem;
  padding: 0.25rem;
  color: var(--c-text-secondary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--duration-fast), background var(--duration-fast), transform var(--duration-fast);
}

.display-control:hover {
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

.display-control:active {
  transform: scale(0.94);
}

.theme-swatch-btn {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  transition: transform var(--duration-fast);
}

.theme-control:hover .theme-swatch-btn {
  transform: scale(1.1);
}

.glass-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  color: var(--c-text-secondary);
  border: 1px solid var(--c-border);
  background: color-mix(in srgb, var(--c-bg-primary) 50%, transparent);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.glass-toggle-btn:hover {
  color: var(--c-gold);
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
}

.glass-toggle-btn.is-clean-mode {
  color: var(--c-gold);
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
  box-shadow: 0 0 8px var(--c-gold-glow);
}

.glass-btn-content {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.mode-icon {
  font-size: 0.85rem;
  line-height: 1;
}

.mode-label {
  font-size: 0.75rem;
  font-family: var(--font-sans);
  font-weight: var(--fw-medium);
}

/* ── Font Size Stepper ── */
.font-size-stepper {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-left: 0.375rem;
  border-left: 1px solid var(--c-border);
}

.font-step-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border: none;
  background: transparent;
  color: var(--c-text-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.font-step-btn:hover:not(:disabled) {
  color: var(--c-gold);
  background: var(--c-gold-glow);
  transform: scale(1.08);
}

.font-step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.step-char {
  font-family: var(--font-serif);
  font-weight: var(--fw-bold);
  font-size: 0.8125rem;
}

.font-current-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 7px;
  border: 1px solid var(--c-border-accent);
  background: var(--c-bg-card);
  border-radius: var(--radius-full);
  color: var(--c-gold-light);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.font-current-pill:hover {
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
  color: var(--c-gold);
}

.current-label {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  font-weight: var(--fw-bold);
}

.current-px {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: var(--c-text-muted);
}

/* ── Popover for Font Selection ── */
.font-menu-popover {
  position: absolute;
  top: calc(100% + 0.625rem);
  right: 0;
  width: 190px;
  padding: 0.5rem;
  background: color-mix(in srgb, var(--c-bg-elevated) 94%, transparent);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 210;
}

.font-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.25rem 0.375rem 0.375rem;
  border-bottom: 1px dashed var(--c-border);
  margin-bottom: 0.25rem;
}

.font-menu-title {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.font-menu-sub {
  font-size: 0.65rem;
  color: var(--c-text-muted);
}

.font-menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.font-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--c-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-align: left;
}

.font-menu-item:hover {
  background: var(--c-gold-glow);
  color: var(--c-gold);
}

.font-menu-item.active {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  font-weight: var(--fw-bold);
}

.item-name {
  font-size: 0.8125rem;
}

.item-preview {
  font-family: var(--font-serif);
  color: var(--c-gold-light);
  line-height: 1;
}

.item-check {
  font-size: 0.75rem;
  color: var(--c-gold);
  font-weight: bold;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Mobile Layout ── */
@media (max-width: 768px) {
  .display-controls {
    top: max(0.5rem, env(safe-area-inset-top));
    right: max(0.5rem, env(safe-area-inset-right));
    gap: 0.25rem;
    padding: 0.25rem 0.375rem;
  }

  .display-control {
    min-width: 1.875rem;
    min-height: 1.875rem;
  }

  .mode-label {
    display: none;
  }

  .glass-toggle-btn {
    padding: 0.25rem;
    min-width: 1.875rem;
    min-height: 1.875rem;
  }

  .font-size-stepper {
    padding-left: 0.25rem;
  }

  .font-step-btn {
    width: 1.625rem;
    height: 1.625rem;
  }

  .font-current-pill {
    padding: 1px 5px;
  }

  .current-px {
    display: none;
  }
}
</style>
