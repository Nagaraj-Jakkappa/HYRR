import { io, Socket } from 'socket.io-client'
let socket: Socket | null = null
export const connectSocket = (token: string): Socket => {
  if (socket?.connected) return socket
  socket = io('/', { auth: { token }, transports: ['websocket'], reconnectionAttempts: 5 })
  socket.on('connect', () => console.log('Socket connected'))
  return socket
}
export const disconnectSocket = () => { socket?.disconnect(); socket = null }
export const getSocket = () => socket
