<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Chunk } from '@/types/content'
import { zenAudio } from '@/utils/audio'

const props = defineProps<{
  chunks: Chunk[]
  sentenceId?: string
}>()

const emit = defineEmits<{
  (e: 'complete', isCorrect: boolean): void
  (e: 'reset'): void
}>()

interface ChunkItem {
  id: string
  text: string
  order: number
  cue?: string
}

const pool = ref<ChunkItem[]>([])
const selected = ref<ChunkItem[]>([])
const isSubmitted = ref(false)
const isCorrect = ref(false)

function initGame() {
  isSubmitted.value = false
  isCorrect.value = false
  selected.value = []
  
  if (!props.chunks || props.chunks.length === 0) {
    pool.value = []
    return
  }

  // Clone and shuffle
  const items = props.chunks.map(c => ({
    id: c.id,
    text: c.text,
    order: c.order,
    cue: c.cue
  }))

  // Shuffle array
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  pool.value = shuffled
}

watch(() => props.sentenceId, () => {
  initGame()
}, { immediate: true })

watch(() => props.chunks, () => {
  initGame()
})

function pickChunk(item: ChunkItem) {
  if (isSubmitted.value && isCorrect.value) return
  // Remove from pool
  const idx = pool.value.findIndex(c => c.id === item.id)
  if (idx !== -1) {
    pool.value.splice(idx, 1)
    selected.value.push(item)
  }
  isSubmitted.value = false
  
  // Auto-check if all are placed
  if (pool.value.length === 0) {
    checkOrder()
  }
}

function unpickChunk(item: ChunkItem) {
  if (isSubmitted.value && isCorrect.value) return
  const idx = selected.value.findIndex(c => c.id === item.id)
  if (idx !== -1) {
    selected.value.splice(idx, 1)
    pool.value.push(item)
  }
  isSubmitted.value = false
}

function checkOrder() {
  if (selected.value.length === 0) return

  isSubmitted.value = true
  const correct = selected.value.every((item, idx) => item.order === idx)
  isCorrect.value = correct

  if (correct) {
    zenAudio.playBell()
    emit('complete', true)
  } else {
    zenAudio.playMuyu()
    emit('complete', false)
  }
}

function resetOrder() {
  initGame()
  emit('reset')
}
</script>

<template>
  <div class="chunk-order-game glass-card">
    <div class="game-header">
      <div class="game-title">
        <span class="game-badge">🧩 語塊排序</span>
        <span class="game-desc">點擊或拖選語塊，依文義重組古典名句</span>
      </div>
      <button class="btn btn-ghost btn-sm reset-btn" @click="resetOrder" title="重新打亂語塊">
        <span>🔄 重置</span>
      </button>
    </div>

    <!-- 作答區 (Answer Slot Area) -->
    <div class="answer-area" :class="{ 'is-correct': isSubmitted && isCorrect, 'is-incorrect': isSubmitted && !isCorrect }">
      <div class="area-label">
        <span>【 組裝排版 】</span>
        <span v-if="isSubmitted" class="result-badge" :class="isCorrect ? 'badge-success' : 'badge-danger'">
          {{ isCorrect ? '✨ 句讀通順，絲毫不差！' : '⚠️ 語序有誤，再思量之' }}
        </span>
      </div>
      
      <div class="answer-slots">
        <template v-if="selected.length > 0">
          <button
            v-for="(item, idx) in selected"
            :key="item.id"
            class="chunk-pill placed-pill"
            :class="{
              'pill-correct': isSubmitted && item.order === idx,
              'pill-wrong': isSubmitted && item.order !== idx
            }"
            @click="unpickChunk(item)"
          >
            <span class="pill-order">{{ idx + 1 }}</span>
            <span class="pill-text">{{ item.text }}</span>
            <span v-if="item.cue" class="pill-cue">({{ item.cue }})</span>
            <span class="pill-remove">×</span>
          </button>
        </template>
        <div v-else class="empty-placeholder">
          點擊下方散落語塊以填入此處
        </div>
      </div>
    </div>

    <!-- 備選池 (Pool Area) -->
    <div class="pool-area">
      <div class="area-label">【 備選語塊 】</div>
      <div class="pool-slots">
        <template v-if="pool.length > 0">
          <button
            v-for="item in pool"
            :key="item.id"
            class="chunk-pill candidate-pill"
            @click="pickChunk(item)"
          >
            <span class="pill-text">{{ item.text }}</span>
            <span v-if="item.cue" class="pill-cue">({{ item.cue }})</span>
            <span class="pill-add">+</span>
          </button>
        </template>
        <div v-else class="all-placed-msg">
          已全數排入，檢驗中...
        </div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="action-footer">
      <button
        v-if="pool.length > 0 && selected.length > 0"
        class="btn btn-primary"
        @click="checkOrder"
      >
        <span>比對順序</span>
      </button>
      <button
        v-else-if="isSubmitted && !isCorrect"
        class="btn btn-primary"
        @click="resetOrder"
      >
        <span>重新嘗試</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chunk-order-game {
  padding: var(--sp-6);
  margin-top: var(--sp-4);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-border-subtle);
  padding-bottom: var(--sp-3);
}

.game-title {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.game-badge {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--c-gold-light);
  letter-spacing: 0.05em;
}

.game-desc {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.reset-btn {
  font-size: var(--fs-xs);
  padding: var(--sp-1) var(--sp-3);
}

.area-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--fs-xs);
  color: var(--c-gold-dark);
  font-weight: var(--fw-medium);
  margin-bottom: var(--sp-2);
}

.answer-area {
  background: var(--c-bg-card);
  border: 2px dashed var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  min-height: 90px;
  transition: all var(--duration-normal) var(--ease-out);
}

.answer-area.is-correct {
  border-color: var(--c-success);
  background: rgba(74, 139, 110, 0.08);
}

.answer-area.is-incorrect {
  border-color: var(--c-danger);
  background: rgba(139, 74, 74, 0.08);
}

.answer-slots, .pool-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  align-items: center;
}

.empty-placeholder, .all-placed-msg {
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  font-style: italic;
  padding: var(--sp-2);
}

.chunk-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-full);
  font-family: var(--font-serif);
  font-size: var(--fs-lg);
  letter-spacing: 0.04em;
  border: 1px solid var(--c-border-accent);
  background: var(--c-bg-elevated);
  color: var(--c-text-primary);
  cursor: pointer;
  user-select: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.chunk-pill:hover {
  transform: translateY(-2px);
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
}

.placed-pill {
  border-color: var(--c-gold);
}

.pill-order {
  font-size: var(--fs-xs);
  font-family: var(--font-sans);
  background: var(--c-gold-glow);
  color: var(--c-gold);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
}

.pill-cue {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.pill-remove, .pill-add {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  opacity: 0.6;
}

.pill-correct {
  border-color: var(--c-success) !important;
  color: var(--c-success) !important;
  background: rgba(74, 139, 110, 0.15) !important;
}

.pill-wrong {
  border-color: var(--c-danger) !important;
  color: var(--c-danger) !important;
  background: rgba(139, 74, 74, 0.15) !important;
  text-decoration: underline wavy;
}

.result-badge {
  font-size: var(--fs-xs);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.badge-success {
  color: var(--c-success);
  background: rgba(74, 139, 110, 0.15);
}

.badge-danger {
  color: var(--c-danger);
  background: rgba(139, 74, 74, 0.15);
}

.action-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
}

@media (max-width: 640px) {
  .chunk-pill {
    font-size: var(--fs-base);
    padding: var(--sp-1) var(--sp-3);
  }
}
</style>
