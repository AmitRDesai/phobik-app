import resolveConfig from 'tailwindcss/resolveConfig';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type CustomColors = {
  primary: {
    pink: string;
    'pink-light': string;
    'pink-dark': string;
  };
  accent: {
    yellow: string;
    'yellow-light': string;
  };
  background: {
    dark: string;
    charcoal: string;
  };
  chakra: {
    'pink-light': string;
    'pink-deep': string;
    yellow: string;
  };
};

type Colors = DefaultColors & CustomColors;

export const colors = fullConfig.theme.colors as Colors;
