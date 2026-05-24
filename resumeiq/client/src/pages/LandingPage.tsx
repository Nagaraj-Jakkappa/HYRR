import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import {
    ArrowRight,
    Sparkles,
    ScanSearch,
    LayoutTemplate,
    FileText,
    Linkedin,
    BrainCircuit,
    Check,
    Zap,
    BarChart3,
    ShieldCheck,
    ChevronDown,
    Download,
    GitCompareArrows,
    Share2,
    Clock,
    Cpu,
    Layers,
    MousePointerClick,
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ title: string, price: string } | null>(null);

    const handlePlanSelect = (title: string, price: string) => {
        if (title.toLowerCase() === 'free') {
            navigate('/register');
        } else {
            setSelectedPlan({ title, price });
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] overflow-x-hidden selection:bg-[#5B5FEF]/30">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,95,239,0.12),_transparent_40%)] pointer-events-none" />
            <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#3DEBA6]/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LogoIcon />
                        <span className="text-2xl font-black tracking-tight">
                            hyrr
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
                        <a href="#how-it-works" className="hover:text-white transition">
                            How It Works
                        </a>
                        <a href="#features" className="hover:text-white transition">
                            Features
                        </a>
                        <a href="#templates" className="hover:text-white transition">
                            Templates
                        </a>
                        <a href="#pricing" className="hover:text-white transition">
                            Pricing
                        </a>
                        <a href="#faq" className="hover:text-white transition">
                            FAQ
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-bold text-gray-400 hover:text-white transition"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
            <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24">
                <div className="text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#5B5FEF]/20 bg-[#5B5FEF]/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#3DEBA6] animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5B5FEF]">
                            Powered by Groq &times; Llama 3.3
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.92] max-w-6xl mx-auto mb-8">
                        Build Resumes That{' '}
                        <span className="bg-gradient-to-r from-[#5B5FEF] to-[#8E91FF] text-transparent bg-clip-text">
                            Beat the ATS
                        </span>
                        <br />
                        and Land Interviews.
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12">
                        Upload your resume. Paste a job description. Get an instant AI-powered ATS
                        score, keyword gap analysis, bullet-point rewrites, and a tailored cover
                        letter — all generated in real time with Groq&rsquo;s Llama&nbsp;3.3 engine.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center bg-[#5B5FEF] hover:bg-[#4A4EDF] px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_50px_rgba(91,95,239,0.35)] group"
                        >
                            Start Building Free
                            <ArrowRight
                                size={20}
                                className="ml-2 group-hover:translate-x-1 transition-transform"
                            />
                        </Link>

                        <button
                            onClick={() => navigate('/demo')}
                            className="px-10 py-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] font-bold text-lg transition-all"
                        >
                            Watch Demo
                        </button>
                    </div>

                    {/* Dashboard Preview — 3-card grid */}
                    <div className="relative max-w-6xl mx-auto">
                        <div className="absolute inset-0 bg-[#5B5FEF]/20 blur-[120px]" />

                        <div className="relative bg-[#13131A] border border-white/[0.06] rounded-[40px] p-6 shadow-2xl">
                            <div className="grid lg:grid-cols-3 gap-6">

                                {/* ATS Score Card */}
                                <div className="bg-[#0F0F15] border border-white/[0.05] rounded-3xl p-6 text-left">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-sm text-gray-400 font-semibold">
                                            ATS Match Score
                                        </span>
                                        <span className="text-[#3DEBA6] text-sm font-black">
                                            +24% vs. original
                                        </span>
                                    </div>
                                    <div className="text-6xl font-black mb-4 text-[#3DEBA6]">92</div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[92%] h-full bg-[#3DEBA6] rounded-full" />
                                    </div>
                                    <p className="mt-5 text-sm text-gray-500">
                                        Keyword density, formatting, and section structure all optimized for "Senior Full Stack Engineer" at Razorpay.
                                    </p>
                                </div>

                                {/* Magic Rewrite Card */}
                                <div className="bg-[#0F0F15] border border-white/[0.05] rounded-3xl p-6 text-left">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles size={18} className="text-[#5B5FEF]" />
                                        <span className="font-bold">Magic Rewrite</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-red-500/10 border border-red-500/10 rounded-2xl p-4">
                                            <p className="text-xs text-red-300 line-through">
                                                Maintained legacy React dashboard components.
                                            </p>
                                        </div>
                                        <div className="bg-[#3DEBA6]/10 border border-[#3DEBA6]/10 rounded-2xl p-4">
                                            <p className="text-sm text-[#3DEBA6] font-medium">
                                                Architected high-performance React dashboard, reducing latency by 400ms and driving a 31% lift in monthly active users.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Cover Letter Card */}
                                <div className="bg-[#0F0F15] border border-white/[0.05] rounded-3xl p-6 text-left flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <FileText size={18} className="text-[#5B5FEF]" />
                                            <span className="font-bold">AI Cover Letter</span>
                                        </div>
                                        <div className="space-y-3 bg-[#0A0A0F]/60 border border-white/5 p-4 rounded-2xl font-mono text-[11px] leading-relaxed text-gray-400">
                                            <p className="text-[#3DEBA6] font-bold">Dear Hiring Team at Alphabet Inc.,</p>
                                            <p className="mt-2">
                                                I am writing to express my strong interest in the L5 Engineering position. With a deep technical background in architecting high-performance web ecosystems and optimizing data pipelines&hellip;
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-sm text-gray-500">
                                        Generated from your resume data, tailored to company &amp; role.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════ SOCIAL PROOF BAR ═══════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-10">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-gray-600 font-black mb-10">
                    Built for Job Seekers Targeting Top Companies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {['FAANG', 'Product Startups', 'Big 4 Consulting', 'Fortune 500', 'Remote-First', 'Govt. & PSU'].map((item) => (
                        <div
                            key={item}
                            className="px-6 py-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-gray-400 font-bold text-sm"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
            <section
                id="how-it-works"
                className="max-w-7xl mx-auto px-6 py-28 border-t border-white/[0.04]"
            >
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black tracking-tight mb-5">
                        How HYRR Works
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Four steps from raw resume to interview-ready application — with real-time AI feedback at every stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <WorkStep
                        number="01"
                        title="Upload Resume"
                        desc="Upload a PDF or DOCX, or import directly from your LinkedIn profile PDF. HYRR extracts and structures all your data automatically."
                    />
                    <WorkStep
                        number="02"
                        title="Scan Against Job"
                        desc="Paste the target job description. The Llama 3.3 engine extracts keywords, compares them with your resume, and scores the match in real time via WebSockets."
                    />
                    <WorkStep
                        number="03"
                        title="Optimize & Rewrite"
                        desc="Use Magic Rewrite to transform weak bullet points into strong, metric-driven statements. Fill missing keyword gaps identified in the scan."
                    />
                    <WorkStep
                        number="04"
                        title="Export & Apply"
                        desc="Download optimized resumes as PDF or DOCX, generate a tailored AI cover letter, and share scan reports with a public link."
                    />
                </div>
            </section>

            {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
            <section
                id="features"
                className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04]"
            >
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black mb-5">
                        Everything You Need to Get Hired
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        A complete AI-powered career toolkit — resume building, ATS optimization, cover letters, and analytics, all in one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<ScanSearch size={24} />}
                        title="Real-Time ATS Scoring"
                        desc="Upload a resume and a job description — get an instant ATS match score with keyword-level analysis, formatting grade, and actionable suggestions. Live Socket.io progress updates keep you in the loop."
                    />
                    <FeatureCard
                        icon={<Sparkles size={24} />}
                        title="AI Magic Rewrite"
                        desc="One-click rewrite of any bullet point. HYRR uses Groq's Llama 3.3 model to turn vague descriptions into metric-driven, achievement-focused statements tuned for the target role."
                    />
                    <FeatureCard
                        icon={<FileText size={24} />}
                        title="AI Cover Letters"
                        desc="Generate a three-paragraph, context-aware cover letter tailored to a specific company and role — directly from your resume data. Edit, preview, and export as PDF."
                    />
                    <FeatureCard
                        icon={<LayoutTemplate size={24} />}
                        title="10 Resume Templates"
                        desc="Choose from Minimalist, Modern Slate, Executive, Tech Mono, Creative Split, Academic CV, Sleek Serif, Infographic, EuroPass, and Metric Matrix — all ATS-friendly and export-ready."
                    />
                    <FeatureCard
                        icon={<Linkedin size={24} />}
                        title="LinkedIn PDF Import"
                        desc="Upload your LinkedIn 'Save to PDF' export. Llama 3 parses the document and auto-fills your personal info, experience, education, and skills into the builder."
                    />
                    <FeatureCard
                        icon={<Download size={24} />}
                        title="Optimized Export (PDF & DOCX)"
                        desc="Download AI-optimized versions of your resume with missing keywords naturally woven in. Available in both PDF and DOCX formats for maximum compatibility."
                    />
                    <FeatureCard
                        icon={<GitCompareArrows size={24} />}
                        title="Compare Scans"
                        desc="Run multiple scans across different job descriptions and compare results side by side — see which version of your resume performs best for each role."
                    />
                    <FeatureCard
                        icon={<Share2 size={24} />}
                        title="Shareable Reports"
                        desc="Every scan generates a public shareable report with your ATS score, matched & missing keywords, and improvement suggestions — perfect for career coaches or peer review."
                    />
                    <FeatureCard
                        icon={<BarChart3 size={24} />}
                        title="Dashboard Analytics"
                        desc="Track your average ATS score, best score, total scans, and most frequently missing keywords across all your applications from a centralized dashboard."
                    />
                </div>
            </section>

            {/* ═══════════════════════════════ TEMPLATES ═══════════════════════════════ */}
            <section
                id="templates"
                className="max-w-7xl mx-auto px-6 py-28 border-t border-white/[0.04]"
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
                        10 ATS-Friendly Resume Templates
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                        Every template is designed to pass automated parsing systems while looking polished to human recruiters. Switch between layouts instantly in the builder — your content stays intact.
                    </p>
                </div>

                {/* Template Grid — 5 image cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
                    <TemplateCard
                        image="/image_614ba7.jpg"
                        name="Modern"
                        tag="ATS GOLD"
                        desc="A clean and structured template that fits detailed experience on a single page while remaining easy to read—making it a strong, ATS-friendly choice for many roles."
                    />
                    <TemplateCard
                        image="/image_614c06.jpg"
                        name="Ivy League"
                        tag="HARVARD"
                        desc="A modernized Harvard template featuring a stand-out design and a sophisticated feel. Compact enough to fit a stand-out section like a tailored summary and a strengths section, yet features enough white space."
                    />
                    <TemplateCard
                        image="/image_614f52.jpg"
                        name="Elegant"
                        tag="COLUMN"
                        desc="A beautiful template that highlights the strengths & uniqueness of the applicant in a dedicated column, while leaving most of the space for the employment history & education."
                    />
                    <TemplateCard
                        image="/image_614fce.jpg"
                        name="Polished"
                        tag="PREMIUM"
                        desc="A stand-out design that looks professional, but also invites the recruiter to spend more time on the resume."
                    />
                    <TemplateCard
                        image="/image_61534c.jpg"
                        name="Single Column"
                        tag="OCR RIGID"
                        desc="A classic design enhanced to stand out subtly. Highlighted headings improve readability, allowing recruiters to quickly grasp your application and see how you fit the role."
                    />
                </div>

                {/* Additional templates note */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 mb-6">
                        + 5 more templates in the builder: <span className="text-gray-300 font-semibold">Single Column Refined</span>, <span className="text-gray-300 font-semibold">Creative</span>, <span className="text-gray-300 font-semibold">Double Column</span>, <span className="text-gray-300 font-semibold">Elite</span>, and <span className="text-gray-300 font-semibold">Monochrome</span>
                    </p>

                    <Link
                        to="/register"
                        className="px-8 py-3.5 bg-[#13131A] hover:bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest uppercase text-white transition-all active:scale-95 inline-block"
                    >
                        Try All Templates Free
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════ TECH STACK STRIP ═══════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/[0.04]">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black mb-3 tracking-tight">Built With Modern Infrastructure</h2>
                    <p className="text-gray-500 text-sm">Production-grade stack, not a weekend prototype.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    {[
                        { label: 'React 18 + TypeScript', icon: <Layers size={14} /> },
                        { label: 'Node.js + Express', icon: <Cpu size={14} /> },
                        { label: 'MongoDB + Redis', icon: <BarChart3 size={14} /> },
                        { label: 'Socket.io (Real-Time)', icon: <Zap size={14} /> },
                        { label: 'Groq + Llama 3.3', icon: <BrainCircuit size={14} /> },
                        { label: 'Cloudinary CDN', icon: <Download size={14} /> },
                        { label: 'JWT + RBAC Auth', icon: <ShieldCheck size={14} /> },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-gray-300 font-semibold text-xs"
                        >
                            <span className="text-[#5B5FEF]">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════ METRICS ═══════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <MetricCard value="10" label="ATS-Friendly Resume Templates" />
                    <MetricCard value="4" label="AI Features (Scan, Rewrite, Cover Letter, Import)" />
                    <MetricCard value="<3s" label="Average Scan Completion Time" />
                    <MetricCard value="2" label="Export Formats (PDF & DOCX)" />
                </div>
            </section>

            {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-5">What Users Are Saying</h2>
                    <p className="text-gray-500 text-lg">Real feedback from early adopters.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <TestimonialCard
                        quote="I went from a 54% ATS score to 91% on my first scan. The Magic Rewrite feature alone is worth it — turned my bland bullets into actual achievement statements."
                        name="Priya S."
                        role="Frontend Developer"
                    />
                    <TestimonialCard
                        quote="The LinkedIn import saved me an hour of data entry. I uploaded my PDF and the entire resume builder was pre-filled with structured data. Incredibly smooth."
                        name="Arjun M."
                        role="Full Stack Engineer"
                    />
                    <TestimonialCard
                        quote="Being able to compare scans across different JDs helped me realize my resume was too generic. After optimizing, I got 3 interview calls in one week."
                        name="Sneha K."
                        role="Data Analyst"
                    />
                </div>
            </section>

            {/* ═══════════════════════════════ PRICING ═══════════════════════════════ */}
            <section
                id="pricing"
                className="max-w-7xl mx-auto px-6 py-28 border-t border-white/[0.04]"
            >
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black mb-5">Simple, Transparent Pricing</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Start free. Upgrade when you need unlimited scans and AI features.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <PricingCard
                        title="Free"
                        price="₹0"
                        desc="Get started, no credit card required."
                        items={[
                            '3 ATS scans per month',
                            'Basic AI Magic Rewrite',
                            '1 resume template',
                            'PDF export',
                            'Shareable scan reports',
                        ]}
                        onSelect={handlePlanSelect}
                    />
                    <PricingCard
                        featured
                        title="Pro"
                        price="₹1499"
                        desc="For active job seekers."
                        items={[
                            'Unlimited ATS scans',
                            'Unlimited AI rewrites',
                            'AI cover letter generator',
                            'All 10 resume templates',
                            'LinkedIn PDF import',
                            'PDF & DOCX export',
                            'Scan comparison',
                            'Priority AI inference',
                        ]}
                        onSelect={handlePlanSelect}
                    />
                    <PricingCard
                        title="Career+"
                        price="₹2999"
                        desc="For power users & career coaches."
                        items={[
                            'Everything in Pro',
                            'Dashboard analytics',
                            'Version history tracking',
                            'Optimized resume downloads',
                            'Priority support',
                        ]}
                        onSelect={handlePlanSelect}
                    />
                </div>
            </section>

            {/* ═══════════════════════════════ FAQ ═══════════════════════════════ */}
            <section
                id="faq"
                className="max-w-4xl mx-auto px-6 py-28 border-t border-white/[0.04]"
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-5">Frequently Asked Questions</h2>
                    <p className="text-gray-500 text-lg">Everything you need to know before getting started.</p>
                </div>

                <div className="space-y-4">
                    <FAQItem
                        q="What AI model does HYRR use?"
                        a="HYRR uses Meta's Llama 3.3 (70B Versatile) and Llama 3.1 (8B Instant) models via the Groq inference engine. This gives you fast, high-quality AI outputs for resume analysis, bullet-point rewrites, cover letter generation, and LinkedIn parsing."
                    />
                    <FAQItem
                        q="How does ATS scoring work?"
                        a="When you create a scan, HYRR first extracts the top 15-20 keywords from the job description using AI. Then it analyzes your resume against those keywords, evaluates formatting, section structure, and overall alignment. You get a score from 0-100, a list of matched and missing keywords, and actionable suggestions — all delivered in real time via WebSockets."
                    />
                    <FAQItem
                        q="Can I import my LinkedIn profile?"
                        a="Yes! Go to the Resume Builder and use the LinkedIn Import feature. Upload the PDF generated by LinkedIn's 'Save to PDF' option. Llama 3 parses the document and auto-fills your personal info, experience history, education, and skills into the builder."
                    />
                    <FAQItem
                        q="What resume templates are available?"
                        a="HYRR offers 10 templates: Minimalist, Modern Slate, Executive, Tech Mono, Creative Split, Academic CV, Sleek Serif, Infographic, EuroPass, and Metric Matrix. All are designed to pass ATS parsing while looking professional to human recruiters."
                    />
                    <FAQItem
                        q="Is my data secure?"
                        a="Yes. HYRR uses JWT authentication with refresh tokens, role-based access control (RBAC), and encrypted file storage via Cloudinary. Your resumes and scan data are only accessible to your authenticated account."
                    />
                    <FAQItem
                        q="Can I share my scan results?"
                        a="Yes. Every completed scan generates a public report URL you can share with career coaches, mentors, or peers. The report includes your ATS score, keyword analysis, and suggestions — without exposing your full resume."
                    />
                </div>
            </section>

            {/* ═══════════════════════════════ FINAL CTA ═══════════════════════════════ */}
            <section className="max-w-5xl mx-auto px-6 py-28 border-t border-white/[0.04]">
                <div className="relative bg-[#13131A] border border-white/[0.06] rounded-[40px] p-12 md:p-16 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(91,95,239,0.15),_transparent_60%)] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Stop Guessing. Start Getting Interviews.
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            Upload your first resume, run an ATS scan, and see exactly where
                            you stand — in under 60 seconds. No credit card required.
                        </p>

                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center bg-[#5B5FEF] hover:bg-[#4A4EDF] px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_50px_rgba(91,95,239,0.35)] group"
                        >
                            Create Free Account
                            <ArrowRight
                                size={20}
                                className="ml-2 group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════ PAYMENT MODAL ═══════════════════════════════ */}
            {isPaymentModalOpen && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#13131A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] transform transition-all relative">
                        <button
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-16 h-16 bg-[#3DEBA6]/20 border border-[#3DEBA6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="text-[#3DEBA6]" size={28} />
                        </div>

                        <h2 className="text-2xl font-black mb-2 text-white">Upgrade to {selectedPlan.title}</h2>
                        <p className="text-gray-400 text-sm mb-6">Complete your payment of <strong className="text-white">{selectedPlan.price}</strong> via UPI</p>

                        <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-xl">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=nagupoojary33-3@oksbi&pn=HYRR%20${selectedPlan.title}`} 
                                alt="UPI QR Code" 
                                className="w-48 h-48"
                            />
                        </div>

                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
                            <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                            <p className="font-mono text-[#3DEBA6] font-bold tracking-tight">nagupoojary33-3@oksbi</p>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-6">Scan to pay with any UPI app (GPay, PhonePe, Paytm)</p>

                        <button
                            onClick={() => navigate(`/register?plan=${selectedPlan.title.toLowerCase()}`)}
                            className="w-full bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-bold py-4 rounded-[16px] transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
                        >
                            I have made the payment
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
            <Footer />
        </div>
    );
}

/* ═══════════════════════════════ COMPONENT LIBRARY ═══════════════════════════════ */

function LogoIcon() {
    return (
        <div className="w-10 h-10 rounded-xl bg-[#5B5FEF] flex items-center justify-center shadow-lg shadow-[#5B5FEF]/20">
            <svg viewBox="0 0 200 200" className="w-6 h-6">
                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
            </svg>
        </div>
    );
}

function WorkStep({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div className="bg-[#13131A] border border-white/[0.05] rounded-[32px] p-8 hover:border-[#5B5FEF]/20 transition-all">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#F0C060] font-black">
                Step {number}
            </span>
            <h3 className="text-2xl font-black mt-5 mb-4">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="bg-[#13131A] border border-white/[0.05] rounded-[32px] p-8 hover:border-[#5B5FEF]/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mb-6 text-[#5B5FEF]">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function TemplateCard({ image, name, tag, desc }: { image: string; name: string; tag: string; desc: string }) {
    return (
        <div className="bg-[#13131A] border border-white/[0.05] rounded-3xl p-4 hover:border-[#5B5FEF]/30 transition-all flex flex-col justify-between group cursor-pointer shadow-xl">
            <div>
                <div className="rounded-xl overflow-hidden border border-white/5 bg-white/5 aspect-[1/1.414] mb-4 relative">
                    <img
                        src={image}
                        alt={`${name} ATS Resume Template`}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                </div>
                <div className="flex items-center justify-between px-1 mb-3">
                    <h3 className="font-extrabold text-xs text-white">{name}</h3>
                    <span className="text-[8px] font-black text-[#3DEBA6] uppercase tracking-wider font-mono">{tag}</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono px-1 leading-relaxed border-t border-white/5 pt-2.5">
                    {desc}
                </p>
            </div>
        </div>
    );
}

function MetricCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="bg-[#13131A] border border-white/[0.05] rounded-[32px] p-10">
            <div className="text-5xl font-black text-[#5B5FEF] mb-4">{value}</div>
            <p className="text-gray-500 font-medium text-sm">{label}</p>
        </div>
    );
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
    return (
        <div className="bg-[#13131A] border border-white/[0.05] rounded-[32px] p-8 flex flex-col justify-between">
            <p className="text-gray-400 leading-relaxed mb-8 text-sm italic">
                &ldquo;{quote}&rdquo;
            </p>
            <div>
                <p className="font-bold text-white text-sm">{name}</p>
                <p className="text-xs text-gray-500 mt-1">{role}</p>
            </div>
        </div>
    );
}

function PricingCard({
    title,
    price,
    desc,
    items,
    featured = false,
    onSelect,
}: {
    title: string;
    price: string;
    desc: string;
    items: string[];
    featured?: boolean;
    onSelect?: (title: string, price: string) => void;
}) {
    return (
        <div
            className={`rounded-[40px] p-10 border transition-all ${featured
                ? 'bg-[#13131A] border-[#5B5FEF]/40 ring-1 ring-[#5B5FEF]/20 shadow-[0_20px_80px_rgba(91,95,239,0.15)]'
                : 'bg-[#13131A] border-white/[0.05]'
                }`}
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black mb-2">{title}</h3>
                    <p className="text-gray-500">{desc}</p>
                </div>
                {featured && <Zap className="text-[#5B5FEF]" />}
            </div>

            <div className="text-6xl font-black tracking-tight mb-10">
                {price}
                <span className="text-xl text-gray-600 font-medium">/mo</span>
            </div>

            <ul className="space-y-5 mb-10">
                {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-400 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#5B5FEF]/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-[#5B5FEF]" />
                        </div>
                        {item}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onSelect && onSelect(title, price)}
                className={`w-full block text-center py-4 rounded-2xl font-bold transition-all ${featured
                    ? 'bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08]'
                    }`}
            >
                Get Started
            </button>
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="bg-[#13131A] border border-white/[0.05] rounded-2xl overflow-hidden transition-all hover:border-white/10 cursor-pointer"
            onClick={() => setOpen(!open)}
        >
            <div className="flex items-center justify-between p-6">
                <h4 className="font-bold text-white pr-4">{q}</h4>
                <ChevronDown
                    size={18}
                    className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </div>
            <div
                className={`px-6 overflow-hidden transition-all duration-300 ${open ? 'pb-6 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-gray-400 leading-relaxed text-sm border-t border-white/[0.04] pt-4">
                    {a}
                </p>
            </div>
        </div>
    );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                {title}
            </h4>
            <div className="space-y-4">
                {items.map((item) => (
                    <p key={item} className="text-sm text-gray-400 hover:text-white transition cursor-pointer">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}