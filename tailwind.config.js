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
          'pink-soft': '#FF4D97',
          muted: '#CB90AD',
        },
        accent: {
          yellow: '#FFD700',
          'yellow-light': '#FFFD8C',
          purple: '#c3b5fd',
          cyan: '#4DFFEB',
          gold: '#FFD640',
          info: '#00D4FF',
          mint: '#00FF94',
          orange: '#ff8e53',
        },
        background: {
          dark: '#050505',
          charcoal: '#121212',
          input: '#1a1a1a',
          onboarding: '#1a0b12',
          dashboard: '#120812',
        },
        card: {
          plum: '#2D152D',
          dark: '#1a1318',
          elevated: '#1e1e1e',
        },
        aura: {
          toggle: '#492236',
          border: '#68314d',
        },
        status: {
          success: '#0bda8e',
          danger: '#ff5d5d',
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
