<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { speechService, SPEED_PRESETS, type SpeechMode, type SpeechRate } from '@/services/speech'

const speechState = speechService.state
const voices = speechService.voices
const isSupported = speechService.isSupported
const showSettings = ref(false)
const showSpeedMenu = ref(false)
const rateToast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const hasActivePlayback = computed(() => {
  return speechState.isPlaying || speechState.isPaused || speechState.currentPassageId !== null
})

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
}

function prev() {
  speechService.prevPassage()
}

function next() {
  speechService.nextPassage()
}

function showRateToast(text: string) {
  rateToast.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    rateToast.value = null
  }, 1200)
}

function setRate(rate: SpeechRate) {
  speechService.setRate(rate)
  showRateToast(`${Number(rate.toFixed(2))}x`)
}

function changeRateDelta(delta: number) {
  const nextRate = Math.max(0.5, Math.min(2.5, Math.round((speechState.currentRate + delta) * 100) / 100))
  speechService.setRate(nextRate)
  showRateToast(`${nextRate}x`)
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
  }
}

function toggleSettings() {
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    showSpeedMenu.value = false
  }
}

function setMode(mode: SpeechMode) {
  speechService.setMode(mode)
}

function onVoiceChange(e: Event) {
  const target = e.target as HTMLSelectElement
  if (target && target.value) {
    speechService.setVoice(target.value)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (!hasActivePlayback.value) return
  // Don't intercept when typing in inputs
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
    showRateToast('1.0x')
  } else if (e.code === 'Escape') {
    if (showSpeedMenu.value) {
      showSpeedMenu.value = false
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
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('click', handleDocumentClick)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isSupported && hasActivePlayback"
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
                {{ speechState.audioSourceType === 'file' ? '🎙️ 名家音檔' : '🔊 智能正音' }}
              </span>

              <span class="passage-tag">
                {{ speechState.currentMode === 'canonical' ? '📜 原文' : '💬 白話' }}
              </span>

              <span v-if="currentItem?.workTitle" class="work-title">{{ currentItem.workTitle }}</span>
              <span v-if="currentItem?.chapterTitle" class="chapter-title">{{ currentItem.chapterTitle }}</span>
              <span v-if="totalPassages > 1" class="counter">
                第 {{ currentPassageNumber }} / {{ totalPassages }} 段
              </span>
            </div>
            <p class="current-snippet" :title="speechState.currentText">
              {{ speechState.currentText.slice(0, 36) }}{{ speechState.currentText.length > 36 ? '…' : '' }}
            </p>
          </div>
        </div>

        <!-- Controls section -->
        <div class="player-controls">
          <button
            v-if="totalPassages > 1"
            class="ctrl-btn btn-ghost"
            :disabled="speechState.playlistIndex <= 0"
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
            <span v-if="speechState.isPlaying && !speechState.isPaused">⏸</span>
            <span v-else>▶</span>
          </button>

          <button
            v-if="totalPassages > 1"
            class="ctrl-btn btn-ghost"
            :disabled="speechState.playlistIndex >= totalPassages - 1"
            title="下一段"
            aria-label="下一段"
            @click="next"
          >
            ⏭
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

        <!-- Mode & Options -->
        <div class="player-options">
          <div class="mode-toggles">
            <button
              class="opt-btn"
              :class="{ 'is-active': speechState.currentMode === 'canonical' }"
              title="切換為文言原文誦讀"
              @click="setMode('canonical')"
            >
              原文
            </button>
            <button
              class="opt-btn"
              :class="{ 'is-active': speechState.currentMode === 'vernacular' }"
              title="切換為白話意譯朗讀"
              @click="setMode('vernacular')"
            >
              白話
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
              <span v-else>⏱️ ▾</span>
            </button>
          </div>

          <button
            class="settings-toggle-btn"
            :class="{ 'is-open': showSettings }"
            title="語音詳細設定"
            @click="toggleSettings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <!-- Speed Menu Popover -->
      <Transition name="fade-slide">
        <div v-if="showSpeedMenu" class="speed-menu-popover glass-panel" @click.stop>
          <div class="speed-menu-header">
            <div class="speed-menu-title-group">
              <span class="speed-menu-icon">⏱️</span>
              <span class="speed-menu-title">誦讀倍速控制</span>
            </div>
            <button class="speed-reset-btn" @click="setRate(1.0)" title="恢復 1.0x 標準常速 (快捷鍵 0)">
              恢復 1.0x
            </button>
          </div>

          <!-- Presets grid with classical rhythm annotations -->
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

      <!-- Rate Toast Notification -->
      <Transition name="toast-fade">
        <div v-if="rateToast" class="rate-toast-badge">
          ⚡ 誦讀倍速：{{ rateToast }}
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
  </Transition>
</template>

<style scoped>
.audio-player-bar {
  position: fixed;
  bottom: var(--sp-4);
  left: 50%;
  transform: translateX(-50%);
  width: min(94vw, 56rem);
  z-index: 1000;
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
  gap: var(--sp-4);
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

.bar {
  width: 3px;
  height: 4px;
  background: var(--c-gold);
  border-radius: 2px;
  transition: height 0.2s ease;
}

.wave-indicator.is-active .bar-1 {
  animation: wave 1.2s infinite ease-in-out;
}
.wave-indicator.is-active .bar-2 {
  animation: wave 1.2s infinite ease-in-out 0.2s;
}
.wave-indicator.is-active .bar-3 {
  animation: wave 1.2s infinite ease-in-out 0.4s;
}
.wave-indicator.is-active .bar-4 {
  animation: wave 1.2s infinite ease-in-out 0.1s;
}

@keyframes wave {
  0%, 100% { height: 4px; opacity: 0.6; }
  50% { height: 18px; opacity: 1; }
}

.info-text {
  min-width: 0;
  flex: 1;
}

.info-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
  flex-wrap: wrap;
}

.source-badge {
  font-size: 0.68rem;
  font-weight: var(--fw-semibold);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.source-badge.is-file {
  color: #fff;
  background: linear-gradient(135deg, #a87932, #c9a96e);
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.4);
}

.source-badge.is-tts {
  color: var(--c-text-secondary);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--c-border-subtle);
}

.passage-tag {
  color: var(--c-gold);
  font-weight: var(--fw-semibold);
  background: rgba(201, 169, 110, 0.15);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.work-title, .chapter-title {
  color: var(--c-text-primary);
  font-weight: var(--fw-medium);
}

.counter {
  color: var(--c-gold-light);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
}

.current-snippet {
  margin: 2px 0 0;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Controls */
.player-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-primary);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.ctrl-btn:hover:not(:disabled) {
  background: rgba(201, 169, 110, 0.2);
  border-color: var(--c-gold);
  color: var(--c-gold-light);
}

.ctrl-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.play-btn {
  width: 40px;
  height: 40px;
  background: var(--c-gold);
  color: #12141a;
  border: none;
  font-weight: bold;
  font-size: var(--fs-base);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.4);
}

.play-btn:hover {
  background: var(--c-gold-light);
  transform: scale(1.05);
}

/* Options */
.player-options {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.mode-toggles, .rate-toggles {
  display: flex;
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.opt-btn, .rate-btn {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
  padding: 4px 8px;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.opt-btn.is-active, .rate-btn.is-active {
  background: var(--c-gold);
  color: #12141a;
  font-weight: var(--fw-semibold);
}

.rate-more-btn {
  font-weight: var(--fw-semibold);
  font-family: var(--font-sans);
}

/* Speed Menu Popover */
.speed-menu-popover {
  position: absolute;
  bottom: calc(100% + 14px);
  right: var(--sp-4);
  width: min(92vw, 320px);
  padding: var(--sp-4);
  background: rgba(18, 20, 26, 0.96);
  backdrop-filter: blur(24px);
  border: 1px solid var(--c-gold-glow);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), 0 0 24px rgba(201, 169, 110, 0.22);
  border-radius: var(--radius-lg);
  z-index: 1010;
}

.speed-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed rgba(201, 169, 110, 0.2);
}

.speed-menu-title-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.speed-menu-icon {
  font-size: var(--fs-sm);
}

.speed-menu-title {
  font-family: var(--font-serif);
  font-size: var(--fs-sm);
  color: var(--c-gold-light);
  font-weight: var(--fw-semibold);
}

.speed-reset-btn {
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.speed-reset-btn:hover {
  background: rgba(201, 169, 110, 0.2);
  border-color: var(--c-gold);
  color: var(--c-gold-light);
}

/* Presets Grid */
.speed-presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: var(--sp-3) 0;
}

.speed-preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 2px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.04);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.speed-preset-item:hover {
  border-color: var(--c-gold);
  color: var(--c-gold-light);
  background: rgba(201, 169, 110, 0.15);
}

.speed-preset-item.is-active {
  background: var(--c-gold);
  color: #12141a;
  border-color: var(--c-gold);
  font-weight: var(--fw-bold);
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.4);
}

.speed-preset-item.is-active .preset-desc {
  color: #12141a;
  opacity: 0.9;
}

.preset-label {
  font-size: var(--fs-xs);
  font-family: var(--font-sans);
  font-weight: var(--fw-semibold);
}

.preset-desc {
  font-size: 0.65rem;
  color: var(--c-text-muted);
  margin-top: 1px;
}

/* Slider Section */
.speed-slider-section {
  padding-top: var(--sp-2);
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.speed-slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.slider-hint {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.slider-val-badge {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--c-gold);
  background: rgba(201, 169, 110, 0.12);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-gold-glow);
}

.speed-slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slider-step-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--c-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--fs-xs);
  font-weight: bold;
  transition: all var(--duration-fast);
}

