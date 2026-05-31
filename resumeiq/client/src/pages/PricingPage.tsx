import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import { ShieldCheck, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingPlanToConfirm, setPendingPlanToConfirm] = useState<{title: string, price: string, key: string} | null>(null);

    useEffect(() => {
        const scriptId = 'razorpay-checkout-js';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (loading) return;

        const queryPlan = searchParams.get('plan');
        const checkout = searchParams.get('checkout');
        const storedPlan = localStorage.getItem('pendingCheckoutPlan');

        const plan = queryPlan || storedPlan;

        if (!checkout && !storedPlan) return;
        if (!plan) return;

        if (user) {
            const title = plan === 'careerPlus' ? 'Career+' : 'Pro';
            const price = plan === 'careerPlus' ? '₹2999' : '₹1499';
            setPendingPlanToConfirm({ title, price, key: plan });
        }
    }, [loading, user, searchParams]);

    const handlePlanSelect = async (title: string, price: string) => {
        const planKey = title.toLowerCase() === 'career+' ? 'careerPlus' : title.toLowerCase();
        
        if (planKey === 'free') {
            navigate('/register');
            return;
        }

        if (loading) return;

        if (!user) {
            localStorage.setItem('pendingCheckoutPlan', planKey);
            navigate(`/register?plan=${planKey}&checkout=true`);
            return;
        }

        try {
            setIsLoading(true);
            const { data: orderData } = await api.post('/payments/create-order', { plan: planKey });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: "HYRR",
                description: `Upgrade to ${title}`,
                order_id: orderData.data.order_id,
                handler: async function (response: any) {
                    try {
                        const { data: verifyData } = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        if (verifyData.success) {
                            toast.success(`Successfully upgraded to ${title}!`);
                            localStorage.removeItem('pendingCheckoutPlan');
                            setSearchParams({});
                            setPendingPlanToConfirm(null);
                            navigate('/dashboard?upgrade=success');
                        } else {
                            throw new Error(verifyData.message || 'Payment verification failed');
                        }
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || err.message || 'Payment verification failed');
                    }
                },
                theme: {
                    color: "#5B5FEF"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment failed');
            });
            rzp.open();
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Error initializing payment');
        } finally {
            setIsLoading(false);
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

                {pendingPlanToConfirm && (
                    <div className="max-w-3xl mx-auto mb-16">
                        <div className="bg-gradient-to-r from-[#5B5FEF]/20 to-[#8E5BEF]/20 border border-[#5B5FEF]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Your {pendingPlanToConfirm.title} plan is ready</h3>
                                <p className="text-sm text-gray-300">Continue to secure payment to upgrade your account.</p>
                            </div>
                            <button 
                                disabled={isLoading}
                                onClick={() => handlePlanSelect(pendingPlanToConfirm.title, pendingPlanToConfirm.price)}
                                className="px-8 py-3 bg-[#5B5FEF] hover:bg-[#6c70fc] text-white rounded-xl font-bold transition-all whitespace-nowrap disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    <PricingCard 
                        title="Free" 
                        price="₹0" 
                        desc="Get started, no credit card required." 
                        items={['3 ATS scans per month', 'Basic AI Magic Rewrite', '1 resume template', 'PDF export', 'Shareable scan reports']} 
                        onSelect={handlePlanSelect} 
                        isLoading={isLoading}
                    />
                    <PricingCard 
                        featured 
                        title="Pro" 
                        price="₹1499" 
                        desc="For active job seekers." 
                        items={['Unlimited ATS scans', 'Unlimited AI rewrites', 'AI cover letter generator', 'All 10 resume templates', 'LinkedIn PDF import', 'PDF & DOCX export', 'Scan comparison', 'Priority AI inference']} 
                        onSelect={handlePlanSelect} 
                        isLoading={isLoading}
                    />
                    <PricingCard 
                        title="Career+" 
                        price="₹2999" 
                        desc="For power users & career coaches." 
                        items={['Everything in Pro', 'Dashboard analytics', 'Version history tracking', 'Optimized resume downloads', 'Priority support']} 
                        onSelect={handlePlanSelect} 
                        isLoading={isLoading}
                    />
                </div>
            </section>



            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}

function PricingCard({ title, price, desc, items, featured = false, onSelect, isLoading = false }: any) {
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
            <button disabled={isLoading} onClick={() => onSelect && onSelect(title, price)} className={`w-full block text-center py-4 rounded-2xl font-bold transition-all ${featured ? 'bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]' : 'bg-white/[0.04] hover:bg-white/[0.08]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                {isLoading ? 'Loading...' : 'Get Started'}
            </button>
        </div>
    );
}
