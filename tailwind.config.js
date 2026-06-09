/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06060a',
          900: '#0a0a12',
          800: '#101019',
        },
        electric: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) rotate(8deg)' },
          '60%, 100%': { transform: 'translateX(220%) rotate(8deg)' },
        },
      },
      animation: {
        glow: 'glow 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        shine: 'shine 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
