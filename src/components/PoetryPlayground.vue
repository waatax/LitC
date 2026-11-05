<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGamificationStore } from '@/stores/gamification'
import { POETRY_COLLECTION } from '@/data/poetry'
import {
  playCorrectSound,
  playWrongSound,
  playVictorySound,
  playComboSound
} from '@/utils/soundEffects'
import { speechService } from '@/services/speech'

const gamificationStore = useGamificationStore()

type GameMode = 'feihua' | 'puzzle' | 'quiz'
const activeMode = ref<GameMode>('feihua')

// ──────────────────────────────────────────────
// Game 1: 飛花令 ‧ 名家雅士對弈 (Feihua Ling Duel)
// ──────────────────────────────────────────────
interface FeihuaToken {
  char: string
  label: string
  hint: string
}

export interface PoetRival {
  id: string
  name: string
  title: string
  avatar: string
  intro: string
  verses: Record<string, { line: string; work: string }>
}

const POET_RIVALS: PoetRival[] = [
  {
    id: 'libai',
    name: '李白',
    title: '青蓮居士 ‧ 詩仙',
    avatar: '🍶',
    intro: '天生我材必有用，閣下且與我共飲對詩！',
    verses: {
      '春': { line: '春風不度玉門關', work: '涼州詞' },
      '月': { line: '舉杯邀明月，對影成三人。', work: '月下獨酌' },
      '花': { line: '花間一壺酒，獨酌無相親。', work: '月下獨酌' },
      '風': { line: '長風破浪會有時，直掛雲帆濟滄海。', work: '行路難' },
      '山': { line: '相看兩不厭，只有敬亭山。', work: '獨坐敬亭山' },
      '水': { line: '桃花潭水深千尺，不及汪倫送我情。', work: '贈汪倫' },
      '夜': { line: '牀前明月光，疑是地上霜。', work: '靜夜思' },
      '雲': { line: '朝辭白帝彩雲間，千里江陵一日還。', work: '早發白帝城' },
      '酒': { line: '呼兒將出換美酒，與爾同銷萬古愁。', work: '將進酒' },
      '雨': { line: '山雨欲來風滿樓', work: '咸陽城東樓' }
    }
  },
  {
    id: 'sushi',
    name: '蘇軾',
    title: '東坡居士 ‧ 文豪',
    avatar: '🍜',
    intro: '大江東去，浪淘盡，何妨與子各賦一闋！',
    verses: {
      '月': { line: '明月幾時有？把酒問青天。', work: '水調歌頭' },
      '春': { line: '春色三分，二分塵土，一分流水。', work: '水龍吟' },
      '花': { line: '枝上柳綿吹又少，天涯何處無芳草。', work: '蝶戀花' },
      '風': { line: '清風徐來，水波不興。', work: '前赤壁賦' },
      '山': { line: '不識廬山真面目，只緣身在此山中。', work: '題西林壁' },
      '水': { line: '水光瀲灩晴方好，山色空濛雨亦奇。', work: '飲湖上初晴後雨' },
      '夜': { line: '料得年年腸斷處，明月夜，短松岡。', work: '江城子' },
      '雲': { line: '詩酒趁年華。且將新火試新茶。', work: '望江南' },
      '酒': { line: '人生如夢，一尊還酹江月。', work: '念奴嬌·赤壁懷古' },
      '雨': { line: '一蓑煙雨任平生。也無風雨也無晴。', work: '定風波' }
    }
  },
  {
    id: 'liqingzhao',
    name: '李清照',
    title: '易安居士 ‧ 詞宗',
    avatar: '🪷',
    intro: '風住塵香花已盡，尋尋覓覓，閣下好詩才！',
    verses: {
      '花': { line: '花自飄零水自流。一種相思，兩處閒愁。', work: '一剪梅' },
      '雨': { line: '昨夜雨疏風驟，濃睡不消殘酒。', work: '如夢令' },
      '月': { line: '雲中誰寄錦書來？雁字回時，月滿西樓。', work: '一剪梅' },
      '風': { line: '莫道不銷魂，簾捲西風，人比黃花瘦。', work: '醉花陰' },
      '春': { line: '物是人非事事休，欲語淚先流。', work: '武陵春' },
      '山': { line: '水通南國三千里，氣壓江城十四州。', work: '題八詠樓' },
      '水': { line: '只恐雙溪舴艋舟，載不動許多愁。', work: '武陵春' },
      '夜': { line: '守著窗兒，獨自怎生得黑！梧桐更兼細雨。', work: '聲聲慢' },
      '雲': { line: '天接雲濤連曉霧，星河欲轉千帆舞。', work: '漁家傲' },
      '酒': { line: '常記溪亭日暮，沉醉不知歸路。', work: '如夢令' }
    }
  },
  {
    id: 'wangwei',
    name: '王維',
    title: '摩詰居士 ‧ 詩佛',
    avatar: '🎋',
    intro: '行到水窮處，坐看雲起時。請出句！',
    verses: {
      '月': { line: '深林人不知，明月來相照。', work: '竹裏館' },
      '春': { line: '紅豆生南國，春來發幾枝。', work: '相思' },
      '花': { line: '人閒桂花落，夜靜春山空。', work: '鳥鳴澗' },
      '風': { line: '草枯鷹眼疾，雪盡馬蹄輕。', work: '觀獵' },
      '山': { line: '空山不見人，但聞人語響。', work: '鹿柴' },
      '水': { line: '行到水窮處，坐看雲起時。', work: '終南別業' },
      '夜': { line: '明月松間照，清泉石上流。', work: '山居秋暝' },
      '雲': { line: '白雲迴望合，青靄入看無。', work: '終南山' },
      '酒': { line: '勸君更盡一杯酒，西出陽關無故人。', work: '送元二使安西' },
      '雨': { line: '空山新雨後，天氣晚來秋。', work: '山居秋暝' }
    }
  }
]

