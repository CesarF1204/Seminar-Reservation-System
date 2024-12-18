import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.PORT,  // Use Render's provided port, fallback to 3000 if it's not available
  },
  // base: './',
  plugins: [react()],
  // build: {
  //   cssCodeSplit: true,
  // },
})
