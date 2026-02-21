import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AuraFilterToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const TRACK_PADDING = 2;
const TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

export function AuraFilterToggle({ enabled, onToggle }: AuraFilterToggleProps) {
  const progress = useSharedValue(enabled ? 1 : 0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    progress.value = withTiming(enabled ? 0 : 1, { duration: 250 });
    onToggle();
  };

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.aura.toggle, colors.primary.pink],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRANSLATE_X }],
  }));

  return (
    <View className="rounded-2xl border border-aura-border bg-background-charcoal p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1">
          <Text className="text-base font-bold text-white">
            Apply Aura Filter
          </Text>
          <Text className="text-sm text-primary-muted">
            Enhance your photo with our signature glow
          </Text>
        </View>
        <Pressable onPress={handlePress}>
          <Animated.View
            style={[
              {
                width: TRACK_WIDTH,
                height: TRACK_HEIGHT,
                borderRadius: TRACK_HEIGHT / 2,
                padding: TRACK_PADDING,
                justifyContent: 'center',
              },
              trackStyle,
            ]}
          >
            <Animated.View
              style={[
                {
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: THUMB_SIZE / 2,
                  backgroundColor: 'white',
                },
                thumbStyle,
              ]}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