const selectedRivalIdx = ref(0)
const selectedRival = computed(() => POET_RIVALS[selectedRivalIdx.value])
const rivalResponse = ref<{ line: string; work: string; poet: string } | null>(null)

const tokens: FeihuaToken[] = [
  { char: '春', label: '春風暖日', hint: '尋找含有「春」字的詩句' },
  { char: '月', label: '明月高懸', hint: '尋找含有「月」字的詩句' },
  { char: '花', label: '繁花似錦', hint: '尋找含有「花」字的詩句' },
  { char: '風', label: '清風徐來', hint: '尋找含有「風」字的詩句' },
  { char: '山', label: '青山連綿', hint: '尋找含有「山」字的詩句' },
  { char: '水', label: '碧水悠悠', hint: '尋找含有「水」字的詩句' },
  { char: '夜', label: '靜夜思懷', hint: '尋找含有「夜」字的詩句' },
  { char: '雲', label: '彩雲翻湧', hint: '尋找含有「雲」字的詩句' },
  { char: '酒', label: '把酒言歡', hint: '尋找含有「酒」字的詩句' },
  { char: '雨', label: '微雨燕雙', hint: '尋找含有「雨」字的詩句' },
]

const currentTokenIdx = ref(0)
const feihuaScore = ref(0)
const feihuaCombo = ref(0)
const feihuaRound = ref(1)
const feihuaGameOver = ref(false)

const currentToken = computed(() => tokens[currentTokenIdx.value])

interface FeihuaCard {
  id: string
  line: string
  author: string
  title: string
  hasChar: boolean
  selected?: boolean
  correct?: boolean
}

const currentFeihuaCards = ref<FeihuaCard[]>([])

function initFeihuaRound() {
  const char = currentToken.value.char
  const allLines: { line: string; author: string; title: string; hasChar: boolean }[] = []

  POETRY_COLLECTION.forEach(p => {
    p.lines.forEach(l => {
      // 避免太長的句子或標點符號問題
      if (l.length >= 4 && l.length <= 14) {
        allLines.push({
          line: l,
          author: p.author,
          title: p.title,
          hasChar: l.includes(char)
        })
      }
    })
  })

  // 抓取 3 句有的，3 句沒有的
  const matching = allLines.filter(x => x.hasChar).sort(() => 0.5 - Math.random()).slice(0, 3)
  const nonMatching = allLines.filter(x => !x.hasChar).sort(() => 0.5 - Math.random()).slice(0, 3)
  const combined = [...matching, ...nonMatching].sort(() => 0.5 - Math.random())

  currentFeihuaCards.value = combined.map((item, idx) => ({
    id: `feihua-${idx}-${Date.now()}`,
    ...item,
    selected: false,
    correct: undefined
  }))
}

function handleSelectFeihuaCard(card: FeihuaCard) {
  if (card.selected) return
  card.selected = true
  if (card.hasChar) {
    card.correct = true
    feihuaScore.value += 10 + feihuaCombo.value * 2
    feihuaCombo.value++
    playCorrectSound()
    if (feihuaCombo.value % 3 === 0) playComboSound(feihuaCombo.value)
    gamificationStore.exp += 5

    // 雅士對手即時對答
    const verseObj = selectedRival.value.verses[currentToken.value.char]
    if (verseObj) {
      rivalResponse.value = {
        line: verseObj.line,
        work: verseObj.work,
        poet: selectedRival.value.name,
      }
    }
  } else {
    card.correct = false
    feihuaCombo.value = 0
    playWrongSound()
  }

  // 檢查是否所有符合條件的都找出來了
  const remainingTargets = currentFeihuaCards.value.filter(c => c.hasChar && !c.selected)
  if (remainingTargets.length === 0) {
    // 過關下一輪
    setTimeout(() => {
      if (feihuaRound.value < 5) {
        feihuaRound.value++
        currentTokenIdx.value = (currentTokenIdx.value + 1) % tokens.length
        initFeihuaRound()
      } else {
        feihuaGameOver.value = true
        playVictorySound()
      }
    }, 1200)
  }
}