.slider-step-btn:hover {
  background: var(--c-gold);
  color: #12141a;
  border-color: var(--c-gold);
}

.speed-slider-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.speed-slider-input {
  width: 100%;
  accent-color: var(--c-gold);
  cursor: pointer;
  height: 4px;
}

.speed-keyboard-hint {
  margin-top: var(--sp-3);
  padding-top: var(--sp-2);
  border-top: 1px dashed rgba(255, 255, 255, 0.06);
  font-size: 0.68rem;
  color: var(--c-text-muted);
  text-align: center;
}

.speed-keyboard-hint code {
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-gold-light);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
}

/* Rate Toast Badge */
.rate-toast-badge {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(18, 20, 26, 0.95);
  border: 1px solid var(--c-gold);
  color: var(--c-gold-light);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  font-family: var(--font-sans);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6), 0 0 14px rgba(201, 169, 110, 0.35);
  pointer-events: none;
  z-index: 1020;
}

/* Popover & Toast Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
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

.settings-toggle-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--fs-base);
  opacity: 0.75;
  padding: 4px;
  transition: opacity var(--duration-fast);
}

.settings-toggle-btn:hover, .settings-toggle-btn.is-open {
  opacity: 1;
}

/* Settings drawer */
.settings-drawer {
  margin-top: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px dashed var(--c-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
}

.setting-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.setting-label {
  color: var(--c-text-muted);
}

.voice-select {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--c-border-subtle);
  color: var(--c-text-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  outline: none;
}

.voice-select:focus {
  border-color: var(--c-gold);
}

.setting-checkbox {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-text-secondary);
  cursor: pointer;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 640px) {
  .audio-player-bar {
    bottom: var(--sp-2);
    width: 96vw;
    padding: var(--sp-2) var(--sp-3);
  }
  .player-options {
    width: 100%;
    justify-content: space-between;
  }
  .speed-menu-popover {
    right: 0;
    left: 0;
    margin: 0 auto;
    width: calc(100% - 16px);
  }
}
</style>
