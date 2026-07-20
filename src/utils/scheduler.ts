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

  // Calibrate rating based on typing accuracy:
  // If the user's typing diff accuracy is below 80%, force a downgrade of 'easy'/'good' to 'hard'.
  let rating = input.rating
  if (input.answerMode === 'typing' && input.diffAccuracy !== undefined && input.diffAccuracy < 80) {
    if (rating === 'easy' || rating === 'good') {
      rating = 'hard'
    }
  }

  // Determine learning state transition
  let scheduleState: 'learning' | 'review' | 'relearning' = 'learning'
  let nextMastery: MasteryState = 'learning'

  if (currentCard.reviewCount === 0) {
    // First review
    switch (rating) {
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

    switch (rating) {
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

  // Adjust stability for hints used (Hint Penalty Matrix)
  // hintsUsed values map to:
  // 0: blank (no hint used) -> multiplier 1.0 (no penalty)
  // 1: meaning-only -> multiplier 0.8
  // 2: first-char -> multiplier 0.6
  // 3: keyword-mask -> multiplier 0.4
  // 4: full -> multiplier 0.1
  if (rating !== 'again') {
    let multiplier = 1.0
    if (input.hintsUsed === 1) {
      multiplier = 0.8
    } else if (input.hintsUsed === 2) {
      multiplier = 0.6
    } else if (input.hintsUsed === 3) {
      multiplier = 0.4
    } else if (input.hintsUsed === 4) {
      multiplier = 0.1
    }
    nextStability = Math.max(0.05, nextStability * multiplier)
  }

  // Cap stability between 0.05 and 365 days, preventing NaN
  nextStability = Math.min(365, Math.max(0.05, nextStability || 0.1))

  // Calculate next due date, ensuring it is at least 1 minute in the future relative to current wall time
  const msInADay = 24 * 60 * 60 * 1000
  let targetTime = now.getTime() + nextStability * msInADay
  const currentTime = Date.now()
  if (targetTime <= currentTime) {
    targetTime = currentTime + 60000 // at least 1 minute in the future
  }
  const nextDueDate = new Date(targetTime)

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
