import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': import.meta.env.VITE_API_BASE_URL, // Backend URL
    },
    port: process.env.PORT || 5173
  },
  // base: './',
  plugins: [react()],
  // build: {
  //   cssCodeSplit: true,
  // },
})
