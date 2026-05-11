import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';

export type ScrimDirection = 'bottom' | 'top';

export interface ImageScrimProps {
  /**
   * Which edge of the parent the scrim darkens.
   *   bottom (default) — fade from transparent at top to dark at bottom
   *   top              — fade from dark at top to transparent at bottom
   *
   * For both edges, stack two `ImageScrim`s.
   */
  direction?: ScrimDirection;
  /**
   * Final darkness alpha at the darkened edge. Range 0..1. Default: 0.7.
   * Bumped to 0.85 when the image carries small white text overlaid on
   * busy scenes.
   */
  strength?: number;
  /**
   * Where the gradient starts (0 = darken the whole image, 1 = no darken).
   * Default: 0.4 — the dark half is roughly the bottom 60%.
   */
  start?: number;
  /** Outer container className. The scrim is `absolute inset-0` by default. */
  className?: string;
}

/**
 * Darkening overlay for image-backed surfaces. Drop on top of an Image
 * inside an `overflow-hidden` parent — the gradient absolute-fills the
 * parent and fades from transparent to a near-black edge to ensure
 * overlaid text (titles, captions) has enough contrast.
 *
 * Uses `#0e0e0e` (slightly plum-tinted near-black) instead of pure black
 * so the scrim blends with the app's overall warm tonality. Always
 * `position: 'absolute', inset: 0` so the parent must be a positioned
 * container with `overflow: hidden`.
 */
export function ImageScrim({
  direction = 'bottom',
  strength = 0.7,
  start = 0.4,
  className,
}: ImageScrimProps) {
  const dark = `rgba(14,14,14,${Math.max(0, Math.min(1, strength))})`;
  const transparent = 'rgba(14,14,14,0)';
  const clampedStart = Math.max(0, Math.min(1, start));

  const colors: [string, string] =
    direction === 'bottom' ? [transparent, dark] : [dark, transparent];

  const locations: [number, number] =
    direction === 'bottom' ? [clampedStart, 1] : [0, 1 - clampedStart];

  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      pointerEvents="none"
      className={clsx('absolute inset-0', className)}
    />
  );
}
