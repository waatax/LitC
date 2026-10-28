<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { POETRY_COLLECTION, getPoetryStats } from '@/data/poetry'
import type { PoemItem, PoemType, LearningPillar } from '@/types/content'
import { LEARNING_PILLARS } from '@/types/content'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import { speechService } from '@/services/speech'

const router = useRouter()

// Filtering states
const selectedType = ref<'all' | PoemType>('all')
const selectedTheme = ref<string>('all')
const searchQuery = ref('')

// Reader modal state
const activePoem = ref<PoemItem | null>(null)
const activePillar = ref<LearningPillar>('understand')
const isVerticalLayout = ref(false)
const isPlayingAudio = computed(() => {
  return speechService.state.isPlaying && !speechService.state.isPaused && speechService.state.currentPassageId === activePoem.value?.id
})

// Memory tier for recitation
type RecitationTier = 'full' | 'cloze' | 'first-char' | 'blank'
const activeRecitationTier = ref<RecitationTier>('full')
const revealedCloze = ref<Record<number, boolean>>({})

// Stats
const stats = computed(() => getPoetryStats())

// Themes list
const themes = computed(() => {
  const allThemes = POETRY_COLLECTION.map((p) => p.theme.split(' ‧ ')[0].trim())
  return ['all', ...Array.from(new Set(allThemes))]
})

// Filtered poems
const filteredPoems = computed(() => {
  return POETRY_COLLECTION.filter((p) => {
    // Type filter
    if (selectedType.value !== 'all' && p.type !== selectedType.value) {
      return false
    }
    // Theme filter
    if (selectedTheme.value !== 'all') {
      if (!p.theme.includes(selectedTheme.value)) return false
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const inTitle = p.title.toLowerCase().includes(q)
      const inAuthor = p.author.toLowerCase().includes(q)
      const inLines = p.lines.some((l) => l.toLowerCase().includes(q))
      const inCipai = p.cipai ? p.cipai.toLowerCase().includes(q) : false
      const inKey = p.keyVerses.some((k) => k.toLowerCase().includes(q))
      if (!inTitle && !inAuthor && !inLines && !inCipai && !inKey) {
        return false
      }
    }
    return true
  })
})

function openPoem(poem: PoemItem) {
  activePoem.value = poem
  activePillar.value = 'understand'
  activeRecitationTier.value = 'full'
  revealedCloze.value = {}
  stopAudio()
}

function closePoem() {
  activePoem.value = null
  stopAudio()
}

function prevPoem() {
  if (!activePoem.value) return
  const idx = POETRY_COLLECTION.findIndex((p) => p.id === activePoem.value?.id)
  if (idx > 0) {
    openPoem(POETRY_COLLECTION[idx - 1])
  } else {
    openPoem(POETRY_COLLECTION[POETRY_COLLECTION.length - 1])
  }
}

function nextPoem() {
  if (!activePoem.value) return
  const idx = POETRY_COLLECTION.findIndex((p) => p.id === activePoem.value?.id)
  if (idx < POETRY_COLLECTION.length - 1) {
    openPoem(POETRY_COLLECTION[idx + 1])
  } else {
    openPoem(POETRY_COLLECTION[0])
  }
}

// Audio Recitation
function toggleAudio() {
  if (isPlayingAudio.value) {
    stopAudio()
  } else {
    if (!activePoem.value) return
    const textToRead = `${activePoem.value.title}。${activePoem.value.dynasty}，${activePoem.value.author}。${activePoem.value.lines.join('，')}`
    speechService.speakPassage(
      activePoem.value.id,
      textToRead,
      'canonical',
      {
        workTitle: activePoem.value.title,
        chapterTitle: activePoem.value.author,
        canonicalText: textToRead,
        vernacularText: activePoem.value.vernacular.join('，'),
      }
    )
  }
}

function stopAudio() {
  if (speechService.state.isPlaying) {
    speechService.stop()
  }
}

