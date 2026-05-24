import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import Footer from '../components/ui/Footer'
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
    } finally {
      setLoading(false)
    }
  }

  // Auto-hydrate inputs with credentials when user clicks quick access link
  const handleQuickHydrate = () => {
    setForm({ email: 'admin@hyrr.com', password: 'admin123' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col selection:bg-[#5B5FEF]/30">
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo Icon and Welcoming Typography Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#5B5FEF] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5B5FEF]/30 mb-5 transition-transform hover:scale-105 duration-300">
            <svg viewBox="0 0 200 200" className="w-10 h-10">
              <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-[#EEEEF0] tracking-tight">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Sign in to hyrr</p>
        </div>

        {/* Primary Interactive Form Processing Panel */}
        <div className="card p-6 bg-[#13131A] border border-white/[0.05] rounded-[24px] shadow-2xl">
          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-2 font-black">Email</label>
              <input
                className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#5B5FEF]/50 transition-all font-sans"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-2 font-black">Password</label>
              <div className="relative">
                <input
                  className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-xl p-3 pr-11 text-xs text-white outline-none focus:border-[#5B5FEF]/50 transition-all font-sans"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* In-Card Dynamic Demo Access Token Link */}
            <div className="flex justify-between items-center px-1 text-[11px] font-mono">
              <span className="text-gray-500">Instance sandbox bypass:</span>
              <button
                type="button"
                onClick={handleQuickHydrate}
                className="text-gray-400 hover:text-[#3DEBA6] transition-colors font-bold underline decoration-dotted"
                title="Click to automatically fill credentials fields"
              >
                Use Demo Account
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3.5 bg-[#5B5FEF] hover:bg-[#4A4ED9] disabled:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-[#5B5FEF]/10 flex items-center gap-2 text-sm mt-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 font-medium tracking-wide">
            No account? <Link to="/register" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 font-bold ml-1 transition-colors">Sign up free</Link>
          </p>
        </div>

        {/* Footprint Metadata Credentials Helper */}
        <p className="text-center text-[10px] text-gray-600 mt-6 font-mono tracking-wider selection:bg-white/10">
          Demo link contexts: <span className="text-gray-500 font-bold">admin@hyrr.com</span> / <span className="text-gray-500 font-bold">admin123</span>
        </p>
      </div>
      </div>
      <Footer />
    </div>
  )
}