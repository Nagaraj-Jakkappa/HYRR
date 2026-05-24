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
    colorClass = "bg-[#3DEBA6]/10 text-[#3DEBA6] border-[#3DEBA6]/20";
  } else if (score >= 75) {
    label = "Better than 75% of users";
    colorClass = "bg-[#5B5FEF]/10 text-[#5B5FEF] border-[#5B5FEF]/20";
  } else if (score > avgATS) {
    label = "Better than average";
    colorClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  } else {
    return null;
  }

  return (
    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorClass} animate-in fade-in slide-in-from-top-1 duration-700`}>
      <Zap size={10} fill="currentColor" />
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
                <div className="absolute text-center flex flex-col items-center justify-center pt-1">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-black text-white">{Math.round(score)}</span>
                        <span className="text-sm font-bold text-white/50">%</span>
                    </div>
                </div>
            </div>
            {/* BADGE INTEGRATION */}
            <WinRateBadge score={score} />
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
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scans/${id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ format })
      });

      if (!response.ok) throw new Error('Download request failed');
      const blob = await response.blob();
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
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#5B5FEF] animate-spin" />
    </div>
  );

  if (!scan) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-gray-500">
      Scan result data profile is missing.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group text-sm font-bold">
          <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={18} />
          Back to Dashboard
        </Link>

        {/* Score Card Header Module */}
        <div className="bg-[#13131A] border border-white/5 rounded-[40px] p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <ScoreRing score={scan.atsScore} />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black mb-1">{scan.jobId?.jobTitle || 'Target Vacancy'}</h1>
              <p className="text-gray-500 font-mono uppercase tracking-[0.2em] text-xs">{scan.jobId?.companyName || 'Enterprise Profile'}</p>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#5B5FEF]/10 hover:border-[#5B5FEF]/30 transition-all group"
            >
              <Share2 size={16} className="text-gray-400 group-hover:text-[#5B5FEF]" />
              <span className="text-sm font-bold">Share Report</span>
            </button>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#5B5FEF]/10 blur-[100px] rounded-full"></div>
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
                className="flex items-center justify-center gap-3 bg-[#5B5FEF] hover:bg-[#4A4EDF] disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-[#5B5FEF]/20"
              >
                {isGenerating === 'pdf' ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                Download PDF
              </button>

              <button
                onClick={() => handleDownload('docx')}
                disabled={!!isGenerating}
                className="flex items-center justify-center gap-3 bg-transparent border border-white/10 hover:bg-white/5 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
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
          <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#3DEBA6] mb-6 flex items-center gap-2">
              <CheckCircle size={14} /> Matched Keywords ({scan.matchedKeywords?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {scan.matchedKeywords?.map(k => (
                <span key={k} className="px-3 py-1 bg-[#3DEBA6]/5 border border-[#3DEBA6]/10 text-[#3DEBA6] text-[10px] font-bold rounded-lg uppercase">{k}</span>
              ))}
              {(!scan.matchedKeywords || scan.matchedKeywords.length === 0) && (
                <p className="text-xs text-gray-600 italic">No explicit semantic criteria matches flagged.</p>
              )}
            </div>
          </div>

          <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-6 flex items-center gap-2">
              <AlertCircle size={14} /> Missing Keywords ({scan.missingKeywords?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {scan.missingKeywords?.map(k => (
                <span key={k} className="px-3 py-1 bg-red-400/5 border border-red-400/10 text-red-400 text-[10px] font-bold rounded-lg uppercase">{k}</span>
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
        <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <ClipboardList size={20} className="text-[#3DEBA6]" />
              Your improvement checklist
            </h3>
            <span className="bg-[#3DEBA6]/10 text-[#3DEBA6] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {completedCount}/{checklistItems.length} complete
            </span>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${checkedItems[item.id]
                  ? 'bg-[#3DEBA6]/5 border-[#3DEBA6]/20 opacity-60'
                  : 'bg-white/[0.01] border-white/[0.03] hover:border-white/10'
                  }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${checkedItems[item.id]
                  ? 'bg-[#3DEBA6] border-[#3DEBA6]'
                  : 'border-gray-600'
                  }`}>
                  {checkedItems[item.id] && <Check size={14} className="text-black font-bold" />}
                </div>

                <div className="flex-1">
                  <p className={`text-sm font-bold transition-all ${checkedItems[item.id] ? 'line-through text-gray-500' : 'text-gray-200'
                    } ${item.isSuccess ? 'text-[#3DEBA6]' : ''}`}>
                    {item.text}
                  </p>
                  {item.subtitle && (
                    <p className="text-[11px] text-gray-500 mt-1 font-mono uppercase tracking-tight">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Magic AI Generation Sandbox Playground */}
        <div className="bg-[#13131A] border border-[#a25bef]/30 p-8 rounded-[32px] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#a25bef]/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-2 flex items-center gap-2 text-white">
              <Sparkles size={20} className="text-[#a25bef]" />
              AI Bullet Point Rewriter
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Paste a weak bullet point from your resume below. Our AI will instantly rewrite it to include strong action verbs tailored specifically for the <strong className="text-white">{scan.jobId?.jobTitle || 'Targeted'}</strong> role.
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Draft Bullet Point
              </label>
              <MagicRewriteButton
                currentText={rewriteText}
                jobTitle={scan.jobId?.jobTitle}
                onRewrite={(newText) => setRewriteText(newText)}
              />
            </div>

            <textarea
              value={rewriteText}
              onChange={(e) => setRewriteText(e.target.value)}
              placeholder='e.g., "I made the website faster and fixed bugs."'
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-sm text-gray-200 focus:outline-none focus:border-[#a25bef]/50 transition-colors placeholder:text-gray-600 resize-y min-h-[120px]"
            />
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