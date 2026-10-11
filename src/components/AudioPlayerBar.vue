<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import {
  speechService,
  SPEED_PRESETS,
  type SpeechMode,
  type SpeechRate,
  type PlaybackMode,
  type SleepTimerOption,
} from '@/services/speech'
import ClassicalIcon from '@/components/ClassicalIcon.vue'

const speechState = speechService.state
const voices = speechService.voices
const isSupported = speechService.isSupported
const showSettings = ref(false)
const showSpeedMenu = ref(false)
const showTimerMenu = ref(false)
const rateToast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const hasActivePlayback = computed(() => {
  return speechState.isPlaying || speechState.isPaused || speechState.currentPassageId !== null
})

watch(hasActivePlayback, (active) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('has-audio-player-open', active)
  }
}, { immediate: true })

const currentItem = computed(() => {
  if (speechState.playlistIndex >= 0 && speechState.playlistIndex < speechState.playlist.length) {
    return speechState.playlist[speechState.playlistIndex]
  }
  return null
})

const totalPassages = computed(() => speechState.playlist.length)
const currentPassageNumber = computed(() => speechState.playlistIndex + 1)

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(speechState.currentTime))
const formattedDuration = computed(() => formatTime(speechState.duration))

const formattedSleepRemaining = computed(() => {
  if (speechState.sleepTimer === 'end-of-chapter') return '播完本章'
  if (speechState.sleepTimerRemainingSeconds > 0) {
    return formatTime(speechState.sleepTimerRemainingSeconds)
  }
  return ''
})

const progressPercent = computed(() => {
  if (!speechState.duration || speechState.duration <= 0) return 0
  return Math.min(100, Math.max(0, (speechState.currentTime / speechState.duration) * 100))
})

const formattedRate = computed(() => {
  return Number(speechState.currentRate.toFixed(2))
})

const isCustomRate = computed(() => {
  const r = speechState.currentRate
  return Math.abs(r - 0.75) >= 0.02 && Math.abs(r - 1.0) >= 0.02 && Math.abs(r - 1.25) >= 0.02
})

function onSeek(e: Event) {
  const target = e.target as HTMLInputElement
  if (target) {
    const val = parseFloat(target.value)
    speechService.seek(val)
  }
}

function togglePlay() {
  if (speechState.isPlaying && !speechState.isPaused) {
    speechService.pause()
  } else {
    speechService.resume()
  }
}

function stop() {
  speechService.stop()
  showSettings.value = false
  showSpeedMenu.value = false
  showTimerMenu.value = false
  speechState.isPlaylistDrawerOpen = false
}

function prev() {
  speechService.prevPassage()
}

function next() {
  speechService.nextPassage()
}

function showToast(text: string) {
  rateToast.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    rateToast.value = null
  }, 1400)
}

function setRate(rate: SpeechRate) {
  speechService.setRate(rate)
  showToast(`誦讀倍速：${Number(rate.toFixed(2))}x`)
}

function changeRateDelta(delta: number) {
  const nextRate = Math.max(0.5, Math.min(2.5, Math.round((speechState.currentRate + delta) * 100) / 100))
  speechService.setRate(nextRate)
  showToast(`倍速微調：${nextRate}x`)
}

function onRateSliderInput(e: Event) {
  const target = e.target as HTMLInputElement
  if (target) {
    const val = parseFloat(target.value)
    speechService.setRate(val)
  }
}

function toggleSpeedMenu() {
  showSpeedMenu.value = !showSpeedMenu.value
  if (showSpeedMenu.value) {
    showSettings.value = false
    showTimerMenu.value = false
  }
}

function toggleSettings() {
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    showSpeedMenu.value = false
    showTimerMenu.value = false
  }
}

function toggleTimerMenu() {
  showTimerMenu.value = !showTimerMenu.value
  if (showTimerMenu.value) {
    showSettings.value = false
    showSpeedMenu.value = false
  }
}

function setMode(mode: SpeechMode) {
  speechService.setMode(mode)
  const labels: Record<SpeechMode, string> = {
    canonical: '原文誦讀',
    vernacular: '白話義理',
    bilingual: '文白相間對照導讀',
  }
  showToast(labels[mode])
}