onUnmounted(() => {
  stopAudio()
})

// Recitation cloze helper
function getClozeLine(line: string, lineIndex: number): string {
  if (activeRecitationTier.value === 'full') return line
  if (activeRecitationTier.value === 'blank') return '＿'.repeat(Math.min(line.length, 12))
  if (activeRecitationTier.value === 'first-char') {
    return line.charAt(0) + ' ＿＿＿＿＿＿'
  }
  // Cloze mode: mask every second word or middle segment
  if (revealedCloze.value[lineIndex]) return line
  const chars = line.split('')
  return chars
    .map((c, i) => {
      if (['，', '。', '！', '？', '、', '；'].includes(c)) return c
      if (i % 2 === 1) return ' ＿ '
      return c
    })
    .join('')
}

function toggleLineReveal(lineIndex: number) {
  revealedCloze.value[lineIndex] = !revealedCloze.value[lineIndex]
}
</script>

<template>
  <div class="poetry-view">
    <!-- View Header -->
    <header class="poetry-header">
      <div class="header-seal-badge">
        <ClassicalIcon name="feather" :size="24" />
        <span>唐風宋韻 ‧ 四維研讀</span>
      </div>
      <h1 class="poetry-title">唐詩絕唱 ‧ 宋詞雅韻</h1>
      <p class="poetry-subtitle">
        融貫「<strong>理解</strong>、<strong>享受</strong>、<strong>背誦</strong>、<strong>連結</strong>」四維心法，品讀穿越千年的文人風骨與心靈對話
      </p>

      <!-- Stat Badges -->
      <div class="stats-row">
        <div class="stat-pill">
          <span class="stat-num">{{ stats.total }}</span>
          <span class="stat-label">傳世名篇</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">{{ stats.tangCount }}</span>
          <span class="stat-label">唐詩絕句律體</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">{{ stats.songCount }}</span>
          <span class="stat-label">宋詞豪放婉約</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">{{ stats.authorCount }}</span>
          <span class="stat-label">千古文豪名家</span>
        </div>
      </div>
    </header>

    <!-- Filters Bar -->
    <section class="filters-section">
      <div class="type-segmented-control">
        <button
          class="seg-btn"
          :class="{ active: selectedType === 'all' }"
          @click="selectedType = 'all'"
        >
          全部名篇 ({{ stats.total }})
        </button>
        <button
          class="seg-btn"
          :class="{ active: selectedType === 'tang' }"
          @click="selectedType = 'tang'"
        >
          唐詩 ({{ stats.tangCount }})
        </button>
        <button
          class="seg-btn"
          :class="{ active: selectedType === 'song' }"
          @click="selectedType = 'song'"
        >
          宋詞 ({{ stats.songCount }})
        </button>
      </div>

      <div class="search-and-theme">
        <div class="search-box">
          <ClassicalIcon name="search" :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋題目、作者、詞牌或千古名句..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="theme-chips">
          <button
            class="theme-chip"
            :class="{ active: selectedTheme === 'all' }"
            @click="selectedTheme = 'all'"
          >
            全部主題
          </button>
          <button
            v-for="th in themes.filter((t) => t !== 'all')"
            :key="th"
            class="theme-chip"
            :class="{ active: selectedTheme === th }"
            @click="selectedTheme = th"
          >
            {{ th }}
          </button>
        </div>
      </div>
    </section>

    <!-- Poetry Grid -->
    <section class="poetry-grid">
      <div
        v-for="poem in filteredPoems"
        :key="poem.id"
        class="poem-card"
        :class="[`type-${poem.type}`]"
        @click="openPoem(poem)"
      >
        <div class="card-top">
          <span class="dynasty-badge">{{ poem.dynasty }}</span>
          <span class="genre-badge">{{ poem.genre }}</span>
          <span class="theme-tag">{{ poem.theme.split(' ‧ ')[0] }}</span>
        </div>

        <h3 class="card-poem-title">
          {{ poem.title }}
          <span v-if="poem.cipai" class="card-cipai">〔{{ poem.cipai }}〕</span>
        </h3>

        <div class="card-author">
          <span class="author-name">{{ poem.author }}</span>
          <span class="author-bio-snippet">{{ poem.authorBio.split('，')[0] }}</span>
        </div>

        <!-- Famous Key Verse Spotlight -->
        <div class="card-key-verse">
          <ClassicalIcon name="sparkle" :size="14" class="key-icon" />
          <span>{{ poem.keyVerses[0] || poem.lines[0] }}</span>
        </div>

        <!-- First lines preview -->
        <div class="card-lines-preview">
          <p v-for="(line, idx) in poem.lines.slice(0, 3)" :key="idx" class="preview-line">
            {{ line }}
          </p>
          <span v-if="poem.lines.length > 3" class="more-lines-indicator">......</span>
        </div>

        <div class="card-footer">
          <span class="card-action-text">
            <span>點擊開啟四維研讀</span>
            <ClassicalIcon name="arrow-right" :size="14" />
          </span>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="filteredPoems.length === 0" class="empty-state">
      <ClassicalIcon name="empty" :size="48" />
      <p>未找到符合條件的詩詞名篇</p>
      <button class="btn btn-secondary" @click="selectedType = 'all'; selectedTheme = 'all'; searchQuery = ''">
        重設篩選
      </button>
    </div>

    <!-- Active Poem Reader Modal -->
    <div v-if="activePoem" class="modal-backdrop" @click.self="closePoem">
      <div class="poem-reader-modal">
        <!-- Modal Top Bar -->
        <div class="reader-header">
          <div class="reader-meta">
            <span class="meta-tag">{{ activePoem.dynasty }}</span>
            <span class="meta-tag">{{ activePoem.genre }}</span>
            <span class="meta-tag theme">{{ activePoem.theme }}</span>
          </div>

          <div class="reader-controls">
            <button
              class="icon-action-btn"
              :class="{ playing: isPlayingAudio }"
              :title="isPlayingAudio ? '停止朗誦' : '名家語音朗誦'"
              @click="toggleAudio"
            >
              <ClassicalIcon :name="isPlayingAudio ? 'pause' : 'audio'" :size="18" />
              <span>{{ isPlayingAudio ? '誦讀中' : '誦讀' }}</span>
            </button>

            <button
              class="icon-action-btn"
              :title="isVerticalLayout ? '切換為橫排' : '切換為古卷直排'"
              @click="isVerticalLayout = !isVerticalLayout"
            >
              <ClassicalIcon name="scroll" :size="18" />
              <span>{{ isVerticalLayout ? '橫排' : '直排' }}</span>
            </button>

            <button class="close-btn" @click="closePoem">✕</button>
          </div>
        </div>

        <!-- Poem Heading -->
        <div class="poem-title-banner">
          <h2 class="reader-title">
            {{ activePoem.title }}
            <span v-if="activePoem.cipai" class="title-cipai">（詞牌：{{ activePoem.cipai }}）</span>
          </h2>
          <div class="reader-author-info">
            <span class="author-tag">{{ activePoem.author }}</span>
            <span class="author-bio">{{ activePoem.authorBio }}</span>
          </div>
        </div>

        <!-- 4 Pillars Navigation Bar -->
        <nav class="pillars-nav">
          <button
            v-for="(meta, key) in LEARNING_PILLARS"
            :key="key"
            class="pillar-tab-btn"
            :class="{ active: activePillar === key }"
            @click="activePillar = key"
          >
            <ClassicalIcon :name="(meta.icon as any)" :size="16" />
            <div class="tab-text">
              <span class="tab-title">{{ meta.title }}</span>
              <span class="tab-sub">{{ meta.subtitle.split(' ‧ ')[0] }}</span>
            </div>
          </button>
        </nav>

        <!-- Pillar 1: 理解通釋 -->
        <div v-if="activePillar === 'understand'" class="pillar-content understand-content">
          <div class="section-notice">
            <ClassicalIcon name="book-open" :size="16" />
            <span>逐句對照 ‧ 通曉字句義理與文意脈絡</span>
          </div>

          <div class="line-by-line-container">
            <div
              v-for="(line, idx) in activePoem.lines"
              :key="idx"
              class="aligned-line-card"
            >
              <div class="original-line classical-text-lg">
                <span class="line-num">{{ idx + 1 }}</span>
                <span class="line-content">{{ line }}</span>
              </div>
              <div class="vernacular-line">
                <ClassicalIcon name="arrow-right" :size="12" class="arrow-indicator" />
                <span>{{ activePoem.vernacular[idx] || '白話義釋對應於全篇脈絡中。' }}</span>
              </div>
            </div>
          </div>

          <div v-if="activePoem.background" class="context-box">
            <h4 class="box-title">
              <ClassicalIcon name="history" :size="15" />
              <span>創作歷史與作者心境背景</span>
            </h4>
            <p class="box-text">{{ activePoem.background }}</p>
          </div>
        </div>

        <!-- Pillar 2: 享受沉浸 -->
        <div v-if="activePillar === 'enjoy'" class="pillar-content enjoy-content">
          <div class="section-notice">
            <ClassicalIcon name="sparkle" :size="16" />
            <span>水墨古韻 ‧ 意境沉浸與文字美學鑑賞</span>
          </div>

          <div
            class="calligraphy-stage"
            :class="{ 'vertical-stage': isVerticalLayout }"
          >
            <div class="calligraphy-text classical-text-xl">
              <div v-for="(line, idx) in activePoem.lines" :key="idx" class="poem-line-verse">
                {{ line }}
              </div>
            </div>
          </div>

          <!-- Appreciation Block -->
          <div class="appreciation-card">
            <h4 class="card-section-title">
              <ClassicalIcon name="feather" :size="16" />
              <span>意境與美學深度賞析</span>
            </h4>
            <p class="appreciation-text">{{ activePoem.appreciation }}</p>

            <div class="key-verses-box">
              <span class="key-verses-label">千古名句品味：</span>
              <div class="key-verses-tags">
                <span v-for="(kv, kIdx) in activePoem.keyVerses" :key="kIdx" class="key-tag">
                  「{{ kv }}」
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pillar 3: 背誦記憶 -->
        <div v-if="activePillar === 'memorize'" class="pillar-content memorize-content">
          <div class="section-notice">
            <ClassicalIcon name="scholar" :size="16" />
            <span>階梯式記憶 ‧ 意羣骨架與韻腳自測</span>
          </div>

          <!-- Recitation Tier Selector -->
          <div class="tier-selector">
            <button
              class="tier-btn"
              :class="{ active: activeRecitationTier === 'full' }"
              @click="activeRecitationTier = 'full'"
            >
              全顯誦讀
            </button>
            <button
              class="tier-btn"
              :class="{ active: activeRecitationTier === 'cloze' }"
              @click="activeRecitationTier = 'cloze'"
            >
              關鍵字挖空
            </button>
            <button
              class="tier-btn"
              :class="{ active: activeRecitationTier === 'first-char' }"
              @click="activeRecitationTier = 'first-char'"
            >
              首字提點
            </button>
            <button
              class="tier-btn"
              :class="{ active: activeRecitationTier === 'blank' }"
              @click="activeRecitationTier = 'blank'"
            >
              盲背自測
            </button>
          </div>

          <!-- Recitation Canvas -->
          <div class="recitation-canvas">
            <div
              v-for="(line, idx) in activePoem.lines"
              :key="idx"
              class="recite-line-item"
              @click="toggleLineReveal(idx)"
            >
              <span class="line-seq">{{ idx + 1 }}</span>
              <span class="line-display classical-text-lg">
                {{ getClozeLine(line, idx) }}
              </span>
              <span v-if="activeRecitationTier === 'cloze'" class="cloze-hint-text">
                {{ revealedCloze[idx] ? '（已翻開）' : '（點擊揭曉）' }}
              </span>
            </div>
          </div>

          <!-- Meter and Memory Guidance -->
          <div class="memory-guidance-grid">
            <div v-if="activePoem.rhythmNotes" class="guidance-box">
              <h5 class="guidance-title">
                <ClassicalIcon name="headphones" :size="14" />
                <span>平仄韻律與節奏指引</span>
              </h5>
              <p class="guidance-text">{{ activePoem.rhythmNotes }}</p>
            </div>

            <div v-if="activePoem.recitationTips" class="guidance-box">
              <h5 class="guidance-title">
                <ClassicalIcon name="sparkle" :size="14" />
                <span>背誦心法與意象聯想祕訣</span>
              </h5>
              <p class="guidance-text">{{ activePoem.recitationTips }}</p>
            </div>
          </div>
        </div>

        <!-- Pillar 4: 古今連結 -->
        <div v-if="activePillar === 'connect'" class="pillar-content connect-content">
          <div class="section-notice">
            <ClassicalIcon name="flame" :size="16" />
            <span>心靈對話 ‧ 千年前的文字，回應今日的生活</span>
          </div>

          <div class="modern-echo-card">
            <div class="echo-header">
              <span class="echo-badge">現代生命共鳴</span>
              <h3 class="echo-title">跨越千年的心靈映照</h3>
            </div>

            <div class="echo-body">
              <p class="echo-text">{{ activePoem.modernEcho }}</p>
            </div>

            <div class="reflection-prompt">
              <div class="prompt-title">
                <ClassicalIcon name="feather" :size="14" />
                <span>心靈對照思考題</span>
              </div>
              <p class="prompt-text">
                當你今天面臨壓力、得失、孤獨或選擇時，{{ activePoem.author }}在《{{ activePoem.title }}》中的這份心境，能為你帶來怎樣的超脫或啟發？
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer Navigation -->
        <div class="reader-footer">
          <button class="nav-prev-btn" @click="prevPoem">
            <span>← 上一首</span>
          </button>
          <span class="poem-index-label">
            {{ POETRY_COLLECTION.findIndex((p) => p.id === activePoem?.id) + 1 }} / {{ POETRY_COLLECTION.length }}
          </span>
          <button class="nav-next-btn" @click="nextPoem">
            <span>下一首 →</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.poetry-header {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.header-seal-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-gold-glow, rgba(201, 169, 110, 0.15));
  border: 1px solid var(--c-border-accent, rgba(201, 169, 110, 0.3));
  color: var(--c-gold, #c9a96e);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  margin-bottom: var(--sp-3);
}

