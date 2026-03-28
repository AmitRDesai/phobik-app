import { colors, withAlpha } from '@/constants/colors';

export const TAG_COLORS = [
  {
    bg: withAlpha(colors.primary['pink-soft'], 0.15),
    border: withAlpha(colors.primary['pink-soft'], 0.5),
    text: colors.primary.pink,
  },
  {
    bg: withAlpha(colors.accent.yellow, 0.15),
    border: withAlpha(colors.accent.yellow, 0.5),
    text: colors.accent.yellow,
  },
  {
    bg: withAlpha(colors.accent.cyan, 0.15),
    border: withAlpha(colors.accent.cyan, 0.5),
    text: colors.accent.cyan,
  },
  {
    bg: withAlpha(colors.accent.purple, 0.15),
    border: withAlpha(colors.accent.purple, 0.5),
    text: colors.accent.purple,
  },
  {
    bg: withAlpha(colors.accent.mint, 0.15),
    border: withAlpha(colors.accent.mint, 0.5),
    text: colors.accent.mint,
  },
  {
    bg: withAlpha(colors.accent.orange, 0.15),
    border: withAlpha(colors.accent.orange, 0.5),
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