function restartFeihua() {
  feihuaScore.value = 0
  feihuaCombo.value = 0
  feihuaRound.value = 1
  feihuaGameOver.value = false
  rivalResponse.value = null
  currentTokenIdx.value = Math.floor(Math.random() * tokens.length)
  initFeihuaRound()
}

// ──────────────────────────────────────────────
// Game 2: 碎句拼圖 ‧ 斷簡重圓 (Verse & Prose Puzzle)
// ──────────────────────────────────────────────
interface PuzzleItem {
  id: string
  title: string
  author: string
  fullSentence: string
  chunks: string[]
  zhuyinHint: string
}

const puzzleList: PuzzleItem[] = [
  {
    id: 'puz-1',
    title: '詠鵝',
    author: '駱賓王',
    fullSentence: '白毛浮綠水，紅掌撥清波。',
    chunks: ['白毛', '浮綠水，', '紅掌', '撥清波。'],
    zhuyinHint: 'ㄅㄞˊ ㄇㄠˊ ㄈㄨˊ ㄌㄩˋ ㄕㄨㄟˇ ， ㄏㄨㄥˊ ㄓㄤˇ ㄅㄛ ㄑㄧㄥ ㄅㄛ 。'
  },
  {
    id: 'puz-2',
    title: '登鸛雀樓',
    author: '王之渙',
    fullSentence: '欲窮千里目，更上一層樓。',
    chunks: ['欲窮', '千里目，', '更上', '一層樓。'],
    zhuyinHint: 'ㄩˋ ㄑㄩㄥˊ ㄑㄧㄢ ㄌㄧˇ ㄇㄨˋ ， ㄍㄥˋ ㄕㄤˋ ㄧˋ ㄘㄥˊ ㄌㄡˊ 。'
  },
  {
    id: 'puz-3',
    title: '天淨沙·秋思',
    author: '馬致遠',
    fullSentence: '夕陽西下，斷腸人在天涯。',
    chunks: ['夕陽', '西下，', '斷腸人', '在天涯。'],
    zhuyinHint: 'ㄒㄧˋ ㄧㄤˊ ㄒㄧ ㄒㄧㄚˋ ， ㄉㄨㄢˋ ㄔㄤˊ ㄖㄣˊ ㄗㄞˋ ㄊㄧㄢ ㄧㄚˊ 。'
  },
  {
    id: 'puz-4',
    title: '西江月·夜行黃沙道中',
    author: '辛棄疾',
    fullSentence: '稻花香裡說豐年，聽取蛙聲一片。',
    chunks: ['稻花香裡', '說豐年，', '聽取', '蛙聲一片。'],
    zhuyinHint: 'ㄉㄠˋ ㄏㄨㄚ ㄒㄧㄤ ㄌㄧˇ ㄕㄨㄛ ㄈㄥ ㄋㄧㄢˊ ， ㄊㄧㄥ ㄑㄩˇ ㄨㄚ ㄕㄥ ㄧˊ ㄆㄧㄢˋ 。'
  },
  {
    id: 'puz-5',
    title: '賦得古原草送別',
    author: '白居易',
    fullSentence: '野火燒不盡，春風吹又生。',
    chunks: ['野火', '燒不盡，', '春風', '吹又生。'],
    zhuyinHint: 'ㄧㄝˇ ㄏㄨㄛˇ ㄕㄠ ㄅㄨˊ ㄐㄧㄣˋ ， ㄔㄨㄣ ㄈㄥ ㄔㄨㄟ ㄧㄡˋ ㄕㄥ 。'
  },
  {
    id: 'puz-6',
    title: '道德經',
    author: '老子',
    fullSentence: '千里之行，始於足下。',
    chunks: ['千里', '之行，', '始於', '足下。'],
    zhuyinHint: 'ㄑㄧㄢ ㄌㄧˇ ㄓ ㄒㄧㄥˊ ， ㄕˇ ㄩˊ ㄗㄨˊ ㄒㄧㄚˋ 。'
  },
  {
    id: 'puz-7',
    title: '前赤壁賦',
    author: '蘇軾',
    fullSentence: '寄蜉蝣於天地，渺滄海之一粟。',
    chunks: ['寄蜉蝣', '於天地，', '渺滄海', '之一粟。'],
    zhuyinHint: 'ㄐㄧˋ ㄈㄨˊ ㄧㄡˊ ㄩˊ ㄊㄧㄢ ㄉㄧˋ ， ㄇㄧㄠˇ ㄘㄤ ㄏㄞˇ ㄓ ㄧˊ ㄙㄨˋ 。'
  },
  {
    id: 'puz-8',
    title: '岳陽樓記',
    author: '范仲淹',
    fullSentence: '先天下之憂而憂，後天下之樂而樂。',
    chunks: ['先天下之憂', '而憂，', '後天下之樂', '而樂。'],
    zhuyinHint: 'ㄒㄧㄢ ㄊㄧㄢ ㄒㄧㄚˋ ㄓ ㄧㄡ ㄦˊ ㄧㄡ ， ㄏㄡˋ ㄊㄧㄢ ㄒㄧㄚˋ ㄓ ㄌㄜˋ ㄦˊ ㄌㄜˋ 。'
  },
  {
    id: 'puz-9',
    title: '勸學',
    author: '荀子',
    fullSentence: '青，取之於藍，而青於藍。',
    chunks: ['青，', '取之', '於藍，', '而青', '於藍。'],
    zhuyinHint: 'ㄑㄧㄥ ， ㄑㄩˇ ㄓ ㄩˊ ㄌㄢˊ ， ㄦˊ ㄑㄧㄥ ㄩˊ ㄌㄢˊ 。'
  }
]

