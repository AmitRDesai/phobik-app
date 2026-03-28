import { colors } from '@/constants/colors';

export const TAG_COLORS = [
  {
    bg: 'rgba(255,77,148,0.15)',
    border: 'rgba(255,77,148,0.5)',
    text: colors.primary.pink,
  },
  {
    bg: 'rgba(255,215,0,0.15)',
    border: 'rgba(255,215,0,0.5)',
    text: colors.accent.yellow,
  },
  {
    bg: 'rgba(77,255,235,0.15)',
    border: 'rgba(77,255,235,0.5)',
    text: colors.accent.cyan,
  },
  {
    bg: 'rgba(195,181,253,0.15)',
    border: 'rgba(195,181,253,0.5)',
    text: colors.accent.purple,
  },
  {
    bg: 'rgba(0,255,148,0.15)',
    border: 'rgba(0,255,148,0.5)',
    text: colors.accent.mint,
  },
  {
    bg: 'rgba(255,142,83,0.15)',
    border: 'rgba(255,142,83,0.5)',
    text: colors.accent.orange,
  },
];

export type TagColor = (typeof TAG_COLORS)[number];

/** Deterministic color from tag name (fallback when no stored color) */
export function getTagColor(tag: string): TagColor {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]!;
}

/** Resolve a stored hex color back to the full TAG_COLOR entry */
export function getTagColorFromHex(hex: string): TagColor {
  const match = TAG_COLORS.find((c) => c.text === hex);
  if (match) return match;
  return { bg: `${hex}26`, border: `${hex}80`, text: hex };
}