.poetry-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
  letter-spacing: 0.08em;
}

.poetry-subtitle {
  color: var(--c-text-secondary);
  font-size: var(--text-base);
  max-width: 680px;
  margin: 0 auto var(--sp-6);
  line-height: 1.6;
}

.poetry-subtitle strong {
  color: var(--c-gold);
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.stat-pill {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-num {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--c-gold);
  font-family: var(--font-classical);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
}

/* Filters Section */
.filters-section {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-4);
  margin-bottom: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.type-segmented-control {
  display: flex;
  gap: var(--sp-2);
  background: var(--c-bg-deep);
  padding: 4px;
  border-radius: var(--radius-md);
  max-width: 420px;
}

.seg-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.seg-btn.active {
  background: var(--c-bg-elevated);
  color: var(--c-gold);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.search-and-theme {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

@media (min-width: 768px) {
  .search-and-theme {
    flex-direction: row;
    align-items: center;
  }
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 0.4rem 0.8rem;
  flex: 1;
  min-width: 240px;
}

.search-icon {
  color: var(--c-text-muted);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--c-text-primary);
  font-size: var(--text-sm);
}

.clear-search-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
}

.theme-chips {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.theme-chip {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  font-size: var(--text-xs);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.theme-chip:hover,
.theme-chip.active {
  border-color: var(--c-gold);
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

/* Poetry Grid */
.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--sp-4);
}

.poem-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  cursor: pointer;
  transition: all var(--duration-normal);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.poem-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-gold);
  background: var(--c-bg-card-hover);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.poem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--c-border);
  transition: background var(--duration-fast);
}

