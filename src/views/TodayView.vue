<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGamificationStore, RANKS } from '@/stores/gamification'
import { getDueCardIds } from '@/data/db'
import { catalogWorks, catalogChapters } from '@/data/catalog'
import { speechService } from '@/services/speech'
import ClassicalIcon from '@/components/ClassicalIcon.vue'
import { THEMATIC_TOPICS } from '@/data/thematicTopics'
import { KNOWLEDGE_POINTS, getLearningTrackById, type KnowledgePoint } from '@/data/knowledgeGraph'
import { useKnowledgeCollectionStore } from '@/stores/knowledgeCollection'
import KnowledgePointModal from '@/components/KnowledgePointModal.vue'

const router = useRouter()
const gamification = useGamificationStore()
const collectionStore = useKnowledgeCollectionStore()
const mounted = ref(false)
const selectedAnswer = ref<number | null>(null)
const checked = ref(false)
const completed = ref(false)
const savedStreak = ref(3)

const todayKnowledgePoint = computed<KnowledgePoint>(() => {
  const day = new Date().getDate()
  return KNOWLEDGE_POINTS[day % KNOWLEDGE_POINTS.length]
})

const activeTrack = computed(() => {
  return getLearningTrackById(collectionStore.activeTrackId) || null
})

const activeTrackProgress = computed(() => {
  if (!activeTrack.value) return { total: 0, completed: 0, percent: 0 }
  return collectionStore.getTrackProgress(activeTrack.value.id)
})

const selectedKnowledgePoint = ref<KnowledgePoint | null>(null)
const isKnowledgeModalOpen = ref(false)

function openKnowledgePoint(pt: KnowledgePoint) {
  selectedKnowledgePoint.value = pt
  isKnowledgeModalOpen.value = true
}

interface DailyMission {
  id: string
  school: string
  targetRoute: string
  title: string
  subtitle: string
  quote: string
  translation: string
  insightQuestion: string
  insightAnswer: string
  quizPrompt: string
  options: string[]
  answer: number
  quizExplanation: string
  sealChar: string
  tag: string
  rewardTitle: string
  rewardDesc: string
}

