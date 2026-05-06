import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        
        {/* Updated Hyrr Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#5B5FEF] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5B5FEF]/30 glow-blue mb-4">
            <svg viewBox="0 0 200 200" className="w-10 h-10">
              <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0"/>
              <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0"/>
              <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#EEEEF0] tracking-tight">Create account</h2>
          <p className="text-gray-500 text-sm mt-2">Start optimizing with hyrr</p>
        </div>

        <div className="card p-6 bg-[#13131A] border border-white/[0.05] rounded-2xl">
          <form onSubmit={handle} className="space-y-4">
            {['name', 'email', 'password'].map(field => (
              <div key={field}>
                <label className="label text-gray-400 text-xs font-mono uppercase tracking-wider">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input 
                  className="input bg-black/20 border-white/10 text-white focus:border-[#5B5FEF]/50 transition-colors" 
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  placeholder={field === 'name' ? 'Your name' : field === 'email' ? 'you@example.com' : '••••••••'}
                  value={(form as any)[field]} 
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} 
                  required 
                />
              </div>
            ))}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full justify-center py-3 mt-2 bg-[#5B5FEF] hover:bg-[#4A4ED9] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#5B5FEF]/20 flex items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Have an account? <Link to="/login" className="text-[#3DEBA6] hover:text-[#3DEBA6]/80 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}