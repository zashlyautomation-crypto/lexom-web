// LEXOM — Vite Configuration
// Tailwind v4 (CSS-first, uses @tailwindcss/vite plugin)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@splinetool')) return 'spline'
          if (id.includes('framer-motion') || id.includes('gsap')) return 'animations'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
