import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export type SegmentedProgressSize = 'sm' | 'md';

const SIZE_HEIGHT: Record<SegmentedProgressSize, number> = {
  sm: 4,
  md: 5,
};

export interface SegmentedProgressProps {
  /** Total number of segments. */
  total: number;
  /** Number of completed segments. Clamped to [0, total]. */
  completed: number;
  /** Bar thickness. Default: `md` (5px). */
  size?: SegmentedProgressSize;
  /** Outer container className for margins / padding. */
  className?: string;
}

/**
 * Segmented gradient progress bar. Renders `total` segments side-by-side;
 * the first `completed` segments share one continuous brand gradient
 * (pink → warm-orange → yellow), and the remaining segments are neutral
 * `foreground/10` hairlines.
 *
 * Use for step-flow progress where each step counts as a discrete
 * segment (onboarding steps, micro-challenge progression). For continuous
 * progress (0-1 fill) use ProgressBar; for indicator dots use ProgressDots.
 */
export function SegmentedProgress({
  total,
  completed,
  size = 'md',
  className,
}: SegmentedProgressProps) {
  const height = SIZE_HEIGHT[size];
  const done = Math.max(0, Math.min(total, completed));
  const remaining = total - done;

  return (
    <View className={clsx('flex-row gap-1.5', className)}>
      {done > 0 ? (
        <MaskedView
          style={{ flex: done, flexDirection: 'row', height }}
          maskElement={
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: done }, (_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: 9999,
                    backgroundColor: 'black',
                  }}
                />
              ))}
            </View>
          }
        >
          <LinearGradient
            colors={[
              colors.primary.pink,
              colors.accent.orange,
              colors.accent.yellow,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, height }}
          />
        </MaskedView>
      ) : null}
      {Array.from({ length: remaining }, (_, i) => (
        <View
          key={done + i}
          className="flex-1 rounded-full bg-foreground/10"
          style={{ height }}
        />
      ))}
    </View>
  );
}
