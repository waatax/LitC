<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorks } from '@/data'
import RedSeal from '@/components/RedSeal.vue'

const route = useRoute()
const router = useRouter()

interface NavItem {
  icon: string
  label: string
  to: string
}

const navItems: NavItem[] = [
  { icon: '📅', label: '今日', to: '/' },
  { icon: '📚', label: '典籍庫', to: '/library' },
  { icon: '📊', label: '進度', to: '/progress' },
]

interface SchoolDot {
  id: string
  name: string
  colorClass: string
}

const schools: SchoolDot[] = [
  { id: 'daoism', name: '道家', colorClass: 'dot-dao' },
  { id: 'legalism', name: '法家', colorClass: 'dot-legal' },
  { id: 'mohism', name: '墨家', colorClass: 'dot-mohist' },
  { id: 'confucianism', name: '儒家', colorClass: 'dot-confucian' },
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

// ── School Works Sub-list ──
const allWorksList = getWorks()

function getSchoolWorks(schoolId: string) {
  return allWorksList.filter(w => w.schoolId === schoolId)
}

function goToWork(workId: string) {
  router.push({ path: '/library', query: { work: workId } })
}

// ── Theme Management (4 Classical Themes) ──
type ThemeId = 'charcoal' | 'xuan' | 'celadon' | 'cinnabar'

interface ThemeInfo {
  id: ThemeId
  label: string
  icon: string
  isLight: boolean
}

const themes: ThemeInfo[] = [
  { id: 'charcoal', label: '徽墨', icon: '🌑', isLight: false },
  { id: 'xuan', label: '雪宣', icon: '📜', isLight: true },
  { id: 'celadon', label: '青瓷', icon: '🍵', isLight: true },
  { id: 'cinnabar', label: '硃砂', icon: '🏮', isLight: false }
]

const currentTheme = ref<ThemeId>('charcoal')

function setTheme(themeId: ThemeId) {
  currentTheme.value = themeId
  
  // Remove all theme-related classes
  document.documentElement.classList.remove('theme-charcoal', 'theme-xuan', 'theme-celadon', 'theme-cinnabar', 'light-theme')
  
  // Add active theme class
  document.documentElement.classList.add(`theme-${themeId}`)
  
  // Support standard light-theme triggers if light
  const theme = themes.find(t => t.id === themeId)
  if (theme?.isLight) {
    document.documentElement.classList.add('light-theme')
  }
  
  localStorage.setItem('theme', themeId)
}

function cycleTheme() {
  const currentIndex = themes.findIndex(t => t.id === currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  setTheme(themes[nextIndex].id)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as ThemeId
  if (savedTheme && ['charcoal', 'xuan', 'celadon', 'cinnabar'].includes(savedTheme)) {
    setTheme(savedTheme)
  } else {
    // Check if system has light theme or fallback to charcoal
    const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches
    setTheme(isSystemLight ? 'xuan' : 'charcoal')
  }
})
</script>

<template>
  <!-- Desktop / Tablet Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="sidebar-logo" @click="navigate('/')">
        <RedSeal text="文脈" :size="32" :animate="false" style="margin-right: 8px; flex-shrink: 0;" />
        <span class="logo-text">經典文脈</span>
        <span class="logo-icon">經</span>
      </div>

      <div class="divider sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.to"
          class="nav-item"
          :class="{ 'is-active': isActive(item.to) }"
          @click="navigate(item.to)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="divider sidebar-divider"></div>

      <!-- Schools -->
      <div class="sidebar-section">
        <span class="section-title">學派</span>
        <div class="school-list">
          <div
            v-for="school in schools"
            :key="school.id"
            class="school-group"
          >
            <button
              class="school-item"
              @click="goToSchool(school.id)"
            >
              <span class="school-dot" :class="school.colorClass"></span>
              <span class="school-name">{{ school.name }}</span>
            </button>
            <div class="school-works-list">
              <button
                v-for="work in getSchoolWorks(school.id)"
                :key="work.id"
                class="work-sub-item"
                :class="{ 'is-active-work': route.query.work === work.id }"
                @click="goToWork(work.id)"
              >
                {{ work.title }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom area -->
      <div class="sidebar-footer">
        <div class="footer-left">
          <span class="footer-text">ClassicFlow</span>
          <span class="footer-version">v0.1</span>
        </div>
        <button 
          class="theme-toggle-btn" 
          @click="cycleTheme" 
          :title="`目前主題：${themes.find(t => t.id === currentTheme)?.label}。點擊切換`"
        >
          <span style="font-size: 1.15rem;">{{ themes.find(t => t.id === currentTheme)?.icon }}</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile Bottom Tab Bar -->
  <nav class="mobile-tab-bar">
    <button
      v-for="item in navItems"
      :key="item.to"
      class="tab-item"
      :class="{ 'is-active': isActive(item.to) }"
      @click="navigate(item.to)"
    >
      <span class="tab-icon">{{ item.icon }}</span>
      <span class="tab-label">{{ item.label }}</span>
    </button>
    <button class="tab-item theme-toggle-tab" @click="cycleTheme">
      <span class="tab-icon">{{ themes.find(t => t.id === currentTheme)?.icon }}</span>
      <span class="tab-label">{{ themes.find(t => t.id === currentTheme)?.label }}</span>
    </button>
  </nav>
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
  padding: var(--sp-6) var(--sp-4);
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  padding: var(--sp-2) var(--sp-3);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background var(--duration-fast) var(--ease-out);
}

.sidebar-logo:hover {
  background: var(--c-bg-card);
}

.logo-text {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold), var(--c-gold-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.12em;
}

.logo-icon {
  display: none;
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  background: linear-gradient(135deg, var(--c-gold-light), var(--c-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-divider {
  margin: var(--sp-3) var(--sp-2);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--c-border) 30%,
    var(--c-border) 70%,
    transparent
  );
}

/* ── Nav Items ── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: var(--c-bg-card);
}

.nav-item.is-active {
  background: var(--c-gold-glow);
  border-left: 3px solid var(--c-gold);
}

.nav-icon {
  font-size: var(--fs-lg);
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.nav-label {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-secondary);
  transition: color var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.nav-item:hover .nav-label {
  color: var(--c-text-primary);
}

.nav-item.is-active .nav-label {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

/* ── Schools Section ── */
.sidebar-section {
  padding: var(--sp-2) var(--sp-3);
}

.section-title {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: var(--sp-3);
}

.school-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.school-group {
  display: flex;
  flex-direction: column;
}

.school-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-1.5) var(--sp-3);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  outline: none;
}