const currentPuzzleIdx = ref(0)
const currentPuzzle = computed(() => puzzleList[currentPuzzleIdx.value])
const userPuzzleAnswer = ref<string[]>([])
const availableChunks = ref<string[]>([])
const isPuzzleSuccess = ref(false)

function initPuzzle() {
  userPuzzleAnswer.value = []
  isPuzzleSuccess.value = false
  availableChunks.value = [...currentPuzzle.value.chunks].sort(() => 0.5 - Math.random())
}

function selectChunk(chunk: string) {
  if (isPuzzleSuccess.value) return
  const idx = availableChunks.value.indexOf(chunk)
  if (idx !== -1) {
    availableChunks.value.splice(idx, 1)
    userPuzzleAnswer.value.push(chunk)
  }

  // 檢查是否拼好
  if (availableChunks.value.length === 0) {
    const assembled = userPuzzleAnswer.value.join('')
    if (assembled === currentPuzzle.value.fullSentence) {
      isPuzzleSuccess.value = true
      playVictorySound()
      gamificationStore.exp += 15
    } else {
      playWrongSound()
    }
  }
}

function removeChunk(chunk: string) {
  if (isPuzzleSuccess.value) return
  const idx = userPuzzleAnswer.value.indexOf(chunk)
  if (idx !== -1) {
    userPuzzleAnswer.value.splice(idx, 1)
    availableChunks.value.push(chunk)
  }
}

function nextPuzzle() {
  currentPuzzleIdx.value = (currentPuzzleIdx.value + 1) % puzzleList.length
  initPuzzle()
}

function speakPuzzle() {
  speechService.speakText(currentPuzzle.value.fullSentence)
}

// ──────────────────────────────────────────────
// Game 3: 小狀元闖關 (Scholar Quiz)
// ──────────────────────────────────────────────
interface ScholarQuizQuestion {
  question: string
  options: string[]
  answer: number
  hint: string
  authorAndTitle: string
}

const scholarQuestions: ScholarQuizQuestion[] = [
  {
    question: '「誰知盤中飧，粒粒皆辛苦」這句詩是在提醒我們要珍惜什麼？',
    options: ['糧食飯菜', '金錢銀兩', '漂亮的衣服', '好玩的玩具'],
    answer: 0,
    hint: '「盤中飧」指的就是餐盤裡煮熟的米飯飯菜喔！',
    authorAndTitle: '李紳《憫農》'
  },
  {
    question: '「碧玉妝成一樹高，萬條垂下綠絲絛」描寫的是春天裡的哪種植物？',
    options: ['桃花樹', '柳樹', '松樹', '竹子'],
    answer: 1,
    hint: '長長的枝條垂下來像綠色的絲帶，春風就像剪刀一樣剪出細葉！',
    authorAndTitle: '賀知章《詠柳》'
  },
  {
    question: '被譽為元曲「秋思之祖」、寫下「夕陽西下，斷腸人在天涯」的作者是誰？',
    options: ['關漢卿', '馬致遠', '白樸', '張養浩'],
    answer: 1,
    hint: '他是元曲四大家之一，號東籬，被譽為「曲狀元」！',
    authorAndTitle: '馬致遠《天淨沙·秋思》'
  },
  {
    question: '辛棄疾在《西江月》中寫「聽取蛙聲一片」，請問他在空氣中聞到了什麼香氣？',
    options: ['荷花香', '菊花香', '稻花香', '梅花香'],
    answer: 2,
    hint: '「稻花香裡說豐年，聽取蛙聲一片」！',
    authorAndTitle: '辛棄疾《西江月·夜行黃沙道中》'
  },
  {
    question: '李清照在《如夢令》中划船迷路，最後「爭渡，爭渡」驚起了什麼小動物？',
    options: ['一羣小鴨子', '一灘鷗鷺（水鳥）', '一羣小青蛙', '水裡的金色鯉魚'],
    answer: 1,
    hint: '「爭渡，爭渡，驚起一灘鷗鷺」！',
    authorAndTitle: '李清照《如夢令》'
  }
]