function cyclePlaybackMode() {
  speechService.cyclePlaybackMode()
  const modeLabels: Record<PlaybackMode, string> = {
    sequential: '順序播放',
    'loop-single': '單段涵泳（循環）',
    'loop-all': '全篇循環',
  }
  showToast(modeLabels[speechState.playbackMode])
}

function selectSleepTimer(opt: SleepTimerOption) {
  speechService.setSleepTimer(opt)
  showTimerMenu.value = false
  if (opt === 0) {
    showToast('已取消定時休眠')
  } else if (opt === 'end-of-chapter') {
    showToast('定時：播放完本篇後關閉')
  } else {
    showToast(`定時休眠：${opt} 分鐘後關閉`)
  }
}

function jumpTo(idx: number) {
  speechService.jumpToPlaylistItem(idx)
}

function onVoiceChange(e: Event) {
  const target = e.target as HTMLSelectElement
  if (target && target.value) {
    speechService.setVoice(target.value)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (!hasActivePlayback.value) return
  const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return

  if (e.code === 'Space') {
    e.preventDefault()
    togglePlay()
  } else if (e.code === 'ArrowRight' && speechState.audioSourceType === 'file') {
    e.preventDefault()
    speechService.seek(speechState.currentTime + 5)
  } else if (e.code === 'ArrowLeft' && speechState.audioSourceType === 'file') {
    e.preventDefault()
    speechService.seek(speechState.currentTime - 5)
  } else if (e.key === '[' || e.key === 'BracketLeft') {
    e.preventDefault()
    changeRateDelta(-0.05)
  } else if (e.key === ']' || e.key === 'BracketRight') {
    e.preventDefault()
    changeRateDelta(0.05)
  } else if (e.key === '0') {
    e.preventDefault()
    speechService.setRate(1.0)
    showToast('恢復 1.0x 標準常速')
  } else if (e.code === 'Escape') {
    if (speechState.isPlaylistDrawerOpen) {
      speechState.isPlaylistDrawerOpen = false
    } else if (showSpeedMenu.value) {
      showSpeedMenu.value = false
    } else if (showTimerMenu.value) {
      showTimerMenu.value = false
    } else if (showSettings.value) {
      showSettings.value = false
    } else {
      stop()
    }
  }
}

function handleDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (showSpeedMenu.value && !target.closest('.speed-menu-popover') && !target.closest('.rate-more-btn')) {
    showSpeedMenu.value = false
  }
  if (showTimerMenu.value && !target.closest('.timer-menu-popover') && !target.closest('.timer-btn')) {
    showTimerMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('click', handleDocumentClick)
  if (toastTimer) clearTimeout(toastTimer)
  if (typeof document !== 'undefined') {
    document.body.classList.remove('has-audio-player-open')
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isSupported && hasActivePlayback"
      class="audio-player-wrapper"
    >
      <!-- Mini Pill Mode (When Collapsed) -->
      <div
        v-if="speechState.isCollapsed"
        class="mini-player-pill glass-panel"
        role="region"
        aria-label="微型朗讀控制器"
        @click="speechService.toggleCollapse()"
      >
        <div class="mini-disk" :class="{ 'is-spinning': speechState.isPlaying && !speechState.isPaused }">
          <ClassicalIcon name="audio-playing" :size="16" />
        </div>
        <div class="mini-meta">
          <span class="mini-title">{{ currentItem?.workTitle || '經典' }} · {{ currentItem?.chapterTitle || '朗讀' }}</span>
          <span class="mini-snippet">{{ speechState.currentText.slice(0, 16) }}…</span>
        </div>
        <button
          class="mini-btn play-btn"
          :title="speechState.isPlaying && !speechState.isPaused ? '暫停' : '繼續'"
          @click.stop="togglePlay"
        >
          <ClassicalIcon v-if="speechState.isPlaying && !speechState.isPaused" name="pause" :size="14" />
          <ClassicalIcon v-else name="play" :size="14" />
        </button>
        <button
          class="mini-btn expand-btn"
          title="展開播放器"
          @click.stop="speechService.toggleCollapse()"
        >
          <ClassicalIcon name="chevron-down" :size="14" style="transform: rotate(180deg);" />
        </button>
      </div>

      <!-- Full Player Bar -->
      <div
        v-else
        class="audio-player-bar glass-panel"
        role="region"
        aria-label="語音朗讀播放器"
      >
        <!-- Timeline Progress Bar (When playing real audio file) -->
        <div v-if="speechState.audioSourceType === 'file' && speechState.duration > 0" class="timeline-container">
          <span class="time-label">{{ formattedCurrentTime }}</span>
          <div class="scrubber-wrapper">
            <div class="scrubber-track">
              <div class="scrubber-buffer" :style="{ width: `${speechState.bufferedPercent}%` }"></div>
              <div class="scrubber-fill" :style="{ width: `${progressPercent}%` }"></div>
            </div>
            <input
              type="range"
              class="scrubber-input"
              :min="0"
              :max="speechState.duration"
              :step="0.1"
              :value="speechState.currentTime"
              aria-label="音訊進度跳轉"
              @input="onSeek"
            />
          </div>
          <span class="time-label duration">{{ formattedDuration }}</span>
        </div>

        <div class="player-container">
          <!-- Info section -->
          <div class="player-info">
            <div class="wave-indicator" :class="{ 'is-active': speechState.isPlaying && !speechState.isPaused }">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </div>

            <div class="info-text">
              <div class="info-title">
                <!-- Audio Source Badge -->
                <span
                  class="source-badge"
                  :class="speechState.audioSourceType === 'file' ? 'is-file' : 'is-tts'"
                  :title="speechState.audioSourceType === 'file' ? '播放高品質名家預製錄音檔' : '使用古典音韻校正語音引擎朗讀'"
                >
                  <ClassicalIcon name="audio" :size="12" />
                  <span>{{ speechState.audioSourceType === 'file' ? '名家錄音' : '智能正音' }}</span>
                </span>

                <span class="passage-tag">
                  <ClassicalIcon :name="speechState.currentMode === 'canonical' ? 'book-open' : 'headphones'" :size="12" />
                  <span>{{ speechState.currentMode === 'canonical' ? '原文' : (speechState.currentMode === 'vernacular' ? '白話' : '文白對照') }}</span>
                </span>

                <span v-if="currentItem?.workTitle" class="work-title">{{ currentItem.workTitle }}</span>
                <span v-if="currentItem?.chapterTitle" class="chapter-title">{{ currentItem.chapterTitle }}</span>
                <span v-if="totalPassages > 1" class="counter">
                  {{ currentPassageNumber }} / {{ totalPassages }}
                </span>

                <!-- Sleep Timer Active Badge -->
                <span
                  v-if="speechState.sleepTimer !== 0"
                  class="sleep-active-badge"
                  title="點擊調整或關閉定時休眠"
                  @click.stop="toggleTimerMenu"
                >
                  ⏳ {{ formattedSleepRemaining }}
                </span>
              </div>
              <p class="current-snippet" :title="speechState.currentText">
                {{ speechState.currentText.slice(0, 40) }}{{ speechState.currentText.length > 40 ? '…' : '' }}
              </p>
            </div>
          </div>

          <!-- Controls section -->
          <div class="player-controls">
            <button
              v-if="totalPassages > 1"
              class="ctrl-btn btn-ghost"
              :disabled="speechState.playlistIndex <= 0 && speechState.playbackMode !== 'loop-all'"
              title="上一段"
              aria-label="上一段"
              @click="prev"
            >
              ⏮
            </button>

            <button
              class="ctrl-btn btn-primary play-btn"
              :title="speechState.isPlaying && !speechState.isPaused ? '暫停 (空白鍵)' : '繼續朗讀 (空白鍵)'"
              :aria-label="speechState.isPlaying && !speechState.isPaused ? '暫停' : '繼續朗讀'"
              @click="togglePlay"
            >
              <ClassicalIcon v-if="speechState.isPlaying && !speechState.isPaused" name="pause" :size="16" />
              <ClassicalIcon v-else name="play" :size="16" />
            </button>

            <button
              v-if="totalPassages > 1"
              class="ctrl-btn btn-ghost"
              :disabled="speechState.playlistIndex >= totalPassages - 1 && speechState.playbackMode !== 'loop-all'"
              title="下一段"
              aria-label="下一段"
              @click="next"
            >
              ⏭
            </button>

            <!-- Playback Mode Cycle -->
            <button
              class="ctrl-btn btn-ghost mode-btn"
              :class="{ 'is-loop': speechState.playbackMode !== 'sequential' }"
              :title="`播放模式：${speechState.playbackMode === 'sequential' ? '順序播放' : (speechState.playbackMode === 'loop-single' ? '單段涵泳循環' : '全篇循環')}`"
              @click="cyclePlaybackMode"
            >
              <span v-if="speechState.playbackMode === 'sequential'">➡️</span>
              <span v-else-if="speechState.playbackMode === 'loop-single'">🔂</span>
              <span v-else>🔁</span>
            </button>

            <!-- Playlist Drawer Toggle -->
            <button
              v-if="totalPassages > 1"
              class="ctrl-btn btn-ghost playlist-toggle-btn"
              :class="{ 'is-open': speechState.isPlaylistDrawerOpen }"
              title="展開章節段落清單"
              @click="speechService.togglePlaylistDrawer()"
            >
              📑
            </button>

            <!-- Sleep Timer Toggle -->
            <button
              class="ctrl-btn btn-ghost timer-btn"
              :class="{ 'is-active': speechState.sleepTimer !== 0 }"
              title="定時休眠關閉"
              @click.stop="toggleTimerMenu"
            >
              ⏱️
            </button>

            <button
              class="ctrl-btn btn-ghost collapse-bar-btn"
              title="收合至迷你膠囊"
              aria-label="收合"
              @click="speechService.toggleCollapse()"
            >
              ▾
            </button>

            <button
              class="ctrl-btn btn-ghost stop-btn"
              title="停止朗讀 (Esc)"
              aria-label="停止朗讀"
              @click="stop"
            >
              ⏹
            </button>
          </div>

          <!-- Mode & Speed Options -->
          <div class="player-options">
            <div class="mode-toggles">
              <button
                class="opt-btn"
                :class="{ 'is-active': speechState.currentMode === 'canonical' }"
                title="原文誦讀"
                @click="setMode('canonical')"
              >
                原文
              </button>
              <button
                class="opt-btn"
                :class="{ 'is-active': speechState.currentMode === 'vernacular' }"
                title="白話意譯"
                @click="setMode('vernacular')"
              >
                白話
              </button>
              <button
                class="opt-btn"
                :class="{ 'is-active': speechState.currentMode === 'bilingual' }"
                title="文白相間：先誦經文，再釋白話"
                @click="setMode('bilingual')"
              >
                文白
              </button>
            </div>

            <div class="rate-toggles">
              <button
                class="rate-btn"
                :class="{ 'is-active': Math.abs(speechState.currentRate - 0.75) < 0.02 }"
                title="0.75倍速 (雅正涵泳)"
                @click="setRate(0.75)"
              >
                0.75x
              </button>
              <button
                class="rate-btn"
                :class="{ 'is-active': Math.abs(speechState.currentRate - 1.0) < 0.02 }"
                title="1.0倍速 (常速研習)"
                @click="setRate(1.0)"
              >
                1.0x
              </button>
              <button
                class="rate-btn"
                :class="{ 'is-active': Math.abs(speechState.currentRate - 1.25) < 0.02 }"
                title="1.25倍速 (流暢通讀)"
                @click="setRate(1.25)"
              >
                1.25x
              </button>
              <button
                class="rate-btn rate-more-btn"
                :class="{ 'is-active': showSpeedMenu || isCustomRate }"
                :title="`自訂倍速 (${formattedRate}x)；快捷鍵：[ 減速 / ] 加速`"
                @click.stop="toggleSpeedMenu"
              >
                <span v-if="isCustomRate">{{ formattedRate }}x ▾</span>
                <span v-else style="display: inline-flex; align-items: center; gap: 2px;"><ClassicalIcon name="speed" :size="13" /> ▾</span>
              </button>
            </div>

            <button
              class="settings-toggle-btn"
              :class="{ 'is-open': showSettings }"
              title="語音詳細設定"
              @click="toggleSettings"
            >
              <ClassicalIcon name="compass" :size="15" />
            </button>
          </div>
        </div>

        <!-- Speed Menu Popover -->
        <Transition name="fade-slide">
          <div v-if="showSpeedMenu" class="speed-menu-popover glass-panel" @click.stop>
            <div class="speed-menu-header">
              <div class="speed-menu-title-group">
                <span class="speed-menu-icon"><ClassicalIcon name="speed" :size="16" /></span>
                <span class="speed-menu-title">誦讀倍速控制</span>
              </div>
              <button class="speed-reset-btn" @click="setRate(1.0)" title="恢復 1.0x 標準常速 (快捷鍵 0)">
                恢復 1.0x
              </button>
            </div>

            <!-- Presets grid -->
            <div class="speed-presets-grid">
              <button
                v-for="preset in SPEED_PRESETS"
                :key="preset.rate"
                class="speed-preset-item"
                :class="{ 'is-active': Math.abs(speechState.currentRate - preset.rate) < 0.02 }"
                @click="setRate(preset.rate)"
              >
                <span class="preset-label">{{ preset.label }}</span>
                <span class="preset-desc">{{ preset.desc }}</span>
              </button>
            </div>

            <!-- Continuous fine-tuning slider -->
            <div class="speed-slider-section">
              <div class="speed-slider-header">
                <span class="slider-hint">連續微調 (0.5x ~ 2.5x)</span>
                <span class="slider-val-badge">{{ formattedRate }}x</span>
              </div>
              <div class="speed-slider-row">
                <button class="slider-step-btn" @click="changeRateDelta(-0.05)" title="微降 0.05x (快捷鍵 [)">−</button>
                <div class="speed-slider-wrapper">
                  <input
                    type="range"
                    class="speed-slider-input"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    :value="speechState.currentRate"
                    aria-label="精細倍速調節滑桿"
                    @input="onRateSliderInput"
                  />
                </div>
                <button class="slider-step-btn" @click="changeRateDelta(0.05)" title="微升 0.05x (快捷鍵 ])">＋</button>
              </div>
            </div>

            <div class="speed-keyboard-hint">
              <span>快捷鍵：<code>[</code> 減速 · <code>]</code> 加速 · <code>0</code> 重設</span>
            </div>
          </div>
        </Transition>

        <!-- Sleep Timer Popover -->
        <Transition name="fade-slide">
          <div v-if="showTimerMenu" class="timer-menu-popover glass-panel" @click.stop>
            <div class="timer-menu-header">
              <span class="timer-menu-title">⏱️ 定時休眠關閉</span>
              <span v-if="speechState.sleepTimer !== 0" class="timer-current-badge">{{ formattedSleepRemaining }}</span>
            </div>
            <div class="timer-options-list">
              <button
                class="timer-opt-item"
                :class="{ 'is-active': speechState.sleepTimer === 0 }"
                @click="selectSleepTimer(0)"
              >
                不啟用定時
              </button>
              <button
                class="timer-opt-item"
                :class="{ 'is-active': speechState.sleepTimer === 15 }"
                @click="selectSleepTimer(15)"
              >
                15 分鐘後
              </button>
              <button
                class="timer-opt-item"
                :class="{ 'is-active': speechState.sleepTimer === 30 }"
                @click="selectSleepTimer(30)"
              >
                30 分鐘後
              </button>
              <button
                class="timer-opt-item"
                :class="{ 'is-active': speechState.sleepTimer === 45 }"
                @click="selectSleepTimer(45)"
              >
                45 分鐘後
              </button>
              <button
                class="timer-opt-item"
                :class="{ 'is-active': speechState.sleepTimer === 'end-of-chapter' }"
                @click="selectSleepTimer('end-of-chapter')"
              >
                播完本篇章
              </button>
            </div>
          </div>
        </Transition>

        <!-- Playlist Drawer Popover -->
        <Transition name="fade-slide">
          <div v-if="speechState.isPlaylistDrawerOpen && totalPassages > 0" class="playlist-drawer glass-panel" @click.stop>
            <div class="playlist-drawer-header">
              <div class="drawer-title-group">
                <span class="drawer-title">📑 播放清單</span>
                <span class="drawer-count">共 {{ totalPassages }} 段</span>
              </div>
              <button class="drawer-close-btn" @click="speechState.isPlaylistDrawerOpen = false">✕</button>
            </div>
            <div class="playlist-items-scroll">
              <div
                v-for="(item, idx) in speechState.playlist"
                :key="item.passageId"
                class="playlist-row"
                :class="{ 'is-current': idx === speechState.playlistIndex }"
                @click="jumpTo(idx)"
              >
                <div class="row-num">{{ idx + 1 }}</div>
                <div class="row-text">
                  <div class="row-header">
                    <span v-if="item.chapterTitle" class="row-chapter">{{ item.chapterTitle }}</span>
                    <span
                      class="row-badge"
                      :class="speechService.hasAudioFile(item.passageId) ? 'badge-audio' : 'badge-tts'"
                    >
                      {{ speechService.hasAudioFile(item.passageId) ? '名家' : '正音' }}
                    </span>
                  </div>
                  <p class="row-canonical">{{ item.canonicalText.slice(0, 32) }}…</p>
                </div>
                <div v-if="idx === speechState.playlistIndex" class="row-status">
                  <span class="playing-indicator">▶</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Rate Toast Notification -->
        <Transition name="toast-fade">
          <div v-if="rateToast" class="rate-toast-badge">
            ⚡ {{ rateToast }}
          </div>
        </Transition>

        <!-- Extended Settings Drawer -->
        <div v-if="showSettings" class="settings-drawer">
          <div class="setting-row">
            <label class="setting-checkbox">
              <input
                type="checkbox"
                :checked="speechState.preferAudioFiles"
                @change="speechService.togglePreferAudioFiles()"
              />
              <span>優先播放名家優質錄音檔（未收錄時自動智慧合成）</span>
            </label>
          </div>

          <div v-if="speechState.audioSourceType === 'tts' || !speechState.preferAudioFiles" class="setting-row">
            <label for="voice-select" class="setting-label">合成音色：</label>
            <select
              id="voice-select"
              class="voice-select"
              :value="speechState.selectedVoiceURI"
              @change="onVoiceChange"
            >
              <option
                v-for="voice in voices"
                :key="voice.voiceURI"
                :value="voice.voiceURI"
              >
                {{ voice.name }} ({{ voice.lang }})
              </option>
            </select>
          </div>

          <div class="setting-row">
            <label class="setting-checkbox">
              <input
                type="checkbox"
                :checked="speechState.isAutoScroll"
                @change="speechService.toggleAutoScroll()"
              />
              <span>朗讀時畫面平滑自動捲動至對應段落</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.audio-player-wrapper {
  position: fixed;
  bottom: var(--sp-4);
  left: 50%;
  transform: translateX(-50%);
  width: min(94vw, 58rem);
  z-index: 1000;
  pointer-events: none;
}

.mini-player-pill,
.audio-player-bar {
  pointer-events: auto;
}

/* Mini Pill Mode */
.mini-player-pill {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-full);
  background: rgba(18, 20, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--c-gold-glow);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(201, 169, 110, 0.2);
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  transition: all var(--duration-normal) var(--ease-out);
}

.mini-player-pill:hover {
  transform: translateY(-2px);
  border-color: var(--c-gold);
}

.mini-disk {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-gold-deep);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-disk.is-spinning {
  animation: spinDisk 6s linear infinite;
}

@keyframes spinDisk {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mini-meta {
  display: flex;
  flex-direction: column;
  max-width: 220px;
  overflow: hidden;
}

.mini-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  color: var(--c-gold-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-snippet {
  font-size: 11px;
  color: var(--c-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-btn {
  background: none;
  border: none;
  color: var(--c-gold-light);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mini-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* Full Bar */
.audio-player-bar {
  position: relative;
  width: 100%;
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--radius-lg);
  background: rgba(18, 20, 26, 0.94);
  backdrop-filter: blur(20px);
  border: 1px solid var(--c-gold-glow);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 24px rgba(201, 169, 110, 0.18);
  transition: all var(--duration-normal) var(--ease-out);
}

/* Timeline scrubber */
.timeline-container {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
  padding-bottom: 2px;
}

.time-label {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-gold-light);
  min-width: 36px;
  font-variant-numeric: tabular-nums;
}

.time-label.duration {
  text-align: right;
  color: var(--c-text-muted);
}

.scrubber-wrapper {
  position: relative;
  flex: 1;
  height: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.scrubber-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.scrubber-buffer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 2px;
  transition: width 0.2s ease;
}

.scrubber-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--c-gold-deep), var(--c-gold-light));
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.5);
  transition: width 0.1s linear;
}

.scrubber-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.player-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

/* Info */
.player-info {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex: 1 1 240px;
  min-width: 0;
}

.wave-indicator {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 20px;
  padding-right: 4px;
}

.wave-indicator .bar {
  width: 3px;
  background: var(--c-gold);
  border-radius: 2px;
  height: 4px;
  transition: height 0.2s ease;
}

.wave-indicator.is-active .bar {
  animation: soundWave 0.8s ease-in-out infinite alternate;
}

.wave-indicator.is-active .bar-1 { height: 16px; animation-delay: 0.1s; }
.wave-indicator.is-active .bar-2 { height: 20px; animation-delay: 0.3s; }
.wave-indicator.is-active .bar-3 { height: 12px; animation-delay: 0.2s; }
.wave-indicator.is-active .bar-4 { height: 18px; animation-delay: 0.4s; }

@keyframes soundWave {
  0% { height: 4px; }
  100% { height: 20px; }
}

.info-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.info-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
  margin-bottom: 2px;
}

