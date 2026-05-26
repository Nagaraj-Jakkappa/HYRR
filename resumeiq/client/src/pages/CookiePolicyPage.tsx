import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function CookiePolicyPage() {
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
                <h1 className="text-4xl font-black mb-8">Cookie Policy</h1>
                <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-8 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">1. What are cookies?</h2>
                        <p>Cookies are small text files placed on your device when you visit our platform. They allow us to recognize your device, maintain your session securely, and remember your preferences for a seamless experience.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">2. Strictly Necessary Cookies</h2>
                        <p className="mb-4">We only use strictly necessary cookies that are essential for the core operation and security of the Hyrr platform. Because these cookies are essential, they cannot be disabled in our systems.</p>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                <h3 className="text-white font-medium mb-1">Authentication & Security</h3>
                                <p className="mb-2">We use highly secure, encrypted cookies to manage your login session. We do not expose these cookies to client-side scripts, protecting your account from common web vulnerabilities.</p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-500">
                                    <li><strong>accessToken:</strong> An HttpOnly, Secure cookie that verifies your identity for active requests (lasts 15 minutes).</li>
                                    <li><strong>refreshToken:</strong> An HttpOnly, Secure cookie that allows you to stay logged in without repeatedly entering your password (lasts 7 days).</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                <h3 className="text-white font-medium mb-1">User Interface Preferences</h3>
                                <p>We use local storage (similar to cookies) to remember your UI choices across visits.</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-500">
                                    <li><strong>hyrr_theme:</strong> Remembers your preferred color theme.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">3. Third-Party and Tracking Cookies</h2>
                        <p>Hyrr respects your privacy. We <strong>do not</strong> use third-party advertising cookies, cross-site trackers, or marketing pixels on our platform.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