const currentQuizIdx = ref(0)
const quizSelectedOption = ref<number | null>(null)
const isQuizAnswered = ref(false)
const quizScore = ref(0)
const isQuizFinished = ref(false)
const showQuizHint = ref(false)

const currentQuizQ = computed(() => scholarQuestions[currentQuizIdx.value])

function handleSelectQuizOption(optIdx: number) {
  if (isQuizAnswered.value) return
  quizSelectedOption.value = optIdx
  isQuizAnswered.value = true

  if (optIdx === currentQuizQ.value.answer) {
    quizScore.value += 20
    playCorrectSound()
    gamificationStore.exp += 10
  } else {
    playWrongSound()
  }
}

function nextQuizQuestion() {
  if (currentQuizIdx.value < scholarQuestions.length - 1) {
    currentQuizIdx.value++
    quizSelectedOption.value = null
    isQuizAnswered.value = false
    showQuizHint.value = false
  } else {
    isQuizFinished.value = true
    playVictorySound()
  }
}

function restartQuiz() {
  currentQuizIdx.value = 0
  quizSelectedOption.value = null
  isQuizAnswered.value = false
  quizScore.value = 0
  isQuizFinished.value = false
  showQuizHint.value = false
}

// 初始化
initFeihuaRound()
initPuzzle()
</script>