.source-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.4;
}

.source-badge.is-file {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.25), rgba(166, 124, 0, 0.2));
  color: var(--c-gold-light);
  border: 1px solid rgba(201, 169, 110, 0.5);
}

.source-badge.is-tts {
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.passage-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-size: 11px;
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  border: 1px solid var(--c-gold-glow);
}

.work-title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: var(--fs-xs);
  color: var(--c-gold-light);
}

.chapter-title {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.counter {
  font-size: 11px;
  color: var(--c-gold-muted);
  font-variant-numeric: tabular-nums;
}

.sleep-active-badge {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: rgba(82, 196, 26, 0.15);
  color: #73d13d;
  border: 1px solid rgba(82, 196, 26, 0.35);
  cursor: pointer;
}

.current-snippet {
  font-size: var(--fs-xs);
  color: var(--c-text-subtle);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 380px;
}

/* Controls */
.player-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--c-gold-light);
  cursor: pointer;
  font-size: var(--fs-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.ctrl-btn:hover:not(:disabled) {
  background: rgba(201, 169, 110, 0.15);
  color: #fff;
  transform: scale(1.06);
}

.ctrl-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ctrl-btn.play-btn {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--c-gold), var(--c-gold-deep));
  color: var(--c-bg-base);
  box-shadow: 0 4px 14px rgba(201, 169, 110, 0.4);
}

