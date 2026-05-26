import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/ui/Footer';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEF0] flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-6">

      {/* Brand Logo */}
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
          to={isAuthenticated ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] hover:from-[#6c70fc] hover:to-[#9f6dfc] text-white px-8 py-4 rounded-[24px] font-bold transition-all shadow-[0_0_20px_rgba(91,95,239,0.3)] hover:shadow-[0_0_30px_rgba(91,95,239,0.5)] active:scale-[0.98]"
        >
          <ArrowLeft size={18} /> {isAuthenticated ? "Go to Dashboard" : "Return to Home Base"}
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}