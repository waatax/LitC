<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { SchoolId } from '@/types/content'
import SchoolBadge from '@/components/SchoolBadge.vue'

const router = useRouter()

interface CompareItem {
  workTitle: string
  chapterTitle: string
  chapterId: string
  schoolId: SchoolId
  author: string
  quote: string
  translation: string
  coreIdea: string
}

interface CompareTheme {
  id: string
  title: string
  subtitle: string
  synthesis: string
  items: CompareItem[]
}

const COMPARISON_THEMES: CompareTheme[] = [
  {
    id: 'dao',
    title: '「道」之辨：宇宙本體與心靈自由',
    subtitle: '探討先秦諸子對宇宙終極規律、生命存在本質與心靈境界的不同體悟。',
    synthesis: '老子著重「道」之超越性與無為自然，為萬物不可言說之母；莊子承繼而發揮為「齊物」與精神逍遙，破除名相執著；荀子則將「道」落實於人道與禮義法度，強調客觀事理與心智解蔽。',
    items: [
      {
        workTitle: '道德經',
        chapterTitle: '第一章',
        chapterId: 'dao-de-jing_ch-1',
        schoolId: 'daoism',
        author: '老子',
        quote: '道可道，非常道；名可名，非常名。無名天地之始；有名萬物之母。',
        translation: '可以用言語表達的道，就不是永恆不變的常道；可以明確命名的名，就不是恆常不變的名。無名是天地的原始開端；有名是化育萬物的根源。',
        coreIdea: '超越語言名相的宇宙本體論，提倡虛靜守柔與反璞歸真。'
      },
      {
        workTitle: '莊子',
        chapterTitle: '齊物論',
        chapterId: 'zhuangzi_ch-2',
        schoolId: 'daoism',
        author: '莊子',
        quote: '道惡乎隱而有真偽？言惡乎隱而有是非？道隱於小成，言隱於榮華。',
        translation: '大道隱蔽在何處而產生真偽？言論隱蔽在何處而產生是非？大道被一偏之見所障蔽，言論被浮華辭藻所掩蓋。',
        coreIdea: '破除相對是非分別，達到齊同萬物、物我兩忘的心靈逍遙境地。'
      },
      {
        workTitle: '荀子',
        chapterTitle: '解蔽篇',
        chapterId: 'xunzi_ch-21',
        schoolId: 'confucianism',
        author: '荀子',
        quote: '凡人之患，蔽於一曲，而暗於大理。心知道，然後可道；可道然後能守道以禁非道。',
        translation: '大凡人的毛病，在於被局部片面所蒙蔽，而無法洞察普遍真理。唯有心靈澈悟大道，才能踐行正道；能踐行正道，才能堅守正道並杜絕不正之道。',
        coreIdea: '批判認識論的片面性，主張以虛壹而靜之心體認禮義常道。'
      }
    ]
  },
  {
    id: 'ren-li',
    title: '「仁與禮」之源：性善性惡與教化秩序',
    subtitle: '儒家內部關於人性本質、道德自律與外在制度的千古之辯。',
    synthesis: '孔子以「仁」為核心道德自覺，「克己復禮」知行合一；孟子推衍為「性善論」，主張擴充四端之心行王道仁政；荀子力主「性惡論」，認為道德乃後天「偽」（人為積習教化）而成，重禮法以化性起偽。',
    items: [
      {
        workTitle: '論語',
        chapterTitle: '顏淵篇',
        chapterId: 'lun-yu_ch-12',
        schoolId: 'confucianism',
        author: '孔子',
        quote: '克己復禮為仁。一日克己復禮，天下歸仁焉。為仁由己，而由人乎哉？',
        translation: '剋制自己的私慾，使言語行動皆符合禮的規範，這就是仁。一旦做到克己復禮，天下人都會稱許你的仁德。實踐仁德完全在於自己，難道還能依賴別人嗎？',
        coreIdea: '道德主體性的確立，外在禮樂與內在仁心的完美合一。'
      },
      {
        workTitle: '孟子',
        chapterTitle: '公孫醜上',
        chapterId: 'meng-zi_ch-3',
        schoolId: 'confucianism',
        author: '孟子',
        quote: '人皆有不忍人之心。無惻隱之心，非人也；無羞惡之心，非人也；無辭讓之心，非人也；無是非之心，非人也。',
        translation: '每個人都有憐憫同情他人的不忍人之心。沒有同情惻隱之心，就不算人；沒有羞恥厭惡之心，就不算人；沒有謙虛推讓之心，就不算人；沒有明辨是非之心，就不算人。',
        coreIdea: '性善論與四端說，主張存心養性、擴充善端以達於聖境。'
      },
      {
        workTitle: '荀子',
        chapterTitle: '性惡篇',
        chapterId: 'xunzi_ch-23',
        schoolId: 'confucianism',
        author: '荀子',
        quote: '人之性惡，其善者偽也。今人之性，生而有好利焉，順是，故爭奪生而辭讓亡焉。',
        translation: '人的天性本是惡的，那些表現出來的善良是後天人為教化的結果。人生來就有貪圖利益的本能，順著這種本能發展，就會產生爭奪而泯滅謙讓。',
        coreIdea: '性惡論與化性起偽，強調師法教化與嚴明禮制的重要性。'
      }
    ]
  },
  {
    id: 'governance',
    title: '「法、術、勢」與「兼愛」：治國理政之道',
    subtitle: '法家嚴刑峻法與墨家平民博愛互助的強烈對比。',
    synthesis: '法家（韓非、商鞅）講求因時立法、信賞必罰與勢位操權，視利益為人際唯一樞紐；墨家則站在平民立場，主張兼相愛、交相利與非攻尚賢，追求社會公義與天下大同。',
    items: [
      {
        workTitle: '韓非子',
        chapterTitle: '五蠹',
        chapterId: 'han-fei-zi_ch-49',
        schoolId: 'legalism',
        author: '韓非',
        quote: '聖人不期脩古，不法常可，論世之事，因為之備。世異則事異，事異則備變。',
        translation: '聖明君主不期望盲目因襲古代，不效法固定不變的成法，而是研討當前時代的客觀現實，並據此制定相應對策。時代不同，事情就不同；事情不同，措施就必須改變。',
        coreIdea: '歷史進化論與法術勢合一，主張依法治國與強化君權。'
      },
      {
        workTitle: '商君書',
        chapterTitle: '更法',
        chapterId: 'shang-jun-shu_ch-1',
        schoolId: 'legalism',
        author: '商鞅',
        quote: '治世不一道，便國不法古。故湯武不循古而王，夏殷不易禮而亡。反古者不可非，而循禮者不足多。',
        translation: '治理國家沒有一成不變的途徑，只要有利於國家就不必效法古制。商湯、周武不遵循舊法而成就王業，夏桀、商紂不變更舊禮卻招致滅亡。',
        coreIdea: '激進變法革新哲學，破除貴族世襲特權以富國強兵。'
      },
      {
        workTitle: '墨子',
        chapterTitle: '兼愛上',
        chapterId: 'mo-zi_ch-14',
        schoolId: 'mohism',
        author: '墨子',
        quote: '若使天下兼相愛，愛人若愛其身，猶有不孝者乎？視父兄與君若其身，惡施不孝？故不孝不慈亡有。',
        translation: '如果使天下所有人都能平等互愛，愛護他人就像愛護自己一樣，還會有不孝順的人嗎？看待別人的父兄和君長如同自己的一樣，又怎會做出不孝的事呢？',
        coreIdea: '無差別的博愛（兼愛）與互利（交相利），消弭階級戰亂。'
      }
    ]
  },
  {
    id: 'military',
    title: '「兵者詭道」與「仁本之兵」：止戈為武',
    subtitle: '戰略智謀與軍事倫理之深刻辯證。',
    synthesis: '《孫子兵法》以深邃謀略著稱，強調以智取勝、全勝保國；《司馬法》與《尉繚子》則更重兵刑之義與師出有名，視用兵為誅暴安良與維護秩序的最後手段。',
    items: [
      {
        workTitle: '孫子兵法',
        chapterTitle: '謀攻篇',
        chapterId: 'art-of-war_ch-3',
        schoolId: 'military',
        author: '孫武',
        quote: '百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。故上兵伐謀，其次伐交，其次伐兵，其下攻城。',
        translation: '百戰百勝還算不上最高明的策略；不用武力交戰就能使敵人屈服，才是最高明的境界。所以最上等的用兵之道是挫敗敵人的戰略計謀。',
        coreIdea: '最高戰略境界在於以謀全勝，避免兩敗俱傷的消耗戰。'
      },
      {
        workTitle: '司馬法',
        chapterTitle: '仁本',
        chapterId: 'si-ma-fa_ch-1',
        schoolId: 'military',
        author: '司馬穰苴',
        quote: '古者以仁為本，以義治之之謂正。正不獲意則權。權出於戰，不出於中人。是故殺人安人，殺之可也；攻其國愛其民，攻之可也。',
        translation: '古時以仁愛為根本，以道義治理天下叫做正道。正道無法達到目的時就採用權變。殺掉殘暴之人以安定百姓，是可以殺的；攻打暴虐之國以愛護其人民，是可以攻打的。',
        coreIdea: '將軍事置於道德倫理之制約下，強調「止戈為武」的正義性。'
      }
    ]
  }
]