const MISSIONS: DailyMission[] = [
  {
    id: 'mission-0',
    school: 'literature',
    targetRoute: '/chapter/gu-wen-guan-zhi_ch-57',
    title: '桃花源記：如果有一個理想世界',
    subtitle: '跟著武陵漁人走進桃花林，看看陶淵明把什麼願望藏在故事裡。',
    quote: '忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。',
    translation: '忽然遇見一片桃花林，兩岸綿延數百步，中間沒有雜樹；芳草清新美麗，花瓣紛紛飄落。',
    insightQuestion: '為什麼「忽逢」很重要？',
    insightAnswer: '「忽然遇見」讓桃花林像意外開啟的祕密入口，也替後面的世外桃源增添神祕超凡之感。',
    quizPrompt: '陶淵明寫「芳草鮮美，落英繽紛」，最主要想營造什麼感受？',
    options: ['戰爭後的荒涼', '桃花林的美麗與神祕', '漁人迷路的恐懼', '村民生活的忙碌'],
    answer: 1,
    quizExplanation: '「鮮美、繽紛」描寫明亮又不尋常的景色，既美麗，也讓人想知道桃林深處藏著什麼。',
    sealChar: '桃',
    tag: '文學經典・約 6 分鐘',
    rewardTitle: '你讀懂的不只是一片桃花林',
    rewardDesc: '陶淵明用美景打開理想世界的入口。當現實不夠美好，文學讓人先想像「世界還能是什麼樣子」。',
  },
  {
    id: 'mission-1',
    school: 'confucianism',
    targetRoute: '/chapter/lun-yu_ch-1',
    title: '論語・學而：學習與喜悅的起點',
    subtitle: '孔子與弟子們探討求學、交友與自我修養之根本大道。',
    quote: '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」',
    translation: '孔子說：學習知識並按時溫習實踐，不也很令人欣喜嗎？有志同道合的朋友從遠方前來交流，不也很快樂嗎？別人不瞭解自己卻不怨恨惱怒，不也是有德的君子嗎？',
    insightQuestion: '「時習」的真正涵義是什麼？',
    insightAnswer: '「時習」不僅是時常複習書本，更是將所學之道於日常生活中適時實踐，達到知行合一。',
    quizPrompt: '「人不知而不慍」中的「慍」字，在此處是什麼意思？',
    options: ['生氣、怨恨', '驕傲、自滿', '悲傷、哭泣', '著急、慌張'],
    answer: 0,
    quizExplanation: '「慍」（yùn）意指心中含怒、心生怨恨。別人不瞭解自己而不怨恨，是君子修養之最高展現。',
    sealChar: '學',
    tag: '儒家四書・約 5 分鐘',
    rewardTitle: '悅納自我與溫潤如玉的智慧',
    rewardDesc: '孔子教我們不向外求認同，而向內求充實。學而時習，生命自能如春風化雨。',
  },
  {
    id: 'mission-2',
    school: 'daoism',
    targetRoute: '/chapter/dao-de-jing_ch-1',
    title: '道德經：探尋天地萬物的源頭',
    subtitle: '老子以五千言洞悉天地玄機，揭示自然無為與守柔處下的哲學。',
    quote: '道可道，非常道；名可名，非常名。無名天地之始；有名萬物之母。',
    translation: '可以用言語表達的道，就不是永恆不變的常道；可以明確命名的名，就不是恆常不變的名。無名是天地的原始開端；有名是化育萬物的根源。',
    insightQuestion: '為什麼道「不可言說」？',
    insightAnswer: '語言概念具有局限與分別心，而「道」是涵蓋天地宇宙之整體本體，超越一切有限之名相。',
    quizPrompt: '老子哲學中「常道」所代表的核心特質為何？',
    options: ['瞬息萬變的人為規矩', '永恆運行、不可拘泥名相之自然大道', '嚴苛的刑罰法制', '世俗追求的榮華富貴'],
    answer: 1,
    quizExplanation: '「常道」指超越時空限制、永恆存在且自然運行的宇宙根本法則。',
    sealChar: '道',
    tag: '道家元典・約 5 分鐘',
    rewardTitle: '體悟大象無形的玄妙境界',
    rewardDesc: '放下執念與世俗定義，方能與萬物相和諧，體會天地大美而不言之至境。',
  },
  {
    id: 'mission-3',
    school: 'daoism',
    targetRoute: '/chapter/zhuangzi_ch-1',
    title: '莊子・逍遙遊：乘天地之正的自由',
    subtitle: '跟隨鯤鵬展翅九萬里，打破心靈的小大之辯與認知邊界。',
    quote: '北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。怒而飛，其翼若垂天之雲。',
    translation: '北方的深海裡有一條大魚，名字叫鯤。鯤的龐大不知有幾千里；變化為大鳥，名字叫鵬。當它奮起展翅高飛時，翅膀就像天邊垂掛的雲彩。',
    insightQuestion: '鯤化為鵬象徵什麼精神境界？',
    insightAnswer: '象徵生命從深潛沉靜的厚積薄發，昇華蛻變為高遠遼闊、俯瞰寰宇的精神自由境界。',
    quizPrompt: '《逍遙遊》中「怒而飛」的「怒」字，其本義為何？',
    options: ['發怒、憤怒', '奮發、振翅用力', '緩慢、遲疑', '悲傷、哀怨'],
    answer: 1,
    quizExplanation: '古漢語中「怒」有奮發、振作之義，「怒而飛」即振奮翅膀全力奮飛。',
    sealChar: '鵬',
    tag: '莊子大宗・約 6 分鐘',
    rewardTitle: '振翅高飛的心靈視野',
    rewardDesc: '走出井底之蛙的狹隘偏見，讓心靈如鵬鳥般乘風而起，翱翔於無窮無盡之逍遙境地。',
  },
  {
    id: 'mission-4',
    school: 'military',
    targetRoute: '/chapter/art-of-war_ch-3',
    title: '孫子兵法・謀攻：不戰而屈人之兵',
    subtitle: '孫武闡述兵家最高戰略哲學：以智謀勝敵，以全勝保國。',
    quote: '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。',
    translation: '既瞭解對方的底細，又深知自己的實力，歷經百戰也不會陷入危境；不瞭解對方但瞭解自己，勝負各半；既不瞭解對方也不瞭解自己，每次交戰必定陷入危殆。',
    insightQuestion: '為何「知彼知己」是致勝核心？',
    insightAnswer: '戰略決策必須建立在客觀資訊與清醒自我認知之上，克服盲目自信與資訊盲區。',
    quizPrompt: '《孫子兵法》認為用兵作戰的最高境界是什麼？',
    options: ['攻城略地、斬敵無數', '不戰而屈人之兵', '憑藉人數優勢正面決戰', '消耗敵國全部糧草'],
    answer: 1,
    quizExplanation: '孫子主張「百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也」，以全勝智謀為上。',
    sealChar: '謀',
    tag: '兵學聖典・約 5 分鐘',
    rewardTitle: '洞察全域的戰略思維',
    rewardDesc: '真正的力量不在於逞凶鬥狠，而在於知己知彼、審時度勢的清醒與謀略。',
  },
  {
    id: 'mission-5',
    school: 'mohism',
    targetRoute: '/chapter/mo-zi_ch-14',
    title: '墨子・兼愛：天下大同的平民悲憫',
    subtitle: '墨翟倡導「兼相愛，交相利」，為天下人奔走呼號的人道主義崇高理想。',
    quote: '若使天下兼相愛，愛人若愛其身，猶有不孝者乎？視父兄與君若其身，惡施不孝？',
    translation: '如果使天下所有人都能普遍相愛，愛護他人如同愛護自己一樣，還會有不孝順的人嗎？看待父親、兄長與君主如同對待自己一樣，怎麼會做出不孝的事呢？',
    insightQuestion: '「兼愛」與儒家「仁愛」有何不同？',
    insightAnswer: '儒家主張有親疏厚薄之差等之愛，墨家主張無差別、平等的兼愛天下，強調實踐與互利。',
    quizPrompt: '墨家學派所提出的核心功利主張是下列何者？',
    options: ['嚴刑重賞', '兼相愛，交相利', '無為而治', '獨尊儒術'],
    answer: 1,
    quizExplanation: '墨子強調兼相愛必須落實為「交相利」，即互利共贏、造福全體平民百姓。',
    sealChar: '兼',
    tag: '墨家顯學・約 5 分鐘',
    rewardTitle: '摩頂放踵的博愛胸懷',
    rewardDesc: '墨子以苦行救世之熱情，教導我們超越私欲分別，共同關懷天下每一個人的福祉。',
  },
]

