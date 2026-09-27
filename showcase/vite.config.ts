import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: repository name is the base path
export default defineConfig({
  plugins: [react()],
  base: '/Feishu-Quant-Competition/',
})
