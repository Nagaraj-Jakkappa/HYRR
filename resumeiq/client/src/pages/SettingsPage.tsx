import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { authAPI } from '../services/api';
import { 
    Settings, 
    ShieldAlert, 
    KeyRound, 
    User as UserIcon, 
    CreditCard, 
    ChevronRight,
    LogOut,
    CheckCircle2,
    AlertTriangle,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    
    const [tab, setTab] = useState<'general' | 'security' | 'billing' | 'danger'>('general');
    
    // Form States
    const [name, setName] = useState(user?.name || '');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [deleteText, setDeleteText] = useState('');
    const [loading, setLoading] = useState(false);

    // Dynamic Limits
    const scanLimit = user?.scansLimit || 50;
    const usagePercent = ((user?.scansUsed || 0) / scanLimit) * 100;
    const barColor = usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-[#3DEBA6]';

    useEffect(() => {
        if (user?.name) setName(user.name);
    }, [user]);

    // Handle Profile Update
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.updateProfile({ name });
            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle Password Change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error("New passwords do not match");

        setLoading(true);
        try {
            await authAPI.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            toast.success("Password updated successfully");
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    // Handle Account Deletion
    const handleDeleteAccount = async () => {
        if (deleteText !== 'DELETE') return toast.error('Please type DELETE to confirm');
        setLoading(true);
        try {
            await authAPI.deleteAccount();
            toast.success("Account deleted permanently");
            logout();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete account");
            setLoading(false);
        }
    };

    const getPlanBadgeColor = (plan: string) => {
        switch(plan?.toLowerCase()) {
            case 'pro': return 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
            case 'career+': return 'bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/30 shadow-[0_0_10px_rgba(61,235,166,0.2)]';
            default: return 'bg-white/5 text-gray-400 border-white/10';
        }
    };

    return (
        <div className="flex-1 flex font-sans bg-[#0A0A0F] text-[#EEEEF0] selection:bg-[#5B5FEF]/30">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r p-6 hidden md:flex flex-col bg-[#0D0D14] border-white/5">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(91,95,239,0.3)]">
                        <Settings className="text-white" size={16} />
                    </div>
                    <span className="font-black text-xl tracking-tight">Settings</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem active={tab === 'general'} onClick={() => setTab('general')} icon={<UserIcon size={18} />} label="General" />
                    <SidebarItem active={tab === 'security'} onClick={() => setTab('security')} icon={<KeyRound size={18} />} label="Security" />
                    <SidebarItem active={tab === 'billing'} onClick={() => setTab('billing')} icon={<CreditCard size={18} />} label="Billing" />
                    
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <button 
                            onClick={() => setTab('danger')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${tab === 'danger' ? 'bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-red-500/20' : 'text-gray-500 hover:bg-red-500/5 hover:text-red-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <ShieldAlert size={18} />
                                <span className="text-sm font-bold">Danger Zone</span>
                            </div>
                            {tab === 'danger' && <ChevronRight size={16} className="opacity-50" />}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-3xl">
                    
                    {/* General Tab */}
                    {tab === 'general' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight mb-2">General Profile</h1>
                                <p className="text-sm text-[#6B6B7E]">Update your personal information and how we can reach you.</p>
                            </div>

                            <div className="p-8 rounded-[32px] border bg-[#13131A]/80 backdrop-blur-xl border-white/5 shadow-xl">
                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                                    <div className="w-24 h-24 rounded-full bg-[#5B5FEF]/10 border-2 border-[#5B5FEF]/30 shadow-[0_0_20px_rgba(91,95,239,0.2)] flex items-center justify-center text-3xl font-black text-[#5B5FEF]">
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-1">{user?.name}</h3>
                                        <p className="text-sm text-[#6B6B7E] mb-3 font-medium">{user?.email}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${getPlanBadgeColor(user?.plan || 'free')}`}>
                                            {user?.plan || 'Free'} Plan
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Display Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full relative bg-[#0A0A0F]/90 border border-white/10 rounded-[16px] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5B5FEF]/50 focus:border-[#5B5FEF]/50 transition-all shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full bg-black/40 border border-white/5 rounded-[16px] px-4 py-3.5 text-sm text-gray-500 outline-none cursor-not-allowed font-mono"
                                        />
                                        <p className="text-[10px] text-[#6B6B7E] mt-2 font-mono tracking-wide">Email changes require support verification to maintain account security.</p>
                                    </div>
                                    <button
                                        disabled={loading || name === user?.name}
                                        className="bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-black uppercase tracking-wider py-3.5 px-8 rounded-xl text-xs transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {tab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight mb-2">Security</h1>
                                <p className="text-sm text-[#6B6B7E]">Ensure your account remains secure with a strong password.</p>
                            </div>

                            <div className="p-8 rounded-[32px] border bg-[#13131A]/80 backdrop-blur-xl border-white/5 shadow-xl">
                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Current Password</label>
                                        <input
                                            type="password" required
                                            className="w-full relative bg-[#0A0A0F]/90 border border-white/10 rounded-[16px] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5B5FEF]/50 focus:border-[#5B5FEF]/50 transition-all shadow-inner"
                                            value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-6 border-t border-white/5">
                                        <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">New Password</label>
                                        <input
                                            type="password" required
                                            className="w-full relative bg-[#0A0A0F]/90 border border-white/10 rounded-[16px] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5B5FEF]/50 focus:border-[#5B5FEF]/50 transition-all shadow-inner"
                                            value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Confirm New Password</label>
                                        <input
                                            type="password" required
                                            className="w-full relative bg-[#0A0A0F]/90 border border-white/10 rounded-[16px] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5B5FEF]/50 focus:border-[#5B5FEF]/50 transition-all shadow-inner"
                                            value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        disabled={loading || !passwords.current || !passwords.new}
                                        className="bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-black uppercase tracking-wider py-3.5 px-8 rounded-xl text-xs transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {tab === 'billing' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight mb-2">Billing & Plan</h1>
                                <p className="text-sm text-[#6B6B7E]">Manage your subscription and monitor usage limits.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Plan Card */}
                                <div className="p-8 rounded-[32px] border relative overflow-hidden bg-[#13131A]/80 backdrop-blur-xl border-white/5 shadow-xl">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#3DEBA6]/10 blur-3xl rounded-full"></div>
                                    <h4 className="text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-6">Current Plan</h4>
                                    <div className="text-4xl font-black tracking-tighter capitalize mb-2">{user?.plan || 'Free'}</div>
                                    <p className="text-sm text-[#6B6B7E] mb-8 font-medium">Optimal for getting started with AI resume optimization.</p>
                                    
                                    <button 
                                        onClick={() => window.location.href = '/#pricing'}
                                        className="w-full bg-[#5B5FEF]/10 hover:bg-[#5B5FEF]/20 text-[#5B5FEF] border border-[#5B5FEF]/30 font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-[inset_0_0_15px_rgba(91,95,239,0.1)]">
                                        Upgrade Plan
                                    </button>
                                </div>

                                {/* Usage Stats */}
                                <div className="p-8 rounded-[32px] border bg-[#13131A]/80 backdrop-blur-xl border-white/5 shadow-xl">
                                    <h4 className="text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-6">Usage Limits</h4>
                                    
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-3xl font-black">{user?.scansUsed || 0}</span>
                                            <span className="text-[#6B6B7E] ml-1 font-bold">/ {scanLimit} scans</span>
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${usagePercent > 90 ? 'text-red-500' : 'text-[#3DEBA6]'}`}>
                                            {Math.round(usagePercent)}% Used
                                        </span>
                                    </div>
                                    
                                    <div className="w-full h-3 rounded-full overflow-hidden bg-[#0A0A0F] border border-white/5 shadow-inner">
                                        <div className={`h-full transition-all duration-1000 ${barColor}`} style={{ width: `${usagePercent}%` }} />
                                    </div>
                                    
                                    {usagePercent > 90 && (
                                        <p className="text-xs text-red-500 mt-5 flex items-center gap-1.5 font-bold bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                                            <AlertTriangle size={14} /> You are approaching your scan limit.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {tab === 'danger' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-red-500 tracking-tight mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">Danger Zone</h1>
                                <p className="text-sm text-red-400/80">Irreversible and destructive actions.</p>
                            </div>

                            <div className="p-8 rounded-[32px] border border-red-500/30 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-black text-red-500 mb-2">Delete Account</h4>
                                    <p className="text-sm text-red-400/80 mb-8 max-w-xl leading-relaxed font-medium">
                                        Once you delete your account, there is no going back. All of your resumes, scan history, and personal data will be permanently erased immediately.
                                    </p>
                                    
                                    <div className="space-y-5 max-w-md">
                                        <div>
                                            <label className="block text-[11px] font-black text-red-400 uppercase tracking-widest mb-2.5">Type "DELETE" to confirm</label>
                                            <input 
                                                type="text" 
                                                placeholder="DELETE"
                                                value={deleteText}
                                                onChange={(e) => setDeleteText(e.target.value)}
                                                className="w-full relative bg-[#0A0A0F]/90 border border-red-500/30 rounded-[16px] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all shadow-inner placeholder:text-red-900/50"
                                            />
                                        </div>
                                        
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={loading || deleteText !== 'DELETE'}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:grayscale text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-[0.98]"
                                        >
                                            <Trash2 size={16} />
                                            Permanently Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// Subcomponent for Sidebar Items
function SidebarItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                active 
                    ? 'bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] text-white shadow-[0_0_20px_rgba(91,95,239,0.3)]' 
                    : 'text-[#6B6B7E] hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>
            {active && <ChevronRight size={16} className="opacity-80" />}
        </button>
    );
}

export default SettingsPage;