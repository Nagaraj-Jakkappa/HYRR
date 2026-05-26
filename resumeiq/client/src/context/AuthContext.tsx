import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'
import { connectSocket, disconnectSocket } from '../services/socket'

interface User { _id: string; name: string; email: string; role: string; createdAt: string; plan: string; scansUsed: number; scansLimit: number }
interface AuthCtx { user: User | null; loading: boolean; login: (e: string, p: string) => Promise<void>; register: (n: string, e: string, p: string, plan?: string, utr?: string) => Promise<void>; logout: () => void; isAdmin: boolean }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, verify auth by calling /me — cookie is sent automatically
  useEffect(() => {
    authAPI.getMe()
      .then(({ data }) => {
        setUser(data.data.user)
        connectSocket()
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password })
    // Cookie is set by the backend automatically — we only store user in state
    setUser(data.data.user)
    connectSocket()
  }

  const register = async (name: string, email: string, password: string, plan?: string, utr?: string) => {
    const { data } = await authAPI.register({ name, email, password, plan, utr })
    // Cookie is set by the backend automatically — we only store user in state
    setUser(data.data.user)
    connectSocket()
  }

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    // Cookie is cleared by the backend — we only clear React state
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
