import { ref } from 'vue'

export function useBreathingPacer() {
  const pacerText = ref('吸氣 (Inhale)')
  const pacerPhase = ref<'inhale' | 'hold' | 'exhale'>('inhale')
  let pacerTimer: number | null = null

  function startPacer() {
    let elapsed = 0
    pacerText.value = '吸氣 4s'
    pacerPhase.value = 'inhale'
    pacerTimer = window.setInterval(() => {
      elapsed = (elapsed + 1) % 19
      if (elapsed < 4) {
        pacerText.value = `吸氣 ${4 - elapsed}s`
        pacerPhase.value = 'inhale'
      } else if (elapsed < 11) {
        pacerText.value = `屏息 ${11 - elapsed}s`
        pacerPhase.value = 'hold'
      } else {
        pacerText.value = `呼氣 ${19 - elapsed}s`
        pacerPhase.value = 'exhale'
      }
    }, 1000)
  }

  function stopPacer() {
    if (pacerTimer) {
      clearInterval(pacerTimer)
      pacerTimer = null
    }
  }

  return {
    pacerText,
    pacerPhase,
    startPacer,
    stopPacer
  }
}
