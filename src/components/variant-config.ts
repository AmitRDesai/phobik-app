import { colors } from '@/constants/colors';
import { vars } from 'nativewind';

export type Variant = 'default' | 'auth' | 'onboarding';

export interface VariantGlow {
  centerX: number;
  centerY: number;
  intensity: number;
  radius: number;
  startColor: string;
  endColor: string;
}

interface VariantBundle {
  /** RGB token overrides for `bg-variant-*`, `text-variant-*` classNames. */
  vars: ReturnType<typeof vars>;
  /** Hex value for the screen background (used by SystemBars, fade gradients). */
  bgHex: string;
  /** Glow config; null for light mode (no radial glow on light backgrounds). */
  glow: VariantGlow | null;
}

const NULL_GLOW = null;

/**
 * Per-variant token bundles, indexed by theme scheme.
 *
 * Dark mode uses the existing app palette and a per-variant radial glow.
 * Light mode uses tinted off-whites with no glow.
 *
 * Token values are RGB triplets so Tailwind's `<alpha-value>` works at the
 * className site (e.g. `bg-variant-card/80`).
 */
export const variantConfig: Record<
  Variant,
  Record<'light' | 'dark', VariantBundle>
> = {
  default: {
    dark: {
      vars: vars({
        '--variant-bg': '18 8 18',
        '--variant-card': '26 19 24',
        '--variant-fade': '18 8 18',
        '--variant-accent': '255 77 148',
      }),
      bgHex: '#120812',
      glow: {
        centerX: 0.5,
        centerY: 0.25,
        intensity: 0.5,
        radius: 0.5,
        startColor: colors.primary.pink,
        endColor: colors.accent.yellow,
      },
    },
    light: {
      vars: vars({
        '--variant-bg': '250 250 250',
        '--variant-card': '255 255 255',
        '--variant-fade': '250 250 250',
        '--variant-accent': '255 77 148',
      }),
      bgHex: '#FAFAFA',
      glow: NULL_GLOW,
    },
  },
  auth: {
    dark: {
      vars: vars({
        '--variant-bg': '5 5 5',
        '--variant-card': '26 19 24',
        '--variant-fade': '5 5 5',
        '--variant-accent': '255 77 148',
      }),
      bgHex: '#050505',
      glow: {
        centerX: 0.5,
        centerY: 0.3,
        intensity: 0.5,
        radius: 0.5,
        startColor: colors.primary.pink,
        endColor: colors.accent.yellow,
      },
    },
    light: {
      vars: vars({
        '--variant-bg': '250 250 250',
        '--variant-card': '255 255 255',
        '--variant-fade': '250 250 250',
        '--variant-accent': '255 77 148',
      }),
      bgHex: '#FAFAFA',
      glow: NULL_GLOW,
    },
  },
  onboarding: {
    dark: {
      vars: vars({
        '--variant-bg': '26 11 18',
        '--variant-card': '45 21 45',
        '--variant-fade': '26 11 18',
        '--variant-accent': '255 142 83',
      }),
      bgHex: '#1a0b12',
      glow: {
        centerX: 0.5,
        centerY: 0.25,
        intensity: 0.6,
        radius: 0.5,
        startColor: colors.chakra.orange,
        endColor: colors.primary.pink,
      },
    },
    light: {
      vars: vars({
        '--variant-bg': '255 245 240',
        '--variant-card': '255 232 218',
        '--variant-fade': '255 245 240',
        '--variant-accent': '255 142 83',
      }),
      bgHex: '#FFF5F0',
      glow: NULL_GLOW,
    },
  },
};