.ctrl-btn.play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(201, 169, 110, 0.6);
}

.ctrl-btn.mode-btn.is-loop {
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.15);
}

.ctrl-btn.timer-btn.is-active {
  color: #73d13d;
}

.ctrl-btn.playlist-toggle-btn.is-open {
  background: rgba(201, 169, 110, 0.2);
  color: var(--c-gold);
}

.ctrl-btn.stop-btn {
  font-size: 11px;
}

/* Options */
.player-options {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.mode-toggles {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.opt-btn {
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.opt-btn.is-active {
  background: var(--c-gold-deep);
  color: #fff;
  font-weight: 500;
}

.rate-toggles {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rate-btn {
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-size: 11px;
  padding: 3px 7px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  font-variant-numeric: tabular-nums;
}

.rate-btn.is-active {
  background: var(--c-gold);
  color: var(--c-bg-base);
  font-weight: 600;
}

.settings-toggle-btn {
  background: none;
  border: none;
  color: var(--c-gold-muted);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.settings-toggle-btn:hover,
.settings-toggle-btn.is-open {
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.15);
}

/* Speed Popover */
.speed-menu-popover {
  position: absolute;
  bottom: calc(100% + var(--sp-3));
  right: var(--sp-5);
  width: min(320px, 90vw);
  background: rgba(22, 24, 32, 0.98);
  border: 1px solid var(--c-gold-glow);
  border-radius: var(--radius-lg);
  padding: var(--sp-3) var(--sp-4);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  z-index: 1010;
}

.speed-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.speed-menu-title-group {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-gold-light);
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.speed-reset-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--c-text-muted);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
}

.speed-reset-btn:hover {
  color: var(--c-gold);
  border-color: var(--c-gold-glow);
}

.speed-presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: var(--sp-3);
}

.speed-preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  color: var(--c-text-muted);
  transition: all 0.2s ease;
}

