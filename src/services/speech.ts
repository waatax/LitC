import { ref, reactive } from 'vue'
import { getAudioFileUrl, getAudioFileMeta } from '@/data/audioManifest'

export type SpeechMode = 'canonical' | 'vernacular'
export type SpeechRate = 0.5 | 0.75 | 0.8 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | number
export type AudioSourceType = 'file' | 'tts'

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
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return
    this.audioElement = new Audio()
    // 智慧加載：預設僅獲取中繼資訊以降低初始頻寬與記憶體佔用
    this.audioElement.preload = 'metadata'

    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.audioElement) return
      this.state.currentTime = this.audioElement.currentTime
      if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
        this.state.duration = this.audioElement.duration
        // 當播放超過 80% 時，靜默預載下一段，確保連播零延遲
        if (this.state.currentTime / this.audioElement.duration > 0.8) {
          this.preloadNextPlaylistItem()
        }
      }
    })

    this.audioElement.addEventListener('progress', () => {
      if (!this.audioElement || !this.audioElement.buffered.length || !this.audioElement.duration) return
      try {
        const bufferedEnd = this.audioElement.buffered.end(this.audioElement.buffered.length - 1)
        this.state.bufferedPercent = Math.min(100, Math.round((bufferedEnd / this.audioElement.duration) * 100))
      } catch {
        // ignore buffer calculation errors
      }
    })

    this.audioElement.addEventListener('ended', () => {
      this.onPassageFinished()
    })

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio element error, falling back to TTS:', e)
      // 若音檔載入發生異常（例如離線且無快取），自動平滑降級至 TTS
      if (this.state.isPlaying) {
        this.state.audioSourceType = 'tts'
        this.speakUtterance(this.state.currentText, () => {
          this.onPassageFinished()
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

  /**
   * 檢查某段落是否具有高品質實體音檔
   */
  public hasAudioFile(passageId: string): boolean {
    return !!getAudioFileMeta(passageId)
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
    // 若當前正播放完全相同段落與模式，切換暫停/繼續
    if (this.state.isPlaying && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.pause()
      return
    }

    if (this.state.isPaused && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.resume()
      return
    }

    // 停止先前的播放
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

    // 更新播放清單索引
    const playlistIdx = this.state.playlist.findIndex(item => item.passageId === passageId)
    if (playlistIdx !== -1) {
      this.state.playlistIndex = playlistIdx
    } else if (extra) {
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

    // 判斷是否使用實體音檔（原文模式下優先啟用高品質音檔）
    const audioUrl = mode === 'canonical' ? getAudioFileUrl(passageId) : undefined
    const audioMeta = mode === 'canonical' ? getAudioFileMeta(passageId) : undefined

    if (this.state.preferAudioFiles && audioUrl && this.audioElement) {
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
        this.onPassageFinished()
      })
    }

    if (this.state.isAutoScroll) {
      this.scrollToPassage(passageId)
    }
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
        this.onPassageFinished()
      })
    })
  }

  /**
   * 開啟全章逐段連播（一段接一段，控制在每段節律內）
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
    if (this.state.playlist.length > 0 && this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      // 換段之際預留 700ms 雅緻呼吸停頓
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 700)
    } else {
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
    if (this.state.audioSourceType === 'file' && this.audioElement) {
      this.audioElement.pause()
    } else if (this.synth) {
      this.synth.pause()
    }
    this.state.isPaused = true
    this.clearKeepAlive()
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
    this.activeUtterance = null
  }

  public seek(seconds: number) {
    if (this.state.audioSourceType === 'file' && this.audioElement && this.state.duration > 0) {
      const targetTime = Math.max(0, Math.min(seconds, this.state.duration))
      this.audioElement.currentTime = targetTime
      this.state.currentTime = targetTime
    }
  }

  public setRate(rate: SpeechRate) {
    const clamped = Math.max(0.5, Math.min(2.5, Number(rate.toFixed(2))))
    this.state.currentRate = clamped
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('litc-speech-rate', String(clamped))
      } catch {
        // ignore storage errors
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

  /**
   * 智慧預載：連播進行至尾聲時，平滑預取下一段音訊，以達致零卡頓轉場並大幅降低網路延遲
   */
  private preloadNextPlaylistItem() {
    const nextIdx = this.state.playlistIndex + 1
    if (nextIdx >= this.state.playlist.length || this.prefetchedIndex === nextIdx) return
    this.prefetchedIndex = nextIdx
    const nextItem = this.state.playlist[nextIdx]
    if (this.state.currentMode === 'canonical') {
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

  public setMode(mode: SpeechMode) {
    if (this.state.currentMode === mode) return
    this.state.currentMode = mode
    if (this.state.isPlaying) {
      this.playCurrentPlaylistItem()
    }
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

  private scrollToPassage(passageId: string) {
    if (typeof document === 'undefined') return
    requestAnimationFrame(() => {
      const el = document.getElementById(`passage-${passageId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
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
