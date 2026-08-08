import { ref, computed, type Ref } from 'vue'

export interface DiffChar {
  char: string
  type: 'correct' | 'incorrect' | 'missing' | 'extra'
}

export function useTypingDiff(canonicalText: Ref<string>) {
  const typedText = ref('')
  const showDiff = ref(false)
  const showTypingArea = ref(false)

  const diffResult = computed<DiffChar[]>(() => {
    if (!showDiff.value || !canonicalText.value) return []
    const canonical = canonicalText.value
    const typed = typedText.value
    const result: DiffChar[] = []
    const maxLen = Math.max(canonical.length, typed.length)

    for (let i = 0; i < maxLen; i++) {
      if (i < typed.length && i < canonical.length) {
        if (typed[i] === canonical[i]) {
          result.push({ char: typed[i], type: 'correct' })
        } else {
          result.push({ char: typed[i], type: 'incorrect' })
        }
      } else if (i >= typed.length) {
        result.push({ char: canonical[i], type: 'missing' })
      } else {
        result.push({ char: typed[i], type: 'extra' })
      }
    }
    return result
  })

  const diffAccuracy = computed(() => {
    if (diffResult.value.length === 0) return 0
    const correct = diffResult.value.filter(d => d.type === 'correct').length
    const canonical = canonicalText.value.length
    if (canonical === 0) return 100
    return Math.round((correct / canonical) * 100)
  })

  function checkTyping() {
    showDiff.value = true
  }

  function resetTyping() {
    typedText.value = ''
    showDiff.value = false
  }

  return {
    typedText,
    showDiff,
    showTypingArea,
    diffResult,
    diffAccuracy,
    checkTyping,
    resetTyping
  }
}