.poem-card.type-tang::before {
  background: var(--c-accent-literature, #4a6fa5);
}

.poem-card.type-song::before {
  background: var(--c-gold, #c9a96e);
}

.card-top {
  display: flex;
  gap: 0.4rem;
  margin-bottom: var(--sp-3);
  font-size: var(--text-xs);
}

.dynasty-badge {
  background: var(--c-bg-deep);
  color: var(--c-gold);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-accent);
}

.genre-badge,
.theme-tag {
  background: var(--c-bg-deep);
  color: var(--c-text-secondary);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.card-poem-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-1);
  letter-spacing: 0.05em;
}

.card-cipai {
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--c-gold);
}

.card-author {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: var(--sp-3);
}

.author-name {
  font-weight: 600;
  color: var(--c-text-primary);
}

.author-bio-snippet {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.card-key-verse {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--c-gold-glow);
  border: 1px solid var(--c-border-accent);
  color: var(--c-gold-light);
  font-size: var(--text-sm);
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  margin-bottom: var(--sp-3);
  font-style: italic;
}

.key-icon {
  flex-shrink: 0;
  color: var(--c-gold);
}

.card-lines-preview {
  margin-bottom: var(--sp-4);
  flex: 1;
}

.preview-line {
  color: var(--c-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
  margin: 0;
  font-family: var(--font-classical);
}

.more-lines-indicator {
  color: var(--c-text-muted);
  font-size: var(--text-xs);
}

.card-footer {
  border-top: 1px solid var(--c-border-subtle);
  padding-top: var(--sp-3);
  display: flex;
  justify-content: flex-end;
}

.card-action-text {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  color: var(--c-gold);
  font-weight: 600;
}

/* Modal Reader */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 4, 8, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.poem-reader-modal {
  background: var(--c-bg-secondary);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}

.reader-header {
  padding: var(--sp-4) var(--sp-6);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-bg-deep);
}

