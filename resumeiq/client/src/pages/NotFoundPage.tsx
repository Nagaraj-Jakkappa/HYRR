import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] flex flex-col items-center justify-center p-6 font-sans">
      {/* Brand Logo - Bug 3 Fixed (Replaced user avatar with static H logo) */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-[#5B5FEF] flex items-center justify-center text-white font-bold text-lg">
          H
        </div>
        <span className="font-black text-xl tracking-tight uppercase">hyrr</span>
      </div>

      <h1 className="text-[12rem] font-black text-[#5B5FEF] leading-none select-none opacity-20 absolute">404</h1>
      
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Page not found</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">The link you followed may be broken, or the page may have been removed.</p>
        
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#13131A] border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all"
        >
          <ArrowLeft size={18} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}