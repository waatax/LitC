/**
 * 經典文脈 ClassicFlow — 全庫重構進度與斷點管理器 (Checkpoint Manager)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CHECKPOINT_FILE = path.join(ROOT, 'Local', 'scratch', 'pipeline_checkpoint.json')

export class CheckpointManager {
  constructor(filePath = CHECKPOINT_FILE) {
    this.filePath = filePath
    this.data = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      works: {}
    }
    this.load()
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf8')
        this.data = JSON.parse(raw)
      } catch (err) {
        console.warn(`[CheckpointManager] 無法讀取現有斷點檔，重新初始化: ${err.message}`)
      }
    }
  }

  save() {
    this.data.lastUpdated = new Date().toISOString()
    const dir = path.dirname(this.filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const tmp = `${this.filePath}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf8')
    fs.renameSync(tmp, this.filePath)
  }

  initWork(workId, totalChapters, totalPassages) {
    if (!this.data.works[workId]) {
      this.data.works[workId] = {
        totalChapters,
        totalPassages,
        completedPassages: 0,
        status: 'pending',
        passages: {}
      }
    }
  }

  isPassageCompleted(workId, passageId) {
    const p = this.data.works[workId]?.passages?.[passageId]
    return p && p.status === 'completed'
  }

  markPassageCompleted(workId, chapterId, passageId, meta = {}) {
    if (!this.data.works[workId]) {
      this.initWork(workId, 0, 0)
    }
    const work = this.data.works[workId]
    if (!work.passages[passageId] || work.passages[passageId].status !== 'completed') {
      work.completedPassages = (work.completedPassages || 0) + 1
    }
    work.passages[passageId] = {
      chapterId,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      ...meta
    }
    if (work.totalPassages > 0 && work.completedPassages >= work.totalPassages) {
      work.status = 'completed'
    } else {
      work.status = 'in_progress'
    }
  }

  markPassageError(workId, chapterId, passageId, error) {
    if (!this.data.works[workId]) {
      this.initWork(workId, 0, 0)
    }
    this.data.works[workId].passages[passageId] = {
      chapterId,
      status: 'error',
      error: String(error),
      updatedAt: new Date().toISOString()
    }
  }

  getProgressSummary() {
    let total = 0
    let completed = 0
    const byWork = {}
    for (const [wId, w] of Object.entries(this.data.works)) {
      total += w.totalPassages || 0
      completed += w.completedPassages || 0
      byWork[wId] = {
        total: w.totalPassages,
        completed: w.completedPassages,
        percent: w.totalPassages ? ((w.completedPassages / w.totalPassages) * 100).toFixed(1) + '%' : '0%'
      }
    }
    return {
      totalPassages: total,
      completedPassages: completed,
      overallPercent: total ? ((completed / total) * 100).toFixed(2) + '%' : '0%',
      byWork
    }
  }
}
