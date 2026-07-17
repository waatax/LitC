<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  { id: 'syncretism', name: '儒釋道', colorClass: 'dot-syncretism' },
]

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function navigate(to: string) {
  router.push(to)
}
</script>

<template>
  <!-- Desktop / Tablet Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="sidebar-logo" @click="navigate('/')">
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
            class="school-item"
          >
            <span class="school-dot" :class="school.colorClass"></span>
            <span class="school-name">{{ school.name }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom area -->
      <div class="sidebar-footer">
        <span class="footer-text">ClassicFlow</span>
        <span class="footer-version">v0.1</span>
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
  background: linear-gradient(
    180deg,
    rgba(12, 12, 20, 0.97) 0%,
    rgba(6, 6, 11, 0.99) 100%
  );
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
  gap: var(--sp-2);
}

.school-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-1) var(--sp-2);
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

.school-name {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

/* ── Footer ── */
.sidebar-footer {
  margin-top: auto;
  padding: var(--sp-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.footer-text {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.footer-version {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  opacity: 0.5;
}

/* ── Mobile Bottom Tab Bar ── */
.mobile-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(12, 12, 20, 0.95);
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

/* ── Tablet: Collapse to icons ── */
@media (max-width: 1024px) {
  .sidebar {
    width: var(--sidebar-collapsed);
  }

  .logo-text,
  .nav-label,
  .section-title,
  .school-name,
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
