// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 學派定義與現代實用思維模型
// ─────────────────────────────────────────────────
import type { School } from '../types/content'

export const schools: School[] = [
  {
    id: 'daoism',
    name: '道家',
    description: '以「道」為核心，主張自然無為、柔弱勝剛強，代表人物老子、莊子、列子。',
    icon: '☯️',
    workIds: ['dao-de-jing', 'zhuangzi', 'liezi', 'wenzi', 'wenshi-zhenjing'],
    thinkingModel: '反脆弱與減法思維：順應客觀演化規律，以柔弱克剛強。',
    cognitivePearls: [
      '上善若水：不爭而善勝，處眾人之所惡故幾於道。',
      '為學日益，為道日損：在資訊過載時代持續剔除雜訊，回歸本質。',
      '逍遙齊物：打破單一世俗評價標準，以全局超然視角安頓心靈。'
    ],
  },
  {
    id: 'legalism',
    name: '法家',
    description: '重視法治與制度，主張以法、術、勢治國，代表人物韓非、商鞅、管仲、慎到、申不害。',
    icon: '⚖️',
    workIds: ['han-fei-zi', 'shang-jun-shu', 'shen-bu-hai', 'shenzi', 'jian-zhu-ke-shu', 'guanzi'],
    thinkingModel: '制度架構與博弈激勵：基於人性假定的組織機制設計。',
    cognitivePearls: [
      '法不阿貴：規則透明與一視同仁是降低組織協作與信任成本的基石。',
      '以功定賞：摒除情感偏私，以客觀可驗證的成果作為評價標準。',
      '形名參同：言出必行、言行對齊，現代考核與執行的落實本質。'
    ],
  },
  {
    id: 'mohism',
    name: '墨家',
    description: '倡導兼愛、非攻、尚賢、節用，代表人物墨翟。',
    icon: '🤝',
    workIds: ['mo-zi'],
    thinkingModel: '激進利他與技術理性：講求實證實踐與互利共贏。',
    cognitivePearls: [
      '兼相愛，交相利：真正的永續合作必須建立在雙贏與互利的基石之上。',
      '非攻節用：摒除內耗與虛浮炫耀，將能量精準投入於核心生產力。',
      '尚賢使能：打破階級身分偏見，以實質才能作為人才選拔標準。'
    ],
  },
  {
    id: 'confucianism',
    name: '儒家',
    description: '崇尚禮樂仁義，主張修己安人、中庸之道，包含四書五經與先秦儒學集大成之作，代表人物孔子、孟子、荀子。',
    icon: '📜',
    workIds: [
      'lun-yu',
      'meng-zi',
      'da-xue',
      'zhong-yong',
      'xunzi',
      'yi-jing',
      'shu-jing',
      'shi-jing',
      'li-ji',
      'chun-qiu'
    ],
    thinkingModel: '關係主義與道德閉環：以身作則、由己及人的正向回饋系統。',
    cognitivePearls: [
      '克己復禮：高度自律是贏得內心自由與深層人際信任的最高途徑。',
      '修己安人：格物致知為起點，修身齊家治國平天下為價值閉環。',
      '浩然之氣：配義與道，在嚴苛考驗中涵養堅韌不拔的心理素質。'
    ],
  },
  {
    id: 'literature',
    name: '文學',
    description: '歷代經典散文與駢文，融會思想、情感與文字之美，為中國文學之冠冕。',
    icon: '✒️',
    workIds: ['gu-wen-guan-zhi', 'cai-gen-tan'],
    thinkingModel: '言意之辨與美學共振：跨越千年時空的情感共鳴場域。',
    cognitivePearls: [
      '文以載道：文字不僅是形式之美，更是心靈思想與生命境界的載體。',
      '情景交融：透過細膩具象的物象描寫，觸發深邃的同理心與沉浸感。',
      '微言大義：在簡約凝練中賦予留白，激發讀者主動建構多元意義。'
    ],
  },
  {
    id: 'military',
    name: '兵家',
    description: '研討軍事戰略、用兵之道與勝敗規律，代表人物孫武、吳起。',
    icon: '⚔️',
    workIds: ['art-of-war', 'wu-zi', 'si-ma-fa', 'three-strategies', 'wei-liao-zi', 'liu-tao'],
    thinkingModel: '資訊博弈與勝率計算：先勝而後求戰的嚴密風險控制系統。',
    cognitivePearls: [
      '知彼知己：消除關鍵認知盲區是現代商業與人生決策的第一原則。',
      '出其不意：在資源有限條件下，集中優勢資源打擊關鍵痛點。',
      '不戰而屈人之兵：追求消耗最小化與系統收益最大化的頂層戰略。'
    ],
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
    thinkingModel: '長週期因果推演：從宏觀歷史興衰反思當下處境與抉擇。',
    cognitivePearls: [
      '以史為鑑：歷史不會單純重複，但人性博弈的韻律驚人一致。',
      '成敗之由：不以一時際遇論斷，深入探究底層結構與趨勢推動力。',
      '通古今之變：建立廣闊視角，於文明演進維度中體察個人使命。'
    ],
  },
]
