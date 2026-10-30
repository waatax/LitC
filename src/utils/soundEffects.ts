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
