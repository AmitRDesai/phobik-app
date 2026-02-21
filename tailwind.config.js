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
          muted: '#CB90AD',
        },
        accent: {
          yellow: '#FFD700',
          'yellow-light': '#FFFD8C',
          purple: '#c3b5fd',
        },
        background: {
          dark: '#050505',
          charcoal: '#121212',
          input: '#1a1a1a',
          onboarding: '#1a0b12',
        },
        aura: {
          toggle: '#492236',
          border: '#68314d',
        },
        chakra: {
          'pink-light': '#FFB8D9',
          'pink-deep': '#FF2D85',
          yellow: '#FFE66D',
          violet: '#9D00FF',
          indigo: '#4B0082',
          blue: '#0099FF',
          green: '#00FF88',
          orange: '#FF8A00',
          red: '#FF3131',
        },
      },
    },
  },
  plugins: [],
};
