import Dexie, { type Table } from 'dexie'
import type { ReviewCardState, ReviewInput } from '../types/content'

export class ClassicFlowDatabase extends Dexie {
  cards!: Table<ReviewCardState, string>
  reviews!: Table<ReviewInput & { id?: number }, number>

  constructor() {
    super('ClassicFlowDatabase')
    this.version(1).stores({
      cards: 'sentenceId, mastery, dueAt',
      reviews: '++id, cardId, reviewedAt, rating'
    })
  }
}

export const db = new ClassicFlowDatabase()

// Helper functions to interact with the database

export async function getCardState(sentenceId: string): Promise<ReviewCardState> {
  const state = await db.cards.get(sentenceId)
  if (state) return state

  // Default state if not exists
  return {
    sentenceId,
    mastery: 'not-started',
    stability: 0,
    difficulty: 5, // default middle difficulty
    reviewCount: 0
  }
}

export async function saveCardState(state: ReviewCardState): Promise<void> {
  await db.cards.put(state)
}

export async function logReview(review: ReviewInput): Promise<void> {
  await db.reviews.add(review)
}

export async function getAllCardStates(): Promise<ReviewCardState[]> {
  return await db.cards.toArray()
}

export async function getDueCardIds(now: string = new Date().toISOString()): Promise<string[]> {
  const cards = await db.cards
    .filter(card => {
      if (card.mastery === 'paused') return false
      if (!card.dueAt) return true // not started or brand new cards are always due
      return card.dueAt <= now
    })
    .toArray()
  return cards.map(c => c.sentenceId)
}