.school-item:hover {
  background: var(--c-bg-card);
}

.school-item:hover .school-name {
  color: var(--c-text-primary);
}

.school-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-dao {
  background: var(--c-accent-dao);
  box-shadow: 0 0 6px rgba(91, 138, 114, 0.4);
}

.dot-legal {
  background: var(--c-accent-legal);
  box-shadow: 0 0 6px rgba(139, 94, 94, 0.4);
}

.dot-mohist {
  background: var(--c-accent-mohist);
  box-shadow: 0 0 6px rgba(94, 110, 139, 0.4);
}

.dot-syncretism {
  background: var(--c-accent-syncretism);
  box-shadow: 0 0 6px rgba(212, 138, 155, 0.4);
}

.dot-confucian {
  background: var(--c-accent-confucian);
  box-shadow: 0 0 6px rgba(181, 141, 61, 0.4);
}

.dot-literature {
  background: var(--c-accent-literature);
  box-shadow: 0 0 6px rgba(74, 111, 165, 0.4);
}

.school-name {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  transition: color var(--duration-fast) var(--ease-out);
}

/* ── Works Sub-list ── */
.school-works-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 28px;
  margin-top: 2px;
  margin-bottom: var(--sp-1);
}

.work-sub-item {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--sp-1) var(--sp-2);
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-secondary);
  text-align: left;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-sub-item:hover {
  background: var(--c-bg-card);
  color: var(--c-text-primary);
}

.work-sub-item.is-active-work {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

/* ── Footer ── */
.sidebar-footer {
  margin-top: auto;
  padding: var(--sp-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  border-top: 1px solid var(--c-border-subtle);
  padding-top: var(--sp-4);
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  font-weight: var(--fw-medium);
}

.footer-version {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  color: var(--c-text-muted);
  opacity: 0.5;
}

.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--sp-1.5);
  font-size: var(--fs-base);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.theme-toggle-btn:hover {
  background: var(--c-bg-card);
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
  padding: var(--sp-2) var(--sp-4);
  padding-bottom: calc(var(--sp-2) + env(safe-area-inset-bottom, 0px));
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
  outline: none;
}

.tab-item.is-active {
  background: var(--c-gold-glow);
}

.tab-icon {
  font-size: var(--fs-lg);
}

.tab-label {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  color: var(--c-text-muted);
  transition: color var(--duration-fast) var(--ease-out);
}

.tab-item.is-active .tab-label {
  color: var(--c-gold);
  font-weight: var(--fw-medium);
}

/* ── Responsive Collapse Sidebar ── */
@media (max-width: 1024px) {
  .sidebar {
    width: var(--sidebar-collapsed);
  }

  .logo-text,
  .nav-label,
  .section-title,
  .school-name,
  .school-works-list,
  .sidebar-footer {
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
    padding: var(--sp-3);
  }

  .nav-item.is-active {
    border-left: none;
    background: var(--c-gold-glow);
    border-radius: var(--radius-md);
  }

  .school-item {
    justify-content: center;
    padding: var(--sp-2);
  }
}

/* ── Mobile: Hide sidebar, show tab bar ── */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .mobile-tab-bar {
    display: flex;
    justify-content: space-around;
  }
}
</style>
