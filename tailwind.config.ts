import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EDE9FE',
          100: '#DDD6FE',
          200: '#C4B5FD',
          300: '#A78BFA',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0764',
          950: '#2E0656',
        },
        // 5-tier scoring colors
        tier: {
          dormant: '#9CA3AF',
          exploring: '#3B82F6',
          engaged: '#F59E0B',
          qualified: '#F97316',
          'sales-ready': '#22C55E',
        },
        // Appointment status colors
        appointment: {
          'qc-confirmed': '#22C55E',
          'ai-booked': '#8B5CF6',
          'meeting-scheduled': '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        'toast-slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'toast-slide-in': 'toast-slide-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
