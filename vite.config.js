import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,

    // ✅ Use esbuild only
    minify: 'esbuild',

    // ✅ esbuild way to remove console/debugger
    esbuild: {
      drop: ['console', 'debugger'],
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
