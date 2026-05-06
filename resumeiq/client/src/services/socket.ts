import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) return socket

  // 1. Get the API URL from your environment variables
  // 2. Remove the '/api' suffix because Socket.io usually listens at the root domain
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const socketURL = apiURL.replace('/api', '')

  socket = io(socketURL, {
    auth: { token },
    transports: ['websocket', 'polling'], // Added polling as a fallback
    reconnectionAttempts: 5,
    withCredentials: true // Required for CORS to work with cookies/auth
  })

  socket.on('connect', () => {
    console.log('🚀 Socket connected to Railway')
  })

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket