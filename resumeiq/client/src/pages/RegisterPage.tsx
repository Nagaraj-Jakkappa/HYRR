import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Check, Zap, ScanSearch, Sparkles, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Footer from '../components/ui/Footer'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be 6+ characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
      toast.success('Account created!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const len = form.password.length
    if (len === 0) return { level: 0, label: '', color: '' }
    if (len < 6) return { level: 1, label: 'Weak', color: '#FF4D4D' }
    if (len < 10) return { level: 2, label: 'Fair', color: '#F0C060' }
    return { level: 3, label: 'Strong', color: '#3DEBA6' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col selection:bg-[#5B5FEF]/30">
      <div className="flex-1 flex">

        {/* ═══════ LEFT BRANDING PANEL ═══════ */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0D0D14]">

          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(61,235,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,235,166,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Gradient orbs */}
          <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-[#3DEBA6]/12 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[15%] left-[10%] w-[350px] h-[350px] bg-[#5B5FEF]/12 blur-[100px] rounded-full" />
          <div className="absolute top-[50%] right-[40%] w-[200px] h-[200px] bg-[#F0C060]/8 blur-[80px] rounded-full" />

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3DEBA6]/20 bg-[#3DEBA6]/10 mb-8">
                <Zap size={10} className="text-[#3DEBA6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3DEBA6]">
                  Free to Start
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-white mb-6">
                Start building{' '}
                <span className="bg-gradient-to-r from-[#3DEBA6] to-[#5B5FEF] text-transparent bg-clip-text">
                  interview-ready
                </span>{' '}
                resumes.
              </h1>

              <p className="text-gray-400 text-base leading-relaxed mb-10">
                Create your free account and get instant access to AI-powered resume scanning, optimization, and professional templates.
              </p>

              {/* What you get list */}
              <div className="space-y-4">
                <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.2em] mb-2">What you get for free</p>
                {[
                  '3 ATS scans per month',
                  'AI-powered Magic Rewrite',
                  'Professional resume template',
                  'PDF export & shareable reports',
                  'Real-time scan progress via WebSockets',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#3DEBA6]/10 border border-[#3DEBA6]/20 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-[#3DEBA6]" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Feature icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: ScanSearch, label: 'Scan' },
                { icon: Sparkles, label: 'Rewrite' },
                { icon: FileText, label: 'Export' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <Icon size={14} className="text-[#5B5FEF]" />
                  <span className="text-[11px] font-bold text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ RIGHT FORM PANEL ═══════ */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative">

          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#3DEBA6]/6 blur-[100px] rounded-full pointer-events-none" />

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
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create your account</h2>
              <p className="text-gray-500 text-sm font-medium">
                Get started in under 30 seconds — no credit card required
              </p>
            </div>

            {/* Form card */}
            <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <form onSubmit={handle} className="space-y-5">

                {/* Name field */}
                <div>
                  <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

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
                  <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
                      type={show ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
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

                  {/* Password strength indicator */}
                  {form.password.length > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 flex gap-1.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: i <= strength.level ? strength.color : 'rgba(255,255,255,0.05)'
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[10px] font-mono font-bold transition-colors duration-300"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>

                {/* Terms text with checkbox */}
                <div className="flex items-start gap-3 mt-4">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      required 
                      className="w-3.5 h-3.5 rounded border-gray-600 bg-[#0A0A0F] text-[#5B5FEF] focus:ring-[#5B5FEF]/50 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="terms" className="text-[11px] text-gray-500 leading-relaxed font-medium cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 transition-colors">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 transition-colors">Privacy Policy</Link>.
                  </label>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Login link */}
              <p className="text-center text-sm text-gray-400 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}