<template>
  <div class="playground-container">
    <!-- Header banner -->
    <div class="playground-hero">
      <div class="hero-left">
        <span class="pill-badge">🎮 寓教於樂 ‧ 金榜擂臺</span>
        <h3 class="hero-title">童趣古文遊樂園</h3>
        <p class="hero-desc">動動手指，在遊戲闖關中把唐詩宋詞元曲輕鬆學好！累積學分衝擊狀元！</p>
      </div>
      <div class="mode-switcher">
        <button
          class="mode-btn"
          :class="{ active: activeMode === 'feihua' }"
          @click="activeMode = 'feihua'"
        >
          <span>🌸 飛花令打擂</span>
        </button>
        <button
          class="mode-btn"
          :class="{ active: activeMode === 'puzzle' }"
          @click="activeMode = 'puzzle'"
        >
          <span>🧩 碎句成詩拼圖</span>
        </button>
        <button
          class="mode-btn"
          :class="{ active: activeMode === 'quiz' }"
          @click="activeMode = 'quiz'"
        >
          <span>👑 小狀元趣味闖關</span>
        </button>
      </div>
    </div>

    <!-- Mode 1: 飛花令 (Feihua Ling) -->
    <div v-if="activeMode === 'feihua'" class="mode-panel feihua-mode">
      <!-- Poet Rivals Selector -->
      <div class="feihua-rivals-bar">
        <span class="rival-label">對弈名家：</span>
        <div class="rival-buttons">
          <button
            v-for="(rival, rIdx) in POET_RIVALS"
            :key="rival.id"
            class="rival-btn"
            :class="{ 'is-active': selectedRivalIdx === rIdx }"
            @click="selectedRivalIdx = rIdx; rivalResponse = null"
          >
            <span class="rival-avatar">{{ rival.avatar }}</span>
            <span class="rival-name">{{ rival.name }}</span>
            <span class="rival-title">{{ rival.title.split(' ‧ ')[1] }}</span>
          </button>
        </div>
      </div>

      <!-- Dialogue Bubble from Poet Sage -->
      <transition name="fade-slide">
        <div v-if="rivalResponse" class="feihua-dialogue-box">
          <div class="dialogue-avatar">{{ selectedRival.avatar }}</div>
          <div class="dialogue-content">
            <div class="dialogue-speaker">{{ rivalResponse.poet }} 笑吟曰：</div>
            <div class="dialogue-line font-serif">「{{ rivalResponse.line }}」</div>
            <div class="dialogue-cite">——《{{ rivalResponse.work }}》· 妙哉！閣下請續接！</div>
          </div>
        </div>
      </transition>

      <div class="game-hud">
        <div class="token-display">
          <span class="token-prefix">當前令牌字：</span>
          <span class="token-char">{{ currentToken.char }}</span>
          <span class="token-hint">（{{ currentToken.hint }}）</span>
        </div>
        <div class="stats-bar">
          <div class="stat-pill score">得分: {{ feihuaScore }}</div>
          <div v-if="feihuaCombo > 1" class="stat-pill combo">🔥 {{ feihuaCombo }} 連擊!</div>
          <div class="stat-pill round">第 {{ feihuaRound }} / 5 輪</div>
        </div>
      </div>

      <div v-if="!feihuaGameOver" class="feihua-cards-grid">
        <div
          v-for="card in currentFeihuaCards"
          :key="card.id"
          class="feihua-card"
          :class="{
            selected: card.selected,
            correct: card.selected && card.correct,
            wrong: card.selected && !card.correct
          }"
          @click="handleSelectFeihuaCard(card)"
        >
          <div class="card-status-icon">
            <span v-if="card.selected && card.correct">✅ 正確！</span>
            <span v-else-if="card.selected && !card.correct">❌ 沒有這個字</span>
            <span v-else>👉 點擊鑑定</span>
          </div>
          <p class="card-line">{{ card.line }}</p>
          <div class="card-author">—— {{ card.author }}《{{ card.title }}》</div>
        </div>
      </div>

      <div v-else class="game-over-box">
        <span class="trophy-icon">🏆</span>
        <h4 class="over-title">恭喜通關飛花令擂臺！</h4>
        <p class="over-sub">你總共獲得了 <strong>{{ feihuaScore }}</strong> 分！榮登小學士光榮榜！</p>
        <button class="primary-btn" @click="restartFeihua">再戰一局 🚀</button>
      </div>
    </div>

    <!-- Mode 2: 碎句拼圖 (Verse Puzzle) -->
    <div v-if="activeMode === 'puzzle'" class="mode-panel puzzle-mode">
      <div class="puzzle-header">
        <div class="target-meta">
          <span class="puzzle-badge">名句重組</span>
          <h4 class="target-title">{{ currentPuzzle.author }}《{{ currentPuzzle.title }}》</h4>
        </div>
        <button class="voice-btn" @click="speakPuzzle" title="點擊聽語音朗讀名句">
          🔊 聽語音提示
        </button>
      </div>

      <!-- 拼音/注音提示 -->
      <div class="zhuyin-box">
        <span class="zhuyin-label">注音提示：</span>
        <span class="zhuyin-text">{{ currentPuzzle.zhuyinHint }}</span>
      </div>

      <!-- 放置答題區域 -->
      <div class="answer-zone" :class="{ success: isPuzzleSuccess }">
        <div class="zone-label">你的拼裝卡槽（點擊放回）：</div>
        <div class="placed-chunks">
          <button
            v-for="chunk in userPuzzleAnswer"
            :key="chunk"
            class="chunk-btn placed"
            @click="removeChunk(chunk)"
          >
            {{ chunk }}
          </button>
          <span v-if="userPuzzleAnswer.length === 0" class="empty-hint">
            點擊下方詞塊，按順序拼出完整名句！
          </span>
        </div>
      </div>

      <!-- 候選池 -->
      <div class="pool-zone">
        <div class="zone-label">候選詞塊（點擊加入）：</div>
        <div class="available-chunks">
          <button
            v-for="chunk in availableChunks"
            :key="chunk"
            class="chunk-btn"
            @click="selectChunk(chunk)"
          >
            {{ chunk }}
          </button>
        </div>
      </div>

      <!-- 成功慶祝 -->
      <div v-if="isPuzzleSuccess" class="puzzle-success-banner">
        <span class="sparkle">🎉</span>
        <div class="success-text">
          <strong>太棒了！拼裝成功！</strong>
          <p>「{{ currentPuzzle.fullSentence }}」</p>
        </div>
        <button class="next-btn" @click="nextPuzzle">挑戰下一首 ➡️</button>
      </div>
    </div>

    <!-- Mode 3: 小狀元闖關 (Scholar Quiz) -->
    <div v-if="activeMode === 'quiz'" class="mode-panel quiz-mode">
      <div v-if="!isQuizFinished" class="quiz-box">
        <div class="quiz-hud">
          <span class="quiz-step">題目 {{ currentQuizIdx + 1 }} / {{ scholarQuestions.length }}</span>
          <span class="quiz-score">目前積分: {{ quizScore }} 分</span>
        </div>

        <div class="question-header">
          <h4 class="q-title">{{ currentQuizQ.question }}</h4>
          <span class="q-source">出處：{{ currentQuizQ.authorAndTitle }}</span>
        </div>

        <div class="options-grid">
          <button
            v-for="(opt, idx) in currentQuizQ.options"
            :key="opt"
            class="option-btn"
            :class="{
              selected: quizSelectedOption === idx,
              correct: isQuizAnswered && idx === currentQuizQ.answer,
              wrong: isQuizAnswered && quizSelectedOption === idx && idx !== currentQuizQ.answer
            }"
            @click="handleSelectQuizOption(idx)"
          >
            <span class="opt-prefix">{{ ['A', 'B', 'C', 'D'][idx] }}</span>
            <span class="opt-text">{{ opt }}</span>
          </button>
        </div>

        <div class="quiz-footer-actions">
          <button
            v-if="!showQuizHint && !isQuizAnswered"
            class="hint-btn"
            @click="showQuizHint = true"
          >
            💡 查看錦囊提示
          </button>
          <div v-if="showQuizHint" class="hint-callout">
            <strong>錦囊提示：</strong> {{ currentQuizQ.hint }}
          </div>
          <button
            v-if="isQuizAnswered"
            class="primary-btn next-q-btn"
            @click="nextQuizQuestion"
          >
            {{ currentQuizIdx < scholarQuestions.length - 1 ? '下一題 ➡️' : '查看狀元成績單 📜' }}
          </button>
        </div>
      </div>

      <!-- 測驗結束成績單 -->
      <div v-else class="quiz-result-card">
        <span class="result-seal">💮</span>
        <h4 class="result-title">御賜小狀元及第金榜</h4>
        <div class="result-score-badge">
          得分: {{ quizScore }} / 100
        </div>
        <p class="result-words">
          {{ quizScore >= 80 ? '才高八斗、學富五車！你已經完全掌握了唐詩宋詞元曲的核心精髓！' : '表現很棒喔！溫故而知新，多讀兩遍故事，下次一定能拿滿分！' }}
        </p>
        <button class="primary-btn" @click="restartQuiz">再次挑戰狀元 🔄</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.playground-hero {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed var(--color-border, #e2e8f0);
}

@media (min-width: 768px) {
  .playground-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.pill-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #c05621;
  background: #fffaf0;
  border: 1px solid #feebc8;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  width: fit-content;
}

.hero-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0.25rem 0 0 0;
}

