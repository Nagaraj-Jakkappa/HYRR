import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { authAPI } from '../services/api';
import { 
    Settings, 
    ShieldAlert, 
    KeyRound, 
    User as UserIcon, 
    CreditCard, 
    Palette, 
    ChevronRight,
    LogOut,
    CheckCircle2,
    AlertTriangle,
    Moon,
    Sun,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    
    const [tab, setTab] = useState<'general' | 'security' | 'billing' | 'preferences' | 'danger'>('general');
    
    // Form States
    const [name, setName] = useState(user?.name || '');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [deleteText, setDeleteText] = useState('');
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('hyrr_theme') as 'dark' | 'light') || 'dark';
    });
    
    const [loading, setLoading] = useState(false);

    // Dynamic Limits
    const scanLimit = user?.scansLimit || 50;
    const usagePercent = ((user?.scansUsed || 0) / scanLimit) * 100;
    const barColor = usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-green-500';

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
            // Note: In a real app, we'd also update the AuthContext here
            // For now, refreshing the page or waiting for the next me() call works
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

    // Handle Theme Change
    const handleThemeChange = (newTheme: 'dark' | 'light') => {
        setTheme(newTheme);
        localStorage.setItem('hyrr_theme', newTheme);
        toast.success(`Theme set to ${newTheme} (Local)`);
        // Note: For full global theme support, you'd add this to the <html> class in index.html
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
            case 'pro': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'career+': return 'bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/20';
            default: return 'bg-white/5 text-gray-400 border-white/10';
        }
    };

    return (
        <div className={`min-h-screen flex font-sans ${theme === 'dark' ? 'bg-[#0A0A0F] text-[#EEEEF0]' : 'bg-gray-50 text-gray-900'}`}>
            
            {/* Sidebar Navigation */}
            <aside className={`w-64 border-r p-6 hidden md:flex flex-col ${theme === 'dark' ? 'bg-[#0D0D14] border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center">
                        <Settings className="text-white" size={16} />
                    </div>
                    <span className="font-black text-xl tracking-tight">Settings</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem active={tab === 'general'} onClick={() => setTab('general')} icon={<UserIcon size={18} />} label="General" theme={theme} />
                    <SidebarItem active={tab === 'security'} onClick={() => setTab('security')} icon={<KeyRound size={18} />} label="Security" theme={theme} />
                    <SidebarItem active={tab === 'billing'} onClick={() => setTab('billing')} icon={<CreditCard size={18} />} label="Billing" theme={theme} />
                    <SidebarItem active={tab === 'preferences'} onClick={() => setTab('preferences')} icon={<Palette size={18} />} label="Preferences" theme={theme} />
                    
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <button 
                            onClick={() => setTab('danger')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === 'danger' ? 'bg-red-500/10 text-red-500' : 'text-gray-500 hover:bg-red-500/5 hover:text-red-400'}`}
                        >
                            <ShieldAlert size={18} />
                            <span className="text-sm font-bold">Danger Zone</span>
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
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Update your personal information and how we can reach you.</p>
                            </div>

                            <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                                    <div className="w-24 h-24 rounded-full bg-[#5B5FEF]/10 border-2 border-[#5B5FEF]/20 flex items-center justify-center text-3xl font-black text-[#5B5FEF]">
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getPlanBadgeColor(user?.plan || 'free')}`}>
                                            {user?.plan || 'Free'} Plan
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed ${theme === 'dark' ? 'bg-black/20 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                        />
                                        <p className="text-[10px] text-gray-500 mt-2 font-mono">Email changes require support verification to maintain account security.</p>
                                    </div>
                                    <button
                                        disabled={loading || name === user?.name}
                                        className="bg-[#5B5FEF] hover:bg-[#4a4ed8] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all disabled:opacity-50 mt-4"
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
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Ensure your account remains secure with a strong password.</p>
                            </div>

                            <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
                                        <input
                                            type="password" required
                                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                            value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                                        <input
                                            type="password" required
                                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                            value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                                        <input
                                            type="password" required
                                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                            value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        disabled={loading || !passwords.current || !passwords.new}
                                        className="bg-[#5B5FEF] hover:bg-[#4a4ed8] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all disabled:opacity-50 mt-4"
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
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Manage your subscription and monitor usage limits.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Plan Card */}
                                <div className={`p-8 rounded-[32px] border relative overflow-hidden ${theme === 'dark' ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Current Plan</h4>
                                    <div className="text-4xl font-black tracking-tighter capitalize mb-2">{user?.plan || 'Free'}</div>
                                    <p className="text-sm text-gray-500 mb-8">Optimal for getting started with AI resume optimization.</p>
                                    
                                    <button className="w-full bg-[#5B5FEF]/10 hover:bg-[#5B5FEF]/20 text-[#5B5FEF] border border-[#5B5FEF]/20 font-bold py-3 rounded-xl transition-all">
                                        Upgrade Plan
                                    </button>
                                </div>

                                {/* Usage Stats */}
                                <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Usage Limits</h4>
                                    
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-3xl font-black">{user?.scansUsed || 0}</span>
                                            <span className="text-gray-500 ml-1">/ {scanLimit} scans</span>
                                        </div>
                                        <span className={`text-xs font-bold ${usagePercent > 90 ? 'text-red-500' : 'text-[#3DEBA6]'}`}>
                                            {Math.round(usagePercent)}% Used
                                        </span>
                                    </div>
                                    
                                    <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <div className={`h-full transition-all duration-1000 ${barColor}`} style={{ width: `${usagePercent}%` }} />
                                    </div>
                                    
                                    {usagePercent > 90 && (
                                        <p className="text-xs text-red-500 mt-4 flex items-center gap-1.5">
                                            <AlertTriangle size={14} /> You are approaching your scan limit.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {tab === 'preferences' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight mb-2">Preferences</h1>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Customize your Hyrr experience.</p>
                            </div>

                            <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Interface Theme</h4>
                                
                                <div className="grid grid-cols-2 gap-4 max-w-md">
                                    <button 
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all ${theme === 'dark' ? 'border-[#5B5FEF] bg-[#5B5FEF]/5' : 'border-white/10 hover:border-white/20'}`}
                                    >
                                        <Moon size={24} className={`mb-3 ${theme === 'dark' ? 'text-[#5B5FEF]' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`}>Dark Mode</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleThemeChange('light')}
                                        className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all ${theme === 'light' ? 'border-[#5B5FEF] bg-[#5B5FEF]/5' : (theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300')}`}
                                    >
                                        <Sun size={24} className={`mb-3 ${theme === 'light' ? 'text-[#5B5FEF]' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-gray-400'}`}>Light Mode</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-4 font-mono">Note: Local theme toggle only applies to this settings page temporarily as we roll out full global theme support.</p>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {tab === 'danger' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-red-500 tracking-tight mb-2">Danger Zone</h1>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Irreversible and destructive actions.</p>
                            </div>

                            <div className="p-8 rounded-[32px] border border-red-500/20 bg-red-500/5">
                                <h4 className="text-lg font-bold text-red-500 mb-2">Delete Account</h4>
                                <p className="text-sm text-red-400/80 mb-6 max-w-xl leading-relaxed">
                                    Once you delete your account, there is no going back. All of your resumes, scan history, and personal data will be permanently erased immediately.
                                </p>
                                
                                <div className="space-y-4 max-w-md">
                                    <label className="block text-xs font-bold text-red-400 uppercase tracking-widest">Type "DELETE" to confirm</label>
                                    <input 
                                        type="text" 
                                        placeholder="DELETE"
                                        value={deleteText}
                                        onChange={(e) => setDeleteText(e.target.value)}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition-all ${theme === 'dark' ? 'bg-black/20 border-red-500/20 text-white' : 'bg-white border-red-200 text-gray-900'}`}
                                    />
                                    
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading || deleteText !== 'DELETE'}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:grayscale"
                                    >
                                        <Trash2 size={18} />
                                        Permanently Delete Account
                                    </button>
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
function SidebarItem({ active, onClick, icon, label, theme }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, theme: string }) {
    const isDark = theme === 'dark';
    
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                active 
                    ? 'bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/20' 
                    : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>
            {active && <ChevronRight size={16} className="opacity-50" />}
        </button>
    );
}

export default SettingsPage;