.reader-meta {
  display: flex;
  gap: 0.5rem;
}

.meta-tag {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  font-size: var(--text-xs);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  color: var(--c-text-secondary);
}

.meta-tag.theme {
  color: var(--c-gold);
  border-color: var(--c-border-accent);
}

.reader-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.icon-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-primary);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.icon-action-btn:hover {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.icon-action-btn.playing {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
}

.close-btn:hover {
  color: var(--c-text-primary);
}

.poem-title-banner {
  padding: var(--sp-4) var(--sp-6);
  background: var(--c-bg-elevated);
  border-bottom: 1px solid var(--c-border-subtle);
  text-align: center;
}

.reader-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: var(--sp-1);
}

.title-cipai {
  font-size: var(--text-base);
  color: var(--c-gold);
  font-weight: normal;
}

.reader-author-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.author-tag {
  font-weight: 600;
  color: var(--c-gold);
  font-size: var(--text-sm);
}

.author-bio {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
}

/* 4 Pillars Nav */
.pillars-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--c-bg-deep);
  border-bottom: 1px solid var(--c-border);
}

.pillar-tab-btn {
  background: transparent;
  border: none;
  padding: var(--sp-3) var(--sp-2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--c-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--duration-fast);
}

.pillar-tab-btn:hover {
  color: var(--c-text-primary);
  background: var(--c-bg-card);
}