// Determine daily mission based on day of year
const now = new Date()
const startOfYear = new Date(now.getFullYear(), 0, 0)
const diff = now.getTime() - startOfYear.getTime()
const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
const missionIndex = dayOfYear % MISSIONS.length
const currentMission = MISSIONS[missionIndex]

const numToChineseMap = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一']
const monthChinese = numToChineseMap[now.getMonth() + 1] || `${now.getMonth() + 1}`
const dateChinese = numToChineseMap[now.getDate()] || `${now.getDate()}`
const todayDateString = `${monthChinese}月${dateChinese}日・今日經典修持`

const isCorrect = computed(() => checked.value && selectedAnswer.value === currentMission.answer)
const progress = computed(() => completed.value ? 100 : checked.value ? 75 : selectedAnswer.value !== null ? 55 : 32)

const dueCardsByWork = ref<{ workId: string, workTitle: string, count: number, firstChapterId: string }[]>([])
const totalDueCount = ref(0)
const isDueCardsLoaded = ref(false)

const currentRankObj = computed(() => {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (gamification.exp >= r.minExp) rank = r
    else break
  }
  return rank
})

function reviewAllDue() {
  if (dueCardsByWork.value.length > 0) {
    router.push(`/chapter/${dueCardsByWork.value[0].firstChapterId}`)
  }
}

onMounted(async () => {
  savedStreak.value = Number(localStorage.getItem('litc-streak') || gamification.streak || 3)
  completed.value = localStorage.getItem('litc-today-complete') === now.toDateString()

  try {
    const dueIds = await getDueCardIds()
    totalDueCount.value = dueIds.length
    if (dueIds.length > 0) {
      const workMap = new Map<string, { workId: string, workTitle: string, count: number, firstChapterId: string }>()
      dueIds.forEach((id) => {
        const chapter = catalogChapters.find((ch) => id.startsWith(ch.id + '_'))
        if (chapter) {
          const work = catalogWorks.find((w) => w.id === chapter.workId)
          if (work) {
            if (!workMap.has(work.id)) {
              workMap.set(work.id, { workId: work.id, workTitle: work.title, count: 0, firstChapterId: chapter.id })
            }
            workMap.get(work.id)!.count++
          }
        }
      })
      dueCardsByWork.value = Array.from(workMap.values())
    }
  } catch (err) {
    console.error('Failed to load due cards:', err)
  } finally {
    isDueCardsLoaded.value = true
  }

  requestAnimationFrame(() => { mounted.value = true })
})

function chooseAnswer(index: number) {
  if (checked.value) return
  selectedAnswer.value = index
}

function checkAnswer() {
  if (selectedAnswer.value === null) return
  checked.value = true
}

function finishMission() {
  completed.value = true
  localStorage.setItem('litc-today-complete', now.toDateString())
  savedStreak.value += 1
  localStorage.setItem('litc-streak', String(savedStreak.value))
  gamification.addExp(isCorrect.value ? 25 : 15)
}

function resetQuiz() {
  selectedAnswer.value = null
  checked.value = false
}

function goToText() {
  router.push(currentMission.targetRoute)
}

function goToTopic(topicId: string) {
  router.push({ path: '/library', query: { topic: topicId } })
}

const isQuoteSpeaking = computed(() => {
  return speechService.state.currentPassageId === currentMission.id && speechService.state.isPlaying && !speechService.state.isPaused
})

function playMissionQuote() {
  speechService.speakPassage(currentMission.id, currentMission.quote, 'canonical', {
    workTitle: currentMission.title,
    chapterTitle: currentMission.title,
    canonicalText: currentMission.quote,
    vernacularText: currentMission.translation,
  })
}

