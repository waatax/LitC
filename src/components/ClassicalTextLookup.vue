<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { dictionarySourceLinks, lookupDictionary, type DictionaryEntry } from '@/services/dictionary'

const props = withDefaults(defineProps<{
  text: string
  highlight?: string
}>(), { highlight: '' })

const selected = ref('')
const entry = ref<DictionaryEntry | null>(null)
const loading = ref(false)
const failed = ref(false)
const open = ref(false)
let requestId = 0

const characters = computed(() => Array.from(props.text))
const sourceLinks = computed(() => dictionarySourceLinks(selected.value))
const highlightedIndexes = computed(() => {
  const indexes = new Set<number>()
  const query = Array.from(props.highlight.trim())
  if (!query.length) return indexes
  const text = characters.value
  for (let start = 0; start <= text.length - query.length; start++) {
    if (query.every((char, offset) => text[start + offset] === char)) {
      query.forEach((_, offset) => indexes.add(start + offset))
    }
  }
  return indexes
})

function isHanCharacter(char: string): boolean {
  return /\p{Script=Han}/u.test(char)
}

function isHighlighted(index: number): boolean {
  return highlightedIndexes.value.has(index)
}

async function selectCharacter(char: string) {
  if (!isHanCharacter(char)) return
  selected.value = char
  entry.value = null
  failed.value = false
  loading.value = true
  open.value = true
  const currentRequest = ++requestId
  const result = await lookupDictionary(char)
  if (currentRequest !== requestId) return
  entry.value = result
  failed.value = !result
  loading.value = false
}

function close() {
  open.value = false
  requestId++
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) close()
}

if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <span class="lookup-text" aria-label="經典原文；可逐字點擊查詢注音與字義">
    <template v-for="(char, index) in characters" :key="`${index}-${char}`">
      <button
        v-if="isHanCharacter(char)"
        type="button"
        class="lookup-char"
        :class="{ 'search-highlight-mark': isHighlighted(index) }"
        :aria-label="`查詢「${char}」的注音與字義`"
        @click="selectCharacter(char)"
      >{{ char }}</button>
      <span v-else>{{ char }}</span>
    </template>
  </span>

  <Teleport to="body">
    <div v-if="open" class="dictionary-backdrop" role="presentation" @click.self="close">
      <section class="dictionary-sheet" role="dialog" aria-modal="true" :aria-label="`${selected}的字典解釋`">
        <header class="dictionary-header">
          <div>
            <span class="dictionary-kicker">古文點字辭典</span>
            <h2>{{ selected }}</h2>
          </div>
          <button class="dictionary-close" type="button" aria-label="關閉字典" @click="close">×</button>
        </header>

        <p v-if="loading" class="dictionary-status" aria-live="polite">正在查詢注音與字義……</p>
        <template v-else-if="entry">
          <article v-for="(reading, readingIndex) in entry.readings" :key="readingIndex" class="dictionary-reading">
            <div class="pronunciation-row">
              <strong class="bopomofo">{{ reading.bopomofo || '未標注音' }}</strong>
              <span v-if="reading.pinyin" class="pinyin">{{ reading.pinyin }}</span>
            </div>
            <ol class="definition-list">
              <li v-for="(definition, definitionIndex) in reading.definitions" :key="definitionIndex">
                <span v-if="definition.type" class="word-type">{{ definition.type }}</span>{{ definition.text }}
              </li>
            </ol>
          </article>
          <p class="dictionary-attribution">資料顯示：{{ entry.source }}；釋義保持原資料內容，不作改寫。</p>
        </template>
        <p v-else-if="failed" class="dictionary-status" aria-live="polite">目前無法取得線上釋義，仍可使用下方官方辭典查詢。</p>

        <nav class="dictionary-links" aria-label="辭典來源複核">
          <a v-for="link in sourceLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
        </nav>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.lookup-text { display: inline; }
.lookup-char {
  appearance: none; border: 0; padding: 0; margin: 0; background: transparent;
  color: inherit; font: inherit; line-height: inherit; letter-spacing: inherit;
  cursor: help; border-radius: 0.15em;
}
.lookup-char:hover, .lookup-char:focus-visible { color: var(--c-gold); background: var(--c-gold-glow); outline: none; }
.dictionary-backdrop { position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center; padding: 1rem; background: rgba(8, 10, 14, 0.72); backdrop-filter: blur(5px); }
.dictionary-sheet { width: min(38rem, 100%); max-height: min(78vh, 46rem); overflow: auto; padding: 1.4rem; border: 1px solid var(--c-border-accent); border-radius: var(--radius-lg); background: var(--c-bg-elevated); box-shadow: 0 24px 80px rgba(0,0,0,.5); color: var(--c-text-primary); }
.dictionary-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--c-border-subtle); padding-bottom: 1rem; }
.dictionary-header h2 { margin: .15rem 0 0; font-family: var(--font-serif); font-size: 3rem; color: var(--c-gold-light); }
.dictionary-kicker, .dictionary-attribution { font-family: var(--font-sans); font-size: var(--fs-xs); color: var(--c-text-muted); }
.dictionary-close { border: 0; background: transparent; color: var(--c-text-muted); font-size: 2rem; cursor: pointer; }
.dictionary-reading { padding: 1rem 0; border-bottom: 1px dashed var(--c-border-subtle); }
.pronunciation-row { display: flex; align-items: baseline; gap: .8rem; flex-wrap: wrap; }
.bopomofo { font-size: 1.2rem; color: var(--c-gold); letter-spacing: .08em; }
.pinyin { color: var(--c-text-muted); font-family: var(--font-sans); }
.definition-list { margin: .75rem 0 0; padding-left: 1.5rem; line-height: 1.85; }
.word-type { display: inline-block; margin-right: .45rem; padding: 0 .35rem; border: 1px solid var(--c-border-accent); border-radius: var(--radius-sm); color: var(--c-gold); font-family: var(--font-sans); font-size: var(--fs-xs); }
.dictionary-status { padding: 1.5rem 0; color: var(--c-text-secondary); }
.dictionary-attribution { line-height: 1.7; }
.dictionary-links { display: flex; gap: .55rem .9rem; flex-wrap: wrap; padding-top: 1rem; }
.dictionary-links a { color: var(--c-gold); font-family: var(--font-sans); font-size: var(--fs-sm); }
@media (max-width: 640px) {
  .dictionary-backdrop { align-items: end; padding: 0; }
  .dictionary-sheet { width: 100%; max-height: 82vh; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
}
@media (prefers-reduced-motion: reduce) { .dictionary-backdrop { backdrop-filter: none; } }
</style>
