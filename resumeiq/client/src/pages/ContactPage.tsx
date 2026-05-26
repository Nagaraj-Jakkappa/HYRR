import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function ContactPage() {
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

            <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-4">Contact Us</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                        Don't hesitate to reach out to us for queries related to your resume, our application or services. We usually respond within 24 hours.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-10 text-sm">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Get in touch</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Feel free to write to us / call us.<br />
                                Hyrr team is committed to help you.
                            </p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Location:</h3>
                                    <p className="text-gray-400">
                                        Anjanadri Residency, 4th Main road,<br />
                                        Chinnappanahalli, Marathahalli<br />
                                        Bengaluru, Karnataka, India 560037
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Email:</h3>
                                    <a href="mailto:contact@hyrr.ai" className="text-[#5B5FEF] hover:underline">contact@hyrr.ai</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Call:</h3>
                                    <p className="text-gray-400">+91 7579581767</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Chat:</h3>
                                    <a href="#" className="text-[#5B5FEF] hover:underline">click to message</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF] transition-all"
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF] transition-all"
                                />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Subject" 
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF] transition-all"
                            />
                            <div>
                                <textarea 
                                    placeholder="Message" 
                                    rows={6}
                                    maxLength={1000}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF] transition-all resize-none"
                                ></textarea>
                                <div className="text-right text-xs text-gray-500 mt-1">(0/1000 chars)</div>
                            </div>
                            <button 
                                type="button" 
                                className="bg-[#EAB308] hover:bg-[#CA8A04] text-black font-semibold py-3 px-8 rounded-xl transition-colors mt-2"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