onUnmounted(() => {
  speechService.stop()
})
</script>

<template>
  <div class="today" :class="{ ready: mounted }">
    <header class="topbar">
      <div>
        <p class="eyebrow font-serif">{{ todayDateString }}</p>
        <h1 class="font-serif">每日讀一段古文名篇，<br><em>涵泳天地間至美智慧。</em></h1>
      </div>
      <div class="streak" aria-label="連續學習天數">
        <span class="flame">
          <ClassicalIcon name="flame" :size="20" color="#fff" />
        </span>
        <div>
          <strong>{{ savedStreak }}</strong>
          <small>天連續修持</small>
        </div>
      </div>
    </header>

    <!-- Daily Mission Card -->
    <section class="mission-card">
      <div class="mission-head">
        <div>
          <span class="chapter-tag">{{ currentMission.tag }}</span>
          <h2 class="font-serif">{{ currentMission.title }}</h2>
          <p>{{ currentMission.subtitle }}</p>
        </div>
        <div class="mission-orbit" aria-hidden="true">
          <span>{{ currentMission.sealChar }}</span>
        </div>
      </div>

      <div class="journey" aria-label="今日任務進度">
        <div class="progress-track"><i :style="{ width: `${progress}%` }"></i></div>
        <div class="steps">
          <span class="done"><b>1</b>進入情境</span>
          <span :class="{ done: selectedAnswer !== null }"><b>2</b>讀懂名句</span>
          <span :class="{ done: checked }"><b>3</b>挑戰一題</span>
          <span :class="{ done: completed }"><b>4</b>收下心得</span>
        </div>
      </div>

      <div v-if="!completed" class="learning-grid">
        <article class="reading-panel">
          <div class="panel-label">
            <span>先讀這一句</span>
            <button class="read-full-link" @click="goToText">
              <span>讀完整篇</span>
              <ClassicalIcon name="arrow-right" :size="13" />
            </button>
          </div>
          <blockquote class="font-serif">{{ currentMission.quote }}</blockquote>
          <div class="today-quote-audio-bar">
            <button
              type="button"
              class="today-audio-btn"
              :class="{ 'is-playing': isQuoteSpeaking }"
              :title="isQuoteSpeaking ? '暫停朗讀' : '聆聽經文原句雅正朗讀'"
              @click="playMissionQuote"
            >
              <ClassicalIcon v-if="isQuoteSpeaking" name="pause" :size="15" />
              <ClassicalIcon v-else name="audio" :size="15" />
              <span v-if="isQuoteSpeaking">暫停誦讀</span>
              <span v-else>聆聽經典雅正誦讀</span>
            </button>
          </div>
          <div class="translation">
            <span class="lightbulb">解</span>
            <p><strong>白話通譯：</strong>{{ currentMission.translation }}</p>
          </div>
          <details>
            <summary>{{ currentMission.insightQuestion }}</summary>
            <p>{{ currentMission.insightAnswer }}</p>
          </details>
        </article>

        <article class="quiz-panel">
          <div class="quiz-top">
            <span class="quiz-pill">理解挑戰</span>
            <span>1 題</span>
          </div>
          <h3 class="font-serif">{{ currentMission.quizPrompt }}</h3>
          <div class="answers" role="radiogroup" aria-label="選擇答案">
            <button
              v-for="(option, index) in currentMission.options"
              :key="option"
              :class="{
                selected: selectedAnswer === index,
                correct: checked && index === currentMission.answer,
                wrong: checked && selectedAnswer === index && index !== currentMission.answer,
              }"
              :disabled="checked"
              role="radio"
              :aria-checked="selectedAnswer === index"
              @click="chooseAnswer(index)"
            >
              <span>{{ ['A', 'B', 'C', 'D'][index] }}</span>{{ option }}
            </button>
          </div>
          <button v-if="!checked" class="primary" :disabled="selectedAnswer === null" @click="checkAnswer">
            確認答案
          </button>
          <div v-else class="feedback" :class="{ success: isCorrect }">
            <strong>{{ isCorrect ? '答對了！你精準體悟了經文奧義。' : `差一點，正確答案是 ${['A', 'B', 'C', 'D'][currentMission.answer]}。` }}</strong>
            <p>{{ currentMission.quizExplanation }}</p>
            <button v-if="isCorrect" class="primary" @click="finishMission">收下 25 點文學力</button>
            <button v-else class="primary" @click="resetQuiz">帶著提示再試一次</button>
          </div>
        </article>
      </div>

      <div v-else class="complete-state">
        <div class="seal">{{ currentMission.sealChar }}</div>
        <p class="eyebrow font-serif">今日修持圓滿達成</p>
        <h2 class="font-serif">{{ currentMission.rewardTitle }}</h2>
        <p>{{ currentMission.rewardDesc }}</p>
        <div class="reward-row">
          <span>+25 文學力</span>
          <span>連續 {{ savedStreak }} 天</span>
          <span>解鎖：經文心得印記</span>
        </div>
        <button class="primary" @click="goToText">深入研讀整篇典籍</button>
      </div>
    </section>

    <!-- SRS Due Review Section -->
    <section class="srs-review glass-card">
      <div class="section-title">
        <div class="section-title-header">
          <ClassicalIcon name="library" :size="20" color="var(--c-gold)" />
          <h2 class="font-serif">待複習 ‧ {{ totalDueCount }} 句到期</h2>
        </div>
        <button v-if="totalDueCount > 0" class="primary review-btn" @click="reviewAllDue">一鍵溫故</button>
      </div>

      <div class="srs-content stagger-children" v-if="isDueCardsLoaded">
        <div v-if="totalDueCount === 0" class="all-caught-up">
          <ClassicalIcon name="check" :size="18" color="var(--c-accent-dao)" style="margin-right: 6px;" />
          <span>今日進度皆已溫習完畢，心神寧定！</span>
        </div>
        <div v-else class="due-works">
          <div v-for="work in dueCardsByWork" :key="work.workId" class="due-work-card">
            <strong>{{ work.workTitle }}</strong>
            <span class="badge">{{ work.count }} 句</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Weekly Stats Section -->
    <section class="weekly-stats glass-card">
      <div class="section-title">
        <div class="section-title-header">
          <ClassicalIcon name="profile" :size="20" color="var(--c-gold)" />
          <h2 class="font-serif">本週修持統計</h2>
        </div>
      </div>
      <div class="stats-grid stagger-children">
        <div class="stat-box">
          <span class="stat-icon-wrap">
            <ClassicalIcon name="flame" :size="20" color="#b9674d" />
          </span>
          <div class="stat-info">
            <small>連續修持</small>
            <strong>{{ gamification.streak }} 天</strong>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon-wrap">
            <ClassicalIcon name="sparkle" :size="20" color="var(--c-gold)" />
          </span>
          <div class="stat-info">
            <small>累積修為</small>
            <strong>{{ gamification.exp }} 點</strong>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon-wrap">
            <ClassicalIcon name="scholar" :size="20" color="#d5a25d" />
          </span>
          <div class="stat-info">
            <small>目前境界</small>
            <strong>{{ currentRankObj.title }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Knowledge Point Spotlight & Track Progress -->
    <section class="today-knowledge-section">
      <div class="today-knowledge-grid">
        <!-- Card 1: 今日焦點智慧點 -->
        <article class="today-kp-card glass-panel" @click="openKnowledgePoint(todayKnowledgePoint)">
          <div class="kp-card-header">
            <span class="kp-eyebrow font-serif">
              <ClassicalIcon name="lantern" :size="13" color="var(--c-gold)" />
              <span>今日晨昏智慧錦囊</span>
            </span>
            <span class="kp-school-figure">{{ todayKnowledgePoint.primaryFigure }} · 《{{ todayKnowledgePoint.quoteSource.workTitle }}》</span>
          </div>
          <h3 class="kp-card-title font-serif">{{ todayKnowledgePoint.title }}</h3>
          <p class="kp-card-tagline">{{ todayKnowledgePoint.tagline }}</p>
          <blockquote class="kp-card-quote font-serif">
            「{{ todayKnowledgePoint.famousQuote }}」
          </blockquote>
          <div class="kp-card-footer">
            <span class="kp-app-snippet">💡 {{ todayKnowledgePoint.modernApplication.slice(0, 36) }}…</span>
            <span class="kp-enter-link">
              <span>領會此道</span>
              <ClassicalIcon name="arrow-right" :size="12" />
            </span>
          </div>
        </article>

        <!-- Card 2: 當前修習學程進度 -->
        <article v-if="activeTrack" class="today-track-card glass-panel">
          <div class="track-head-row">
            <span class="track-badge font-serif">
              <ClassicalIcon name="compass" :size="13" color="var(--c-gold)" />
              <span>當前進階修習程</span>
            </span>
            <span class="track-count-badge">{{ activeTrackProgress.completed }} / {{ activeTrackProgress.total }} 掌握</span>
          </div>
          <h3 class="track-card-title font-serif">{{ activeTrack.title }}</h3>
          <p class="track-card-benefit">{{ activeTrack.coreBenefit }}</p>
          <div class="track-progress-line">
            <div
              class="track-progress-fill"
              :style="{ width: `${activeTrackProgress.percent}%`, backgroundColor: activeTrack.badgeColor }"
            ></div>
          </div>
          <div class="track-action-row">
            <span class="track-pct-text">已修得 {{ activeTrackProgress.percent }}%</span>
            <button class="btn btn-outline btn-sm track-nav-btn" @click="router.push('/wenhai?tab=tracks')">
              <span>前往文海繼續修習</span>
              <ClassicalIcon name="arrow-right" :size="12" />
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- Thematic Pathways Section -->
    <section class="explore">
      <div class="section-title">
        <div>
          <p class="eyebrow font-serif">依照今天的心境 ‧ 主題尋道</p>
          <h2 class="font-serif">下一站，想遨遊哪個思想世界？</h2>
        </div>
        <button class="explore-all-btn" @click="router.push('/library')">
          <span>探索全部 51 部經典</span>
          <ClassicalIcon name="arrow-right" :size="14" />
        </button>
      </div>

      <div class="worlds-grid">
        <button
          v-for="topic in THEMATIC_TOPICS"
          :key="topic.id"
          class="world-card"
          @click="goToTopic(topic.id)"
        >
          <div class="world-card-top">
            <span class="world-seal">{{ topic.sealText }}</span>
            <span class="world-tag">{{ topic.tags[0] }}</span>
          </div>
          <small class="world-mood">{{ topic.eyebrow }}</small>
          <strong class="world-title font-serif">{{ topic.title }}</strong>
          <p class="world-brief">{{ topic.summary }}</p>
          <div class="world-footer">
            <span class="world-rec-note">{{ topic.recommendations.length }} 部名篇導讀</span>
            <span class="world-arrow">
              <ClassicalIcon name="arrow-right" :size="14" />
            </span>
          </div>
        </button>
      </div>
    </section>

    <!-- Knowledge Point Modal -->
    <KnowledgePointModal
      v-model="isKnowledgeModalOpen"
      :point="selectedKnowledgePoint"
    />
  </div>
</template>

<style scoped>
.today {
  opacity: 0;
  transform: translateY(10px);
  transition: 0.45s ease;
  max-width: 1120px;
  margin: 0 auto;
  padding-bottom: 64px;
}
.today.ready {
  opacity: 1;
  transform: none;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 26px 0 28px;
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--c-gold);
  font: 700 12px/1.4 var(--font-sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.topbar h1 {
  font-size: clamp(26px, 3.6vw, 42px);
  line-height: 1.25;
  margin: 0;
  color: var(--c-text-primary);
  letter-spacing: 0.04em;
}
.topbar h1 em {
  font-style: normal;
  color: #c9a96e;
}
.streak {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(174, 119, 77, 0.09);
  border: 1px solid rgba(174, 119, 77, 0.24);
  border-radius: 18px;
  padding: 11px 18px;
}
.flame {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #c86f4d;
  color: white;
}
.streak strong {
  display: block;
  font-size: 20px;
  line-height: 1;
  color: var(--c-text-primary);
}
.streak small {
  color: var(--c-text-muted);
  font-size: 11px;
}

/* ── Mission Card ── */
.mission-card {
  border: 1px solid rgba(174, 119, 77, 0.22);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255, 250, 242, 0.07), rgba(174, 119, 77, 0.035));
  box-shadow: 0 24px 70px rgba(21, 14, 10, 0.13);
  overflow: hidden;
}
.mission-head {
  padding: 32px 38px 25px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  border-bottom: 1px solid rgba(174, 119, 77, 0.15);
}
.chapter-tag,
.quiz-pill {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(185, 103, 77, 0.12);
  color: var(--c-gold-light);
  font: 700 12px var(--font-sans);
}
.mission-head h2 {
  font-size: clamp(22px, 2.8vw, 32px);
  margin: 12px 0 8px;
  letter-spacing: 0.04em;
}
.mission-head p {
  color: var(--c-text-secondary);
  margin: 0;
}
.mission-orbit {
  width: 92px;
  height: 92px;
  border: 1px solid rgba(185, 103, 77, 0.25);
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  flex: none;
}
.mission-orbit:before,
.mission-orbit:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(185, 103, 77, 0.2);
  inset: 8px;
  transform: rotate(25deg);
}
.mission-orbit span {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #b8674d;
  color: #fff;
  font: 700 25px var(--font-serif);
  box-shadow: 0 8px 25px rgba(185, 103, 77, 0.25);
}
.journey {
  padding: 20px 38px;
}
.progress-track {
  height: 6px;
  border-radius: 10px;
  background: rgba(174, 119, 77, 0.12);
  overflow: hidden;
}
.progress-track i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #b9674d, #d5a25d);
  transition: width 0.5s ease;
}
.steps {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--c-text-muted);
  font-size: 12px;
}
.steps span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.steps b {
  width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  font-size: 10px;
}
.steps .done {
  color: var(--c-text-primary);
}
.steps .done b {
  background: #b9674d;
  color: white;
  border-color: #b9674d;
}
.learning-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  border-top: 1px solid rgba(174, 119, 77, 0.15);
}
.reading-panel,
.quiz-panel {
  padding: 34px 38px;
}
.reading-panel {
  border-right: 1px solid rgba(174, 119, 77, 0.15);
}
.panel-label,
.quiz-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--c-text-muted);
  font-size: 12px;
}
.read-full-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: none;
  color: var(--c-gold);
  cursor: pointer;
  font-size: 0.85rem;
}
.read-full-link:hover {
  color: var(--c-gold-light);
}
.reading-panel blockquote {
  font: 500 clamp(20px, 2.2vw, 26px)/1.8 var(--font-serif);
  letter-spacing: 0.06em;
  margin: 24px 0;
  padding-left: 20px;
  border-left: 3px solid #b9674d;
  color: var(--c-text-primary);
}
.today-quote-audio-bar {
  margin: 16px 0;
}
.today-audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.3);
  color: var(--c-gold-light);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--duration-fast);
}
.today-audio-btn:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
}
.today-audio-btn.is-playing {
  background: var(--c-gold);
  color: #0c0c14;
}
.translation {
  display: flex;
  gap: 12px;
  background: rgba(174, 119, 77, 0.07);
  padding: 15px;
  border-radius: 14px;
}
.translation p {
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
  color: var(--c-text-secondary);
}
.lightbulb {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: #d5a25d;
  color: #332516;
  flex: none;
  font-weight: 800;
}
details {
  margin-top: 18px;
  border-top: 1px dashed var(--c-border);
  padding-top: 15px;
  color: var(--c-text-secondary);
  font-size: 14px;
}
summary {
  color: #b9674d;
  cursor: pointer;
  font-weight: 700;
}
.quiz-panel h3 {
  font-size: 1.15rem;
  line-height: 1.55;
  margin: 22px 0;
}
.answers {
  display: grid;
  gap: 10px;
}
.answers button {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--c-border);
  background: rgba(255, 255, 255, 0.025);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: 0.2s;
}
.answers button:hover:not(:disabled),
.answers button.selected {
  border-color: #b9674d;
  background: rgba(185, 103, 77, 0.09);
  color: var(--c-text-primary);
}
.answers button span {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 8px;
  background: rgba(174, 119, 77, 0.11);
  font-weight: 800;
}
.answers button.correct {
  border-color: #5b8a72;
  background: rgba(91, 138, 114, 0.13);
}
.answers button.wrong {
  border-color: #b85e55;
  background: rgba(184, 94, 85, 0.1);
}
.primary {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 12px;
  padding: 13px 18px;
  background: #b9674d;
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(185, 103, 77, 0.22);
}
.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.feedback {
  margin-top: 16px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(184, 94, 85, 0.09);
  color: var(--c-text-secondary);
}
.feedback.success {
  background: rgba(91, 138, 114, 0.1);
}
.feedback strong {
  color: var(--c-text-primary);
}
.feedback p {
  font-size: 13px;
  line-height: 1.7;
  margin: 6px 0 0;
}
.complete-state {
  text-align: center;
  padding: 50px 30px;
  border-top: 1px solid rgba(174, 119, 77, 0.15);
}
.complete-state > p:not(.eyebrow) {
  max-width: 630px;
  margin: 10px auto 22px;
  color: var(--c-text-secondary);
  line-height: 1.8;
}
.seal {
  margin: 0 auto 17px;
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  border: 3px double #b9674d;
  color: #b9674d;
  font: 700 32px var(--font-serif);
  transform: rotate(-5deg);
}
.reward-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.reward-row span {
  padding: 7px 12px;
  border-radius: 99px;
  background: rgba(91, 138, 114, 0.11);
  color: #6ea286;
  font-size: 12px;
}
.complete-state .primary {
  width: auto;
  padding-inline: 30px;
}

