import { ref, reactive } from 'vue'

export type SpeechMode = 'canonical' | 'vernacular'
export type SpeechRate = 0.8 | 1.0 | 1.2

export interface SpeechPlaylistItem {
  passageId: string
  chapterId: string
  canonicalText: string
  vernacularText?: string
  chapterTitle?: string
  workTitle?: string
}

export interface SpeechState {
  isPlaying: boolean
  isPaused: boolean
  currentPassageId: string | null
  currentText: string
  currentMode: SpeechMode
  currentRate: SpeechRate
  selectedVoiceURI: string
  playlist: SpeechPlaylistItem[]
  playlistIndex: number
  isAutoScroll: boolean
}

class SpeechService {
  public state = reactive<SpeechState>({
    isPlaying: false,
    isPaused: false,
    currentPassageId: null,
    currentText: '',
    currentMode: 'canonical',
    currentRate: 1.0,
    selectedVoiceURI: '',
    playlist: [],
    playlistIndex: -1,
    isAutoScroll: true,
  })

  public voices = ref<SpeechSynthesisVoice[]>([])
  public isSupported = ref(false)

  private synth: SpeechSynthesis | null = null
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private keepAliveTimer: any = null
  private unlockAudioBound = false

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.isSupported.value = true
      this.initVoices()
      this.initUnlockListener()
    }
  }

  private initVoices() {
    if (!this.synth) return

    const updateVoices = () => {
      const allVoices = this.synth!.getVoices()
      // Prioritize Chinese voices: zh-TW, zh-HK, zh-CN, cmn, etc.
      const chineseVoices = allVoices.filter(v => 
        v.lang.toLowerCase().includes('zh') || 
        v.lang.toLowerCase().includes('cmn') ||
        v.lang.toLowerCase().includes('yue')
      )
      
      this.voices.value = chineseVoices.length > 0 ? chineseVoices : allVoices

      // Auto-select preferred default voice (prioritizing zh-TW, then zh-HK, zh-CN, or first available)
      if (!this.state.selectedVoiceURI && this.voices.value.length > 0) {
        const preferred = 
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-tw')) ||
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-hk')) ||
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-cn')) ||
          this.voices.value[0]
        
        if (preferred) {
          this.state.selectedVoiceURI = preferred.voiceURI
        }
      }
    }

    updateVoices()
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices
    }
  }

  private initUnlockListener() {
    if (typeof window === 'undefined' || this.unlockAudioBound) return
    this.unlockAudioBound = true

    const unlockHandler = () => {
      if (this.synth && this.synth.paused) {
        this.synth.resume()
      }
      window.removeEventListener('click', unlockHandler)
      window.removeEventListener('touchstart', unlockHandler)
    }

    window.addEventListener('click', unlockHandler, { once: true })
    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true })
  }

  /**
   * 古文正音與朗讀字詞優化：
   * 移除可能導致 TTS 破音的特殊標記，保持標點停頓節奏
   */
  public sanitizeText(text: string): string {
    if (!text) return ''
    return text
      .replace(/\[\d+\]/g, '') // 去除註腳標記
      .replace(/【[^】]+】/g, '') // 去除小標題括號
      .replace(/〔[^〕]+〕/g, '')
      .replace(/（[^）]+）/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * 朗讀特定段落（一段對應一段）
   */
  public speakPassage(
    passageId: string,
    text: string,
    mode: SpeechMode = 'canonical',
    extra?: { chapterTitle?: string; workTitle?: string; vernacularText?: string; canonicalText?: string }
  ) {
    if (!this.synth || !this.isSupported.value) {
      console.warn('SpeechSynthesis is not supported in this environment.')
      return
    }

    // If currently playing the EXACT same passage & mode, toggle pause/play
    if (this.state.isPlaying && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.pause()
      return
    }

    if (this.state.isPaused && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.resume()
      return
    }

    // Cancel existing playback
    this.stop()

    const sanitized = this.sanitizeText(text)
    if (!sanitized) return

    this.state.currentPassageId = passageId
    this.state.currentText = sanitized
    this.state.currentMode = mode
    this.state.isPlaying = true
    this.state.isPaused = false

    // If item exists in playlist, update index
    const playlistIdx = this.state.playlist.findIndex(item => item.passageId === passageId)
    if (playlistIdx !== -1) {
      this.state.playlistIndex = playlistIdx
    } else if (extra) {
      // Set standalone item
      this.state.playlist = [{
        passageId,
        chapterId: '',
        canonicalText: extra.canonicalText || text,
        vernacularText: extra.vernacularText || (mode === 'vernacular' ? text : undefined),
        chapterTitle: extra.chapterTitle,
        workTitle: extra.workTitle,
      }]
      this.state.playlistIndex = 0
    }

    this.speakUtterance(sanitized, () => {
      this.onPassageFinished()
    })

    if (this.state.isAutoScroll) {
      this.scrollToPassage(passageId)
    }
  }

  /**
   * 開啟全章逐段連播（一段接一段）
   */
  public startChapterPlayback(
    playlist: SpeechPlaylistItem[],
    mode: SpeechMode = 'canonical',
    startIndex: number = 0
  ) {
    if (!playlist || playlist.length === 0) return
    this.stop()

    this.state.playlist = playlist
    this.state.currentMode = mode
    this.state.playlistIndex = Math.max(0, Math.min(startIndex, playlist.length - 1))

    this.playCurrentPlaylistItem()
  }

  private playCurrentPlaylistItem() {
    if (this.state.playlistIndex < 0 || this.state.playlistIndex >= this.state.playlist.length) {
      this.stop()
      return
    }

    const item = this.state.playlist[this.state.playlistIndex]
    const textToRead = this.state.currentMode === 'vernacular'
      ? (item.vernacularText || item.canonicalText)
      : item.canonicalText

    this.speakPassage(item.passageId, textToRead, this.state.currentMode)
  }

  private speakUtterance(text: string, onEnd: () => void) {
    if (!this.synth) return

    // Cancel prior synthesis queue
    this.synth.cancel()
    this.clearKeepAlive()

    const utterance = new SpeechSynthesisUtterance(text)
    this.activeUtterance = utterance

    // Set voice
    if (this.state.selectedVoiceURI && this.voices.value.length > 0) {
      const chosen = this.voices.value.find(v => v.voiceURI === this.state.selectedVoiceURI)
      if (chosen) {
        utterance.voice = chosen
        utterance.lang = chosen.lang
      }
    } else {
      utterance.lang = 'zh-TW'
    }

    utterance.rate = this.state.currentRate
    utterance.pitch = 1.0

    utterance.onstart = () => {
      this.state.isPlaying = true
      this.state.isPaused = false
      this.startKeepAlive()
    }

    utterance.onend = () => {
      this.clearKeepAlive()
      this.activeUtterance = null
      onEnd()
    }

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e)
      this.clearKeepAlive()
      this.activeUtterance = null
      // Do not hard-crash playlist on interrupted errors
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        this.onPassageFinished()
      }
    }

    this.synth.speak(utterance)
  }

  private onPassageFinished() {
    // Check if we are in chapter playlist mode and have next items
    if (this.state.playlist.length > 0 && this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      // Give a pleasant, natural 600ms breath pause between classical paragraphs
      setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 600)
    } else {
      // Completed all
      this.state.isPlaying = false
      this.state.isPaused = false
      this.state.currentPassageId = null
      this.clearKeepAlive()
    }
  }

  public nextPassage() {
    if (this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      this.playCurrentPlaylistItem()
    }
  }

  public prevPassage() {
    if (this.state.playlistIndex > 0) {
      this.state.playlistIndex--
      this.playCurrentPlaylistItem()
    }
  }

  public pause() {
    if (!this.synth) return
    if (this.state.isPlaying && !this.state.isPaused) {
      this.synth.pause()
      this.state.isPaused = true
      this.clearKeepAlive()
    }
  }

  public resume() {
    if (!this.synth) return
    if (this.state.isPaused) {
      this.synth.resume()
      this.state.isPaused = false
      this.state.isPlaying = true
      this.startKeepAlive()
    } else if (!this.state.isPlaying && this.state.playlist.length > 0) {
      this.playCurrentPlaylistItem()
    }
  }

  public stop() {
    if (!this.synth) return
    this.clearKeepAlive()
    this.synth.cancel()
    this.state.isPlaying = false
    this.state.isPaused = false
    this.state.currentPassageId = null
    this.activeUtterance = null
  }

  public setRate(rate: SpeechRate) {
    this.state.currentRate = rate
    // If currently playing, restart current paragraph with new speed smoothly
    if (this.state.isPlaying && !this.state.isPaused) {
      this.playCurrentPlaylistItem()
    }
  }

  public setMode(mode: SpeechMode) {
    if (this.state.currentMode === mode) return
    this.state.currentMode = mode
    if (this.state.isPlaying) {
      this.playCurrentPlaylistItem()
    }
  }

  public setVoice(voiceURI: string) {
    this.state.selectedVoiceURI = voiceURI
    if (this.state.isPlaying && !this.state.isPaused) {
      this.playCurrentPlaylistItem()
    }
  }

  public toggleAutoScroll() {
    this.state.isAutoScroll = !this.state.isAutoScroll
  }

  private scrollToPassage(passageId: string) {
    if (typeof document === 'undefined') return
    requestAnimationFrame(() => {
      const el = document.getElementById(`passage-${passageId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  /**
   * Chrome & Edge TTS Watchdog Timer:
   * Chrome has a known browser bug where SpeechSynthesis pauses automatically after ~14 seconds.
   * Periodically calling resume keeps long paragraph recitation uninterrupted.
   */
  private startKeepAlive() {
    this.clearKeepAlive()
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.state.isPlaying && !this.state.isPaused) {
        this.synth.pause()
        this.synth.resume()
      }
    }, 10000)
  }

  private clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer)
      this.keepAliveTimer = null
    }
  }
}

export const speechService = new SpeechService()
