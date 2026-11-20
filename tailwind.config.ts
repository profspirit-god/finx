import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0A',
          soft: '#111111',
          panel: 'rgba(255,255,255,0.04)',
        },
        gold: {
          50:  '#FFF8E1',
          100: '#FFEFC2',
          200: '#FFDF85',
          300: '#FFCE47',
          400: '#F5B800',
          500: '#D99E00',
          600: '#A87A00',
          700: '#6E5000',
          800: '#3B2B00',
        },
        sys: {
          red:    '#FF5C5C',
          orange: '#FF9F45',
          yellow: '#FFD84D',
          green:  '#4ADE80',
          blue:   '#5CA8FF',
        },
      },
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.10)',
        gold: 'rgba(245,184,0,0.35)',
      },
      backdropBlur: { glass: '18px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        gold:  '0 0 0 1px rgba(245,184,0,0.35), 0 8px 30px rgba(245,184,0,0.15)',
      },
      borderRadius: { xl2: '1.25rem' },
      animation: {
        'fade-in': 'fadeIn .25s ease-out',
        'slide-up': 'slideUp .3s cubic-bezier(.2,.7,.2,1)',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
    },
  },
  plugins: [],
} satisfies Config;