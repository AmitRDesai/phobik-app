import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import {
  accentFor,
  colors,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingVariant = 'gradient' | 'tinted';

export interface RatingProps {
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
  /** Caption shown under the leftmost option. */
  startLabel?: string;
  /** Caption shown under the rightmost option. */
  endLabel?: string;
  /**
   * Selected-option visual.
   *   gradient (default) — brand pink→yellow gradient + glow, white text.
   *   tinted             — accent-tinted bg + accent text + accent border;
   *                        honors `tone`.
   */
  variant?: RatingVariant;
  /** Tone for `tinted` variant (ignored when `gradient`). Default: `pink`. */
  tone?: AccentHue;
  /** Button size. Default: `md`. */
  size?: RatingSize;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
  className?: string;
}

interface SizeStyle {
  dim: number;
  text: 'md' | 'h3' | 'h2';
}

const SIZES: Record<RatingSize, SizeStyle> = {
  sm: { dim: 40, text: 'md' },
  md: { dim: 56, text: 'h3' },
  lg: { dim: 72, text: 'h2' },
};

/**
 * Numeric rating scale — circular buttons from `min` to `max`. Use for
 * Likert-style answers (mood / pain / pivot-point self-check-ins), NPS
 * scores, and any single-pick numeric range where each integer should be
 * visible at once.
 *
 * For continuous ranges where the exact stop doesn't matter, reach for
 * Slider. For category picks, use SelectionCard / SegmentedControl /
 * ChipSelect depending on count.
 */
export function Rating({
  min,
  max,
  value,
  onChange,
  startLabel,
  endLabel,
  variant = 'gradient',
  tone = 'pink',
  size = 'md',
  noHaptic,
  className,
}: RatingProps) {
  const scheme = useScheme();
  const accent = accentFor(scheme, tone);
  const sz = SIZES[size];
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handlePress = (option: number) => {
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(option);
  };

  return (
    <View
      className={clsx('flex-row items-start justify-between gap-2', className)}
    >
      {options.map((option, index) => {
        const isSelected = value === option;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <View key={option} className="flex-1 items-center gap-3">
            <Pressable
              onPress={() => handlePress(option)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Rating ${option} of ${max}`}
              hitSlop={4}
              className="items-center justify-center"
              style={{ width: sz.dim, height: sz.dim }}
            >
              {isSelected ? (
                variant === 'gradient' ? (
                  <LinearGradient
                    colors={[colors.primary.pink, colors.accent.yellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: sz.dim,
                      height: sz.dim,
                      borderRadius: sz.dim / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0px 0px 20px ${withAlpha(colors.primary.pink, 0.4)}`,
                    }}
                  >
                    <Text size={sz.text} tone="inverse" weight="bold">
                      {option}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    className="items-center justify-center rounded-full border"
                    style={{
                      width: sz.dim,
                      height: sz.dim,
                      borderRadius: sz.dim / 2,
                      backgroundColor: withAlpha(accent, 0.15),
                      borderColor: withAlpha(accent, 0.5),
                    }}
                  >
                    <Text
                      size={sz.text}
                      weight="bold"
                      style={{ color: accent }}
                    >
                      {option}
                    </Text>
                  </View>
                )
              ) : (
                <View
                  className="items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]"
                  style={{
                    width: sz.dim,
                    height: sz.dim,
                    borderRadius: sz.dim / 2,
                  }}
                >
                  <Text
                    size={sz.text}
                    weight="bold"
                    className="text-foreground/60"
                  >
                    {option}
                  </Text>
                </View>
              )}
            </Pressable>
            {isFirst && startLabel ? (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                align="center"
                className="tracking-wider text-foreground/45"
              >
                {startLabel}
              </Text>
            ) : null}
            {isLast && endLabel ? (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                align="center"
                className="tracking-wider text-foreground/45"
              >
                {endLabel}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
