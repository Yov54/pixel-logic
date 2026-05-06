import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/pixel-logic-dev/',
  plugins: [
    react(),
    tailwindcss(),
  ],

  theme: {
    extend: {
      colors: {
        theme: {
          light: "#F3E9DC",
          sand: "#DAB49D",
          accent: "#C08552",
          mid: "#895737",
          dark: "#5E3023",
        },
      },
    },
  },
})
