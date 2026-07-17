import type { ReviewRating, ReviewInput, ReviewCardState, MasteryState } from '../types/content'

export interface ReviewSchedule {
  dueAt: string
  stability: number
  difficulty: number
  predictedRetention: number
  state: 'learning' | 'review' | 'relearning'
}

/**
 * FSRS-like Spaced Repetition Scheduler.
 * Decoupled from state storage to satisfy Master Plan section 9 technical contracts.
 */
export function scheduleReview(
  input: ReviewInput,
  currentCard: ReviewCardState
): { cardState: ReviewCardState; schedule: ReviewSchedule } {
  const now = new Date(input.reviewedAt)
  let nextStability = currentCard.stability
  let nextDifficulty = currentCard.difficulty

  // Determine learning state transition
  let scheduleState: 'learning' | 'review' | 'relearning' = 'learning'
  let nextMastery: MasteryState = 'learning'

  if (currentCard.reviewCount === 0) {
    // First review
    switch (input.rating) {
      case 'again':
        nextStability = 0.05 // ~1.2 hours
        nextDifficulty = 6
        nextMastery = 'encountered'
        scheduleState = 'learning'
        break
      case 'hard':
        nextStability = 1 // 1 day
        nextDifficulty = 5.5
        nextMastery = 'initial-recall'
        scheduleState = 'learning'
        break
      case 'good':
        nextStability = 3 // 3 days
        nextDifficulty = 5
        nextMastery = 'stable'
        scheduleState = 'review'
        break
      case 'easy':
        nextStability = 7 // 7 days
        nextDifficulty = 4
        nextMastery = 'stable'
        scheduleState = 'review'
        break
    }
  } else {
    // Subsequent review
    scheduleState = currentCard.mastery === 'stable' ? 'review' : 'learning'

    switch (input.rating) {
      case 'again':
        nextStability = 0.1 // ~2.4 hours
        nextDifficulty = Math.min(10, currentCard.difficulty + 1.0)
        nextMastery = 'leech'
        scheduleState = 'relearning'
        break
      case 'hard':
        // Slow interval growth
        nextStability = Math.max(0.5, currentCard.stability * 1.2)
        nextDifficulty = Math.min(10, currentCard.difficulty + 0.5)
        nextMastery = 'learning'
        break
      case 'good':
        // Standard interval growth
        const factorGood = 2.5 * Math.max(0.5, 1 - (currentCard.difficulty - 5) * 0.08)
        nextStability = Math.max(1, currentCard.stability * factorGood)
        nextDifficulty = currentCard.difficulty // stays same
        nextMastery = 'stable'
        break
      case 'easy':
        // Rapid interval growth
        const factorEasy = 4.5 * Math.max(0.5, 1 - (currentCard.difficulty - 5) * 0.08)
        nextStability = Math.max(2, currentCard.stability * factorEasy)
        nextDifficulty = Math.max(1, currentCard.difficulty - 0.5)
        nextMastery = 'stable'
        break
    }
  }

  // Adjust stability for hints used
  if (input.hintsUsed > 0 && input.rating !== 'again') {
    // Punish hint usage by dividing stability by (1 + 0.5 * hintsUsed)
    nextStability = Math.max(0.1, nextStability / (1 + 0.5 * input.hintsUsed))
  }

  // Cap stability between 0.05 and 365 days
  nextStability = Math.min(365, Math.max(0.05, nextStability))

  // Calculate next due date
  const msInADay = 24 * 60 * 60 * 1000
  const nextDueDate = new Date(now.getTime() + nextStability * msInADay)

  const cardState: ReviewCardState = {
    sentenceId: input.cardId,
    mastery: nextMastery,
    dueAt: nextDueDate.toISOString(),
    stability: nextStability,
    difficulty: nextDifficulty,
    reviewCount: currentCard.reviewCount + 1,
    lastReviewedAt: input.reviewedAt
  }

  const schedule: ReviewSchedule = {
    dueAt: nextDueDate.toISOString(),
    stability: nextStability,
    difficulty: nextDifficulty,
    predictedRetention: 0.9,
    state: scheduleState
  }

  return { cardState, schedule }
}
