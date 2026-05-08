import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    }
  },
  build: {
    // 1. Increases the limit from 500kB to 1000kB to silence the warning
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 2. Splits large node_modules into separate files for faster loading
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
})