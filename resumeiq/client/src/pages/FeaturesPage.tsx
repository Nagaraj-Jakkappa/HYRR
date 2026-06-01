import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ScanSearch, KeySquare, Sparkles, LayoutTemplate, 
    FileText, Download, BarChart3, Settings
} from 'lucide-react';
import Footer from '../components/ui/Footer';

export default function FeaturesPage() {
    const navigate = useNavigate();

    const features = [
        { icon: ScanSearch, title: 'ATS Resume Scanner', desc: 'Instantly scan your resume against any job description to see how you stack up.' },
        { icon: KeySquare, title: 'Keyword Gap Analysis', desc: 'Identify exactly which crucial skills and keywords you are missing.' },
        { icon: Sparkles, title: 'AI Magic Rewrite', desc: 'Let our advanced AI rewrite weak bullets into powerful, action-driven statements.' },
        { icon: LayoutTemplate, title: 'Resume Builder Templates', desc: 'Choose from professionally designed, ATS-friendly templates.' },
        { icon: FileText, title: 'Cover Letter Generator', desc: 'Generate highly tailored cover letters in seconds with our AI engine.' },
        { icon: Download, title: 'PDF/DOCX Export', desc: 'Export your polished resume in standard formats ready for submission.' },
        { icon: BarChart3, title: 'Dashboard Analytics', desc: 'Track your application progress and scanning history.' },
        { icon: Settings, title: 'Flexible Plans', desc: 'Free, Pro, and Career+ tiers to fit your job hunt needs.' }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans overflow-x-hidden selection:bg-[#5B5FEF]/30 flex flex-col">
            {/* Header */}
            <div className="w-full border-b border-white/5 bg-[#0D0D14]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center shadow-lg shadow-[#5B5FEF]/20 transition-transform group-hover:scale-105">
                            <span className="font-black text-xs text-white">H</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">hyrr</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
                    </div>
                </div>
            </div>

            <main className="flex-1">
                {/* Hero */}
                <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                        Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5FEF] to-[#3DEBA6]">optimize your resume</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Hyrr helps job seekers scan resumes, improve ATS scores, rewrite bullets with AI, generate cover letters, and export polished resumes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/scan')} className="w-full sm:w-auto bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]">
                            Start Free Scan
                        </button>
                        <button onClick={() => navigate('/pricing')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all">
                            View Pricing
                        </button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-6xl mx-auto px-6 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-[#13131A]/50 border border-white/5 rounded-2xl p-6 hover:bg-[#13131A] transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-[#5B5FEF]/10 rounded-xl flex items-center justify-center mb-6 text-[#5B5FEF]">
                                    <feature.icon size={24} />
                                </div>
                                <h4 className="text-lg font-bold mb-3">{feature.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
