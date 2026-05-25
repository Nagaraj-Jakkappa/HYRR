import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import { ShieldCheck, Check, Copy, Zap } from 'lucide-react';

export default function PricingPage() {
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ title: string, price: string } | null>(null);
    const [utrNumber, setUtrNumber] = useState('');
    const [copied, setCopied] = useState(false);

    const handlePlanSelect = (title: string, price: string) => {
        if (title.toLowerCase() === 'free') {
            navigate('/register');
        } else {
            setSelectedPlan({ title, price });
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] overflow-x-hidden selection:bg-[#5B5FEF]/30 flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5B5FEF] flex items-center justify-center shadow-lg shadow-[#5B5FEF]/20">
                            <svg viewBox="0 0 200 200" className="w-6 h-6">
                                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight">hyrr</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition">Sign In</Link>
                        <Link to="/register" className="bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]">Get Started Free</Link>
                    </div>
                </div>
            </nav>

            {/* PRICING SECTION */}
            <section className="max-w-7xl mx-auto w-full px-6 py-20 flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black mb-5">Simple, Transparent Pricing</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Start free. Upgrade when you need unlimited scans and AI features.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <PricingCard 
                        title="Free" 
                        price="₹0" 
                        desc="Get started, no credit card required." 
                        items={['3 ATS scans per month', 'Basic AI Magic Rewrite', '1 resume template', 'PDF export', 'Shareable scan reports']} 
                        onSelect={handlePlanSelect} 
                    />
                    <PricingCard 
                        featured 
                        title="Pro" 
                        price="₹1499" 
                        desc="For active job seekers." 
                        items={['Unlimited ATS scans', 'Unlimited AI rewrites', 'AI cover letter generator', 'All 10 resume templates', 'LinkedIn PDF import', 'PDF & DOCX export', 'Scan comparison', 'Priority AI inference']} 
                        onSelect={handlePlanSelect} 
                    />
                    <PricingCard 
                        title="Career+" 
                        price="₹2999" 
                        desc="For power users & career coaches." 
                        items={['Everything in Pro', 'Dashboard analytics', 'Version history tracking', 'Optimized resume downloads', 'Priority support']} 
                        onSelect={handlePlanSelect} 
                    />
                </div>
            </section>

            {/* PAYMENT MODAL */}
            {isPaymentModalOpen && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#13131A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] transform transition-all relative">
                        <button
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-16 h-16 bg-[#3DEBA6]/20 border border-[#3DEBA6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="text-[#3DEBA6]" size={28} />
                        </div>

                        <h2 className="text-2xl font-black mb-2 text-white">Upgrade to {selectedPlan.title}</h2>
                        <p className="text-gray-400 text-sm mb-6">Complete your payment of <strong className="text-white">{selectedPlan.price}</strong> via UPI</p>

                        <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-xl">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=nagupoojary33-3@oksbi&pn=HYRR ${selectedPlan.title}&am=${selectedPlan.price.replace(/[^0-9.]/g, '')}`)}`} 
                                alt="UPI QR Code" 
                                className="w-48 h-48"
                            />
                        </div>

                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                                <p className="font-mono text-[#3DEBA6] font-bold tracking-tight">nagupoojary33-3@oksbi</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText('nagupoojary33-3@oksbi');
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold"
                            >
                                {copied ? <Check size={14} className="text-[#3DEBA6]" /> : <Copy size={14} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 text-left">
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Enter 12-Digit UTR / Transaction ID
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 312345678901"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3DEBA6] transition-colors font-mono"
                            />
                            <p className="text-[10px] text-gray-500 mt-2">Required to verify your payment automatically.</p>
                        </div>
                        
                        <button
                            disabled={utrNumber.length !== 12}
                            onClick={() => {
                                setIsPaymentModalOpen(false);
                                setUtrNumber('');
                                navigate(`/register?plan=${selectedPlan.title.toLowerCase()}&utr=${utrNumber}`);
                            }}
                            className="w-full bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] disabled:opacity-50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[16px] transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98] disabled:shadow-none"
                        >
                            {utrNumber.length === 12 ? "I have made the payment" : "Enter UTR to Continue"}
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}

function PricingCard({ title, price, desc, items, featured = false, onSelect }: any) {
    return (
        <div className={`rounded-[40px] p-10 border transition-all ${featured ? 'bg-[#13131A] border-[#5B5FEF]/40 ring-1 ring-[#5B5FEF]/20 shadow-[0_20px_80px_rgba(91,95,239,0.15)]' : 'bg-[#13131A] border-white/[0.05]'}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black mb-2">{title}</h3>
                    <p className="text-gray-500">{desc}</p>
                </div>
                {featured && <Zap className="text-[#5B5FEF]" />}
            </div>
            <div className="text-6xl font-black tracking-tight mb-10">
                {price}<span className="text-xl text-gray-600 font-medium">/mo</span>
            </div>
            <ul className="space-y-5 mb-10">
                {items.map((item: string) => (
                    <li key={item} className="flex items-center gap-3 text-gray-400 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#5B5FEF]/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-[#5B5FEF]" />
                        </div>
                        {item}
                    </li>
                ))}
            </ul>
            <button onClick={() => onSelect && onSelect(title, price)} className={`w-full block text-center py-4 rounded-2xl font-bold transition-all ${featured ? 'bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]' : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}>
                Get Started
            </button>
        </div>
    );
}
