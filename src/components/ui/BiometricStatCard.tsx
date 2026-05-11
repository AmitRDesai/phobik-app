import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { accentFor, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

export type BiometricStatCardSize = 'sm' | 'md';

export interface BiometricStatCardProps {
  /** Eyebrow / category label — uppercase caption. */
  label: string;
  /** Main value — large numeric or short string. */
  value: string;
  /** Optional unit suffix shown next to the value (BPM, ms, %). */
  unit?: string;
  /** Render-prop icon — receives the resolved tone color. */
  icon?: (color: string) => React.ReactNode;
  /** Optional accent tone for the icon + unit suffix. */
  tone?: AccentHue;
  /** sm = compact (px-4 py-3); md = prominent (px-5 py-4). */
  size?: BiometricStatCardSize;
  /** If provided, the card becomes tappable. */
  onPress?: () => void;
  /** Stale / missing data — shows the placeholder treatment. */
  isStale?: boolean;
  accessibilityLabel?: string;
  className?: string;
}

const SIZE_STYLES: Record<
  BiometricStatCardSize,
  { container: string; valueSize: 'lg' | 'h2'; gap: string }
> = {
  sm: { container: 'px-4 py-3', valueSize: 'lg', gap: 'gap-2' },
  md: { container: 'px-5 py-4', valueSize: 'h2', gap: 'gap-2.5' },
};

export function BiometricStatCard({
  label,
  value,
  unit,
  icon,
  tone,
  size = 'sm',
  onPress,
  isStale,
  accessibilityLabel,
  className,
}: BiometricStatCardProps) {
  const scheme = useScheme();
  const sizeStyles = SIZE_STYLES[size];
  const accent = tone ? accentFor(scheme, tone) : undefined;

  const containerClass = clsx(
    'rounded-[28px] border border-foreground/10 bg-foreground/5',
    sizeStyles.container,
    sizeStyles.gap,
    onPress && 'active:opacity-80',
    className,
  );

  const content = (
    <>
      <View className="flex-row items-center gap-1.5">
        {icon
          ? icon(
              accent ??
                (scheme === 'dark'
                  ? 'rgba(255,255,255,0.55)'
                  : 'rgba(0,0,0,0.55)'),
            )
          : null}
        <Text size="xs" treatment="caption" weight="bold" tone="tertiary">
          {label}
        </Text>
      </View>

      <View className="flex-row items-baseline gap-1">
        <Text
          size={sizeStyles.valueSize}
          weight="bold"
          tone={isStale ? 'tertiary' : 'primary'}
        >
          {isStale ? '—' : value}
        </Text>
        {unit ? (
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            tone={isStale ? 'tertiary' : 'secondary'}
            style={!isStale && accent ? { color: accent } : undefined}
          >
            {unit}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ?? `${label}: ${value}${unit ? ` ${unit}` : ''}`
        }
        className={containerClass}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClass}>{content}</View>;
}
