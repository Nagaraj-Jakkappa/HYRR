import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function RefundPolicyPage() {
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black mb-4">Refund Policy</h1>
                    <p className="text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed">
                        At Hyrr, we're committed to providing tools that truly help you improve your resume. However, if you are not satisfied with your ai resume builder subscription, we offer a refund under the conditions outlined below.
                    </p>
                </div>

                <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-10 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Eligibility</h2>
                        <p className="mb-2">You may be eligible for a full refund if:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You request it within 3 days of purchase.</li>
                            <li>You have not downloaded your resume beyond free limit.</li>
                            <li>You have not extensively used advanced AI features (e.g., resume checks, JD matcher, ai optimizations).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How to Request a Refund</h2>
                        <p className="mb-2">Please email us at <a href="mailto:contact@hyrr.ai" className="text-[#5B5FEF] hover:underline">contact@hyrr.ai</a> with:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Your account email</li>
                            <li>The reason you're requesting a refund</li>
                        </ul>
                        <p>We'll try to resolve any issues first. If we're unable to address your concern, a refund will be processed within 7 business days.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Refund Amount</h2>
                        <p>We will issue refund of your paid amount minus payment provider charges.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Refund will not be granted if:</h2>
                        <ul className="list-disc pl-5 mb-6 space-y-1">
                            <li>Your resume was downloaded under pro plan.</li>
                            <li>You have consumed the most or all of pro features.</li>
                            <li>Your refund request is made after 3 days from purchase.</li>
                            <li>We identify patterns of repeated refund requests or suspected misuse.</li>
                        </ul>
                        <p className="mb-4">You can preview how our ai resume builder work via our Free plan and by watching demo videos.</p>
                        <p>If you believe your case deserves an exception, please contact us at <a href="mailto:support@hyrr.ai" className="text-[#5B5FEF] hover:underline">support@hyrr.ai</a>. We'll do our best to help.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
