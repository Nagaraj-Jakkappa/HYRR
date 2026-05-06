import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     // Add the allowedHosts property here
//     allowedHosts: [
//       'glider-donation-mace.ngrok-free.dev'
//     ],
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true
//       },
//       '/socket.io': {
//         target: 'http://localhost:5000',
//         ws: true,
//         changeOrigin: true
//       },
//     }
//   }
// })

export default defineConfig({
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
  }
})