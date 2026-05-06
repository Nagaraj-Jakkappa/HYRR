import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { scanAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  FileSearch,
  Target,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Zap,
  ChevronRight,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ScanItem {
  _id: string;
  atsScore: number | string;
  status: 'done' | 'failed' | 'pending';
  jobId: {
    companyName: string;
    jobTitle: string;
  };
  createdAt: string;
}

interface Stats {
  avgATS: number;
  bestScore: number;
  totalScans: number;
  topMissingKeyword: string | null;
  recentScans: ScanItem[];
  scansUsed: number;
  scansLimit: number;
  plan: string;
}

const ScoreRing = ({ score, size = 56, stroke = 4 }: { score: number | string; size?: number; stroke?: number }) => {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const r = (size / 2) - stroke;
  const circ = 2 * Math.PI * r;
  const offset = circ - (s / 100) * circ;
  const color = s >= 80 ? '#3DEBA6' : s >= 60 ? '#F0C060' : '#FF4D4D';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={stroke}
        />
        {s > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        )}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={s === 0 ? "#6B6B7E" : color}
          fontSize="14"
          fontWeight="900"
          className="font-mono rotate-90"
        >
          {s === 0 ? '—' : Math.round(s)}
        </text>
      </svg>
    </div>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'done') return <CheckCircle size={14} className="text-[#3DEBA6]" />;
  if (status === 'failed') return <AlertCircle size={14} className="text-[#FF4D4D]" />;
  return <Loader size={14} className="text-[#5B5FEF] animate-spin" />;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await scanAPI.getDashboardStats();
      const dashboardData = data.data;

      if (dashboardData.recentScans) {
        dashboardData.recentScans = [...dashboardData.recentScans].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      setStats(dashboardData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useSocket('scan:done', (payload: any) => {
    toast.success(`Analysis Complete: ${payload?.atsScore || 0}%`);
    loadStats();
  });

  // Prepare data for the Trend Chart
  const trendData = useMemo(() => {
    if (!stats?.recentScans) return [];
    return [...stats.recentScans]
      .slice(0, 10) // Take last 10
      .reverse()    // Oldest to Newest
      .map((scan) => ({
        name: scan.jobId?.companyName || 'Unknown',
        score: Number(scan.atsScore) || 0,
        date: new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [stats]);

  const handleShare = (e: React.MouseEvent, scanId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const publicUrl = `${window.location.origin}/report/${scanId}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public report link copied!');
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4 bg-[#0A0A0F]">
        <div className="w-12 h-12 border-2 border-[#5B5FEF] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-mono text-xs animate-pulse tracking-widest">INITIALIZING HYRR_CORE...</p>
      </div>
    );
  }

  const limitReached = stats.scansUsed >= stats.scansLimit;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">

        {limitReached && (
          <div className="w-full bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-sm font-medium text-amber-200">
                Monthly scan limit reached. Upgrade for unlimited analysis.
              </p>
            </div>
            <Link to="/landing" className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Upgrade
            </Link>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Insights</h1>
            <div className="flex items-center gap-4 text-gray-500 font-mono text-xs">
              <span>{stats.totalScans} TOTAL SCANS</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-[#5B5FEF] uppercase tracking-widest">{stats.plan} Member</span>
            </div>
          </div>
          <Link to="/scan" className="bg-[#5B5FEF] hover:bg-[#4A4DDB] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-[#5B5FEF]/20 group">
            New Analysis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        {/* TOP ROW: ATS TREND CHART & RECOMMENDATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-[#13131A] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#5B5FEF]" />
                  ATS Score Trend
                </h3>
                <p className="text-gray-500 text-[10px] uppercase font-mono tracking-widest mt-1">Growth over last 10 scans</p>
              </div>
            </div>

            <div className="h-[240px] w-full">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      hide
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#13131A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#5B5FEF', fontWeight: 'bold' }}
                      cursor={{ stroke: '#5B5FEF', strokeWidth: 1, strokeDasharray: '4 4' }}
                      formatter={(value: number) => [`${value}%`, 'ATS Score']}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#5B5FEF"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600 text-sm italic font-mono uppercase tracking-widest">
                  Insufficient data for trend analysis
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#13131A] to-[#0D0D14] p-8 rounded-[32px] border border-[#F0C060]/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap size={80} />
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F0C060]/10 flex items-center justify-center border border-[#F0C060]/20 mb-4">
                <Target className="text-[#F0C060]" size={24} />
              </div>
              <p className="text-[#F0C060] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Top Recommendation</p>
              <h4 className="text-xl font-bold text-white mb-2 italic">
                {stats.topMissingKeyword ? `"${stats.topMissingKeyword}"` : "Keep it up!"}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {stats.topMissingKeyword
                  ? "Integrating this keyword into your experience section could boost your match rate significantly."
                  : "You're hitting the primary keywords for your target roles effectively."}
              </p>
            </div>
            <Link to="/scan" className="mt-6 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              Start new scan <ArrowRight size={14} className="text-[#F0C060]" />
            </Link>
          </div>
        </div>

        {/* STAT CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Peak Match" value={stats.bestScore} icon={TrendingUp} color="text-[#3DEBA6]" sub="All-time high" />
          <StatCard label="Average ATS" value={stats.avgATS} icon={Target} color="text-[#5B5FEF]" sub="Global average" />
          <StatCard label="Scan Quota" value={`${stats.scansUsed}/${stats.scansLimit}`} icon={FileSearch} color="text-violet-400" sub="Monthly usage" isStatic />
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="bg-[#13131A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-10 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-bold text-lg tracking-tight">Recent Activity</h3>
            <Link to="/scan" className="text-[10px] font-black text-[#5B5FEF] uppercase tracking-[0.2em]">View All</Link>
          </div>

          <div className="p-4 space-y-4">
            {!stats.recentScans?.length ? (
              <div className="p-20 text-center text-gray-500">No scan history found.</div>
            ) : (
              stats.recentScans.map((scan) => (
                <div
                  key={scan._id}
                  className="flex items-center justify-between p-5 bg-[#0D0D14] rounded-[24px] border border-white/5 hover:border-[#5B5FEF]/30 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <ScoreRing score={Number(scan.atsScore) || 0} size={56} stroke={4} />
                    <div>
                      <h4 className="font-bold text-gray-100 group-hover:text-[#5B5FEF] transition-colors">
                        {scan.jobId?.companyName || 'Unknown Company'}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {scan.jobId?.jobTitle || 'Role Not Specified'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                        <span className="flex items-center gap-1"><StatusIcon status={scan.status} /> {scan.status}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(scan.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {scan.status === 'done' && (
                      <button
                        onClick={(e) => handleShare(e, scan._id)}
                        className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#3DEBA6] hover:bg-[#3DEBA6]/10 transition-all flex items-center gap-2"
                        title="Share Report"
                      >
                        <Share2 size={18} />
                      </button>
                    )}
                    <Link
                      to={`/report/${scan._id}`}
                      className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-[#5B5FEF] transition-all"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub, isStatic }: any) {
  return (
    <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5 group transition-all">
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.2em]">{label}</span>
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon size={16} className={color} />
        </div>
      </div>
      <div className={`text-4xl font-black mb-1 tracking-tighter ${color}`}>
        {value}{!isStatic && typeof value === 'number' ? '%' : ''}
      </div>
      <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">{sub}</p>
    </div>
  );
}