import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Sparkles, Search, Clock, Shield, LogOut, ChevronRight, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Footer from './Footer'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resumes', icon: FileText, label: 'My Resumes' },
  { to: '/builder', icon: Sparkles, label: 'Resume Builder' }, // --- NEW: Connected Feature 3 Entrypoint Link ---
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/scan', icon: Search, label: 'New Scan' },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-hyrr-background text-white font-sans overflow-hidden">
      {/* Sidebar — collapsed (icons only) by default, expands on hover */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`
          flex-shrink-0 bg-hyrr-surface border-r border-white/[0.05] flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden z-30
          ${expanded ? 'w-[240px]' : 'w-[72px]'}
        `}
      >

        {/* Logo Section */}
        <div className={`flex items-center gap-3 py-8 transition-all duration-300 ${expanded ? 'px-6' : 'px-4 justify-center'}`}>
          <div className="w-10 h-10 bg-[#5B5FEF] rounded-xl flex items-center justify-center shadow-lg shadow-[#5B5FEF]/20 transition-transform hover:scale-105 flex-shrink-0">
            <svg viewBox="0 0 200 200" className="w-6 h-6">
              <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
              <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
            </svg>
          </div>
          <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <h1 className="text-xl font-bold tracking-tight text-[#EEEEF0] leading-none">hyrr</h1>
            <p className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase tracking-[0.2em]">ATS Decoder</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className={`flex-1 space-y-1 transition-all duration-300 ${expanded ? 'px-4' : 'px-2'}`}>
          <p className={`text-[10px] font-mono text-gray-600 uppercase tracking-widest px-2 mb-3 transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100' : 'opacity-0 h-0 mb-0'}`}>Workspace</p>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={!expanded ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${expanded ? 'px-3' : 'px-0 justify-center'}
                ${isActive
                  ? 'bg-[#5B5FEF]/10 text-[#5B5FEF] shadow-sm'
                  : 'text-hyrr-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {label}
              </span>
              <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 flex-shrink-0 ${expanded ? '' : 'hidden'}`} />
            </NavLink>
          ))}

          {isAdmin && (
            <div className={`transition-all duration-300 ${expanded ? 'mt-8' : 'mt-4'}`}>
              <p className={`text-[10px] font-mono text-gray-600 uppercase tracking-widest px-2 mb-3 transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100' : 'opacity-0 h-0 mb-0'}`}>Admin Control</p>
              <NavLink
                to="/admin"
                title={!expanded ? 'Admin Panel' : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all
                  ${expanded ? 'px-3' : 'px-0 justify-center'}
                  ${isActive
                    ? 'bg-hyrr-mint/10 text-hyrr-mint'
                    : 'text-hyrr-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Shield size={18} className="flex-shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  Admin Panel
                </span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* User & Usage Profile Section */}
        <div className={`bg-black/20 rounded-2xl border border-white/[0.03] transition-all duration-300 ${expanded ? 'p-4 m-4' : 'p-2 m-2'}`}>
          <div className={`flex items-center gap-3 transition-all duration-300 ${expanded ? 'mb-4' : 'mb-0 justify-center flex-col'}`}>
            <div className="w-9 h-9 rounded-xl bg-[#5B5FEF]/20 border border-[#5B5FEF]/30 flex items-center justify-center text-sm font-bold text-[#5B5FEF] flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Expanded-only content */}
            <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${expanded ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}>
              <p className="text-xs font-bold text-gray-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-hyrr-muted font-mono capitalize">{user?.plan} Member</p>
            </div>

            {/* Action buttons — show icons-only when collapsed */}
            <div className={`flex transition-all duration-300 ${expanded ? 'flex-row gap-1' : 'flex-col gap-2 mt-2'}`}>
              {/* Settings Icon Link */}
              <Link
                to="/settings"
                className="text-gray-600 hover:text-[#5B5FEF] transition-colors p-1.5 hover:bg-[#5B5FEF]/10 rounded-lg"
                title="Settings"
              >
                <Settings size={16} />
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-hyrr-amber transition-colors p-1.5 hover:bg-hyrr-amber/10 rounded-lg"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Usage bar — only visible when expanded */}
          <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'opacity-100 max-h-20 px-1' : 'opacity-0 max-h-0'}`}>
            <div className="flex justify-between text-[10px] font-mono text-hyrr-muted mb-2">
              <span>Monthly Scans</span>
              <span className="text-gray-300">{user?.scansUsed}/{user?.scansLimit}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${((user?.scansUsed || 0) / (user?.scansLimit || 1)) > 0.8 ? 'bg-hyrr-amber' : 'bg-[#5B5FEF]'
                  }`}
                style={{ width: `${Math.min(100, ((user?.scansUsed || 0) / (user?.scansLimit || 5)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5B5FEF]/5 blur-[120px] -z-10 pointer-events-none" />
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-120px)]">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}