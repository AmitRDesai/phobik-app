/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#FF2D85',
          'pink-light': '#FF71CD',
          'pink-dark': '#D11A66',
        },
        accent: {
          yellow: '#FFD700',
          'yellow-light': '#FFFD8C',
        },
        background: {
          dark: '#050505',
          charcoal: '#121212',
        },
        chakra: {
          'pink-light': '#FFB8D9',
          'pink-deep': '#FF2D85',
          yellow: '#FFE66D',
        },
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
