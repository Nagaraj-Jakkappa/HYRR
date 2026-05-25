import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function CoverLetterTemplatesPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] flex flex-col">
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 200 200" className="w-4 h-4">
                                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight">hyrr</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
                <h1 className="text-4xl font-black mb-8">Cover Letter Templates</h1>
                <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-8 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Coming Soon!</h2>
                        <p>Our team is currently working on adding a curated list of beautifully designed, ATS-friendly cover letter templates to help you stand out to hiring managers.</p>
                        <p className="mt-4">In the meantime, you can use our <Link to="/builder" className="text-[#5B5FEF] hover:underline">AI Resume Builder</Link> to craft the perfect resume!</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
