// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 學派定義
// ─────────────────────────────────────────────────
import type { School } from '../types/content'

export const schools: School[] = [
  {
    id: 'daoism',
    name: '道家',
    description: '以「道」為核心，主張自然無為、柔弱勝剛強，代表人物老子、莊子、列子。',
    icon: '☯️',
    workIds: ['dao-de-jing', 'zhuangzi', 'liezi', 'wenzi', 'wenshi-zhenjing'],
  },
  {
    id: 'legalism',
    name: '法家',
    description: '重視法治與制度，主張以法、術、勢治國，代表人物韓非、商鞅、管仲、慎到、申不害。',
    icon: '⚖️',
    workIds: ['han-fei-zi', 'shang-jun-shu', 'shen-bu-hai', 'shenzi', 'jian-zhu-ke-shu', 'guanzi'],
  },
  {
    id: 'mohism',
    name: '墨家',
    description: '倡導兼愛、非攻、尚賢、節用，代表人物墨翟。',
    icon: '🤝',
    workIds: ['mo-zi'],
  },
  {
    id: 'confucianism',
    name: '儒家',
    description: '崇尚禮樂仁義，主張修己安人、中庸之道，代表人物孔子、孟子。',
    icon: '📜',
    workIds: [
      'lun-yu',
      'meng-zi',
      'yi-jing',
      'shu-jing',
      'shi-jing',
      'li-ji',
      'chun-qiu',
      'da-xue',
      'zhong-yong'
    ],
  },
  {
    id: 'literature',
    name: '文學',
    description: '歷代經典散文與駢文，融會思想、情感與文字之美，為中國文學之冠冕。',
    icon: '✒️',
    workIds: ['gu-wen-guan-zhi', 'cai-gen-tan'],
  },
  {
    id: 'military',
    name: '兵家',
    description: '研討軍事戰略、用兵之道與勝敗規律，代表人物孫武、吳起。',
    icon: '⚔️',
    workIds: ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'],
  },
  {
    id: 'histories',
    name: '史書',
    description: '記敘歷史興衰、列國風雲與人物生平之史籍，代表著述《史記》、《左傳》、《戰國策》。',
    icon: '🏛️',
    workIds: [
      'shiji',
      'chun-qiu-zuo-zhuan',
      'lost-book-of-zhou',
      'guo-yu',
      'yanzi-chun-qiu',
      'wu-yue-chun-qiu',
      'yue-jue-shu',
      'zhan-guo-ce',
      'yan-tie-lun',
      'lie-nv-zhuan',
      'guliang-zhuan',
      'gongyang-zhuan',
      'han-shu',
      'hou-han-shu',
      'qian-han-ji',
      'dong-guan-han-ji',
      'zhushu-jinian',
      'mutianzi-zhuan',
      'gu-san-fen',
      'yandanzi',
      'xijing-zaji'
    ],
  },
]
