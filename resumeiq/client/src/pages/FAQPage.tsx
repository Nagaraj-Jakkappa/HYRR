import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/ui/Footer';

const faqs = [
    { q: 'What is Hyrr?', a: 'Hyrr is an advanced AI-powered SaaS platform designed to help job seekers optimize their resumes, analyze keyword gaps against job descriptions, and generate tailored cover letters.' },
    { q: 'How does the ATS score work?', a: 'Our engine scans your uploaded resume and compares it against a target job description. It calculates a match percentage based on missing keywords, semantic alignment, and standard ATS parsing logic.' },
    { q: 'Can I use Hyrr for free?', a: 'Yes! We offer a generous free tier that includes limited scans and basic resume optimization features so you can see the value before upgrading.' },
    { q: 'What is included in Pro?', a: 'The Pro plan unlocks higher monthly scan limits, advanced AI rewriting tools, premium resume templates, and priority support.' },
    { q: 'What is included in Career+?', a: 'Career+ is our unlimited tier offering maximum daily scans, unlimited cover letter generation, interview prep analytics, and full access to all premium features.' },
    { q: 'Does Hyrr guarantee a job?', a: 'While Hyrr drastically improves your chances of passing ATS filters and getting noticed by recruiters, securing a job also depends on your interview skills and external market factors.' },
    { q: 'Is my resume data safe?', a: 'Absolutely. Your data is fully encrypted and stored securely. We do not sell your personal information or resume data to third parties.' },
    { q: 'Can I generate cover letters?', a: 'Yes, both Pro and Career+ users can generate highly-personalized cover letters tailored specifically to individual job descriptions with a single click.' },
    { q: 'Can I cancel or request a refund?', a: 'You can cancel your subscription at any time. We also offer a refund within the first 7 days if you are not satisfied with the product, subject to our refund policy.' },
    { q: 'How do I contact support?', a: 'You can reach out via our Contact Us page, check out the Help Center, or submit a bug/feature request through the Share Feedback link.' }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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

            <main className="flex-1 py-20 px-6 max-w-3xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-400 text-lg">Everything you need to know about the product and billing.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-[#13131A]/80 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none hover:bg-white/[0.02]"
                            >
                                <span className="font-bold text-base md:text-lg">{faq.q}</span>
                                <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === idx ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4 mt-2">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
