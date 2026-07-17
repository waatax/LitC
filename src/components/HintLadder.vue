<script setup lang="ts">
import type { HintLevel } from '@/types/content'
import { HINT_LEVELS } from '@/types/content'

const props = defineProps<{
  modelValue: HintLevel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: HintLevel]
}>()

function currentIndex(): number {
  return HINT_LEVELS.findIndex(h => h.level === props.modelValue)
}

function selectLevel(level: HintLevel) {
  emit('update:modelValue', level)
}

function handleKeydown(e: KeyboardEvent) {
  const idx = currentIndex()
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    if (idx < HINT_LEVELS.length - 1) {
      selectLevel(HINT_LEVELS[idx + 1].level)
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (idx > 0) {
      selectLevel(HINT_LEVELS[idx - 1].level)
    }
  }
}
</script>

<template>
  <div
    class="hint-ladder"
    role="radiogroup"
    aria-label="提示級別"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <div class="ladder-track">
      <div
        class="ladder-fill"
        :style="{ width: `${(currentIndex() / (HINT_LEVELS.length - 1)) * 100}%` }"
      />
    </div>
    <div class="ladder-steps">
      <button
        v-for="(hint, i) in HINT_LEVELS"
        :key="hint.level"
        class="ladder-step"
        :class="{
          'is-active': hint.level === modelValue,
          'is-passed': i < currentIndex(),
        }"
        role="radio"
        :aria-checked="hint.level === modelValue"
        :aria-label="hint.label"
        @click="selectLevel(hint.level)"
      >
        <span class="step-dot">
          <span class="step-icon">{{ hint.icon }}</span>
        </span>
        <span class="step-label">{{ hint.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hint-ladder {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: var(--sp-4) 0;
  outline: none;
}

.hint-ladder:focus-visible {
  outline: 2px solid var(--c-gold);
  outline-offset: 8px;
  border-radius: var(--radius-md);
}

.ladder-track {
  position: absolute;
  top: calc(var(--sp-4) + 16px);
  left: 24px;
  right: 24px;
  height: 3px;
  background: var(--c-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  z-index: 0;
}

.ladder-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold), var(--c-gold-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.ladder-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.ladder-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  min-width: 0;
  flex: 0 0 auto;
  transition: transform var(--duration-fast) var(--ease-out);
}

.ladder-step:hover {
  transform: translateY(-2px);
}

.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-secondary);
  border: 2px solid var(--c-border);
  transition: all var(--duration-normal) var(--ease-out);
  font-size: var(--fs-sm);
}

.step-icon {
  transition: transform var(--duration-fast) var(--ease-spring);
}

.ladder-step.is-passed .step-dot {
  background: var(--c-gold-dark);
  border-color: var(--c-gold);
}

.ladder-step.is-active .step-dot {
  background: var(--c-gold);
  border-color: var(--c-gold-light);
  box-shadow: var(--shadow-gold), 0 0 16px rgba(201, 169, 110, 0.3);
  transform: scale(1.1);
}

.ladder-step.is-active .step-icon {
  transform: scale(1.15);
}

.step-label {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  white-space: nowrap;
  transition: color var(--duration-fast) var(--ease-out);
}

.ladder-step.is-active .step-label {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

.ladder-step.is-passed .step-label {
  color: var(--c-text-secondary);
}

@media (max-width: 768px) {
  .step-label {
    font-size: 0.625rem;
    max-width: 48px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .step-dot {
    width: 30px;
    height: 30px;
    font-size: var(--fs-xs);
  }
  .ladder-track {
    top: calc(var(--sp-4) + 13px);
    left: 16px;
    right: 16px;
  }
}
</style>
