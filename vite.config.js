import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// In dev, proxy /api to the local backend so the Auth.js session cookie stays
// same-origin (no CORS or third-party-cookie problems).
export default defineConfig({
  plugins: [react()],
  resolve: {
    // '@/shared/ui/Button' means src/shared/ui/Button, from anywhere.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': { target: process.env.VITE_API_PROXY ?? 'http://localhost:3000', changeOrigin: true },
    },
  },
})
