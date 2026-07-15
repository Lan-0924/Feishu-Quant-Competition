import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/final-alpha-showcase/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'plotly': ['plotly.js-dist-min'],
          'framer': ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-plotly.js'],
        },
      },
    },
  },
})
