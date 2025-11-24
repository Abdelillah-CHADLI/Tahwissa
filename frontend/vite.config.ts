import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'motion'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        agency: resolve(__dirname, 'agency_dashboard/index.html'),
        traveler: resolve(__dirname, 'traveler-dashboard/index.html'),
      },
    },
  },
})
