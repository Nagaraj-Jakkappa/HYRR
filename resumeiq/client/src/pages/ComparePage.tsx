import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { scanAPI } from '../services/api';
import { ArrowLeft, Trophy, CheckCircle2, XCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const ScoreBar = ({ label, value }: { label: string, value: number }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#5B5FEF] rounded-full" style={{ width: `${value}%` }} />
        </div>
    </div>
);

const ComparePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [scans, setScans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const id1 = searchParams.get('scan1');
    const id2 = searchParams.get('scan2');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id1 || !id2) {
                    setLoading(false);
                    return;
                }

                const [res1, res2] = await Promise.all([
                    scanAPI.getById(id1),
                    scanAPI.getById(id2)
                ]);

                const scan1Data = res1.data?.data?.scan || res1.data?.scan || res1.data;
                const scan2Data = res2.data?.data?.scan || res2.data?.scan || res2.data;

                if (!scan1Data || !scan2Data) {
                    throw new Error("Scan data not found");
                }

                setScans([scan1Data, scan2Data]);
            } catch (err: any) {
                console.error("Comparison Fetch Error:", err);
                toast.error("Failed to load comparison data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id1, id2]);

    if (loading) return <div className="h-screen bg-[#0A0A0F] flex items-center justify-center text-white font-mono uppercase text-xs tracking-widest">Loading comparison...</div>;

    if (scans.length < 2) return <div className="h-screen bg-[#0A0A0F] p-8 text-white">Error loading scan data.</div>;

    const winnerIndex = (scans[0]?.atsScore || 0) >= (scans[1]?.atsScore || 0) ? 0 : 1;
    const scoreDiff = Math.abs((scans[0]?.atsScore || 0) - (scans[1]?.atsScore || 0));

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen bg-[#0A0A0F] text-[#EEEEF0]">
            <Link to="/history" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} /> <span className="text-xs font-mono uppercase">Back to History</span>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start relative">
                <div className="hidden md:flex flex-col items-center justify-center h-full absolute left-1/2 -translate-x-1/2 py-20 pointer-events-none">
                    <div className="w-[1px] h-full bg-white/5" />
                    <div className="my-4 bg-[#13131A]/90 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] px-4 py-1.5 rounded-full text-[11px] font-black text-[#5B5FEF] tracking-widest uppercase">VS</div>
                    <div className="w-[1px] h-full bg-white/5" />
                </div>

                {scans.map((scan, idx) => (
                    <div
                        key={scan?._id || idx}
                        className={`relative bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border transition-all duration-700 ${idx === winnerIndex
                                ? 'border-[#3DEBA6]/40 shadow-[0_0_50px_rgba(61,235,166,0.15)] scale-[1.02] z-10'
                                : 'border-white/5 opacity-70 hover:opacity-100 shadow-xl'
                            }`}
                    >
                        {/* BETTER FIT BADGE */}
                        {idx === winnerIndex && (
                            <div className="absolute -top-4 -right-4 bg-[#3DEBA6] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(61,235,166,0.4)] animate-in fade-in zoom-in duration-500">
                                <Zap size={12} fill="currentColor" />
                                Better Fit
                            </div>
                        )}

                        <header className="mb-8">
                            <p className="text-[10px] font-black text-[#5B5FEF] uppercase tracking-widest mb-1">{scan.jobId?.companyName || 'Unknown Company'}</p>
                            <h2 className="text-2xl font-bold">{scan.jobId?.jobTitle || 'Role'}</h2>
                        </header>

                        <div className="flex justify-center mb-10 relative">
                            {idx === winnerIndex && <div className="absolute inset-0 bg-[#3DEBA6]/10 blur-2xl rounded-full scale-150"></div>}
                            <div className={`w-36 h-36 rounded-full border-8 flex items-center justify-center relative transition-colors duration-700 bg-[#0A0A0F]/50 ${idx === winnerIndex ? 'border-[#3DEBA6] shadow-[0_0_30px_rgba(61,235,166,0.3),inset_0_0_15px_rgba(61,235,166,0.2)]' : 'border-white/5 shadow-inner'
                                }`}>
                                <div className="text-center relative z-10">
                                    <span className={`text-3xl font-black block ${idx === winnerIndex ? 'text-[#3DEBA6]' : 'text-white'}`}>
                                        {scan.atsScore || 0}%
                                    </span>
                                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">ATS Score</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <ScoreBar label="Keyword Match" value={scan.keywordMatchPct || 0} />
                            <ScoreBar label="Formatting" value={85} />
                            <ScoreBar label="ATS Optimization" value={scan.atsScore || 0} />
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Keyword Analysis</h4>
                            <div className="flex flex-wrap gap-2">
                                {(scan.analysis?.matchedKeywords || []).slice(0, 8).map((kw: string) => (
                                    <span key={kw} className="px-2 py-1 bg-[#3DEBA6]/10 text-[#3DEBA6] border border-[#3DEBA6]/20 rounded-md text-[10px] font-mono flex items-center gap-1">
                                        <CheckCircle2 size={10} /> {kw}
                                    </span>
                                ))}
                                {(scan.analysis?.missingKeywords || []).slice(0, 8).map((kw: string) => (
                                    <span key={kw} className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 rounded-md text-[10px] font-mono flex items-center gap-1">
                                        <XCircle size={10} /> {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-[#3DEBA6]/10 border border-[#3DEBA6]/30 p-8 rounded-[32px] flex items-center justify-center gap-4 text-[#3DEBA6] shadow-[0_0_30px_rgba(61,235,166,0.1)] backdrop-blur-md">
                <Trophy size={28} className="drop-shadow-md" />
                <p className="font-bold text-base">
                    <span className="uppercase tracking-widest mr-2">{scans[winnerIndex]?.jobId?.companyName || 'Selected Path'}</span>
                    is a better fit — <span className="font-black">{scoreDiff}% higher match probability</span>
                </p>
            </div>
        </div>
    );
};

export default ComparePage;