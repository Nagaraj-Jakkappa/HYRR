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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                        We are committed to protecting your privacy. This privacy policy explains how we collect, use, and share your personal information when you visit or use our website - hyrr.ai.
                    </p>
                </div>
                
                <div className="bg-[#13131A]/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-10 text-gray-400 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">What information do we collect?</h2>
                        <p className="mb-2">We collect the following information from you when you visit or use our website:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Your name and email address</li>
                            <li>Your resume information, such as your work experience, education, and skills</li>
                            <li>Your IP address, country, browser type and operating system</li>
                            <li>The pages you visit on our website</li>
                            <li>The links you click on our website</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How do we use your information?</h2>
                        <p className="mb-2">We use the information we collect from you to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Create and deliver your resume</li>
                            <li>Improve our website and services</li>
                            <li>Send you marketing communications, such as email newsletters</li>
                            <li>Respond to your questions and requests</li>
                            <li>Protect our rights and property</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Who has access to your information?</h2>
                        <p>We may share your information with our third-party service providers, such as those who help us deliver our services or provide customer support. We may also share your information with third parties if we are required to do so by law or if we believe that sharing is necessary to protect our rights, property, or the safety of others.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How do we protect your information?</h2>
                        <p className="mb-2">We take measures to protect your information, such as:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Using secure servers</li>
                            <li>Encrypting sensitive data</li>
                            <li>Limiting access to your information to authorized employees</li>
                            <li>Requiring employees to sign confidentiality agreements</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How long do we keep your information?</h2>
                        <p>We will keep your information for as long as you have an account with us or as long as necessary to provide you with our services. We may also keep your information for a longer period of time if required to do so by law or if we believe that keeping it is necessary to protect our rights, property, or the safety of others.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Your rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. You also have the right to opt out of receiving marketing communications from us. You can exercise these rights by contacting us at contact@hyrr.ai</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Free Account Deletion Policy</h2>
                        <p className="mb-2">Free users, including those who sign up using temporary or disposable email addresses, can:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li><strong>Unsubscribe (Free Option):</strong> Stop all emails instantly using the Unsubscribe link in any email.</li>
                            <li><strong>Manual Investigation & Deletion (Paid Option):</strong> Manual processing of free accounts requires a ₹299 administrative fee in India, 4$ for outside India - to cover handling costs. Reply to any email with "Proceed with manual deletion" to receive a secure payment link.</li>
                        </ul>
                        <p>Paid account holders receive free manual deletion support.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Changes to this privacy policy</h2>
                        <p>We may change this privacy policy from time to time. If we make any material changes, we will notify you by email or through a notice on our website.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Contact us</h2>
                        <p>If you have any questions about this privacy policy, please contact us at contact@hyrr.ai</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
