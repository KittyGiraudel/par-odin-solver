import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/web',
  base: '/par-odin-solver/',
  plugins: [react()],
  build: {
    outDir: '../../dist-web',
    emptyOutDir: true,
  },
})