.hero-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted, #718096);
  margin: 0.25rem 0 0 0;
}

.mode-switcher {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mode-btn {
  padding: 0.55rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f7fafc);
  color: var(--color-text-muted, #4a5568);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  background: #edf2f7;
}

.mode-btn.active {
  background: #319795;
  border-color: #319795;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(49, 151, 149, 0.25);
}

/* Game 1: Feihua */
.feihua-rivals-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  background: rgba(201, 169, 110, 0.08);
  border-radius: 12px;
}

.rival-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #744210;
}

.rival-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.rival-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s ease;
}

.rival-btn:hover,
.rival-btn.is-active {
  border-color: #c9a96e;
  background: #fffaf0;
  color: #744210;
  box-shadow: 0 2px 8px rgba(201, 169, 110, 0.25);
}

.rival-avatar {
  font-size: 1rem;
}

.rival-name {
  font-weight: 700;
}

.rival-title {
  font-size: 0.7rem;
  opacity: 0.7;
}

.feihua-dialogue-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  background: linear-gradient(135deg, #fffaf0 0%, #fefcbf 100%);
  border: 1px solid #ecc94b;
  border-radius: 14px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(214, 158, 46, 0.15);
  animation: modal-slide-in 0.25s ease;
}

.dialogue-avatar {
  font-size: 2rem;
  line-height: 1;
}

.dialogue-content {
  flex: 1;
}

.dialogue-speaker {
  font-size: 0.78rem;
  font-weight: 700;
  color: #975a16;
}

.dialogue-line {
  font-size: 1.1rem;
  font-weight: 800;
  color: #744210;
  margin: 2px 0;
  letter-spacing: 0.04em;
}

.dialogue-cite {
  font-size: 0.75rem;
  color: #b7791f;
}

