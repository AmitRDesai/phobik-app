/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ---- Theme-aware semantic tokens (resolved at runtime via vars() in ThemeProvider) ----
        // Use with opacity: `bg-surface`, `text-foreground/55`, `border-border/10`
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        'surface-input': 'rgb(var(--color-surface-input) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        // ---- Variant-aware tokens (set per-Screen by VariantContext in Phase 2) ----
        'variant-bg': 'rgb(var(--variant-bg) / <alpha-value>)',
        'variant-card': 'rgb(var(--variant-card) / <alpha-value>)',
        'variant-fade': 'rgb(var(--variant-fade) / <alpha-value>)',
        'variant-accent': 'rgb(var(--variant-accent) / <alpha-value>)',
        // ---- Brand tokens (theme-independent — same hex in light + dark) ----
        primary: {
          pink: '#FF4D94',
          'pink-light': '#FF71CD',
          'pink-dark': '#D11A66',
          'pink-soft': '#FF4D97',
          muted: '#CB90AD',
        },
        accent: {
          yellow: '#FFD700',
          purple: '#c3b5fd',
          cyan: '#4DFFEB',
          gold: '#FFD640',
          info: '#00D4FF',
          mint: '#00FF94',
          orange: '#ff8e53',
        },
        // ---- Legacy literal-color tokens (kept for backward compat during migration) ----
        // New code should prefer semantic tokens (surface, foreground, etc.) above.
        background: {
          dark: '#050505',
          charcoal: '#121212',
        },
        status: {
          success: '#0bda8e',
          danger: '#ff5d5d',
          warning: '#f59e0b',
        },
        gradient: {
          'warm-orange': '#FF8D5C',
          'bright-orange': '#FF8C37',
          'hot-pink': '#FF3B8E',
          'light-gold': '#FFD64D',
          'soft-pink': '#ff4b8b',
          magenta: '#f4258c',
          amber: '#ffb800',
        },
        chakra: {
          yellow: '#FFE66D',
          violet: '#9D00FF',
          indigo: '#4B0082',
          blue: '#0099FF',
          green: '#00FF88',
          orange: '#FF8A00',
          red: '#FF3131',
        },
      },
      spacing: {
        // Named layout tokens — self-documenting at usage sites
        'screen-x': '24px',
        'screen-y': '16px',
        section: '32px',
        'card-x': '20px',
        'card-y': '20px',
        'control-y': '14px',
      },
    },
  },
  plugins: [],
};
