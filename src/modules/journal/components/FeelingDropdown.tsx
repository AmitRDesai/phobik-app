import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FEELING_OPTIONS } from '../data/options';

interface FeelingDropdownProps {
  value: string | null;
  onSelect: (feeling: string) => void;
  readOnly?: boolean;
}

const EXPANDED_HEIGHT = 160;

export function FeelingDropdown({
  value,
  onSelect,
  readOnly,
}: FeelingDropdownProps) {
  const scheme = useScheme();
  const [isOpen, setIsOpen] = useState(false);
  const height = useSharedValue(0);

  const toggle = useCallback(() => {
    if (readOnly) return;
    const next = !isOpen;
    setIsOpen(next);
    height.value = withTiming(next ? EXPANDED_HEIGHT : 0, { duration: 300 });
  }, [isOpen, readOnly]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const selectedLabel = value
    ? FEELING_OPTIONS.find((o) => o.value === value)?.label
    : null;

  return (
    <View className="mb-4">
      <Card
        variant="flat"
        onPress={toggle}
        className="flex-row items-center justify-between border-primary-pink/40"
        style={{
          boxShadow: `0 0 8px ${withAlpha(colors.primary['pink-soft'], 0.2)}`,
        }}
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons
            name="favorite"
            size={20}
            color={colors.primary.pink}
          />
          <Text size="md" weight="semibold">
            {selectedLabel || 'What are you feeling?'}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={24}
          color={foregroundFor(scheme, 1)}
        />
      </Card>

      <Animated.View style={animatedStyle}>
        <View className="mt-4 flex-row flex-wrap gap-2 px-1">
          {FEELING_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                setIsOpen(false);
                height.value = withTiming(0, { duration: 300 });
              }}
              className="rounded-xl border border-foreground/10 bg-foreground/5 p-3"
              style={{ width: '48%' }}
            >
              <Text
                size="sm"
                className={clsx(
                  'font-medium',
                  value === option.value
                    ? 'text-primary-pink'
                    : 'text-foreground/70',
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
