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
    'yellow-light': string;
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
  chakra: {
    'pink-light': string;
    'pink-deep': string;
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

/** Opacity variants for icon/SVG props where className isn't supported */
export const alpha = {
  white15: 'rgba(255,255,255,0.15)',
  white20: 'rgba(255,255,255,0.2)',
  white30: 'rgba(255,255,255,0.3)',
  white40: 'rgba(255,255,255,0.4)',
  white50: 'rgba(255,255,255,0.5)',
  white60: 'rgba(255,255,255,0.6)',
  white70: 'rgba(255,255,255,0.7)',
  white80: 'rgba(255,255,255,0.8)',
} as const;
