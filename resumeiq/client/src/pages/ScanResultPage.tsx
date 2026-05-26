import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileDown,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Target,
  ClipboardList,
  Check,
  Share2,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

// --- IMPORT THE MAGIC REWRITE BUTTON ---
import MagicRewriteButton from '../components/ui/resume/MagicRewriteButton';

interface ScanResult {
  _id: string;
  atsScore: number;
  formattingScore?: number;
  keywordMatchPct?: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: any[];
  status: string;
  jobId: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  };
  resumeId: {
    originalName: string;
  };
}

// --- WIN RATE BADGE COMPONENT ---
const WinRateBadge = ({ score }: { score: number }) => {
  const avgATS = 68;
  let label = "";
  let colorClass = "";

  if (score >= 85) {
    label = "Top 10% of candidates";
    colorClass = "bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/30 shadow-[0_0_15px_rgba(61,235,166,0.3)]";
  } else if (score >= 75) {
    label = "Better than 75% of users";
    colorClass = "bg-[#5B5FEF]/10 text-[#5B5FEF] border-[#5B5FEF]/30 shadow-[0_0_15px_rgba(91,95,239,0.3)]";
  } else if (score > avgATS) {
    label = "Better than average";
    colorClass = "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
  } else {
    return null;
  }

  return (
    <div className={`mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorClass} animate-in fade-in slide-in-from-top-1 duration-700 backdrop-blur-md`}>
      <Zap size={12} fill="currentColor" className="drop-shadow-md" />
      {label}
    </div>
  );
};

