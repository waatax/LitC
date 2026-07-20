import type { ReviewCardState, ReviewInput } from '../types/content'

export interface BackupData {
  version: number
  timestamp: string
  cards: ReviewCardState[]
  reviews: ReviewInput[]
  checksum: string
}

/**
 * 簡單且確定的字串雜湊算法，用作備份檔完整性校驗
 */
function computeSimpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // 轉為 32 位元有號整數
  }
  return Math.abs(hash).toString(16)
}

/**
 * 產生帶有完整性簽章的備份字串
 */
export function generateBackup(cards: ReviewCardState[], reviews: ReviewInput[]): string {
  const payload = {
    version: 2,
    timestamp: new Date().toISOString(),
    cards,
    reviews
  }
  
  const serializedPayload = JSON.stringify(payload)
  const checksum = computeSimpleHash(serializedPayload)
  
  const backupObject: BackupData = {
    ...payload,
    checksum
  }
  
  return JSON.stringify(backupObject, null, 2)
}

/**
 * 驗證備份檔之簽章與欄位完整性
 */
export function verifyAndParseBackup(backupJson: string): { cards: ReviewCardState[], reviews: ReviewInput[] } | null {
  try {
    const backup: BackupData = JSON.parse(backupJson)
    if (!backup.cards || !backup.reviews || !backup.checksum) {
      console.warn('Backup validation error: missing core fields.')
      return null
    }
    
    // 重新計算 Payload 雜湊以驗證有無竄改
    const payload = {
      version: backup.version,
      timestamp: backup.timestamp,
      cards: backup.cards,
      reviews: backup.reviews
    }
    
    const serializedPayload = JSON.stringify(payload)
    const recalculatedChecksum = computeSimpleHash(serializedPayload)
    
    if (recalculatedChecksum !== backup.checksum) {
      console.error('Backup checksum verification failed! Data might be tampered or corrupted.')
      return null
    }
    
    return {
      cards: backup.cards,
      reviews: backup.reviews
    }
  } catch (e) {
    console.error('Failed to parse backup JSON:', e)
    return null
  }
}
