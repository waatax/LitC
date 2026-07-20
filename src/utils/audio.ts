/**
 * 經典文脈 ClassicFlow — 禪意音效合成器
 * 採用 Web Audio API 即時波形合成，無需下載 mp3，確保離線可用與零資源加載。
 * 包含針對 iOS Mobile Safari 的 AudioContext 解鎖機制以防止崩潰與靜音。
 */
class ZenAudio {
  private ctx: AudioContext | null = null

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  /**
   * 解鎖 iOS/Safari AudioContext：播放一個短暫無聲 Buffer
   */
  public unlock() {
    try {
      this.init()
      if (this.ctx) {
        const buffer = this.ctx.createBuffer(1, 1, 22050)
        const source = this.ctx.createBufferSource()
        source.buffer = buffer
        source.connect(this.ctx.destination)
        source.start(0)
      }
    } catch (e) {
      console.warn('AudioContext unlock failed:', e)
    }
  }

  /**
   * 播放「古鐘磬音」：對應 Good / Easy 等答對評級，聲音清脆悠長
   */
  playBell() {
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      // 基音振盪器
      const osc = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now) // A4 頻率
      
      // 金屬泛音振盪器，模擬磬腔共鳴
      const overtone = this.ctx.createOscillator()
      const overtoneGain = this.ctx.createGain()
      overtone.type = 'triangle'
      overtone.frequency.setValueAtTime(880, now) // 高八度泛音

      // 基音包絡線：快速起音，緩慢指數衰減
      gainNode.gain.setValueAtTime(0.2, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

      // 泛音包絡線：較快衰減
      overtoneGain.gain.setValueAtTime(0.06, now)
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      osc.connect(gainNode)
      overtone.connect(overtoneGain)

      gainNode.connect(this.ctx.destination)
      overtoneGain.connect(this.ctx.destination)

      osc.start(now)
      overtone.start(now)

      osc.stop(now + 2.0)
      overtone.stop(now + 1.0)
    } catch (e) {
      console.warn('Audio synthesis failed:', e)
    }
  }

  /**
   * 播放「清脆木魚聲」：對應 Hard 評級，提醒使用者稍微困難
   */
  playMuyu() {
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()

      // 短促的敲擊，音頻快速下降
      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08)

      gainNode.gain.setValueAtTime(0.4, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      osc.connect(gainNode)
      gainNode.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch (e) {
      console.warn('Audio synthesis failed:', e)
    }
  }

  /**
   * 播放「沉悶低磬」：對應 Again (答錯)，提示重溫
   */
  playGong() {
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.linearRampToValueAtTime(110, now + 1.2)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, now)

      gainNode.gain.setValueAtTime(0.3, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

      osc.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 1.6)
    } catch (e) {
      console.warn('Audio synthesis failed:', e)
    }
  }
}

export const zenAudio = new ZenAudio()

// 全局監聽使用者第一次互動，解鎖 AudioContext
if (typeof window !== 'undefined') {
  const unlockHandler = () => {
    zenAudio.unlock()
    window.removeEventListener('click', unlockHandler)
    window.removeEventListener('touchstart', unlockHandler)
    window.removeEventListener('keydown', unlockHandler)
  }
  window.addEventListener('click', unlockHandler, { once: true })
  window.addEventListener('touchstart', unlockHandler, { once: true, passive: true })
  window.addEventListener('keydown', unlockHandler, { once: true })
}