/* ── SRS Review & Weekly Stats ── */
.srs-review,
.weekly-stats {
  margin-top: 36px;
  padding: 30px 36px;
  border-radius: 24px;
  border: 1px solid rgba(174, 119, 77, 0.22);
  background: linear-gradient(145deg, rgba(255, 250, 242, 0.07), rgba(174, 119, 77, 0.035));
  box-shadow: 0 24px 70px rgba(21, 14, 10, 0.13);
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.section-title-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-title h2 {
  margin: 0;
  font-size: 1.35rem;
  color: var(--c-text-primary);
  letter-spacing: 0.04em;
}
.review-btn {
  width: auto;
  margin: 0;
  padding: 9px 20px;
}
.srs-content {
  margin-top: 20px;
}
.all-caught-up {
  color: var(--c-text-secondary);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  background: rgba(174, 119, 77, 0.05);
  border-radius: 12px;
}
.due-works {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.due-work-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--c-border);
  border-radius: 12px;
}
.due-work-card strong {
  font-size: 15px;
  color: var(--c-text-primary);
}
.due-work-card .badge {
  background: rgba(185, 103, 77, 0.12);
  color: var(--c-gold);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
}
.stat-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--c-border);
}
.stat-icon-wrap {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(201, 169, 110, 0.1);
  flex-shrink: 0;
}
.stat-info small {
  display: block;
  font-size: 12px;
  color: var(--c-text-muted);
}
.stat-info strong {
  font-size: 18px;
  color: var(--c-text-primary);
}