const activeThemeId = ref('dao')
const currentTheme = computed(() => {
  return COMPARISON_THEMES.find(t => t.id === activeThemeId.value) || COMPARISON_THEMES[0]
})

function goToChapter(chapterId: string) {
  router.push(`/chapter/${chapterId}`)
}
</script>

<template>
  <div class="compare-view stagger-children">
    <!-- Header -->
    <header class="compare-hero glass-card">
      <div class="hero-icon">⚖️</div>
      <div class="hero-content">
        <span class="hero-eyebrow">思想交鋒 · 異同對讀</span>
        <h1 class="hero-title">跨文本比較閱讀</h1>
        <p class="hero-desc">
          經典非孤立存在，諸子百家同源而異流。精選核心思想專題，將不同典籍之名句同臺對勘，體悟先秦中華思想脈絡之宏大精微。
        </p>
      </div>
    </header>

    <!-- Theme Selector Tabs -->
    <nav class="theme-tabs-nav" aria-label="比較主題選單">
      <button
        v-for="t in COMPARISON_THEMES"
        :key="t.id"
        class="scholarly-pill-tab"
        :class="{ active: activeThemeId === t.id }"
        @click="activeThemeId = t.id"
      >
        <span>{{ t.title.split('：')[0] }}</span>
      </button>
    </nav>

    <!-- Active Theme Card -->
    <div class="theme-intro-card glass-card">
      <h2 class="theme-title">{{ currentTheme.title }}</h2>
      <p class="theme-subtitle">{{ currentTheme.subtitle }}</p>
      <div class="theme-synthesis">
        <span class="synthesis-label">【 異同綜論 】</span>
        <p>{{ currentTheme.synthesis }}</p>
      </div>
    </div>

    <!-- Comparative Column Grid -->
    <div class="compare-grid">
      <div
        v-for="(item, idx) in currentTheme.items"
        :key="item.chapterId"
        class="compare-card glass-card-elevated"
      >
        <div class="card-top">
          <div class="card-meta">
            <SchoolBadge :school-id="item.schoolId" />
            <span class="author-tag">{{ item.author }}</span>
          </div>
          <button class="read-btn btn btn-ghost btn-sm" @click="goToChapter(item.chapterId)">
            閱讀本章 →
          </button>
        </div>

        <div class="card-source">
          <h3 class="work-title">《{{ item.workTitle }}》· {{ item.chapterTitle }}</h3>
        </div>

        <blockquote class="quote-box">
          <p class="classical-text">{{ item.quote }}</p>
        </blockquote>

        <div class="translation-box">
          <span class="box-label">【 白話通釋 】</span>
          <p class="translation-text">{{ item.translation }}</p>
        </div>

        <div class="core-idea-box">
          <span class="box-label">【 核心要旨 】</span>
          <p class="core-idea-text">{{ item.coreIdea }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-view {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  padding-bottom: var(--sp-12);
}

.compare-hero {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  padding: var(--sp-8);
  border-radius: var(--radius-xl);
}

.hero-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  background: var(--c-gold-glow);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.hero-eyebrow {
  font-size: var(--fs-xs);
  color: var(--c-gold);
  letter-spacing: 0.15em;
  font-weight: var(--fw-semibold);
  margin-bottom: var(--sp-1);
  display: block;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.hero-desc {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  line-height: var(--lh-relaxed);
}

.theme-tabs-nav {
  display: flex;
  gap: var(--sp-3);
  overflow-x: auto;
  padding-bottom: var(--sp-2);
}

.theme-intro-card {
  padding: var(--sp-6);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--c-gold);
}

.theme-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  color: var(--c-text-primary);
  margin-bottom: var(--sp-2);
}

