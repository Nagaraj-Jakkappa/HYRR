import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (): Socket => {
  // If socket is already connected, don't create a new one
  if (socket?.connected) return socket

  // Get the base URL from your env and strip the /api suffix for the websocket handshake
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const socketURL = apiURL.replace('/api', '')

  // withCredentials: true sends cookies during the WebSocket HTTP handshake
  // No need to pass auth.token — the server reads it from the cookie
  socket = io(socketURL, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    withCredentials: true
  })

  socket.on('connect', () => {
    console.log('🚀 Socket connected to Railway')
  })

  socket.on('connect_error', (error) => {
    // If you see 'Authentication error', it means the cookie was missing or rejected by the server
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