/* ── Explore Thematic Pathways ── */
.explore {
  margin-top: 48px;
}
.explore-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--c-border-accent);
  background: rgba(201, 169, 110, 0.08);
  color: var(--c-gold);
  border-radius: var(--radius-full);
  padding: 8px 18px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--duration-fast);
}
.explore-all-btn:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold-light);
}

.worlds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.world-card {
  text-align: left;
  padding: 22px;
  border: 1px solid var(--c-border);
  border-radius: 18px;
  background: var(--c-bg-card);
  color: var(--c-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
  display: flex;
  flex-direction: column;
}
.world-card:hover {
  transform: translateY(-3px);
  border-color: rgba(185, 103, 77, 0.4);
  box-shadow: var(--shadow-md);
}
.world-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.world-seal {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: 1.5px solid var(--c-gold);
  color: var(--c-gold);
  font: 700 16px var(--font-serif);
  background: rgba(201, 169, 110, 0.1);
}
.world-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
}
.world-mood {
  display: block;
  color: var(--c-gold-dark);
  font-size: 0.75rem;
  margin-bottom: 4px;
}
.world-title {
  display: block;
  font-size: 1.15rem;
  margin-bottom: 8px;
  color: var(--c-text-primary);
}
.world-brief {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--c-text-secondary);
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.world-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--c-border-subtle);
}
.world-rec-note {
  font-size: 0.75rem;
  color: var(--c-gold);
}
.world-arrow {
  color: var(--c-gold);
  transition: transform var(--duration-fast);
}
.world-card:hover .world-arrow {
  transform: translateX(4px);
}

