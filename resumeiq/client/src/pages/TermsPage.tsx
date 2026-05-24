import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function TermsPage() {
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
                <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
                <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using hyrr, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on hyrr's website for personal, non-commercial transitory viewing only.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">3. User Accounts</h2>
                        <p>If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">4. Disclaimer</h2>
                        <p>The materials on hyrr's website are provided on an 'as is' basis. hyrr makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">5. Limitations</h2>
                        <p>In no event shall hyrr or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on hyrr's website.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
