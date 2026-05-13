import { colors } from '@/constants/colors';
import { vars } from 'nativewind';

export type Variant = 'default';

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
        // Charcoal — matches the "body-based regulation" practice screen.
        '--variant-bg': '18 18 18',
        '--variant-card': '38 38 38',
        '--variant-fade': '18 18 18',
        '--variant-accent': '255 77 148',
      }),
      bgHex: '#121212',
      glow: {
        centerX: 0.5,
        centerY: 0.25,
        intensity: 0.5,
        radius: 0.35,
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
};