/* Today Knowledge Point & Learning Track */
.today-knowledge-section {
  margin: 32px 0 36px 0;
}
.today-knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 20px;
}
.today-kp-card,
.today-track-card {
  padding: 24px;
  border-radius: var(--radius-lg, 12px);
  display: flex;
  flex-direction: column;
  transition: all var(--duration-fast, 0.2s) ease;
  position: relative;
  overflow: hidden;
}
.today-kp-card {
  cursor: pointer;
}
.today-kp-card:hover {
  transform: translateY(-2px);
  border-color: var(--c-gold);
  box-shadow: 0 8px 24px rgba(174, 119, 77, 0.12);
}
.kp-card-header,
.track-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.kp-eyebrow,
.track-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--c-gold-dark, #8b5a2b);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.kp-school-figure {
  font-size: 0.8rem;
  color: var(--c-text-muted);
}
.track-count-badge {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(174, 119, 77, 0.1);
  color: var(--c-gold-dark, #8b5a2b);
}
.kp-card-title,
.track-card-title {
  font-size: 1.28rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--c-text-primary);
  letter-spacing: 0.02em;
}
.kp-card-tagline,
.track-card-benefit {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--c-text-secondary);
  margin: 0 0 14px 0;
}
.kp-card-quote {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--c-text-primary);
  background: rgba(174, 119, 77, 0.05);
  border-left: 3px solid var(--c-gold);
  padding: 10px 14px;
  margin: 0 0 16px 0;
  border-radius: 0 8px 8px 0;
}
.kp-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px dashed var(--c-border-subtle);
  font-size: 0.82rem;
}
.kp-app-snippet {
  color: var(--c-text-muted);
  flex: 1;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.kp-enter-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-gold-dark, #8b5a2b);
  font-weight: 600;
  flex-shrink: 0;
}
.today-kp-card:hover .kp-enter-link {
  color: var(--c-gold);
}
.track-progress-line {
  width: 100%;
  height: 6px;
  background: var(--c-surface-muted, rgba(0, 0, 0, 0.06));
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 14px;
}
.track-progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.track-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.track-pct-text {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text-muted);
}
.track-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 850px) {
  .learning-grid {
    grid-template-columns: 1fr;
  }
  .reading-panel {
    border-right: 0;
    border-bottom: 1px solid rgba(174, 119, 77, 0.15);
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .today-knowledge-grid {
    grid-template-columns: 1fr;
  }
  .topbar {
    align-items: center;
  }
  .mission-head {
    padding: 25px;
  }
  .mission-orbit {
    display: none;
  }
  .reading-panel,
  .quiz-panel {
    padding: 26px;
  }
}
</style>
