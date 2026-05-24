import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
                        <p>We only collect information about you if we have a reason to do so — for example, to provide our Services, to communicate with you, or to make our Services better. We collect this information from three sources: if and when you provide information to us, automatically through operating our Services, and from outside sources.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">2. How We Use Information</h2>
                        <p>We use information about you for the purposes listed below:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>To provide our Services.</li>
                            <li>To further develop and improve our Services.</li>
                            <li>To monitor and analyze trends and better understand how users interact with our Services.</li>
                            <li>To communicate with you about offers and promotions.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">3. Sharing Information</h2>
                        <p>We do not sell our users' private personal information. We share information about you in the limited circumstances spelled out below and with appropriate safeguards on your privacy.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">4. Security</h2>
                        <p>While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
