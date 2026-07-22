<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Sentence, HintLevel, Chunk } from '@/types/content'
import { getPinyin, getBopomofo } from '@/utils/pinyin'
import RedSeal from '@/components/RedSeal.vue'

const props = withDefaults(defineProps<{
  sentence: Sentence
  hintLevel: HintLevel
  showChunks?: boolean
  isVertical?: boolean
  isMastered?: boolean
}>(), {
  showChunks: false,
  isVertical: false,
  isMastered: false,
})

const activeTab = ref<'translation' | 'glossary' | 'analysis' | 'application'>('translation')
const pronunciationMode = ref<'off' | 'pinyin' | 'bopomofo'>('off')

// Reset active tab to translation when sentence changes
watch(() => props.sentence.id, () => {
  activeTab.value = 'translation'
})

const activePronunciationText = computed(() => {
  if (pronunciationMode.value === 'pinyin') {
    return getPinyin(props.sentence.canonicalText)
  } else if (pronunciationMode.value === 'bopomofo') {
    return getBopomofo(props.sentence.canonicalText)
  }
  return undefined
})

const hasPronunciation = computed(() => {
  return !!getPinyin(props.sentence.canonicalText)
})

const zippedPinyin = computed(() => {
  const text = props.sentence.canonicalText
  const py = activePronunciationText.value
  if (!py) return []

  // Split and sanitize pronunciation string safely
  const cleanPy = py.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?，。！？；：、「」『』、]/g, ' ')
  const pyList = cleanPy.split(/\s+/).filter(Boolean)

  const result: { char: string; pinyin?: string }[] = []
  let pyIdx = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    // Only assign pronunciation to Chinese characters to prevent misalignment from punctuation
    if (/[\u4e00-\u9fa5]/.test(char)) {
      result.push({ char, pinyin: pyList[pyIdx] || '' })
      pyIdx++
    } else {
      result.push({ char })
    }
  }
  return result
})

function cyclePronunciation() {
  if (pronunciationMode.value === 'off') {
    pronunciationMode.value = 'pinyin'
  } else if (pronunciationMode.value === 'pinyin') {
    pronunciationMode.value = 'bopomofo'
  } else {
    pronunciationMode.value = 'off'
  }
}

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

const isAllMasked = computed(() => props.hintLevel === 'blank')

const showAid = computed(() => {
  return props.hintLevel === 'full' || props.hintLevel === 'meaning-only'
})

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
  <div class="sentence-card" :class="{ 'is-vertical': isVertical }">
    <!-- Mastered Red Seal Stamp -->
    <div v-if="isMastered" class="mastered-seal-container">
      <RedSeal text="記" :size="46" />
    </div>
    <!-- Structured Translation and Annotations Tabs -->
    <div v-if="showAid && (sentence.structuredTranslation || sentence.translationHint)" class="aid-container">
      <div class="aid-header">
        <span class="aid-icon">💡</span>
        <div class="aid-tabs">
          <button
            class="aid-tab-btn"
            :class="{ 'is-active': activeTab === 'translation' }"
            @click="activeTab = 'translation'"
          >
            譯文
          </button>
          <button
            v-if="sentence.structuredTranslation?.wordGlossary"
            class="aid-tab-btn"
            :class="{ 'is-active': activeTab === 'glossary' }"
            @click="activeTab = 'glossary'"
          >
            釋義
          </button>
          <button
            v-if="sentence.structuredTranslation?.philosophicalNote"
            class="aid-tab-btn"
            :class="{ 'is-active': activeTab === 'analysis' }"
            @click="activeTab = 'analysis'"
          >
            析理
          </button>
          <button
            v-if="sentence.structuredTranslation?.writingApplication"
            class="aid-tab-btn"
            :class="{ 'is-active': activeTab === 'application' }"
            @click="activeTab = 'application'"
          >
            應用
          </button>
        </div>
        <!-- Pronunciation Guide Toggle -->
        <button
          v-if="hasPronunciation"
          class="btn-pinyin-toggle"
          :class="{ 'is-active': pronunciationMode !== 'off' }"
          @click="cyclePronunciation"
          title="切換注音、拼音標註"
        >
          標音: {{ pronunciationMode === 'off' ? '關' : pronunciationMode === 'pinyin' ? '拼音' : '注音' }}
        </button>
      </div>
      <div class="aid-content-panel">
        <Transition name="fade" mode="out-in">
          <div :key="activeTab" class="aid-tab-panel">
            <template v-if="activeTab === 'translation'">
              <p class="aid-text">{{ sentence.structuredTranslation?.translation || sentence.translationHint }}</p>
            </template>
            <template v-else-if="activeTab === 'glossary'">
              <p class="aid-text glossary-text">{{ sentence.structuredTranslation?.wordGlossary }}</p>
            </template>
            <template v-else-if="activeTab === 'analysis'">
              <p class="aid-text analysis-text">{{ sentence.structuredTranslation?.philosophicalNote }}</p>
            </template>
            <template v-else-if="activeTab === 'application'">
              <p class="aid-text application-text">{{ sentence.structuredTranslation?.writingApplication }}</p>
            </template>
          </div>
        </Transition>
      </div>
    </div>
    
    <div v-else-if="props.hintLevel === 'meaning-only'" class="translation-hint">
      <span class="hint-icon">💡</span>
      <span class="hint-text hint-missing">（無句意提示）</span>
    </div>

    <!-- Sentence text -->
    <div class="sentence-text classical-text" :class="{ 'all-masked-state': isAllMasked, 'has-pinyin-rt': pronunciationMode !== 'off' && activePronunciationText && !isAllMasked }">
      <template v-if="pronunciationMode !== 'off' && activePronunciationText && !isAllMasked">
        <span
          v-for="(item, idx) in zippedPinyin"
          :key="idx"
          class="pinyin-char-slot"
        >
          <ruby v-if="item.pinyin" class="classical-ruby">
            {{ item.char }}<rt class="pinyin-rt">{{ item.pinyin }}</rt>
          </ruby>
          <span v-else class="pinyin-punc">{{ item.char }}</span>
        </span>
      </template>
      <template v-else-if="showChunks">
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

