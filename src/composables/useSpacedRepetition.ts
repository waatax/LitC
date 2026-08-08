import { ref, computed, type Ref } from 'vue'
import type { Sentence, ReviewRating } from '@/types/content'
import { scheduleReview } from '@/utils/scheduler'
import { getCardState, saveCardState, logReview } from '@/data/db'
import { zenAudio } from '@/utils/audio'
import { useGamificationStore } from '@/stores/gamification'

export function useSpacedRepetition({
  currentSentence,
  totalSentences,
  currentIndex,
  hintLevel,
  showTypingArea,
  diffAccuracy,
  isComplete,
  unlockedOverlay,
  goToSentence
}: {
  currentSentence: Ref<Sentence | null>
  totalSentences: Ref<number>
  currentIndex: Ref<number>
  hintLevel: Ref<string>
  showTypingArea: Ref<boolean>
  diffAccuracy: Ref<number>
  isComplete: Ref<boolean>
  unlockedOverlay: Ref<any>
  goToSentence: (index: number) => void
}) {
  const gamificationStore = useGamificationStore()
  const ratings = ref<Map<string, ReviewRating>>(new Map())
  const currentCardState = ref<any>(null)

  const isSentenceMastered = computed(() => {
    if (!currentSentence.value) return false
    const rating = ratings.value.get(currentSentence.value.id)
    return rating === 'good' || rating === 'easy'
  })

  async function rateSentence(rating: ReviewRating) {
    if (!currentSentence.value) return
    const sentenceId = currentSentence.value.id
    ratings.value.set(sentenceId, rating)

    // Play synthesized audio feedback
    if (rating === 'easy' || rating === 'good') {
      zenAudio.playBell()
    } else if (rating === 'hard') {
      zenAudio.playMuyu()
    } else if (rating === 'again') {
      zenAudio.playGong()
    }

    // Load current card state
    const currentState = await getCardState(sentenceId)

    // Map hint levels to the scheduler's penalty indices:
    // blank = 0 (no penalty), meaning-only = 1, first-char = 2, keyword-mask = 3, full = 4
    let hintsUsed = 0
    if (hintLevel.value === 'meaning-only') hintsUsed = 1
    else if (hintLevel.value === 'first-char') hintsUsed = 2
    else if (hintLevel.value === 'keyword-mask') hintsUsed = 3
    else if (hintLevel.value === 'full') hintsUsed = 4

    // Run spaced repetition scheduler (with diffAccuracy passed for rating calibration)
    const { cardState } = scheduleReview(
      {
        cardId: sentenceId,
        reviewedAt: new Date().toISOString(),
        rating,
        answerMode: showTypingArea.value ? 'typing' : 'recall',
        hintsUsed,
        diffAccuracy: showTypingArea.value ? diffAccuracy.value : undefined
      },
      currentState
    )

    // Save progress
    await saveCardState(cardState)
    currentCardState.value = cardState
    await logReview({
      cardId: sentenceId,
      reviewedAt: new Date().toISOString(),
      rating,
      answerMode: showTypingArea.value ? 'typing' : 'recall',
      hintsUsed,
      diffAccuracy: showTypingArea.value ? diffAccuracy.value : undefined
    })

    // Award EXP & unlock achievement checklist
    const newAchievements = gamificationStore.addExp(15)
    if (newAchievements.length > 0) {
      unlockedOverlay.value = newAchievements[0]
      setTimeout(() => {
        unlockedOverlay.value = null
      }, 4500)
    }

    // Check and unlock 'first-card' on first rate
    if (gamificationStore.exp >= 15) {
      const ach = gamificationStore.unlockAchievement('first-card')
      if (ach) {
        unlockedOverlay.value = ach
        setTimeout(() => {
          unlockedOverlay.value = null
        }, 4500)
      }
    }

    // Move to next sentence or complete
    if (currentIndex.value < totalSentences.value - 1) {
      goToSentence(currentIndex.value + 1)
    } else {
      gamificationStore.incrementStreak()
      isComplete.value = true
    }
  }

  const summaryStats = computed(() => {
    const counts = { again: 0, hard: 0, good: 0, easy: 0 }
    for (const rating of ratings.value.values()) {
      counts[rating as keyof typeof counts]++
    }
    return counts
  })

  function resetRatings() {
    ratings.value = new Map()
  }

  async function loadCurrentCardState() {
    if (currentSentence.value) {
      currentCardState.value = await getCardState(currentSentence.value.id)
    }
  }

  return {
    ratings,
    currentCardState,
    isSentenceMastered,
    summaryStats,
    rateSentence,
    resetRatings,
    loadCurrentCardState
  }
}
