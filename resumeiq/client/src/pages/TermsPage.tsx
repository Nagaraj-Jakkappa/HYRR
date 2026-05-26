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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black mb-4">Terms of Use</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                        By using this website, you agree to be bound by these terms of use. If you do not agree to these terms, you are not authorized to use this website.
                    </p>
                </div>
                
                <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-10 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Eligibility</h2>
                        <p>This website is intended for use by individuals who are 18 years of age or older. If you are under the age of 18, you must have the consent of a parent or guardian to use this website.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Fair & Intended Use</h2>
                        <p className="mb-3">Hyrr is designed primarily for individual job seekers to create and optimize their own resumes. While we welcome a wide range of users, our current subscription plans are not intended for commercial use (e.g., by resume writing agencies, consultants, or businesses creating resumes on behalf of others).</p>
                        <p className="mb-3">If you represent a business or plan to use the platform for commercial purposes, please reach out to us at contact@hyrr.ai to explore appropriate options.</p>
                        <p>We reserve the right to review usage patterns and take appropriate action in case of suspected misuse or violation of this intent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Content</h2>
                        <p>The content on this website is owned by or licensed to hyrr.ai. You may not copy, distribute, modify, or create derivative works from the content without the express written permission of the website owner.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Privacy</h2>
                        <p className="mb-4">We respect your privacy and will not collect any personal information about you without your consent. The website owner will not sell or share your personal information with third parties.</p>
                        <h3 className="text-white font-semibold mb-1">Account Termination</h3>
                        <p>Free account deletion requests are governed by our Free Account Deletion Policy as described in the <Link to="/privacy" className="text-[#5B5FEF] hover:underline">Privacy Policy</Link>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Disclaimer</h2>
                        <p>hyrr.ai makes no warranties or representations about the accuracy, completeness, or timeliness of the content on this website. The website owner is not liable for any damages arising from the use of this website.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Changes</h2>
                        <p>The website owner reserves the right to change these terms of use at any time. You are responsible for reviewing these terms of use periodically to stay informed of changes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Governing Law</h2>
                        <p>These terms of use are governed by and construed in accordance with the laws of India. Any dispute arising out of these terms of use will be resolved in the courts of the State.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
