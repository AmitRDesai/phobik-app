import resolveConfig from 'tailwindcss/resolveConfig';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type CustomColors = {
  primary: {
    pink: string;
    'pink-light': string;
    'pink-dark': string;
    muted: string;
  };
  accent: {
    yellow: string;
    'yellow-light': string;
    purple: string;
  };
  background: {
    dark: string;
    charcoal: string;
    input: string;
    onboarding: string;
  };
  aura: {
    toggle: string;
    border: string;
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