.speed-preset-item:hover {
  background: rgba(201, 169, 110, 0.1);
  color: var(--c-gold-light);
}

.speed-preset-item.is-active {
  background: linear-gradient(135deg, var(--c-gold-deep), var(--c-gold));
  color: #fff;
  border-color: var(--c-gold);
}

.preset-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.preset-desc {
  font-size: 10px;
  opacity: 0.8;
}

.speed-slider-section {
  padding: var(--sp-2) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.speed-slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--c-text-muted);
  margin-bottom: 4px;
}

.slider-val-badge {
  color: var(--c-gold-light);
  font-weight: 600;
}

.speed-slider-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.slider-step-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: var(--c-gold-light);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed-slider-wrapper {
  flex: 1;
}

.speed-slider-input {
  width: 100%;
  accent-color: var(--c-gold);
  cursor: pointer;
}

.speed-keyboard-hint {
  font-size: 10px;
  color: var(--c-text-subtle);
  text-align: center;
  margin-top: var(--sp-2);
}

/* Timer Popover */
.timer-menu-popover {
  position: absolute;
  bottom: calc(100% + var(--sp-3));
  right: min(120px, 30vw);
  width: 220px;
  background: rgba(22, 24, 32, 0.98);
  border: 1px solid var(--c-gold-glow);
  border-radius: var(--radius-lg);
  padding: var(--sp-3);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  z-index: 1010;
}