.pillar-tab-btn.active {
  color: var(--c-gold);
  border-bottom-color: var(--c-gold);
  background: var(--c-bg-secondary);
}

.tab-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.tab-title {
  font-size: var(--text-sm);
  font-weight: 700;
}

.tab-sub {
  font-size: 10px;
  color: var(--c-text-muted);
}

/* Pillar Content Containers */
.pillar-content {
  padding: var(--sp-6);
  overflow-y: auto;
  flex: 1;
}

.section-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
}

/* Pillar 1: Understand */
.line-by-line-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.aligned-line-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--sp-3) var(--sp-4);
}

.original-line {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  color: var(--c-text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.line-num {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
  width: 1.5rem;
}

.vernacular-line {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--c-gold-light);
  padding-left: 2.3rem;
  line-height: 1.5;
}

.context-box {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
}

.box-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-sm);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.box-text {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  line-height: 1.6;
}

/* Pillar 2: Enjoy */
.calligraphy-stage {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  padding: var(--sp-8) var(--sp-6);
  margin-bottom: var(--sp-6);
  text-align: center;
}

.poem-line-verse {
  margin-bottom: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--c-text-primary);
  font-family: var(--font-classical);
}

.vertical-stage {
  writing-mode: vertical-rl;
  text-orientation: upright;
  margin: 0 auto var(--sp-6);
  min-height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--sp-8);
}

