import { ref, reactive } from 'vue'
import { getAudioFileUrl, getAudioFileMeta } from '@/data/audioManifest'

export type SpeechMode = 'canonical' | 'vernacular' | 'bilingual'
export type SpeechRate = 0.5 | 0.75 | 0.8 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | number
export type AudioSourceType = 'file' | 'tts'
export type PlaybackMode = 'sequential' | 'loop-single' | 'loop-all'
export type SleepTimerOption = 0 | 15 | 30 | 45 | 'end-of-chapter'

export interface SpeedPreset {
  rate: number
  label: string
  desc: string
}

export const SPEED_PRESETS: SpeedPreset[] = [
  { rate: 0.5, label: '0.5x', desc: '慢吟審音' },
  { rate: 0.75, label: '0.75x', desc: '雅正涵泳' },
  { rate: 1.0, label: '1.0x', desc: '常速研習' },
  { rate: 1.25, label: '1.25x', desc: '流暢通讀' },
  { rate: 1.5, label: '1.5x', desc: '敏捷複習' },
  { rate: 2.0, label: '2.0x', desc: '極速檢索' },
]

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
  playbackMode: PlaybackMode
  sleepTimer: SleepTimerOption
  sleepTimerRemainingSeconds: number
  bilingualPhase: 'canonical' | 'vernacular' | null
  isCollapsed: boolean
  isPlaylistDrawerOpen: boolean
  // 高品質實體音檔擴充狀態
  audioSourceType: AudioSourceType
  audioFileAvailable: boolean
  currentTime: number
  duration: number
  bufferedPercent: number
  preferAudioFiles: boolean
}

// 先秦經典音韻校勘辭典（通假字、破音字TTS校正）
const CLASSICAL_TTS_CORRECTIONS: [RegExp, string][] = [
  [/不亦說乎/g, '不亦悅乎'],
  [/秦伯說/g, '秦伯悅'],
  [/民說之/g, '民悅之'],
  [/禮樂/g, '禮嶽'],
  [/處眾人之所惡/g, '處眾人之所務'],
  [/好惡/g, '好務'],
  [/以觀其徼/g, '以觀其叫'],
  [/圖窮而匕首見/g, '圖窮而匕首現'],
  [/風吹草低見牛羊/g, '風吹草低現牛羊'],
  [/北冥有魚/g, '北溟有魚'],
  [/朝聞道/g, '昭聞道'],
  [/發而皆中節/g, '發而皆仲節'],
  [/道千乘之國/g, '道千盛之國'],
  [/萬乘之國/g, '萬盛之國'],
  [/百乘之家/g, '百盛之家'],
  [/為政以德/g, '圍政以德'],
  [/十有五/g, '十又五'],
  [/誨女知之乎/g, '誨汝知之乎'],
  [/女為君子儒/g, '汝為君子儒'],
  [/逝者如斯夫/g, '逝者如斯符'],
  [/其正色邪/g, '其正色耶'],
  [/三飡而反/g, '三飡而返'],
  [/知者樂水/g, '智者要水'],
  [/仁者樂山/g, '仁者要山'],
  [/知者不惑/g, '智者不惑'],
  [/反聽之謂聰/g, '返聽之謂聰'],
  [/便佞/g, '駢佞'],
  [/人不知而不慍/g, '人不知而不運'],
  [/孝弟也者/g, '孝悌也者'],
  [/出則弟/g, '出則悌'],
  [/苟志於仁矣，無惡也/g, '苟志於仁矣，無務也'],
  [/暴虎馮河/g, '暴虎憑河'],
  [/過則勿憚改/g, '過則勿旦改'],
  [/無友不如己者/g, '毋友不如己者'],
  [/數仞之牆/g, '樹仞之牆'],
  [/數罟不入洿池/g, '促罟不入洿池'],
  [/其徐如林/g, '其徐如林'],
  [/天下為公/g, '天下圍公'],
  [/得道者多助/g, '得道者多助'],
]

const initialSavedRate = typeof localStorage !== 'undefined'
  ? parseFloat(localStorage.getItem('litc-speech-rate') || '1.0')
  : 1.0

