import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, CheckCircle2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { feedbackAPI } from '../services/api';
import Footer from '../components/ui/Footer';
import { Link } from 'react-router-dom';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: 'general',
    title: '',
    message: '',
    rating: 5,
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.length < 3) return toast.error("Title must be at least 3 characters");
    if (formData.message.length < 10) return toast.error("Message must be at least 10 characters");

    setLoading(true);
    try {
      await feedbackAPI.submit(formData);
      toast.success("Feedback submitted successfully");
      setSuccess(true);
      setFormData({
        type: 'general',
        title: '',
        message: '',
        rating: 5,
        email: user?.email || '',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] font-sans flex flex-col selection:bg-[#5B5FEF]/30">
      {/* Top Header / Logo for guests */}
      <div className="w-full border-b border-white/5 bg-[#0D0D14]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-[#5B5FEF] rounded-lg flex items-center justify-center shadow-lg shadow-[#5B5FEF]/20 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 200 200" className="w-5 h-5">
                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">hyrr</span>
          </Link>
          {user ? (
            <Link to="/dashboard" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Go to Dashboard</Link>
          ) : (
            <Link to="/login" className="text-sm font-bold text-[#5B5FEF] hover:text-white transition-colors">Login / Register</Link>
          )}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 relative">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#5B5FEF]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-[#5B5FEF]/10 border border-[#5B5FEF]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#5B5FEF] shadow-[0_0_30px_rgba(91,95,239,0.2)]">
              <MessageSquare size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Share Feedback</h1>
            <p className="text-gray-400 font-medium">Help us improve Hyrr. Let us know what’s on your mind.</p>
          </div>

          <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[32px] p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {success ? (
              <div className="text-center py-10 animate-in zoom-in duration-300">
                <CheckCircle2 size={64} className="mx-auto text-[#3DEBA6] mb-6 drop-shadow-[0_0_15px_rgba(61,235,166,0.3)]" />
                <h3 className="text-2xl font-black mb-2">Thank You!</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">Your feedback has been received and will be reviewed by our team.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {!user && (
                  <div>
                    <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full bg-[#0A0A0F]/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all shadow-inner placeholder:text-gray-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Feedback Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#0A0A0F]/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all shadow-inner"
                  >
                    <option value="general">General Feedback</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="ai_result">AI Generation Quality</option>
                    <option value="payment">Billing / Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Title</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={120}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief summary of your feedback"
                    className="w-full bg-[#0A0A0F]/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all shadow-inner placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5 flex justify-between">
                    <span>Message</span>
                    <span className="text-gray-600">{formData.message.length}/2000</span>
                  </label>
                  <textarea
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us more about your experience..."
                    className="w-full bg-[#0A0A0F]/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-[#5B5FEF]/50 focus:ring-1 focus:ring-[#5B5FEF]/50 outline-none transition-all shadow-inner resize-y placeholder:text-gray-600 custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#6B6B7E] uppercase tracking-widest mb-2.5">Rate your experience</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({...formData, rating: num})}
                        className="group focus:outline-none transition-all"
                      >
                        <Star 
                          size={32} 
                          className={`transition-all duration-300 ${formData.rating >= num ? 'text-[#F0C060] fill-[#F0C060] drop-shadow-[0_0_8px_rgba(240,192,96,0.6)]' : 'text-gray-700 hover:text-gray-500'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white font-black uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