.theme-subtitle {
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  margin-bottom: var(--sp-4);
}

.theme-synthesis {
  background: var(--c-bg-card);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-subtle);
}

.synthesis-label {
  font-size: var(--fs-xs);
  color: var(--c-gold-light);
  font-weight: var(--fw-semibold);
  display: block;
  margin-bottom: var(--sp-2);
}

.theme-synthesis p {
  font-size: var(--fs-sm);
  color: var(--c-text-primary);
  line-height: var(--lh-relaxed);
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--sp-6);
}

.compare-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  padding: var(--sp-6);
  border-radius: var(--radius-lg);
  position: relative;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.author-tag {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.read-btn {
  font-size: var(--fs-xs);
  padding: var(--sp-1) var(--sp-3);
}

.card-source {
  border-bottom: 1px solid var(--c-border-subtle);
  padding-bottom: var(--sp-2);
}

.work-title {
  font-family: var(--font-serif);
  font-size: var(--fs-lg);
  color: var(--c-gold);
}

.quote-box {
  background: var(--c-bg-card);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--c-gold);
}

.quote-box .classical-text {
  font-size: var(--fs-lg);
  line-height: var(--lh-loose);
  color: var(--c-text-primary);
}

.box-label {
  font-size: var(--fs-xs);
  color: var(--c-gold-dark);
  font-weight: var(--fw-semibold);
  display: block;
  margin-bottom: var(--sp-1);
}

.translation-box, .core-idea-box {
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--c-text-secondary);
}

.core-idea-box {
  margin-top: auto;
  padding-top: var(--sp-3);
  border-top: 1px dashed var(--c-border-subtle);
}

@media (max-width: 768px) {
  .compare-hero {
    flex-direction: column;
    text-align: center;
    padding: var(--sp-6);
  }

  .compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
