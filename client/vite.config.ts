import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const tailwindScrollbarHide = () => ({
  name: 'tailwind-scrollbar-hide',
})

export default defineConfig({
  plugins: [react(), tailwindcss(), tailwindScrollbarHide()],
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@styles': '/src/app/styles',
    },
  },
  define: {
    'process.env': {}
  },
})
