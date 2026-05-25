import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, ScanSearch, Sparkles, FileText, ShieldCheck, Zap } from 'lucide-react'
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

  const handleQuickHydrate = () => {
    setForm({ email: 'admin@hyrr.com', password: 'admin123' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col selection:bg-[#5B5FEF]/30">
      <div className="flex-1 flex">

        {/* ═══════ LEFT BRANDING PANEL ═══════ */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0D0D14]">

          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(91,95,239,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(91,95,239,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Gradient orbs */}
          <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-[#5B5FEF]/15 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#3DEBA6]/10 blur-[100px] rounded-full" />
          <div className="absolute top-[60%] left-[5%] w-[200px] h-[200px] bg-[#F0C060]/8 blur-[80px] rounded-full" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">

            {/* Top: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#5B5FEF] rounded-xl flex items-center justify-center shadow-lg shadow-[#5B5FEF]/25">
                <svg viewBox="0 0 200 200" className="w-6 h-6">
                  <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                  <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                  <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-white">hyrr</span>
            </div>

            {/* Center: Hero message */}
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#5B5FEF]/20 bg-[#5B5FEF]/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#3DEBA6] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B5FEF]">
                  AI-Powered Platform
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-white mb-6">
                Your resume,{' '}
                <span className="bg-gradient-to-r from-[#5B5FEF] to-[#8E91FF] text-transparent bg-clip-text">
                  decoded
                </span>{' '}
                for success.
              </h1>

              <p className="text-gray-400 text-base leading-relaxed mb-10">
                Join thousands of professionals using AI to optimize resumes, beat ATS systems, and land interviews at top companies.
              </p>

              {/* Feature pills */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ScanSearch, text: 'ATS Score Analysis', color: '#5B5FEF' },
                  { icon: Sparkles, text: 'AI Magic Rewrite', color: '#3DEBA6' },
                  { icon: FileText, text: 'Cover Letter Gen', color: '#F0C060' },
                  { icon: ShieldCheck, text: '10 Pro Templates', color: '#8E91FF' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <Icon size={16} style={{ color }} className="flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-300">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Social proof stats */}
            <div className="flex items-center gap-8">
              {[
                { value: '<3s', label: 'Scan Speed' },
                { value: '92%', label: 'Avg. ATS Score' },
                { value: '10', label: 'Templates' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-[#5B5FEF]">{value}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ RIGHT FORM PANEL ═══════ */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative">

          {/* Subtle background glow */}
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#5B5FEF]/8 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full max-w-[400px] relative z-10">

            {/* Mobile-only logo */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
              <div className="w-14 h-14 bg-[#5B5FEF] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5B5FEF]/30 mb-4">
                <svg viewBox="0 0 200 200" className="w-8 h-8">
                  <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                  <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                  <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome back</h2>
              <p className="text-gray-500 text-sm font-medium">
                Sign in to continue to your workspace
              </p>
            </div>

            {/* Form card */}
            <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <form onSubmit={handle} className="space-y-5">

                {/* Email field */}
                <div>
                  <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em]">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-[11px] text-[#5B5FEF] hover:text-[#8E91FF] transition-colors font-mono font-bold" tabIndex={-1}>
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10"
                      tabIndex={-1}
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Demo access link */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-600 font-mono">Quick access</span>
                  <button
                    type="button"
                    onClick={handleQuickHydrate}
                    className="text-[11px] text-[#5B5FEF] hover:text-[#8E91FF] transition-colors font-bold font-mono flex items-center gap-1"
                  >
                    <Zap size={10} />
                    Use Demo Account
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-gray-400 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 font-bold transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#3DEBA6]" />
              <p className="text-[10px] text-gray-600 font-mono tracking-wider">
                Demo: <span className="text-gray-500">admin@hyrr.com</span> / <span className="text-gray-500">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}