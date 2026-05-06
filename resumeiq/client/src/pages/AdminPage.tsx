import React, { useEffect, useState } from 'react';
import {
  Users,
  BarChart3,
  TrendingUp,
  Search,
  Activity,
  IndianRupee,
  LayoutDashboard
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
import api from '../services/api';

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
}

interface AdminStats {
  totalUsers: number;
  totalScans: number;
  revenue: number;
  chartData: { _id: string; scans: number; avgScore: number }[]; // Updated mapping
  topKeywords: KeywordStat[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'stats' | 'users'>('stats');

  useEffect(() => {
    // Fetch statistics
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Failed to load admin stats'));

    // Fetch users for management tab
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.data.users))
      .catch(() => console.error('Failed to load users'));
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const maxKeywordCount = stats ? Math.max(...stats.topKeywords.map(k => k.count), 1) : 1;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] flex font-sans">
      {/* Sidebar - Preserved your custom branding */}
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-1">Infrastructure Control</h1>
          <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">System Health: Optimal</p>
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
              {/* Fix 1: SCAN ACTIVITY COMPOSED CHART */}
              <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
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
                        <XAxis
                          dataKey="_id"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#4b5563' }}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#4b5563' }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#3DEBA6' }}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{ backgroundColor: '#0D0D14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                        <Bar
                          yAxisId="left"
                          dataKey="scans"
                          fill="#5B5FEF"
                          name="Total Scans"
                          radius={[4, 4, 0, 0]}
                          barSize={24}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgScore"
                          stroke="#3DEBA6"
                          strokeWidth={2}
                          name="Avg Score"
                          dot={{ r: 3, fill: '#3DEBA6' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Skill Gap Trends - Preserved UI */}
              <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
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
          </div>
        )}

        {/* User Management Tab - Preserved Logic */}
        {tab === 'users' && (
          <div className="bg-[#13131A] border border-white/5 rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
              <Search size={18} className="text-gray-500" />
              <input
                className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none flex-1"
                placeholder="Search user name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="divide-y divide-white/[0.04]">
              {filteredUsers.map(u => (
                <div key={u._id} className="flex items-center gap-4 px-8 py-5 hover:bg-white/[0.01] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#5B5FEF]/10 border border-[#5B5FEF]/20 flex items-center justify-center text-[#5B5FEF] font-bold text-sm">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-200">{u.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-white/5 text-gray-500'}`}>{u.role}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${u.plan === 'pro' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-gray-500'}`}>{u.plan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
      <div className="absolute right-6 top-8 text-white/5 group-hover:text-white/10 transition-colors">
        {icon}
      </div>
      <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
    </div>
  );
}