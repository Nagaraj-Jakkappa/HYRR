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
}/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hyrr-blue': '#5B5FEF',     // Signal Blue (Logo & Primary Buttons)
        'hyrr-mint': '#3DEBA6',     // Mint Green (Logo detail & Success links)
        'hyrr-void': '#0A0A0F',     // Background/Main Void
        'hyrr-obsidian': '#13131A', // Card/Surface color
        'hyrr-white': '#EEEEF0',    // Off-white text
      },
      // Optional: Add the glow effect as a custom utility if you want to reuse it
      boxShadow: {
        'hyrr-glow': '0 0 30px rgba(91, 95, 239, 0.4)',
      }
    },
  },
  plugins: [],
}