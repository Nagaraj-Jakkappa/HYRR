import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as any;
            
            let scrollTop = 0;
            if (target === document || target === window) {
                scrollTop = window.scrollY || document.documentElement.scrollTop;
            } else {
                scrollTop = (target as HTMLElement).scrollTop || 0;
            }

            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        const dashboard = document.getElementById('dashboard-scroll-container');
        if (dashboard) {
            dashboard.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-[#5B5FEF] to-[#8E5BEF] text-white shadow-[0_0_20px_rgba(91,95,239,0.4)] hover:shadow-[0_0_30px_rgba(91,95,239,0.6)] transition-all duration-300 z-[999] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
}
