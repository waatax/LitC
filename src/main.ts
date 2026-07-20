// Trigger build: 2026-07-17
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Catch global unhandled promise rejections for failed dynamic imports
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    const msg = event.reason.message || ''
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

