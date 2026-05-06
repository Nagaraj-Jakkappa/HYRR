import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Updated Hyrr Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#5B5FEF] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5B5FEF]/30 glow-blue mb-4">
            <svg viewBox="0 0 200 200" className="w-10 h-10">
              <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#EEEEF0] tracking-tight">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-2">Sign in to hyrr</p>
        </div>

        <div className="card p-6 bg-[#13131A] border border-white/[0.05] rounded-2xl">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label text-gray-400 text-xs font-mono uppercase tracking-wider">Email</label>
              <input
                className="input bg-black/20 border-white/10 text-white focus:border-[#5B5FEF]/50 transition-colors"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label text-gray-400 text-xs font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  className="input pr-10 bg-black/20 border-white/10 text-white focus:border-[#5B5FEF]/50 transition-colors"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3 bg-[#5B5FEF] hover:bg-[#4A4ED9] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#5B5FEF]/20 flex items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account? <Link to="/register" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 font-medium">Sign up free</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-600 mt-6 font-mono">Demo: admin@hyrr.com / admin123</p>
      </div>
    </div>
  )
}