.game-hud {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .game-hud {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.token-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.token-prefix {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.token-char {
  font-size: 2rem;
  font-weight: 900;
  color: #c53030;
  background: #fff5f5;
  border: 2px solid #feb2b2;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.token-hint {
  font-size: 0.85rem;
  color: #718096;
}

.stats-bar {
  display: flex;
  gap: 0.5rem;
}

.stat-pill {
  font-size: 0.825rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
}

.stat-pill.score {
  background: #ebf8ff;
  color: #2b6cb0;
}

.stat-pill.combo {
  background: #fffaf0;
  color: #c05621;
  animation: pulse 1s infinite;
}

.stat-pill.round {
  background: #edf2f7;
  color: #4a5568;
}

.feihua-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .feihua-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feihua-card {
  background: var(--color-bg-subtle, #f8fafc);
  border: 2px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.feihua-card:hover:not(.selected) {
  border-color: #319795;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.feihua-card.correct {
  background: #f0fff4;
  border-color: #48bb78;
}

.feihua-card.wrong {
  background: #fff5f5;
  border-color: #f56565;
  opacity: 0.6;
}

.card-status-icon {
  font-size: 0.75rem;
  font-weight: 700;
  color: #718096;
  margin-bottom: 0.4rem;
}

.correct .card-status-icon {
  color: #276749;
}

.wrong .card-status-icon {
  color: #9b2c2c;
}

.card-line {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text, #1a202c);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.card-author {
  font-size: 0.75rem;
  color: #718096;
}

.game-over-box {
  text-align: center;
  padding: 2.5rem 1rem;
}

.trophy-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.over-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0 0 0.5rem 0;
}

.over-sub {
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 1.25rem;
}

.primary-btn {
  background: #319795;
  color: #ffffff;
  border: none;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.65rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  background: #285e61;
}

/* Game 2: Puzzle */
.puzzle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.puzzle-badge {
  font-size: 0.725rem;
  font-weight: 700;
  color: #2b6cb0;
  background: #ebf8ff;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.target-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0.2rem 0 0 0;
}

.voice-btn {
  background: #edf2f7;
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
}

.zhuyin-box {
  background: #f7fafc;
  border-left: 3px solid #4299e1;
  padding: 0.5rem 0.75rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1.25rem;
  font-size: 0.825rem;
}

.zhuyin-label {
  color: #718096;
  font-weight: 600;
}

.zhuyin-text {
  color: #2b6cb0;
  font-family: monospace;
}

.answer-zone {
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  padding: 1.25rem;
  min-height: 90px;
  margin-bottom: 1.25rem;
  transition: all 0.2s ease;
}

.answer-zone.success {
  background: #f0fff4;
  border-color: #68d391;
  border-style: solid;
}

.zone-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 0.6rem;
}

.placed-chunks, .available-chunks {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chunk-btn {
  background: #ffffff;
  border: 1.5px solid #cbd5e0;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2d3748;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.chunk-btn:hover {
  transform: translateY(-2px);
  border-color: #319795;
}

.chunk-btn.placed {
  background: #ebf8ff;
  border-color: #63b3ed;
  color: #2b6cb0;
}

.empty-hint {
  font-size: 0.875rem;
  color: #a0aec0;
  font-style: italic;
  align-self: center;
}

.pool-zone {
  margin-bottom: 1.25rem;
}

.puzzle-success-banner {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sparkle {
  font-size: 1.75rem;
}

.success-text strong {
  font-size: 1rem;
  color: #22543d;
}

.success-text p {
  font-size: 0.9rem;
  color: #276749;
  margin: 0.2rem 0 0 0;
}

.next-btn {
  background: #38a169;
  color: #ffffff;
  border: none;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
}

/* Game 3: Scholar Quiz */
.quiz-hud {
  display: flex;
  justify-content: space-between;
  font-size: 0.825rem;
  font-weight: 700;
  color: #718096;
  margin-bottom: 1rem;
}

.question-header {
  margin-bottom: 1.25rem;
}

.q-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-text, #1a202c);
  margin: 0 0 0.4rem 0;
  line-height: 1.45;
}

.q-source {
  font-size: 0.775rem;
  color: #a0aec0;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-border, #e2e8f0);
  background: var(--color-bg-subtle, #f8fafc);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.option-btn:hover:not(.selected) {
  border-color: #4299e1;
  background: #ebf8ff;
}

.option-btn.correct {
  background: #f0fff4;
  border-color: #48bb78;
}

.option-btn.wrong {
  background: #fff5f5;
  border-color: #f56565;
}

.opt-prefix {
  width: 1.75rem;
  height: 1.75rem;
  background: #edf2f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  color: #4a5568;
}

.opt-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text, #2d3748);
}

.quiz-footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hint-btn {
  background: transparent;
  border: none;
  color: #d69e2e;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}

.hint-callout {
  background: #fffaf0;
  border: 1px solid #feebc8;
  border-radius: 10px;
  padding: 0.6rem 0.85rem;
  font-size: 0.825rem;
  color: #744210;
}

.quiz-result-card {
  text-align: center;
  padding: 2.5rem 1rem;
}

.result-seal {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #c53030;
  margin: 0 0 0.5rem 0;
}

.result-score-badge {
  display: inline-block;
  background: #fff5f5;
  border: 1.5px solid #feb2b2;
  color: #c53030;
  font-size: 1.1rem;
  font-weight: 800;
  padding: 0.4rem 1.25rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.result-words {
  font-size: 0.95rem;
  color: #4a5568;
  max-width: 480px;
  margin: 0 auto 1.5rem auto;
  line-height: 1.5;
}
</style>
