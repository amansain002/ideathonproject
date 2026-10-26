/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Critique AI palette
        ink: '#0B0B0F',
        surface: '#16161D',
        surface2: '#1C1C26',
        edge: '#24242E',
        edge2: '#2E2E3A',
        neon: {
          purple: '#8B5CF6',
          blue: '#4F7CFF',
          emerald: '#10B981',
          amber: '#F59E0B',
          crimson: '#EF4444',
          sky: '#38BDF8',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(139,92,246,0.35)',
        'glow-blue': '0 0 20px rgba(79,124,255,0.35)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.35)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.35)',
        'glow-crimson': '0 0 20px rgba(239,68,68,0.45)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.9)' },
          '20%': { opacity: '1', transform: 'translateY(-2px) scale(1.05)' },
          '100%': { opacity: '0', transform: 'translateY(-36px) scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flutter: {
          '0%,100%': { transform: 'scaleY(1) scaleX(1)' },
          '50%': { transform: 'scaleY(0.78) scaleX(1.06)' },
        },
        auraPulse: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%,100%': { opacity: '0.2', transform: 'scale(0.6) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.15) rotate(90deg)' },
        },
        floatParticle: {
          '0%': { opacity: '0', transform: 'translateY(0) translateX(0)' },
          '40%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-22px) translateX(6px)' },
        },
        flicker: {
          '0%,100%': { opacity: '0.4', transform: 'scaleY(1)' },
          '50%': { opacity: '1', transform: 'scaleY(1.25)' },
        },
        flyIn: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.6) rotate(-8deg)' },
          '60%': { opacity: '1', transform: 'translateY(-8px) scale(1.05) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1) rotate(0deg)' },
        },
        ringExpand: {
          '0%': { opacity: '0.8', transform: 'scale(0.5)' },
          '100%': { opacity: '0', transform: 'scale(1.8)' },
        },
        tapScale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        barGrow: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-w, 100%)' },
        },
      },
      animation: {
        floatUp: 'floatUp 1.2s ease-out forwards',
        slideUp: 'slideUp 0.35s ease-out both',
        fadeIn: 'fadeIn 0.3s ease-out both',
        slideInRight: 'slideInRight 0.35s ease-out both',
        spinSlow: 'spinSlow 8s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        bob: 'bob 3.2s ease-in-out infinite',
        flutter: 'flutter 0.6s ease-in-out infinite',
        auraPulse: 'auraPulse 2.4s ease-in-out infinite',
        sparkle: 'sparkle 1.8s ease-in-out infinite',
        floatParticle: 'floatParticle 2.6s ease-out infinite',
        flicker: 'flicker 1.2s ease-in-out infinite',
        flyIn: 'flyIn 0.8s cubic-bezier(0.22,1,0.36,1) both',
        ringExpand: 'ringExpand 1.4s ease-out infinite',
        tapScale: 'tapScale 0.3s ease-out',
        barGrow: 'barGrow 0.8s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
