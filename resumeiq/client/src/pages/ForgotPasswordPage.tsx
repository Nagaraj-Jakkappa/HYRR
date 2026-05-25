import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Footer from '../components/ui/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword({ email })
      setSubmitted(true)
      toast.success('Reset link sent if the email exists in our system.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col selection:bg-[#5B5FEF]/30">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#3DEBA6]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Back button */}
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#5B5FEF]/20 border border-[#5B5FEF]/30 rounded-xl flex items-center justify-center mb-6 text-[#5B5FEF]">
              <Mail size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Forgot password?</h2>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-4 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#3DEBA6]/20 border border-[#3DEBA6]/30 rounded-full flex items-center justify-center text-[#3DEBA6] mx-auto mb-4">
                  <Mail size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                <p className="text-gray-400 text-sm mb-6">
                  We sent a password reset link to <br/>
                  <span className="text-white font-medium">{email}</span>
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#5B5FEF] hover:text-white font-bold transition-colors text-sm"
                >
                  Return to login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
