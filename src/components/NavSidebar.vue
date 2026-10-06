<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RedSeal from '@/components/RedSeal.vue'
import ClassicalIcon, { type IconName } from '@/components/ClassicalIcon.vue'
import { THEMATIC_TOPICS } from '@/data/thematicTopics'

const route = useRoute()
const router = useRouter()

interface NavItem {
  icon: IconName
  label: string
  to: string
}

const navItems: NavItem[] = [
  { icon: 'today', label: '今日修持', to: '/' },
  { icon: 'glimpse', label: '驚鴻一瞥', to: '/glimpse' },
  { icon: 'library', label: '典籍文庫', to: '/library' },
  { icon: 'compare', label: '跨派互照', to: '/compare' },
  { icon: 'wenhai', label: '文海觀瀾', to: '/wenhai' },
  { icon: 'profile', label: '修行造詣', to: '/profile' },
  { icon: 'quiz', label: '學問策考', to: '/quiz' },
]

const mobileNavItems: NavItem[] = [
  { icon: 'today', label: '今日', to: '/' },
  { icon: 'glimpse', label: '驚鴻', to: '/glimpse' },
  { icon: 'library', label: '文庫', to: '/library' },
  { icon: 'profile', label: '修行', to: '/profile' },
]

const moreNavItems: NavItem[] = [
  { icon: 'compare', label: '跨派互照', to: '/compare' },
  { icon: 'wenhai', label: '文海觀瀾', to: '/wenhai' },
  { icon: 'quiz', label: '學問策考', to: '/quiz' },
]

const mobileMoreOpen = ref(false)

const isMoreActive = computed(() => {
  return ['/compare', '/wenhai', '/quiz', '/search'].some((path) => route.path.startsWith(path))
})

interface SchoolDot {
  id: string
  name: string
  colorClass: string
}

const schools: SchoolDot[] = [
  { id: 'all', name: '全部', colorClass: 'dot-all' },
  { id: 'daoism', name: '道家', colorClass: 'dot-dao' },
  { id: 'confucianism', name: '儒家', colorClass: 'dot-confucian' },
  { id: 'legalism', name: '法家', colorClass: 'dot-legal' },
  { id: 'mohism', name: '墨家', colorClass: 'dot-mohist' },
  { id: 'military', name: '兵家', colorClass: 'dot-military' },
  { id: 'histories', name: '史書', colorClass: 'dot-histories' },
  { id: 'literature', name: '文學', colorClass: 'dot-literature' },
]

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function navigate(to: string) {
  router.push(to)
}

function goToSchool(schoolId: string) {
  router.push({ path: '/library', query: { school: schoolId } })
}

function isSchoolActive(schoolId: string): boolean {
  if (route.path !== '/library') return false
  const currentSchool = route.query.school || (route.query.topic ? '' : 'all')
  return currentSchool === schoolId
}

function goToTopic(topicId: string) {
  router.push({ path: '/library', query: { topic: topicId } })
}

function isTopicActive(topicId: string): boolean {
  if (route.path !== '/library') return false
  return route.query.topic === topicId
}

const emit = defineEmits<{
  (e: 'open-search'): void
}>()

function triggerSearch() {
  emit('open-search')
}
</script>

