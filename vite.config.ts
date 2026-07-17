import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/LitC/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
