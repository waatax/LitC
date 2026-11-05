// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — Web Audio API 遊戲化音效合成引擎
// 100% 離線純代碼合成，無外部音訊檔依賴，高響應無延遲
// ─────────────────────────────────────────────────

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// 靜音開關持久化
const SOUND_ENABLED_KEY = 'litc_sound_effects_enabled'
export function isSoundEnabled(): boolean {
  if (typeof localStorage === 'undefined') return true
  const saved = localStorage.getItem(SOUND_ENABLED_KEY)
  return saved === null ? true : saved === 'true'
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false')
  }
}

/**
 * 答對音效：清脆雅正的玉磬雙音（E5 -> B5）
 */
export function playCorrectSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const notes = [659.25, 987.77] // E5, B5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + idx * 0.1)

    // 清脆漸隱包絡線
    gain.gain.setValueAtTime(0.001, now + idx * 0.1)
    gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.1 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.45)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + idx * 0.1)
    osc.stop(now + idx * 0.1 + 0.46)
  })
}

/**
 * 失誤音效：溫和醇厚的木鐸低鳴（無挫折感的溫暖低頻）
 */
export function playWrongSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(196.0, now) // G3
  osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.35) // D3

  gain.gain.setValueAtTime(0.15, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.41)
}

/**
 * 連擊音效：宮商角徵羽五聲階梯琶音（隨連擊次數提升音高與華麗感）
 */
export function playComboSound(streak: number) {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // 五聲音階 (宮商角徵羽)
  const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
  const count = Math.min(3 + Math.floor(streak / 2), 6)

  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const freq = pentatonic[i % pentatonic.length]
    osc.frequency.setValueAtTime(freq, now + i * 0.06)

    gain.gain.setValueAtTime(0.001, now + i * 0.06)
    gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.06 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.06)
    osc.stop(now + i * 0.06 + 0.31)
  }
}

/**
 * 錦囊妙計使用音效：玄妙靈動的水滴泛音
 */
export function playLifelineSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(440, now)
  osc.frequency.exponentialRampToValueAtTime(1760, now + 0.22)

  gain.gain.setValueAtTime(0.18, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.31)
}

/**
 * 晉級通關音效：典雅大氣的編鐘凱歌
 */
export function playVictorySound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // 莊嚴的六音正宮大和弦
  const chords = [
    { freq: 261.63, delay: 0 },
    { freq: 329.63, delay: 0.1 },
    { freq: 392.0, delay: 0.2 },
    { freq: 523.25, delay: 0.3 },
    { freq: 659.25, delay: 0.45 },
    { freq: 783.99, delay: 0.6 },
  ]

  chords.forEach(({ freq, delay }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now + delay)

    gain.gain.setValueAtTime(0.001, now + delay)
    gain.gain.exponentialRampToValueAtTime(0.2, now + delay + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + delay)
    osc.stop(now + delay + 0.91)
  })
}

// ─────────────────────────────────────────────────
// 古典意境聲景氛圍合成引擎 (100% Web Audio API 離線合成)
// 支援：古琴餘韻 (Guqin)、竹徑夜雨 (Rain)、松林清風 (Wind)、幽谷鳴泉 (Stream)
// ─────────────────────────────────────────────────

export type AmbientSoundscapeType = 'none' | 'guqin' | 'rain' | 'wind' | 'stream'

export interface AmbientSoundscapeOption {
  id: AmbientSoundscapeType
  label: string
  icon: string
  desc: string
}

export const AMBIENT_SOUNDSCAPES: AmbientSoundscapeOption[] = [
  { id: 'none', label: '靜音無伴', icon: '🔇', desc: '純淨名家/TTS誦讀' },
  { id: 'guqin', label: '古琴餘韻', icon: '🪕', desc: '宮商角徵羽清幽琴韻' },
  { id: 'rain', label: '竹徑夜雨', icon: '🌧️', desc: '修竹瀟瀟輕柔白噪音' },
  { id: 'wind', label: '松林清風', icon: '🍃', desc: '幽壑長松自然微風' },
  { id: 'stream', label: '幽谷鳴泉', icon: '💧', desc: '山泉滴瀝淙淙流水' },
]

let activeAmbientType: AmbientSoundscapeType = 'none'
let ambientMasterGain: GainNode | null = null
let ambientIntervalId: any = null
let ambientNoiseNode: AudioNode | null = null
let ambientVolume = 0.25

const AMBIENT_STORAGE_KEY = 'litc_ambient_soundscape_type'
const AMBIENT_VOL_STORAGE_KEY = 'litc_ambient_soundscape_vol'

export function getAmbientSoundscape(): AmbientSoundscapeType {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(AMBIENT_STORAGE_KEY) as AmbientSoundscapeType
    if (saved && AMBIENT_SOUNDSCAPES.some(s => s.id === saved)) {
      return saved
    }
  }
  return activeAmbientType
}

export function getAmbientVolume(): number {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(AMBIENT_VOL_STORAGE_KEY)
    if (saved) {
      const parsed = parseFloat(saved)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed
    }
  }
  return ambientVolume
}