export default function ScanResultPage() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<'pdf' | 'docx' | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [rewriteText, setRewriteText] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/scans/${id}`);
        // Normalizes data access layer checks
        const rootData = data.data?.scan || data.data || data;
        setScan(rootData);
      } catch (error) {
        toast.error('Failed to sync report calculations metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const checklistItems = useMemo(() => {
    if (!scan) return [];
    const items = [];
    const missingCount = scan.missingKeywords?.length || 0;
    const firstThree = scan.missingKeywords?.slice(0, 3).join(", ") || "";
    const moreCount = missingCount > 3 ? ` + ${missingCount - 3} more` : "";

    items.push({
      id: 'item-1',
      text: `Add ${missingCount} missing keywords to your Technical Skills section`,
      subtitle: missingCount > 0 ? `Missing: ${firstThree}${moreCount}` : "No missing keywords found!",
      show: true
    });

    const matchPct = scan.keywordMatchPct || scan.atsScore;
    items.push({
      id: 'item-2',
      text: `Your keyword match is ${Math.round(matchPct)}% — aim for above 70% for recruiter visibility`,
      show: matchPct < 70
    });

    const fmtScore = scan.formattingScore || 100;
    items.push({
      id: 'item-3',
      text: `Improve resume formatting — avoid tables, columns, and images`,
      show: fmtScore < 85
    });

    items.push({
      id: 'item-4',
      text: `Quantify at least 3 bullet points (e.g., "Reduced load time by 40%")`,
      show: true
    });

    items.push({
      id: 'item-5',
      text: `Great ATS score! Your resume is recruiter-ready for this role`,
      isSuccess: true,
      show: scan.atsScore >= 80
    });

    return items.filter(item => item.show);
  }, [scan]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const completedCount = checklistItems.filter(item => checkedItems[item.id]).length;

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/report/${id}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public presentation report string copied to clipboard!');
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsGenerating(format);
    try {
      const response = await api.post(`/scans/${id}/download`, { format }, { responseType: 'blob' });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Hyrr_Optimized_${scan?.jobId?.companyName || 'Resume'}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${format.toUpperCase()} structural template generated successfully!`);
    } catch (error) {
      toast.error('Document compilation engine encountered a runtime issue.');
    } finally {
      setIsGenerating(null);
    }
  };

  if (loading) return (
    <div className="flex-1 bg-[#0A0A0F] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#5B5FEF] animate-spin" />
    </div>
  );

  if (!scan) return (
    <div className="flex-1 bg-[#0A0A0F] flex items-center justify-center text-gray-500">
      Scan result data profile is missing.
    </div>
  );

  return (
    <div className="flex-1 bg-[#0A0A0F] text-[#EEEEF0] p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group text-sm font-bold">
          <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={18} />
          Back to Dashboard
        </Link>

        {/* Score Card Header Module */}
        <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 mb-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <div className={`w-36 h-36 rounded-full border-[8px] flex items-center justify-center text-5xl font-black transition-all duration-1000 bg-[#0A0A0F]/50 ${
                scan.atsScore >= 80 ? 'border-[#3DEBA6] text-[#3DEBA6] shadow-[0_0_50px_rgba(61,235,166,0.4),inset_0_0_20px_rgba(61,235,166,0.2)]' :
                scan.atsScore >= 60 ? 'border-[#F0C060] text-[#F0C060] shadow-[0_0_50px_rgba(240,192,96,0.4),inset_0_0_20px_rgba(240,192,96,0.2)]' :
                'border-[#ef4444] text-[#ef4444] shadow-[0_0_50px_rgba(239,68,68,0.4),inset_0_0_20px_rgba(239,68,68,0.2)]'
              }`}>
                {Math.round(scan.atsScore)}<span className="text-xl ml-0.5">%</span>
              </div>
              <WinRateBadge score={scan.atsScore} />
            </div>

            <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
              <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{scan.jobId?.jobTitle || 'Target Vacancy'}</h1>
              <p className="text-[#6B6B7E] font-mono uppercase tracking-[0.2em] text-xs font-bold">{scan.jobId?.companyName || 'Enterprise Profile'}</p>
            </div>
            <button
              onClick={handleShare}
              className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-gradient-to-r hover:from-[#5B5FEF]/20 hover:to-[#8E5BEF]/20 hover:border-[#5B5FEF]/50 transition-all duration-300 group shadow-lg"
            >
              <Share2 size={16} className="text-[#6B6B7E] group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-white group-hover:text-white">Share Report</span>
            </button>
          </div>
          <div className={`absolute -right-20 -top-20 w-80 h-80 blur-[120px] rounded-full pointer-events-none ${
            scan.atsScore >= 80 ? 'bg-[#3DEBA6]/15' :
            scan.atsScore >= 60 ? 'bg-[#F0C060]/15' :
            'bg-[#ef4444]/15'
          }`}></div>
        </div>

        {/* Optimized Content Download Card */}
        <div className="bg-[#13131A] border border-[#5B5FEF]/30 rounded-[32px] p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-[#3DEBA6]/10 text-[#3DEBA6] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                  <ShieldCheck size={12} /> Secure Generation
                </span>
              </div>
              <h2 className="text-2xl font-black mb-2">Download Optimized Resume</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our AI re-engineers your bullet points to naturally highlight <span className="text-[#3DEBA6] font-bold">{scan.missingKeywords?.length || 0} missing keywords</span> found in the job description.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleDownload('pdf')}
                disabled={!!isGenerating}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(91,95,239,0.4)] hover:shadow-[0_0_30px_rgba(91,95,239,0.6)]"
              >
                {isGenerating === 'pdf' ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                Download PDF
              </button>

              <button
                onClick={() => handleDownload('docx')}
                disabled={!!isGenerating}
                className="flex items-center justify-center gap-3 bg-[#0A0A0F]/50 border border-white/10 hover:bg-white/5 hover:border-white/20 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg"
              >
                {isGenerating === 'docx' ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                Download DOCX
              </button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.03] flex items-center gap-2">
            <Sparkles size={14} className="text-[#3DEBA6]" />
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              Proprietary Llama-3 optimization algorithm active
            </p>
          </div>
        </div>

        {/* Keywords Metrics Distributions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DEBA6]/5 blur-3xl rounded-full pointer-events-none"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#3DEBA6] mb-6 flex items-center gap-2 relative z-10">
              <CheckCircle size={16} /> Matched Keywords ({scan.matchedKeywords?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2.5 relative z-10">
              {scan.matchedKeywords?.map(k => (
                <span key={k} className="px-3.5 py-1.5 bg-[#3DEBA6]/10 border border-[#3DEBA6]/30 text-[#3DEBA6] text-[11px] font-bold rounded-xl uppercase tracking-wide shadow-[inset_0_0_10px_rgba(61,235,166,0.1)]">{k}</span>
              ))}
              {(!scan.matchedKeywords || scan.matchedKeywords.length === 0) && (
                <p className="text-xs text-[#6B6B7E] italic font-medium">No explicit semantic criteria matches flagged.</p>
              )}
            </div>
          </div>

          <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/5 blur-3xl rounded-full pointer-events-none"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#ef4444] mb-6 flex items-center gap-2 relative z-10">
              <AlertCircle size={16} /> Missing Keywords ({scan.missingKeywords?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2.5 relative z-10">
              {scan.missingKeywords?.map(k => (
                <span key={k} className="px-3.5 py-1.5 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-[11px] font-bold rounded-xl uppercase tracking-wide shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">{k}</span>
              ))}
              {(!scan.missingKeywords || scan.missingKeywords.length === 0) && (
                <span className="text-xs text-[#3DEBA6] font-bold font-mono">✓ 100% Core Matrix Intersection Coverage</span>
              )}
            </div>
          </div>
        </div>

        {/* Strategic System Suggestions Array Block */}
        <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5 mb-8">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <Target size={20} className="text-[#5B5FEF]" />
            Strategic Suggestions
          </h3>
          <div className="space-y-3">
            {scan.suggestions?.map((s, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl text-gray-400 text-sm">
                <span className="text-[#5B5FEF] font-mono font-black">0{i + 1}</span>
                <p>{typeof s === 'string' ? s : (s.text || s.message || "Refine template parameters alignment.")}</p>
              </div>
            ))}
            {(!scan.suggestions || scan.suggestions.length === 0) && (
              <p className="text-gray-500 italic text-sm">No structural optimization flags raised.</p>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Checklist Tracker */}
        <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ClipboardList size={22} className="text-[#3DEBA6]" />
              Optimization Checklist
            </h3>
            <span className="bg-[#3DEBA6]/10 border border-[#3DEBA6]/30 text-[#3DEBA6] text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(61,235,166,0.15)]">
              {completedCount}/{checklistItems.length} complete
            </span>
          </div>

          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${checkedItems[item.id]
                  ? 'bg-[#3DEBA6]/5 border-[#3DEBA6]/20 opacity-60 scale-[0.99]'
                  : 'bg-[#0A0A0F]/50 border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02] shadow-sm'
                  }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center border-2 transition-all duration-300 ${checkedItems[item.id]
                  ? 'bg-[#3DEBA6] border-[#3DEBA6] shadow-[0_0_10px_rgba(61,235,166,0.4)]'
                  : 'border-[#6B6B7E]'
                  }`}>
                  {checkedItems[item.id] && <Check size={16} className="text-black font-black" />}
                </div>

                <div className="flex-1">
                  <p className={`text-sm font-bold transition-all ${checkedItems[item.id] ? 'line-through text-[#6B6B7E]' : 'text-[#EEEEF0]'
                    } ${item.isSuccess ? 'text-[#3DEBA6]' : ''}`}>
                    {item.text}
                  </p>
                  {item.subtitle && (
                    <p className="text-[11px] text-[#6B6B7E] mt-1.5 font-mono uppercase tracking-tight font-bold">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Magic AI Generation Sandbox Playground */}
        <div className="bg-[#13131A]/80 backdrop-blur-xl border border-[#a25bef]/40 p-8 rounded-[32px] relative overflow-hidden shadow-[0_0_30px_rgba(162,91,239,0.1)]">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#a25bef]/15 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-3 flex items-center gap-2 text-white">
              <Sparkles size={22} className="text-[#a25bef]" />
              AI Bullet Point Rewriter
            </h3>
            <p className="text-sm text-[#6B6B7E] mb-8 font-medium">
              Paste a weak bullet point from your resume below. Our AI will instantly rewrite it to include strong action verbs tailored specifically for the <strong className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{scan.jobId?.jobTitle || 'Targeted'}</strong> role.
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-4">
              <label className="text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#a25bef] animate-pulse"></div> Draft Bullet Point
              </label>
              <MagicRewriteButton
                currentText={rewriteText}
                jobTitle={scan.jobId?.jobTitle}
                onRewrite={(newText) => setRewriteText(newText)}
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a25bef]/20 to-[#5B5FEF]/20 rounded-[20px] blur opacity-50 group-focus-within:opacity-100 transition duration-500"></div>
              <textarea
                value={rewriteText}
                onChange={(e) => setRewriteText(e.target.value)}
                placeholder='e.g., "I made the website faster and fixed bugs."'
                className="w-full relative bg-[#0A0A0F]/90 border border-white/10 rounded-[18px] p-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#a25bef]/50 focus:border-[#a25bef]/50 transition-all placeholder:text-[#6B6B7E] resize-y min-h-[140px] font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/scan" className="text-sm font-bold text-[#5B5FEF] hover:underline">
            Scan another resume
          </Link>
        </div>
      </div>
    </div>
  );
}