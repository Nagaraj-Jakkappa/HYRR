import { useEffect, useCallback } from 'react'
import { getSocket } from '../services/socket'

export const useSocket = (event: string, handler: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    socket.on(event, handler)
    return () => { socket.off(event, handler) }
  }, [event, handler])
}

export const useSocketEmit = () => {
  return useCallback((event: string, data: any) => {
    const socket = getSocket()
    socket?.emit(event, data)
  }, [])
}