export function setAmbientVolume(vol: number): void {
  ambientVolume = Math.max(0, Math.min(1, vol))
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(AMBIENT_VOL_STORAGE_KEY, ambientVolume.toString())
  }
  if (ambientMasterGain && audioCtx) {
    ambientMasterGain.gain.setTargetAtTime(ambientVolume, audioCtx.currentTime, 0.05)
  }
}

export function stopAmbientSoundscape(): void {
  activeAmbientType = 'none'
  if (ambientIntervalId) {
    clearInterval(ambientIntervalId)
    ambientIntervalId = null
  }
  if (ambientNoiseNode) {
    try {
      (ambientNoiseNode as any).stop?.()
      ambientNoiseNode.disconnect()
    } catch {}
    ambientNoiseNode = null
  }
  if (ambientMasterGain) {
    try {
      ambientMasterGain.disconnect()
    } catch {}
    ambientMasterGain = null
  }
}

function createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

function playGuqinPluck(ctx: AudioContext, dest: AudioNode, freq: number) {
  const now = ctx.currentTime
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const pluckGain = ctx.createGain()

  osc1.type = 'triangle'
  osc1.frequency.setValueAtTime(freq, now)

  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(freq * 2.01, now) // 二次泛音略帶微失諧，增添真實木質古琴共鳴

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1400, now)
  filter.frequency.exponentialRampToValueAtTime(300, now + 2.5)

  pluckGain.gain.setValueAtTime(0.001, now)
  pluckGain.gain.exponentialRampToValueAtTime(0.35, now + 0.04)
  pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2)

  osc1.connect(pluckGain)
  osc2.connect(pluckGain)
  pluckGain.connect(filter)
  filter.connect(dest)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + 3.3)
  osc2.stop(now + 3.3)
}

export function setAmbientSoundscape(type: AmbientSoundscapeType, vol?: number): void {
  stopAmbientSoundscape()
  activeAmbientType = type

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(AMBIENT_STORAGE_KEY, type)
  }

  if (type === 'none') return

  const ctx = getAudioContext()
  if (!ctx) return

  if (vol !== undefined) {
    ambientVolume = Math.max(0, Math.min(1, vol))
  } else {
    ambientVolume = getAmbientVolume()
  }

  ambientMasterGain = ctx.createGain()
  ambientMasterGain.gain.setValueAtTime(ambientVolume, ctx.currentTime)
  ambientMasterGain.connect(ctx.destination)

  if (type === 'guqin') {
    // 古琴五聲音階 (宮商角徵羽低八度與中音區)
    const guqinScale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63]
    const trigger = () => {
      if (activeAmbientType !== 'guqin' || !ambientMasterGain) return
      const randFreq = guqinScale[Math.floor(Math.random() * guqinScale.length)]
      playGuqinPluck(ctx, ambientMasterGain, randFreq)
      // 偶爾雙音合鳴
      if (Math.random() > 0.6) {
        setTimeout(() => {
          if (activeAmbientType === 'guqin' && ambientMasterGain) {
            const harmonic = guqinScale[Math.floor(Math.random() * guqinScale.length)]
            playGuqinPluck(ctx, ambientMasterGain, harmonic)
          }
        }, 160)
      }
    }

    trigger()
    ambientIntervalId = setInterval(trigger, 3200 + Math.random() * 2000)
  } else if (type === 'rain') {
    // 竹徑夜雨：粉紅濾波白噪音
    const noiseBuffer = createNoiseBuffer(ctx, 4)
    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(1100, ctx.currentTime)
    bandpass.Q.setValueAtTime(0.8, ctx.currentTime)

    whiteNoise.connect(bandpass)
    bandpass.connect(ambientMasterGain)
    whiteNoise.start()
    ambientNoiseNode = whiteNoise
  } else if (type === 'wind') {
    // 松林清風：低頻慢速呼吸調製風聲
    const noiseBuffer = createNoiseBuffer(ctx, 5)
    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(450, ctx.currentTime)

    // LFO 緩慢改變低通濾波截止頻率
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime) // 5 秒左右一陣微風
    lfoGain.gain.setValueAtTime(220, ctx.currentTime)

    lfo.connect(lfoGain)
    lfoGain.connect(lowpass.frequency)
    lfo.start()

    whiteNoise.connect(lowpass)
    lowpass.connect(ambientMasterGain)
    whiteNoise.start()
    ambientNoiseNode = whiteNoise
  } else if (type === 'stream') {
    // 幽谷鳴泉：流水底噪 + 週期清泉水滴
    const noiseBuffer = createNoiseBuffer(ctx, 4)
    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(750, ctx.currentTime)
    filter.Q.setValueAtTime(1.5, ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(ambientMasterGain)
    whiteNoise.start()
    ambientNoiseNode = whiteNoise

    // 隨機泉水滴落音
    const drip = () => {
      if (activeAmbientType !== 'stream' || !ambientMasterGain) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const dripGain = ctx.createGain()

      const baseFreq = 850 + Math.random() * 600
      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08)

      dripGain.gain.setValueAtTime(0.001, now)
      dripGain.gain.exponentialRampToValueAtTime(0.2, now + 0.01)
      dripGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

      osc.connect(dripGain)
      dripGain.connect(ambientMasterGain)

      osc.start(now)
      osc.stop(now + 0.16)
    }

    ambientIntervalId = setInterval(drip, 1400 + Math.random() * 1200)
  }
}