.timer-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
  padding-bottom: var(--sp-1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.timer-menu-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  color: var(--c-gold-light);
  font-weight: 600;
}

.timer-current-badge {
  font-size: 11px;
  color: #73d13d;
}

.timer-options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timer-opt-item {
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  padding: 6px 8px;
  text-align: left;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.timer-opt-item:hover {
  background: rgba(201, 169, 110, 0.12);
  color: var(--c-gold-light);
}

.timer-opt-item.is-active {
  background: var(--c-gold-deep);
  color: #fff;
  font-weight: 600;
}

/* Playlist Drawer Popover */
.playlist-drawer {
  position: absolute;
  bottom: calc(100% + var(--sp-3));
  left: var(--sp-5);
  right: var(--sp-5);
  max-height: 360px;
  background: rgba(20, 22, 30, 0.98);
  border: 1px solid var(--c-gold-glow);
  border-radius: var(--radius-lg);
  padding: var(--sp-3) var(--sp-4);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
  z-index: 1010;
  display: flex;
  flex-direction: column;
}

.playlist-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-title-group {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.drawer-title {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-gold-light);
  font-weight: 600;
}

.drawer-count {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.drawer-close-btn {
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 14px;
}

.playlist-items-scroll {
  overflow-y: auto;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 4px;
}

.playlist-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 8px 10px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-row:hover {
  background: rgba(201, 169, 110, 0.1);
  border-color: var(--c-gold-glow);
}

.playlist-row.is-current {
  background: rgba(201, 169, 110, 0.18);
  border-color: var(--c-gold);
}

.row-num {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-gold-muted);
  width: 22px;
  text-align: center;
}

.row-text {
  flex: 1;
  min-width: 0;
}

.row-header {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: 2px;
}

.row-chapter {
  font-size: 11px;
  color: var(--c-gold-light);
  font-family: var(--font-serif);
}

.row-badge {
  font-size: 10px;
  padding: 0 4px;
  border-radius: var(--radius-sm);
}

.row-badge.badge-audio {
  background: rgba(201, 169, 110, 0.25);
  color: var(--c-gold-light);
}

.row-badge.badge-tts {
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-text-muted);
}

.row-canonical {
  font-size: var(--fs-xs);
  color: var(--c-text-main);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-status {
  color: var(--c-gold);
  font-size: 12px;
}

/* Toast */
.rate-toast-badge {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 20, 26, 0.95);
  border: 1px solid var(--c-gold);
  color: var(--c-gold-light);
  padding: 4px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  white-space: nowrap;
}

/* Settings Drawer */
.settings-drawer {
  margin-top: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.setting-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.setting-checkbox {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  cursor: pointer;
  user-select: none;
}

.setting-label {
  min-width: 70px;
}

.voice-select {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--c-text-main);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  outline: none;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px);
}

@media (max-width: 768px) {
  .audio-player-wrapper {
    width: 96vw;
    bottom: var(--sp-2);
  }

  .audio-player-bar {
    padding: var(--sp-2) var(--sp-3);
  }

  .player-info {
    flex-basis: 100%;
  }

  .current-snippet {
    max-width: 80vw;
  }

  .rate-toggles button:nth-child(1),
  .rate-toggles button:nth-child(3) {
    display: none;
  }
}
</style>
