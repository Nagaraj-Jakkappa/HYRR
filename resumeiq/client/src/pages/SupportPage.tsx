import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';

export default function SupportPage() {
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
                    <h1 className="text-4xl font-black mb-4">Resume Help and Customer Support</h1>
                </div>

                <div className="space-y-12">
                    {/* Support Channels */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Support Channels</h2>
                        <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/[0.02] text-white border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">#</th>
                                        <th className="px-6 py-4 font-semibold">Name</th>
                                        <th className="px-6 py-4 font-semibold">Channel</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">1</td>
                                        <td className="px-6 py-4">Email</td>
                                        <td className="px-6 py-4 text-white">contact@hyrr.ai</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">2</td>
                                        <td className="px-6 py-4">Live Chat (Human)</td>
                                        <td className="px-6 py-4"><a href="#" className="text-[#5B5FEF] hover:underline">message us on chat</a></td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">3</td>
                                        <td className="px-6 py-4">Call</td>
                                        <td className="px-6 py-4 text-white">+91 7579581767</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">4</td>
                                        <td className="px-6 py-4">Website Live chat</td>
                                        <td className="px-6 py-4 text-white">Use chat on bottom right corner</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">5</td>
                                        <td className="px-6 py-4">Contact Us Query</td>
                                        <td className="px-6 py-4"><Link to="/contact" className="text-[#5B5FEF] hover:underline">fill form here</Link></td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">6</td>
                                        <td className="px-6 py-4">Quick 10 min FREE Call</td>
                                        <td className="px-6 py-4"><a href="#" className="text-[#5B5FEF] hover:underline">check calendar</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Instructions */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Instructions</h2>
                        <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
                            <ol className="list-decimal pl-5 space-y-3 text-gray-400 text-sm leading-relaxed">
                                <li>Email and Live chat are preferred mode of providing support</li>
                                <li>Contact Us form sends Hyrr team an email which they promptly respond.</li>
                                <li>Calls can be booked to explore special/support requirements 1 day in advance. Please be specific on your agenda.</li>
                                <li>Live chat is answered by humans. In odd hours - please leave your query and contact details and our support team will get back to you at earliest.</li>
                                <li>Please consider timezones while seeking support.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Common Support Requests */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Common support requests</h2>
                        <div className="space-y-4 text-sm">
                            <div className="bg-[#13131A]/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
                                <h3 className="text-white font-semibold text-lg mb-4">How to Change Email on Resume?</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                    <li>Your Resume should have professional email and we advise to sign up with that. You can request email change if you have signed up with different email. Follow steps below -</li>
                                    <li>Send an email to <span className="text-white">contact@hyrr.ai</span> from your new email id</li>
                                    <li>Subject - "Request for Email change" and just say I wish to change my email from a to b</li>
                                    <li>You need to logout after email change request for it to work</li>
                                    <li>Our backend team will change your email and confirm once done.</li>
                                    <li>Your password will remain as it is. If you logged in with gmail and have no password - we will set one for you and share in email. Feel free to change this password later</li>
                                </ul>
                            </div>

                            <div className="bg-[#13131A]/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
                                <h3 className="text-white font-semibold text-lg mb-4">I have custom requirements for my Resume?</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                    <li>We will understand your custom resume requirements and will come up with way forward based on your requirements.</li>
                                    <li>You can email your custom requirements at <span className="text-white">contact@hyrr.ai</span> or use any of above mentioned support channel.</li>
                                </ul>
                            </div>

                            <div className="bg-[#13131A]/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
                                <h3 className="text-white font-semibold text-lg mb-4">Can Hyrr write resume/CV for me?</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                    <li>We do provide resume writing services on demand. This service is popular among experienced / senior level professionals.</li>
                                    <li>Connect with us via email to <span className="text-white">contact@hyrr.ai</span> or Ping us on live chat.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
