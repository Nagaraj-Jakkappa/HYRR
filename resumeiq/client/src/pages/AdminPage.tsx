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
  tokensUsed: number;
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
  totalTokensUsed: number;
  planDistribution: { _id: string; count: number }[];
  systemHealth: { mongodb: string; redis: string; backend: string };
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
      await adminAPI.updatePlan(id, { plan: newPlan });
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

  const exportScansToCSV = () => {
    if (scans.length === 0) return toast.error('No scans available to export');
    
    // Create CSV header
    const headers = ['User Email', 'Job Title', 'Company Name', 'ATS Score', 'Date'];
    
    // Create CSV rows
    const csvRows = scans.map(s => {
      // Escape strings to prevent CSV injection and handle commas
      const email = `"${(s.userId?.email || 'Unknown').replace(/"/g, '""')}"`;
      const title = `"${(s.jobId?.jobTitle || 'N/A').replace(/"/g, '""')}"`;
      const company = `"${(s.jobId?.companyName || 'N/A').replace(/"/g, '""')}"`;
      const score = s.atsScore;
      const date = `"${new Date(s.createdAt).toLocaleDateString()}"`;
      return [email, title, company, score, date].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hyrr_scans_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Export downloaded successfully');
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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Infrastructure Control</h1>
            {stats?.systemHealth ? (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${stats.systemHealth.mongodb === 'connected' ? 'bg-[#3DEBA6]/10 border-[#3DEBA6]/20 text-[#3DEBA6]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stats.systemHealth.mongodb === 'connected' ? 'bg-[#3DEBA6]' : 'bg-red-500 animate-pulse'}`} />
                  MongoDB: {stats.systemHealth.mongodb === 'connected' ? 'Connected' : 'Offline'}
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${stats.systemHealth.redis === 'connected' ? 'bg-[#3DEBA6]/10 border-[#3DEBA6]/20 text-[#3DEBA6]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stats.systemHealth.redis === 'connected' ? 'bg-[#3DEBA6]' : 'bg-red-500 animate-pulse'}`} />
                  Redis: {stats.systemHealth.redis === 'connected' ? 'Connected' : 'Offline'}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border bg-[#3DEBA6]/10 border-[#3DEBA6]/20 text-[#3DEBA6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3DEBA6]" />
                  Backend: Online
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full inline-block">
                System Health: {settings?.maintenanceMode ? <span className="text-red-400 ml-1">Maintenance</span> : <span className="text-[#3DEBA6] ml-1">Optimal</span>}
              </p>
            )}
          </div>
        </header>

        {tab === 'stats' && stats && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={stats.totalUsers} color="text-blue-400" icon={<Users size={24} />} />
              <StatCard title="Global Scans" value={stats.totalScans} color="text-violet-400" icon={<BarChart3 size={24} />} />
              <StatCard title="Total AI Tokens" value={(stats.totalTokensUsed / 1000).toFixed(1) + 'k'} color="text-[#5B5FEF]" icon={<Activity size={24} />} />
              <StatCard title="Monthly Revenue" value={`₹${stats.revenue || 0}`} color="text-[#3DEBA6]" icon={<IndianRupee size={24} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SCAN ACTIVITY COMPOSED CHART */}
              <div className="card p-6 sm:p-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#5B5FEF]" /> Scan Activity (7 Days)
                  </span>
                  <span className="text-[9px] text-gray-500 bg-white/5 px-2 py-1 rounded-md">Scan Volume vs Avg Score</span>
                </p>
                <div style={{ height: 280, width: '100%' }}>
                  {!stats.chartData || stats.chartData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <Activity size={24} className="text-gray-700 mb-2 opacity-50" />
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">No Scan Data Found</span>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <ComposedChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dx={-10} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3DEBA6' }} dx={10} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#9ca3af' }} />
                        <Bar yAxisId="left" dataKey="scans" fill="#5B5FEF" name="Total Scans" radius={[4, 4, 0, 0]} barSize={24} />
                        <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#3DEBA6" strokeWidth={2} name="Avg Score" dot={{ r: 3, fill: '#3DEBA6' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* PLAN DISTRIBUTION CHART */}
              <div className="card p-6 sm:p-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-[#F0C060]" /> Tier Distribution
                  </span>
                </p>
                <div style={{ height: 280, width: '100%' }}>
                  {!stats.planDistribution || stats.planDistribution.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">No Plan Data</span>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <ComposedChart data={stats.planDistribution.sort((a,b) => b.count - a.count)} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <YAxis 
                          type="category" 
                          dataKey="_id" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} 
                          tickFormatter={(value) => String(value).toUpperCase()}
                        />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="count" fill="#F0C060" radius={[0, 4, 4, 0]} barSize={24} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Skill Gap Trends */}
            <div className="card p-6 sm:p-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Activity size={14} className="text-[#3DEBA6]" /> Skill Gap Trends
              </p>
              <div className="space-y-6">
                {stats.topKeywords.map((kw) => (
                  <div key={kw._id} className="group">
                    <div className="flex justify-between text-xs mb-2.5">
                      <span className="font-bold text-gray-300 group-hover:text-white transition-colors tracking-wide">{kw._id}</span>
                      <span className="text-[#5B5FEF] font-bold text-[10px] bg-[#5B5FEF]/10 px-2 py-0.5 rounded-full">{kw.count} missing</span>
                    </div>
                    <div className="w-full bg-[#0A0A0F] border border-white/5 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#5B5FEF] to-[#8E91FF] transition-all duration-1000 rounded-full"
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
          <div className="card overflow-hidden animate-in slide-in-from-bottom-4 duration-500 p-0">
            <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.01]">
              <div className="flex-1 flex items-center gap-3 bg-[#0A0A0F] border border-white/10 px-4 py-2.5 rounded-xl focus-within:border-[#5B5FEF] focus-within:ring-1 focus-within:ring-[#5B5FEF]/50 transition-all">
                <Search size={16} className="text-gray-500" />
                <input
                  className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none flex-1"
                  placeholder="Search user by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Role</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Plan</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Tokens Used</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-[#5B5FEF]/10 border border-[#5B5FEF]/20 flex items-center justify-center text-[#5B5FEF] font-black text-sm shadow-inner group-hover:border-[#5B5FEF]/40 transition-colors">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-200">{u.name}</p>
                            <p className="text-[11px] text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-[#0A0A0F] border border-white/10 text-xs text-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/50 transition-all font-medium"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={u.plan} 
                          onChange={(e) => handlePlanChange(u._id, e.target.value)}
                          className="bg-[#0A0A0F] border border-white/10 text-xs text-[#F0C060] rounded-lg px-3 py-1.5 outline-none focus:border-[#F0C060] focus:ring-1 focus:ring-[#F0C060]/50 transition-all font-bold uppercase tracking-wide"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="careerPlus">Career+</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400 whitespace-nowrap">
                        <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">{u.tokensUsed || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleStatus(u._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors border ${
                            u.isActive ? 'bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/20 hover:bg-[#3DEBA6]/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                          }`}
                        >
                          {u.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {u.isActive ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
                          title="Delete User Permanently"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center">
                        <Users size={24} className="mx-auto text-gray-600 mb-2 opacity-50" />
                        <p className="text-gray-500 text-sm font-medium">No users found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Scans Tab */}
        {tab === 'scans' && (
          <div className="card overflow-hidden animate-in slide-in-from-bottom-4 duration-500 p-0">
            <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">Global Scans Record</h2>
                <p className="text-xs text-gray-500 mt-1">View all resume scans performed across the platform.</p>
              </div>
              <div className="text-right">
                <button 
                  onClick={exportScansToCSV}
                  className="btn-ghost flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
                >
                  <Save size={16} className="text-gray-400" /> Export Safe CSV
                </button>
                <p className="text-[9px] text-gray-500 mt-2 max-w-[150px] sm:ml-auto">Includes Email, Job Title, Company, Score, Date.</p>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">User Email</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Target Job</th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">ATS Score</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {scans.map(s => (
                    <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                        {s.userId?.email || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-200">{s.jobId?.jobTitle || 'N/A'}</p>
                        <p className="text-[11px] text-gray-500">{s.jobId?.companyName || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border inline-block min-w-[60px] ${
                          s.atsScore >= 80 ? 'bg-[#3DEBA6]/10 border-[#3DEBA6]/20 text-[#3DEBA6]' :
                          s.atsScore >= 60 ? 'bg-[#F0C060]/10 border-[#F0C060]/20 text-[#F0C060]' :
                          'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {s.atsScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500 font-mono whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Clock size={12} />
                          {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {scans.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center">
                        <FileText size={24} className="mx-auto text-gray-600 mb-2 opacity-50" />
                        <p className="text-gray-500 text-sm font-medium">No scans found.</p>
                      </td>
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
    <div className="card p-6 sm:p-8 group">
      <div className="absolute right-6 top-8 text-white/5 group-hover:text-white/10 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-4">{title}</p>
      <div className={`text-3xl sm:text-4xl font-black ${color} tracking-tight`}>{value}</div>
    </div>
  );
}