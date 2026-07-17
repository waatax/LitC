// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 學派定義
// ─────────────────────────────────────────────────
import type { School } from '../types/content'

export const schools: School[] = [
  {
    id: 'daoism',
    name: '道家',
    description: '以「道」為核心，主張自然無為、柔弱勝剛強，代表人物老子、莊子。',
    icon: '☯️',
    workIds: ['dao-de-jing', 'zhuangzi'],
  },
  {
    id: 'legalism',
    name: '法家',
    description: '重視法治與制度，主張以法、術、勢治國，代表人物韓非、商鞅。',
    icon: '⚖️',
    workIds: ['han-fei-zi', 'shang-jun-shu'],
  },
  {
    id: 'mohism',
    name: '墨家',
    description: '倡導兼愛、非攻、尚賢、節用，代表人物墨翟。',
    icon: '🤝',
    workIds: ['mo-zi'],
  },
]
