<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { db, type Annotation } from '@/data/db'

const props = defineProps<{
  chapterId: string
  sentenceId?: string
  passageId?: string
  targetText?: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const notes = ref<Annotation[]>([])
const newContent = ref('')
const newType = ref<'insight' | 'question' | 'comparison' | 'research'>('insight')
const isSaving = ref(false)

const TYPE_OPTIONS = [
  { id: 'insight', label: '💡 心得', color: 'var(--c-gold)' },
  { id: 'question', label: '❓ 疑問', color: 'var(--c-accent-dao)' },
  { id: 'comparison', label: '⚖️ 比較', color: 'var(--c-accent-syncretism)' },
  { id: 'research', label: '📜 考據', color: 'var(--c-accent-histories)' },
] as const

async function loadNotes() {
  if (!props.chapterId) return
  if (props.sentenceId) {
    notes.value = await db.annotations
      .where('sentenceId')
      .equals(props.sentenceId)
      .reverse()
      .toArray()
  } else {
    notes.value = await db.annotations
      .where('chapterId')
      .equals(props.chapterId)
      .reverse()
      .toArray()
  }
}

watch(() => [props.chapterId, props.sentenceId, props.isOpen], () => {
  if (props.isOpen) {
    loadNotes()
  }
}, { immediate: true })

async function addNote() {
  if (!newContent.value.trim()) return
  isSaving.value = true

  const annotation: Annotation = {
    chapterId: props.chapterId,
    sentenceId: props.sentenceId,
    passageId: props.passageId,
    content: newContent.value.trim(),
    type: newType.value,
    createdAt: new Date().toISOString()
  }

  await db.annotations.add(annotation)
  newContent.value = ''
  isSaving.value = false
  await loadNotes()
  emit('saved')
}

async function deleteNote(id?: number) {
  if (!id) return
  await db.annotations.delete(id)
  await loadNotes()
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <div v-if="isOpen" class="annotation-overlay" @click.self="emit('close')">
    <div class="annotation-panel glass-card-elevated">
      <div class="panel-header">
        <div class="panel-title">
          <span>✍️ 文脈批註</span>
          <span v-if="targetText" class="target-excerpt">「{{ targetText.slice(0, 16) }}{{ targetText.length > 16 ? '…' : '' }}」</span>
        </div>
        <button class="close-btn btn btn-ghost" @click="emit('close')" aria-label="關閉">✕</button>
      </div>

      <!-- 新增筆記區 -->
      <div class="new-note-section">
        <div class="type-selector">
          <button
            v-for="t in TYPE_OPTIONS"
            :key="t.id"
            type="button"
            class="type-pill"
            :class="{ active: newType === t.id }"
            @click="newType = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <textarea
          v-model="newContent"
          class="note-textarea"
          placeholder="書寫心得、疑難或跨典籍聯想……"
          rows="3"
          @keydown.ctrl.enter="addNote"
        ></textarea>

        <div class="note-actions">
          <span class="tip-text">支援 Ctrl+Enter 送出</span>
          <button
            class="btn btn-primary btn-sm"
            :disabled="!newContent.trim() || isSaving"
            @click="addNote"
          >
            {{ isSaving ? '存入中…' : '存入批註' }}
          </button>
        </div>
      </div>

      <!-- 歷史筆記列表 -->
      <div class="notes-list-section">
        <div class="notes-header">
          <span>此處已有 {{ notes.length }} 則批註</span>
        </div>

        <div v-if="notes.length === 0" class="empty-notes">
          尚無批註，寫下你的第一筆研讀心悟吧。
        </div>

        <div v-else class="notes-list">
          <div v-for="note in notes" :key="note.id" class="note-card">
            <div class="note-card-meta">
              <span class="note-type-badge">
                {{ TYPE_OPTIONS.find(t => t.id === note.type)?.label || '💡 心得' }}
              </span>
              <span class="note-date">{{ formatDate(note.createdAt) }}</span>
              <button class="delete-btn" @click="deleteNote(note.id)" title="刪除此筆批註">🗑️</button>
            </div>
            <p class="note-body">{{ note.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotation-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 200;
  padding: var(--sp-4);
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.annotation-panel {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: fadeInUp var(--duration-normal) var(--ease-spring);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-4) var(--sp-6);
  border-bottom: 1px solid var(--c-border);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-serif);
  font-size: var(--fs-lg);
  color: var(--c-text-primary);
  font-weight: var(--fw-semibold);
}

.target-excerpt {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  font-style: italic;
}

.close-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  font-size: var(--fs-sm);
}

.new-note-section {
  padding: var(--sp-4) var(--sp-6);
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-card);
}

.type-selector {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
  overflow-x: auto;
}

.type-pill {
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-out);
}

.type-pill:hover,
.type-pill.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

.note-textarea {
  width: 100%;
  background: var(--c-bg-primary);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-3);
  color: var(--c-text-primary);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  resize: vertical;
  line-height: var(--lh-relaxed);
}

.note-textarea:focus {
  outline: none;
  border-color: var(--c-gold);
  box-shadow: 0 0 0 3px var(--c-gold-glow);
}

.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--sp-2);
}

.tip-text {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.notes-list-section {
  padding: var(--sp-4) var(--sp-6);
  overflow-y: auto;
  flex: 1;
}

.notes-header {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-bottom: var(--sp-3);
}

.empty-notes {
  text-align: center;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  padding: var(--sp-8) 0;
  font-style: italic;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.note-card {
  padding: var(--sp-3) var(--sp-4);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
}

.note-card-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
}

.note-type-badge {
  font-size: var(--fs-xs);
  color: var(--c-gold);
}

.note-date {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  margin-right: auto;
}

.delete-btn {
  background: transparent;
  border: 0;
  cursor: pointer;
  opacity: 0.5;
  font-size: var(--fs-xs);
  transition: opacity var(--duration-fast);
}

.delete-btn:hover {
  opacity: 1;
}

.note-body {
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  line-height: var(--lh-normal);
  white-space: pre-wrap;
}
</style>
