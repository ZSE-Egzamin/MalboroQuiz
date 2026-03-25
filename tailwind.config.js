// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specyficzny odcień czerwieni zbliżony do Marlboro
        'marlboro-red': '#b1040e',
      },
      keyframes: {
        'smoke-rise': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-60px) scale(2.0)', opacity: '0' }, // Wyżej i szerzej
        },
        'burn-out': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
          '50%': { opacity: '0.5', filter: 'blur(2px)' },
          '100%': { opacity: '0', transform: 'scale(0.8) translateY(-20px)', filter: 'blur(4px)' },
        }
      },
      animation: {
        'smoke-dense': 'smoke-rise-dense 2s infinite ease-out',
        'burn': 'burn-out 5s linear forwards',
      }
    },
  },
  plugins: [],
}