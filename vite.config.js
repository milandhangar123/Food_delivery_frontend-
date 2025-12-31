import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: false,

    // ⚠️ Vite v3+ safety (terser optional but required in pipeline)
    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios'],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 5173,
  },

  preview: {
    port: 4173,
  },
})
