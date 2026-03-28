import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between rounded-2xl p-4"
        style={{
          backgroundColor: withAlpha(colors.card.plum, 0.4),
          borderWidth: 1,
          borderColor: withAlpha(colors.primary['pink-soft'], 0.4),
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 0,
              blurRadius: 8,
              color: withAlpha(colors.primary['pink-soft'], 0.2),
            },
          ],
        }}
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons
            name="favorite"
            size={20}
            color={colors.primary.pink}
          />
          <Text className="text-base font-semibold text-white">
            {selectedLabel || 'What are you feeling?'}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={24}
          color="white"
        />
      </Pressable>

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
              className="rounded-xl border border-white/10 bg-white/5 p-3"
              style={{ width: '48%' }}
            >
              <Text
                className={`text-xs font-medium ${
                  value === option.value ? 'text-primary-pink' : 'text-white/70'
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
