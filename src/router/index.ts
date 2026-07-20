import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'today',
      component: () => import('@/views/TodayView.vue'),
      meta: { title: '今日' },
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/views/LibraryView.vue'),
      meta: { title: '典籍庫' },
    },
    {
      path: '/chapter/:id',
      name: 'chapter',
      component: () => import('@/views/ChapterView.vue'),
      meta: { title: '閱讀' },
    },
    {
      path: '/learn/:id',
      name: 'learn',
      component: () => import('@/views/LearnView.vue'),
      meta: { title: '學習' },
    },
    {
      path: '/memorize/:id',
      name: 'memorize',
      component: () => import('@/views/MemorizeView.vue'),
      meta: { title: '背誦' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// Update document title on route change
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title
    ? `${title} — 經典文脈 ClassicFlow`
    : '經典文脈 ClassicFlow'
})

// Handle dynamic import failures (e.g. chunk loading errors after new deployments)
router.onError((error) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Failed to fetch') ||
    /loading chunk/i.test(error.message)
  ) {
    console.warn('Dynamic import failed, reloading page to fetch latest version...', error)
    window.location.reload()
  }
})

export default router

