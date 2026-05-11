import { accentFor, colors, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

const SIZE_HEIGHT: Record<ProgressBarSize, number> = {
  sm: 4,
  md: 6,
  lg: 10,
};

export interface ProgressBarProps {
  /** Normalized 0..1 progress. Clamped if out of range. */
  progress: number;
  /** Bar thickness. Default: `md` (6px). */
  size?: ProgressBarSize;
  /**
   * Fill tone (single-color mode). Default: `pink`. Ignored when
   * `gradient` is true.
   */
  tone?: AccentHue;
  /** When true, the filled portion uses the brand pink→yellow gradient. */
  gradient?: boolean;
  /** Outer container className for layout (width, margins). */
  className?: string;
}

/**
 * Horizontal continuous progress indicator. For step-based progress (1 of 5),
 * use ProgressDots instead — ProgressBar is for continuous values like audio
 * playback, upload progress, breathing-flow countdowns.
 */
export function ProgressBar({
  progress,
  size = 'md',
  tone = 'pink',
  gradient,
  className,
}: ProgressBarProps) {
  const scheme = useScheme();
  const clamped = Math.max(0, Math.min(1, isFinite(progress) ? progress : 0));
  const height = SIZE_HEIGHT[size];
  const widthPct = `${clamped * 100}%` as const;

  return (
    <View
      className={clsx(
        'w-full overflow-hidden rounded-full bg-foreground/10',
        className,
      )}
      style={{ height }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      {gradient ? (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ height: '100%', width: widthPct, borderRadius: 9999 }}
        />
      ) : (
        <View
          style={{
            height: '100%',
            width: widthPct,
            borderRadius: 9999,
            backgroundColor: accentFor(scheme, tone),
          }}
        />
      )}
    </View>
  );
}