/* ── Aid Container & Tabs ── */
.aid-container {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--sp-6);
  background: rgba(201, 169, 110, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-accent);
  overflow: hidden;
}

.aid-header {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-4);
  background: rgba(201, 169, 110, 0.08);
  border-bottom: 1px solid var(--c-border-accent);
}

.aid-icon {
  font-size: var(--fs-lg);
  line-height: 1;
}

.aid-tabs {
  display: flex;
  gap: var(--sp-2);
}

.aid-tab-btn {
  background: none;
  border: none;
  padding: var(--sp-1) var(--sp-3);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.aid-tab-btn:hover {
  color: var(--c-text-secondary);
  background: rgba(201, 169, 110, 0.08);
}

.aid-tab-btn.is-active {
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.15);
  font-weight: var(--fw-semibold);
}

.aid-content-panel {
  padding: var(--sp-4);
  min-height: 4.5em;
}

.aid-text {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0;
  white-space: pre-line;
}

.glossary-text {
  color: var(--c-text-secondary);
  font-style: normal;
}

.analysis-text {
  color: var(--c-text-secondary);
  border-left: 2px solid var(--c-gold);
  padding-left: var(--sp-3);
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

/* ── Sentence Text ── */
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
  position: relative;
  transition: color var(--duration-normal) var(--ease-out),
              background var(--duration-normal) var(--ease-out);
}

.char-slot.text-revealed {
  color: var(--c-text-primary);
}

.char-slot.text-masked {
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
  animation: masked-breathe 2.5s ease-in-out infinite;
}

@keyframes masked-breathe {
  0%, 100% {
    opacity: 0.7;
    border-color: var(--c-border);
  }
  50% {
    opacity: 1;
    border-color: var(--c-gold-light);
    box-shadow: 0 0 4px var(--c-gold-glow);
  }
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
  opacity: 0.9;
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

/* Fade animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sentence-card {
    padding: var(--sp-4);
  }
}

/* ── Pinyin & Application Styles ── */
.btn-pinyin-toggle {
  background: none;
  border: 1px solid var(--c-border-accent);
  padding: 2px var(--sp-2);
  font-family: var(--font-sans);
  font-size: 0.625rem;
  color: var(--c-text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  margin-left: auto;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-pinyin-toggle:hover {
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.08);
}

.btn-pinyin-toggle.is-active {
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.15);
  border-color: var(--c-gold);
}

.application-text {
  color: var(--c-text-secondary);
  border-left: 2px solid var(--c-success);
  padding-left: var(--sp-3);
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
}

.sentence-text.has-pinyin-rt {
  line-height: 2.8em; /* Add line height spacing to avoid ruby overlaps */
  gap: var(--sp-1) var(--sp-2);
}

.classical-ruby {
  ruby-position: over;
  ruby-align: center;
  font-size: var(--fs-2xl);
  font-family: var(--font-serif);
}

.pinyin-rt {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  color: var(--c-gold);
  letter-spacing: 0;
  user-select: none;
  font-weight: var(--fw-normal);
}

.pinyin-char-slot {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.pinyin-punc {
  font-size: var(--fs-2xl);
  font-family: var(--font-serif);
  color: var(--c-text-muted);
}

/* ── Masters / Vertical styles ── */
.mastered-seal-container {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
  pointer-events: none;
}

.sentence-card {
  position: relative;
}

.sentence-card.is-vertical {
  display: flex;
  flex-direction: row-reverse;
  align-items: stretch;
  gap: var(--sp-6);
  min-height: 380px;
}

.sentence-card.is-vertical .aid-container {
  width: 280px;
  margin-bottom: 0;
  margin-left: var(--sp-6);
  flex-shrink: 0;
  writing-mode: horizontal-tb;
}

.sentence-card.is-vertical .sentence-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 280px;
  line-height: 2.2;
  gap: var(--sp-4);
  background-image: repeating-linear-gradient(
    to left,
    transparent,
    transparent 35px,
    var(--c-wusilan-line) 35px,
    var(--c-wusilan-line) 36px
  );
  background-size: 36px 100%;
  padding-left: var(--sp-4);
  white-space: nowrap;
}

.sentence-card.is-vertical .sentence-text.has-pinyin-rt {
  line-height: 3.2em;
  background-size: 52px 100%;
  background-image: repeating-linear-gradient(
    to left,
    transparent,
    transparent 51px,
    var(--c-wusilan-line) 51px,
    var(--c-wusilan-line) 52px
  );
}

.sentence-card.is-vertical .char-slot {
  min-width: auto;
  min-height: 1.4em;
  display: inline-block;
}

.sentence-card.is-vertical .mastered-seal-container {
  top: auto;
  bottom: 12px;
  left: 12px;
  right: auto;
}
</style>
