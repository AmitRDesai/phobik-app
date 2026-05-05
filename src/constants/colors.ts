import resolveConfig from 'tailwindcss/resolveConfig';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type CustomColors = {
  primary: {
    pink: string;
    'pink-light': string;
    'pink-dark': string;
    'pink-soft': string;
    muted: string;
  };
  accent: {
    yellow: string;
    purple: string;
    cyan: string;
    gold: string;
    info: string;
    mint: string;
    orange: string;
  };
  background: {
    dark: string;
    charcoal: string;
    input: string;
    onboarding: string;
    dashboard: string;
  };
  card: {
    plum: string;
    dark: string;
    elevated: string;
  };
  aura: {
    toggle: string;
    border: string;
  };
  status: {
    success: string;
    danger: string;
  };
  gradient: {
    'warm-orange': string;
    'bright-orange': string;
    'hot-pink': string;
    'light-gold': string;
    'orange-red': string;
    'soft-pink': string;
    magenta: string;
    amber: string;
  };
  chakra: {
    yellow: string;
    violet: string;
    indigo: string;
    blue: string;
    green: string;
    orange: string;
    red: string;
  };
};

type Colors = DefaultColors & CustomColors;

export const colors = fullConfig.theme.colors as Colors;

/** Convert a hex color to rgba with the given opacity (0–1) */
export function withAlpha(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * Theme-aware foreground color for JS-string color props (Ionicons, SVG strokes,
 * placeholderTextColor) where NativeWind classes can't reach. Returns white in
 * dark mode and near-black in light mode, at the given opacity. Pass an
 * `{ dark, light }` object when the two modes need different opacities (common
 * because soft-black on white needs less alpha than soft-white on dark).
 */
export function foregroundFor(
  scheme: 'dark' | 'light',
  opacity: number | { dark: number; light: number } = 1,
): string {
  const o = typeof opacity === 'number' ? opacity : opacity[scheme];
  return scheme === 'dark' ? `rgba(255,255,255,${o})` : `rgba(0,0,0,${o})`;
}

/** Opacity variants for icon/SVG props where className isn't supported */
export const alpha = {
  white03: 'rgba(255,255,255,0.03)',
  white05: 'rgba(255,255,255,0.05)',
  white08: 'rgba(255,255,255,0.08)',
  white10: 'rgba(255,255,255,0.1)',
  white15: 'rgba(255,255,255,0.15)',
  white20: 'rgba(255,255,255,0.2)',
  white30: 'rgba(255,255,255,0.3)',
  white35: 'rgba(255,255,255,0.35)',
  white40: 'rgba(255,255,255,0.4)',
  white50: 'rgba(255,255,255,0.5)',
  white60: 'rgba(255,255,255,0.6)',
  white70: 'rgba(255,255,255,0.7)',
  white80: 'rgba(255,255,255,0.8)',
  white90: 'rgba(255,255,255,0.9)',
  black70: 'rgba(0,0,0,0.7)',
  black80: 'rgba(0,0,0,0.8)',
  black85: 'rgba(0,0,0,0.85)',
  black95: 'rgba(0,0,0,0.95)',
  // Mid-gray that reads as a soft "muted" tone in both light and dark mode
  // — useful for placeholder text and decorative icons that shouldn't flip
  // with the theme.
  neutral55: 'rgba(127,127,127,0.55)',
  neutral60: 'rgba(127,127,127,0.6)',
} as const;
