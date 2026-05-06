import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Check,
    Cpu,
    Zap,
    Cloud,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans selection:bg-[#5B5FEF]/30 overflow-x-hidden">

            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_rgba(91,95,239,0.08)_0%,_transparent_70%)] pointer-events-none" />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/[0.03]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LogoIcon />
                        <span className="font-extrabold text-2xl tracking-tighter">hyrr</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/login"
                            className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-[#13131A] border border-white/10 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B5FEF]/10 border border-[#5B5FEF]/20 mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DEBA6] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DEBA6]"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B5FEF]">Llama-3 Integration Live</span>
                </div>

                <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[0.95]">
                    Decode the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5FEF] to-[#8E91FF]">ATS</span>.<br />
                    Get the Interview.
                </h1>

                <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
                    Your resume, optimized for the modern algorithm. hyrr uses deep learning to identify skill gaps and align your profile with target job descriptions.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-[#5B5FEF] hover:bg-[#4A4EDF] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(91,95,239,0.3)] hover:shadow-[0_0_50px_rgba(91,95,239,0.5)] active:scale-95 group"
                    >
                        Analyze for free <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Live Score Badge */}
                <div className="mt-20 inline-flex items-center gap-5 bg-[#13131A] border border-white/[0.08] px-8 py-5 rounded-[24px] shadow-2xl relative">
                    <div className="absolute -top-3 -right-3 bg-[#3DEBA6] text-[#0A0A0F] text-[9px] font-black px-2 py-0.5 rounded-md">LIVE</div>
                    <div className="w-12 h-12 rounded-full border-[3px] border-[#3DEBA6] flex items-center justify-center text-sm font-mono font-black text-[#3DEBA6] shadow-[0_0_15px_rgba(61,235,166,0.2)]">
                        88
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-mono font-black tracking-[0.2em] text-gray-500 uppercase mb-0.5">Engine Status</div>
                        <div className="text-xs font-mono font-bold text-gray-300">
                            OPTIMIZING: <span className="text-[#3DEBA6] animate-pulse">STRENGTHENING PROFILE...</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* How it Works Section */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.03]">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight mb-4">The Workflow</h2>
                    <p className="text-gray-500 font-medium">Three steps to a job-ready application.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <WorkStep number="01" title="Upload" desc="Drop your current resume and the job description you're targeting." />
                    <WorkStep number="02" title="Analyze" desc="Our Llama-3 models parse keywords and calculate real-time match scores." />
                    <WorkStep number="03" title="Improve" desc="Follow actionable, technical tips to close the gap and secure the call." />
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard
                    icon={<Cpu size={24} />}
                    title="AI Scoring"
                    desc="Deep structure analysis of your technical profile."
                />
                <FeatureCard
                    icon={<Zap size={24} />}
                    title="Keyword Gap"
                    desc="Instantly identify missing hard and soft skills."
                />
                <FeatureCard
                    icon={<Cloud size={24} />}
                    title="Cloud Sync"
                    desc="Access your resume library anywhere, anytime."
                />
                <FeatureCard
                    icon={<ShieldCheck size={24} />}
                    title="Safe & Private"
                    desc="Your data is encrypted and never sold to third parties."
                />
            </section>

            {/* Testimonials Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.03]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TestimonialCard
                        quote="hyrr helped me fix keywords I didn't even know were missing. Got a callback from Swiggy in 2 days!"
                        name="Arjun Mehta"
                        role="Software Engineer"
                        company="Swiggy"
                        initials="AM"
                        color="bg-orange-500/20 text-orange-500"
                    />
                    <TestimonialCard
                        quote="The AI feedback is brutal but effective. My ATS score went from 45 to 88. Highly recommend."
                        name="Priya Das"
                        role="Frontend Developer"
                        company="Razorpay"
                        initials="PD"
                        color="bg-blue-500/20 text-blue-500"
                    />
                    <TestimonialCard
                        quote="Simple, fast, and high quality. Used it to tailor my resume for 5 different startups."
                        name="Rahul V."
                        role="Full Stack Dev"
                        company="Stealth Startup"
                        initials="RV"
                        color="bg-emerald-500/20 text-emerald-500"
                    />
                </div>
            </section>

            {/* Pricing Section */}
            <section className="max-w-5xl mx-auto px-6 py-20 mb-20 bg-gradient-to-b from-transparent to-[#5B5FEF]/05 rounded-[60px]">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight mb-4">Pricing Plans</h2>
                    <p className="text-gray-500 font-medium">Choose the scale that fits your career growth.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Free Card - Updated Label */}
                    <div className="bg-[#13131A] p-10 rounded-[40px] border border-white/[0.05] flex flex-col items-start transition-all hover:border-white/10 group">
                        <span className="text-[10px] font-mono font-black text-[#F0C060] uppercase tracking-[0.2em] mb-6">Free</span>
                        <div className="text-6xl font-black mb-8 tracking-tighter">
                            $0<span className="text-xl font-medium text-gray-600">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-12 flex-grow">
                            <PricingItem label="5 Analysis Scans per month" />
                            <PricingItem label="Basic keyword suggestions" />
                            <PricingItem label="Standard PDF/DOCX Support" />
                        </ul>
                        <Link to="/register" className="w-full py-4 bg-[#1A1A24] border border-white/[0.08] rounded-2xl font-bold text-center hover:bg-[#252533] transition-all">
                            Select Plan
                        </Link>
                    </div>

                    {/* Pro Card - Updated Label */}
                    <div className="bg-[#13131A] p-10 rounded-[40px] border border-[#5B5FEF]/40 ring-1 ring-[#5B5FEF]/20 flex flex-col items-start relative transition-all hover:scale-[1.02] shadow-[0_20px_50px_rgba(91,95,239,0.15)]">
                        <div className="absolute top-8 right-10">
                            <Zap className="text-[#5B5FEF] fill-[#5B5FEF]" size={24} />
                        </div>
                        <span className="text-[10px] font-mono font-black text-[#5B5FEF] uppercase tracking-[0.2em] mb-6">Pro</span>
                        <div className="text-6xl font-black mb-8 tracking-tighter">
                            $19<span className="text-xl font-medium text-gray-600">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-12 flex-grow">
                            <PricingItem label="Unlimited Priority Scans" active />
                            <PricingItem label="Advanced AI Resume Rewriting" active />
                            <PricingItem label="Priority Admin Dashboard Access" active />
                            <PricingItem label="Early access to new features" active />
                        </ul>
                        <Link to="/register?plan=pro" className="w-full py-4 bg-[#5B5FEF] rounded-2xl font-bold text-center hover:bg-[#4A4EDF] transition-all shadow-lg shadow-[#5B5FEF]/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 text-center border-t border-white/[0.03]">
                <div className="flex justify-center mb-8">
                    <LogoIcon grayscale />
                </div>
                <div className="font-black text-2xl mb-4 text-white">hyrr</div>
                <p className="text-xs font-mono font-bold text-gray-600 tracking-[0.2em] uppercase">
                    © 2026 hyrr AI. Decoded for the job.
                </p>
            </footer>
        </div>
    );
}

