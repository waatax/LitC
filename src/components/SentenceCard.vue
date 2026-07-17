<script setup lang="ts">
import { computed } from 'vue'
import type { Sentence, HintLevel, Chunk } from '@/types/content'

const props = withDefaults(defineProps<{
  sentence: Sentence
  hintLevel: HintLevel
  showChunks?: boolean
}>(), {
  showChunks: false,
})

interface RenderedChar {
  char: string
  visible: boolean
  chunkIndex: number
}

const renderedChars = computed<RenderedChar[]>(() => {
  const chars: RenderedChar[] = []
  const chunks = props.sentence.chunks
  const level = props.hintLevel

  if (!chunks || chunks.length === 0) {
    // Fallback: treat whole sentence as one chunk
    const text = props.sentence.canonicalText
    for (let ci = 0; ci < text.length; ci++) {
      chars.push({
        char: text[ci],
        visible: level === 'full',
        chunkIndex: 0,
      })
    }
    return chars
  }

  chunks.forEach((chunk: Chunk, chunkIdx: number) => {
    const text = chunk.text
    for (let ci = 0; ci < text.length; ci++) {
      let visible = false

      switch (level) {
        case 'full':
          visible = true
          break
        case 'keyword-mask':
          // Show even-indexed chunks, mask odd-indexed
          visible = chunkIdx % 2 === 0
          break
        case 'first-char':
          // Show only first char of each chunk
          visible = ci === 0
          break
        case 'meaning-only':
          visible = false
          break
        case 'blank':
          visible = false
          break
      }

      chars.push({
        char: text[ci],
        visible,
        chunkIndex: chunkIdx,
      })
    }
  })

  return chars
})

const isMeaningOnly = computed(() => props.hintLevel === 'meaning-only')
const isAllMasked = computed(() => props.hintLevel === 'blank')

// Group chars by chunk for rendering with chunk borders
interface ChunkGroup {
  chunkIndex: number
  chars: RenderedChar[]
}

const chunkGroups = computed<ChunkGroup[]>(() => {
  const groups: ChunkGroup[] = []
  let currentGroup: ChunkGroup | null = null

  for (const ch of renderedChars.value) {
    if (!currentGroup || currentGroup.chunkIndex !== ch.chunkIndex) {
      currentGroup = { chunkIndex: ch.chunkIndex, chars: [] }
      groups.push(currentGroup)
    }
    currentGroup.chars.push(ch)
  }

  return groups
})
</script>

<template>
  <div class="sentence-card">
    <!-- Translation hint when meaning-only -->
    <div v-if="isMeaningOnly && sentence.translationHint" class="translation-hint">
      <span class="hint-icon">💡</span>
      <span class="hint-text">{{ sentence.translationHint }}</span>
    </div>
    <div v-if="isMeaningOnly && !sentence.translationHint" class="translation-hint">
      <span class="hint-icon">💡</span>
      <span class="hint-text hint-missing">（無句意提示）</span>
    </div>

    <!-- Sentence text -->
    <div class="sentence-text classical-text" :class="{ 'all-masked-state': isAllMasked }">
      <template v-if="showChunks">
        <span
          v-for="(group, gi) in chunkGroups"
          :key="gi"
          class="chunk-group"
          :class="{ 'chunk-bordered': showChunks }"
        >
          <span
            v-for="(ch, ci) in group.chars"
            :key="`${gi}-${ci}`"
            class="char-slot"
            :class="{
              'text-revealed': ch.visible,
              'text-masked': !ch.visible,
            }"
          >{{ ch.visible ? ch.char : '　' }}</span>
        </span>
      </template>
      <template v-else>
        <span
          v-for="(ch, ci) in renderedChars"
          :key="ci"
          class="char-slot"
          :class="{
            'text-revealed': ch.visible,
            'text-masked': !ch.visible,
          }"
        >{{ ch.visible ? ch.char : '　' }}</span>
      </template>
    </div>

    <!-- Subtle sentence ID for debugging / reference -->
    <div v-if="isAllMasked" class="blank-encourage">
      <span>默寫此句</span>
    </div>
  </div>
</template>

<style scoped>
.sentence-card {
  padding: var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  transition: all var(--duration-normal) var(--ease-out);
}

.sentence-card:hover {
  border-color: var(--c-border-accent);
}

.translation-hint {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-4);
  margin-bottom: var(--sp-4);
  background: rgba(201, 169, 110, 0.06);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-accent);
}

.hint-icon {
  font-size: var(--fs-lg);
  line-height: 1;
  flex-shrink: 0;
}

.hint-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  line-height: var(--lh-relaxed);
}

.hint-missing {
  color: var(--c-text-muted);
  font-style: italic;
}

.sentence-text {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
  min-height: 2.5em;
}

.char-slot {
  display: inline-block;
  min-width: 1.4em;
  text-align: center;
  transition: color var(--duration-normal) var(--ease-out),
              background var(--duration-normal) var(--ease-out);
}

.char-slot.text-revealed {
  color: var(--c-text-primary);
}

.char-slot.text-masked {
  position: relative;
  color: transparent;
  user-select: none;
}

.char-slot.text-masked::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--c-bg-elevated);
  border-radius: 3px;
  border: 1px dashed var(--c-border);
}

.chunk-group {
  display: inline-flex;
  align-items: center;
}

.chunk-bordered {
  border: 1px solid rgba(201, 169, 110, 0.15);
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  margin: 2px;
  background: rgba(201, 169, 110, 0.03);
  transition: all var(--duration-fast) var(--ease-out);
}

.chunk-bordered:hover {
  border-color: rgba(201, 169, 110, 0.35);
  background: rgba(201, 169, 110, 0.06);
}

.all-masked-state {
  opacity: 0.6;
}

.blank-encourage {
  margin-top: var(--sp-3);
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .sentence-card {
    padding: var(--sp-4);
  }
}
</style>
