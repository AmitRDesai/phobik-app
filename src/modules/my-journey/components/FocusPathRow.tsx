import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import type { FocusPath } from '@/modules/my-journey/data/focus-paths';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';

interface FocusPathRowProps {
  path: FocusPath;
  onPress: () => void;
  /** Whether this row sits at the top of its container (skips the top divider). */
  isFirst?: boolean;
}

export function FocusPathRow({ path, onPress, isFirst }: FocusPathRowProps) {
  const scheme = useScheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Start ${path.label} path`}
      className="active:opacity-80"
    >
      <View
        className={clsx(
          'flex-row items-center gap-4 px-4 py-4',
          !isFirst && 'border-t border-foreground/5',
        )}
      >
        <View className="flex-1 gap-1">
          <Text size="md" weight="bold" tone="accent">
            {path.label}
          </Text>
          <Text size="xs" tone="secondary">
            {path.description}
          </Text>
        </View>
        <Ionicons
          name={path.icon}
          size={22}
          color={foregroundFor(scheme, 0.55)}
        />
      </View>
    </Pressable>
  );
}
