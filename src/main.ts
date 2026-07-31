// Trigger build: 2026-07-17
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Catch global unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    const msg = typeof event.reason === 'string' ? event.reason : (event.reason?.message || String(event.reason))
    const stack = event.reason?.stack || ''

    // Suppress third-party browser extension unhandled rejections (e.g. MetaMask inpage.js)
    if (
      msg.includes('Failed to connect to MetaMask') ||
      stack.includes('chrome-extension://') ||
      stack.includes('moz-extension://')
    ) {
      event.preventDefault()
      console.warn('[Extension Notice] Suppressed unhandled rejection from browser extension:', event.reason)
      return
    }

    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Failed to fetch') ||
      /loading chunk/i.test(msg)
    ) {
      event.preventDefault()
      console.warn('Unhandled rejection from failed dynamic import, reloading...', event.reason)
      window.location.reload()
    }
  }
})

app.mount('#app')

