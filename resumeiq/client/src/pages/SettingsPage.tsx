import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { authAPI } from '../services/api';
import { Settings, ShieldAlert, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    // Bug 2 Fix: Pull dynamic scan limit from context rather than hardcoding it
    const scanLimit = user?.scansLimit || 50;
    const usagePercent = ((user?.scansUsed || 0) / scanLimit) * 100;
    const barColor = usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-green-500';

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

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center gap-3 mb-8">
                <Settings className="text-[#5B5FEF]" size={24} />
                <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </header>

            {/* 1. Profile Card */}
            <section className="bg-[#13131A] border border-white/5 p-6 rounded-[24px] flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#5B5FEF] flex items-center justify-center text-2xl font-black text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'NJ'}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-[#5B5FEF]/20 text-[#5B5FEF] text-[10px] font-bold uppercase tracking-widest">
                            {user?.plan || 'FREE'}
                        </span>
                        <span className="text-gray-600 text-[10px] uppercase font-mono">
                            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. Usage Stats */}
            <section className="bg-[#13131A] border border-white/5 p-6 rounded-[24px]">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Usage Limits</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Monthly Scans</span>
                        <span className="text-white">{user?.scansUsed || 0} / {scanLimit}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${barColor}`} style={{ width: `${usagePercent}%` }} />
                    </div>
                </div>
            </section>

            {/* 3. Password Form */}
            <section className="bg-[#13131A] border border-white/5 p-8 rounded-[24px]">
                <div className="flex items-center gap-2 mb-6">
                    <KeyRound size={18} className="text-gray-400" />
                    <h4 className="text-sm font-bold text-white">Security</h4>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <input
                        type="password" placeholder="Current Password" required
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all"
                        value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    />
                    <input
                        type="password" placeholder="New Password" required
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all"
                        value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    />
                    <input
                        type="password" placeholder="Confirm New Password" required
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none transition-all"
                        value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                    <button
                        disabled={loading}
                        className="bg-[#5B5FEF] hover:bg-[#4a4ed8] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </section>

            {/* 4. Danger Zone */}
            <section className="border border-red-500/20 bg-red-500/5 p-6 rounded-[24px]">
                <div className="flex items-center gap-2 mb-2 text-red-500">
                    <ShieldAlert size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h4>
                </div>
                <p className="text-xs text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    disabled
                    title="To delete your account, contact support at support@hyrr.io"
                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed grayscale opacity-50"
                >
                    Delete Account
                </button>
            </section>
        </div>
    );
};

export default SettingsPage;