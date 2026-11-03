<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { POETRY_COLLECTION, getPoetryStats } from '@/data/poetry'
import type { PoemItem, PoemType, LearningPillar, PoemGradeLevel } from '@/types/content'
import { LEARNING_PILLARS } from '@/types/content'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import PoetryInfograph from '@/components/PoetryInfograph.vue'
import PoetryPlayground from '@/components/PoetryPlayground.vue'
import { speechService } from '@/services/speech'

const router = useRouter()

// Filtering states
const selectedType = ref<'all' | PoemType>('all')
const selectedGrade = ref<'all' | PoemGradeLevel>('all')
const selectedTheme = ref<string>('all')
const searchQuery = ref('')

// Interactive widgets toggle
const showInfograph = ref(true)
const showPlayground = ref(false)

// Reader modal state
const activePoem = ref<PoemItem | null>(null)
const activePillar = ref<LearningPillar>('understand')
const isVerticalLayout = ref(false)
const phoneticMode = ref<'none' | 'zhuyin' | 'pinyin'>('zhuyin')
const fontSizeScale = ref<number>(1)

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
    // Grade filter
    if (selectedGrade.value !== 'all' && p.gradeLevel !== selectedGrade.value) {
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
      const inQupai = p.qupai ? p.qupai.toLowerCase().includes(q) : false
      const inKey = p.keyVerses.some((k) => k.toLowerCase().includes(q))
      if (!inTitle && !inAuthor && !inLines && !inCipai && !inQupai && !inKey) {
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

// Font size scaling
function zoomInFont() {
  if (fontSizeScale.value < 1.4) fontSizeScale.value += 0.1
}

function zoomOutFont() {
  if (fontSizeScale.value > 0.85) fontSizeScale.value -= 0.1
}

// Recitation cloze helper
function getClozeLine(line: string, lineIndex: number): string {
  if (activeRecitationTier.value === 'full') return line
  if (activeRecitationTier.value === 'blank') return '＿'.repeat(Math.min(line.length, 12))
  if (activeRecitationTier.value === 'first-char') {
    return line.charAt(0) + ' ＿＿＿＿＿＿'
  }
  if (revealedCloze.value[lineIndex]) return line
  const chars = line.split('')
  return chars
    .map((c, i) => {
      if (['，', '。', '！', '？', '、', '；', '：'].includes(c)) return c
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
        <span class="header-icon">🌸</span>
        <span>小學生快樂學古文 ‧ 全教材精選</span>
      </div>
      <h1 class="poetry-title">唐詩 ‧ 宋詞 ‧ 元曲樂園</h1>
      <p class="poetry-subtitle">
        經典全量收錄，配備注音、拼音、童趣小故事、趣味百科、體裁圖表與飛花令遊戲化評量！
      </p>

      <!-- Stats Bar -->
      <div class="stats-row">
        <div class="stat-pill">
          <span class="stat-num">{{ stats.total }}</span>
          <span class="stat-label">篇典藏名作</span>
        </div>
        <div class="stat-pill tang">
          <span class="stat-num">{{ stats.tangCount }}</span>
          <span class="stat-label">首唐詩瑰寶</span>
        </div>
        <div class="stat-pill song">
          <span class="stat-num">{{ stats.songCount }}</span>
          <span class="stat-label">闋宋詞菁華</span>
        </div>
        <div class="stat-pill yuan">
          <span class="stat-num">{{ stats.yuanCount }}</span>
          <span class="stat-label">首元曲天籟</span>
        </div>
        <div class="stat-pill author">
          <span class="stat-num">{{ stats.authorCount }}</span>
          <span class="stat-label">位歷代名家</span>
        </div>
      </div>

      <!-- Quick Action Toggles -->
      <div class="feature-toggles">
        <button
          class="feature-toggle-btn"
          :class="{ active: showInfograph }"
          @click="showInfograph = !showInfograph"
        >
          <span>📊 知識大講堂（Infograph 圖表）</span>
          <span class="toggle-arrow">{{ showInfograph ? '▲ 收合' : '▼ 展開' }}</span>
        </button>
        <button
          class="feature-toggle-btn playground-btn"
          :class="{ active: showPlayground }"
          @click="showPlayground = !showPlayground"
        >
          <span>🎮 趣味遊樂園（飛花令 ‧ 拼圖 ‧ 闖關）</span>
          <span class="toggle-arrow">{{ showPlayground ? '▲ 收合' : '▼ 展開' }}</span>
        </button>
      </div>
    </header>

    <!-- Playground Section (Interactive Gamification) -->
    <transition name="expand">
      <section v-if="showPlayground" class="widget-section">
        <PoetryPlayground />
      </section>
    </transition>

    <!-- Infograph Section (Visual Knowledge & Charts) -->
    <transition name="expand">
      <section v-if="showInfograph" class="widget-section">
        <PoetryInfograph />
      </section>
    </transition>

    <!-- Filters Section -->
    <section class="filters-section">
      <!-- Genre (Type) Segmented Control -->
      <div class="filter-group">
        <span class="filter-group-label">文體體裁：</span>
        <div class="type-segmented-control">
          <button
            class="seg-btn"
            :class="{ active: selectedType === 'all' }"
            @click="selectedType = 'all'"
          >
            全部體裁 ({{ POETRY_COLLECTION.length }})
          </button>
          <button
            class="seg-btn type-tang"
            :class="{ active: selectedType === 'tang' }"
            @click="selectedType = 'tang'"
          >
            唐詩 ({{ stats.tangCount }})
          </button>
          <button
            class="seg-btn type-song"
            :class="{ active: selectedType === 'song' }"
            @click="selectedType = 'song'"
          >
            宋詞 ({{ stats.songCount }})
          </button>
          <button
            class="seg-btn type-yuan"
            :class="{ active: selectedType === 'yuan' }"
            @click="selectedType = 'yuan'"
          >
            元曲 ({{ stats.yuanCount }})
          </button>
        </div>
      </div>

      <!-- Grade Level Filter -->
      <div class="filter-group">
        <span class="filter-group-label">學年進階：</span>
        <div class="grade-segmented-control">
          <button
            class="grade-btn"
            :class="{ active: selectedGrade === 'all' }"
            @click="selectedGrade = 'all'"
          >
            全學段
          </button>
          <button
            class="grade-btn grade-low"
            :class="{ active: selectedGrade === 'primary-low' }"
            @click="selectedGrade = 'primary-low'"
          >
            🌱 小學啟蒙（一二年級）
          </button>
          <button
            class="grade-btn grade-mid"
            :class="{ active: selectedGrade === 'primary-mid' }"
            @click="selectedGrade = 'primary-mid'"
          >
            🌿 小學精進（三四年級）
          </button>
          <button
            class="grade-btn grade-high"
            :class="{ active: selectedGrade === 'primary-high' }"
            @click="selectedGrade = 'primary-high'"
          >
            🏆 小學經典（五六年級）
          </button>
          <button
            class="grade-btn grade-adv"
            :class="{ active: selectedGrade === 'advanced' }"
            @click="selectedGrade = 'advanced'"
          >
            🌟 初中拔尖
          </button>
        </div>
      </div>

      <!-- Search & Theme Bar -->
      <div class="search-and-theme">
        <div class="search-box">
          <ClassicalIcon name="search" :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋篇名、作者、名句（如「牀前明月光」、「大江東去」）..."
            class="search-input"
          />
          <button
            v-if="searchQuery"
            class="clear-search-btn"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </div>

        <!-- Theme Chips -->
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

    <!-- Poetry Cards Grid -->
    <main class="poetry-grid">
      <article
        v-for="poem in filteredPoems"
        :key="poem.id"
        class="poem-card"
        :class="[`type-${poem.type}`, poem.gradeLevel ? `card-${poem.gradeLevel}` : '']"
        @click="openPoem(poem)"
      >
        <div class="card-top">
          <div class="badges-group">
            <span class="dynasty-badge">{{ poem.dynasty }}</span>
            <span v-if="poem.gradeLabel" class="grade-badge">{{ poem.gradeLabel.split('・')[0] }}</span>
            <span class="genre-badge">{{ poem.genre }}</span>
          </div>
          <span class="emoji-icon">{{ poem.illustrationEmoji || (poem.type === 'yuan' ? '🐎' : (poem.type === 'song' ? '🪷' : '📜')) }}</span>
        </div>

        <div class="card-heading">
          <h2 class="card-title">{{ poem.title }}</h2>
          <span class="card-author">{{ poem.author }}</span>
        </div>

        <!-- 千古名句預覽 -->
        <div class="card-key-quote">
          <span class="quote-sign">“</span>
          <span class="quote-text">{{ poem.keyVerses[0] || poem.lines[0] }}</span>
        </div>

        <!-- 原文摘要 -->
        <div class="card-lines-preview">
          <p v-for="(line, idx) in poem.lines.slice(0, 3)" :key="idx" class="preview-line">
            {{ line }}
          </p>
          <span v-if="poem.lines.length > 3" class="preview-more">……</span>
        </div>

        <div class="card-footer">
          <span class="theme-tag">{{ poem.theme.split(' ‧ ')[0] }}</span>
          <span class="read-prompt">快樂啟讀 📖</span>
        </div>
      </article>
    </main>

    <!-- Empty State -->
    <div v-if="filteredPoems.length === 0" class="empty-state">
      <span class="empty-icon">🍃</span>
      <p class="empty-text">沒有找到符合條件的古詩詞，換個關鍵字或篩選試試看吧！</p>
      <button
        class="reset-filter-btn"
        @click="selectedType = 'all'; selectedGrade = 'all'; selectedTheme = 'all'; searchQuery = ''"
      >
        重置所有篩選
      </button>
    </div>

    <!-- Reader Modal -->
    <div v-if="activePoem" class="modal-backdrop" @click.self="closePoem">
      <div class="poem-reader-modal" :style="{ '--scale': fontSizeScale }">
        <!-- Modal Top Bar -->
        <div class="modal-top-bar">
          <div class="modal-nav-left">
            <button class="nav-arrow-btn" @click="prevPoem" title="上一篇">
              ◀ 上一篇
            </button>
            <span class="dynasty-pill">{{ activePoem.dynasty }}</span>
            <span v-if="activePoem.gradeLabel" class="grade-pill">{{ activePoem.gradeLabel }}</span>
          </div>

          <!-- Tools Center: Phonetic Switcher & Font Zoom -->
          <div class="modal-tools">
            <div class="tool-segmented">
              <button
                class="tool-btn"
                :class="{ active: phoneticMode === 'zhuyin' }"
                @click="phoneticMode = 'zhuyin'"
                title="顯示注音符號"
              >
                ㄅㄆㄇ
              </button>
              <button
                class="tool-btn"
                :class="{ active: phoneticMode === 'pinyin' }"
                @click="phoneticMode = 'pinyin'"
                title="顯示漢語拼音"
              >
                拼音
              </button>
              <button
                class="tool-btn"
                :class="{ active: phoneticMode === 'none' }"
                @click="phoneticMode = 'none'"
                title="純文字模式"
              >
                純文
              </button>
            </div>

            <!-- Font scale buttons -->
            <div class="zoom-tools">
              <button class="zoom-btn" @click="zoomOutFont" title="縮小字體">A-</button>
              <button class="zoom-btn" @click="zoomInFont" title="放大字體">A+</button>
            </div>

            <!-- Recite audio toggle -->
            <button
              class="audio-toggle-btn"
              :class="{ playing: isPlayingAudio }"
              @click="toggleAudio"
            >
              <ClassicalIcon :name="isPlayingAudio ? 'pause' : 'audio'" :size="16" />
              <span>{{ isPlayingAudio ? '暫停朗讀' : '語音朗讀' }}</span>
            </button>
          </div>

          <div class="modal-nav-right">
            <button class="nav-arrow-btn" @click="nextPoem" title="下一篇">
              下一篇 ▶
            </button>
            <button class="modal-close-btn" @click="closePoem" title="關閉視窗">
              ✕
            </button>
          </div>
        </div>

        <!-- Modal Main Body (2 Columns on Desktop) -->
        <div class="modal-body-split">
          <!-- Left Column: The Classic Text & Phonetics -->
          <div class="left-scroll-pane">
            <div class="poem-main-title-block">
              <div class="title-with-emoji">
                <span v-if="activePoem.illustrationEmoji" class="title-emoji">{{ activePoem.illustrationEmoji }}</span>
                <h2 class="modal-poem-title">{{ activePoem.title }}</h2>
              </div>
              <div class="modal-poem-meta">
                <span class="author-link">{{ activePoem.author }}</span>
                <span v-if="activePoem.cipai" class="cipai-tag">詞牌：{{ activePoem.cipai }}</span>
                <span v-if="activePoem.qupai" class="qupai-tag">曲牌：{{ activePoem.qupai }}</span>
                <span class="genre-text">{{ activePoem.genre }}</span>
              </div>
            </div>

            <!-- Recitation Cloze Tier Selector -->
            <div v-if="activePillar === 'memorize'" class="recitation-tier-selector">
              <span class="tier-label">階梯記憶：</span>
              <button
                v-for="tier in [
                  { id: 'full', label: '完整原文' },
                  { id: 'cloze', label: '間隔挖空' },
                  { id: 'first-char', label: '首字提示' },
                  { id: 'blank', label: '全句默寫' },
                ]"
                :key="tier.id"
                class="tier-btn"
                :class="{ active: activeRecitationTier === tier.id }"
                @click="activeRecitationTier = tier.id as any"
              >
                {{ tier.label }}
              </button>
            </div>

            <!-- The Text Display with Phonetics -->
            <div
              class="classic-text-container"
              :class="{
                'vertical-mode': isVerticalLayout,
                'cloze-mode': activePillar === 'memorize' && activeRecitationTier !== 'full',
              }"
            >
              <div
                v-for="(line, lineIdx) in activePoem.lines"
                :key="lineIdx"
                class="poem-line-block"
              >
                <!-- Phonetic Annotation (Zhuyin or Pinyin) -->
                <div v-if="phoneticMode === 'zhuyin' && activePoem.zhuyin && activePoem.zhuyin[lineIdx]" class="phonetic-row zhuyin-row">
                  {{ activePoem.zhuyin[lineIdx] }}
                </div>
                <div v-else-if="phoneticMode === 'pinyin' && activePoem.pinyin && activePoem.pinyin[lineIdx]" class="phonetic-row pinyin-row">
                  {{ activePoem.pinyin[lineIdx] }}
                </div>

                <!-- Text Line -->
                <div
                  class="line-text"
                  @click="activePillar === 'memorize' && activeRecitationTier === 'cloze' ? toggleLineReveal(lineIdx) : null"
                >
                  {{ activePillar === 'memorize' ? getClozeLine(line, lineIdx) : line }}
                </div>

                <!-- Vernacular subline in Understand mode -->
                <div v-if="activePillar === 'understand' && activePoem.vernacular[lineIdx]" class="line-vernacular">
                  {{ activePoem.vernacular[lineIdx] }}
                </div>
              </div>
            </div>

            <!-- Kid Story Box (Special for Elementary Students) -->
            <div v-if="activePoem.kidStory" class="kid-story-card">
              <div class="card-head">
                <span class="card-head-icon">📖</span>
                <span class="card-head-title">小學生趣味小故事 ‧ 詩人背後的事</span>
              </div>
              <p class="kid-story-text">{{ activePoem.kidStory }}</p>
            </div>

            <!-- Fun Fact / Cold Knowledge -->
            <div v-if="activePoem.funFact" class="fun-fact-card">
              <div class="card-head">
                <span class="card-head-icon">💡</span>
                <span class="card-head-title">古文冷知識 ‧ 小小探祕家</span>
              </div>
              <p class="fun-fact-text">{{ activePoem.funFact }}</p>
            </div>

            <!-- Vocab Box -->
            <div v-if="activePoem.vocabList && activePoem.vocabList.length > 0" class="vocab-card">
              <div class="card-head">
                <span class="card-head-icon">📚</span>
                <span class="card-head-title">字詞小寶盒 ‧ 生字詞典</span>
              </div>
              <div class="vocab-items">
                <div v-for="vocab in activePoem.vocabList" :key="vocab.word" class="vocab-item">
                  <span class="vocab-word">{{ vocab.word }}</span>
                  <span v-if="vocab.pinyin" class="vocab-pinyin">({{ vocab.pinyin }})</span>
                  <span class="vocab-mean">：{{ vocab.meaning }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: 4 Pillars of Deep Learning -->
          <div class="right-pillar-pane">
            <!-- 4 Pillar Tabs Navigation -->
            <div class="pillar-tabs-bar">
              <button
                v-for="pillarKey in ['understand', 'enjoy', 'memorize', 'connect']"
                :key="pillarKey"
                class="pillar-tab-btn"
                :class="{ active: activePillar === pillarKey }"
                @click="activePillar = pillarKey as any"
              >
                <span class="pillar-tab-title">{{ LEARNING_PILLARS[pillarKey as LearningPillar].title }}</span>
              </button>
            </div>

            <!-- Pillar 1: Understand -->
            <div v-if="activePillar === 'understand'" class="pillar-panel">
              <div class="meta-section">
                <h4 class="section-title">作者生平</h4>
                <p class="section-text">{{ activePoem.authorBio }}</p>
              </div>

              <div class="meta-section">
                <h4 class="section-title">創作背景</h4>
                <p class="section-text">{{ activePoem.background }}</p>
              </div>

              <div class="meta-section key-verses-section">
                <h4 class="section-title">千古名句</h4>
                <ul class="key-verses-list">
                  <li v-for="(kv, idx) in activePoem.keyVerses" :key="idx" class="key-verse-item">
                    {{ kv }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Pillar 2: Enjoy -->
            <div v-if="activePillar === 'enjoy'" class="pillar-panel">
              <div class="meta-section">
                <h4 class="section-title">意境美學賞析</h4>
                <p class="section-text appreciation-text">{{ activePoem.appreciation }}</p>
              </div>

              <div v-if="activePoem.rhythmNotes" class="meta-section">
                <h4 class="section-title">聲律與節奏指引</h4>
                <p class="section-text">{{ activePoem.rhythmNotes }}</p>
              </div>
            </div>

            <!-- Pillar 3: Memorize -->
            <div v-if="activePillar === 'memorize'" class="pillar-panel">
              <div class="meta-section">
                <h4 class="section-title">熟讀成誦技巧</h4>
                <p class="section-text">{{ activePoem.recitationTips || '透過大聲朗讀與階梯挖空，循序漸進建立骨架記憶。' }}</p>
              </div>
              <div class="memorize-prompt-box">
                <p>💡 提示：左側文本已切換至背誦模式，點擊挖空處可即時揭曉答案！</p>
              </div>
            </div>

            <!-- Pillar 4: Connect -->
            <div v-if="activePillar === 'connect'" class="pillar-panel">
              <div class="meta-section">
                <h4 class="section-title">現代生活共鳴</h4>
                <p class="section-text connect-text">{{ activePoem.modernEcho }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4rem 1rem;
}

@media (min-width: 768px) {
  .poetry-view {
    padding: 2rem 1.5rem 5rem 1.5rem;
  }
}

/* Header */
.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-seal-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2b6cb0;
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.poetry-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-text, #1a202c);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .poetry-title {
    font-size: 2.6rem;
  }
}

.poetry-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-muted, #718096);
  max-width: 680px;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 9999px;
  padding: 0.35rem 0.85rem;
  font-size: 0.825rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.stat-num {
  font-weight: 800;
  color: #2b6cb0;
}

.stat-pill.tang .stat-num { color: #d69e2e; }
.stat-pill.song .stat-num { color: #319795; }
.stat-pill.yuan .stat-num { color: #dd6b20; }
.stat-pill.author .stat-num { color: #805ad5; }

.stat-label {
  color: var(--color-text-muted, #718096);
}

.feature-toggles {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  border: 1.5px solid #bee3f8;
  background: #ebf8ff;
  color: #2b6cb0;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-toggle-btn.playground-btn {
  border-color: #feebc8;
  background: #fffaf0;
  color: #c05621;
}

.feature-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-toggle-btn.active {
  background: #2b6cb0;
  color: #ffffff;
  border-color: #2b6cb0;
}

.feature-toggle-btn.playground-btn.active {
  background: #dd6b20;
  color: #ffffff;
  border-color: #dd6b20;
}

.toggle-arrow {
  font-size: 0.75rem;
  opacity: 0.85;
}

.widget-section {
  margin-bottom: 2rem;
}

/* Filters */
.filters-section {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 20px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .filter-group {
    flex-direction: row;
    align-items: center;
  }
}

.filter-group-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--color-text-muted, #718096);
  min-width: 72px;
}

.type-segmented-control, .grade-segmented-control {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.seg-btn, .grade-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f7fafc);
  color: var(--color-text-muted, #4a5568);
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.seg-btn:hover, .grade-btn:hover {
  background: #edf2f7;
}

.seg-btn.active {
  background: #2b6cb0;
  border-color: #2b6cb0;
  color: #ffffff;
}

.seg-btn.type-tang.active { background: #d69e2e; border-color: #d69e2e; }
.seg-btn.type-song.active { background: #319795; border-color: #319795; }
.seg-btn.type-yuan.active { background: #dd6b20; border-color: #dd6b20; }

.grade-btn.active {
  background: #4a5568;
  border-color: #4a5568;
  color: #ffffff;
}

.grade-btn.grade-low.active { background: #38a169; border-color: #38a169; }
.grade-btn.grade-mid.active { background: #319795; border-color: #319795; }
.grade-btn.grade-high.active { background: #2b6cb0; border-color: #2b6cb0; }
.grade-btn.grade-adv.active { background: #805ad5; border-color: #805ad5; }

.search-and-theme {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  color: #a0aec0;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.2rem 0.65rem 2.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border, #cbd5e0);
  background: var(--color-bg-subtle, #f8fafc);
  font-size: 0.875rem;
  color: var(--color-text, #1a202c);
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3182ce;
  background: #ffffff;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 0.875rem;
}

.theme-chips {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}

.theme-chip {
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f7fafc);
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-chip:hover {
  background: #edf2f7;
}

.theme-chip.active {
  background: #3182ce;
  border-color: #3182ce;
  color: #ffffff;
}

/* Grid */
.poetry-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .poetry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .poetry-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.poem-card {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 18px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.poem-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e0;
}

.poem-card.type-tang { border-top: 4px solid #ecc94b; }
.poem-card.type-song { border-top: 4px solid #38b2ac; }
.poem-card.type-yuan { border-top: 4px solid #ed8936; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badges-group {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.dynasty-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  background: #edf2f7;
  color: #4a5568;
}

.grade-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  background: #ebf8ff;
  color: #2b6cb0;
}

.genre-badge {
  font-size: 0.7rem;
  color: #718096;
}

.emoji-icon {
  font-size: 1.5rem;
}

.card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0;
  line-height: 1.35;
}

.card-author {
  font-size: 0.85rem;
  font-weight: 600;
  color: #718096;
  white-space: nowrap;
}

.card-key-quote {
  background: rgba(43, 108, 176, 0.05);
  border-left: 3px solid #3182ce;
  border-radius: 0 8px 8px 0;
  padding: 0.45rem 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c5282;
  display: flex;
  gap: 0.35rem;
}

.quote-sign {
  font-family: serif;
  font-weight: bold;
}

.card-lines-preview {
  font-size: 0.85rem;
  color: var(--color-text-muted, #718096);
  line-height: 1.45;
  flex: 1;
}

.preview-line {
  margin: 0 0 0.2rem 0;
}

.preview-more {
  color: #a0aec0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--color-border, #edf2f7);
  padding-top: 0.65rem;
  margin-top: auto;
}

.theme-tag {
  font-size: 0.725rem;
  color: #718096;
}

.read-prompt {
  font-size: 0.775rem;
  font-weight: 700;
  color: #3182ce;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.75rem;
}

.empty-text {
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 1rem;
}

.reset-filter-btn {
  background: #3182ce;
  color: #ffffff;
  border: none;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  cursor: pointer;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.poem-reader-modal {
  background: var(--color-surface, #ffffff);
  border-radius: 24px;
  width: 100%;
  max-width: 1080px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  font-size: calc(1rem * var(--scale, 1));
}

.modal-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f8fafc);
  flex-wrap: wrap;
}

.modal-nav-left, .modal-nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-arrow-btn {
  background: #ffffff;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4a5568;
  cursor: pointer;
}

.nav-arrow-btn:hover { background: #edf2f7; }

.dynasty-pill, .grade-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.dynasty-pill { background: #edf2f7; color: #4a5568; }
.grade-pill { background: #ebf8ff; color: #2b6cb0; }

.modal-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tool-segmented {
  display: flex;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  overflow: hidden;
}

.tool-btn {
  background: #ffffff;
  border: none;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4a5568;
  cursor: pointer;
}

.tool-btn.active {
  background: #3182ce;
  color: #ffffff;
}

.zoom-tools {
  display: flex;
  gap: 0.25rem;
}

.zoom-btn {
  background: #ffffff;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}

.audio-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2b6cb0;
  cursor: pointer;
}

.audio-toggle-btn.playing {
  background: #c53030;
  border-color: #c53030;
  color: #ffffff;
}

.modal-close-btn {
  background: #edf2f7;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 800;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover { background: #e2e8f0; color: #1a202c; }

/* Modal Body Split (2 Columns on Desktop) */
.modal-body-split {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

@media (min-width: 860px) {
  .modal-body-split {
    flex-direction: row;
    overflow-y: hidden;
  }
}

.left-scroll-pane {
  flex: 1.25;
  padding: 1.5rem;
  overflow-y: auto;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

@media (min-width: 860px) {
  .left-scroll-pane {
    border-bottom: none;
    border-right: 1px solid var(--color-border, #e2e8f0);
  }
}

.right-pillar-pane {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: var(--color-bg-subtle, #f8fafc);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.poem-main-title-block {
  margin-bottom: 1.25rem;
  text-align: center;
}

.title-with-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-emoji {
  font-size: 1.75rem;
}

.modal-poem-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--color-text, #1a202c);
  margin: 0;
}

.modal-poem-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.35rem;
}

.author-link {
  font-weight: 700;
  color: #2b6cb0;
}

.cipai-tag, .qupai-tag {
  background: #edf2f7;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.recitation-tier-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.tier-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4a5568;
}

.tier-btn {
  background: #ffffff;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.tier-btn.active {
  background: #3182ce;
  color: #ffffff;
  border-color: #3182ce;
}

/* Classic Text Container */
.classic-text-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.poem-line-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.phonetic-row {
  font-size: 0.75em;
  color: #718096;
  letter-spacing: 0.05em;
  font-family: monospace;
}

.zhuyin-row {
  color: #2b6cb0;
}

.pinyin-row {
  color: #d69e2e;
}

.line-text {
  font-size: 1.35em;
  font-weight: 700;
  color: var(--color-text, #1a202c);
  letter-spacing: 0.06em;
  line-height: 1.5;
  cursor: default;
}

.cloze-mode .line-text {
  cursor: pointer;
}

.line-vernacular {
  font-size: 0.85em;
  color: var(--color-text-muted, #718096);
  max-width: 520px;
  margin-top: 0.15rem;
}

/* Kid Story, Fun Fact & Vocab Cards */
.kid-story-card, .fun-fact-card, .vocab-card {
  border-radius: 14px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.kid-story-card {
  background: #fffaf0;
  border: 1px solid #feebc8;
}

.fun-fact-card {
  background: #f0fff4;
  border: 1px solid #c6f6d5;
}

.vocab-card {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.card-head-title {
  font-size: 0.85rem;
  font-weight: 800;
}

.kid-story-card .card-head-title { color: #c05621; }
.fun-fact-card .card-head-title { color: #276749; }
.vocab-card .card-head-title { color: #2b6cb0; }

.kid-story-text, .fun-fact-text {
  font-size: 0.875rem;
  line-height: 1.55;
  margin: 0;
  color: #2d3748;
}

.vocab-items {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.vocab-item {
  font-size: 0.85rem;
}

.vocab-word {
  font-weight: 800;
  color: #2b6cb0;
}

.vocab-pinyin {
  color: #718096;
  font-size: 0.8rem;
  margin-left: 0.2rem;
}

.vocab-mean {
  color: #4a5568;
}

/* Right Pane: 4 Pillars */
.pillar-tabs-bar {
  display: flex;
  background: #edf2f7;
  padding: 0.25rem;
  border-radius: 12px;
}

.pillar-tab-btn {
  flex: 1;
  padding: 0.5rem 0.25rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pillar-tab-btn.active {
  background: #ffffff;
  color: #2b6cb0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.pillar-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.meta-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0;
  border-left: 3px solid #3182ce;
  padding-left: 0.5rem;
}

.section-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.55;
  margin: 0;
}

.key-verses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.key-verse-item {
  background: #ebf8ff;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #2c5282;
}

.memorize-prompt-box {
  background: #fffaf0;
  border: 1px dashed #fbd38d;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 0.825rem;
  color: #744210;
}

/* Animations */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
