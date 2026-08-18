<script setup lang="ts">
import { computed, ref } from 'vue'
import { speechService, type SpeechMode, type SpeechRate } from '@/services/speech'

const speechState = speechService.state
const voices = speechService.voices
const isSupported = speechService.isSupported
const showSettings = ref(false)

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

function togglePlay() {
  if (speechState.isPlaying && !speechState.isPaused) {
    speechService.pause()
  } else if (speechState.isPaused) {
    speechService.resume()
  } else {
    speechService.resume()
  }
}

function stop() {
  speechService.stop()
  showSettings.value = false
}

function prev() {
  speechService.prevPassage()
}

function next() {
  speechService.nextPassage()
}

function setRate(rate: SpeechRate) {
  speechService.setRate(rate)
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
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isSupported && hasActivePlayback" class="audio-player-bar glass-panel" role="region" aria-label="語音朗讀播放器">
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
              <span class="passage-tag">
                {{ speechState.currentMode === 'canonical' ? '📜 原文正音' : '💬 白話解義' }}
              </span>
              <span v-if="currentItem?.workTitle" class="work-title">{{ currentItem.workTitle }}</span>
              <span v-if="currentItem?.chapterTitle" class="chapter-title">{{ currentItem.chapterTitle }}</span>
              <span v-if="totalPassages > 1" class="counter">
                第 {{ currentPassageNumber }} / {{ totalPassages }} 段
              </span>
            </div>
            <p class="current-snippet" :title="speechState.currentText">
              {{ speechState.currentText.slice(0, 42) }}{{ speechState.currentText.length > 42 ? '…' : '' }}
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
            :title="speechState.isPlaying && !speechState.isPaused ? '暫停朗讀' : '繼續朗讀'"
            :aria-label="speechState.isPlaying && !speechState.isPaused ? '暫停朗讀' : '繼續朗讀'"
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
            title="停止朗讀"
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
              @click="setMode('canonical')"
            >
              原文
            </button>
            <button
              class="opt-btn"
              :class="{ 'is-active': speechState.currentMode === 'vernacular' }"
              @click="setMode('vernacular')"
            >
              白話
            </button>
          </div>

          <div class="rate-toggles">
            <button
              class="rate-btn"
              :class="{ 'is-active': speechState.currentRate === 0.8 }"
              title="0.8倍速 (沉浸)"
              @click="setRate(0.8)"
            >
              0.8x
            </button>
            <button
              class="rate-btn"
              :class="{ 'is-active': speechState.currentRate === 1.0 }"
              title="1.0倍速 (標準)"
              @click="setRate(1.0)"
            >
              1.0x
            </button>
            <button
              class="rate-btn"
              :class="{ 'is-active': speechState.currentRate === 1.2 }"
              title="1.2倍速 (速聽)"
              @click="setRate(1.2)"
            >
              1.2x
            </button>
          </div>

          <button
            class="settings-toggle-btn"
            :class="{ 'is-open': showSettings }"
            title="語音設定"
            @click="showSettings = !showSettings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <!-- Extended Settings Drawer -->
      <div v-if="showSettings" class="settings-drawer">
        <div class="setting-row">
          <label for="voice-select" class="setting-label">朗讀音色：</label>
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
            <span>朗讀時自動滾動至對應段落</span>
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
  background: rgba(18, 20, 26, 0.92);
  backdrop-filter: blur(16px);
  border: 1px solid var(--c-gold-glow);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.48), 0 0 20px rgba(201, 169, 110, 0.15);
  transition: all var(--duration-normal) var(--ease-out);
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

/* Wave animation */
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
}
</style>
