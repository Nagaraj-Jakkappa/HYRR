import { useState, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import Footer from '../components/ui/Footer'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword(token, { password })
      setSuccess(true)
      toast.success('Password reset successfully')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col selection:bg-[#5B5FEF]/30">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Set new password</h2>
            <p className="text-gray-400 text-sm">
              Please enter your new password below.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* New Password */}
                <div>
                  <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                    <input
                      className="w-full relative bg-[#0A0A0F]/90 border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/20 transition-all placeholder:text-gray-600"
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#3DEBA6]/20 border border-[#3DEBA6]/30 rounded-full flex items-center justify-center text-[#3DEBA6] mx-auto mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Password Reset</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Your password has been successfully updated.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 bg-white text-black hover:bg-gray-100 rounded-xl font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center"
                >
                  Go to Login
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
