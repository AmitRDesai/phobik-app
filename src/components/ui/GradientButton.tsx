import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GradientButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function GradientButton({
  onPress,
  children,
  icon,
  disabled,
  loading,
}: GradientButtonProps) {
  const scale = useSharedValue(1);
  const isInteractionDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.4 : 1,
  }));

  const handlePressIn = () => {
    if (loading) return;
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (loading) return;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isInteractionDisabled}
      style={animatedStyle}
      className="w-full"
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 9999,
          paddingHorizontal: 32,
          paddingVertical: 16,
          minHeight: 56,
          justifyContent: 'center',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-center text-lg font-bold text-white">
              {children}
            </Text>
            {icon}
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}