<template>
  <!-- Desktop / Tablet Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="sidebar-logo" @click="navigate('/')">
        <RedSeal text="文脈" :size="32" :animate="false" style="margin-right: 10px; flex-shrink: 0;" />
        <div class="logo-title-group">
          <span class="logo-text">經典文脈</span>
          <span class="logo-subtext">ClassicFlow</span>
        </div>
        <span class="logo-icon">經</span>
      </div>

      <!-- Quick Search Button -->
      <button class="search-trigger-btn" @click="triggerSearch">
        <span class="search-trigger-icon">
          <ClassicalIcon name="search" :size="16" />
        </span>
        <span class="search-trigger-text">搜尋全站典籍...</span>
        <kbd class="search-trigger-kbd">Ctrl K</kbd>
      </button>

      <div class="divider sidebar-divider"></div>

      <!-- Scrollable Navigation and Sections -->
      <div class="sidebar-scrollable">
        <!-- Main Navigation -->
        <nav class="sidebar-nav">
          <button
            v-for="item in navItems"
            :key="item.to"
            class="nav-item"
            :class="{ 'is-active': isActive(item.to) }"
            @click="navigate(item.to)"
          >
            <span class="nav-icon">
              <ClassicalIcon :name="item.icon" :size="19" />
            </span>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </nav>

        <div class="divider sidebar-divider"></div>

        <!-- Thematic Exploration Section -->
        <div class="sidebar-section">
          <div class="section-title-wrap">
            <ClassicalIcon name="compass" :size="13" color="var(--c-gold)" />
            <span class="section-title">主題探索</span>
          </div>
          <div class="topics-list">
            <button
              v-for="topic in THEMATIC_TOPICS"
              :key="topic.id"
              class="topic-nav-btn"
              :class="{ 'is-active-topic': isTopicActive(topic.id) }"
              @click="goToTopic(topic.id)"
              :title="topic.summary"
            >
              <span class="topic-seal-mini">{{ topic.sealText }}</span>
              <span class="topic-nav-title">{{ topic.title.split('・')[0] }}</span>
            </button>
          </div>
        </div>

        <div class="divider sidebar-divider"></div>

        <!-- Schools Section -->
        <div class="sidebar-section">
          <div class="section-title-wrap">
            <ClassicalIcon name="history" :size="13" color="var(--c-gold)" />
            <span class="section-title">學派源流</span>
          </div>
          <div class="school-list">
            <div
              v-for="school in schools"
              :key="school.id"
              class="school-group"
            >
              <button
                class="school-item"
                :class="{ 'is-active-school': isSchoolActive(school.id) }"
                @click="goToSchool(school.id)"
              >
                <span class="school-dot" :class="school.colorClass"></span>
                <span class="school-name">{{ school.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom area -->
      <div class="sidebar-footer">
        <div class="footer-left">
          <span class="footer-text font-serif">先秦諸子 ‧ 盛世文華</span>
          <span class="footer-version">典藏 51 部經典</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Bottom Tab Bar -->
  <nav class="mobile-tab-bar" aria-label="行動端導航">
    <button
      v-for="item in mobileNavItems"
      :key="item.to"
      class="tab-item"
      :class="{ 'is-active': isActive(item.to) && !mobileMoreOpen }"
      @click="mobileMoreOpen = false; navigate(item.to)"
    >
      <span class="tab-icon">
        <ClassicalIcon :name="item.icon" :size="20" />
      </span>
      <span class="tab-label">{{ item.label }}</span>
    </button>
    <button
      class="tab-item"
      :class="{ 'is-active': mobileMoreOpen || (isMoreActive && !mobileNavItems.some((i) => isActive(i.to))) }"
      @click="mobileMoreOpen = !mobileMoreOpen"
      aria-label="更多選單"
    >
      <span class="tab-icon">
        <ClassicalIcon name="menu" :size="20" />
      </span>
      <span class="tab-label">更多</span>
    </button>
  </nav>

  <!-- Mobile More Sheet / Drawer -->
  <Transition name="fade">
    <div v-if="mobileMoreOpen" class="mobile-more-backdrop" @click="mobileMoreOpen = false">
      <div class="mobile-more-sheet" @click.stop>
        <div class="mobile-more-header">
          <div class="sheet-title-group">
            <RedSeal text="文庫" :size="24" :animate="false" style="margin-right: 8px;" />
            <span class="mobile-more-title font-serif">研讀與思辨工具</span>
          </div>
          <button class="mobile-more-close" @click="mobileMoreOpen = false" aria-label="關閉選單">
            <ClassicalIcon name="close" :size="20" />
          </button>
        </div>
        <div class="mobile-more-grid">
          <button
            v-for="item in moreNavItems"
            :key="item.to"
            class="more-grid-btn"
            :class="{ 'is-active': isActive(item.to) }"
            @click="mobileMoreOpen = false; navigate(item.to)"
          >
            <span class="more-btn-icon">
              <ClassicalIcon :name="item.icon" :size="20" />
            </span>
            <span class="more-btn-label">{{ item.label }}</span>
          </button>
          <button
            class="more-grid-btn"
            @click="mobileMoreOpen = false; triggerSearch()"
          >
            <span class="more-btn-icon">
              <ClassicalIcon name="search" :size="20" />
            </span>
            <span class="more-btn-label">全站搜尋</span>
          </button>
        </div>

        <div class="mobile-topics-shortcut">
          <span class="mobile-topics-header font-serif">學習主題探索</span>
          <div class="mobile-topics-pills">
            <button
              v-for="topic in THEMATIC_TOPICS"
              :key="topic.id"
              class="mobile-topic-pill"
              :class="{ 'is-active': isTopicActive(topic.id) }"
              @click="mobileMoreOpen = false; goToTopic(topic.id)"
            >
              <span>{{ topic.sealText }}</span> {{ topic.title.split('・')[0] }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Sidebar ── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: 100;
  background: var(--c-bg-sidebar);
  border-right: 1px solid var(--c-border-subtle);
  transition: width var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--sp-5) var(--sp-3);
}

.sidebar-scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
}

