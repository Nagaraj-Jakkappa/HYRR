import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, UploadCloud, FileText, BarChart3, Search, Sparkles, Download, ArrowRight, CheckCircle2, ShieldCheck, Target, Zap
} from 'lucide-react';
import Footer from '../components/ui/Footer';
import { Link } from 'react-router-dom';

export default function DemoPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans overflow-x-hidden selection:bg-[#5B5FEF]/30">
            {/* Top Navigation / Header */}
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

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                    See how Hyrr improves your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5FEF] to-[#3DEBA6]">resume in minutes</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Upload your resume, paste a job description, and get ATS scoring, keyword gaps, AI rewrites, and a tailored cover letter.
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

            {/* Video Placeholder Section */}
            <section className="max-w-5xl mx-auto px-6 mb-24">
                <div className="relative w-full aspect-video bg-[#13131A]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden group cursor-pointer flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#5B5FEF]/5 to-transparent pointer-events-none" />
                    <div className="w-20 h-20 bg-[#5B5FEF]/20 border border-[#5B5FEF]/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5B5FEF] transition-all duration-300">
                        <Play size={32} className="text-[#5B5FEF] group-hover:text-white ml-2 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Product walkthrough coming soon</h3>
                    <p className="text-gray-400 font-medium">Preview the full resume optimization workflow</p>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-6xl mx-auto px-6 mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black mb-4">How it works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">A seamless workflow designed to get you past ATS filters and in front of hiring managers.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: UploadCloud, title: '1. Upload Resume', desc: 'Securely upload your existing PDF or DOCX resume.' },
                        { icon: FileText, title: '2. Paste Job Description', desc: 'Target the exact role you want to apply for.' },
                        { icon: BarChart3, title: '3. Get ATS Score', desc: 'Instantly see how well you match the job requirements.' },
                        { icon: Search, title: '4. Fix Missing Keywords', desc: 'Discover critical keywords you left out.' },
                        { icon: Sparkles, title: '5. Rewrite Bullets with AI', desc: 'Enhance your experience with powerful action verbs.' },
                        { icon: Download, title: '6. Generate Cover Letter & Export', desc: 'Download a tailored cover letter and an ATS-friendly PDF.' }
                    ].map((step, idx) => (
                        <div key={idx} className="bg-[#13131A]/50 border border-white/5 rounded-2xl p-6 hover:bg-[#13131A] transition-colors">
                            <div className="w-12 h-12 bg-[#5B5FEF]/10 rounded-xl flex items-center justify-center mb-4 text-[#5B5FEF]">
                                <step.icon size={24} />
                            </div>
                            <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Before vs After & Sample ATS */}
            <section className="max-w-6xl mx-auto px-6 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Before / After */}
                <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Sparkles className="text-[#3DEBA6]" /> AI Bullet Rewrites</h3>
                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 relative">
                            <div className="absolute -top-3 left-4 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/20">Before</div>
                            <p className="text-gray-400 text-sm italic mt-2">"Responsible for frontend dashboard components."</p>
                        </div>
                        <div className="flex justify-center text-gray-600">
                            <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                        </div>
                        <div className="bg-[#3DEBA6]/5 border border-[#3DEBA6]/10 rounded-xl p-5 relative">
                            <div className="absolute -top-3 left-4 bg-[#3DEBA6]/20 text-[#3DEBA6] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-[#3DEBA6]/20">After (Optimized)</div>
                            <p className="text-gray-200 text-sm mt-2 font-medium leading-relaxed">"Built reusable React dashboard components that improved UI consistency and reduced development time across core workflows."</p>
                        </div>
                    </div>
                </div>

                {/* ATS Sample */}
                <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Target className="text-[#5B5FEF]" /> Real-time ATS Scanning</h3>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-[#5B5FEF]/10 border-4 border-[#5B5FEF] flex items-center justify-center shadow-[0_0_30px_rgba(91,95,239,0.2)]">
                            <span className="text-3xl font-black text-[#5B5FEF]">82%</span>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white mb-1">Strong Match</p>
                            <p className="text-sm text-gray-400">Ready for minor optimizations</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">React Testing Library</span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">REST API</span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">MongoDB Aggregation</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Matched Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#3DEBA6]/10 text-[#3DEBA6] border border-[#3DEBA6]/20 px-2 py-1 rounded text-xs font-bold">React</span>
                                <span className="bg-[#3DEBA6]/10 text-[#3DEBA6] border border-[#3DEBA6]/20 px-2 py-1 rounded text-xs font-bold">Node.js</span>
                                <span className="bg-[#3DEBA6]/10 text-[#3DEBA6] border border-[#3DEBA6]/20 px-2 py-1 rounded text-xs font-bold">Express</span>
                                <span className="bg-[#3DEBA6]/10 text-[#3DEBA6] border border-[#3DEBA6]/20 px-2 py-1 rounded text-xs font-bold">Tailwind CSS</span>
                            </div>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mt-2">
                            <p className="text-xs text-blue-400 font-medium">💡 Actionable insight: Add role-specific keywords naturally into your experience bullets.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust / Value Section */}
            <section className="max-w-6xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: ShieldCheck, title: "Built for ATS filters", desc: "Our engine uses the same parsing logic as top HR systems to ensure readability." },
                    { icon: Target, title: "Personalized to each job", desc: "Stop sending generic resumes. Tailor every application to the exact job description." },
                    { icon: Zap, title: "Export-ready", desc: "Download beautifully formatted, ATS-compliant PDFs and custom cover letters instantly." }
                ].map((feature, i) => (
                    <div key={i} className="text-center p-6 bg-gradient-to-b from-[#13131A] to-[#0A0A0F] border border-white/5 rounded-3xl">
                        <div className="w-16 h-16 mx-auto bg-[#5B5FEF]/10 text-[#5B5FEF] rounded-2xl flex items-center justify-center mb-6">
                            <feature.icon size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* Final CTA */}
            <section className="max-w-4xl mx-auto px-6 mb-32 text-center bg-gradient-to-b from-[#13131A] to-[#0A0A0F] border border-white/5 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[#5B5FEF]/5" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to improve your resume?</h2>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of job seekers who are getting more interviews and landing their dream jobs with Hyrr.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)]">
                            Get Started Free
                        </button>
                        <button onClick={() => navigate('/scan')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all">
                            Run ATS Scan
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}