class SpeechService {
  public state = reactive<SpeechState>({
    isPlaying: false,
    isPaused: false,
    currentPassageId: null,
    currentText: '',
    currentMode: 'canonical',
    currentRate: isNaN(initialSavedRate) ? 1.0 : Math.max(0.5, Math.min(2.5, initialSavedRate)),
    selectedVoiceURI: '',
    playlist: [],
    playlistIndex: -1,
    isAutoScroll: true,
    playbackMode: 'sequential',
    sleepTimer: 0,
    sleepTimerRemainingSeconds: 0,
    bilingualPhase: null,
    isCollapsed: false,
    isPlaylistDrawerOpen: false,
    audioSourceType: 'tts',
    audioFileAvailable: false,
    currentTime: 0,
    duration: 0,
    bufferedPercent: 0,
    preferAudioFiles: true,
  })

  public voices = ref<SpeechSynthesisVoice[]>([])
  public isSupported = ref(false)

  private synth: SpeechSynthesis | null = null
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private audioElement: HTMLAudioElement | null = null
  private prefetchAudio: HTMLAudioElement | null = null
  private prefetchedIndex = -1
  private keepAliveTimer: any = null
  private transitionTimer: any = null
  private sleepIntervalTimer: any = null
  private unlockAudioBound = false

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis
        this.isSupported.value = true
        this.initVoices()
        this.initUnlockListener()
      }
      this.initAudioElement()
      this.initMediaSession()
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return
    this.audioElement = new Audio()
    this.audioElement.preload = 'metadata'

    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.audioElement) return
      this.state.currentTime = this.audioElement.currentTime
      if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
        this.state.duration = this.audioElement.duration
        if (this.state.currentTime / this.audioElement.duration > 0.8) {
          this.preloadNextPlaylistItem()
        }
      }
      this.updateMediaSessionPosition()
    })

    this.audioElement.addEventListener('progress', () => {
      if (!this.audioElement || !this.audioElement.buffered.length || !this.audioElement.duration) return
      try {
        const bufferedEnd = this.audioElement.buffered.end(this.audioElement.buffered.length - 1)
        this.state.bufferedPercent = Math.min(100, Math.round((bufferedEnd / this.audioElement.duration) * 100))
      } catch {
        // ignore buffer errors
      }
    })

    this.audioElement.addEventListener('ended', () => {
      // 雙語模式下，如果剛播完原文，接著播白話
      if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
        this.playBilingualVernacularPhase()
      } else {
        this.onPassageFinished()
      }
    })

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio element error, falling back to TTS:', e)
      if (this.state.isPlaying) {
        this.state.audioSourceType = 'tts'
        this.speakUtterance(this.state.currentText, () => {
          if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
            this.playBilingualVernacularPhase()
          } else {
            this.onPassageFinished()
          }
        })
      }
    })
  }

  private initVoices() {
    if (!this.synth) return

    const updateVoices = () => {
      const allVoices = this.synth!.getVoices()
      const chineseVoices = allVoices.filter(v =>
        v.lang.toLowerCase().includes('zh') ||
        v.lang.toLowerCase().includes('cmn') ||
        v.lang.toLowerCase().includes('yue')
      )

      this.voices.value = chineseVoices.length > 0 ? chineseVoices : allVoices

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
      if (this.audioElement) {
        this.audioElement.load()
      }
      window.removeEventListener('click', unlockHandler)
      window.removeEventListener('touchstart', unlockHandler)
    }

    window.addEventListener('click', unlockHandler, { once: true })
    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true })
  }

  private initMediaSession() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.setActionHandler('play', () => this.resume())
      navigator.mediaSession.setActionHandler('pause', () => this.pause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevPassage())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextPassage())
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime)
        }
      })
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const delta = details.seekOffset || 5
        this.seek(Math.max(0, this.state.currentTime - delta))
      })
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const delta = details.seekOffset || 5
        this.seek(Math.min(this.state.duration, this.state.currentTime + delta))
      })
      navigator.mediaSession.setActionHandler('stop', () => this.stop())
    } catch (e) {
      console.warn('Failed to register MediaSession handlers', e)
    }
  }

  private updateMediaSession() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return
    try {
      const item = this.getCurrentPlaylistItem()
      const titlePrefix = item?.chapterTitle ? `${item.chapterTitle} · ` : ''
      const modeTag = this.state.currentMode === 'canonical' ? '【原文】' : (this.state.currentMode === 'vernacular' ? '【白話】' : '【文白對照】')
      const snippet = this.state.currentText.slice(0, 36) || '經典研習'
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${modeTag} ${titlePrefix}${snippet}`,
        artist: item?.workTitle || '經典文脈 ClassicFlow',
        album: '先秦諸子古典有聲經庫',
        artwork: [
          { src: `${import.meta.env.BASE_URL || '/'}favicon.svg`, sizes: '192x192', type: 'image/svg+xml' },
        ],
      })
      this.updateMediaSessionPlaybackState()
    } catch {
      // ignore
    }
  }

  private updateMediaSessionPlaybackState() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    try {
      if (this.state.isPlaying && !this.state.isPaused) {
        navigator.mediaSession.playbackState = 'playing'
      } else if (this.state.isPaused) {
        navigator.mediaSession.playbackState = 'paused'
      } else {
        navigator.mediaSession.playbackState = 'none'
      }
    } catch {
      // ignore
    }
  }

  private updateMediaSessionPosition() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return
    if (this.state.duration > 0 && !isNaN(this.state.duration)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: this.state.duration,
          playbackRate: this.state.currentRate,
          position: Math.min(this.state.currentTime, this.state.duration),
        })
      } catch {
        // ignore
      }
    }
  }

  /**
   * 古文正音與朗讀字詞優化：去除註腳標號，並針對古音通假破讀進行語音校正
   */
  public sanitizeText(text: string): string {
    if (!text) return ''
    let cleaned = text
      .replace(/\[\d+\]/g, '')
      .replace(/【[^】]+】/g, '')
      .replace(/〔[^〕]+〕/g, '')
      .replace(/（[^）]+）/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    for (const [regex, replacement] of CLASSICAL_TTS_CORRECTIONS) {
      cleaned = cleaned.replace(regex, replacement)
    }
    return cleaned
  }

  public hasAudioFile(passageId: string): boolean {
    return !!getAudioFileMeta(passageId)
  }

  public getCurrentPlaylistItem(): SpeechPlaylistItem | null {
    if (this.state.playlistIndex >= 0 && this.state.playlistIndex < this.state.playlist.length) {
      return this.state.playlist[this.state.playlistIndex]
    }
    return null
  }

  /**
   * 朗讀特定段落（一段對應一段，優先播放高品質實體音檔）
   */
  public speakPassage(
    passageId: string,
    text: string,
    mode: SpeechMode = 'canonical',
    extra?: { chapterTitle?: string; workTitle?: string; vernacularText?: string; canonicalText?: string }
  ) {
    if (this.state.isPlaying && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.pause()
      return
    }

    if (this.state.isPaused && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.resume()
      return
    }

    this.stop()

    const sanitized = this.sanitizeText(text)
    if (!sanitized) return

    this.state.currentPassageId = passageId
    this.state.currentText = sanitized
    this.state.currentMode = mode
    this.state.isPlaying = true
    this.state.isPaused = false
    this.state.currentTime = 0
    this.state.duration = 0
    this.state.bilingualPhase = mode === 'bilingual' ? 'canonical' : null

    // 更新或建置播放清單項目
    const playlistIdx = this.state.playlist.findIndex(item => item.passageId === passageId)
    if (playlistIdx !== -1) {
      this.state.playlistIndex = playlistIdx
    } else {
      this.state.playlist = [{
        passageId,
        chapterId: '',
        canonicalText: extra?.canonicalText || text,
        vernacularText: extra?.vernacularText || (mode === 'vernacular' ? text : undefined),
        chapterTitle: extra?.chapterTitle,
        workTitle: extra?.workTitle,
      }]
      this.state.playlistIndex = 0
    }

    // 播放邏輯
    const currentItem = this.getCurrentPlaylistItem()
    const playCanonical = mode === 'canonical' || mode === 'bilingual'
    const audioUrl = playCanonical ? getAudioFileUrl(passageId) : undefined
    const audioMeta = playCanonical ? getAudioFileMeta(passageId) : undefined

    if (this.state.preferAudioFiles && audioUrl && this.audioElement && playCanonical) {
      this.state.audioSourceType = 'file'
      this.state.audioFileAvailable = true
      if (audioMeta) {
        this.state.duration = audioMeta.duration
      }
      this.playViaAudioElement(audioUrl)
    } else {
      this.state.audioSourceType = 'tts'
      this.state.audioFileAvailable = !!audioUrl
      this.speakUtterance(sanitized, () => {
        if (mode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
          this.playBilingualVernacularPhase()
        } else {
          this.onPassageFinished()
        }
      })
    }

    this.updateMediaSession()

    if (this.state.isAutoScroll) {
      this.scrollToPassage(passageId)
    }
  }

  /**
   * 文白對照雙語導讀階段 2：朗讀白話釋義
   */
  private playBilingualVernacularPhase() {
    const item = this.getCurrentPlaylistItem()
    if (!item || !item.vernacularText) {
      this.state.bilingualPhase = null
      this.onPassageFinished()
      return
    }

    this.state.bilingualPhase = 'vernacular'
    const sanitizedVernacular = this.sanitizeText(item.vernacularText)
    this.state.currentText = `【白話釋義】${sanitizedVernacular}`
    this.state.audioSourceType = 'tts'
    this.state.currentTime = 0
    this.state.duration = 0

    this.updateMediaSession()

    // 留白 600ms，讓使用者沉澱原文韻味後再聽白話
    this.transitionTimer = setTimeout(() => {
      if (this.state.isPlaying && !this.state.isPaused) {
        this.speakUtterance(`白話釋義：${sanitizedVernacular}`, () => {
          this.state.bilingualPhase = null
          this.onPassageFinished()
        })
      }
    }, 600)
  }

  private playViaAudioElement(url: string) {
    if (!this.audioElement) return
    this.audioElement.pause()
    this.audioElement.currentTime = 0
    this.audioElement.src = url
    this.audioElement.playbackRate = this.state.currentRate
    this.audioElement.play().catch(err => {
      console.warn('Audio play failed, fallback to TTS:', err)
      this.state.audioSourceType = 'tts'
      this.speakUtterance(this.state.currentText, () => {
        if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
          this.playBilingualVernacularPhase()
        } else {
          this.onPassageFinished()
        }
      })
    })
  }

  /**
   * 開啟全章逐段連播
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

  /**
   * 啟動知識網絡主題廣播（連續欣賞各知識點之名言與智慧）
   */
  public startKnowledgeRadio(
    items: SpeechPlaylistItem[],
    mode: SpeechMode = 'canonical'
  ) {
    if (!items || items.length === 0) return
    this.startChapterPlayback(items, mode, 0)
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

    this.speakPassage(item.passageId, textToRead, this.state.currentMode, {
      chapterTitle: item.chapterTitle,
      workTitle: item.workTitle,
      canonicalText: item.canonicalText,
      vernacularText: item.vernacularText,
    })
  }

  private speakUtterance(text: string, onEnd: () => void) {
    if (!this.synth) return

    this.synth.cancel()
    this.clearKeepAlive()

    const utterance = new SpeechSynthesisUtterance(text)
    this.activeUtterance = utterance

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
      this.updateMediaSessionPlaybackState()
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
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        this.onPassageFinished()
      }
    }

    this.synth.speak(utterance)
  }

  private onPassageFinished() {
    // 1. 單段涵泳（單曲循環）
    if (this.state.playbackMode === 'loop-single') {
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 700)
      return
    }

    // 2. 播完當前篇章定時結束檢查
    if (this.state.sleepTimer === 'end-of-chapter' && this.state.playlistIndex >= this.state.playlist.length - 1) {
      this.stop()
      this.setSleepTimer(0)
      return
    }

    // 3. 順序播放至下一段
    if (this.state.playlist.length > 0 && this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 700)
    } else if (this.state.playbackMode === 'loop-all' && this.state.playlist.length > 0) {
      // 4. 全篇循環模式，回到第一段
      this.state.playlistIndex = 0
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 900)
    } else {
      this.state.isPlaying = false
      this.state.isPaused = false
      this.state.currentPassageId = null
      this.clearKeepAlive()
      this.updateMediaSessionPlaybackState()
    }
  }

  public nextPassage() {
    if (this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      this.playCurrentPlaylistItem()
    } else if (this.state.playbackMode === 'loop-all' && this.state.playlist.length > 0) {
      this.state.playlistIndex = 0
      this.playCurrentPlaylistItem()
    }
  }

  public prevPassage() {
    if (this.state.playlistIndex > 0) {
      this.state.playlistIndex--
      this.playCurrentPlaylistItem()
    }
  }

  public jumpToPlaylistItem(index: number) {
    if (index >= 0 && index < this.state.playlist.length) {
      this.state.playlistIndex = index
      this.playCurrentPlaylistItem()
    }
  }

  public pause() {
    if (this.state.audioSourceType === 'file' && this.audioElement) {
      this.audioElement.pause()
    } else if (this.synth) {
      this.synth.pause()
    }
    this.state.isPaused = true
    this.clearKeepAlive()
    this.updateMediaSessionPlaybackState()
  }

  public resume() {
    if (this.state.isPaused) {
      if (this.state.audioSourceType === 'file' && this.audioElement) {
        this.audioElement.play()
      } else if (this.synth) {
        this.synth.resume()
      }
      this.state.isPaused = false
      this.state.isPlaying = true
      this.startKeepAlive()
      this.updateMediaSessionPlaybackState()
    } else if (!this.state.isPlaying && this.state.playlist.length > 0) {
      this.playCurrentPlaylistItem()
    }
  }

  public stop() {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer)
      this.transitionTimer = null
    }
    this.clearKeepAlive()

    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }
    if (this.synth) {
      this.synth.cancel()
    }

    this.state.isPlaying = false
    this.state.isPaused = false
    this.state.currentPassageId = null
    this.state.currentTime = 0
    this.state.bilingualPhase = null
    this.activeUtterance = null
    this.updateMediaSessionPlaybackState()
  }

  public seek(seconds: number) {
    if (this.state.audioSourceType === 'file' && this.audioElement && this.state.duration > 0) {
      const targetTime = Math.max(0, Math.min(seconds, this.state.duration))
      this.audioElement.currentTime = targetTime
      this.state.currentTime = targetTime
      this.updateMediaSessionPosition()
    }
  }

  public setRate(rate: SpeechRate) {
    const clamped = Math.max(0.5, Math.min(2.5, Number(rate.toFixed(2))))
    this.state.currentRate = clamped
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('litc-speech-rate', String(clamped))
      } catch {
        // ignore
      }
    }
    if (this.audioElement) {
      this.audioElement.playbackRate = clamped
    }
    if (this.state.isPlaying && !this.state.isPaused) {
      if (this.state.audioSourceType === 'tts') {
        this.playCurrentPlaylistItem()
      }
    }
  }

  public setMode(mode: SpeechMode) {
    if (this.state.currentMode === mode) return
    this.state.currentMode = mode
    if (this.state.isPlaying) {
      this.playCurrentPlaylistItem()
    }
  }

  public setPlaybackMode(mode: PlaybackMode) {
    this.state.playbackMode = mode
  }

  public cyclePlaybackMode() {
    if (this.state.playbackMode === 'sequential') {
      this.state.playbackMode = 'loop-single'
    } else if (this.state.playbackMode === 'loop-single') {
      this.state.playbackMode = 'loop-all'
    } else {
      this.state.playbackMode = 'sequential'
    }
  }

  public setSleepTimer(option: SleepTimerOption) {
    this.state.sleepTimer = option
    if (this.sleepIntervalTimer) {
      clearInterval(this.sleepIntervalTimer)
      this.sleepIntervalTimer = null
    }

    if (typeof option === 'number' && option > 0) {
      this.state.sleepTimerRemainingSeconds = option * 60
      this.sleepIntervalTimer = setInterval(() => {
        if (this.state.sleepTimerRemainingSeconds > 0) {
          this.state.sleepTimerRemainingSeconds--
          if (this.state.sleepTimerRemainingSeconds <= 0) {
            this.stop()
            this.setSleepTimer(0)
          }
        }
      }, 1000)
    } else {
      this.state.sleepTimerRemainingSeconds = 0
    }
  }

  public toggleCollapse() {
    this.state.isCollapsed = !this.state.isCollapsed
  }

  public togglePlaylistDrawer() {
    this.state.isPlaylistDrawerOpen = !this.state.isPlaylistDrawerOpen
  }

  public setVoice(voiceURI: string) {
    this.state.selectedVoiceURI = voiceURI
    if (this.state.isPlaying && !this.state.isPaused && this.state.audioSourceType === 'tts') {
      this.playCurrentPlaylistItem()
    }
  }

  public togglePreferAudioFiles() {
    this.state.preferAudioFiles = !this.state.preferAudioFiles
    if (this.state.isPlaying && !this.state.isPaused) {
      this.playCurrentPlaylistItem()
    }
  }

  public toggleAutoScroll() {
    this.state.isAutoScroll = !this.state.isAutoScroll
  }

  private preloadNextPlaylistItem() {
    const nextIdx = this.state.playlistIndex + 1
    if (nextIdx >= this.state.playlist.length || this.prefetchedIndex === nextIdx) return
    this.prefetchedIndex = nextIdx
    const nextItem = this.state.playlist[nextIdx]
    if (this.state.currentMode === 'canonical' || this.state.currentMode === 'bilingual') {
      const url = getAudioFileUrl(nextItem.passageId)
      if (url && typeof window !== 'undefined') {
        if (!this.prefetchAudio) {
          this.prefetchAudio = new Audio()
          this.prefetchAudio.preload = 'auto'
        }
        this.prefetchAudio.src = url
        this.prefetchAudio.load()
      }
    }
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
   * 獨立朗讀純文字（支援題幹、選項、答案解析朗讀）
   */
  public speakText(
    text: string,
    options?: {
      rate?: number
      onStart?: () => void
      onEnd?: () => void
      onError?: (err: any) => void
      isClassical?: boolean
    }
  ) {
    if (!this.synth) return
    this.stop()

    const sanitized = options?.isClassical === false ? text.trim() : this.sanitizeText(text)
    if (!sanitized) return

    this.state.isPlaying = true
    this.state.isPaused = false
    this.state.currentText = sanitized
    this.state.audioSourceType = 'tts'

    const utterance = new SpeechSynthesisUtterance(sanitized)
    this.activeUtterance = utterance

    if (this.state.selectedVoiceURI && this.voices.value.length > 0) {
      const chosen = this.voices.value.find(v => v.voiceURI === this.state.selectedVoiceURI)
      if (chosen) {
        utterance.voice = chosen
        utterance.lang = chosen.lang
      }
    } else {
      utterance.lang = 'zh-TW'
    }

    utterance.rate = options?.rate || this.state.currentRate
    utterance.pitch = 1.0

    utterance.onstart = () => {
      this.state.isPlaying = true
      this.state.isPaused = false
      this.startKeepAlive()
      options?.onStart?.()
    }

    utterance.onend = () => {
      this.clearKeepAlive()
      this.state.isPlaying = false
      this.activeUtterance = null
      options?.onEnd?.()
    }

    utterance.onerror = (e) => {
      this.clearKeepAlive()
      this.state.isPlaying = false
      this.activeUtterance = null
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        options?.onError?.(e)
      }
    }

    this.synth.speak(utterance)
  }

  private startKeepAlive() {
    this.clearKeepAlive()
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.state.isPlaying && !this.state.isPaused && this.state.audioSourceType === 'tts') {
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