// Sub-components remains the same...
function TestimonialCard({ quote, name, role, company, initials, color }: any) {
    return (
        <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/[0.05]">
            <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">"{quote}"</p>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${color}`}>
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{role} @ {company}</p>
                </div>
            </div>
        </div>
    );
}

function LogoIcon({ grayscale = false }: { grayscale?: boolean }) {
    return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${grayscale ? 'bg-gray-800' : 'bg-[#5B5FEF] shadow-[#5B5FEF]/20'}`}>
            <svg viewBox="0 0 200 200" className="w-6 h-6">
                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
            </svg>
        </div>
    );
}

function WorkStep({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="bg-[#13131A] p-10 rounded-[32px] border border-white/[0.05] hover:border-white/[0.12] transition-all group">
            <span className="font-mono text-[10px] font-black text-[#F0C060] uppercase tracking-[0.2em] block mb-6 group-hover:translate-x-1 transition-transform">Step {number}</span>
            <h3 className="text-xl font-black mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-[#13131A] p-8 rounded-[32px] border border-white/[0.05] hover:border-[#5B5FEF]/30 transition-all group text-left">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:text-[#5B5FEF] group-hover:bg-[#5B5FEF]/10 transition-all">
                {icon}
            </div>
            <h3 className="text-lg font-black mb-2 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed font-semibold group-hover:text-gray-400 transition-colors">{desc}</p>
        </div>
    );
}

function PricingItem({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <li className="flex items-center gap-3 text-[13px] font-bold text-gray-400 text-left">
            <div className={`p-0.5 rounded-full ${active ? 'bg-[#5B5FEF]/20' : 'bg-gray-800'}`}>
                <Check size={14} strokeWidth={4} className={active ? "text-[#5B5FEF]" : "text-gray-600"} />
            </div>
            {label}
        </li>
    );
}