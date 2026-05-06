import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (token?: string): Socket => {
  // If socket is already connected, don't create a new one
  if (socket?.connected) return socket

  // 1. Priority: Use the token passed as an argument. 
  // 2. Fallback: Look specifically for 'accessToken' as seen in your browser storage.
  const authToken = token || localStorage.getItem('accessToken')

  // Get the base URL from your env and strip the /api suffix for the websocket handshake
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const socketURL = apiURL.replace('/api', '')

  socket = io(socketURL, {
    auth: {
      token: authToken
    },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    withCredentials: true
  })

  socket.on('connect', () => {
    console.log('🚀 Socket connected to Railway')
  })

  socket.on('connect_error', (error) => {
    // If you see 'Authentication error', it means the token was sent but rejected by the server
    console.error('❌ Socket connection error:', error.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('🔌 Socket disconnected')
  }
}

export const getSocket = () => socket