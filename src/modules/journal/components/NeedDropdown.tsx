import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NEED_OPTIONS } from '../data/options';

interface NeedDropdownProps {
  value: string | null;
  onSelect: (need: string) => void;
  readOnly?: boolean;
}

const EXPANDED_HEIGHT = 110;

export function NeedDropdown({ value, onSelect, readOnly }: NeedDropdownProps) {
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
    ? NEED_OPTIONS.find((o) => o.value === value)?.label
    : null;

  return (
    <View className="mb-6">
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between rounded-2xl border border-accent-yellow/40 bg-surface-elevated p-4"
        style={{
          boxShadow: `0 0 8px ${withAlpha(colors.accent.yellow, 0.2)}`,
        }}
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons
            name="auto-awesome"
            size={20}
            color={colors.accent.yellow}
          />
          <Text className="text-base font-semibold text-foreground">
            {selectedLabel || 'What are you needing?'}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={24}
          color={foregroundFor(scheme, 1)}
        />
      </Pressable>

      <Animated.View style={animatedStyle}>
        <View className="mt-4 flex-row flex-wrap gap-2 px-1">
          {NEED_OPTIONS.map((option) => (
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
                className={`text-xs font-medium ${
                  value === option.value
                    ? 'text-accent-yellow'
                    : 'text-foreground/70'
                }`}
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