.sidebar-scrollable::-webkit-scrollbar {
  width: 3px;
}
.sidebar-scrollable::-webkit-scrollbar-thumb {
  background: rgba(201, 169, 110, 0.2);
  border-radius: 3px;
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  padding: var(--sp-2) var(--sp-2);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background var(--duration-fast) var(--ease-out);
}

.sidebar-logo:hover {
  background: var(--c-bg-card);
}

.logo-title-group {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold), var(--c-gold-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.14em;
}

.logo-subtext {
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--c-text-muted);
  opacity: 0.75;
}

.logo-icon {
  display: none;
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--c-gold);
}

/* ── Search Trigger Button ── */
.search-trigger-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
  padding: 8px 12px;
  background: rgba(201, 169, 110, 0.05);
  border: 1px solid var(--c-border-accent);
  border-radius: var(--radius-md);
  cursor: pointer;
  width: 100%;
  color: var(--c-text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.search-trigger-btn:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-text-primary);
}

.search-trigger-icon {
  display: flex;
  align-items: center;
  color: var(--c-gold);
  opacity: 0.85;
}

.search-trigger-text {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  flex: 1;
  text-align: left;
}

.search-trigger-kbd {
  font-size: 0.65rem;
  padding: 2px 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  color: var(--c-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-divider {
  margin: var(--sp-3) 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--c-border-accent) 30%,
    var(--c-border-accent) 70%,
    transparent
  );
}

/* ── Nav Items ── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  width: 100%;
  text-align: left;
  color: var(--c-text-secondary);
}

.nav-item:hover {
  background: var(--c-bg-card);
  color: var(--c-text-primary);
}

.nav-item.is-active {
  background: var(--c-gold-glow);
  color: var(--c-gold);
  box-shadow: inset 3px 0 0 var(--c-gold);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  color: inherit;
}

.nav-label {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: inherit;
  transition: color var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

/* ── Section Titles ── */
.sidebar-section {
  padding: 0 var(--sp-1);
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--sp-2);
}

.section-title {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: var(--c-gold);
  letter-spacing: 0.12em;
  opacity: 0.9;
}

/* ── Thematic Navigation ── */
.topics-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.topic-nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 7px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(201, 169, 110, 0.1);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-align: left;
}

.topic-nav-btn:hover {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold-light);
}

