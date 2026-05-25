import React, { useEffect, useState } from 'react';
import {
  Users,
  BarChart3,
  TrendingUp,
  Search,
  Activity,
  IndianRupee,
  LayoutDashboard,
  Settings as SettingsIcon,
  FileText,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Clock
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';

interface KeywordStat {
  _id: string;
  count: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  isActive: boolean;
}

interface Scan {
  _id: string;
  jobId: { jobTitle: string; companyName: string };
  atsScore: number;
  userId: { name: string; email: string };
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalScans: number;
  revenue: number;
  chartData: { _id: string; scans: number; avgScore: number }[];
  dailySignups: { _id: string; signups: number }[];
  topKeywords: KeywordStat[];
}

interface SettingsConfig {
  maintenanceMode: boolean;
  freePlanScans: number;
  proPlanScans: number;
  careerPlusPlanScans: number;
  allowNewRegistrations: boolean;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'stats' | 'users' | 'scans' | 'settings'>('stats');

  const fetchUsers = () => {
    adminAPI.getUsers(1, search)
      .then(({ data }) => setUsers(data.data.users))
      .catch(() => toast.error('Failed to load users'));
  };

  useEffect(() => {
    if (tab === 'stats') {
      adminAPI.getStats()
        .then(({ data }) => setStats(data.data))
        .catch(() => toast.error('Failed to load admin stats'));
    } else if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'scans') {
      adminAPI.getAllScans()
        .then(({ data }) => setScans(data.data.scans))
        .catch(() => toast.error('Failed to load global scans'));
    } else if (tab === 'settings') {
      adminAPI.getSettings()
        .then(({ data }) => setSettings(data.data))
        .catch(() => toast.error('Failed to load settings'));
    }
  }, [tab, search]);

  // User Management Actions
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await adminAPI.updateRole(id, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (e) { toast.error('Failed to update role'); }
  };

  const handlePlanChange = async (id: string, newPlan: string) => {
    try {
      await adminAPI.updateRole(id, { plan: newPlan });
      toast.success('User plan updated');
      fetchUsers();
    } catch (e) { toast.error('Failed to update plan'); }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await adminAPI.toggleStatus(id);
      toast.success(res.data.message);
      fetchUsers();
    } catch (e) { toast.error('Failed to toggle user status'); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted permanently');
      fetchUsers();
    } catch (e) { toast.error('Failed to delete user'); }
  };

  // Settings Actions
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (e) { toast.error('Failed to update settings'); }
  };

  const maxKeywordCount = stats && stats.topKeywords.length > 0 ? Math.max(...stats.topKeywords.map(k => k.count), 1) : 1;

  return (
    <div className="flex-1 bg-[#0A0A0F] text-[#EEEEF0] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0D14] p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center">
            <span className="font-black text-xs text-white">NJ</span>
          </div>
          <span className="font-black text-xl tracking-tight uppercase">
            Hyrr <span className="text-[10px] text-[#5B5FEF]">Admin</span>
          </span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === 'stats' ? 'bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/20' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <Activity size={18} /> <span className="text-sm font-bold">Analytics</span>
          </button>
          <button
            onClick={() => setTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === 'users' ? 'bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/20' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <Users size={18} /> <span className="text-sm font-bold">User Management</span>
          </button>
          <button
            onClick={() => setTab('scans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === 'scans' ? 'bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/20' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <FileText size={18} /> <span className="text-sm font-bold">Global Scans</span>
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === 'settings' ? 'bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/20' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <SettingsIcon size={18} /> <span className="text-sm font-bold">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Infrastructure Control</h1>
            <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">
              System Health: {settings?.maintenanceMode ? <span className="text-red-400">Maintenance</span> : <span className="text-[#3DEBA6]">Optimal</span>}
            </p>
          </div>
        </header>

        {tab === 'stats' && stats && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={stats.totalUsers} color="text-blue-400" icon={<Users size={20} />} />
              <StatCard title="Global Scans" value={stats.totalScans} color="text-violet-400" icon={<BarChart3 size={20} />} />
              <StatCard title="Monthly Revenue" value={`₹${stats.revenue || 0}`} color="text-[#3DEBA6]" icon={<IndianRupee size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SCAN ACTIVITY COMPOSED CHART */}
              <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#5B5FEF]" /> Scan Activity (7 Days)
                  </span>
                  <span className="text-[10px] text-gray-600">Scan Volume vs Avg Score</span>
                </p>
                <div style={{ height: 280, width: '100%' }}>
                  {!stats.chartData || stats.chartData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <Activity size={24} className="text-gray-700 mb-2 opacity-50" />
                      <span className="text-gray-600 text-xs font-mono uppercase">No Scan Data Found</span>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <ComposedChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3DEBA6' }} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0D0D14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                        <Bar yAxisId="left" dataKey="scans" fill="#5B5FEF" name="Total Scans" radius={[4, 4, 0, 0]} barSize={24} />
                        <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#3DEBA6" strokeWidth={2} name="Avg Score" dot={{ r: 3, fill: '#3DEBA6' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* DAILY SIGNUPS CHART */}
              <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-[#3DEBA6]" /> Daily Signups (7 Days)
                  </span>
                </p>
                <div style={{ height: 280, width: '100%' }}>
                  {!stats.dailySignups || stats.dailySignups.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <Users size={24} className="text-gray-700 mb-2 opacity-50" />
                      <span className="text-gray-600 text-xs font-mono uppercase">No Signup Data Found</span>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <ComposedChart data={stats.dailySignups}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0D0D14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Bar dataKey="signups" fill="#3DEBA6" name="New Users" radius={[4, 4, 0, 0]} barSize={24} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Skill Gap Trends */}
            <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8">Skill Gap Trends</p>
              <div className="space-y-5">
                {stats.topKeywords.map((kw) => (
                  <div key={kw._id} className="group">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{kw._id}</span>
                      <span className="text-[#5B5FEF] font-mono">{kw.count} detections</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5B5FEF] to-[#8E91FF] transition-all duration-1000"
                        style={{ width: `${(kw.count / maxKeywordCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {tab === 'users' && (
          <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 shadow-xl rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
              <Search size={18} className="text-gray-500" />
              <input
                className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none flex-1"
                placeholder="Search user name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="divide-y divide-white/[0.04] overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#5B5FEF]/10 border border-[#5B5FEF]/20 flex items-center justify-center text-[#5B5FEF] font-bold text-xs">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-200">{u.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-[#0A0A0F] border border-white/10 text-xs rounded-md px-2 py-1 outline-none focus:border-[#5B5FEF]"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={u.plan} 
                          onChange={(e) => handlePlanChange(u._id, e.target.value)}
                          className="bg-[#0A0A0F] border border-white/10 text-xs rounded-md px-2 py-1 outline-none focus:border-[#5B5FEF]"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="career+">Career+</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleStatus(u._id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                            u.isActive ? 'bg-[#3DEBA6]/10 text-[#3DEBA6] hover:bg-[#3DEBA6]/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {u.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {u.isActive ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Scans Tab */}
        {tab === 'scans' && (
          <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 shadow-xl rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-lg font-bold">Global Scans Record</h2>
              <p className="text-xs text-gray-500">View all resume scans performed across the platform.</p>
            </div>
            <div className="divide-y divide-white/[0.04] overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">User Email</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider">Target Job</th>
                    <th className="px-6 py-4 text-center text-[10px] font-mono text-gray-500 uppercase tracking-wider">ATS Score</th>
                    <th className="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {scans.map(s => (
                    <tr key={s._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-300">
                        {s.userId?.email || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-200">{s.jobId?.jobTitle || 'N/A'}</p>
                        <p className="text-xs text-gray-500 font-mono">{s.jobId?.companyName || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                          s.atsScore >= 80 ? 'bg-[#3DEBA6]/10 border-[#3DEBA6]/25 text-[#3DEBA6]' :
                          s.atsScore >= 60 ? 'bg-[#F0C060]/10 border-[#F0C060]/25 text-[#F0C060]' :
                          'bg-[#ef4444]/10 border-[#ef4444]/25 text-[#ef4444]'
                        }`}>
                          {s.atsScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500 font-mono flex items-center justify-end gap-1">
                        <Clock size={12} />
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {scans.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No scans found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && settings && (
          <div className="max-w-2xl bg-[#13131A]/80 backdrop-blur-xl shadow-xl border border-white/5 rounded-[32px] p-8 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <SettingsIcon className="text-[#5B5FEF]" size={24} />
              Platform Configuration
            </h2>
            <form onSubmit={handleSettingsSave} className="space-y-6">
              
              <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={16} className="text-amber-500" />
                    Maintenance Mode
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Disable access to the platform for all non-admin users.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    Allow New Registrations
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Toggle whether new users can create accounts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.allowNewRegistrations} onChange={(e) => setSettings({...settings, allowNewRegistrations: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3DEBA6]"></div>
                </label>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-bold text-lg">Plan Scan Limits</h3>
                
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Free Plan Limit</label>
                  <input 
                    type="number" 
                    value={settings.freePlanScans}
                    onChange={(e) => setSettings({...settings, freePlanScans: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Pro Plan Limit</label>
                  <input 
                    type="number" 
                    value={settings.proPlanScans}
                    onChange={(e) => setSettings({...settings, proPlanScans: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5B5FEF] outline-none"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#5B5FEF] hover:bg-[#4A4EDF] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg"
                >
                  <Save size={18} />
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 relative overflow-hidden group shadow-xl">
      <div className="absolute right-6 top-8 text-white/5 group-hover:text-white/10 transition-colors">
        {icon}
      </div>
      <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
    </div>
  );
}