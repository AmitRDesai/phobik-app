import { Text } from '@/components/themed/Text';
import { IconChip } from '@/components/ui/IconChip';
import { colors, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

export type SelectionCardVariant = 'radio' | 'checkbox';

interface SelectionCardProps {
  label: string;
  description?: string;
  /**
   * Icon node, or a render-prop that receives the resolved icon color (the
   * tone accent if `tone` is set, otherwise a theme-aware neutral foreground).
   * Lets callers avoid hardcoding color values per option.
   */
  icon?: ReactNode | ((color: string) => ReactNode);
  /**
   * Accent hue for the icon chip. The card chrome itself stays brand-pink for
   * selection regardless of tone — tone only colors the icon + chip bg.
   */
  tone?: AccentHue;
  selected: boolean;
  onPress: () => void;
  variant: SelectionCardVariant;
  /** When true: rejects taps, renders at 40% opacity. */
  disabled?: boolean;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
}

export function SelectionCard({
  label,
  description,
  icon,
  tone,
  selected,
  onPress,
  variant,
  disabled,
  noHaptic,
}: SelectionCardProps) {
  const scheme = useScheme();
  const selectedInnerBg =
    scheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff';

  const handlePress = () => {
    if (disabled) return;
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole={variant === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      className={clsx(!disabled && 'active:scale-[0.98]')}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      <View
        className={clsx(
          'flex-row items-center gap-4 rounded-2xl border px-4 py-4',
          selected
            ? 'border-primary-pink'
            : 'border-foreground/10 bg-foreground/5',
        )}
        style={
          selected
            ? {
                backgroundColor: selectedInnerBg,
                boxShadow: `0 0 6px ${withAlpha(colors.primary.pink, 0.18)}`,
              }
            : undefined
        }
      >
        {icon ? (
          <IconChip size="md" shape="circle" tone={tone}>
            {icon}
          </IconChip>
        ) : null}
        <View className="flex-1">
          <Text weight="semibold" size="md">
            {label}
          </Text>
          {description && (
            <Text tone="secondary" size="sm" className="mt-0.5">
              {description}
            </Text>
          )}
        </View>
        {variant === 'radio' ? (
          <RadioIndicator selected={selected} />
        ) : (
          <CheckboxIndicator selected={selected} />
        )}
      </View>
    </Pressable>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className={clsx(
        'h-6 w-6 items-center justify-center rounded-full border-2',
        selected ? 'border-primary-pink' : 'border-foreground/25',
      )}
    >
      {selected && <View className="h-3 w-3 rounded-full bg-primary-pink" />}
    </View>
  );
}

function CheckboxIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className={clsx(
        'h-6 w-6 items-center justify-center rounded-full',
        selected ? 'bg-primary-pink' : 'bg-foreground/15',
      )}
    >
      {selected && <Ionicons name="checkmark-sharp" size={14} color="white" />}
    </View>
  );
}
