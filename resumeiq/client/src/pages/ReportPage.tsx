import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scanAPI } from '../services/api';
import { CheckCircle, XCircle, ShieldCheck, Share2, ArrowRight, Info, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface PublicScanData {
    _id: string;
    atsScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: (string | { type: string; text: string })[];
    jobTitle: string;
    companyName: string;
    resumeName: string;
    createdAt: string;
}

// --- WIN RATE BADGE COMPONENT ---
const WinRateBadge = ({ score }: { score: number }) => {
    const avgATS = 68;
    let label = "";
    let colorClass = "";

    if (score >= 85) {
        label = "Top 10% of candidates";
        colorClass = "bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/20";
    } else if (score >= 75) {
        label = "Top 25% of candidates";
        colorClass = "bg-[#5B5FEF]/10 text-[#5B5FEF] border-[#5B5FEF]/20";
    } else if (score > avgATS) {
        label = "Better than average";
        colorClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
    } else {
        return null;
    }

    return (
        <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${colorClass} animate-in fade-in zoom-in duration-500`}>
            <Zap size={8} fill="currentColor" />
            {label}
        </div>
    );
};

const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 80 ? '#3DEBA6' : score >= 60 ? '#F0C060' : '#FF4D4D';
    const offset = 283 - (score / 100) * 283;

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative flex items-center justify-center w-32 h-32">
                <svg width="128" height="128" className="transform -rotate-90 drop-shadow-xl">
                    <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="64" cy="64" r="45" fill="none" stroke={color} strokeWidth="8"
                        strokeDasharray="283" strokeDashoffset={offset} strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute text-center">
                    <span className="text-3xl font-black text-white">{Math.round(score)}</span>
                    <span className="text-sm font-bold text-white/50">%</span>
                </div>
            </div>
            {/* BADGE INTEGRATION */}
            <WinRateBadge score={score} />
        </div>
    );
};

export default function ReportPage() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<PublicScanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                if (!id) return;
                const res = await scanAPI.getPublicReport(id);
                setData(res.data.data.scan || res.data.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Report link copied!');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#5B5FEF] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-mono text-xs animate-pulse tracking-widest mt-4">SYNCING ANALYSIS...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-white">
            <div className="p-6 bg-red-500/10 rounded-full mb-6">
                <XCircle size={48} className="text-red-500 opacity-80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Report Not Found</h2>
            <Link to="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10">Back to Home</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans pb-20 selection:bg-[#5B5FEF]/30">
            <div className="border-b border-white/5 bg-[#13131A]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#5B5FEF] flex items-center justify-center text-[10px] font-black text-white">H</div>
                        <span className="font-bold text-sm tracking-tight">Hyrr Analysis Report</span>
                    </div>
                    <Link to="/" className="text-xs font-bold text-[#5B5FEF] hover:text-white transition-colors flex items-center gap-1">
                        Build your own <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 mt-8">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 bg-[#13131A] p-8 rounded-[32px] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <ScoreRing score={data.atsScore} />
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck size={16} className="text-[#3DEBA6]" />
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ATS Compatibility Score</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight mb-1">{data.jobTitle || 'Role Analysis'}</h1>
                            <p className="text-gray-400 font-medium">{data.companyName || 'Target Company'}</p>
                        </div>
                    </div>

                    <button onClick={copyLink} className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95">
                        <Share2 size={16} /> Share Report
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
                        <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
                            <CheckCircle size={18} className="text-[#3DEBA6]" /> Matched Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.matchedKeywords?.length ? data.matchedKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-[#3DEBA6]/10 text-[#3DEBA6] text-xs font-mono font-medium border border-[#3DEBA6]/20">{kw}</span>
                            )) : <p className="text-gray-600 text-xs font-mono italic">No matches detected.</p>}
                        </div>
                    </div>

                    <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
                        <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
                            <XCircle size={18} className="text-[#FF4D4D]" /> Missing Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.missingKeywords?.length ? data.missingKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-[#FF4D4D]/10 text-[#FF4D4D] text-xs font-mono font-medium border border-[#FF4D4D]/20">{kw}</span>
                            )) : <p className="text-gray-600 text-xs font-mono italic">Perfect keyword match!</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
                    <h3 className="text-sm font-bold mb-6 text-white uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Info size={14} className="text-[#5B5FEF]" /> Optimization Strategy
                    </h3>
                    <ul className="space-y-4">
                        {data.suggestions?.length ? data.suggestions.map((suggestion, index) => {
                            const content = typeof suggestion === 'object' ? (suggestion as any).text : suggestion;
                            return (
                                <li key={index} className="flex gap-4 text-sm text-gray-400 bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-[#5B5FEF] font-black font-mono mt-0.5">{(index + 1).toString().padStart(2, '0')}</span>
                                    <p className="leading-relaxed">{content}</p>
                                </li>
                            );
                        }) : <p className="text-gray-600 text-sm italic">No suggestions available.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
}