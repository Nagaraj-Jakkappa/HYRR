import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'
import { connectSocket, disconnectSocket } from '../services/socket'

interface User { _id: string; name: string; email: string; role: string; createdAt: string; plan: string; scansUsed: number; scansLimit: number }
interface AuthCtx { user: User | null; loading: boolean; login: (e: string, p: string) => Promise<void>; register: (n: string, e: string, p: string) => Promise<void>; logout: () => void; isAdmin: boolean }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      authAPI.getMe().then(({ data }) => {
        setUser(data.data.user)
        connectSocket(token)
      }).catch(() => localStorage.clear()).finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    setUser(data.data.user)
    connectSocket(data.data.accessToken)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authAPI.register({ name, email, password })
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    setUser(data.data.user)
    connectSocket(data.data.accessToken)
  }

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    localStorage.clear()
    disconnectSocket()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