.topic-nav-btn.is-active-topic {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.topic-seal-mini {
  width: 17px;
  height: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-family: var(--font-serif);
  font-weight: 700;
  border-radius: 3px;
  background: rgba(201, 169, 110, 0.15);
  color: var(--c-gold);
  border: 1px solid rgba(201, 169, 110, 0.3);
  flex-shrink: 0;
}

.topic-nav-title {
  font-size: 0.75rem;
  font-family: var(--font-sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Schools Section ── */
.school-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.school-group {
  display: flex;
}

.school-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.school-item:hover {
  background: var(--c-bg-card);
}

.school-item:hover .school-name {
  color: var(--c-text-primary);
}

.school-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-all { background: var(--c-gold); box-shadow: 0 0 5px rgba(201, 169, 110, 0.4); }
.dot-dao { background: var(--c-accent-dao); box-shadow: 0 0 5px rgba(91, 138, 114, 0.4); }
.dot-legal { background: var(--c-accent-legal); box-shadow: 0 0 5px rgba(139, 94, 94, 0.4); }
.dot-mohist { background: var(--c-accent-mohist); box-shadow: 0 0 5px rgba(94, 110, 139, 0.4); }
.dot-confucian { background: var(--c-accent-confucian); box-shadow: 0 0 5px rgba(181, 141, 61, 0.4); }
.dot-literature { background: var(--c-accent-literature); box-shadow: 0 0 5px rgba(74, 111, 165, 0.4); }
.dot-military { background: var(--c-accent-military); box-shadow: 0 0 5px rgba(166, 75, 75, 0.4); }
.dot-histories { background: var(--c-accent-histories); box-shadow: 0 0 5px rgba(138, 110, 91, 0.4); }

.school-name {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--c-text-muted);
  transition: color var(--duration-fast) var(--ease-out);
}

.school-item.is-active-school {
  background: var(--c-gold-glow);
}

.school-item.is-active-school .school-name {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

/* ── Footer ── */
.sidebar-footer {
  margin-top: auto;
  padding-top: var(--sp-3);
  border-top: 1px solid var(--c-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-text {
  font-size: 0.72rem;
  color: var(--c-gold);
  opacity: 0.85;
}

.footer-version {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: var(--c-text-muted);
}

/* ── Mobile Bottom Tab Bar ── */
.mobile-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--c-bg-mobile-tab);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--c-border-subtle);
  padding: 4px 10px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  flex: 1;
  max-width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  border-radius: var(--radius-md);
  color: var(--c-text-muted);
  transition: all var(--duration-fast) var(--ease-out);
}

.tab-item.is-active {
  color: var(--c-gold);
  background: var(--c-gold-glow);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-label {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
}

/* ── Mobile More Sheet ── */
.mobile-more-backdrop {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mobile-more-sheet {
  width: 100%;
  max-width: 500px;
  background: var(--c-bg-elevated);
  border-top-left-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-xl);
  border: 1px solid var(--c-border-accent);
  border-bottom: none;
  padding: var(--sp-5) var(--sp-4);
  padding-bottom: calc(var(--sp-6) + env(safe-area-inset-bottom, 0px));
  box-shadow: var(--shadow-lg);
  animation: sheet-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.mobile-more-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-4);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--c-border-subtle);
}

.sheet-title-group {
  display: flex;
  align-items: center;
}

.mobile-more-title {
  font-size: var(--fs-base);
  font-weight: var(--fw-bold);
  color: var(--c-gold);
}

.mobile-more-close {
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
}

.mobile-more-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-2);
}

.more-grid-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border-subtle);
  border-radius: var(--radius-md);
  color: var(--c-text-primary);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.more-grid-btn:hover,
.more-grid-btn.is-active {
  border-color: var(--c-gold);
  background: var(--c-gold-glow);
  color: var(--c-gold);
}

.more-btn-icon {
  display: flex;
  align-items: center;
  color: var(--c-gold);
}

.mobile-topics-shortcut {
  margin-top: var(--sp-4);
  padding-top: var(--sp-3);
  border-top: 1px solid var(--c-border-subtle);
}

.mobile-topics-header {
  display: block;
  font-size: 0.8rem;
  color: var(--c-gold);
  margin-bottom: 8px;
}

.mobile-topics-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mobile-topic-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-full);
  color: var(--c-text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
}

.mobile-topic-pill.is-active {
  background: var(--c-gold-glow);
  border-color: var(--c-gold);
  color: var(--c-gold);
}

.mobile-topic-pill span {
  font-family: var(--font-serif);
  font-weight: 700;
  color: var(--c-gold);
}

/* ── Responsive Collapse Sidebar ── */
@media (max-width: 1024px) {
  .sidebar {
    width: var(--sidebar-collapsed);
  }

  .logo-title-group,
  .nav-label,
  .sidebar-section,
  .sidebar-footer,
  .search-trigger-text,
  .search-trigger-kbd {
    display: none;
  }

  .logo-icon {
    display: block;
  }

  .sidebar-inner {
    align-items: center;
    padding: var(--sp-6) var(--sp-2);
  }

  .nav-item {
    justify-content: center;
    padding: 10px;
  }

  .nav-item.is-active {
    border-left: none;
    background: var(--c-gold-glow);
    border-radius: var(--radius-md);
  }
}

/* ── Mobile: Hide sidebar, show tab bar ── */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .mobile-tab-bar {
    display: flex;
  }
}
</style>
