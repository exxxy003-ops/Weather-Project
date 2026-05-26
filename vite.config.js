import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH=/Weather-Project/ in GitHub Actions env vars for GitHub Pages.
// Leave unset (or set to /) for Vercel — it handles the base path automatically.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
