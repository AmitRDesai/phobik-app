import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Slider } from '@/components/ui/Slider';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Pressable } from 'react-native';

import type { EmotionalFamily } from '../data/emotionalFamilies';

interface FamilyIntensityCardProps {
  family: EmotionalFamily;
  selected: boolean;
  /** Current intensity 1–10. */
  intensity: number;
  onToggle: () => void;
  onIntensityChange: (value: number) => void;
}

const DEFAULT_INTENSITY = 5;

export function FamilyIntensityCard({
  family,
  selected,
  intensity,
  onToggle,
  onIntensityChange,
}: FamilyIntensityCardProps) {
  const scheme = useScheme();
  const toneColor = accentFor(scheme, family.tone);

  return (
    <Card
      variant="raised"
      size="md"
      className="gap-4"
      // Card already renders a constant 1px border; override only its color on
      // select (inline style beats the className border, and width is unchanged
      // so there's no layout shift). Unselected falls back to Card's neutral.
      style={selected ? { borderColor: colors.primary.pink } : undefined}
    >
      {/* Header — tap to toggle selection */}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        onPress={onToggle}
        className="flex-row items-center gap-3"
      >
        <IconChip size="md" tone={family.tone}>
          {(color) => <Ionicons name={family.icon} size={20} color={color} />}
        </IconChip>
        <View className="flex-1 gap-0.5">
          <Text size="md" weight="bold">
            {family.label}
          </Text>
          <Text size="xs" tone="secondary">
            {family.subFeelings.join(', ')}
          </Text>
        </View>
        <View
          className={clsx(
            'size-6 items-center justify-center rounded-full border',
            selected ? 'border-primary-pink' : 'border-foreground/25',
          )}
          style={
            selected
              ? { backgroundColor: withAlpha(toneColor, 0.18) }
              : undefined
          }
        >
          {selected && (
            <Ionicons
              name="checkmark"
              size={14}
              color={accentFor(scheme, 'pink')}
            />
          )}
        </View>
      </Pressable>

      {/* Intensity slider */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text size="xs" treatment="caption" tone="secondary">
            How strong are you feeling this?
          </Text>
          <Text size="sm" weight="bold" style={{ color: toneColor }}>
            {intensity}
          </Text>
        </View>
        <Slider
          value={intensity || DEFAULT_INTENSITY}
          min={1}
          max={10}
          step={1}
          tone={family.tone}
          onValueChange={onIntensityChange}
        />
        <View className="flex-row items-center justify-between">
          <Text size="xs" treatment="caption" tone="tertiary">
            Low
          </Text>
          <Text size="xs" treatment="caption" tone="tertiary">
            High
          </Text>
        </View>
      </View>
    </Card>
  );
}