.vertical-stage .poem-line-verse {
  margin-bottom: 0;
  margin-left: 1.5rem;
}

.appreciation-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
}

.card-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-gold);
  font-size: var(--text-base);
  margin-bottom: var(--sp-3);
}

.appreciation-text {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--sp-4);
}

.key-verses-box {
  border-top: 1px solid var(--c-border-subtle);
  padding-top: var(--sp-3);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.key-verses-label {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.key-tag {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  font-size: var(--text-xs);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-accent);
}

/* Pillar 3: Memorize */
.tier-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: var(--sp-4);
  background: var(--c-bg-deep);
  padding: 4px;
  border-radius: var(--radius-md);
}

.tier-btn {
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: var(--text-xs);
  background: transparent;
  border: none;
  color: var(--c-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tier-btn.active {
  background: var(--c-bg-elevated);
  color: var(--c-gold);
  font-weight: 600;
}

.recitation-canvas {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  margin-bottom: var(--sp-5);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.recite-line-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.recite-line-item:hover {
  background: var(--c-bg-card);
}

.line-seq {
  color: var(--c-text-muted);
  font-size: var(--text-xs);
  width: 1.5rem;
}

.line-display {
  color: var(--c-text-primary);
  font-family: var(--font-classical);
  letter-spacing: 0.1em;
}

.cloze-hint-text {
  font-size: var(--text-xs);
  color: var(--c-gold);
  margin-left: auto;
}

.memory-guidance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-4);
}

.guidance-box {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
}

.guidance-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-sm);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
}

.guidance-text {
  font-size: var(--text-xs);
  color: var(--c-text-secondary);
  line-height: 1.6;
}

/* Pillar 4: Connect */
.modern-echo-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
}

.echo-header {
  margin-bottom: var(--sp-4);
}

.echo-badge {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  font-size: var(--text-xs);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-bottom: var(--sp-1);
}

.echo-title {
  font-size: var(--text-lg);
  color: var(--c-text-primary);
}

.echo-text {
  font-size: var(--text-base);
  color: var(--c-text-primary);
  line-height: 1.8;
  margin-bottom: var(--sp-6);
}

.reflection-prompt {
  background: var(--c-bg-deep);
  border: 1px dashed var(--c-border-accent);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
}

.prompt-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-sm);
  color: var(--c-gold);
  margin-bottom: var(--sp-2);
  font-weight: 600;
}

.prompt-text {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  line-height: 1.6;
}

/* Reader Footer Navigation */
.reader-footer {
  padding: var(--sp-3) var(--sp-6);
  background: var(--c-bg-deep);
  border-top: 1px solid var(--c-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-prev-btn,
.nav-next-btn {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.nav-prev-btn:hover,
.nav-next-btn:hover {
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.poem-index-label {
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--sp-12) var(--sp-4);
  color: var(--c-text-muted);
}
</style>
