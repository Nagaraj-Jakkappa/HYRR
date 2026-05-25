import { Link } from 'react-router-dom';

/**
 * Global Footer Component — used on every page.
 * Inspired by Kickresume-style footer: social icon row + brand tagline.
 * Does NOT include App Store / Google Play badges.
 */

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/joinhyrr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/joinhyrr?igsh=MXMyYXJvbjZnNHB3dw==',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/118333968',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@joinhyrr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-white/[0.04] relative z-10">
      {/* Social Icons Row */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {/* Social Links */}
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(91,95,239,0.5)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}

          {/* Hyrr Logo Icon (like the butterfly icon in reference) */}
          <Link
            to="/"
            className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="hyrr home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#5B5FEF]/20 border border-[#5B5FEF]/30 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-4 h-4">
                <rect x="74" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="110" y="60" width="16" height="80" rx="8" fill="#EEEEF0" />
                <rect x="74" y="92" width="52" height="16" rx="8" fill="#3DEBA6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Made with love line */}
      <div className="border-t border-white/[0.04] py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
            Made with
            <span className="inline-flex">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#5B5FEF] animate-pulse">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            by <span className="text-white font-bold">hyrr</span> ©{' '}
            {new Date().getFullYear()}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
