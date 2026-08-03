<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGamificationStore } from '@/stores/gamification'

const router = useRouter()
const gamification = useGamificationStore()
const mounted = ref(false)
const selectedAnswer = ref<number | null>(null)
const checked = ref(false)
const completed = ref(false)
const savedStreak = ref(3)

const question = {
  prompt: '陶淵明寫「芳草鮮美，落英繽紛」，最主要想營造什麼感受？',
  options: ['戰爭後的荒涼', '桃花林的美麗與神祕', '漁人迷路的恐懼', '村民生活的忙碌'],
  answer: 1,
}

const isCorrect = computed(() => checked.value && selectedAnswer.value === question.answer)
const progress = computed(() => completed.value ? 100 : checked.value ? 75 : selectedAnswer.value !== null ? 55 : 32)

onMounted(() => {
  savedStreak.value = Number(localStorage.getItem('litc-streak') || gamification.streak || 3)
  completed.value = localStorage.getItem('litc-today-complete') === new Date().toDateString()
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
  localStorage.setItem('litc-today-complete', new Date().toDateString())
  localStorage.setItem('litc-streak', String(savedStreak.value))
  gamification.addExp(isCorrect.value ? 20 : 10)
}

function resetQuiz() {
  selectedAnswer.value = null
  checked.value = false
}

function goToText() {
  router.push('/library')
}
</script>

<template>
  <div class="today" :class="{ ready: mounted }">
    <header class="topbar">
      <div>
        <p class="eyebrow">八月三日・今日文學任務</p>
        <h1>嗨，今天讀一小段，<br><em>遇見一個新世界。</em></h1>
      </div>
      <div class="streak" aria-label="連續學習天數">
        <span class="flame">火</span>
        <div><strong>{{ savedStreak }}</strong><small>天連續學習</small></div>
      </div>
    </header>

    <section class="mission-card">
      <div class="mission-head">
        <div>
          <span class="chapter-tag">七年級推薦・約 6 分鐘</span>
          <h2>桃花源記：如果有一個理想世界</h2>
          <p>跟著武陵漁人走進桃花林，看看陶淵明把什麼願望藏在故事裡。</p>
        </div>
        <div class="mission-orbit" aria-hidden="true"><span>桃</span></div>
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
          <div class="panel-label"><span>先讀這一句</span><button @click="goToText">讀完整篇 →</button></div>
          <blockquote>忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。</blockquote>
          <div class="translation">
            <span class="lightbulb">解</span>
            <p><strong>用白話說：</strong>忽然遇見一片桃花林，兩岸綿延數百步，沒有其他樹木；芳草清新美麗，花瓣紛紛飄落。</p>
          </div>
          <details>
            <summary>為什麼「忽逢」很重要？</summary>
            <p>「忽然遇見」讓桃花林像意外開啟的祕密入口，也替後面的理想世界留下神祕感。</p>
          </details>
        </article>

        <article class="quiz-panel">
          <div class="quiz-top"><span class="quiz-pill">理解挑戰</span><span>1 題</span></div>
          <h3>{{ question.prompt }}</h3>
          <div class="answers" role="radiogroup" aria-label="選擇答案">
            <button v-for="(option, index) in question.options" :key="option"
              :class="{ selected: selectedAnswer === index, correct: checked && index === question.answer, wrong: checked && selectedAnswer === index && index !== question.answer }"
              :disabled="checked" role="radio" :aria-checked="selectedAnswer === index" @click="chooseAnswer(index)">
              <span>{{ ['A','B','C','D'][index] }}</span>{{ option }}
            </button>
          </div>
          <button v-if="!checked" class="primary" :disabled="selectedAnswer === null" @click="checkAnswer">確認答案</button>
          <div v-else class="feedback" :class="{ success: isCorrect }">
            <strong>{{ isCorrect ? '答對了！你讀出了文字的氣氛。' : '差一點，答案是 B。' }}</strong>
            <p>「鮮美、繽紛」描寫明亮又不尋常的景色，既美麗，也讓人想知道桃林深處藏著什麼。</p>
            <button v-if="isCorrect" class="primary" @click="finishMission">收下 20 點文學力</button>
            <button v-else class="primary" @click="resetQuiz">帶著提示再試一次</button>
          </div>
        </article>
      </div>

      <div v-else class="complete-state">
        <div class="seal">成</div>
        <p class="eyebrow">今日任務完成</p>
        <h2>你讀懂的不只是一片桃花林</h2>
        <p>陶淵明用美景打開理想世界的入口。當現實不夠美好，文學讓人先想像「世界還能是什麼樣子」。</p>
        <div class="reward-row"><span>+20 文學力</span><span>連續 {{ savedStreak }} 天</span><span>解鎖：桃源初探</span></div>
        <button class="primary" @click="goToText">繼續讀《桃花源記》</button>
      </div>
    </section>

    <section class="explore">
      <div class="section-title"><div><p class="eyebrow">依照今天的心情</p><h2>下一站，想去哪個世界？</h2></div><button @click="goToText">探索全部經典</button></div>
      <div class="worlds">
        <button @click="router.push({ path: '/library', query: { school: 'confucianism' } })"><span class="world-icon peach">仁</span><small>想學待人處事</small><strong>走進《論語》</strong><i>12 分鐘・入門</i></button>
        <button @click="router.push({ path: '/library', query: { school: 'daoism' } })"><span class="world-icon moon">道</span><small>最近有點壓力</small><strong>聽莊子說自由</strong><i>8 分鐘・輕鬆</i></button>
        <button @click="router.push({ path: '/library', query: { school: 'military' } })"><span class="world-icon mountain">謀</span><small>想練策略思考</small><strong>挑戰《孫子兵法》</strong><i>10 分鐘・挑戰</i></button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.today{opacity:0;transform:translateY(10px);transition:.45s ease;max-width:1120px;margin:0 auto;padding-bottom:64px}.today.ready{opacity:1;transform:none}.topbar{display:flex;justify-content:space-between;align-items:flex-start;padding:26px 0 28px}.eyebrow{margin:0 0 8px;color:#ae774d;font:700 12px/1.4 var(--font-sans);letter-spacing:.16em;text-transform:uppercase}.topbar h1{font-size:clamp(30px,4vw,48px);line-height:1.22;margin:0;color:var(--c-text-primary);letter-spacing:.02em}.topbar h1 em{font-style:normal;color:#b9674d}.streak{display:flex;align-items:center;gap:10px;background:rgba(174,119,77,.09);border:1px solid rgba(174,119,77,.24);border-radius:18px;padding:11px 16px}.flame{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#c86f4d;color:white;font:700 13px var(--font-serif)}.streak strong{display:block;font-size:20px;line-height:1}.streak small{color:var(--c-text-muted);font-size:11px}.mission-card{border:1px solid rgba(174,119,77,.22);border-radius:28px;background:linear-gradient(145deg,rgba(255,250,242,.07),rgba(174,119,77,.035));box-shadow:0 24px 70px rgba(21,14,10,.13);overflow:hidden}.mission-head{padding:32px 38px 25px;display:flex;justify-content:space-between;gap:24px;align-items:center;border-bottom:1px solid rgba(174,119,77,.15)}.chapter-tag,.quiz-pill{display:inline-flex;border-radius:999px;padding:6px 11px;background:rgba(185,103,77,.12);color:#bd765e;font:700 12px var(--font-sans)}.mission-head h2{font-size:clamp(24px,3vw,34px);margin:12px 0 8px}.mission-head p{color:var(--c-text-secondary);margin:0}.mission-orbit{width:92px;height:92px;border:1px solid rgba(185,103,77,.25);border-radius:50%;display:grid;place-items:center;position:relative;flex:none}.mission-orbit:before,.mission-orbit:after{content:"";position:absolute;border-radius:50%;border:1px dashed rgba(185,103,77,.2);inset:8px;transform:rotate(25deg)}.mission-orbit span{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:#b8674d;color:#fff;font:700 25px var(--font-serif);box-shadow:0 8px 25px rgba(185,103,77,.25)}.journey{padding:20px 38px}.progress-track{height:6px;border-radius:10px;background:rgba(174,119,77,.12);overflow:hidden}.progress-track i{display:block;height:100%;background:linear-gradient(90deg,#b9674d,#d5a25d);transition:width .5s ease}.steps{display:flex;justify-content:space-between;margin-top:12px;color:var(--c-text-muted);font-size:12px}.steps span{display:flex;align-items:center;gap:6px}.steps b{width:21px;height:21px;display:grid;place-items:center;border-radius:50%;border:1px solid var(--c-border);font-size:10px}.steps .done{color:var(--c-text-primary)}.steps .done b{background:#b9674d;color:white;border-color:#b9674d}.learning-grid{display:grid;grid-template-columns:1.05fr .95fr;border-top:1px solid rgba(174,119,77,.15)}.reading-panel,.quiz-panel{padding:34px 38px}.reading-panel{border-right:1px solid rgba(174,119,77,.15)}.panel-label,.quiz-top,.section-title{display:flex;align-items:center;justify-content:space-between;color:var(--c-text-muted);font-size:12px}.panel-label button,.section-title button{border:0;background:none;color:#b9674d;cursor:pointer}.reading-panel blockquote{font:500 clamp(22px,2.5vw,29px)/1.85 var(--font-serif);letter-spacing:.08em;margin:26px 0;padding-left:20px;border-left:3px solid #b9674d;color:var(--c-text-primary)}.translation{display:flex;gap:12px;background:rgba(174,119,77,.07);padding:15px;border-radius:14px}.translation p{font-size:14px;line-height:1.8;margin:0;color:var(--c-text-secondary)}.lightbulb{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:#d5a25d;color:#332516;flex:none;font-weight:800}details{margin-top:18px;border-top:1px dashed var(--c-border);padding-top:15px;color:var(--c-text-secondary);font-size:14px}summary{color:#b9674d;cursor:pointer;font-weight:700}.quiz-panel h3{font:600 21px/1.55 var(--font-serif);margin:22px 0}.answers{display:grid;gap:10px}.answers button{display:flex;align-items:center;text-align:left;gap:12px;padding:12px 14px;border-radius:12px;border:1px solid var(--c-border);background:rgba(255,255,255,.025);color:var(--c-text-secondary);cursor:pointer;transition:.2s}.answers button:hover:not(:disabled),.answers button.selected{border-color:#b9674d;background:rgba(185,103,77,.09);color:var(--c-text-primary)}.answers button span{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:rgba(174,119,77,.11);font-weight:800}.answers button.correct{border-color:#5b8a72;background:rgba(91,138,114,.13)}.answers button.wrong{border-color:#b85e55;background:rgba(184,94,85,.1)}.primary{width:100%;margin-top:18px;border:0;border-radius:12px;padding:13px 18px;background:#b9674d;color:white;font-weight:800;cursor:pointer;box-shadow:0 8px 22px rgba(185,103,77,.22)}.primary:disabled{opacity:.4;cursor:not-allowed}.feedback{margin-top:16px;padding:14px;border-radius:14px;background:rgba(184,94,85,.09);color:var(--c-text-secondary)}.feedback.success{background:rgba(91,138,114,.1)}.feedback strong{color:var(--c-text-primary)}.feedback p{font-size:13px;line-height:1.7;margin:6px 0 0}.complete-state{text-align:center;padding:50px 30px;border-top:1px solid rgba(174,119,77,.15)}.complete-state>p:not(.eyebrow){max-width:630px;margin:10px auto 22px;color:var(--c-text-secondary);line-height:1.8}.seal{margin:0 auto 17px;width:68px;height:68px;display:grid;place-items:center;border:3px double #b9674d;color:#b9674d;font:700 32px var(--font-serif);transform:rotate(-5deg)}.reward-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.reward-row span{padding:7px 12px;border-radius:99px;background:rgba(91,138,114,.11);color:#6ea286;font-size:12px}.complete-state .primary{width:auto;padding-inline:30px}.explore{margin-top:46px}.section-title h2{margin:0;font-size:25px}.worlds{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px}.worlds button{text-align:left;padding:22px;border:1px solid var(--c-border);border-radius:18px;background:var(--c-bg-card);color:var(--c-text-primary);cursor:pointer;transition:.2s}.worlds button:hover{transform:translateY(-3px);border-color:rgba(185,103,77,.4)}.world-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;margin-bottom:22px;color:white;font:700 18px var(--font-serif)}.peach{background:#b9674d}.moon{background:#527b72}.mountain{background:#6c6888}.worlds small,.worlds strong,.worlds i{display:block}.worlds small{color:var(--c-text-muted)}.worlds strong{font:600 19px var(--font-serif);margin:5px 0 14px}.worlds i{font-style:normal;color:var(--c-text-muted);font-size:11px}
@media(max-width:850px){.learning-grid{grid-template-columns:1fr}.reading-panel{border-right:0;border-bottom:1px solid rgba(174,119,77,.15)}.worlds{grid-template-columns:1fr}.topbar{align-items:center}.mission-head{padding:25px}.mission-orbit{display:none}.reading-panel,.quiz-panel{padding:26px}.steps span{font-size:0}.steps span b{font-size:10px}.steps span:after{content:""}}@media(max-width:560px){.topbar{display:block}.streak{margin-top:18px;width:max-content}.mission-card{border-radius:20px}.journey{padding:18px 24px}.reading-panel blockquote{font-size:20px}.section-title{align-items:flex-end}.section-title button{max-width:90px}}
</style>
