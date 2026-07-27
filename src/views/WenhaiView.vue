<script setup lang="ts">
import { computed, ref } from 'vue'
import { WENHAI_RESOURCES } from '@/data/wenhaiResources'
import type { WenhaiResourceKind } from '@/data/wenhaiResources'

type Filter = '全部' | WenhaiResourceKind
const activeFilter = ref<Filter>('全部')
const filters: Filter[] = ['全部', '原典檢索', '善本影像', '註釋賞析', '專題研究']
const resources = computed(() => activeFilter.value === '全部'
  ? WENHAI_RESOURCES
  : WENHAI_RESOURCES.filter(resource => resource.kind === activeFilter.value))
</script>

<template>
  <div class="wenhai-view">
    <header class="wenhai-hero">
      <div class="hero-seal" aria-hidden="true">文海</div>
      <div>
        <p class="eyebrow">經典之外，學問無涯</p>
        <h1>文海</h1>
        <p class="hero-copy">精選十個古文原典、善本、註釋與研究網站。從一句古文出發，循版本、訓詁與歷代評說，走進更廣闊的中文古典文學世界。</p>
      </div>
    </header>

    <nav class="resource-filters" aria-label="文海資源分類">
      <button v-for="filter in filters" :key="filter" :class="{ active: activeFilter === filter }" @click="activeFilter = filter">
        {{ filter }}
      </button>
    </nav>

    <div class="resource-grid">
      <a v-for="(resource, index) in resources" :key="resource.url" class="resource-card" :href="resource.url" target="_blank" rel="noopener noreferrer">
        <div class="card-heading">
          <span class="resource-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="kind">{{ resource.kind }}</span>
        </div>
        <h2>{{ resource.name }}</h2>
        <p class="organization">{{ resource.organization }}</p>
        <p class="description">{{ resource.description }}</p>
        <dl>
          <div><dt>最適合</dt><dd>{{ resource.bestFor }}</dd></div>
          <div><dt>語言</dt><dd>{{ resource.language }}</dd></div>
        </dl>
        <span class="visit">前往網站 <span aria-hidden="true">↗</span></span>
      </a>
    </div>

    <p class="research-note">研究提醒：站外譯文與註釋宜互相比對；正式引用時，請回查底本、版本說明及原網站授權資訊。</p>
  </div>
</template>

<style scoped>
.wenhai-view { max-width: 1080px; margin: 0 auto; }
.wenhai-hero { display: grid; grid-template-columns: auto 1fr; gap: var(--sp-6); align-items: center; padding: var(--sp-8); margin-bottom: var(--sp-6); border: 1px solid var(--c-border-accent); border-radius: var(--radius-xl); background: radial-gradient(circle at 8% 20%, rgba(201,169,110,.16), transparent 34%), var(--c-bg-card); }
.hero-seal { width: 88px; height: 88px; display: grid; place-items: center; border: 2px solid var(--c-gold); color: var(--c-gold); font-family: var(--font-serif); font-size: var(--fs-2xl); letter-spacing: .12em; writing-mode: vertical-rl; }
.eyebrow { color: var(--c-gold); font-size: var(--fs-xs); letter-spacing: .2em; margin-bottom: var(--sp-2); }
h1 { font-family: var(--font-serif); font-size: var(--fs-4xl); color: var(--c-text-primary); margin-bottom: var(--sp-2); }
.hero-copy { max-width: 760px; color: var(--c-text-secondary); line-height: 1.8; }
.resource-filters { display: flex; gap: var(--sp-2); overflow-x: auto; padding-bottom: var(--sp-4); margin-bottom: var(--sp-4); }
.resource-filters button { white-space: nowrap; padding: var(--sp-2) var(--sp-4); border: 1px solid var(--c-border); border-radius: var(--radius-full); background: transparent; color: var(--c-text-muted); cursor: pointer; }
.resource-filters button:hover, .resource-filters button.active { color: var(--c-gold); border-color: var(--c-border-accent); background: var(--c-gold-glow); }
.resource-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-4); }
.resource-card { display: flex; flex-direction: column; min-height: 310px; padding: var(--sp-6); border: 1px solid var(--c-border); border-radius: var(--radius-lg); background: var(--c-bg-card); color: inherit; text-decoration: none; transition: transform var(--duration-fast), border-color var(--duration-fast), background var(--duration-fast); }
.resource-card:hover { transform: translateY(-3px); border-color: var(--c-border-accent); background: var(--c-bg-card-hover); }
.card-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-4); }
.resource-number { color: var(--c-text-muted); font-family: var(--font-serif); }
.kind { padding: 3px 9px; border-radius: var(--radius-full); background: var(--c-gold-glow); color: var(--c-gold); font-size: var(--fs-xs); }
h2 { color: var(--c-text-primary); font-family: var(--font-serif); font-size: var(--fs-xl); }
.organization { margin: var(--sp-1) 0 var(--sp-4); color: var(--c-gold); font-size: var(--fs-xs); }
.description { color: var(--c-text-secondary); line-height: 1.7; font-size: var(--fs-sm); }
dl { margin: var(--sp-4) 0; font-size: var(--fs-xs); }
dl div { display: grid; grid-template-columns: 54px 1fr; gap: var(--sp-2); margin-top: var(--sp-2); }
dt { color: var(--c-text-muted); } dd { color: var(--c-text-secondary); margin: 0; }
.visit { margin-top: auto; color: var(--c-gold); font-size: var(--fs-sm); }
.research-note { margin: var(--sp-8) 0; padding: var(--sp-4); border-left: 3px solid var(--c-gold-dark); color: var(--c-text-muted); font-size: var(--fs-xs); line-height: 1.7; }
@media (max-width: 720px) { .wenhai-hero { grid-template-columns: 1fr; padding: var(--sp-5); } .hero-seal { width: 64px; height: 64px; font-size: var(--fs-lg); } .resource-grid { grid-template-columns: 1fr; } .resource-card { min-height: 0; } }
</style>
