import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Order-Me-line-liff',
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  envPrefix: 'APP_',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
