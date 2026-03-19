/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syncopate: ['Syncopate', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        gold: '#c9a227',
        'gold-light': '#f0c040',
        'bg-dark': '#050505',
        'red-accent': '#b90202',
        'red-hot': '#ff1a1a',
        metallic: '#3a3a3a',
        carbon: '#0d0d0d',
        platinum: '#e8e8e8',
      },
      animation: {
        'float': 'float-y 6s ease-in-out infinite',
        'float-delay': 'float-y 6s ease-in-out 2s infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'rotate-slow-rev': 'rotate-slow 30s linear infinite reverse',
        'scan': 'scan-line 4s linear infinite',
        'shimmer': 'shimmer-slide 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'glow-pulse': 'glow-pulse-red 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'counter': 'counter-anim 0.6s ease-out forwards',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh)', opacity: 0 },
        },
        'shimmer-slide': {
          '0%': { left: '-100%' },
          '50%, 100%': { left: '120%' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'glow-pulse-red': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(185, 2, 2, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(185, 2, 2, 0.6), 0 0 80px rgba(185, 2, 2, 0.2)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        'counter-anim': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'carbon': "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px), repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)",
        'radial-glow-red': 'radial-gradient(ellipse at center, rgba(185,2,2,0.2) 0%, transparent 70%)',
        'radial-glow-gold': 'radial-gradient(ellipse at center, rgba(201,162,39,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'luxury': '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
        'red-glow': '0 0 30px rgba(185,2,2,0.3), 0 0 60px rgba(185,2,2,0.1)',
        'gold-glow': '0 0 20px rgba(201,162,39,0.2), 0 0 40px rgba(201,162,39,0.08)',
        'inner-subtle': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
