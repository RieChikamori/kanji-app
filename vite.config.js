import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { kvgJs } from 'kanjivg-js/vite-plugin'

export default defineConfig({
  base: '/kanji-app/',
  plugins: [react(), kvgJs()],
  server: {
    host: true,
  },
})
