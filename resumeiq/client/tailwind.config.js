/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        hyrr: {
          background: '#0A0A0F',
          surface: '#13131A',
          accent: '#5B5FEF',
          mint: '#3DEBA6',   // Success
          amber: '#F0C060',  // Warning
          muted: '#94A3B8',
        }
      },
      backgroundImage: {
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(91, 95, 239, 0.1) 0%, transparent 50%)',
      }
    }
  },
  plugins: [],